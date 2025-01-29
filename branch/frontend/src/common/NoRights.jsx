import React from "react";
import { useTranslation } from "react-i18next";

function NoRights() {
  const { t: translation } = useTranslation();
  return (
    <>
      <div className="" style={{ marginTop: 30, "text-align": "center" }}>
        <div className="" style={{ color: "black" }}>
          <h1 className="">
            {translation("no_rights.you_do_not_have_permission")}
          </h1>
          <div className="" style={{ margin: "1rem" }}>
            {translation("no_rights.contact")}
            <a
              href="mailto:support@orthoin3d.com"
              className=""
              style={{ color: "blue" }}
            >
              {" support@orthoin3d.com"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoRights;
