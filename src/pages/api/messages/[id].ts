import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stringToken = req.cookies.token;
  if (stringToken) {
    const token = JSON.parse(decodeURIComponent(atob(stringToken)));
    try {
      const { id } = req.query;
      const querySnapshot = await getDocs(
        query(
          collection(db, "messages"),
          where("convoId", "==", id),
          orderBy("dateSent", "desc")
        )
      );

      const messages = querySnapshot.docs.map((doc) => ({
        message: doc.data().messageContent,
        received: doc.data().recipientId === token.id,
        date: doc.data().dateSent,
      }));
      res.status(200).json(messages);
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error", err: error });
    }
  } else {
    res.status(403).json({ message: "Unauthorized Access" });
  }
}
