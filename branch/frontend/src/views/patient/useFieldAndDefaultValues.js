import React, { useState } from "react";
import { backend } from "@inplan/adapters/apiCalls";
import { formatEntries } from "./utils";

export default function useFieldAndDefaultValues(patientId, fields) {
  const [showedFields, setShowedFields] = useState([]);
  const [patient, setPatient] = useState();
  const [defaultValues, setDefaultValues] = useState({});

  const fetchData = async () => {
    try {
      const { data } = await backend({
        method: "GET",
        url: `/patients/${patientId}`,
      });
      if (data) {
        const flds = Object.entries(data).filter((elem) =>
          fields.includes(elem[0]),
        );
        setPatient(data);
        setShowedFields(formatEntries(flds));

        const defaultVals = flds.reduce((acc, curr) => {
          if (curr[0] === "gender") {
            if (curr[1] === 1) acc[curr[0]] = "male";
            else if (curr[1] === 0) acc[curr[0]] = "female";
            else acc[curr[0]] = "other";
          } else {
            const [key, val] = curr;
            acc[key] = val;
          }
          return acc;
        }, {});
        setDefaultValues(defaultVals);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return { defaultValues, patient, showedFields };
}
