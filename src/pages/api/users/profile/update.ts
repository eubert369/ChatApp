import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { doc, updateDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      //   const { firstName, lastName, email, username, password, type, imgUrl } =
      //     req.body;
      const stringToken = req.cookies.token;

      if (stringToken) {
        const token = JSON.parse(decodeURIComponent(atob(stringToken)));

        const docRef = doc(db, "users", `${token.id}`);
        await updateDoc(docRef, {
          //   firstName: firstName,
          //   lastName: lastName,
          //   email: email,
          //   username: username,
          //   password: password,
          //   type: type,
          //   imgUrl: imgUrl,
          ...req.body,
        });
        res.status(200).json({
          message: "Profile updated successfully",
          user: {
            ...req.body,
          },
        });
      } else {
        res.status(401).json({ message: "Unauthorized Access" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
  // res.status(200).json({ name: "John Doe" });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};
