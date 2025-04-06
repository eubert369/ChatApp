// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      const { email, username } = req.body;

      const users = collection(db, "users");
      const validateEmail = await getDocs(
        query(users, where("email", "==", email))
      );
      const validateUsername = await getDocs(
        query(users, where("username", "==", username))
      );

      const credentialExists = validateEmail.empty || validateUsername.empty;

      res.status(credentialExists ? 200 : 201).json({
        emailExists: !validateEmail.empty,
        usernameExists: !validateUsername.empty,
      });
    }
  } catch (error) {
    res.status(501).json({ message: error });
  }
}
