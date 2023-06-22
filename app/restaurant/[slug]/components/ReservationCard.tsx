"use client";

import DatePicker from "react-datepicker";
import { partySize, times } from "../../../data";
import { useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

function ReservationCard({
  openTime,
  closeTime,
}: {
  openTime: string;
  closeTime: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
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

  return (
    <div className="w-[27%] relative text-reg">
      <div className="fixed w-[15%] bg-white rounded p-3 shadow">
        <div className="text-center border-b pb-2 font-bold">
          <h4 className="mr-7 text-lg">Make a Reservation</h4>
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="">Party size</label>
          <select name="" className="py-3 border-b font-light" id="">
            {partySize.map(({ value, label }) => (
              <option value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-between flex-col">
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              className="py-3 border-b font-light text-reg w-24"
              dateFormat="MMMM d"
              wrapperClassName="w-[48%]"
            />
            <input type="text" className="py-3 border-b font-light w-28" />
          </div>
          <div className="flex flex-col w-[48%]">
            <label htmlFor="">Time</label>
            <select name="" id="" className="py-3 border-b font-light">
              {filterTimesByRestaurantOpenWindow().map(
                ({ time, displayTime }) => (
                  <option value={time}>{displayTime}</option>
                )
              )}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <button className="bg-red-600 rounded w-full px-4 text-white font-bold h-16">
            Find a Time
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationCard;
