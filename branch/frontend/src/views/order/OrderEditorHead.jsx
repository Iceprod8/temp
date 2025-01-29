import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { TbPaperBag } from "react-icons/tb";
import { GrTag } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";

import { Button } from "@mui/material";

import styles from "@inplan/common/Form/styles";

import {
  getOrderTypeOptions,
  orderStatusOptions,
  formatDate,
  sendToOrderLabel,
  sendToBagLabel,
  askForCancelOrder,
  askForPrintOrder,
  askForTerminateOrder,
} from "@inplan/views/order/OrderUtilities";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { SiBlueprint } from "react-icons/si";

function OrderEditorHead({
  order,
  patient,
  refreshFunction,
  topContentDesciption,
  bottomContentDescription,
}) {
  const { t: translation } = useTranslation();
  let formattedCreationDate = translation(
    "messages.common.loading_in_progress",
  );
  let formattedDeadlineDate = translation(
    "messages.common.loading_in_progress",
  );

  if (order) {
    formattedCreationDate = formatDate(order.creation_date, translation);
    formattedDeadlineDate = formatDate(order.deadline, translation);
  }

  const myOrderTypeOptions = getOrderTypeOptions(translation);
  return (
    <>
      {order && (
        <>
          {/* TOP LEVEL WITH GENERAL INFORMATION AND ACTION */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/*  GENERAL INFORMATION ON THE TOP LEFT */}
            <div style={{ textAlign: "left", flexBasis: "70%" }}>
              {/* DESCIPTION LINE */}
              <div style={styles.onTopStyle}>
                {myOrderTypeOptions[order.type]}
                {translation("orderedit.header.order_created")}
                {formattedCreationDate}
              </div>
              {patient && (
                <>
                  {/* PATIENT LINE */}

                  {patient.identifier !== "" ? (
                    <div style={styles.onTopStyle} className="flex">
                      <CustomTranslation text="orderedit.header.identifier" />
                      {"\u00A0:\u00A0"}
                      <Link to={`/dashboard/${patient?.id}/orders`}>
                        {patient.identifier}
                      </Link>
                    </div>
                  ) : null}
                  <div style={styles.onTopStyle} className="flex">
                    <CustomTranslation text="orderedit.header.last_name" />
                    {"\u00A0:\u00A0"}
                    <Link to={`/dashboard/${patient.id}/orders`}>
                      {patient.last_name}
                    </Link>
                  </div>
                  <div style={styles.onTopStyle} className="flex">
                    <CustomTranslation text="orderedit.header.first_name" />
                    {"\u00A0:\u00A0"}
                    <Link to={`/dashboard/${patient.id}/orders`}>
                      {patient.first_name}
                    </Link>
                  </div>
                </>
              )}

              {/* STATUS LINE */}
              <div style={styles.onTopStyle} className="flex">
                <CustomTranslation text="orderedit.header.order_status" />
                {"\u00A0:\u00A0"}
                {orderStatusOptions[order.status]}
                {/* {", "}
                {order.is_started ? (
                  <>
                    <CustomTranslation text="orderedit.header.production_started" />
                  </>
                ) : (
                  <>
                    <CustomTranslation text="orderedit.header.production_not_started" />
                  </>
                )} */}
              </div>

              {/* CONTENT DESCRIPTION */}
              {topContentDesciption && (
                <div style={styles.onTopStyle}>{topContentDesciption}</div>
              )}
              {bottomContentDescription && (
                <div style={styles.onTopStyle}>{bottomContentDescription}</div>
              )}
              {order.producer && (
                <div
                  style={styles.onTopStyle}
                  className="flex alignItems-center"
                >
                  <CustomTranslation text="orderedit.header.producer" />
                  {"\u00A0:\u00A0"}
                  <a
                    className="btn-tertiary"
                    target="_blank"
                    rel="noreferrer"
                    href={`${order.producer_url}`}
                  >
                    {order.producer_name}
                  </a>
                </div>
              )}
            </div>

            {/*  GENERAL ACTIONS ON THE TOP RIGHT */}
            <div style={{ textAlign: "right", flexBasis: "48%" }}>
              <div style={styles.onTopStyle}>
                <Button
                  style={{ width: 280 }}
                  variant="contained"
                  onClick={() =>
                    askForPrintOrder(order, refreshFunction, translation)
                  }
                  data-test="launch-printing"
                >
                  <SiBlueprint
                    style={{ fontSize: "150%", marginRight: "10px" }}
                  />
                  <CustomTranslation text="orderedit.buttons.launch_printing" />
                </Button>
              </div>
              <div style={styles.onTopStyle}>
                <Button
                  variant="outlined"
                  style={{
                    width: 280,
                    backgroundColor: "green",
                    color: "white",
                    border: "1px solid green",
                    cursor: "pointer",
                    fontFamily: "Source Sans Pro",
                    fontWeight: 600,
                  }}
                  data-test="validate"
                  onClick={() => {
                    askForTerminateOrder(order, refreshFunction, translation);
                  }}
                >
                  <BsFillClipboardCheckFill
                    style={{ fontSize: "150%", marginRight: "10px" }}
                  />

                  <CustomTranslation text="orderedit.buttons.terminate_orders" />
                </Button>
              </div>
              <div style={styles.onTopStyle}>
                <Button
                  style={{
                    width: 280,
                    border: "2px solid #ef5350",
                    backgroundColor: "#ef5350",
                    color: "white",
                    fontFamily: "Source Sans Pro",
                    fontWeight: 600,
                  }}
                  variant="outlined"
                  onClick={() =>
                    askForCancelOrder(order, refreshFunction, translation)
                  }
                  data-test="cancel-order"
                >
                  <GiCancel style={{ fontSize: "150%", marginRight: "10px" }} />
                  <CustomTranslation text="orderedit.buttons.cancel_order" />
                </Button>
              </div>
              <div style={styles.onTopStyle}>
                <Button
                  style={{ width: 280 }}
                  variant="contained"
                  onClick={() => sendToOrderLabel(order.id)}
                  data-test="launch-printing"
                >
                  <GrTag style={{ fontSize: "150%", marginRight: "10px" }} />
                  <CustomTranslation text="orderedit.buttons.order_label" />
                </Button>
              </div>
              <div style={styles.onTopStyle}>
                <Button
                  style={{ width: 280 }}
                  variant="contained"
                  onClick={() => sendToBagLabel(order.id)}
                  data-test="launch-printing"
                >
                  <TbPaperBag
                    style={{ fontSize: "150%", marginRight: "10px" }}
                  />
                  <CustomTranslation text="orderedit.buttons.bag_labels" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <p />
    </>
  );
}

export default OrderEditorHead;
