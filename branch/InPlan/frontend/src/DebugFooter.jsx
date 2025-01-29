import React from "react";

import { useAppContext } from "@inplan/AppContext";

export default function DebugFooter() {
  const { version, debug } = useAppContext();

  return (
    <div style={{ display: "none" }}>
      <div name="frontend">{version.frontendVersion}</div>
      <div name="backend">{version.backendVersion}</div>
      <div data-name="debug">{debug ? "true" : "false"}</div>
    </div>
  );
}
