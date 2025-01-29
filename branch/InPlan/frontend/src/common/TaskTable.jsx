import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useAppContext } from "@inplan/AppContext";
import { DataGridPro, GridToolbar, useGridApiRef } from "@mui/x-data-grid-pro";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";

import { backend } from "@inplan/adapters/apiCalls";
import { useOrders } from "@inplan/common/collections";
import getOrderColumns from "@inplan/common/orderColumns";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import { mainColor } from "@inplan/common/Form/styles";
import { BsFillClipboardCheckFill } from "react-icons/bs";
import { SiBlueprint } from "react-icons/si";
import { GiCancel } from "react-icons/gi";
import CustomTranslation from "./translation/CustomTranslation";

const styles = {
  header: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    height: 80,
  },
  actionTerminate: {
    minWidth: 190,
    backgroundColor: "green",
    color: "white",
    border: "1px solid green",
    cursor: "pointer",
    fontFamily: "Source Sans Pro",
    fontWeight: 600,

    "&:hover": {
      backgroundColor: "green",
      color: "white",
      border: "1px solid green",
    },
  },
  actionButton: {
    width: 200,
    display: "flex",
    justifyContent: "center",
    margin: "0px 20px",
  },
};

const columns = (translation) => [
  {
    field: "patient_identifier",
    headerName: translation("dashboard.orders.table.titles.patient"),
    flex: 1.2,
    renderCell: (params) => (
      <Link
        to={`dashboard/${params.row.patient}/orders`}
        style={{ cursor: "pointer" }}
      >
        <div>
          {params.row.last_name}, {params.row.first_name}
        </div>
        <div>{params.row.patient_identifier}</div>
      </Link>
    ),
    valueGetter: ({ row }) =>
      `${row.last_name} ${row.first_name} ${row.patient_identifier}`,
  },
  {
    field: "patient_surname",
    headerName: translation("dashboard.orders.table.titles.last_name"),
    hide: true,
    flex: 1,
    align: "left",
    renderCell: (params) => (
      <Link
        to={`dashboard/${params.row.patient}/orders`}
        style={{ cursor: "pointer" }}
      >
        {params.row.last_name}
      </Link>
    ),
    valueGetter: ({ row }) => row.last_name,
  },
  {
    field: "patient_firstname",
    headerName: translation("dashboard.orders.table.titles.first_name"),
    hide: true,
    flex: 1,
    align: "left",
    renderCell: (params) => (
      <Link
        to={`dashboard/${params.row.patient}/orders`}
        style={{ cursor: "pointer" }}
      >
        {params.row.first_name}
      </Link>
    ),

    valueGetter: ({ row }) => row.first_name,
  },
  ...getOrderColumns(translation),
];

const TaskTable = ({
  exclude,
  creator,
  pendingStatus,
  finishedStatus,
  printingButton = true,
  filter = (x) => x,
}) => {
  const { t: translation } = useTranslation();
  const { fetchItems, updateItem, unsortedItems, total, loading } = useOrders();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowType, setSelectedRowType] = useState(null);
  const [queryParams, setQueryParams] = useState({
    // limit: 100,
    // offset: 0,
    filters: undefined,
    order: undefined,
    status: [1, 5, 6, 7, 8, 9],
    creator,
  });

  // Fixme, common function
  const { userData } = useAppContext();
  const [sheets, setSheets] = useState([]);
  const [sheetDict, setSheetDict] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorDict, setDoctorDict] = useState({});
  const [producers, setProducers] = useState([]);
  const [producerDict, setProducerDict] = useState({});
  const { userRights, getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);

  const userDoctors = userData.doctors;
  const getSheetList = async () => {
    const { data: res } = await backend.get("sheets");
    const sheetList = [
      {
        id: "0",
        name: "Undefined",
        provider: "Undefined",
        thickness: 0,
      },
    ].concat(res?.results);

    setSheets(sheetList);

    const newSheetDict = sheetList.reduce((newDict, sheet) => {
      return { ...newDict, [sheet.id]: sheet };
    }, {});

    setSheetDict(newSheetDict);
  };

  // Fixme, common function
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

    setDoctors(doctorList);

    const newDoctorDict = doctorList.reduce((newDict, doctor) => {
      return { ...newDict, [doctor.id]: doctor };
    }, {});

    setDoctorDict(newDoctorDict);
  };

  const getProducers = async () => {
    const { data: res } = await backend.get("producers/available");
    const producerList = [
      {
        id: "0",
        name: capitalizeFirstLetter(
          translation("utilities.producerTypeOptions.locally")
        ),
      },
    ].concat(res);

    setProducers(producerList);

    const newProducerDict = producerList.reduce((newDict, producer) => {
      return { ...newDict, [producer.id]: producer };
    }, {});

    setProducerDict(newProducerDict);
  };
  const completeOrders = () => {
    // If sheets or doctors are not updated, wait
    if (
      Object.keys(sheetDict).length === 0 ||
      Object.keys(doctorDict).length === 0
    )
      return;

    const newOrderList = [];

    unsortedItems.forEach(function (order) {
      const newOrder = order;

      // Update sheet
      if (
        newOrder.sheet &&
        newOrder.sheet !== null &&
        newOrder.sheet in sheetDict
      ) {
        newOrder.sheetDesc = sheetDict[newOrder.sheet];
      } else {
        newOrder.sheetDesc = sheetDict["0"];
      }

      // update doctor
      if (
        newOrder.doctor &&
        newOrder.doctor !== null &&
        newOrder.doctor in doctorDict
      ) {
        newOrder.doctor_name = doctorDict[newOrder.doctor].appellation;
      } else {
        newOrder.doctor_name = doctorDict["0"].appellation;
      }
      // update producer
      if (
        newOrder.producer &&
        newOrder.producer !== null &&
        newOrder.producer !== 0 &&
        newOrder.producer in producerDict
      ) {
        newOrder.producer_name = producerDict[newOrder.producer]?.name;
        newOrder.producer_url = producerDict[newOrder.producer]?.url;
      } else {
        // If the producer is not in the producer list and the producer_type is external
        newOrder.producer_name =
          newOrder.producer_type === 0 ? producerDict["0"]?.name : null;
      }
      // Save the updated order
      newOrderList.push(newOrder);
    });

    // Save the updated order list
    setCompletedOrders(newOrderList);
  };

  // Fixme obsolete
  const fetchOrderData = async (params) => {
    fetchItems(params);
  };

  const activePrintingButton = printingButton && true;

  const [displayPendingOrders, setDisplayPendingOrders] = useState(true);
  const [displayDelayOrders, setDisplayDelayOrders] = useState(true);

  const apiRef = useGridApiRef();

  const terminateOrders = async () => {
    if (selectedRows?.length === 0) {
      NotificationManager.error(
        translation("messages.orders.no_order_selected")
      );
      return;
    }
    const message = translation("messages.orders.terminate_order_confirmation");
    const confirmed = window.confirm(message);
    if (confirmed) {
      const waiters = selectedRows.map((row) =>
        backend.post(`orders/${row}/terminate`)
      );

      await Promise.all(waiters);

      if (selectedRows?.length > 0) {
        NotificationManager.success(
          translation("messages.orders.orders_have_been_terminated")
        );
      }
    }
  };

  // FIXME common function
  useEffect(() => {
    const updateOrderList = async () => {
      await getSheetList();
      await getDoctors();
      await getProducers();
      completeOrders();
    };
    updateOrderList();
  }, [unsortedItems]);

  // Manage unsynchronous update of sheets
  useEffect(() => {
    completeOrders();
  }, [doctorDict]);

  // Manage unsynchronous update of doctors
  useEffect(() => {
    completeOrders();
  }, [doctorDict]);

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      creator,
    });
  }, [creator]);

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      status: displayPendingOrders ? pendingStatus : finishedStatus,
    });
  }, [displayPendingOrders]);

  useEffect(() => {
    fetchOrderData(queryParams);
  }, [JSON.stringify(queryParams)]);

  useEffect(() => {
    if (selectedRows.length === 0) {
      setSelectedRowType(null);
    }
    if (selectedRows.length === 1) {
      const forder = completedOrders.find(
        (order) => order.id === selectedRows[0]
      );
      setSelectedRowType(forder.type);
    }
  }, [selectedRows]);

  const handlePrintButtonClick = async () => {
    try {
      if (selectedRows?.length === 0) {
        NotificationManager.error(
          translation("messages.orders.no_order_selected")
        );
        return;
      }
      const message = translation(
        "messages.orders.launch_printing_confirmation"
      );
      const confirmed = window.confirm(message);
      if (confirmed) {
        const futurs = selectedRows.map((row) =>
          backend.post(`orders/${row}/send_to_print`)
        );
        const res = await Promise.all(futurs);
        // To display the notification message per type just once, independently of the number of orders of each type.
        // [0] => Orders of type: Setup
        // [1] => Orders of type: Other
        // [2] => Orders not of type: Setup or Other
        const notifications = [0, 0, 0];
        for (let i = 0; i < res.length; i += 1) {
          if (
            notifications[0] !== 0 &&
            notifications[1] !== 0 &&
            notifications[2] !== 0
          ) {
            break;
          }
          if (res[i].data.type === 0 && notifications[0] === 0) {
            // if Order type is SETUP
            NotificationManager.success(
              translation("messages.orders.order_started", {
                type: "Setup",
              })
            );
            notifications[0] += 1;
          }
          if (res[i].data.type === 5 && notifications[1] === 0) {
            // if Order type is OTHER
            NotificationManager.success(
              translation("messages.orders.order_started", {
                type: translation("utilities.orderTypeOptions.other"),
              })
            );
            notifications[1] += 1;
          }
          if (
            res[i].data.type !== 0 &&
            res[i].data.type !== 5 &&
            notifications[2] === 0
          ) {
            // if Order type is not SETUP or OTHER
            NotificationManager.success(
              translation("messages.orders.models_available_in_models_tabs")
            );
            notifications[2] += 1;
          }
        }
        fetchOrderData(queryParams);
      }
    } catch (error) {
      console.error("Error handlePrintButtonClick:", error?.request);
      if (error?.request?.status === 400) {
        NotificationManager.error(
          translation("messages.orders.error_starting_order")
        );
      }
    }
  };

  const handleCancelOrderClick = async () => {
    try {
      if (selectedRows?.length === 0) {
        NotificationManager.error(
          translation("messages.orders.no_order_selected")
        );
        return;
      }
      const message = translation("messages.orders.cancel_order_confirmation");
      const confirmed = window.confirm(message);
      if (confirmed) {
        const futurs = selectedRows.map((row) =>
          backend.post(`orders/${row}/cancel`)
        );
        await Promise.all(futurs);
        fetchOrderData(queryParams);
        if (selectedRows?.length > 0) {
          NotificationManager.success(
            translation("messages.orders.orders_have_been_canceled")
          );
        }
      }
    } catch (error) {
      console.error("Error handleCancelOrderClick:", error);
    }
  };

  return (
    <div>
      <div className="page">
        <div
          className="flex alignItems-center"
          style={{
            justifyContent: "space-between",
          }}
        >
          <div className="page-head__title">
            <h1 className="h1">{translation("laboratory.title")}</h1>
          </div>
          <div className="flex alignItems-center">
            <div>
              <Button
                style={{ display: "none" }}
                data-test="showFilter"
                onClick={() => apiRef.current.showFilterPanel("type")}
              >
                {/* Show Filter. Use only by test to shortcut the filter menu opening */}
                {translation("laboratory.buttons.show_filter")}
              </Button>
              {activePrintingButton ? (
                <Button
                  style={{
                    width: 260,
                    display: "flex",
                    justifyContent: "center",
                    margin: "0px 10px",
                  }}
                  variant="contained"
                  onClick={handlePrintButtonClick}
                  data-test="launch-printing"
                >
                  <SiBlueprint
                    style={{ fontSize: "150%", marginRight: "10px" }}
                  />
                  {translation("laboratory.buttons.launch_printing")}
                </Button>
              ) : null}
            </div>
            <div>
              <Button
                variant="outlined"
                style={{
                  width: 260,
                  display: "flex",
                  justifyContent: "center",
                  margin: "0px 10px",
                }}
                sx={{ ...styles.actionTerminate }}
                data-test="validate"
                onClick={() => {
                  terminateOrders();
                }}
              >
                <BsFillClipboardCheckFill
                  style={{ fontSize: "150%", marginRight: "10px" }}
                />
                {translation("laboratory.buttons.terminate_orders")}
              </Button>
            </div>
            <div>
              <Button
                style={{
                  width: 260,
                  border: "2px solid #ef5350",
                  backgroundColor: "#ef5350",
                  color: "white",
                  fontFamily: "Source Sans Pro",
                  fontWeight: 600,
                  marginLeft: "10px",
                }}
                variant="outlined"
                onClick={() => handleCancelOrderClick()}
                data-test="cancel-order"
              >
                <GiCancel style={{ fontSize: "150%", marginRight: "10px" }} />
                <CustomTranslation text="orderedit.buttons.cancel_order" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="dashboard-table-container"
        style={{
          alignItems: "end",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex" style={{ marginBottom: "10px" }}>
          <div className="flex alignItems-center">
            <div>
              {displayPendingOrders
                ? `${translation("laboratory.buttons.pending_orders")}`
                : `${translation("laboratory.buttons.finished_orders")}`}
            </div>
            <FormControlLabel
              checked={displayPendingOrders}
              control={
                <Switch
                  color="primary"
                  onChange={() => {
                    setDisplayPendingOrders(!displayPendingOrders);
                  }}
                />
              }
              labelPlacement="top"
              sx={{ color: "black" }}
            />
          </div>
          <div className="flex alignItems-center">
            <div>
              {displayDelayOrders
                ? `${translation("laboratory.buttons.delay_orders_on")}`
                : `${translation("laboratory.buttons.delay_orders_off")}`}
            </div>
            <FormControlLabel
              checked={displayDelayOrders}
              control={
                <Switch
                  color="primary"
                  onChange={() => {
                    setDisplayDelayOrders(!displayDelayOrders);
                  }}
                />
              }
              labelPlacement="top"
              sx={{ color: "black" }}
            />
          </div>
        </div>
        <DataGridPro
          columns={columns(translation).filter(
            (c) => !exclude?.includes(c.field)
          )}
          rows={completedOrders.filter((order) => {
            if (userRights.has_doctor_restriction) {
              if (!userDoctors) return false;
              return userDoctors.includes(order.doctor);
            }
            return filter(order);
          })}
          rowCount={total}
          checkboxSelection
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
            Toolbar: GridToolbar,
          }}
          loading={loading}
          rowsPerPageOptions={[25, 50, 100, 200]}
          pagination
          paginationMode="client"
          pageSize={100}
          onCellEditCommit={async ({ id, field, value }) => {
            await updateItem(id, {
              [field]: value,
            });
            fetchOrderData(queryParams);
          }}
          filterMode="client"
          sortingMode="client"
          onSelectionModelChange={(rowsIds) => setSelectedRows(rowsIds)}
          componentsProps={{
            row: { "data-test": "row-lab" },
            cell: { "data-test": "cell-lab" },
            pagination: {
              labelRowsPerPage: `${translation(
                "utilities.DataGridPro.pagination.labelRowsPerPage"
              )}:`,
              labelDisplayedRows: ({ from, to, count }) =>
                `${translation(
                  "utilities.DataGridPro.pagination.labelDisplayedRows",
                  {
                    from,
                    to,
                    count,
                  }
                )}`,
            },
          }}
          autoHeight
          getRowClassName={(params) => {
            let className = params.row.is_downloaded
              ? "order-in-progress-allrows order-in-progress-not-editable-row"
              : "order-in-progress-allrows";
            const today = new Date();
            if (
              displayDelayOrders &&
              params.row?.deadline !== null &&
              today > new Date(params.row?.deadline)
            ) {
              className = `${className} outdated-order-deadline`;
            }

            return className;
          }}
          sx={{
            "& svg[data-value='true']": { fill: mainColor },
            width: "100%",
          }}
          apiRef={apiRef}
        />
      </div>
    </div>
  );
};

export default TaskTable;
