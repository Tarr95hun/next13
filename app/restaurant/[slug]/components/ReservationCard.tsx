"use client";

import DatePicker from "react-datepicker";
import { partySize as partySizes, times } from "../../../data";
import { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import useAvailibility from "../../../../hooks/useAvailibility";
import {
  convertToDisplayTime,
  Time,
} from "../../../../utils/convertToDisplayTime";

function ReservationCard({
  openTime,
  closeTime,
  slug,
}: {
  openTime: string;
  closeTime: string;
  slug: string;
}) {
  const { data, error, loading, fetchAvailabilities } = useAvailibility();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>(openTime);
  const [partySize, setPartySize] = useState<number>(2);
  const [day, setDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setDay(date.toISOString().split("T")[0]);

      return setSelectedDate(date);
    }

    return setSelectedDate(null);
  };

  const filterTimesByRestaurantOpenWindow = () => {
    // openTime = 14:30:00.000Z  ---> 2:30 PM
    // closeTime = 01:00:00.000Z  ---> 9:30 PM
    const timesWithinWindow: typeof times = [];

    let isWithinWindow = false;

    times.forEach((time) => {
      if (!isWithinWindow && time.time === openTime) {
        isWithinWindow = true;
      }

      if (isWithinWindow) {
        timesWithinWindow.push(time);
      }

      if (time.time === closeTime) {
        isWithinWindow = false;
      }
    });

    return timesWithinWindow;
  };

  const handleClick = () => {
    fetchAvailabilities({ slug, day, time, partySize });
  };

  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[20%] min-w-[250px] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select
            name=""
            className="py-3 border-b font-light"
            id=""
            value={partySize}
            onChange={(e) => setPartySize(+e.target.value)}
          >
            {partySizes.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="py-3 border-b font-light text-reg w-24"
              dateFormat="MMMM d"
              wrapperClassName="w-[48%]"
            />
            <input type="text" className="py-3 border-b font-light w-24" />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select
              name=""
              id=""
              className="py-3 border-b font-light"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {filterTimesByRestaurantOpenWindow().map(
                ({ time, displayTime }) => (
                  <option value={time}>{displayTime}</option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button
            className="bg-red-600 rounded w-full px-4 text-white font-bold h-16"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : "Find a Time"}
          </button>
        </div>
        {data && data?.length ? (
          <div className="mt-4">
            <p className="text-reg">
              <div className="flex flex-wrap mt-2">
                {data.map((time) => {
                  return time?.available ? (
                    <Link
                      href={`/reserve/${slug}?date=${day}T${time?.time}&partySize=${partySize}`}
                      className="bg-red-600 cursor-pointer p-2 w-24 text-center text-white mb-3 rounded mr-3"
                    >
                      <p className="text-sm font-bold">
                        {convertToDisplayTime(time?.time as Time)}
                      </p>
                    </Link>
                  ) : (
                    <p className="bg-gray-300 p-2 w-24 mb-3 rounded mr-3 text-white text-sm font-bold text-center cursor-not-allowed">
                      {convertToDisplayTime(time?.time as Time)}
                    </p>
                  );
                })}
              </div>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ReservationCard;
