import { NextApiRequest, NextApiResponse } from "next";
import validatior from "validator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = req.body;

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

    res.status(200).json({ hello: "asd" });
  }
}
