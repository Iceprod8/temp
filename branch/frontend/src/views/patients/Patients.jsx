import React, { useEffect, useState, useRef } from "react";
import MaterialTable from "material-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import { Typography, Box, Switch } from "@mui/material";
import PatientModal from "@inplan/views/patients/PatientModals";
import usePatients from "@inplan/common/usePatients";
import table from "@inplan/common/tableIcons";
import useIsMounted from "@inplan/common/useIsMounted";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import { useModal } from "@inplan/contexts/ModalContext";
import RenderPanel from "./RenderPanel";
import TreatmentPeriodCol from "./TreatmentPeriodCol";
import ExistingOrdersCol from "./ExistingOrdersCol";
import NewOrderCol from "./NewOrderCol";
import PatientCol from "./PatientCol";
import IdentifierCol from "./IdentifierCol";
import FirstNameCol from "./FirstNameCol";
import SurnameCol from "./SurnameCol";
import ProgressStatusCol from "./ProgressStatusCol";

export default function Patients() {
  const { t: translation } = useTranslation();
  const { language, userRights, getUserRights } = useAppContext();
  const { userData } = useAppContext();
  const navigate = useNavigate();
  const { patients, fetchPatients, createPatient } = usePatients();
  const tableIcons = table();
  const [offset] = useState(0);
  const limit = 200;
  const materialTableRef = React.createRef();
  const [refresh, setRefresh] = useState(false);
  const [displayArchived, setDisplayArchived] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const [tableData, setTableData] = useState(0);
  const displayArchivedRef = useRef(displayArchived);
  const userDoctors = userData.doctors;
  const { open, close, isOpen } = useModal();

  useEffect(() => {
    getUserRights();
  }, []);

  useEffect(() => {
    displayArchivedRef.current = displayArchived;
  }, [displayArchived]);

  const { assertMounted } = useIsMounted();

  function formatSearch(search) {
    const encodedSearch = encodeURIComponent(search.trim());
    const params = encodedSearch.split("#");

    const t = params.filter((param) => {
      const [req, value] = param.split("=");
      if ((req === "active_start" || req === "active_end") && value) {
        const date = value.split("-");
        const y = date[0];
        const m = date[1];
        const d = date[2];
        if (
          date.length === 3 &&
          y >= 1000 &&
          y <= 9999 &&
          m >= 1 &&
          m <= 12 &&
          d >= 1 &&
          d <= 31
        ) {
          return true;
        }
      }
      return false;
    });
    let t2 = escape(`${params[0]}`);
    if (t.length >= 1)
      t2 = `${params[0]}&${t.toString().replace(",", "&")}&date=true`;
    if (params.includes("date")) t2 = `${params[0]}&date=true`;
    return t2;
  }

  useEffect(() => {
    /* for patients view,
       the most important is the end of the active step */
    fetchPatients({
      order: "end_of_period",
      limit,
      offset,
      view_type: "patient_list",
    });
  }, [userData, offset, refresh]);

  useEffect(() => {
    if (refresh) {
      materialTableRef.current.onQueryChange();
      setRefresh(false);
    }
  }, [refresh]);

  if (!patients) {
    return null;
  }

  function formatData(patients1) {
    return patients1
      .filter((p) => {
        if (userRights.has_doctor_restriction) {
          return userDoctors?.includes(p.doctor);
        }
        return true;
      })
      .map((patient) => ({
        favorite: patient.favorite,
        photo: patient.photo,
        first_name: patient.first_name,
        last_name: patient.last_name,
        treatment_start: patient.treatment_start,
        activeStep: patient.active_step,
        status: patient.active_step,
        notes: patient.patient_notes,
        orders: patient.order_details,
        patient,
      }));
  }

  async function nestedDataGetter(query) {
    const params = {
      limit: query.pageSize,
      offset: query.page * query.pageSize,
      order: query.orderBy
        ? `${query.orderBy.field}_${query.orderDirection}`
        : null,
      view_type: "patient_list",
      search: formatSearch(query.search),
      display_archived: displayArchivedRef.current,
    };
    const startTime = new Date().getTime();
    setLastSearchTime(startTime);

    const { data: resp } = await backend.get("patients", { params });

    if (startTime < lastSearchTime) {
      console.warn(`Request is old - ${startTime} vs ${lastSearchTime}`);
    } else {
      console.info(`Request is OK - ${startTime} vs ${lastSearchTime}`);
    }

    const data = resp.results;

    const updatedPatients = data.map((patient) => ({
      ...patient,
      order_details: patient.orders || [],
      notes: patient.patient_notes || [],
    }));

    assertMounted();

    return {
      data: formatData(updatedPatients),
      page: query.page,
      totalCount: resp.count,
    };
  }

  const debouncedDataGetter = useRef(
    _.debounce(async (query, resolve) => {
      try {
        const newData = nestedDataGetter(query);
        resolve(newData);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        resolve({
          data: [],
          page: query.page,
          totalCount: 0,
        });
      }
    }, 200), // in ms, debounce timer
  );

  function dataGetter(query) {
    return new Promise((resolve) => {
      if (query.page === 0) {
        // Skip debouncing for the first load
        nestedDataGetter(query).then(
          (response) => {
            // Resolve the promise with the data
            if (response.data) {
              resolve(response);
            }
          },
          (error) => {
            console.error(error); // Log any error if the promise rejects
          },
        );

        setRefresh(false);
      } else {
        debouncedDataGetter.current(query, resolve);
      }
    });
  }
  // Define the functions to check user rights
  const hasAnyPatientsListAccess = () =>
    userRights?.patients_list || userRights?.reduced_patients_list;
  const hasFullPatientsListAccess = () => userRights?.patients_list;

  const allColumns = [
    {
      title: `${translation("patients.table.titles.patient")}`,
      field: "last_name",
      render: PatientCol,
      cellStyle: {
        width: "490px",
      },
      hidden: !hasAnyPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.identifier")}`,
      field: "identifier",
      render: IdentifierCol,
      cellStyle: {
        width: "335px",
      },
      hidden: !hasAnyPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.last_name")}`,
      field: "last_name",
      render: SurnameCol,
      cellStyle: {
        width: "600px",
      },
      hidden: !hasAnyPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.first_name")}`,
      field: "first_name",
      render: FirstNameCol,
      cellStyle: {
        width: "600px",
      },
      hidden: !hasAnyPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.treatment_period")}`,
      field: "treatmentPeriod",
      type: "date",
      render: (rowData) =>
        TreatmentPeriodCol(rowData, translation, navigate, language),
      cellStyle: {
        width: "520px",
      },
      hidden: !hasFullPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.existing_orders")}`,
      field: "treatment_start",
      render: ExistingOrdersCol,
      cellStyle: {
        width: "600px",
      },
      hidden: !hasFullPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.progress_status")}`,
      field: "progress_status",
      render: ProgressStatusCol,
      cellStyle: {
        width: "600px",
      },
      hidden: !hasFullPatientsListAccess(),
    },
    {
      title: `${translation("patients.table.titles.actions")}`,
      field: "actions",
      sorting: false,
      render: (rowData) => (
        <NewOrderCol rowData={rowData} setRefresh={setRefresh} />
      ),
      hidden: !hasAnyPatientsListAccess(),
    },
  ];

  useEffect(() => {
    if (userData) {
      // Call dataGetter when userData is ready
      const query = {
        page: 0,
        pageSize: 20,
        orderBy: null,
        orderDirection: "asc",
        search: "",
      };
      dataGetter(query);
      setTableData((prevKey) => prevKey + 1);
    }
  }, [userData]);

  return (
    <Box className="page-light">
      <PatientModal
        open={isOpen("modal-patient")}
        onClose={close}
        onValidation={createPatient}
        setRefresh={setRefresh}
      />
      <Box className="page">
        <Box
          className="flex alignItems-center"
          style={{
            justifyContent: "space-between",
          }}
        >
          <Box
            className="page-head"
            style={{
              flex: 1,
            }}
          >
            <Box
              className="page-head__title"
              style={{
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              <Typography variant="h1">
                {translation("patients.title")}
              </Typography>
            </Box>
          </Box>
          <Box className="page-head__actions" style={{ flex: 2 }}>
            <Button
              variant="contained"
              onClick={() => open("modal-patient")}
              data-test="add_patient"
              style={{ margin: "auto" }}
            >
              {translation("patients.new_patient_button")}
            </Button>
          </Box>
          <Box
            className="flex alignItems-center"
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <Box>
              {displayArchived
                ? `${translation("patients.button_archived.displayed")}`
                : `${translation("patients.button_archived.hidden")}`}
            </Box>
            <FormControlLabel
              checked={displayArchived}
              control={
                <Switch
                  color="primary"
                  onChange={() => {
                    setDisplayArchived(!displayArchived);
                    setRefresh(true);
                  }}
                />
              }
              labelPlacement="top"
              sx={{ color: "black" }}
            />
          </Box>
        </Box>

        <Box className="page-tab">
          <MaterialTable
            key={tableData}
            icons={tableIcons}
            title=""
            tableRef={materialTableRef}
            className="table table__patients"
            columns={allColumns}
            data={(query) => dataGetter(query)}
            actions={[
              {
                icon: tableIcons.Refresh,
                tooltip: "Refresh Data",
                isFreeAction: true,
                onClick: () =>
                  materialTableRef.current &&
                  materialTableRef.current.onQueryChange(),
              },
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50, 100],
              actionsColumnIndex: 3,
              actionsCellStyle: { width: "200px" },
              tableLayout: "auto",
              headerStyle: {
                textTransform: "uppercase",
                fontSize: "14px",
                lineHeight: "14px",
                fontWeight: "600",
                verticalAlign: "middle",
                textAlign: "start",
                padding: "5px",
              },
              cellStyle: {
                padding: "5px",
                width: 500,
              },
            }}
            detailPanel={
              hasAnyPatientsListAccess()
                ? [
                    {
                      tooltip: "Show Name",
                      render: (rowData) => <RenderPanel rowData={rowData} />,
                    },
                  ]
                : []
            }
            localization={{
              header: {
                actions: "Actions",
              },
              toolbar: {
                searchPlaceholder: `${translation("patients.table.search")}`,
              },
              pagination: {
                labelRowsPerPage: `${translation(
                  "utilities.MaterialTable.pagination.labelRowsPerPage",
                )}:`,
                labelRowsSelect: `${translation(
                  "utilities.MaterialTable.pagination.labelRowsSelect",
                )}`,
                labelDisplayedRows: `${translation(
                  "utilities.MaterialTable.pagination.labelDisplayedRows",
                )}`,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
