import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { HiCube } from "react-icons/hi";
import BasicSelect from "@inplan/common/BasicSelect";
import { useAppContext } from "@inplan/AppContext";

const SheetParameters = ({ idValuesSheets, setIdValuesSheets }) => {
  const { t: translation } = useTranslation();
  const [sheetList, setSheetList] = useState([]);
  const {
    defaultSheet,
    setDefaultSheet,
    defaultTemplateSheet,
    setDefaultTemplateSheet,
  } = useAppContext();

  const handleChange = (key) => {
    // Create a new object with the updated value
    const updatedValues = { ...idValuesSheets };
    updatedValues[key] = 1 - (updatedValues[key] || 0); // Toggle between 0 and 1
    setIdValuesSheets(updatedValues);

    if (defaultSheet && defaultSheet.id === key && updatedValues[key] === 0) {
      // If the default sheet exists and if it matches the current checkbox sheet (identified by 'key').
      // If the checkbox for this sheet is unchecked (updatedValues[key] === 0),
      // it implies that the default sheet is no longer valid (as it will not be in the list).
      // Therefore, the default sheet should be unset.
      setDefaultSheet(null);
    }
  };

  // Function to initialize a set with true / false for each element
  // If said element exist in a list
  // Used to set which sheet are available or not
  const addNewKey = (array, obj) => {
    return array.map((item) => {
      if (obj.has(item.id)) {
        return { ...item, set: true };
      }
      return { ...item, set: false };
    });
  };

  const getSheetList = async () => {
    let usedSheetList = [];
    const { data: office } = await backend.get("offices/current");
    if (office) {
      usedSheetList = office.used_sheet_list;
    }
    // Get the set sheet for InLase
    const { data: setSheets } = await backend.get("sheets/available");
    const getSetSheetIds = new Set(setSheets?.map((item) => item.id));
    const { data: res } = await backend.get("sheets");
    const allSheets = res?.results;
    if (allSheets) {
      const initSheets = addNewKey(allSheets, getSetSheetIds);
      setSheetList(initSheets);
    }
    const initUsedSheets = {};
    for (let i = 0; i < usedSheetList?.length; i += 1) {
      initUsedSheets[usedSheetList[i]] = 1;
    }
    setIdValuesSheets(initUsedSheets);
  };

  useEffect(async () => {
    await getSheetList();
  }, []);

  return (
    <div>
      <div className="page-head__title">
        <h2 className="h2">
          {translation(
            "navbar.profile.parameters.order_template.settings.sheets.title"
          )}
        </h2>
      </div>
      <div
        style={{ marginBottom: "0px", marginTop: "10px" }}
        className="flex alignItems-center"
      >
        <HiCube /> :
        <div style={{ marginLeft: "10px" }}>
          {translation(
            "navbar.profile.parameters.order_template.settings.sheets.legend"
          )}
        </div>
      </div>
      <div style={{ marginBottom: "15px", marginTop: "15px" }}>
        {sheetList.map((sheet, index) => (
          <div key={sheet.id} style={{ marginBottom: "10px" }}>
            <span
              style={{
                width: "210px",
                display: "inline-block",
              }}
            >
              {`${sheet.name}: `}
              {sheet.set && <HiCube />}
            </span>
            <input
              type="checkbox"
              checked={idValuesSheets[sheet.id] === 1}
              onChange={() => handleChange(sheet.id)}
            />
          </div>
        ))}
      </div>
      {/* DEFAULT SHEET */}
      <div>
        <div className="page-head__title">
          <h2 className="h2">
            {translation(
              "navbar.profile.parameters.order_template.settings.sheets.default_sheet"
            )}
          </h2>
        </div>
        <div
          style={{
            flex: 1,
            marginTop: 10,
            marginBottom: 20,
          }}
          className=""
        >
          <BasicSelect
            value={defaultSheet}
            setValue={setDefaultSheet}
            data-test="selectSheet"
            data={{
              name: "sheets",
              label: "sheets",
              choices: sheetList,
            }}
            styles={{
              classes: "btn-tertiary",
              boxStyle: { height: "35px", width: "220px" },
              fontSettings: { fontSize: "15px" },
              selectLabel: { color: "var(--color-primary)" },
            }}
          />
          {defaultSheet &&
            (idValuesSheets[defaultSheet?.id] === undefined ||
              idValuesSheets[defaultSheet?.id] === 0) && (
              <div
                style={{
                  color: "Chocolate",
                  marginTop: "10px",
                }}
              >
                {translation(
                  "navbar.profile.parameters.order_template.settings.sheets.warning_default_sheet"
                )}
              </div>
            )}
        </div>
      </div>
      {/* END DEFAULT SHEET */}
      {/* DEFAULT TEMPLATE SHEET */}
      {/* <div>
        <div className="page-head__title">
          <h2 className="h2">
            {translation(
              "navbar.profile.parameters.order_template.settings.sheets.default_template_sheet"
            )}
          </h2>
        </div>
        <div
          style={{
            flex: 1,
            marginTop: 10,
            marginBottom: 20,
          }}
          className=""
        >
          <BasicSelect
            value={defaultTemplateSheet}
            setValue={setDefaultTemplateSheet}
            data-test="selectDefaultTemplateSheet"
            data={{
              name: "templateSheet",
              label: "templateSheet",
              choices: sheetList,
            }}
            styles={{
              classes: "btn-tertiary",
              boxStyle: { height: "35px", width: "220px" },
              fontSettings: { fontSize: "15px" },
              selectLabel: { color: "var(--color-primary)" },
            }}
          />
        </div>
      </div> */}
      {/* END DEFAULT TEMPLATE SHEET */}
    </div>
  );
};

export default SheetParameters;
