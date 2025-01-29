import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAppContext } from "./AppContext";

function PrivateRoute({ children, ...all }) {
  const { onConnect } = useAppContext();

  return (
    <Route
      {...all}
      render={() =>
        onConnect || onConnect == null ? (
          <>{children}</>
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    />
  );
}

export default PrivateRoute;
