import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const decodedToken = JSON.parse(req.body.token);
      const docRef = doc(db, "users", decodedToken.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().type == "username/password") {
          res
            .status(docSnap.data().username === decodedToken.user ? 200 : 201)
            .json({
              message:
                docSnap.data().username === decodedToken.user
                  ? "Authenticated"
                  : "Invalid Credentials",
            });
        } else {
          res
            .status(docSnap.data().email === decodedToken.user ? 200 : 201)
            .json({
              message:
                docSnap.data().email === decodedToken.user
                  ? "Authenticated"
                  : "Invalid Credentials",
            });
        }
      }
    }
  } catch (error) {
    res.status(300).json({ message: error });
  }
}
