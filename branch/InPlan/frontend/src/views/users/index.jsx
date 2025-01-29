import React, { useEffect } from "react";
import { useAppContext } from "@inplan/AppContext";
import UsersTable from "./UsersTable";

const Users = () => {
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    <div>
      <UsersTable />
    </div>
  );
};

export default Users;
