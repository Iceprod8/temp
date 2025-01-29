import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CircularProgress, TextField } from "@mui/material";
import { createBatchName } from "@inplan/adapters/functions";
import LoadingOverlay from "@inplan/common/Batch/LoadingOverlay";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// List of existing batch and there interactions

function filterBatchesWithAligners(batchesInput, maxBatchSize) {
  if (!batchesInput || !Array.isArray(batchesInput)) {
    // Handle the case when listA is null or not an array
    return [];
  }

  const filteredList = batchesInput.filter((batch) => {
    // Check if the 'aligners' property exists and has a length between 1 and max
    return (
      batch.aligners &&
      batch.aligners.length >= 1 &&
      batch.aligners.length <= maxBatchSize
    );
  });

  return filteredList;
}

export default function BatchView({
  subject,
  pendingTitle,
  batchTitle,
  children,
  Main /* main panel */,
  Actions /* batch action panel */,
}) {
  const {
    batches,
    loading,
    updateBatch,
    fetchBatches,
    maxBatchSize,
    selectedBatch: selectedBatchInLase,
  } = useBatchContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const [editBatchName, setEditBatchName] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [search, setSearch] = useState("");

  const loader = loading ? (
    <LoadingOverlay>
      <CircularProgress style={{ width: "24px", height: "24px" }} />
      {translation("messages.common.loading")}
    </LoadingOverlay>
  ) : null;

  const saveBatchName = async (batch) => {
    if (editBatchName !== "" && editBatchName !== null) {
      const data = { name: editBatchName };
      updateBatch(batch, data)
        .then(() => {
          showSnackbar(
            translation("messages.common.batch_name_updated"),
            "success",
          );
          fetchBatches();
        })
        .catch(() => {
          showSnackbar(
            translation("messages.common.error_saving_batch_name"),
            "error",
          );
        });
    }
    setEditBatchName(null);
    setSelectedBatch(null);
  };

  // Filter empty and too big batches
  const rightSizeBatches = filterBatchesWithAligners(batches, maxBatchSize);

  const aside = (
    <aside className="page-sidebar">
      <div className="page-head">
        <div className="page-head__title">
          <h1 className="h1">{pendingTitle}</h1>
        </div>
      </div>
      <table className="table page-tab">
        <thead>
          <tr style={{ height: "59px" }}>
            <th>{batchTitle}</th>
            <th>
              {translation(
                "3d_printing.table_pending_printer_beds.titles.actions",
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextField
                id="standard-search"
                label={translation(
                  "3d_printing.table_pending_printer_beds.search",
                )}
                type="search"
                name="search"
                variant="standard"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </td>
          </tr>
          {rightSizeBatches
            ?.filter((b) => {
              if (b.name === "") {
                return createBatchName(b, subject, translation)
                  .toLowerCase()
                  .includes(search.toLowerCase());
              }
              return b.name.toLowerCase().includes(search.toLowerCase());
            })
            .map((b) => {
              const defaultBatchName = createBatchName(b, subject, translation);
              return (
                <tr key={b.id}>
                  <td data-test="batch_name">
                    {selectedBatch === b.id ? (
                      <TextField
                        sx={{
                          "& > :not(style)": { width: "20ch" },
                        }}
                        id="standard-basic"
                        label={translation(
                          "3d_printing.table_pending_printer_beds.batch_name",
                        )}
                        variant="standard"
                        value={editBatchName}
                        onChange={(e) => setEditBatchName(e.target.value)}
                        onBlur={() => {
                          saveBatchName(b);
                        }}
                        autoFocus
                        onFocus={(e) => {
                          e.target.select();
                        }}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditBatchName(b.name ? b.name : defaultBatchName);
                          setSelectedBatch(b.id);
                        }}
                      >
                        {defaultBatchName}
                      </span>
                    )}
                  </td>
                  <td
                    data-test="batch_action"
                    className="td__actions td-alignItems"
                  >
                    <Actions
                      batch={b}
                      batchName={b.name ? b.name : defaultBatchName}
                      selectedBatch={selectedBatchInLase}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </aside>
  );

  return (
    <>
      {loader}
      <div className="page-light page">
        <div className={Main ? "layout-sidebar" : null}>
          {Main}
          {aside}
        </div>
      </div>
      {children}
    </>
  );
}
