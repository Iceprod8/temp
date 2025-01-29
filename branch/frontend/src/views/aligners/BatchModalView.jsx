import React, { useState, useEffect } from "react";
import DownloadLink from "react-download-link";
import { useTranslation } from "react-i18next";

import { DataGrid } from "@mui/x-data-grid";
import Select from "@mui/material/Select";

import { AiOutlineDownload } from "react-icons/ai";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { BsCart4 } from "react-icons/bs";
import { TbPaperBag } from "react-icons/tb";

import Modal from "@inplan/common/Modal";
import BatchFooter from "@inplan/common/Batch/BatchFooter";
import { Plate6 } from "@inplan/views/inlase/Plates";

import { useBatchContext } from "@inplan/common/Batch/BatchContext";

import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";

// If no sheet, adds the empty sheet
function addDefaultSheet(aligners_in, availableSheetList) {
  const aligners_out = aligners_in.map((aligner) => {
    const updatedAligner = { ...aligner };

    if (
      !updatedAligner.sheet_id ||
      updatedAligner.sheet_id === "" ||
      !availableSheetList.includes(updatedAligner.sheet_id)
    ) {
      updatedAligner.sheet = "0";
    } else {
      updatedAligner.sheet = updatedAligner.sheet_id;
    }

    return updatedAligner;
  });

  return aligners_out;
}

function SheetSelection({ id, value, field, options, apiRef, fetchBatches }) {
  const handleChange = async (event) => {
    if (id !== 0) {
      await backend.patch(`ordered_aligners/${id}`, {
        sheet: event.target.value,
      });
    }
    await fetchBatches();
    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select value={value} onChange={handleChange} size="small" native autoFocus>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

export default function BatchModalView() {
  const { getUserRights } = useAppContext();
  const { setModal, selectedBatch, fetchBatches, sheets } = useBatchContext();
  const { t: translation } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [alignerList, setAlignerList] = useState([]);

  const availableSheetList = sheets.map((sheet) => sheet.id);

  useEffect(() => {
    if (selectedBatch && selectedBatch.aligners) {
      const newAlignerList = addDefaultSheet(
        selectedBatch.aligners,
        availableSheetList,
      );
      setAlignerList(newAlignerList);
    }
  }, [selectedBatch?.aligners]);

  if (!selectedBatch) {
    return null;
  }

  const batchName =
    selectedBatch && selectedBatch.name ? selectedBatch.name : "Batch";

  const renderSheetSelection = (params) => <SheetSelection {...params} />;

  const handleDelete = async (removedAligner) => {
    setLoading(true);
    const aligner_list = [removedAligner?.id];
    await backend.post(`cutter_batches/${selectedBatch.id}/remove_aligners`, {
      aligners: aligner_list,
    });

    await fetchBatches();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearInterval(timer);
  };

  // FIXME To be shared
  const goToRelatedOrder = async (aligner) => {
    try {
      const response = await backend.get(
        `ordered_aligners/${aligner.id}/get_order_id`,
      );
      const { order_id } = response.data;
      window.location.href = `orderedit/${order_id}`;
    } catch (error) {
      console.error("Error getting order:", error);
    }
  };

  const sendToBagLabel = async (aligner) => {
    try {
      const response = await backend.get(
        `ordered_aligners/${aligner.id}/get_order_id`,
      );
      const { order_id } = response.data;
      window.open(`/labels1/${order_id}`, "_blank");
    } catch (error) {
      console.error("Error getting order:", error);
    }
  };

  return (
    <Modal
      title={batchName}
      onClose={(page) => {
        setModal(page);
      }}
    >
      <div>
        <h4 className="h4">
          {translation(
            "cutting.table_pending_cutting_batches.batch_modal_view.name",
          )}
        </h4>
      </div>
      <div className="grid">
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          rows={alignerList}
          columns={[
            {
              field: "short_code",
              headerName: translation(
                "cutting.table_pending_cutting_batches.batch_modal_view.table.titles.aligner",
              ),
              flex: 2,
            },
            {
              field: "sheet",
              headerName: translation(
                "cutting.table_pending_cutting_batches.batch_modal_view.table.titles.sheet",
              ),
              flex: 2,
              renderCell: renderSheetSelection,
              editable: true,
              width: 180,
            },
            {
              field: "Remove",
              headerName: translation(
                "cutting.table_pending_cutting_batches.batch_modal_view.table.titles.remove",
              ),
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              flex: 0.7,
              renderCell: (params) => (
                <div
                  className="btn-rounded-danger"
                  onClick={() => handleDelete(params.row)}
                >
                  <MdOutlineRemoveCircleOutline
                    name="delete"
                    className="icon icon-delete"
                    size={20}
                    style={{
                      fill: "currentColor",
                    }}
                  />
                </div>
              ),
            },
            {
              field: "Order",
              headerName: translation(
                "cutting.table_pending_cutting_batches.batch_modal_view.table.titles.order",
              ),
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              flex: 0.7,
              renderCell: (params) => (
                <div
                  onClick={() => goToRelatedOrder(params.row)}
                  className="btn-rounded-tertiary"
                >
                  <BsCart4
                    name="related-order"
                    className="icon icon-delete"
                    size={20}
                    style={{
                      fill: "currentColor",
                    }}
                  />
                </div>
              ),
            },
            {
              field: "Labels",
              headerName: translation(
                "cutting.table_pending_cutting_batches.batch_modal_view.table.titles.labels",
              ),
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              flex: 0.7,
              renderCell: (params) => (
                <div
                  onClick={() => sendToBagLabel(params.row)}
                  className="btn-rounded-tertiary"
                >
                  <TbPaperBag
                    name="related-order"
                    className="icon icon-delete"
                    size={20}
                  />
                </div>
              ),
            },
          ]}
          editMode="cell"
          autoHeight
          disableSelectionOnClick
          hideFooter
        />
      </div>

      <DownloadLink
        className="btn-rounded-tertiary"
        style={{ marginTop: "10px", marginBottom: "10px" }}
        tagName="a"
        label={
          <AiOutlineDownload
            name="download"
            className="icon icon-download"
            size={40}
          />
        }
        filename={`cutlines-${batchName}.txt`}
        exportFile={async () => {
          const updatedRights = await getUserRights();
          if (updatedRights?.thermoforming) {
            setLoading(true);
            const { data } = await backend.get(
              `cutter_batches/${selectedBatch.id}/export`,
              { responseType: "arraybuffer" },
            );
            setLoading(false);
            return data;
          }
          return null;
        }}
      />
      <BatchFooter Plate={Plate6} />
    </Modal>
  );
}
