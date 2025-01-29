import React from "react";

export default function SlotInput(props) {
  const {
    index,
    laserPowerValue,
    dutyCycleValue,
    frequencyValue,
    vectorSpeedValue,
    activeValue,
    fileValue,
    onChangeAction,
  } = props;

  const displayedName = `Slot ${String(index + 1)} `;

  const activeName = `slot${String(index)}Active`;
  const powerName = `slot${String(index)}Power`;
  const dutyCycleName = `slot${String(index)}DutyCycle`;
  const frequencyName = `slot${String(index)}Frequency`;
  const vectorSpeedName = `slot${String(index)}VectorSpeed`;
  const fileName = `slot${String(index)}File`;

  return (
    <div style={{ marginTop: "15px" }}>
      <label style={{ fontSize: "1.5em" }}>{displayedName}</label>
      <div>
        <label> Active </label>
        <input
          type="checkbox"
          name={activeName}
          checked={activeValue}
          onChange={onChangeAction}
        />

        <label> Puissance </label>
        <input
          type="number"
          name={powerName}
          value={laserPowerValue}
          onChange={onChangeAction}
          min="1"
          max="100"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Duty Cycle </label>
        <input
          type="number"
          name={dutyCycleName}
          value={dutyCycleValue}
          onChange={onChangeAction}
          min="1"
          max="100"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Fréquence </label>
        <input
          type="number"
          name={frequencyName}
          value={frequencyValue}
          onChange={onChangeAction}
          min="1"
          max="2000"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Vitesse </label>
        <input
          type="number"
          name={vectorSpeedName}
          value={vectorSpeedValue}
          onChange={onChangeAction}
          min="1"
          max="6000"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />

        <label> Load File </label>
        <input
          type="file"
          name={fileName}
          onChange={onChangeAction}
          min="0"
          max="40"
          maxLength="2"
          style={{ marginLeft: "5px", width: "600px" }}
        />
      </div>
    </div>
  );
}
