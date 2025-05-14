import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const stringToken = req.cookies.token;

    if (stringToken) {
      const token = JSON.parse(stringToken);
      res.status(200).json({ token: token, reqBody: req.body });
    }
  }
}
