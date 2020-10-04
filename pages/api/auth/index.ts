import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk
      const { firebaseIdToken } = req.body;
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const userId = decodedToken.uid;
      const exp = 1000 * 60 * 60 * 24 * 7; // expired at 1week
      const token = jwt.sign(
        {
          userId,
          exp,
        },
        "secret"
      );

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          userId,
          token,
        })
      );
    } catch (e) {
      console.error(e);

      res.statusCode = 401;
      res.end();
    }
  }
};

export default handler;
