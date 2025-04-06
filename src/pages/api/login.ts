import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import { userTypes } from "@/components/Types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username, password } = req.body;

    if (req.method == "POST") {
      const querySnapshot = await getDocs(collection(db, "users"));
      const requestedData = querySnapshot.docs.map((users) => ({
        id: users.id,
        ...(users.data() as userTypes),
      }));

      const isLoggedIn = requestedData.find(
        (data) => data.username === username && data.password === password
      );

      if (isLoggedIn) {
        const tokenToBeEncoded: { id: string; user: string } = {
          id: isLoggedIn.id,
          user: isLoggedIn.username,
        };
        res.setHeader(
          "Set-Cookie",
          `token=${encodeURIComponent(
            JSON.stringify(tokenToBeEncoded)
          )}; Path=/; HttpOnly; Max-Age=3600; Secure; SameSite=Strict`
        );
      }

      res.status(!!isLoggedIn ? 200 : 401).json({
        message: !!isLoggedIn ? "Login Successful" : "Invalid Credentials",
        user: isLoggedIn ?? '401',
      });
    }
  } catch (error) {
    res.json({ message: error });
  }
}
