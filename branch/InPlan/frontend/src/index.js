import React from "react";
import ReactDOM from "react-dom";

import { LicenseInfo } from "@mui/x-data-grid-pro";

import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "react-notifications/lib/notifications.css";

// SCSS
import "./assets/scss/app.scss";

// Translation
import "./i18n";

LicenseInfo.setLicenseKey(
  "a5e4f45533d3eb41ee6f7090e9da97b3T1JERVI6NjA2NTQsRVhQSVJZPTE3MDkxOTcyNTUyOTgsS0VZVkVSU0lPTj0x"
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
