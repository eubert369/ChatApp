// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const stringToken = req.cookies.token;

    if (stringToken) {
      const token = JSON.parse(decodeURIComponent(atob(stringToken)));
      const docRef = doc(db, "users", `${token.id}`);
      const docSnap = await getDoc(docRef);
      res.status(200).json({ id: token.id, ...docSnap.data() });
    } else {
      res.status(202).json({ message: "Invalid Cookie" });
    }
  } catch (error) {
    res.status(204).json({ message: `${error}` });
  }
}
