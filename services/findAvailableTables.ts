import { PrismaClient, Table } from "@prisma/client";
import { times } from "../app/data";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  time,
  day,
  res,
  slug,
}: {
  time: string;
  day: string;
  res: NextApiResponse;
  slug: string;
}): Promise<{
  searchTimesWithTables: any;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
    id: number;
  };
} | void> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
      id: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const searchTimes = times.find((t) => {
    return t.time === time;
  })?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    const key = booking.booking_time.toISOString();
    const value = booking.tables.reduce((obj, table) => {
      return { ...obj, [table.table_id]: true };
    }, {});

    bookingTablesObj[key] = value;
  });

  const { tables } = restaurant;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }

      return true;
    });
  });

  if (!searchTimesWithTables) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  return { searchTimesWithTables, restaurant };
};
