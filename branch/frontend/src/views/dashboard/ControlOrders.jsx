/* eslint-disable prettier/prettier */

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { backend } from "@inplan/adapters/apiCalls";
import Form from "@inplan/common/Form";

import { useAppContext } from "@inplan/AppContext";

import Order from "./Order";
import OrdersInProgress from "./OrdersInProgress";
import { useDashboardContext } from "./Context";

function computeDeadline(data) {
  const computedDeadline = {
    0: new Date().toISOString(),
    1: undefined,
    2: data.deadline,
  }[data.deadline_type];
  return computedDeadline;
}

function postProcessData(data) {
  return {
    ...data,
    start_aligner_top: data.start_aligner_top || undefined,
    end_aligner_top: data.end_aligner_top || undefined,
    start_aligner_bottom: data.start_aligner_bottom || undefined,
    end_aligner_bottom: data.end_aligner_bottom || undefined,
    deadline: computeDeadline(data),
    deadline_type: [0, 1, 2].includes(data.deadline_type)
      ? data.deadline_type
      : undefined,
    pickup_location: data.pickup_location || undefined,
    setup: data.setup || undefined,
    sheet: data.sheet || undefined,
    status: 1,
  };
}

function getDefaultSetupValue(setups) {
  let returnValue = "+";
  const availableSetups = setups
    .filter((s) => !s.is_archived)
    .map((s) => ({
      value: s.id,
      rank: s.rank,
    }));
  if (availableSetups.length > 0) {
    const sortedSetups = availableSetups.sort((a, b) =>
      a.rank > b.rank ? -1 : 1
    );
    returnValue = sortedSetups[0].value;
  }
  return returnValue;
}

export default function DashboardControlOrders() {
  const { t: translation } = useTranslation();
  const {
    practitioner,
    defaultSheet,
    defaultDoctor,
    defaultDeadlineType,
    defaultPickupLocation,
    defaultOrderType,
    userRights,
  } = useAppContext();

  const {
    patient,
    createSetup,
    createOrder,
    setups,
    doctors,
    sheets,
    producers,
  } = useDashboardContext();

  const today = new Date();
  const date = today.setDate(today.getDate());
  const defaultDate = new Date(date).toISOString().split("T")[0]; // yyyy-mm-dd
  const defaultSetupValue = getDefaultSetupValue(setups);

  const [defaultValues, setDefaultValues] = useState({
    type: defaultOrderType !== null ? defaultOrderType : 1,
    pickup_location: defaultPickupLocation !== null ? defaultPickupLocation : 0,
    sheet:
      sheets?.length > 0
        ? defaultSheet
          ? sheets?.filter((sheet) => sheet.id === defaultSheet?.id).length > 0
            ? defaultSheet?.id
            : "0"
          : sheets[0].id
        : "0",
    deadline: defaultDate,
    deadline_type: defaultDeadlineType !== null ? defaultDeadlineType : 1, // next appointment
    start_aligner_top: "",
    end_aligner_top: "",
    start_aligner_bottom: "",
    end_aligner_bottom: "",
    multiplicity_top: "1",
    multiplicity_bottom: "1",
    aligners: [],
    upperLowerSelection: 0, // both upper and lower
    note: "",
    setup: defaultSetupValue,
    producer_type: 0,
    producer: producers?.length > 0 ? producers[0].id : "0",
    doctor:
      doctors?.length > 0
        ? defaultDoctor
          ? defaultDoctor.id
          : doctors[0].id
        : "0",
  });

  useEffect(
    () =>
      (async () => {
        const fieldsResult = await backend({
          method: "options",
          url: "orders",
        });
        if (!practitioner.order_template) return;

        const orderData = Object.entries(fieldsResult.data.actions.POST);

        const defltVals = {};
        orderData.forEach(([field]) => {
          const v = practitioner.order_template[field];
          if (v !== undefined && v !== null) {
            defltVals[field] = v;
          }
        });

        setDefaultValues({ ...defaultValues, ...defltVals });
      })(),
    [practitioner]
  );

  const onSubmit = async (data) => {
    console.log(data);
    // eslint-disable-next-line prefer-const
    let { setup, ...otherData } = data;

    // SET UP                                                         SET UP

    console.log("setup status :", setup);

    if (setup === undefined || setup === null || setup === "") {
      window.alert(
        translation("messages.orders.order_creation_requires_a_setup")
      );
      return null;
    }

    // "Setup + means create and associate a new setup"
    if (setup === "+" && otherData.type !== 5) {
      try {
        const res = await backend.get("setups/get_setup_by_name", {
          params: {
            name: "Auto Setup",
            patientId: patient?.id,
          },
        });
        setup = res?.data[0]?.id;
        console.log("setup if succes:", setup);
      } catch (error) {
        if (error.response.status === 404) {
          const { id } = await createSetup(patient.id, { name: "Auto Setup" });
          setup = id;
          console.log("setup if try faild and has to catch", setup);
        } else {
          console.log(error);
        }
      }
    }

    // FILLING                                                         FILLING
    // Retainer order specific treatment
    // Fill missing numbers from the form
    console.log("otherData type :", otherData.type);
    if (otherData.type === 3) {
      otherData.end_aligner_top = otherData.start_aligner_top;
      otherData.end_aligner_bottom = otherData.start_aligner_bottom;
    }
    console.log("otherData sheet :", otherData.sheet);
    // 0 means no sheet
    if (otherData.sheet === "0") {
      delete otherData.sheet;
    }
    console.log("otherData doctor :", otherData.doctor);
    // 0 means no doctor
    if (otherData.doctor === "0") {
      delete otherData.doctor;
    }
    console.log("otherData producer_type :", otherData.producer_type);
    // 0 means locally producer
    if (otherData.producer_type === 0) {
      delete otherData.producer;
    } else if (otherData.producer_type === 1 && otherData.producer === "0") {
      // If the producer_type is external, but there is no list of producers from which to choose
      return null;
    }

    let finalData = {};
    // remove setup from "other" orders
    if (otherData.type === 5) {
      console.log("remove setup from other orders");
      finalData = postProcessData(otherData);
    } else {
      finalData = postProcessData({ ...otherData, setup });
      console.log("keep setup");
    }

    const order = await createOrder(patient.id, finalData);
    console.log("created order:", order);
    // FINISH                                                               FINISH
    // For limited users, throw directly to the "models" tab
    // Those who do not have a process
    if (userRights?.reduced_order_creation) {
      try {
        const { id, aligners } = order;
        if (aligners.length > 0) {
          // validate command
          await backend.post(`orders/${id}/send_to_print`);
          const alignerList = aligners;
          const batch = {
            aligners: alignerList,
          };
          await backend.post(`printer_batches`, batch);
        }
      } catch (error) {
        console.log("error -> send to print", error);
      }
      // FIXME ELSE ERROR
    }
    console.log(!!order);
    return !!order;
  };

  const exclude_columns = () => {
    let fields_to_exclude = [
      "order_label_print",
      "bag_label_print",
      "producer_type",
    ];
    if (userRights?.reduced_order_creation) {
      const extra_fields_to_exclude = [
        "doctor_name",
        "pickup_location",
        "deadline",
        "producer_name",
      ];
      fields_to_exclude = fields_to_exclude.concat(extra_fields_to_exclude);
    }
    return fields_to_exclude;
  };

  return (
    <div className="dashboard-control__body">
      <Form
        FormContent={Order}
        titles={{
          submit: `${translation("dashboard.orders.form.button")}`,
          general: "Order to send",
        }}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        subject="Order"
      />
      <OrdersInProgress exclude={exclude_columns()} />
    </div>
  );
}
