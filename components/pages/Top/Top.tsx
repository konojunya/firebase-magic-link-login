import { Top as LoggedInTop } from "./internal/Top";
import { LP } from "./internal/LP";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export const Top: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext.loggedIn) {
    return <LP />;
  }

  return <LoggedInTop />;
};
