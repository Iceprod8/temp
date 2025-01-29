import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import DataGridProLicenses from "../licenses/DataGridProLicenses";
import getLicenseColumns from "../licenses/licenseColumns";

const Licenses = () => {
  const { t: translation } = useTranslation();
  const [userLicenses, setUserLicenses] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  useEffect(async () => {
    const { data } = await backend.get("/user_licenses/get_user_licenses");
    setUserLicenses(data);
  }, []);

  const columns = getLicenseColumns(translation);

  return (
    <div>
      <div className="page-head__title">
        <h1 className="h1">{translation("navbar.profile.licenses.title")}</h1>
        <div style={{ marginTop: 10 }}>
          {translation("navbar.profile.licenses.contact_us")}{" "}
          <a href="mailto:sales@orthoin3d.com" style={{ color: "blue" }}>
            sales@orthoin3d.com
          </a>
          .
        </div>
      </div>
      <DataGridProLicenses
        columns={columns}
        userLicenses={userLicenses}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    </div>
  );
};

export default Licenses;
