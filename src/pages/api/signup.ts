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
      const docRef = await addDoc(collection(db, "users"), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        imgURL: "",
      });

      res
        .status(docRef ? 200 : 401)
        .json({
          userID: docRef.id,
          message: docRef
            ? "user successfully created"
            : "error in creating user",
        });
    } else {
    }
  } catch (error) {
    res.json({ message: error });
  }
}
