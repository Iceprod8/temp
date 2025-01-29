import React, { useState, useEffect } from "react";
import { DataGridPro, GridToolbar } from "@mui/x-data-grid-pro";
import { useTranslation } from "react-i18next";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";

import { backend } from "@inplan/adapters/apiCalls";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import SectionHeader from "@inplan/common/SectionHeader";
import { mainColor } from "@inplan/common/Form/styles";
import getOrderColumns from "@inplan/common/orderColumns";

import { useDashboardContext } from "./Context";

const columns = () => {
  const { t: translation } = useTranslation();
  return [
    {
      field: "patient_identifier",
      headerName: translation("dashboard.orders.table.titles.patient"),
      hide: true,
      flex: 1.2,
      renderCell: (params) => (
        <div>
          <div>
            {params.row.last_name}, {params.row.first_name}
          </div>
          <div>{params.row.patient_identifier}</div>
        </div>
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
      renderCell: (params) => params.row.last_name,
      valueGetter: ({ row }) => row.last_name,
    },
    {
      field: "patient_firstname",
      headerName: translation("dashboard.orders.table.titles.first_name"),
      hide: true,
      flex: 1,
      align: "left",
      renderCell: (params) => params.row.first_name,
      valueGetter: ({ row }) => row.first_name,
    },
    ...getOrderColumns(translation),
  ];
};

const OrdersInProgress = ({ exclude }) => {
  const { t: translation } = useTranslation();
  const { orders, loading, updateOrder, fetchPatientOrders } =
    useDashboardContext();
  const onCellEditCommit = ({ id, field, value }) => {
    updateOrder(id, {
      [field]: value,
    });
  };

  // Fixme, common function
  const [sheets, setSheets] = useState([]);
  const [sheetDict, setSheetDict] = useState({});
  const [completedOrders, setCompletedOrders] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorDict, setDoctorDict] = useState({});
  const [producers, setProducers] = useState([]);
  const [producerDict, setProducerDict] = useState({});

  // Fixme, common function
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

  const completeOrder = (order) => {
    // If sheets or doctors are not updated, wait
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
      newOrder.doctor !== 0 &&
      newOrder.doctor in doctorDict
    ) {
      newOrder.doctor_name = doctorDict[newOrder.doctor].appellation;
    } else {
      newOrder.doctor_name = doctorDict["0"].appellation;
    }

    return newOrder;
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

    orders.forEach(function (order) {
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
        newOrder.doctor !== 0 &&
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
        newOrder.producer_name = producerDict["0"]?.name;
      }
      // Save the updated order
      newOrderList.push(newOrder);
    });
    // Save the updated order list
    setCompletedOrders(newOrderList);
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
  }, [orders]);

  // useEffect(() => {
  //   const updateOrderList = async () => {
  //     await getSheetList();
  //     await getDoctors();
  //     await getProducers();
  //     completeOrders();
  //   };
  //   updateOrderList();
  // }, [orders]);

  // Manage unsynchronous update of sheets
  useEffect(() => {
    completeOrders();
  }, [doctorDict]);

  // Manage unsynchronous update of doctors
  useEffect(() => {
    completeOrders();
  }, [doctorDict]);

  useEffect(() => {
    fetchPatientOrders();
  }, []);

  return (
    <div className="dashboard-table-container">
      <SectionHeader type="orders" />

      <DataGridPro
        // columns={columns()}
        columns={columns(translation).filter(
          (c) => !exclude?.includes(c.field)
        )}
        rows={completedOrders}
        rowCount={completedOrders.length}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
          Toolbar: GridToolbar,
        }}
        loading={loading}
        rowsPerPageOptions={[5, 25, 50, 100]}
        pagination
        paginationMode="client"
        pageSize={25}
        onCellEditCommit={onCellEditCommit}
        filterMode="client"
        sortingMode="client"
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
            params.row?.deadline !== null &&
            today > new Date(params.row?.deadline)
          ) {
            className = `${className} outdated-order-deadline`;
          }

          return className;
        }}
        // getCellClassName={(params) =>
        //   !params.row.is_downloaded &&
        //   ordersEditableColumns.includes(params.field) &&
        //   "order-in-progress-editable-cell"
        // }
        // getRowClassName={(params) =>
        //   params.row.is_downloaded
        //     ? "order-in-progress-allrows order-in-progress-not-editable-row"
        //     : "order-in-progress-allrows"
        // }
        // isCellEditable={(params) => !params.row.is_downloaded}
        sx={{
          "& svg[data-value='true']": { fill: mainColor },
          width: "100%",
        }}
      />
    </div>
  );
};

export default OrdersInProgress;
