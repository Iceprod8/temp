import React from "react";

export default function LoadingOverlay({ children }) {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay__body">{children}</div>
    </div>
  );
}
