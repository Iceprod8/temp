import React, { useState } from "react";

import Form from "@inplan/common/Form";
import DateField from "@inplan/common/DateField";
import SelectField from "@inplan/common/SelectField";

import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import AppointmentsTable from "./AppointmentsTable";
import { useDashboardContext } from "./Context";

const AppointmentsForm = ({ control }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="order-options-list-container">
      <div style={{ marginRight: "10px" }} data-test="appointmentDate">
        <DateField
          data={{
            name: "date",
            label: (
              <CustomTranslation text="dashboard.appointments.form.fields.appointment_date" />
            ),
          }}
          control={control}
        />
      </div>
      <div style={{ marginLeft: "10px" }}>
        <SelectField
          data={{
            name: "type",
            label: (
              <CustomTranslation text="dashboard.appointments.form.fields.type" />
            ),
            choices: [
              {
                display_name: (
                  <CustomTranslation text="utilities.placeAppointmentOptions.other" />
                ),
                value: 0,
              },
              {
                display_name: (
                  <CustomTranslation text="utilities.placeAppointmentOptions.sit" />
                ),
                value: 1,
              },
              {
                display_name: (
                  <CustomTranslation text="utilities.placeAppointmentOptions.reception" />
                ),
                value: 2,
              },
            ],
          }}
          open={open}
          setOpen={setOpen}
          control={control}
        />
      </div>
      <SelectField
        data={{
          name: "task",
          label: (
            <CustomTranslation text="dashboard.appointments.form.fields.task" />
          ),
          choices: [
            {
              display_name: (
                <CustomTranslation text="utilities.taskTypeOptions.scan" />
              ),
              value: 0,
            },
            {
              display_name: (
                <CustomTranslation text="utilities.taskTypeOptions.treatment_plan" />
              ),
              value: 1,
            },
            {
              display_name: (
                <CustomTranslation text="utilities.taskTypeOptions.aligner" />
              ),
              value: 2,
            },
            {
              display_name: (
                <CustomTranslation text="utilities.taskTypeOptions.retainer" />
              ),
              value: 3,
            },
          ],
        }}
        open={open}
        setOpen={setOpen}
        control={control}
      />
    </div>
  );
};

export default function DashboardControlAppointments() {
  const { patient, createAppointment, fetchPatientOrders } =
    useDashboardContext();

  const onSubmit = async (data) => {
    await createAppointment(patient.id, data);
    fetchPatientOrders();
    return true;
  };

  //   const offset = yourDate.getTimezoneOffset()
  // yourDate = new Date(yourDate.getTime() - (offset*60*1000))
  // return yourDate.toISOString().split('T')[0]

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultDate = new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd

  return (
    <div className="dashboard-control__body">
      <Form
        subject="Appointment"
        titles={{
          submit: (
            <CustomTranslation text="dashboard.appointments.form.button" />
          ),
          general: "Appointment to create",
        }}
        FormContent={AppointmentsForm}
        onSubmit={onSubmit}
        defaultValues={{
          date: defaultDate,
          type: 0,
          task: 2,
        }}
      />
      <AppointmentsTable />
    </div>
  );
}
