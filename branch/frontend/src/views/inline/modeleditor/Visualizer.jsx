import React, { useState } from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import ThreeComponent from "./ThreeComponent";

const override = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default function Visualizer({ loading, meshOpacity }) {
  const [Iloading, setIloading] = useState();
  return (
    <div style={{ position: "relative", height: "100%" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        >
          <ClipLoader
            css={override}
            color="#ffffff"
            loading={loading}
            size={50}
          />
        </div>
      )}
      <ThreeComponent setLoading={setIloading} meshOpacity={meshOpacity} />
    </div>
  );
}
