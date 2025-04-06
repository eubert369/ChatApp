import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (req.method == "POST") {
      let message: string | undefined;
      let status: number = 0;
      let docRef;

      const requestValidate = await fetch(
        `${req.headers.origin}/api/users/validation`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            email: email,
            username: username,
          }),
        }
      );
      const { emailExists, usernameExists } = await requestValidate.json();

      if (!emailExists && !usernameExists) {
        docRef = await addDoc(collection(db, "users"), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: password,
          imgURL: "",
        });

        status = 200;
        message = "user successfully created";
      } else {
        status = 201;

        if (emailExists && usernameExists) {
          message = "email and username already exists";
        } else {
          message = `${emailExists ? "email" : ""}${
            usernameExists ? "username" : ""
          } already exists`;
        }
      }

      res.status(status).json({
        userID: docRef ? docRef.id : "error",
        message: message,
      });
    }
  } catch (error) {
    res.json({ message: error });
  }
}
