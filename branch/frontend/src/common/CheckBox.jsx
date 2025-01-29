import React from "react";
import clsx from "clsx";

export default function CheckBox({ checked, setChecked, onClick }) {
  return (
    <div className="form-switch" onClick={onClick}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={() => setChecked()}
      />
      <label onClick={() => setChecked()}>
        <span className={clsx("switch")} />
      </label>
    </div>
  );
}
