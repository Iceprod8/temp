import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import Modal from "@inplan/common/Modal";
import { Checkbox } from "@mui/material";
import BasicSelect from "@inplan/common/BasicSelect";
import { useAppContext } from "@inplan/AppContext";

export default function LicenseModal({
  selectedUser,
  setSelectedUser,
  selectedLicense,
  setSelectedLicense,
  seletedLicenseType,
  setSeletedLicenseType,
  setModal,
  labelColor,
}) {
  const {
    users,
    licenseTypes,
    createUserLicense,
    updateUserLicense,
    getUserRights,
  } = useAppContext();

  const { t: translation } = useTranslation();

  const title = selectedLicense
    ? `${translation("licenses.form.update")} : ${
        selectedLicense?.user?.username
      } - ${selectedLicense?.license_type?.name}`
    : `${translation("licenses.form.create")}`;

  const [startDate, setStartDate] = useState(
    selectedLicense && selectedLicense.start_date !== null
      ? selectedLicense.start_date
      : ""
  );
  const [endDate, setEndDate] = useState(
    selectedLicense &&
      selectedLicense.end_date !== null &&
      !selectedLicense.no_ending
      ? selectedLicense.end_date
      : ""
  );
  const [noEnding, setnoEnding] = useState(
    selectedLicense && selectedLicense.no_ending !== null
      ? selectedLicense.no_ending
      : false
  );

  useEffect(() => {
    // If a <license> is selected, it means that the action is going
    // to be an update, so the information of the selected <license>
    // is loaded into the modal.
    if (selectedLicense) {
      setSeletedLicenseType(selectedLicense.license_type);
      setSelectedUser(selectedLicense.user);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    Object.assign(data, {
      user_id: selectedUser?.id,
      license_type_id: seletedLicenseType?.id,
      no_ending: noEnding,
    });
    if (noEnding) {
      data.end_date = data.start_date;
    }
    if (data.start_date === "" || data.end_date === "") {
      NotificationManager.error(
        translation("messages.licenses.dates_cannot_be_empty")
      );
      return;
    }
    // UPDATE LICENSE
    const updatedRights = await getUserRights();
    if (selectedLicense && updatedRights?.to_update) {
      const res = await updateUserLicense(selectedLicense.id, data);
      if (res !== undefined) {
        NotificationManager.success(
          translation("messages.licenses.license_was_updated")
        );
        setModal("");
        setSelectedLicense(null);
      }
      return;
    }
    // CREATE LICENSE
    if (!selectedLicense && updatedRights?.to_create) {
      const res = await createUserLicense({}, data);
      if (res !== undefined) {
        NotificationManager.success(
          translation("messages.licenses.license_was_created")
        );
        setModal("");
      }
      return;
    }
    // NO PERMISSION
    NotificationManager.error(
      translation(
        "messages.common.you_do_not_have_permission_to_execute_this_action"
      )
    );
    setModal("");
  };
  return (
    <Modal title={title} onClose={setModal}>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid">
          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("licenses.form.username")}
            </label>
            <BasicSelect
              value={selectedUser}
              setValue={setSelectedUser}
              data-test="selectUser"
              data={{
                name: "users",
                label: "Users",
                choices: users,
              }}
              styles={{
                classes: "btn-tertiary",
                boxStyle: { height: "50px", width: "100%" },
                fontSettings: { fontSize: "15px" },
                selectLabel: { color: "var(--color-primary)" },
              }}
            />
          </div>

          <div className="form-group">
            <label style={{ color: labelColor }}>
              {translation("licenses.form.license_type")}
            </label>
            <BasicSelect
              value={seletedLicenseType}
              setValue={setSeletedLicenseType}
              data-test="license_type"
              data={{
                name: "license_type",
                label: "license_type",
                choices: licenseTypes,
              }}
              styles={{
                classes: "btn-tertiary",
                boxStyle: { height: "50px", width: "100%" },
                fontSettings: { fontSize: "15px" },
                selectLabel: { color: "var(--color-primary)" },
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">
              {translation("licenses.form.description")}
            </label>
            <div>{seletedLicenseType?.description}</div>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">
              {translation("licenses.form.start_date")}
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              data-test="start_date"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              value={startDate}
              placeholder="ex. YYYY-MM-DD"
            />
          </div>
          <div className="form-group">
            <label htmlFor="end_date">
              {translation("licenses.form.end_date")}
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              data-test="end_date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              value={endDate}
              placeholder="ex. YYYY-MM-DD"
            />
          </div>
          <div>
            <Checkbox
              checked={noEnding}
              onClick={() => setnoEnding(!noEnding)}
            />
            {translation("licenses.form.no_ending")}
          </div>

          <div className="grid2">
            <button
              className="btn-modal-muted"
              type="button"
              onClick={() => setModal("")}
            >
              {translation("licenses.buttons.cancel")}
            </button>
            {!selectedLicense ? (
              <button
                className="btn-modal-secondary"
                data-test="new_license_submit"
                type="submit"
              >
                {translation("licenses.buttons.confirm")}
              </button>
            ) : (
              <button
                className="btn-modal-secondary"
                data-test="new_license_submit"
                type="submit"
              >
                {translation("licenses.buttons.save")}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
