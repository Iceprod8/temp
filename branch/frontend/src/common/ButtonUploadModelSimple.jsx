import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsDownload } from "react-icons/bs";
import { useBeforeunload } from "react-beforeunload";
import { CircularProgress } from "@mui/material";
import uploadModels from "@inplan/common/uploadModels";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

export default function ButtonUploadModelSimple({ selectedSetup }) {
  const [loading, setloading] = useState(false);
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const ref1 = useRef();
  const download = translation("messages.common.loading");

  useBeforeunload(() => {
    if (loading) {
      // return "File are uploading";
      return translation("messages.cutlines.file_uploading");
    }
    return null;
  });

  const uploadModelsAction = async (files) => {
    setloading(true);
    try {
      await uploadModels(
        showSnackbar,
        files,
        selectedSetup,
        {
          is_original: false,
          is_template: false,
        },
        translation,
      );
    } catch (e) {
      console.error(e);
      showSnackbar(
        translation("messages.cutlines.something_went_wrong_when_uploading"),
        "error",
      );
    } finally {
      setloading(false);
    }
  };

  const handleChangeModels = async (e) => {
    try {
      await uploadModelsAction(e.target.files);
    } finally {
      e.target.value = null;
    }
  };

  return (
    <div className="simple-button-uplaod_model">
      <div>
        <div>
          <input
            style={{ display: "none" }}
            type="file"
            multiple
            ref={ref1}
            accept=".stl"
            data-test="model_upload_input"
            onChange={handleChangeModels}
          />
          <button
            type="button"
            className="btn-tertiary"
            data-test="model_upload_btn"
            style={{
              cursor: "pointer",
              padding: 8,
              color: "white",
              borderRadius: "500px",
            }}
            onClick={() => {
              ref1.current.click();
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={30} /> {download}
              </>
            ) : (
              <BsDownload size={30} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
