import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useBeforeunload } from "react-beforeunload";
import { useParams } from "react-router-dom";
import DownloadLink from "react-download-link";
import {
  capitalizeFirstLetter,
  getGeneratedModels,
  validateAllCutline,
} from "@inplan/adapters/functions";
import { backend } from "@inplan/adapters/apiCalls";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BasicSelect from "@inplan/common/BasicSelect";
import usePeriodicTask from "@inplan/common/usePeriodicTask";
import uploadModels from "@inplan/common/uploadModels";
import uploadCutlines from "@inplan/common/uploadCutlines";
import { useAppContext } from "@inplan/AppContext";
import { useInlineContext } from "@inplan/contexts/InlineContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import ControlCards from "./ControlCards";
import { CardBodyProgressAndEdit } from "./CardModelBodies";

// Control for the list of aligners cards
// Used next to the vizualizer
// This is used for the step of creating and validating cutlines

const UPPER_JAW = 0;
const LOWER_JAW = 1;

const theme = createTheme({
  palette: {
    primary: {
      main: "#797979",
    },
    secondary: {
      main: "#797979",
    },
  },
});

export default function DashboardControlCutlines({
  setmeshOpacity,
  meshOpacity,
}) {
  const {
    setups,
    latestSetup,
    models,
    setModels,
    fetchModelsCutline,
    updateModel,
    selected,
    setSelected,
    selectedSetup,
    setSelectedSetup,
    cutlineStep,
    deleteModel,
    applySmooth,
    setApplySmooth,
  } = useInlineContext();
  const showSnackbar = useSnackbar();
  const { idPatient } = useParams();
  const [isValidatingModels, setIsValidatingModels] = useState(false);

  const { userRights, getUserRights } = useAppContext();
  const { t: translation } = useTranslation();

  const handleToggle = () => {
    setmeshOpacity(!meshOpacity);
  };

  const refreshModels = async () => {
    await fetchModelsCutline();
    return true;
  };
  // Fixme - get a mutex or something to wait the previous refresh
  usePeriodicTask(refreshModels, 5000);

  /* Set by default the last setup */
  useEffect(() => {
    if (selectedSetup === null || selectedSetup === undefined) {
      if (latestSetup === null || latestSetup === undefined) {
        setSelectedSetup({ id: "" });
      } else {
        setSelectedSetup(latestSetup);
      }
    } else if (selectedSetup.id === "") {
      if (latestSetup !== null && latestSetup !== undefined) {
        setSelectedSetup(latestSetup);
      }
    }
  }, []);

  const [loading, setloading] = useState(false);

  const setupModels = models.filter(
    (model) => model.setup === selectedSetup?.id,
  );

  const filteredModels = getGeneratedModels("all", setupModels);

  const ref1 = useRef();
  const ref2 = useRef();
  const download = translation("messages.common.loading_in_progress");

  useBeforeunload(() => {
    if (loading) {
      return translation("messages.cutlines.file_uploading");
    }
    return null;
  });

  const uploadModelsAction = async (files, setup) => {
    setloading(true);
    try {
      await uploadModels(
        showSnackbar,
        files,
        setup,
        {
          is_original: false,
          is_template: false,
        },
        translation,
      );
    } catch (e) {
      console.error(e);
      showSnackbar(
        translation(
          "messages.cutlines.something_went_wrong_when_uploading_stl",
        ),
        "error",
      );
    } finally {
      await fetchModelsCutline();
      setloading(false);
    }
  };

  const uploadCutlinesAction = async (files, setup) => {
    setloading(true);
    try {
      await uploadCutlines(files, setup, {}, translation);
    } catch (e) {
      console.error(e);
      showSnackbar(
        translation(
          "messages.cutlines.something_went_wrong_when_uploading_pts",
        ),
        "error",
      );
    } finally {
      setloading(false);
    }
  };

  const handleChangeModels = async (e) => {
    try {
      await uploadModelsAction(e.target.files, selectedSetup);
    } finally {
      e.target.value = null;
    }
  };

  const handleChangeCutlines = async (e) => {
    try {
      await uploadCutlinesAction(e.target.files, selectedSetup);
    } finally {
      e.target.value = null;
    }
  };

  // Todo to be checked - probably to be removed
  if (![0, 1, 2].includes(cutlineStep)) return null;

  const allModelsToValidateInSection = models.filter(
    (model) => model.setup === selectedSetup?.id,
  );

  const [isSelectedUpperJaw, setIsSelectedUpperJaw] = useState(false);
  const [isSelectedLowerJaw, setIsSelectedLowerJaw] = useState(false);

  const handleValidateAllCutlines = () => {
    const modelsList = models.filter((model) => selected[model.id]);
    if (modelsList.length > 0) {
      setIsValidatingModels(true);
      validateAllCutline(modelsList, updateModel, applySmooth, translation);
      setIsValidatingModels(false);
      setSelected({});
      setIsSelectedUpperJaw(false);
      setIsSelectedLowerJaw(false);
    } else {
      showSnackbar(translation("messages.cutlines.no_model_selected"), "error");
    }
  };

  const handleDeleteAllModels = () => {
    const modelsList = models.filter((model) => selected[model.id]);

    if (modelsList?.length > 0) {
      const message = `${translation(
        "messages.cutlines.delete_all_selected_models_confirmation",
      )}\n${modelsList.map((model) => `- ${model.filename}`).join("\n")}`;
      const confirmed = window.confirm(message);
      if (confirmed) {
        for (let i = 0; i < modelsList.length; i += 1) {
          deleteModel(modelsList[i]);
          const updatedModels = models.filter((p) => p.id !== modelsList[i].id);
          setModels(updatedModels);
        }
        setSelected({});
        setIsSelectedUpperJaw(false);
        setIsSelectedLowerJaw(false);
      }
    } else {
      showSnackbar(translation("messages.cutlines.no_model_selected"), "error");
    }
  };

  const handleSelectAll = (e, jawType) => {
    if (jawType === UPPER_JAW) {
      setIsSelectedUpperJaw(e.target.checked);
    }
    if (jawType === LOWER_JAW) {
      setIsSelectedLowerJaw(e.target.checked);
    }
    let selected2 = {};
    if (Object.keys(selected).length === 0) {
      allModelsToValidateInSection.forEach((model) => {
        if (model.type === jawType) {
          selected2[model.id] = e.target.checked;
        }
      });
    } else {
      selected2 = { ...selected };
      for (let i = 0; i < allModelsToValidateInSection.length; i += 1) {
        const model = allModelsToValidateInSection[i];
        if (model.type === jawType) {
          selected2 = {
            ...selected2,
            [model.id]: e.target.checked,
          };
        }
      }
    }
    setSelected(selected2);
  };

  const { createSetup } = useInlineContext();
  const [setupName, setSetupName] = useState("");
  const onSubmit = async (data) => {
    try {
      await backend.get("setups/get_setup_by_name", {
        params: {
          name: data,
          patientId: idPatient,
        },
      });
    } catch (error) {
      if (error.response.status === 404) {
        const res = await createSetup(idPatient, { name: data });
        setSelectedSetup(res);
        setSetupName("");
        return res;
      }
    }
    return null;
  };

  const innerOnSubmit = async (data) => {
    try {
      const isOk = await onSubmit(data);

      if (isOk) {
        showSnackbar(
          `${translation("messages.common.subject_was_created", {
            subject: capitalizeFirstLetter(
              translation(`utilities.variables.setup`),
            ),
          })}`,
          "success",
        );
      } else {
        showSnackbar(
          `${translation("messages.common.subject_was_not_created", {
            subject: capitalizeFirstLetter(
              translation(`utilities.variables.setup`),
            ),
          })}`,
          "error",
        );
        console.error("Backend error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(translation("messages.common.error_occurred"), "error");
    }
  };

  const [patient, setPatient] = useState(null);
  const [zipName, setZipName] = useState("");

  const refreshPage = async () => {
    const { data } = await backend.get(`patients/${idPatient}`);
    setPatient(data);
    setZipName(`${data.last_name}_${data.first_name}_ready_models_export.zip`);
  };
  // Initialize
  useEffect(() => {
    if (!idPatient) {
      return;
    }
    refreshPage();
  }, [idPatient]);
  return (
    <div className="dashboard-control__body">
      <div
        className="flex alignItems-center justify-content-space-between"
        style={{
          flex: 1,
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            flex: 1,
            marginRight: "50px",
            marginLeft: "50px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <BasicSelect
            value={selectedSetup}
            setValue={setSelectedSetup}
            data-test="selectSetup"
            data={{
              name: "setups",
              label: "Setups",
              choices: setups,
            }}
            styles={{
              classes: "btn-tertiary",
              boxStyle: { height: "50px", width: "200px" },
              fontSettings: { fontSize: "15px" },
              selectLabel: { color: "var(--color-primary)" },
            }}
          />
        </div>

        {!userRights?.setups && (
          <div className="flex alignItems-center">
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  m: 1,
                  width: "25ch",
                },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  InputLabelProps={{
                    style: { color: "#d9d7d2" },
                  }}
                  sx={{
                    // Root class for the input field
                    "& .MuiOutlinedInput-root": {
                      color: "#d9d7d2",
                      // Class for the border around the input field
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d9d7d2",
                      },
                    },
                    // Class for the label of the input field
                    "& .MuiInputLabel-outlined": {
                      color: "#2e2e2e",
                    },
                  }}
                  id="outlined-textarea"
                  label={
                    <CustomTranslation text="dashboard.setups.form.fields.name" />
                  }
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                />
              </div>
            </Box>
            <ThemeProvider theme={theme}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => innerOnSubmit(setupName)}
                style={{
                  textTransform: "none",
                }}
                disableElevation
              >
                <div style={{ color: "#d9d7d2" }}>
                  <CustomTranslation text="dashboard.cutlines.buttons.new_setup" />
                </div>
              </Button>
            </ThemeProvider>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div
          style={{
            textAlign: "center",
          }}
        >
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
              marginRight: "30px",
              marginLeft: "30px",
            }}
            onClick={() => {
              if (selectedSetup?.id) {
                ref1.current.click();
              } else {
                showSnackbar(
                  translation("messages.cutlines.select_a_setup"),
                  "error",
                );
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress /> {download}
              </>
            ) : (
              <CustomTranslation text="dashboard.cutlines.buttons.upload_model_files" />
            )}
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <input
            style={{ display: "none" }}
            type="file"
            multiple
            ref={ref2}
            accept=".pts"
            data-test="cutline_upload_input"
            onChange={handleChangeCutlines}
          />
          <button
            type="button"
            className="btn-tertiary"
            data-test="cutline_upload_btn"
            style={{
              marginRight: "30px",
              marginLeft: "30px",
              marginBottom: "10px",
            }}
            onClick={() => {
              if (selectedSetup?.id) {
                ref2.current.click();
              } else {
                showSnackbar(
                  translation("messages.cutlines.select_a_setup"),
                  "error",
                );
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress /> {download}
              </>
            ) : (
              <CustomTranslation text="dashboard.cutlines.buttons.upload_cutline_files" />
            )}
          </button>
        </div>
        {/* )} */}
      </div>
      {/* VALIDATE & DELETE BUTTONS */}
      <div className="flex">
        {/* if inline */}
        {userRights?.inline && (
          <div
            style={{
              flex: 1,
              marginRight: "50px",
              marginLeft: "50px",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={handleValidateAllCutlines}
              style={{
                marginTop: "10px",
                textTransform: "none",
              }}
              disableElevation
            >
              <div style={{ color: "#d9d7d2" }}>
                <CustomTranslation text="dashboard.cutlines.buttons.validate_all_selected" />
              </div>
            </Button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            marginRight: "50px",
            marginLeft: "50px",
          }}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={handleDeleteAllModels}
            style={{
              marginTop: "10px",
              textTransform: "none",
            }}
            disableElevation
          >
            <div style={{ color: "#d9d7d2" }}>
              <CustomTranslation text="dashboard.cutlines.buttons.delete_all_selected" />
            </div>
          </Button>
        </div>
      </div>

      {/* OPTION TOGGLES */}
      <div className="checkBoxDashBoardModel">
        <div>
          <Checkbox
            checked={applySmooth}
            onClick={() => setApplySmooth(!applySmooth)}
          />
          <CustomTranslation text="dashboard.cutlines.smooth_line" />
        </div>
        <div>
          <label>
            <Checkbox checked={meshOpacity} onChange={handleToggle} />
            Transparence
          </label>
        </div>
      </div>

      <ControlCards
        models={filteredModels}
        CardBody={CardBodyProgressAndEdit}
        handleSelectAll={handleSelectAll}
        isSelectedUpperJaw={isSelectedUpperJaw}
        isSelectedLowerJaw={isSelectedLowerJaw}
      />
      <DownloadLink
        className="btn-back"
        style={{ marginTop: "10px" }}
        filename={zipName}
        label={
          <CustomTranslation text="dashboard.cutlines.buttons.download_models" />
        }
        exportFile={async () => {
          const updatedRights = await getUserRights();
          if (updatedRights?.cutlines) {
            const { data } = await backend.get(`patients/${idPatient}/export`, {
              responseType: "arraybuffer",
            });
            return data;
          }
          return null;
        }}
      />
    </div>
  );
}
