import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const stringToken = req.cookies.token;

  if (stringToken) {
    try {
      // const token = JSON.parse(stringToken);

      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((users) => ({
        id: users.id,
        name: `${users.data().firstName} ${users.data().lastName}`,
        email: users.data().email,
        imgUrl: users.data().imgUrl
      }));

      const requestedUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(`${id}`) ||
          user.email.toLowerCase().includes(`${id}`)
      );

      res
        .status(200)
        .json({ total_count: requestedUsers.length, items: requestedUsers });
    } catch (error) {
      res.status(500).json({ message: "Error", Error_Details: error });
    }
  } else {
    res.status(401).json({ message: "Unauthorized Access" });
  }
}
