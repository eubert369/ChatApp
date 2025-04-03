import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      const docRef = await addDoc(collection(db, "users"), {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });
      res
        .status(200)
        .json({ userID: docRef.id, message: "user successfully created" });
    } else {
    }
  } catch (error) {
    res.json({ message: error });
  }
}
