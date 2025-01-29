import React from "react";

export default function SlotOffsetInterface(props) {
  const {
    index,
    xTranslationValue,
    yTranslationValue,
    zTranslationValue,
    xRotationValue,
    yRotationValue,
    zRotationValue,
    onChangeAction,
  } = props;

  const displayedName = ` Offset pour Slot ${String(index + 1)} `;
  const xTranslationName = `slot${String(index)}TranslationX`;
  const yTranslationName = `slot${String(index)}TranslationY`;
  const zTranslationName = `slot${String(index)}TranslationZ`;
  const xRotationName = `slot${String(index)}RotationX`;
  const yRotationName = `slot${String(index)}RotationY`;
  const zRotationName = `slot${String(index)}RotationZ`;

  return (
    <>
      <div style={{ marginTop: "15px" }}>
        <label style={{ fontSize: "1.5em" }}>{displayedName}</label>
      </div>
      <div>
        <label> Translation X </label>
        <input
          type="number"
          name={xTranslationName}
          value={xTranslationValue}
          onChange={onChangeAction}
          min="-150"
          max="150"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Translation Y </label>
        <input
          type="number"
          name={yTranslationName}
          value={yTranslationValue}
          onChange={onChangeAction}
          min="-150"
          max="150"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Translation Z </label>
        <input
          type="number"
          name={zTranslationName}
          value={zTranslationValue}
          onChange={onChangeAction}
          min="-150"
          max="150"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Rotation X </label>
        <input
          type="number"
          name={xRotationName}
          value={xRotationValue}
          onChange={onChangeAction}
          min="-360"
          max="360"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Rotation Y </label>
        <input
          type="number"
          name={yRotationName}
          value={yRotationValue}
          onChange={onChangeAction}
          min="-360"
          max="360"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
        <label> Rotation Z </label>
        <input
          type="number"
          name={zRotationName}
          value={zRotationValue}
          onChange={onChangeAction}
          min="-360"
          max="360"
          style={{ width: "60px", marginLeft: "5px", marginRight: "20px" }}
        />
      </div>
    </>
  );
}
