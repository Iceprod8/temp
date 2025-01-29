import React, { useEffect } from "react";
import LicensesTable from "../licenses/LicensesTable";
import UsersTable from "../users/UsersTable";
import ProfileTabel from "./profileTable";

function Management() {
  return (
    <div className="management_page">
      <h1>Manage your Team</h1>

      <div>
        <UsersTable />
        <LicensesTable />
        <ProfileTabel />
      </div>
    </div>
  );
}

export default Management;
