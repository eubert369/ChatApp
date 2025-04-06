import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method == "POST") {
      res.setHeader(
        "Set-Cookie",
        `token=; Path=/; HttpOnly; Max-Age=0; Secure; SameSite=Strict`
      );
      res.status(200).json({ message: "Cookie removed" });
    }
  } catch (error) {
    res.json({ message: error });
  }
}
