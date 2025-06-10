import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const stringToken = req.cookies.token;
    const { recipientId, message } = req.body;

    if (stringToken) {
      const token = JSON.parse(decodeURIComponent(atob(stringToken)));

      try {
        const query1 = query(
          collection(db, "conversations"),
          where("user1", "==", `${token.id}`),
          where("user2", "==", `${recipientId}`)
        );

        const query2 = query(
          collection(db, "conversations"),
          where("user1", "==", `${recipientId}`),
          where("user2", "==", `${token.id}`)
        );
        
        const [snapshot1, snapshot2] = await Promise.all([
          getDocs(query1),
          getDocs(query2),
        ]);
        
        const exists = !snapshot1.empty || !snapshot2.empty;

        if (!exists) {
          const addConvo = await addDoc(collection(db, "conversations"), {
            user1: `${token.id}`,
            user2: `${recipientId}`,
          });

          const createMessage = await addDoc(collection(db, "messages"), {
            convoId: addConvo.id,
            senderId: `${token.id}`,
            recipientId: `${recipientId}`,
            messageContent: message,
            dateSent: Timestamp.now()
          });

          res
            .status(200)
            .json({
              message: `Success`,
              messageId: createMessage.id,
              convoId: addConvo.id,
            });
        } else {
          res
            .status(409)
            .json({ message: `You already have an existing conversation` });
        }
      } catch (error) {
        res.status(500).json({ message: error });
      }
    }
  }
}
