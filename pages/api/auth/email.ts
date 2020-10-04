import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

const serviceAccount = require("../../../fir-magic-link-login-firebase-adminsdk-yudhc-787bb235d6.json");
const actionCodeSettings = {
  url: "http://localhost:3000/email/callback",
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-magic-link-login.firebaseio.com",
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { body } = req;

    if (body.email == null) {
      res.statusCode = 401;
      res.end("Email is required.");
      return;
    }

    try {
      const link = await admin
        .auth()
        .generateSignInWithEmailLink(body.email, actionCodeSettings);
      console.log(`send to ${body.email}: ${link}`);

      res.statusCode = 204;
      res.end();
    } catch (e) {
      console.error(e);

      res.statusCode = 500;
      res.end();
    }
  }
};

export default handler;
