import React, { useEffect, useState } from "react";
import useToggle from "@inplan/common/useToogle";
import CheckBox from "@inplan/common/CheckBox";

// This table line is used to validate which aligners have been proprely treated inside a batch.
// FIXME: All naming is wrong in this file

export default function ModelTable({ model, modelsToPrint, setModelsToPrint }) {
  const [checked, setChecked] = useToggle(true);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init) {
      if (checked) {
        setModelsToPrint((models) => [...models, model]);
      } else {
        setModelsToPrint(modelsToPrint.filter((f) => f.id !== model.id));
      }
    } else {
      setModelsToPrint(modelsToPrint.filter((f) => !f.base_error));
    }
    setInit(true);
  }, [checked]);

  return (
    <tr key={model.id}>
      <td>{model.short_code}</td>
      <td className="td__actions td-alignItems">
        <CheckBox checked={checked} setChecked={setChecked} />
      </td>
    </tr>
  );
}
