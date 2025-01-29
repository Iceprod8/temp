import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { formatDelay } from "@inplan/adapters/functions";
import { backend } from "@inplan/adapters/apiCalls";

const getColumns = (translation) => {
  const columns = [
    {
      field: "title",
      headerName: translation("patient_profile.table_notes.titles.title"),
      width: 200,
    },
    {
      field: "body",
      headerName: translation("patient_profile.table_notes.titles.body"),
      flex: 1,
    },
    {
      field: "update",
      headerName: translation("patient_profile.table_notes.titles.update"),
      width: 200,
    },
  ];
  return columns;
};

const useRowsAndColumns = (patientId) => {
  const { t: translation } = useTranslation();
  const [rows, setRows] = useState([]);
  return { getColumns, rows };
};

export default useRowsAndColumns;
