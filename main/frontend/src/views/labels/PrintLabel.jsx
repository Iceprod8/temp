import React from "react";
import { useTranslation } from "react-i18next";
import { toReadableDateString } from "@inplan/adapters/functions";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";

function capitalizeText(text) {
  return text.toUpperCase();
}

function formatDeadline(order) {
  let dateResult = "";
  if (order.deadline) {
    const deadLineDate = new Date(order.deadline);
    dateResult = toReadableDateString(deadLineDate);
  }
  return dateResult;
}

export function OrderLabel({ order, labelDescription }) {
  // const { patient, address } = extract(order.patient);
  // const uppercasePatientLastName = capitalizeText(patient.last_name);
  const { t: translation } = useTranslation();
  const uppercasePatientLastName = capitalizeText(order.last_name);
  const formatedDeadline = formatDeadline(order);
  // const deliveryChoices = { 0: "Clinic", 1: "Reception", 2: "Home" };
  const deliveryChoices = {
    0: translation("utilities.deliveryOptions.clinic"),
    1: translation("utilities.deliveryOptions.reception"),
    2: translation("utilities.deliveryOptions.home"),
    3: translation("utilities.deliveryOptions.other"),
  };
  const deliveryPlace = deliveryChoices[order.pickup_location];

  // TODO remove duplicate
  const has_aligner_top =
    order.start_aligner_top >= 0 &&
    order.end_aligner_top >= order.start_aligner_top;
  const has_aligner_bottom =
    order.start_aligner_bottom >= 0 &&
    order.end_aligner_bottom >= order.start_aligner_bottom;

  const top_description = `U ${order.start_aligner_top} -> ${order.end_aligner_top}`;
  const bottom_description = `L ${order.start_aligner_bottom} -> ${order.end_aligner_bottom}`;

  const no_top = <CustomTranslation text="laboratory.print.no_top_aligner" />;
  const no_bottom = (
    <CustomTranslation text="laboratory.print.no_bottom_aligner" />
  );

  const displayText1 = labelDescription.text_1_position_order === 1;
  const displayText2 = labelDescription.text_2_position_order === 1;
  const displayText3 = labelDescription.text_3_position_order === 1;
  const displayText4 = labelDescription.text_4_position_order === 1;
  const displayLastName = labelDescription.last_name_position_order === 1;
  const displayFirstName = labelDescription.first_name_position_order === 1;
  const displayId = labelDescription.patient_identifier_position_order === 1;
  const displayOffice = labelDescription.office_position_order === 1;
  const displayDoctor = labelDescription.doctor_position_order === 1;
  const displayUpperDetail = labelDescription.upper_detail_position_order === 1;
  const displayLowerDetail = labelDescription.lower_detail_position_order === 1;
  const displaySheet = labelDescription.sheet_position_order === 1;
  const displayDeadline = labelDescription.deadline_position_order === 1;
  const displayNote = labelDescription.note_position_order === 1;
  const displayDeliveryPlace =
    labelDescription.delivery_place_position_order === 1;

  const text1Content = labelDescription.text_1_content_order;
  const text2Content = labelDescription.text_2_content_order;
  const text3Content = labelDescription.text_3_content_order;
  const text4Content = labelDescription.text_4_content_order;

  return (
    <div className="printer-label">
      <div />

      {displayOffice && order.office_name && order.office_name !== "" ? (
        <div>{order.office_name}</div>
      ) : null}

      {displayText1 && text1Content !== "" ? <div>{text1Content}</div> : null}
      {displayText2 && text2Content !== "" ? <div>{text2Content}</div> : null}

      {displayFirstName || displayLastName ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.patient" />
          {": \u00A0"}
          <span style={{ fontSize: "1.5em" }}>
            {(displayLastName && uppercasePatientLastName) || ""}{" "}
            {(displayFirstName && order.first_name) || ""}{" "}
          </span>
        </div>
      ) : null}
      {displayId &&
      order.patient_identifier &&
      order.patient_identifier !== "" ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.identifier" />
          {": \u00A0"}
          <span style={{ fontSize: "1.5em" }}> {order.patient_identifier}</span>
        </div>
      ) : null}
      {order.deadline && displayDeadline ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.deadline" />
          {": \u00A0"}
          <span style={{ fontSize: "1.25em" }}> {formatedDeadline}</span>
        </div>
      ) : null}

      {displayDoctor &&
      order.doctor_name &&
      order.doctor_name !== "Unspecified" ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.practitioner" />
          {": \u00A0"} {order.doctor_name}
        </div>
      ) : null}

      {displayUpperDetail ? (
        <div>
          {has_aligner_top ? <> {top_description} </> : <> {no_top} </>}
        </div>
      ) : null}

      {displayLowerDetail ? (
        <div>
          {has_aligner_bottom ? (
            <> {bottom_description} </>
          ) : (
            <> {no_bottom} </>
          )}
        </div>
      ) : null}

      {displaySheet && order.sheetDesc ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.material" />
          {":\u00A0"}
          {order.sheetDesc.name}
        </div>
      ) : null}

      {displayDeliveryPlace ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.delivery" />
          {":\u00A0"}
          {deliveryPlace}
        </div>
      ) : null}

      {displayText3 && text3Content !== "" ? <div>{text3Content}</div> : null}
      {displayText4 && text4Content !== "" ? <div>{text4Content}</div> : null}
    </div>
  );
}

export default function PrintLabel({ rank, order, labelDescription }) {
  const { t: translation } = useTranslation();
  const uppercasePatientLastName = capitalizeText(order.last_name);

  const has_aligner_top =
    order.start_aligner_top >= 0 &&
    order.end_aligner_top >= order.start_aligner_top;
  const has_aligner_bottom =
    order.start_aligner_bottom >= 0 &&
    order.end_aligner_bottom >= order.start_aligner_bottom;

  const top_description = `(U ${order.start_aligner_top} -> ${order.end_aligner_top})`;
  const no_top = <CustomTranslation text="laboratory.print.no_top_aligner" />;
  const bottom_description = `(L ${order.start_aligner_bottom} -> ${order.end_aligner_bottom})`;
  const no_bottom = (
    <CustomTranslation text="laboratory.print.no_bottom_aligner" />
  );

  // const delivery = { 0: "Clinic", 1: "Reception", 2: "Home" };
  const delivery = {
    0: translation("utilities.deliveryOptions.clinic"),
    1: translation("utilities.deliveryOptions.reception"),
    2: translation("utilities.deliveryOptions.home"),
    3: translation("utilities.deliveryOptions.other"),
  };
  const formatedDeadline = formatDeadline(order);

  const displayText1 = labelDescription.text_1_position_bag === 1;
  const displayText2 = labelDescription.text_2_position_bag === 1;
  const displayText3 = labelDescription.text_3_position_bag === 1;
  const displayText4 = labelDescription.text_4_position_bag === 1;
  const displayLastName = labelDescription.last_name_position_bag === 1;
  const displayFirstName = labelDescription.first_name_position_bag === 1;
  const displayId = labelDescription.patient_identifier_position_bag === 1;
  const displayOffice = labelDescription.office_position_bag === 1;
  const displayDoctor = labelDescription.doctor_position_bag === 1;
  const displayRank = labelDescription.rank_position_bag === 1;
  const displayUpperDetail = labelDescription.upper_detail_position_bag === 1;
  const displayLowerDetail = labelDescription.lower_detail_position_bag === 1;
  const displaySheet = labelDescription.sheet_position_bag === 1;
  const displayDeadline = labelDescription.deadline_position_bag === 1;
  const displayNote = labelDescription.note_position_bag === 1;
  const displayDeliveryPlace =
    labelDescription.delivery_place_position_bag === 1;

  const text1Content = labelDescription.text_1_content_bag;
  const text2Content = labelDescription.text_2_content_bag;
  const text3Content = labelDescription.text_3_content_bag;
  const text4Content = labelDescription.text_4_content_bag;

  return (
    <div className="printer-label">
      {displayOffice && order.office_name && order.office_name !== "" ? (
        <div>{order.office_name}</div>
      ) : null}

      {displayText1 && text1Content !== "" ? <div>{text1Content}</div> : null}
      {displayText2 && text2Content !== "" ? <div>{text2Content}</div> : null}

      {displayFirstName || displayLastName ? (
        <div style={{ fontSize: "1.25em" }} className="flex">
          <CustomTranslation text="laboratory.print.patient" />
          {": \u00A0"}
          {(displayLastName && uppercasePatientLastName) || ""}{" "}
          {(displayFirstName && order.first_name) || ""}
        </div>
      ) : null}
      {displayId &&
      order.patient_identifier &&
      order.patient_identifier !== "" ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.identifier" />
          {": \u00A0"} {order.patient_identifier}
        </div>
      ) : null}
      {order.deadline && displayDeadline ? (
        <div>
          <div>Date : {formatedDeadline}</div>
        </div>
      ) : null}
      {displayDoctor &&
      order.doctor_name &&
      order.doctor_name !== "Unspecified" ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.practitioner" />
          {": \u00A0"} {order.doctor_name}
        </div>
      ) : null}

      <div className="flex">
        {displayRank ? (
          <span style={{ fontSize: "1.75em" }}>
            {"N° "}
            {rank}{" "}
          </span>
        ) : null}

        {displayUpperDetail ? (
          <span style={{ fontSize: "1em" }}>
            {has_aligner_top ? <> {top_description} </> : <> {no_top} </>}
          </span>
        ) : null}

        {displayUpperDetail && displayLowerDetail ? (
          <span style={{ fontSize: "1em" }}>{"\u00A0-\u00A0"}</span>
        ) : null}

        {displayLowerDetail ? (
          <span style={{ fontSize: "1em" }}>
            {has_aligner_bottom ? <>{bottom_description} </> : <>{no_bottom}</>}
          </span>
        ) : null}
      </div>

      {displaySheet && order.sheetDesc ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.material" />
          {": \u00A0"} {order.sheetDesc.name}
        </div>
      ) : null}
      {displayDeliveryPlace ? (
        <div className="flex">
          <CustomTranslation text="laboratory.print.delivery" />
          {": \u00A0"} {delivery[order.pickup_location]}
        </div>
      ) : null}

      {displayText3 && text3Content !== "" ? <div>{text3Content}</div> : null}
      {displayText4 && text4Content !== "" ? <div>{text4Content}</div> : null}
    </div>
  );
}

export function PrintAddressLabel({ patient }) {
  return (
    <div className="printer-label">
      <div className="flex">
        {patient?.last_name?.toUpperCase()} {patient?.first_name}
      </div>
      <div className="flex">{patient?.postal_address?.address_line1}</div>
      <div className="flex">{patient?.postal_address?.address_line2}</div>
      <div className="flex">
        {patient?.postal_address?.zip} {patient?.postal_address?.city}
      </div>
      <div className="flex">{patient?.postal_address?.country}</div>
    </div>
  );
}
