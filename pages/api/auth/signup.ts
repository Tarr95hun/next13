import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import validatior from "validator";
import { IInputs } from "../../../app/components/AuthModal/components/AuthInputs";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } =
      req.body as IInputs;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validatior.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name is invalid",
      },
      {
        valid: validatior.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validatior.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validatior.isMobilePhone(phone),
        errorMessage: "Phone number is invalid",
      },
      {
        valid: validatior.isLength(city, { min: 1 }),
        errorMessage: "City is invalid",
      },
      {
        valid: validatior.isStrongPassword(password),
        errorMessage: "Password is not strong enough",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) return res.status(400).json({ errorMessage: errors[0] });

    const userWithEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (userWithEmail)
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email,
      },
    });

    const ALG = "HS256";
    const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
    const EXP_TIME = "24h";

    const token = await new jose.SignJWT({
      email: user.email,
    })
      .setProtectedHeader({ alg: ALG })
      .setExpirationTime(EXP_TIME)
      .sign(SECRET);

    setCookie("jwt", token, { req, res, maxAge: 60 * 6 * 24 }); // 6 days entirely

    return res
      .status(200)
      .json({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        city: user.city,
        phone: user.phone,
      });
  }

  return res.status(404).json("Unknown endpoint");
}
