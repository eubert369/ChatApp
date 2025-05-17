import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const stringToken = req.cookies.token;
    // const { convoId, recipientId, message } = req.body;
  if (req.method == "POST") {
    if (stringToken) {
      const token = JSON.parse(decodeURIComponent(atob(stringToken)));
      res.status(200).json({ senderId: token.id, reqBody: req.body });
    }
  }
}
