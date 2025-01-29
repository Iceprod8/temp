import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

function BatchPreferences() {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const {
    preserveBatchOnValidation,
    setPreserveBatchOnValidation,
    preserveCutterBatchOnValidation,
    setPreserveCutterBatchOnValidation,
  } = useAppContext();

  useEffect(() => {
    async function fetchUser() {
      const response = await backend.get("users/current");
      if (response.data) {
        setPreserveBatchOnValidation(
          response.data.preserve_batch_on_validation,
        );
        setPreserveCutterBatchOnValidation(
          response.data.preserve_cutter_batch_on_validation,
        );
      }
    }
    fetchUser();
  }, []);

  const updateBatchPreferences = async () => {
    try {
      await backend.post("users/update_batch_preferences", {
        preserve_batch_on_validation: preserveBatchOnValidation,
        preserve_cutter_batch_on_validation: preserveCutterBatchOnValidation,
      });
      showSnackbar(
        translation("messages.parameters.batchPreferences.success"),
        "success",
      );
    } catch (error) {
      showSnackbar(
        translation("messages.parameters.batchPreferences.error"),
        "error",
      );
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="h1">
          {translation("navbar.profile.parameters.batch_preferences.title")}
        </h1>
      </div>

      <div className="form-group">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <span>
            {translation(
              "navbar.profile.parameters.batch_preferences.keep_printer_batch",
            )}
          </span>
          <input
            type="checkbox"
            checked={preserveBatchOnValidation}
            onChange={(e) => setPreserveBatchOnValidation(e.target.checked)}
            style={{ transform: "scale(1.2)" }}
          />
        </label>
      </div>

      <div className="form-group">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <span>
            {translation(
              "navbar.profile.parameters.batch_preferences.keep_cutter_batch",
            )}
          </span>
          <input
            type="checkbox"
            checked={preserveCutterBatchOnValidation}
            onChange={(e) =>
              setPreserveCutterBatchOnValidation(e.target.checked)
            }
            style={{ transform: "scale(1.2)" }}
          />
        </label>
      </div>

      <div>
        <button
          className="btn-table-primary text-center"
          type="button"
          onClick={updateBatchPreferences}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {translation("navbar.profile.parameters.batch_preferences.button")}
        </button>
      </div>
    </div>
  );
}

export default BatchPreferences;
