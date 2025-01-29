import React, { useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";
import { BsCart4 } from "react-icons/bs";
import { FaListUl, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";
import { useOrders } from "@inplan/common/collections";
import { backend } from "@inplan/adapters/apiCalls";
import getDetailedOrder from "@inplan/common/GetDetailedOrder";
import styles, { textFieldSx } from "@inplan/common/Form/styles";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";

import OrderEditorHead from "@inplan/views/order/OrderEditorHead";
import AlignerEditor from "@inplan/views/order/AlignerEditor";
import {
  getDeliveryOptions,
  generateAlignersDesciptions,
  getSheets,
  // getDoctors,
  formatDate,
} from "@inplan/views/order/OrderUtilities";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import en from "date-fns/locale/en-GB";
import getCurrentLanguage from "@inplan/common/translation/CurrentLanguage";

registerLocale("fr", fr);
registerLocale("en", en);

const OrderEditor = ({ orderId }) => {
  const ln = getCurrentLanguage();
  const [order, setOrder] = useState(null);
  const [formData, setFormData] = useState(null);
  const { t: translation } = useTranslation();

  // Fixme, common function
  const [sheetsList, setSheetsList] = useState([]);
  const [sheetsDict, setsheetsDict] = useState({});
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorsDict, setDoctorsDict] = useState({});
  const [patient, setPatient] = useState(null);
  const [topContentDesciption, setTopContentDesciption] = useState(null);
  const [bottomContentDescription, setBottomContentDescription] =
    useState(null);

  const { fetchItem: fetchOrder } = useOrders({
    fetchItem: {},
  });

  // handle Deadline
  let formattedDeadlineDate = translation(
    "messages.common.loading_in_progress"
  );
  formattedDeadlineDate = formatDate(order?.deadline, translation);

  const [date, setDate] = useState(new Date());
  useEffect(() => {
    if (order?.deadline_type !== 1) {
      setFormData({
        ...formData,
        deadline: date,
        deadline_type: 2,
      });
    }
  }, [date]);

  // Function updating all order fields from backend
  const refreshOrder = async () => {
    if (!orderId) return;

    const fetchedOrder = await fetchOrder(orderId);
    if (!fetchedOrder) return;

    const getPatientResponse = await backend.get(
      `patients/${fetchedOrder.patient}`
    );

    setPatient(getPatientResponse.data);
    try {
      // SHEETS                                                   SHEETS
      await getSheets(setSheetsList, setsheetsDict, translation);

      if (!Array.isArray(setSheetsList)) {
        throw new Error("Invalid sheets list returned from getSheets.");
      }
      if (typeof setsheetsDict !== "object" || setsheetsDict === null) {
        throw new Error("Invalid sheets dictionary returned from getSheets.");
      }
      // DOCTORS                                                   DOCTORS
      // await getDoctors(setDoctorsList, setDoctorsDict, translation);
      if (!Array.isArray(setDoctorsList)) {
        throw new Error("Invalid doctors list returned from getDoctors.");
      }
      if (typeof setDoctorsDict !== "object" || setDoctorsDict === null) {
        throw new Error("Invalid doctors dictionary returned from getDoctors.");
      }
      console.log(
        "getSheets and getDoctors executed successfully and returned valid data."
      );
    } catch (error) {
      console.error(
        "Validation failed after calling getSheets or getDoctors:",
        error
      );
    }

    const detailedOrder = await getDetailedOrder(fetchedOrder, translation);

    generateAlignersDesciptions(
      detailedOrder,
      setTopContentDesciption,
      setBottomContentDescription,
      translation
    );

    // should be filled with undefined if null
    // Only editable data
    setFormData({
      doctor: detailedOrder.doctor,
      pickup_location: detailedOrder.pickup_location,
      sheet: detailedOrder.sheet,
      notes: detailedOrder.last_note,
      deadline: detailedOrder.deadline
        ? new Date(detailedOrder.deadline)
        : new Date(),
      deadline_type: detailedOrder.deadline_type,
    });

    // if producer_type is externally, add producer name and url to the order
    if (detailedOrder.producer_type === 1) {
      try {
        const { data: res } = await backend.get("producers/available");
        if (res.length !== 0) {
          for (let i = 0; i < res.length; i += 1) {
            if (res[i].id === detailedOrder.producer) {
              detailedOrder.producer_name = res[i]?.name;
              detailedOrder.producer_url = res[i]?.url;
            }
          }
        }
      } catch (error) {
        console.log("error get available", error);
      }
    }
    // Il y a une erreur sur cette ligne                      !!!!!                 !!!!
    setOrder(detailedOrder);
    // Il y a une erreur sur cette ligne              !!!!!                 !!!!
    console.log(detailedOrder);
  };

  // Initialize
  useEffect(async () => {
    if (!orderId) return;
    await refreshOrder();
  }, [orderId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (order.status === 3 || order.status === 4) {
      NotificationManager.warning(
        translation(
          "messages.orders.canceled_or_finished_order_cannot_be_modified"
        )
      );
    } else {
      try {
        // Create a new FormData object to update fields without conflicts
        const postProcessData = formData;
        // sentData.notes = [...order.notes, { body: formData.new_note }];
        if (postProcessData.doctor === null || postProcessData.doctor === "0") {
          delete postProcessData.doctor;
        }

        if (postProcessData.sheet === null || postProcessData.sheet === "0") {
          delete postProcessData.sheet;
        }

        if (postProcessData.deadline === null) {
          postProcessData.deadline = new Date();
        }

        if (postProcessData.deadline_type === 1) {
          delete postProcessData.deadline;
          delete postProcessData.deadline_type;
        }

        const jsonData = JSON.stringify(postProcessData);
        await backend.patch(`orders/${orderId}`, jsonData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // If sheet is changed, update the aligners
        await backend.post(`orders/${orderId}/update_aligners`);

        refreshOrder();
        NotificationManager.success(
          translation("messages.orders.order_updated")
        );
      } catch (error) {
        NotificationManager.error(
          translation("messages.orders.error_updating_order")
        );
        console.error("Error updating order:", error);
      }
    }
  };

  const getDoctors = async () => {
    const { data: res } = await backend.get("doctors/available");
    const doctorList = [
      {
        id: "0",
        appellation: capitalizeFirstLetter(
          translation("utilities.variables.unspecified")
        ),
      },
    ].concat(res);

    setDoctorsList(doctorList);

    const newDoctorDict = doctorList.reduce((newDict, doctor) => {
      return { ...newDict, [doctor.id]: doctor };
    }, {});

    setDoctorsDict(newDoctorDict);
    console.log(newDoctorDict);
  };
  // DOCTORS;
  // await getDoctors(setDoctorsList, setDoctorsDict, translation);

  useEffect(() => {
    getDoctors();
  }, []);
  const myDeliveryOptions = getDeliveryOptions(translation);

  return (
    <div>
      <div
        className="page-head__title flex alignItems-center justify-content-space-between"
        style={{
          marginLeft: "6px",
          marginRight: "10px",
        }}
      >
        <h1 className="h1">
          {translation("orderedit.title")}
          <BsCart4 />
        </h1>
        <div className="flex alignItems-center">
          {/* <FaUserCircle /> */}
          <FaListUl />
          <div
            style={{
              marginLeft: "6px",
            }}
          >
            <Link to={`/dashboard/${patient?.id}/orders`}>
              {translation("orderedit.patient_profile")}
            </Link>
          </div>
        </div>
      </div>
      {order && formData && (
        <div>
          <OrderEditorHead
            order={order}
            patient={patient}
            refreshFunction={refreshOrder}
            topContentDesciption={topContentDesciption}
            bottomContentDescription={bottomContentDescription}
          />
          {/* ORDER VALUE CHART */}
          <form onSubmit={handleSubmit}>
            <div name="chart" style={styles.containerStyle}>
              {/* Title Row */}
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.titles.element" />
              </div>
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.titles.current_value" />
              </div>
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.titles.new_value" />
              </div>
              {/* Doctor Row */}
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.columns.element.doctor" />
              </div>
              <div style={styles.infoCellStyle}>
                {order.doctor
                  ? doctorsDict[order.doctor]?.appellation
                  : doctorsDict["0"]?.appellation}
              </div>
              <div style={styles.infoCellStyle}>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                >
                  {Object.values(doctorsDict).map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor?.appellation}
                    </option>
                  ))}
                </select>
              </div>
              {/* SETUP ROW */}
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.columns.element.setup" />
              </div>
              <div style={styles.infoCellStyle}>{order.setup_name}</div>
              <div style={styles.infoCellStyle} />
              {/* DEADLINE ROW */}
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.columns.element.deadline" />
              </div>
              <div style={styles.infoCellStyle}>{formattedDeadlineDate}</div>
              <div style={styles.infoCellStyle}>
                {order?.deadline_type !== 1 ? (
                  <ReactDatePicker
                    name="deadline"
                    locale={ln}
                    dateFormat={translation(
                      "utilities.ReactDatePicker.dateFormat"
                    )}
                    showTimeSelect
                    timeCaption={translation(
                      "utilities.ReactDatePicker.timeCaption"
                    )}
                    timeFormat={translation(
                      "utilities.ReactDatePicker.timeFormat"
                    )}
                    timeIntervals={15}
                    selected={formData?.deadline}
                    onChange={(deadline) => setDate(deadline)}
                  />
                ) : (
                  translation("orderedit.header.no_deadline")
                )}
              </div>
              {/* PICKUP ROW */}
              <div style={styles.titleCellStyle}>
                <label>
                  <CustomTranslation text="orderedit.table.columns.element.pickup" />
                </label>
              </div>
              <div style={styles.infoCellStyle}>
                <label>{myDeliveryOptions[order.pickup_location]}</label>
              </div>
              <div style={styles.infoCellStyle}>
                <select
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                >
                  {Object.entries(myDeliveryOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {/* SHEET ROW */}
              <div style={styles.titleCellStyle}>
                <CustomTranslation text="orderedit.table.columns.element.sheet" />
              </div>
              <div style={styles.infoCellStyle}>
                {order.sheet
                  ? sheetsDict[order.sheet]?.name
                  : sheetsDict["0"]?.name}
              </div>
              <div style={styles.infoCellStyle}>
                <select
                  name="sheet"
                  value={formData.sheet}
                  onChange={handleChange}
                >
                  {Object.values(sheetsDict).map((sheet) => (
                    <option key={sheet.id} value={sheet.id}>
                      {sheet?.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* DEADLINE TYPE ROW */}
              {/* FIXME - to come with deadline management review 
            We want to be able to pick a specific date
            Deadline type should be clear: Immediate (creation date) - 
            */}
              {/* DEADLINE ROW */}
              {/* Validation Date ROW */}
            </div>
            {/* END OF GRID */}

            {/* NOTE UPDATE */}
            <div style={styles.onTopStyle} className="flex">
              <CustomTranslation text="orderedit.current_note" />:
            </div>
            <div style={styles.onTopStyle}>{order.last_note}</div>
            <div style={{ marginTop: "25px", marginBottom: "15px" }}>
              <TextField
                inputProps={{
                  sx: {
                    ...styles.fontSettings,
                    cursor: "pointer",
                  },
                }}
                autoFocus
                label={<CustomTranslation text="orderedit.current_note" />}
                variant="outlined"
                sx={textFieldSx}
                onChange={handleChange}
                multiline
                rows={4}
                value={formData.notes}
                name="notes"
                style={{
                  width: "80%",
                }}
              />
            </div>

            <button
              className="btn-table-primary text-center"
              type="submit"
              style={{ marginTop: "25px" }}
            >
              <CustomTranslation text="orderedit.buttons.save" />
            </button>
          </form>

          {/* ALIGNER PART */}
          <div className="page-head__title">
            <h1
              className="h1"
              style={{
                marginTop: "25px",
                marginBottom: "15px",
              }}
            >
              <CustomTranslation text="orderedit.table_edition.name" />
            </h1>
          </div>
          <div style={styles.alignerChartStyle}>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.position" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.rank" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.current_status" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.new_status" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.current_sheet" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.new_sheet" />
            </div>
            <div style={styles.titleCellStyle}>
              <CustomTranslation text="orderedit.table_edition.titles.save" />
            </div>
          </div>
          {order.aligners.map((alignerId) => (
            <AlignerEditor
              key={alignerId} // Assuming alignerId is unique
              alignerId={alignerId}
              order={order}
              sheetsDict={sheetsDict}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default OrderEditor;
