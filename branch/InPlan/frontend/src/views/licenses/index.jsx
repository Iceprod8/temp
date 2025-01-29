import React, { useEffect } from "react";
import { useAppContext } from "@inplan/AppContext";
import LicensesTable from "./LicensesTable";

const Licenses = () => {
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    <div>
      <LicensesTable />
    </div>
  );
};

export default Licenses;
