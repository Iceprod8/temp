import React from "react";

import Form from "@inplan/common/Form";
import TextFieldBasic from "@inplan/common/TextFieldBasic";
import { backend } from "@inplan/adapters/apiCalls";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import SetupsTable from "./SetupsTable";
import { useDashboardContext } from "./Context";

const SetupsForm = ({ control }) => (
  <div className="order-options-list-container">
    <div style={{ marginRight: "10px" }}>
      <TextFieldBasic
        control={control}
        data={{
          name: "name",
          label: <CustomTranslation text="dashboard.setups.form.fields.name" />,
        }}
      />
    </div>
  </div>
);

export default function DashboardControlSetups() {
  const { patient, createSetup } = useDashboardContext();

  const onSubmit = async (data) => {
    try {
      const res = await backend.get("setups/get_setup_by_name", {
        params: {
          name: data?.name,
          patientId: patient?.id,
        },
      });
    } catch (error) {
      if (error.response.status === 404) {
        return createSetup(patient.id, data);
      }
    }
    return null;
  };

  return (
    <div className="dashboard-control__body">
      <Form
        subject="Setup"
        titles={{
          submit: <CustomTranslation text="dashboard.setups.form.button" />,
          general: "Setup to create",
        }}
        FormContent={SetupsForm}
        onSubmit={onSubmit}
        defaultValues={{ name: "Setup" }}
      />
      <SetupsTable />
    </div>
  );
}
