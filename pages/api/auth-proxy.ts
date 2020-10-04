import { NextApiRequest, NextApiResponse } from "next";
import { apiClient } from "../../api";
import jwtDecode from "jwt-decode";
import { serialize } from "cookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { firebaseIdToken } = req.body;
      const { data, status } = await apiClient.post(
        "/api/auth",
        {
          firebaseIdToken,
        },
        { baseURL: "http://localhost:3000" }
      );
      const decodedJwt = jwtDecode<{ userId: string; exp: number }>(data.token);

      res.setHeader(
        "Set-Cookie",
        serialize("token", data.token, {
          expires: new Date(Date.now() + decodedJwt.exp),
          sameSite: "lax",
          domain: "localhost",
          path: "/",
          secure: false,
          httpOnly: true,
        })
      );
      res.statusCode = status;
      res.end();
    } catch (e) {
      console.error(e);

      res.statusCode = 500;
      res.end();
    }
  }
};

export default handler;
