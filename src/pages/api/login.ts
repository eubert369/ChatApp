import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, getDocs } from "firebase/firestore";

interface userTypes {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      const querySnapshot = await getDocs(collection(db, "users"));
      const requestedData = querySnapshot.docs.map((users) => ({
        id: users.id,
        ...(users.data() as userTypes),
      }));
      const isLoggedIn = requestedData.some(
        (data) =>
          data.username === req.body.username &&
          data.password === req.body.password
      );
      res
        .status(200)
        .json({
          message: isLoggedIn ? "Authenticated" : "Wrong Credentials",
          response: requestedData,
        });
    }
  } catch (error) {
    res.json({ message: error });
  }
}
