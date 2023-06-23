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
    const { email, password } = req.body as IInputs;

    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validatior.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validatior.isLength(password, { min: 1 }),
        errorMessage: "Password is not valid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) return res.status(400).json({ errorMessage: errors[0] });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ errorMessage: "Email or password is invalid" });
    }

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

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      city: user.city,
      phone: user.phone,
    });
  }

  return res.status(404).json("Unknown endpoint");
}
