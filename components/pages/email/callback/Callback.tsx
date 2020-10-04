import { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { apiClient } from "../../../../api";
import { useRouter } from "next/dist/client/router";

function getFirebase() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp({
      apiKey: "AIzaSyCHx37REcLon0T5OJhMyInKutlPa4S7p7I",
      authDomain: "",
      databaseURL: "https://fir-magic-link-login.firebaseio.com",
      projectId: "fir-magic-link-login",
      storageBucket: "",
    });
  }

  return firebase;
}

async function signInWithEmailLink(email: string, url: string) {
  const fb = getFirebase();
  const { additionalUserInfo, user } = await fb
    .auth()
    .signInWithEmailLink(email, url);

  if (additionalUserInfo == null || user == null) {
    console.error("Error");
    return;
  }

  return await user.getIdToken(true);
}

export const EmailCallback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fb = getFirebase();
    const url = window.location.href;
    const email = localStorage.getItem("email");

    if (!fb.auth().isSignInWithEmailLink(url) || email == null) {
      console.error("isSignInWithEmailLink error");
      return;
    }

    signInWithEmailLink(email, url).then(async (firebaseIdToken) => {
      // setCookieするために一旦nextのサーバーへproxyさせる
      // 本来のendpointは `/api/auth`
      await apiClient.post("/api/auth-proxy", {
        firebaseIdToken,
      });
      router.push("/");
    });
  }, []);

  return <h1>verifying...</h1>;
};
