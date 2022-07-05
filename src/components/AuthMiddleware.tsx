import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../RequireAuth";

export function PrivateOutlet() {
  const auth = useAuth();
  const location = useLocation();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
}

export function PublicOutlet() {
  const auth = useAuth();
  const location = useLocation();

  return !auth ? <Outlet /> : <Navigate to="/home" state={{ from: location }} />;
}
