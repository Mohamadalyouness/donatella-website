import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated =
    typeof window !== "undefined" &&
    window.localStorage.getItem("isAdmin") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
