import { PrismaClient, Table } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/findAvailableTables";
import validatior from "validator";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validatior.isEmail(bookerEmail),
        errorMessage: "Email is invalid",
      },
      {
        valid: validatior.isLength(bookerFirstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validatior.isLength(bookerLastName, { min: 1, max: 20 }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validatior.isMobilePhone(bookerPhone),
        errorMessage: "Phone number is invalid",
      },
      {
        valid: validatior.isLength(bookerOccasion, { min: 1 }),
        errorMessage: "Occasion is invalid",
      },
      {
        valid: validatior.isLength(bookerRequest, { min: 1 }),
        errorMessage: "Request is not valid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) return res.status(400).json({ errorMessage: errors[0] });

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
    });

    if (!restaurant) {
      return res.status(400).json({ errorMessage: "Invalid data provided" });
    }

    const currentTime = new Date(`${day}T${time}`);
    const openTime = new Date(`${day}T${restaurant.open_time}`);
    const closeTime = new Date(`${day}T${restaurant.close_time}`);

    if (currentTime < openTime || currentTime > closeTime) {
      return res
        .status(400)
        .json({ errorMessage: "Restaurant is not open at that time" });
    }

    const availableTablesService = await findAvailableTables({
      slug,
      day,
      time,
      res,
    });

    const searchTimeWithTables =
      availableTablesService?.searchTimesWithTables.find((t: any): boolean => {
        return (
          t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
        );
      });

    if (!searchTimeWithTables) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book." });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithTables.tables.forEach((table: Table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();

          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();

          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();

          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();

          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    if (!availableTablesService?.restaurant?.id) {
      return res
        .status(400)
        .json({ errorMessage: "No availability, cannot book." });
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize),
        booking_time: new Date(`${day}T${time}`),
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        restaurant_id: +availableTablesService?.restaurant?.id,
      },
    });

    const bookingsOnTablesData = tablesToBook.map((table_id) => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.json({
      booking,
      tablesToBook,
      searchTimeWithTables,
      searchTimesWithTables: availableTablesService?.searchTimesWithTables,
    });
  }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-01-01&time=20:00:00.000Z&partySize=4
