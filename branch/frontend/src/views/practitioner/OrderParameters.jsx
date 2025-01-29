import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import checkUser from "@inplan/adapters/checkUser";
import {
  deadlineTypeChoices,
  orderTypeChoices,
  pickupLocationChoices,
} from "@inplan/common/orderTemplateChoices";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import SheetParameters from "./SheetParameters";
import ProducerParameters from "./ProducerParameters";
import DoctorParameters from "./DoctorParameters";
import SimpleSelect from "./SimpleSelect";

export default function OrderParameters({ userRights }) {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const {
    defaultOrderType,
    setDefaultOrderType,
    defaultDeadlineType,
    setDefaultDeadlineType,
    defaultPickupLocation,
    setDefaultPickupLocation,
    defaultTemplateSheet,
    setDefaultTemplateSheet,
    defaultSheet,
    setDefaultSheet,
    defaultDoctor,
    setDefaultDoctor,
    setUserData,
  } = useAppContext();
  const [idValuesProducers, setIdValuesProducers] = useState({});
  const [idValuesSheets, setIdValuesSheets] = useState({});

  useEffect(() => {
    async function fetchUser() {
      const response = await checkUser();
      if (response.data.order_template) {
        setDefaultOrderType(response.data.order_template.type);
        setDefaultPickupLocation(response.data.order_template.pickup_location);
        setDefaultDeadlineType(response.data.order_template.deadline_type);
        setDefaultTemplateSheet(response.data.order_template.template_sheet);
        setDefaultSheet(response.data.order_template.sheet);
        setDefaultDoctor(response.data.order_template.doctor);
      } else {
        setDefaultOrderType(1); // aligner
        setDefaultPickupLocation(0); // clinic
        setDefaultDeadlineType(1); // appointment
      }
    }
    fetchUser();
  }, []);

  const updateProducerList = async () => {
    const keys_to_update = Object.keys(idValuesProducers).filter(
      (key) => idValuesProducers[key] === 1,
    );
    try {
      await backend.post(`offices/update_producer_list`, keys_to_update);
      showSnackbar(
        translation("messages.parameters.producerList.success"),
        "success",
      );
    } catch (error) {
      showSnackbar(
        translation("messages.parameters.producerList.error"),
        "error",
      );
    }
  };

  const updateUsedSheetList = async () => {
    const keys_to_update = Object.keys(idValuesSheets).filter(
      (key) => idValuesSheets[key] === 1,
    );
    try {
      await backend.post(`offices/update_sheet_list`, keys_to_update);
      showSnackbar(
        translation("messages.parameters.sheetsList.success"),
        "success",
      );
    } catch (error) {
      showSnackbar(
        translation("messages.parameters.sheetsList.error"),
        "error",
      );
    }
  };

  const updateOrderTemplate = async () => {
    try {
      await backend.post(`users/update_order_template`, {
        type: defaultOrderType, // order type
        pickup_location: defaultPickupLocation,
        deadline_type: defaultDeadlineType,
        doctor_id: defaultDoctor?.id,
        sheet_id: defaultSheet?.id,
        template_sheet_id: defaultTemplateSheet?.id,
      });
      showSnackbar(
        translation("messages.parameters.order_template.success"),
        "success",
      );
    } catch (error) {
      showSnackbar(
        translation("messages.parameters.order_template.error"),
        "error",
      );
    }
  };

  const updateOrderSettings = async () => {
    await updateUsedSheetList();
    await updateProducerList();
    await updateOrderTemplate();
  };

  return (
    <div>
      <div style={{ padding: "2rem" }}>
        <div className="page-head__title">
          <h1 className="h1">
            {translation("navbar.profile.parameters.order_template.title")}
          </h1>
        </div>
      </div>
      {userRights?.order_p_default_type && (
        <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <h2 className="h2">
              {translation(
                "navbar.profile.parameters.order_template.settings.order_type.default_order_type",
              )}
            </h2>
            <SimpleSelect
              defaultValue={defaultOrderType}
              setDefaultValue={setDefaultOrderType}
              choices={orderTypeChoices}
            />
          </div>
        </div>
      )}
      {userRights?.order_p_default_location && (
        <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <h2 className="h2">
              {translation(
                "navbar.profile.parameters.order_template.settings.pickup_location.default_pickup_location",
              )}
            </h2>
            <SimpleSelect
              defaultValue={defaultPickupLocation}
              setDefaultValue={setDefaultPickupLocation}
              choices={pickupLocationChoices}
            />
          </div>
        </div>
      )}
      {userRights?.order_p_default_deadLine && (
        <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <h2 className="h2">
              {translation(
                "navbar.profile.parameters.order_template.settings.deadline_type.default_deadline_type",
              )}
            </h2>
            <SimpleSelect
              defaultValue={defaultDeadlineType}
              setDefaultValue={setDefaultDeadlineType}
              choices={deadlineTypeChoices}
            />
          </div>
        </div>
      )}
      {userRights?.order_p_material_selector && (
        <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
          <SheetParameters
            idValuesSheets={idValuesSheets}
            setIdValuesSheets={setIdValuesSheets}
          />
        </div>
      )}
      {userRights?.order_p_default_doctor && (
        <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
          <DoctorParameters />
        </div>
      )}
      {userRights?.order_p_default_type && ""}

      <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
        <ProducerParameters
          idValuesProducers={idValuesProducers}
          setIdValuesProducers={setIdValuesProducers}
        />
      </div>
      <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
        <button
          className="btn-table-primary text-center"
          type="button"
          onClick={() => updateOrderSettings()}
          style={{ marginTop: "10px" }}
        >
          {translation("navbar.profile.parameters.order_template.button")}
        </button>
      </div>
    </div>
  );
}
