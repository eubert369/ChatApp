import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stringToken = req.cookies.token;
  if (stringToken) {
    const token = JSON.parse(decodeURIComponent(atob(stringToken)));
    try {
      const query1 = await getDocs(
        query(collection(db, "conversations"), where("user1", "==", token.id))
      );
      const query2 = await getDocs(
        query(collection(db, "conversations"), where("user2", "==", token.id))
      );

      const [snapshot1, snapshot2] = await Promise.all([query1, query2]);
      const exists = !snapshot1.empty || !snapshot2.empty;

      if (exists) {
        const contactsFetched = await Promise.all(
          [...snapshot1.docs, ...snapshot2.docs].map(async (convo) => {
            const docSnap = await getDoc(
              doc(
                db,
                "users",
                convo.data().user1 == token.id
                  ? convo.data().user2
                  : convo.data().user1
              )
            );

            const latestMessage = await getDocs(
              query(
                collection(db, "messages"),
                where("convoId", "==", convo.id),
                orderBy("dateSent", "desc"),
                limit(1)
              )
            );

            if (docSnap.exists() && !latestMessage.empty) {
              return {
                convoId: convo.id,
                userId: docSnap.id,
                name: `${docSnap.data().firstName} ${docSnap.data().lastName}`,
                conversation: latestMessage.docs[0].data(),
              };
            }
          })
        );

        res.status(200).json({
          initialFetch: contactsFetched,
          message: "success",
        });
      } else {
        res.status(200).json({
          message: "empty collection",
        });
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error", err: error });
    }
    // res.status(200).json({ name: "John Doe" });
  }
}
