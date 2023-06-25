import { NextApiRequest, NextApiResponse } from "next";
import { times } from "../../../../app/data";
import { PrismaClient, Table } from "@prisma/client";
import { findAvailableTables } from "../../../../services/findAvailableTables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!day || !time || !partySize) {
      return res.status(400).json({ errorMessage: "Invalid data provided" });
    }

    const availableTablesService = await findAvailableTables({
      slug,
      day,
      time,
      res,
    });

    const availabilities = availableTablesService?.searchTimesWithTables
      .map((t: any) => {
        const sumSeats = t.tables.reduce((sum: number, table: Table) => {
          return sum + table.seats;
        }, 0);

        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((availability: any) => {
        const timIsAfterOpeningHour =
          new Date(`${day}T${availability.time}`) >=
          new Date(`${day}T${availableTablesService?.restaurant.open_time}`);
        const timIsBeforeClosingHour =
          new Date(`${day}T${availability.time}`) <=
          new Date(`${day}T${availableTablesService?.restaurant.close_time}`);

        return timIsAfterOpeningHour && timIsBeforeClosingHour;
      });

    return res.json({
      availabilities,
    });
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-01-01&time=20:00:00.000Z&partySize=4
