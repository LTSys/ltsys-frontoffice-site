import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  if (!user?.token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}