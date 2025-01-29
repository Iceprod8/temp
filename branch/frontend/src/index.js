import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { LicenseInfo } from "@mui/x-license";

import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "react-notifications/lib/notifications.css";

// SCSS
import "./assets/scss/app.scss";

// Translation
import "./i18n";

LicenseInfo.setLicenseKey(
  // "a5e4f45533d3eb41ee6f7090e9da97b3T1JERVI6NjA2NTQsRVhQSVJZPTE3MDkxOTcyNTUyOTgsS0VZVkVSU0lPTj0x",
  "9b5d679cdd92eaef0228d6e4ad58ebe5Tz0xMDY3NzQsRT0xNzY5NzMxMTk5MDAwLFM9cHJvLExNPXN1YnNjcmlwdGlvbixQVj1RMy0yMDI0LEtWPTI=",
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Si vous souhaitez que votre application fonctionne hors ligne et se charge plus rapidement,
// vous pouvez changer unregister() en register(). Notez que cela comporte des risques.
// En savoir plus sur les service workers : https://bit.ly/CRA-PWA
serviceWorker.unregister();
