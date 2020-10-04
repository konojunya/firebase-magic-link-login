import { useState } from "react";
import { apiClient } from "../../../api";

export const Signin: React.FC = () => {
  const [state, setState] = useState({ email: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      localStorage.setItem("email", state.email);
      apiClient.post("/api/auth/email", { email: state.email });
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ email: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={state.email}
        onChange={handleChange}
      />
      <button type="submit">ログイン</button>
    </form>
  );
};
