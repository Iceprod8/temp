import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import styles from "@inplan/common/Form/styles";
import {
  getPositionOptions,
  getPossibleProcessSteps,
  getSelectableProcessSteps,
} from "@inplan/views/order/OrderUtilities";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

export default function AlignerEditor({ alignerId, order, sheetsDict }) {
  const [aligner, setAligner] = useState(null);
  const [formData, setFormData] = useState(null);
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const refreshAligner = async () => {
    // FIXME check reply is ok
    const alignerResponse = await backend.get(`ordered_aligners/${alignerId}`);

    setAligner(alignerResponse.data);

    setFormData({
      sheet: alignerResponse.data.sheet,
      process_step: 0, // reset to "no change"
    });
  };

  // Initialize
  useEffect(() => {
    if (!order) return;
    if (!alignerId) return;
    refreshAligner();
  }, [alignerId, order]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (order.status === 3 || order.status === 4) {
      showSnackbar(
        translation(
          "messages.orders.canceled_or_finished_order_cannot_be_modified",
        ),
        "warning",
      );
    } else if (aligner.process_step >= 16 && formData.process_step === 21) {
      showSnackbar(
        translation("messages.orders.already_cut_aligner_cannot_be_canceled"),
        "warning",
      );
    } else {
      try {
        await backend.post(
          `ordered_aligners/${alignerId}/update_aligner`,
          formData,
        );
        refreshAligner();
        showSnackbar(translation("messages.orders.aligner_updated"), "success");
      } catch (error) {
        showSnackbar(
          translation("messages.orders.error_updating_aligner"),
          "error",
        );
        console.error("Error updating Aligner:", error);
      }
    }
  };

  const mySelectableProcessSteps = getSelectableProcessSteps(translation);
  const myPossibleProcessSteps = getPossibleProcessSteps(translation);
  const myPositionOptions = getPositionOptions(translation);

  return (
    <div>
      {aligner && formData && (
        <form onSubmit={handleSubmit}>
          <div name="chart" style={styles.alignerChartStyle}>
            <div style={styles.infoCellStyle}>
              {myPositionOptions[aligner.position]}
            </div>
            <div style={styles.infoCellStyle}>{aligner.rank}</div>

            {/* STATUS MANAGEMENT */}
            <div style={styles.infoCellStyle}>
              {myPossibleProcessSteps[aligner.process_step]}
            </div>
            <div style={styles.infoCellStyle}>
              <select
                name="process_step"
                value={formData.process_step}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                {Object.entries(mySelectableProcessSteps).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* SHEET MANAGEMENT */}
            <div style={styles.infoCellStyle}>
              {aligner.sheet
                ? sheetsDict[aligner.sheet]?.name
                : sheetsDict["0"]?.name}
            </div>
            <div style={styles.infoCellStyle}>
              <select
                name="sheet"
                value={formData.sheet}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                {Object.values(sheetsDict).map((sheet) => (
                  <option key={sheet.id} value={sheet.id}>
                    {sheet?.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-table-primary text-center"
              type="submit"
              style={styles.infoCellStyle}
            >
              <CustomTranslation text="orderedit.table_edition.buttons.save" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
