import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const stringToken = req.cookies.token;

  if (req.method === "DELETE") {
    try {
      if (stringToken) {
        await deleteDoc(doc(db, "conversations", `${id}`));
        res.status(200).json({ message: "Contact removed successfully" });
      } else {
        res.status(403).json({ message: "Unauthorized Access" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error", err: error });
    }
  }
}
