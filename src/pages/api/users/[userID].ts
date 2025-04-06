// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userID } = req.query;
    const docRef = doc(db, "users", `${userID}`);
    const docSnap = await getDoc(docRef);

    res.status(200).json(docSnap.data());
  } catch (error) {
    res.status(204).json({ message: `${error}` });
  }
}
