import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/components/firebase/Config";
import { collection, getDocs, where, query, addDoc } from "firebase/firestore";
import { userTypes } from "@/components/Types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { firstName, lastName, email, imgURL } = req.body;
    if (req.method == "POST") {
      const users = collection(db, "users");
      const validateEmail = await getDocs(
        query(users, where("email", "==", email))
      );

      if (!validateEmail.empty) {
        const requestedData = validateEmail.docs.map((users) => ({
          id: users.id,
          ...(users.data() as userTypes),
        }));

        const user = requestedData.find((data) => data.email === email);

        if (user) {
          const tokenToBeEncoded: { id: string; user: string } = {
            id: user.id,
            user: user.email,
          };
          res.setHeader(
            "Set-Cookie",
            `token=${btoa(
              encodeURIComponent(JSON.stringify(tokenToBeEncoded))
            )}; Path=/; HttpOnly; Max-Age=3600; Secure; SameSite=Strict`
          );
          res
            .status(200)
            .json({ message: "OAuth Signin Sucessfull", user: user });
        }
      } else {
        const docRef = await addDoc(collection(db, "users"), {
          type: "oauth/google",
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: "",
          password: "",
          imgUrl: imgURL,
        });

        const tokenToBeEncoded: { id: string; user: string } = {
          id: docRef.id,
          user: email,
        };
        res.setHeader(
          "Set-Cookie",
          `token=${encodeURIComponent(
            JSON.stringify(tokenToBeEncoded)
          )}; Path=/; HttpOnly; Max-Age=3600; Secure; SameSite=Strict`
        );

        res.status(200).json({
          message: "OAuth Signin Sucessfull",
          user: {
            type: "oauth/google",
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: "",
            password: "",
            imgURL: imgURL,
          },
        });
      }
    }
  } catch (error) {
    res.status(503).json({ message: error });
  }
}
