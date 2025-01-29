import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SiBlueprint } from "react-icons/si";
import { GridToolbar } from "@mui/x-data-grid-pro";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import { backend } from "@inplan/adapters/apiCalls";
import { useOrders } from "@inplan/common/collections";
import CustomNoRowsOverlay from "@inplan/common/CustomNoRowsOverlay";
import DataTable from "@inplan/components/DataTable";

// Utility Functions
function firstUpper(stg) {
  if (!stg) return "";
  return stg.charAt(0).toUpperCase() + stg.slice(1).replace("_", " ");
}

function toReadableDateString(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toReadableDatetimeString(date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function singleSelectColumn(field, choices, options) {
  return {
    ...options,
    field,
    headerName: options?.headerName || firstUpper(field),
    type: "singleSelect",
    valueOptions: choices.map((c, i) => ({
      label: c,
      value: i,
    })),
    flex: 1,
    valueFormatter: ({ value }) => {
      if (value == null || !choices[value]) return "";
      return firstUpper(choices[value]);
    },
    valueSetter: ({ value, row }) => ({ ...row, [field]: value }),
  };
}

function dateColumn(field, options) {
  return {
    field,
    headerName: options?.headerName || firstUpper(field),
    flex: 1,
    type: "date",
    valueFormatter: ({ value }) => {
      if (!value) return "";
      try {
        return toReadableDateString(new Date(value));
      } catch (error) {
        return "";
      }
    },
    ...options,
  };
}

function dateTimeColumn(field, options) {
  return {
    field,
    headerName: options?.headerName || firstUpper(field),
    flex: 1,
    type: "dateTime",
    valueFormatter: ({ value }) => {
      if (!value) return "";
      try {
        return toReadableDatetimeString(new Date(value));
      } catch (error) {
        return "";
      }
    },
    ...options,
  };
}

// Order Columns
function getOrderColumns(translation) {
  const columns = [
    {
      field: "doctor_name",
      headerName: translation("dashboard.orders.table.titles.doctor"),
      flex: 0.9,
      valueFormatter: ({ value }) => value || "",
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
      },
    ),
    {
      field: "setup_name",
      headerName: translation("dashboard.orders.table.titles.setup"),
      flex: 1,
      valueFormatter: ({ value }) => (value ? `${value}` : ""),
    },
    {
      field: "ranksDescription",
      headerName: translation("dashboard.orders.table.titles.ranks"),
      flex: 1,
      editable: false,
      sortable: false,
      valueGetter: (params) => {
        const row = params?.row;
        if (!row) return "";
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
      valueGetter: (params) => {
        const row = params?.row;
        return row && row.aligners ? row.aligners.length : 0;
      },
      renderCell: (params) => {
        const row = params?.row;
        if (!row) return "N/A";
        const length = row.aligners?.length || 0;
        return (
          <span style={{ color: row.aligners_based ? "green" : "#CC5500" }}>
            {length}
          </span>
        );
      },
    },
    dateColumn("creation_date", {
      flex: 1,
      headerName: translation("dashboard.orders.table.titles.creation_date"),
    }),
  ];
  return columns;
}

export default function TaskTable({
  exclude = [],
  creator = "",
  pendingStatus,
  finishedStatus,
  printingButton = true,
  filter = (x) => x,
}) {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const { fetchItems, unsortedItems, loading } = useOrders();
  const [queryParams, setQueryParams] = useState({
    status: [1, 5, 6, 7, 8, 9],
    creator,
  });
  const [displayPendingOrders, setDisplayPendingOrders] = useState(true);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns = useMemo(
    () =>
      getOrderColumns(translation).filter(
        (col) => !exclude.includes(col.field),
      ),
    [translation, exclude],
  );

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      creator,
      status: displayPendingOrders ? pendingStatus : finishedStatus,
    }));
  }, [creator, displayPendingOrders, pendingStatus, finishedStatus]);

  useEffect(() => {
    fetchItems(queryParams);
  }, [fetchItems, queryParams]);

  useEffect(() => {
    const prepareOrders = async () => {
      const sheets = await backend.get("sheets");
      const doctors = await backend.get("doctors/available");
      const producers = await backend.get("producers/available");
      const sheetDict = Object.fromEntries(
        sheets.data.results.map((sheet) => [sheet.id, sheet]),
      );
      const doctorDict = Object.fromEntries(
        doctors.data.map((doc) => [doc.id, doc]),
      );
      const producerDict = Object.fromEntries(
        producers.data.map((prod) => [prod.id, prod]),
      );

      setCompletedOrders(
        unsortedItems.map((order) => ({
          ...order,
          sheetDesc: sheetDict[order.sheet] || { name: "Undefined" },
          doctor_name: doctorDict[order.doctor]?.appellation || "Unspecified",
          producer_name: producerDict[order.producer]?.name || "Local",
        })),
      );
    };

    prepareOrders();
  }, []);

  const handlePrintButtonClick = async () => {
    if (selectedRows.length === 0) {
      showSnackbar(translation("messages.orders.no_order_selected"), "error");
      return;
    }

    if (
      window.confirm(
        translation("messages.orders.launch_printing_confirmation"),
      )
    ) {
      await Promise.all(
        selectedRows.map((id) => backend.post(`orders/${id}/send_to_print`)),
      );
      showSnackbar(
        translation("messages.orders.orders_sent_to_printer"),
        "success",
      );
      fetchItems(queryParams);
    }
  };

  if (loading || !completedOrders.length) {
    return <div>Loading...</div>; // Affiche un message ou un spinner
  }

  return (
    <div>
      <div
        className="flex alignItems-center"
        style={{ justifyContent: "space-between" }}
      >
        <h1>{translation("laboratory.title")}</h1>
        <div className="flex alignItems-center">
          {printingButton && (
            <Button variant="contained" onClick={handlePrintButtonClick}>
              <SiBlueprint style={{ marginRight: "10px" }} />
              {translation("laboratory.buttons.launch_printing")}
            </Button>
          )}
        </div>
      </div>

      <div className="flex" style={{ marginBottom: "10px" }}>
        <FormControlLabel
          control={
            <Switch
              checked={displayPendingOrders}
              onChange={() => setDisplayPendingOrders(!displayPendingOrders)}
            />
          }
          label={translation("laboratory.buttons.toggle_orders")}
        />
      </div>

      <DataTable
        columns={columns}
        rows={completedOrders.filter(filter)}
        gridProps={{
          loading,
          checkboxSelection: true,
          pagination: true,
          pageSize: 100,
          components: {
            NoRowsOverlay: CustomNoRowsOverlay,
            Toolbar: GridToolbar,
          },
          onSelectionModelChange: (newSelection) =>
            setSelectedRows(newSelection),
        }}
      />
    </div>
  );
}

TaskTable.propTypes = {
  exclude: PropTypes.arrayOf(PropTypes.string),
  creator: PropTypes.string,
  pendingStatus: PropTypes.arrayOf(PropTypes.number).isRequired,
  finishedStatus: PropTypes.arrayOf(PropTypes.number).isRequired,
  printingButton: PropTypes.bool,
  filter: PropTypes.func,
};

TaskTable.defaultProps = {
  exclude: [],
  creator: "",
  printingButton: true,
  filter: (x) => x,
};
