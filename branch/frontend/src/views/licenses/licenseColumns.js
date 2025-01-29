import React from "react";
import { toReadableDateString } from "@inplan/adapters/functions";

const getLicenseStatus = (translation) => {
  const status = {
    1: translation("licenses.table.status.active"),
    2: translation("licenses.table.status.no_active_yet"),
    3: translation("licenses.table.status.expired"),
    4: translation("licenses.table.status.inconsistency_of_dates"),
  };
  return status;
};

const ACTIVE = 1;
const NO_ACTIVE = 2;
const EXPIRED = 3;
const INCONSISTENCY_OF_DATES = 4;

const check_license_status = (license) => {
  const today = new Date();
  const start = new Date(license.start_date);
  const end = new Date(license.end_date);
  // Function to strip the time component from a date
  const stripTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  // Strip time from dates to  compare dates by just year, month, and day (ignoring time)
  const todayStripped = stripTime(today);
  const startStripped = stripTime(start);
  const endStripped = stripTime(end);

  if (startStripped > endStripped) {
    return INCONSISTENCY_OF_DATES;
  }
  if (todayStripped >= startStripped && todayStripped <= endStripped) {
    return ACTIVE;
  }
  if (startStripped <= endStripped && todayStripped <= endStripped) {
    return NO_ACTIVE;
  }
  return EXPIRED;
};

export default function getLicenseColumns(translation) {
  const columns = [
    {
      field: "user.office.name",
      headerName: translation("licenses.table.titles.office").toUpperCase(),
      flex: 0.5,
      valueGetter: (params) => params?.row?.user?.office?.name,
    },
    {
      field: "user.username",
      headerName: translation("licenses.table.titles.username").toUpperCase(),
      flex: 0.5,
      valueGetter: (params) => params?.row?.user?.username,
    },
    {
      field: "license_type.name",
      headerName: translation("licenses.table.titles.name").toUpperCase(),
      flex: 0.7,
      valueGetter: (params) => params?.row?.license_type?.name,
    },
    {
      field: "license_type.description",
      headerName: translation(
        "licenses.table.titles.description",
      ).toUpperCase(),
      flex: 0.7,
      valueGetter: (params) => params?.row?.license_type?.description,
    },
    {
      field: "start_date",
      headerName: translation("licenses.table.titles.start_date").toUpperCase(),
      flex: 0.5,
      valueGetter: ({ row }) => row?.start_date,
      renderCell: (params) => (
        <span>
          {params?.row?.start_date &&
            toReadableDateString(new Date(params?.row?.start_date))}
        </span>
      ),
    },
    {
      field: "end_date",
      headerName: translation("licenses.table.titles.end_date").toUpperCase(),
      type: "date",
      flex: 0.4,
      valueGetter: ({ row }) => row?.end_date,
      renderCell: (params) => (
        <span>
          {params?.row?.end_date &&
            !params?.row?.no_ending &&
            toReadableDateString(new Date(params?.row?.end_date))}
        </span>
      ),
    },
    {
      field: "status",
      headerName: translation("licenses.table.titles.status").toUpperCase(),
      flex: 0.6,
      valueGetter: ({ row }) => {
        const status = check_license_status(row);
        return getLicenseStatus(translation)[status];
      },
      renderCell: (params) => {
        const status = check_license_status(params?.row);
        return (
          <span
            style={{
              color:
                status === ACTIVE
                  ? "oliveDrab"
                  : status === NO_ACTIVE
                    ? "steelBlue"
                    : status === INCONSISTENCY_OF_DATES
                      ? "paleVioletRed"
                      : "gray",
            }}
          >
            {getLicenseStatus(translation)[status]}
          </span>
        );
      },
    },
    {
      field: "id",
      headerName: translation("licenses.table.titles.id").toUpperCase(),
      flex: 0.5,
      hide: true,
      valueGetter: (params) => params?.row?.id,
    },
  ];
  return columns;
}
