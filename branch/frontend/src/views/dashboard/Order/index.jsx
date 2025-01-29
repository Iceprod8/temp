import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@inplan/AppContext";
import { useDashboardContext } from "@inplan/views/dashboard/Context";
import SelectField from "@inplan/common/SelectField";
import NotesField from "@inplan/common/NotesField";
import styles from "@inplan/common/Form/styles";
import DateField from "@inplan/common/DateField";

import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import {
  deadlineTypeChoices,
  orderTypeChoices,
  pickupLocationChoices,
  producerTypeChoices,
} from "@inplan/common/orderTemplateChoices";

import Aligners from "./Aligners";
import Retainers from "./Retainers";

// const MODELTYPES = ["SETUP", "ALIGNER", "CLIN_CHECK", "RETAINER", "IMPORT", "OTHER"];

const FIELDS = {
  0 /* SETUP */: [
    "producer_type",
    "producer",
    "type",
    "doctor",
    "setup",
    "deadline",
    "note",
  ],
  1 /* ALIGNER */: [
    "producer_type",
    "producer",
    "type",
    "doctor",
    "setup",
    "pickup",
    "sheet",
    "deadline",
    "aligners",
    "upperlower",
    "note",
  ],
  2 /* CLIN_CHECK */: [
    "producer_type",
    "producer",
    "type",
    "setup",
    "deadline",
    "note",
  ],
  3 /* RETAINER */: [
    "producer_type",
    "producer",
    "type",
    "doctor",
    "setup",
    "pickup",
    "sheet",
    "deadline",
    "retainers",
    "upperlower",
    "note",
  ],
  4 /* IMPORT */: [
    "producer_type",
    "producer",
    "type",
    "setup",
    "deadline",
    "note",
  ],
  5 /* OTHER */: ["producer_type", "type", "deadline", "note"],
  6 /* NO_PROCESS */: ["setup", "sheet", "aligners", "upperlower", "note"],
};

export const OrderForm = ({ control, watch, getValues }) => {
  const { t: translation } = useTranslation();
  const { userData, userRights } = useAppContext();
  const { setups, sheets, doctors, producers } = useDashboardContext();
  const [open, setOpen] = useState(false);
  const [availableSetups, setAvailableSetups] = useState([]);

  // FIXME move and factorize
  const sheetList = sheets.map((s) => ({
    display_name: (
      <div>
        <span style={{ marginRight: 8 }}>{s.name}</span>
      </div>
    ),
    value: s.id,
  }));

  // FIXME move and factorize
  const doctorList = doctors.map((doc) => ({
    display_name: doc.appellation,
    value: doc.id,
  }));

  const producerList = producers.map((pro) => ({
    display_name: pro.name,
    value: pro.id,
  }));

  useEffect(
    () =>
      setAvailableSetups(
        setups
          .filter((s) => !s.is_archived)
          .map((s) => ({
            id: s.id,
            value: s.id,
            display_name: s.name,
          }))
      ),
    [setups]
  );

  let type = watch("type");
  if (userRights?.reduced_order_creation) {
    type = 6; // If doesn't have process, only a direct aligner order available.
    // Reduced order creation form is shown for those who do not have a process
  }

  const deadlineType = watch("deadline_type");

  function isVisible(name) {
    return FIELDS[type]?.includes(name);
  }

  const typePart = (
    <SelectField
      control={control}
      data={{
        name: "type",
        label: `${translation("dashboard.orders.form.fields.type")}`,
        choices: orderTypeChoices,
      }}
      open={open}
      setOpen={setOpen}
    />
  );

  const producerTypePart = (
    <SelectField
      control={control}
      data={{
        name: "producer_type",
        label: `${translation("dashboard.orders.form.fields.producer_type")}`,
        choices: producerTypeChoices,
      }}
      open={open}
      setOpen={setOpen}
    />
  );

  const producerPart = (
    <SelectField
      control={control}
      data={{
        name: "producer",
        label: `${translation("dashboard.orders.form.fields.producer")}`,
        choices: producerList,
      }}
      open={open}
      setOpen={setOpen}
    />
  );

  const setupPart = (
    <SelectField
      control={control}
      data={{
        name: "setup",
        label: `${translation("dashboard.orders.form.fields.setup")}`,
        choices: [
          ...availableSetups,
          { display_name: "+ New setup", value: "+" },
        ],
      }}
      open={open}
      setOpen={setOpen}
    />
  );

  const doctorPart = (
    <SelectField
      control={control}
      data={{
        name: "doctor",
        label: `${translation("dashboard.orders.form.fields.doctor")}`,
        choices: doctorList,
      }}
      open={open}
      setOpen={setOpen}
    />
  );

  const pickupPart = (
    <>
      <SelectField
        control={control}
        data={{
          name: "pickup_location",
          label: `${translation("dashboard.orders.form.fields.pickup")}`,
          choices: pickupLocationChoices,
        }}
        open={open}
        setOpen={setOpen}
      />
    </>
  );

  const sheetPart = (
    <>
      <SelectField
        control={control}
        data={{
          name: "sheet",
          label: `${translation("dashboard.orders.form.fields.sheet")}`,
          choices: sheetList,
        }}
        open={open}
        setOpen={setOpen}
      />
    </>
  );

  const deadLinePart = (
    <div className="">
      <div
        style={{
          ...styles.flexFullCentered,
          alignItems: "baseline",
          flexDirection: "column",
          marginBottom: "14px",
        }}
      >
        <SelectField
          control={control}
          data={{
            name: "deadline_type",
            label: `${translation(
              "dashboard.orders.form.fields.deadline_type"
            )}`,
            choices: deadlineTypeChoices,
          }}
          open={open}
          setOpen={setOpen}
        />
      </div>
      {deadlineType === 2 && (
        <DateField
          data={{
            name: "deadline",
            label: "Date",
          }}
          control={control}
        />
      )}
    </div>
  );

  const notePart = (
    <div className="">
      <NotesField
        data={{
          name: "note",
          label: `${translation("dashboard.orders.form.fields.note")}`,
        }}
        control={control}
      />
    </div>
  );

  return (
    <>
      <div
        className="flex flex-wrap alignItems-center"
        style={{ justifyContent: "center" }}
      >
        {producerList?.length > 0 && producerList[0].value !== "0" && (
          <div>
            <div
              className=""
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                marginTop: "7px",
                marginBottom: "10px",
              }}
            >
              {userRights?.order_creation &&
                isVisible("producer_type") &&
                producerTypePart}
            </div>
            <div
              className=""
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                marginTop: "7px",
                marginBottom: "10px",
              }}
            >
              {userRights?.order_creation &&
                getValues("producer_type") === 1 &&
                isVisible("producer") &&
                producerPart}
            </div>
          </div>
        )}
        <div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {userRights?.order_creation && isVisible("type") && typePart}
          </div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {userRights?.order_creation && isVisible("doctor") && doctorPart}
          </div>
        </div>

        <div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {(userRights?.order_creation ||
              userRights?.reduced_order_creation) &&
              isVisible("setup") &&
              setupPart}
          </div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {userRights?.order_creation && isVisible("pickup") && pickupPart}
          </div>
        </div>
        <div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {(userRights?.order_creation ||
              userRights?.reduced_order_creation) &&
              isVisible("sheet") &&
              sheetPart}
          </div>
          <div
            className=""
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "7px",
              marginBottom: "10px",
            }}
          >
            {userRights?.order_creation &&
              isVisible("deadline") &&
              deadLinePart}
          </div>
        </div>
        {(userRights?.order_creation || userRights?.reduced_order_creation) &&
          isVisible("aligners") && (
            <Aligners control={control} getValues={getValues} setups={setups} />
          )}
        {userRights?.order_creation && isVisible("retainers") && (
          <Retainers control={control} getValues={getValues} setups={setups} />
        )}
        <div>
          {(userRights?.order_creation || userRights?.reduced_order_creation) &&
            isVisible("note") &&
            notePart}
        </div>
      </div>
    </>
  );
};

export default OrderForm;
