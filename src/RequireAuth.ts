import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getActiveUser } from "./slices/AuthToken.slice";

export const useAuth = () => {
  const user = useSelector(getActiveUser);

  return useMemo(() => user, [user]);
};
