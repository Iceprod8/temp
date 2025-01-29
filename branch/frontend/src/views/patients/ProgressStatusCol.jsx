import React from "react";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";

export default function ProgressStatusCol({ patient, treatment_start: start }) {
  const PROGRESS_STATUS_OPTIONS = {
    0: (
      <CustomTranslation text="patients.table.progress_status_options.error" />
    ),
    1: (
      <CustomTranslation text="patients.table.progress_status_options.no_order_requested" />
    ),
    2: (
      <CustomTranslation text="patients.table.progress_status_options.setup_to_be_done" />
    ),
    3: (
      <CustomTranslation text="patients.table.progress_status_options.setup_in_progress" />
    ),
    4: (
      <CustomTranslation text="patients.table.progress_status_options.aligners_to_be_started" />
    ),
    5: (
      <CustomTranslation text="patients.table.progress_status_options.aligners_to_print" />
    ),
    6: (
      <CustomTranslation text="patients.table.progress_status_options.aligners_to_thermoform" />
    ),
    7: (
      <CustomTranslation text="patients.table.progress_status_options.aligners_to_cut" />
    ),
    8: (
      <CustomTranslation text="patients.table.progress_status_options.aligners_cutted" />
    ),
    9: (
      <CustomTranslation text="patients.table.progress_status_options.retainers_to_be_started" />
    ),
    10: (
      <CustomTranslation text="patients.table.progress_status_options.retainers_to_print" />
    ),
    11: (
      <CustomTranslation text="patients.table.progress_status_options.retainers_to_thermoform" />
    ),
    12: (
      <CustomTranslation text="patients.table.progress_status_options.retainers_to_cut" />
    ),
    13: (
      <CustomTranslation text="patients.table.progress_status_options.retainers_cutted" />
    ),
    14: (
      <CustomTranslation text="patients.table.progress_status_options.other_order_to_be_done" />
    ),
    15: (
      <CustomTranslation text="patients.table.progress_status_options.other_order_in_progress" />
    ),
    16: (
      <CustomTranslation text="patients.table.progress_status_options.no_order_left_in_progress" />
    ),
  };
  return <>{PROGRESS_STATUS_OPTIONS[patient.progress_status]}</>;
}
