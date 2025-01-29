import React from "react";
import { useTranslation } from "react-i18next";
// import MetaTags from "react-meta-tags";
import page404 from "@inplan/assets/images/404.svg";

function NotFound() {
  const { t: translation } = useTranslation();
  return (
    <>
      {/* <MetaTags>
        <title>{translation("not_found.name")}</title>
        <meta name="description" content="This page isn't avaiable" />
        <meta property="og:title" content="Orthoin3D" />
      </MetaTags> */}
      <div className="_404-container" style={{ "text-align": "center" }}>
        <img
          src={page404}
          alt=""
          className="_404-img"
          style={{ width: "350px" }}
        />
        <div className="_404-text-block" style={{ color: "black" }}>
          <h1 className="_404-title">{translation("not_found.title")}</h1>
          <div className="_404-subtitle" style={{ margin: "1rem" }}>
            {translation("not_found.sorry_no_result_found")}
          </div>
          <a
            href="/"
            className="_404-button w-button"
            style={{ color: "--color-black" }}
          >
            {translation("not_found.click_here_to_go_back_to_home_page")}
          </a>
        </div>
      </div>
    </>
  );
}

export default NotFound;
