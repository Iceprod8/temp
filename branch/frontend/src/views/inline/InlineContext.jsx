import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { NotificationManager } from "react-notifications";
import { dict2formdata } from "@inplan/adapters/functions";
import usePatients from "@inplan/common/usePatients";
import { useModels, useSetups } from "@inplan/common/collections";

const InlineContext = createContext();

export function useInlineContext() {
  return useContext(InlineContext);
}

/* Extract model signature to update or not */
function modelSignature(m) {
  if (!m) return [];
  return JSON.stringify([
    m.id,
    !!m.base,
    m.base_error,
    m.setup_rank,
    m.type,
    m.setup.id,
    m.step?.id,
    m.is_base_on_process,
    m.is_cutline_on_process,
    m.is_validated,
    m.is_template,
    m.is_original,
    m.active_cutline?.id,
    m.base_active_cutline?.id,
  ]);
}

export function InlineContextProvider({ children }) {
  const { patient, fetchPatient } = usePatients();

  const {
    items: setups,
    latestSetup,
    fetchItems: fetchSetups,
    createItem: createSetup,
    updateItem: updateSetup,
    deleteItem: deleteSetup,
    loading: loadingSetups,
  } = useSetups();

  const {
    fetchItem: fetchModel,
    updateItem: updateModel,
    deleteItem: deleteModel,
    uploadModels,
  } = useModels();

  const { t: translation } = useTranslation();
  const [modal, setModal] = useState("");
  const [currentModel, setCurrentModel] = useState(null);
  const [loadedCutline, setLoadedCutline] = useState(null);
  const [enableCutline, setEnableCutline] = useState(false);
  const [currentCutline, setCurrentCutline] = useState(null);
  const [pendingCutline, setPendingCutline] = useState(null);
  const [cutlineVersion, setCutlineVersion] = useState(0);
  const [cutlineStep, setCutlineStep] = useState(0);
  const [loading, setLoading] = useState({});
  const [simulator, setSimulator] = useState(true);
  const [orientation, setOrientation] = useState("");
  const [models, setModels] = useState([]);
  const [transOrRot, setTransOrRot] = useState({
    activeTrans: false,
    activeRot: false,
    x: 1,
    y: 1,
    z: 1,
  });
  // Initialisation Points are points used to init. the cutline
  const [initPoints, setInitPoints] = useState(null);
  const [creationMode, setCreationMode] = useState(false);
  const [selectedSetup, setSelectedSetup] = useState({ id: "" });
  const [collisionIndexes, setCollisionIndexes] = useState(null);
  const [isSavingRequested, setIsSavingRequested] = useState(false);

  // TODO : rename this variable (selected what?)
  // It is used for the models selected in the list,
  // When editing cutlines
  // const [allSelected, setAllSelected] = useToggle(false);
  const [selected, setSelected] = useState({});

  const setSelectedModel = (model, value) => {
    setSelected((prevState) => ({ ...prevState, [model.id]: value }));
  };

  const fetchModelsCutline = async () => {
    if (patient && patient?.id !== "" && selectedSetup.id !== "") {
      const { data: res } = await backend.get("models/get_models_cutline", {
        params: { patient_id: patient?.id, setup_id: selectedSetup.id },
      });
      setModels(res);
    }
  };

  useEffect(async () => {
    if (!patient) return;
    [fetchSetups].forEach((f) => f({ patient_id: patient.id }));
    fetchModelsCutline();
  }, [patient]);

  useEffect(() => {
    setLoading({
      ...loading,
      setups: loadingSetups,
    });
  }, [loadingSetups]);

  function setCutline(line) {
    setCurrentCutline(line);
    setPendingCutline(line);
  }

  useEffect(() => {
    if (!loadedCutline || !currentModel) {
      return;
    }

    const [refModel, line] = loadedCutline;
    if (refModel.id === currentModel.id) {
      setCutline(line);
    }
  }, [loadedCutline, currentModel]);

  useEffect(() => {
    if (!enableCutline) {
      setCutline(null);
      setInitPoints([]);
    }
  }, [enableCutline]);

  useEffect(() => {
    if (!currentModel) {
      return;
    }
    /* Try to update */
    fetchModel(currentModel.id);
    setCurrentCutline(null);

    if (enableCutline && currentModel) {
      if (currentModel.active_cutline) {
        setCreationMode(false);
        const cutlineKey =
          currentModel.is_validated && currentModel.base
            ? "base_active_cutline"
            : "active_cutline";

        setLoading({ ...loading, model: true });
        backend
          .get(`/cutlines/${currentModel[cutlineKey]}`)
          .then(({ data: line }) => {
            setCollisionIndexes(line.collision_indexes);
            setLoadedCutline([
              currentModel,
              currentModel.is_validated && currentModel.base
                ? line.polyline
                : line.points,
            ]);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            setLoading({ ...loading, model: false });
          });
      } else {
        // The model has no active cutline - we shall use init points
        setCutline(null);
        setInitPoints([]);
        setCreationMode(true);
      }
    } else {
      setCreationMode(false);
      setCutline(null);
      setInitPoints([]);
    }
  }, [currentModel]);

  useEffect(() => {
    if (currentModel) {
      const updatedCurrentModel = models.find((m) => m.id === currentModel.id);
      if (
        modelSignature(currentModel) !== modelSignature(updatedCurrentModel)
      ) {
        setCurrentModel(updatedCurrentModel);
      }
    }
  }, [models]);

  const [applySmooth, setApplySmooth] = useState(true);

  // Handle validation of models
  const toggleCurrentModelValidation = async () => {
    if (!currentModel) {
      return;
    }
    setLoading({ ...loading, model: true });

    const { id } = currentModel;

    // model will get validated (it is not yet),
    // we should save the current cutline before it does
    if (
      currentModel &&
      !currentModel.is_validated &&
      pendingCutline !== currentCutline
    ) {
      const formData = dict2formdata({
        points: JSON.stringify(pendingCutline),
        model: id,
        provider: 0 /* It is a manual modification */,
      });

      try {
        await backend.post("cutlines", formData);
        setCurrentCutline(pendingCutline);
      } catch (e) {
        console.error(e);
      }
    }

    // the model will be un-validated
    // revert to the previous cutline rather than the adjusted one
    if (currentModel && currentModel.is_validated) {
      await backend.post(`models/${currentModel.id}/previous_cutline`);
    }

    const model = await updateModel(currentModel.id, {
      is_validated: !currentModel.is_validated,
      apply_smooth: applySmooth,
    });

    setCurrentModel(model);

    setLoading({ ...loading, model: false });
  };

  const cleanCurrentModelValidation = async () => {
    if (!currentModel) {
      return;
    }
    setLoading({ ...loading, model: true });

    const model = await updateModel(currentModel.id, {
      is_validated: false,
      active_cutline: null,
    });
    setCurrentModel(model);
    setLoading({ ...loading, model: false });
  };

  // Auto save cutline
  const saveCurrentCutline = async (cutline) => {
    const cutlineVersionU = cutlineVersion + 1;
    setCutlineVersion(cutlineVersionU);
    setPendingCutline(cutline);
    if (cutlineVersionU % 10 === 0) {
      const formData = dict2formdata({
        points: JSON.stringify(cutline),
        model: currentModel.id,
        provider: 0,
      });
      backend.post("cutlines", formData);
    }
  };

  const forceSaveCurrentCutline = async (cutline) => {
    setIsSavingRequested(false);
    const cutlineVersionU = cutlineVersion + 1;
    setCutlineVersion(cutlineVersionU);
    setPendingCutline(cutline);
    const formData = dict2formdata({
      points: JSON.stringify(cutline),
      model: currentModel.id,
      provider: 0,
    });
    backend.post("cutlines", formData);
  };

  const goToNextModel = () => {
    const { type, rank } = currentModel || { type: 0, rank: -1 };
    const model = models.filter((m) => m.type === type && m.rank > rank)[0];
    if (model) {
      setCurrentModel(model);
    }
  };

  const saveInitPoints = (pointList) => {
    setInitPoints(pointList);
  };

  const refreshModelStatus = async (modelId) => {
    try {
      const response = await backend.get(`models/${modelId}`);
      const modelStatus = response.data.is_cutline_on_process;
      if (modelStatus !== false) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return refreshModelStatus(modelId); // Recursive call
      }
      return response.data;
    } catch (error) {
      console.error("Error refreshing model status:", error);
      throw error;
    }
  };

  const createCutline = async () => {
    if (initPoints.length === 3) {
      setLoading({ ...loading, model: false });
      const data = initPoints;
      setCreationMode(false);
      await backend.post(`models/${currentModel.id}/init_cutline`, data);
      const modelId = currentModel.id;
      setLoading({ ...loading, model: true });
      setCurrentModel(null);
      setInitPoints([]);
      setLoadedCutline(null);
      try {
        const refreshedModelData = await refreshModelStatus(modelId);
        setCurrentModel(refreshedModelData);
      } catch (error) {
        console.error(error);
      }
    } else if (initPoints.length < 3) {
      NotificationManager.warning(
        translation("messages.cutlines.not_enough_points")
      );
    } else {
      NotificationManager.warning(
        translation("messages.cutlines.too_many_points")
      );
    }
  };

  const resetToCreationMode = async () => {
    await backend.post(`models/${currentModel.id}/reset_cutline`);
    setCutline(null);
    setInitPoints([]);
    setCreationMode(true);
  };

  const resetInitPoints = () => {
    setInitPoints([]);
  };

  return (
    <InlineContext.Provider
      value={{
        modal,
        setModal,
        fetchPatient,

        latestSetup,
        setups,

        createSetup,

        loadingSetups,

        models,
        setModels,
        currentModel,
        setCurrentModel,
        fetchModelsCutline,
        updateModel,
        deleteModel,
        selected,
        setSelected,
        setSelectedModel,
        selectedSetup,
        setSelectedSetup,

        currentCutline,
        setCurrentCutline,

        creationMode,
        setCreationMode,
        initPoints,
        setInitPoints,
        saveInitPoints,
        createCutline,
        resetToCreationMode,
        resetInitPoints,

        goToNextModel,

        setEnableCutline,
        cutlineStep,
        setCutlineStep,

        toggleCurrentModelValidation,
        cleanCurrentModelValidation,
        saveCurrentCutline,
        simulator,
        setSimulator,
        orientation,
        setOrientation,
        transOrRot,
        setTransOrRot,
        detailedLoading: loading,
        collisionIndexes,
        setCollisionIndexes,

        forceSaveCurrentCutline,
        isSavingRequested,
        setIsSavingRequested,

        applySmooth,
        setApplySmooth,
      }}
    >
      {children}
    </InlineContext.Provider>
  );
}
