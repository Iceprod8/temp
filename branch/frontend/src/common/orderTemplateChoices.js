import React from "react";
import CustomTranslation from "./translation/CustomTranslation";

export const deadlineTypeChoices = [
  {
    display_name: <CustomTranslation text="utilities.deadline_type.today" />,
    value: 0,
  },
  {
    display_name: (
      <CustomTranslation text="utilities.deadline_type.next_appointment" />
    ),
    value: 1,
  },
  {
    display_name: (
      <CustomTranslation text="utilities.deadline_type.select_date" />
    ),
    value: 2,
  },
];

export const pickupLocationChoices = [
  {
    display_name: <CustomTranslation text="utilities.deliveryOptions.clinic" />,
    value: 0,
  },
  {
    display_name: (
      <CustomTranslation text="utilities.deliveryOptions.reception" />
    ),
    value: 1,
  },
  {
    display_name: <CustomTranslation text="utilities.deliveryOptions.home" />,
    value: 2,
  },
  {
    display_name: <CustomTranslation text="utilities.deliveryOptions.other" />,
    value: 3,
  },
];

export const orderTypeChoices = [
  {
    display_name: <CustomTranslation text="utilities.orderTypeOptions.setup" />,
    value: 0,
  },
  {
    display_name: (
      <CustomTranslation text="utilities.orderTypeOptions.aligner" />
    ),
    value: 1,
  },
  // { display_name: "Setup validation", value: 2 },
  // clin check = setup validation. This is an appointment with customer, not a command
  {
    display_name: (
      <CustomTranslation text="utilities.orderTypeOptions.retainer" />
    ),
    value: 3,
  },
  {
    display_name: <CustomTranslation text="utilities.orderTypeOptions.other" />,
    value: 5,
  },
];

export const producerTypeChoices = [
  {
    display_name: (
      <CustomTranslation text="utilities.producerTypeOptions.locally" />
    ),
    value: 0,
  },
  {
    display_name: (
      <CustomTranslation text="utilities.producerTypeOptions.externally" />
    ),
    value: 1,
  },
];
