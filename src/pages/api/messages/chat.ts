import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stringToken = req.cookies.token;
  const { convoId, recipientId, message, date } = req.body;
  if (req.method == "POST") {
    if (stringToken) {
      const token = JSON.parse(decodeURIComponent(atob(stringToken)));

      try {
        await addDoc(collection(db, "messages"), {
          convoId: convoId,
          messageContent: message,
          recipientId: recipientId,
          senderId: token.id,
          dateSent: date
        });

        res.status(200).json({ message: "Message send successfully" });
      } catch (error) {
        res.status(500).json({ message: "Cannot send message", err: error });
      }
    }
  }
}
