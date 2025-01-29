import React, { Suspense } from "react";
import { NotificationContainer } from "react-notifications";

import { AppContextProvider } from "@inplan/AppContext";

import Router from "./Router";
import DebugFooter from "./DebugFooter";

function App() {
  return (
    <AppContextProvider>
      <NotificationContainer />
      <Router />
      <DebugFooter />
    </AppContextProvider>
  );
}
export default function WrappedApp() {
  return (
    <Suspense fallback="...loading">
      <App />
    </Suspense>
  );
}
