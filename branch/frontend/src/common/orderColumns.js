import React from "react";
import { Link, NavLink } from "react-router-dom";
import { TbPaperBag } from "react-icons/tb";
import { BsCart4 } from "react-icons/bs";
import { GrTag } from "react-icons/gr";

import {
  capitalizeFirstLetter,
  toReadableDateString,
} from "@inplan/adapters/functions";
import { singleSelectColumn, dateColumn } from "./datagridUtils";

// Based on dateTimeColumn
function deadlineColumn(translation) {
  return {
    field: "deadline",
    headerName: translation("dashboard.orders.table.titles.deadline"),
    flex: 1,
    type: "date",
    editable: false,
    renderCell: (params) => (
      <Link
        to={`/dashboard/${params.row.patient}/appointment`}
        style={{ cursor: "pointer" }}
      >
        {(params.value && toReadableDateString(new Date(params.value))) || ""}
      </Link>
    ),
    valueFormatter: ({ value }) =>
      (value && toReadableDateString(new Date(value))) || "",
  };
}

function setProducerUrl(params) {
  if (params.row.producer_type === 1) {
    return (
      <a target="_blank" rel="noreferrer" href={`${params.row.producer_url}`}>
        {params.value || ""}
      </a>
    );
  }
  return <>{params.value || ""}</>;
}

function producerColumn(translation) {
  return {
    field: "producer_name",
    headerName: translation("dashboard.orders.table.titles.producer"),
    flex: 0.9,
    renderCell: (params) => setProducerUrl(params),
    valueFormatter: ({ value }) => value,
  };
}

function renderEditOrderCell(params) {
  return (
    <NavLink to={`/orderedit/${params.row.id}`}>
      <BsCart4 style={{ cursor: "pointer", fontSize: 40, padding: 8 }} />
    </NavLink>
  );
}

// FUNCTION

const getOrderColumns = (translation) => {
  const columns = [
    {
      field: "doctor_name",
      headerName: translation("dashboard.orders.table.titles.doctor"),
      flex: 0.9,
      valueFormatter: ({ value }) => value,
    },
    singleSelectColumn(
      "type",
      [
        translation("utilities.orderTypeOptions.setup"),
        translation("utilities.orderTypeOptions.aligner"),
        translation("utilities.orderTypeOptions.check"),
        translation("utilities.orderTypeOptions.retainer"),
        translation("utilities.orderTypeOptions.import"),
        translation("utilities.orderTypeOptions.other"),
      ],
      {
        headerName: translation("dashboard.orders.table.titles.type"),
      }
    ),
    {
      field: "setup_name",
      headerName: translation("dashboard.orders.table.titles.setup"),
      flex: 1,
      valueFormatter: ({ value }) => value && `${value}`,
    },

    {
      field: "ranksDescription",
      headerName: translation("dashboard.orders.table.titles.ranks"),
      flex: 1,
      editable: false,
      sortable: false,
      valueGetter: ({ row }) => {
        let result = "";
        const hasTop = row.start_aligner_top >= 0 && row.end_aligner_top >= 0;
        const hasBottom =
          row.start_aligner_bottom >= 0 && row.end_aligner_bottom >= 0;
        if (hasTop) {
          result += `U ${row.start_aligner_top}-${row.end_aligner_top}`;
          if (hasBottom) {
            result += " ";
          }
        }
        if (hasBottom) {
          result += `L ${row.start_aligner_bottom}-${row.end_aligner_bottom}`;
        }

        return result;
      },
    },
    {
      field: "nbAligners",
      headerName: translation("dashboard.orders.table.titles.nb_aligners"),
      type: "number",
      flex: 1,
      align: "center",
      headerAlign: "left",
      editable: false,
      valueGetter: ({ row }) => {
        return row.aligners.length;
      },
      renderCell: (params) => (
        <span
          style={{
            color: params.row.aligners_based ? "green" : "#CC5500",
          }}
        >
          {params.row.aligners.length}
        </span>
      ),
    },
    {
      field: "sheetDesc",
      headerName: translation("dashboard.orders.table.titles.sheet"),
      flex: 0.8,
      valueGetter: ({ value }) =>
        value == null || value === 0 || value.id === "0"
          ? capitalizeFirstLetter(translation("utilities.variables.undefined"))
          : `${value.name}`,
    },
    singleSelectColumn(
      "pickup_location",
      [
        translation("utilities.deliveryOptions.clinic"),
        translation("utilities.deliveryOptions.reception"),
        translation("utilities.deliveryOptions.home"),
        translation("utilities.deliveryOptions.other"),
      ],
      {
        headerName: translation(
          "dashboard.orders.table.titles.delivery_location"
        ),
        editable: true,
      }
    ),
    {
      field: "note",
      headerName: translation("dashboard.orders.table.titles.note"),
      flex: 1,
      editable: true,
      sortable: false,
      valueSetter: ({ row, value }) => {
        return { ...row, note: value };
      },
      valueGetter: ({ row }) =>
        // row.notes.map((x) => x.body).slice(-1)[0],
        row.note,
    },
    dateColumn("creation_date", {
      flex: 1,
      headerName: translation("dashboard.orders.table.titles.creation_date"),
    }),
    deadlineColumn(translation),
    dateColumn("done_date", {
      flex: 1,
      editable: false,
      hide: true,
      headerName: translation("dashboard.orders.table.titles.done_date"),
    }),
    {
      field: "is_started",
      headerName: translation("dashboard.orders.table.titles.in_production"),
      flex: 1,
      type: "boolean",
      editable: false,
      sortable: false,
      hide: true,
      valueGetter: ({ row }) => row.is_started,
    },
    /* TODO status are todo, practitioner to laboratory, laboratory to practitioner, done */
    /* TODO status are to be refined */
    singleSelectColumn(
      "status",
      [
        translation("utilities.orderStatusOptions.ordered"),
        translation("utilities.orderStatusOptions.laboratory"),
        translation("utilities.orderStatusOptions.doctor"),
        translation("utilities.orderStatusOptions.done"),
        translation("utilities.orderStatusOptions.canceled"),
        translation("utilities.orderStatusOptions.in_progress"),
        translation("utilities.orderStatusOptions.in_printing"),
        translation("utilities.orderStatusOptions.in_thermofoming"),
        translation("utilities.orderStatusOptions.in_cutting"),
        translation("utilities.orderStatusOptions.in_progress_externally"),
      ],
      {
        headerName: translation("dashboard.orders.table.titles.progress"),
        editable: false,
      }
    ),
    producerColumn(translation),
    singleSelectColumn(
      "producer_type",
      [
        translation("utilities.producerTypeOptions.locally"),
        translation("utilities.producerTypeOptions.externally"),
      ],
      {
        headerName: translation("dashboard.orders.table.titles.producer_type"),
        editable: false,
        hide: true,
      }
    ),
    {
      field: "order_label_print",
      type: "actions",
      headerName: translation("dashboard.orders.table.titles.order_label"),
      flex: 1,
      editable: false,
      sortable: false,
      getActions: (params) => [
        <div
          onClick={() => window.open(`/orderlabel/${params.row.id}`, "_blank")}
        >
          <GrTag style={{ cursor: "pointer", fontSize: 40, padding: 8 }} />
        </div>,
      ],
    },
    {
      field: "bag_label_print",
      type: "actions",
      headerName: translation("dashboard.orders.table.titles.bag_labels"),
      flex: 1,
      editable: false,
      sortable: false,
      getActions: (params) => [
        <div onClick={() => window.open(`/labels1/${params.row.id}`, "_blank")}>
          <TbPaperBag style={{ cursor: "pointer", fontSize: 40, padding: 8 }} />
        </div>,
      ],
    },
    {
      field: "order_edit",
      type: "actions",
      headerName: translation("dashboard.orders.table.titles.edit"),
      flex: 0.7,
      editable: false,
      sortable: false,
      renderCell: (params) => renderEditOrderCell(params),
    },
  ];
  return columns;
};

export default getOrderColumns;
