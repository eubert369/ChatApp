import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const stringToken = req.cookies.token;

  if (stringToken) {
    const token = JSON.parse(decodeURIComponent(atob(stringToken)));

    try {
      const docSnap = await getDoc(doc(db, "conversations", `${id}`));
      if (docSnap.exists()) {
        const userSnap = await getDoc(
          doc(
            db,
            "users",
            docSnap.data().user1 == token.id
              ? docSnap.data().user2
              : docSnap.data().user1
          )
        );

        if (userSnap.exists()) {
          res.status(200).json({
            userId: userSnap.id,
            imgUrl: userSnap.data().imgUrl,
            name: `${userSnap.data().firstName} ${userSnap.data().lastName}`,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error", err: error });
    }
  }
}
