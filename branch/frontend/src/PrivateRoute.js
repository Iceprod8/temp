import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({
  condition,
  children,
  redirectTo = "/",
  loading,
}) {
  if (loading) {
    return <div>Loading...</div>;
  }
  return condition ? children : <Navigate to={redirectTo} replace />;
}
