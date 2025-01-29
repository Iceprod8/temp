import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { dict2formdata } from "@inplan/adapters/functions";
import usePatients from "@inplan/common/usePatients";
import { useModels, useSetups } from "@inplan/common/collections";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

const InlineContext = createContext();
export const useInlineContext = () => useContext(InlineContext);
const modelSignature = (m) =>
  !m
    ? []
    : JSON.stringify([
        m.id,
        !!m.base,
        m.base_error,
        m.setup_rank,
        m.type,
        m.setup?.id,
        m.step?.id,
        m.is_base_on_process,
        m.is_cutline_on_process,
        m.is_validated,
        m.is_template,
        m.is_original,
        m.active_cutline?.id,
        m.base_active_cutline?.id,
      ]);

export function InlineContextProvider({ children }) {
  const { patient, fetchPatient } = usePatients();
  const {
    items: setups,
    latestSetup,
    fetchItems: fetchSetups,
    createItem: createSetup,
    loading: loadingSetups,
  } = useSetups();
  const {
    fetchItem: fetchModel,
    updateItem: updateModel,
    deleteItem: deleteModel,
  } = useModels();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();

  const [state, setState] = useState({
    modal: "",
    currentModel: null,
    loadedCutline: null,
    enableCutline: false,
    currentCutline: null,
    pendingCutline: null,
    cutlineVersion: 0,
    cutlineStep: 0,
    loading: {},
    simulator: true,
    orientation: "",
    models: [],
    transOrRot: { activeTrans: false, activeRot: false, x: 1, y: 1, z: 1 },
    initPoints: null,
    creationMode: false,
    selectedSetup: { id: latestSetup },
    collisionIndexes: null,
    isSavingRequested: false,
    selectedModels: {},
    applySmooth: true,
  });

  const setCutline = useCallback(
    (line) =>
      setState((prev) => ({
        ...prev,
        currentCutline: line,
        pendingCutline: line,
      })),
    [],
  );

  const setSelectedModel = (model, value) => {
    setState((prev) => ({
      ...prev,
      selectedModels: {
        ...prev.selectedModels,
        [model.id]: value,
      },
    }));
  };

  const fetchModelsCutline = useCallback(async () => {
    if (patient?.id && state.selectedSetup.id) {
      const { data } = await backend.get("models/get_models_cutline", {
        params: { patient_id: patient.id, setup_id: state.selectedSetup.id },
      });
      if (JSON.stringify(data) !== JSON.stringify(state.models))
        setState((prev) => ({ ...prev, models: data }));
    }
  }, [patient, state.selectedSetup.id, state.models]);

  useEffect(() => {
    (async () => {
      if (!patient) return;
      [fetchSetups].forEach((f) => f({ patient_id: patient.id }));
      fetchModelsCutline();
    })();
  }, [patient]);

  useEffect(
    () =>
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, setups: loadingSetups },
      })),
    [loadingSetups],
  );

  useEffect(() => {
    if (!state.loadedCutline || !state.currentModel) return;
    const [refModel, line] = state.loadedCutline;
    if (refModel.id === state.currentModel.id) setCutline(line);
  }, [state.loadedCutline, state.currentModel, setCutline]);

  useEffect(() => {
    if (!state.enableCutline) {
      setCutline(null);
      setState((prev) => ({
        ...prev,
        initPoints: [],
      }));
    }
  }, [state.enableCutline]);

  useEffect(() => {
    if (!state.enableCutline) {
      setCutline(null);
      setState((prev) => ({ ...prev, creationMode: false, initPoints: [] }));
    }

    if (!state.currentModel) return;

    fetchModel(state.currentModel.id);
    setState((prev) => ({ ...prev, currentCutline: null }));
    if (state.enableCutline && state.currentModel?.active_cutline) {
      setState((prev) => ({
        ...prev,
        creationMode: false,
        loading: { ...prev.loading, model: true },
      }));
      const cutlineKey =
        state.currentModel.is_validated && state.currentModel.base
          ? "base_active_cutline"
          : "active_cutline";
      backend
        .get(`/cutlines/${state.currentModel[cutlineKey]}`)
        .then(({ data: line }) => {
          setState((prev) => ({
            ...prev,
            collisionIndexes: line.collision_indexes,
            loadedCutline: [
              state.currentModel,
              state.currentModel.is_validated && state.currentModel.base
                ? line.polyline
                : line.points,
            ],
          }));
        })
        .catch(console.error)
        .finally(() =>
          setState((prev) => ({
            ...prev,
            loading: { ...prev.loading, model: false },
          })),
        );
    } else
      setState((prev) => ({ ...prev, creationMode: true, initPoints: [] }));
  }, [state.currentModel, state.enableCutline, fetchModel, setCutline]);

  useEffect(() => {
    if (state.currentModel) {
      const updatedCurrentModel = state.models.find(
        (m) => m.id === state.currentModel.id,
      );
      if (
        modelSignature(state.currentModel) !==
        modelSignature(updatedCurrentModel)
      )
        setState((prev) => ({ ...prev, currentModel: updatedCurrentModel }));
    }
  }, [state.models]);

  const saveCurrentCutline = useCallback(
    async (cutline) => {
      const version = state.cutlineVersion + 1;
      setState((prev) => ({
        ...prev,
        cutlineVersion: version,
        pendingCutline: cutline,
      }));
      if (version % 10 === 0) {
        const formData = dict2formdata({
          points: JSON.stringify(cutline),
          model: state.currentModel.id,
          provider: 0,
        });
        backend.post("cutlines", formData);
      }
    },
    [state.cutlineVersion, state.currentModel],
  );

  const toggleCurrentModelValidation = async () => {
    if (!state.currentModel) return;
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, model: true },
    }));
    const { id, is_validated } = state.currentModel;
    if (!is_validated && state.pendingCutline !== state.currentCutline) {
      await backend
        .post(
          "cutlines",
          dict2formdata({
            points: JSON.stringify(state.pendingCutline),
            model: id,
            provider: 0,
          }),
        )
        .then(() =>
          setState((prev) => ({
            ...prev,
            currentCutline: state.pendingCutline,
          })),
        )
        .catch(console.error);
    }
    if (is_validated) await backend.post(`models/${id}/previous_cutline`);
    setState(async (prev) => ({
      ...prev,
      currentModel: await updateModel(id, {
        is_validated: !is_validated,
        apply_smooth: state.applySmooth,
      }),
      loading: { ...prev.loading, model: false },
    }));
  };

  const cleanCurrentModelValidation = async () => {
    if (!state.currentModel) return;
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, model: true },
    }));
    const model = await updateModel(state.currentModel.id, {
      is_validated: false,
      active_cutline: null,
    });
    setState((prev) => ({
      ...prev,
      currentModel: model,
      loading: { ...prev.loading, model: false },
    }));
  };

  const forceSaveCurrentCutline = async (cutline) => {
    setState((prev) => ({
      ...prev,
      isSavingRequested: false,
      cutlineVersion: state.cutlineVersion + 1,
      pendingCutline: cutline,
    }));
    backend.post(
      "cutlines",
      dict2formdata({
        points: JSON.stringify(cutline),
        model: state.currentModel.id,
        provider: 0,
      }),
    );
  };

  const goToNextModel = () => {
    const { type, rank } = state.currentModel || { type: 0, rank: -1 };
    const model = state.models.filter(
      (m) => m.type === type && m.rank > rank,
    )[0];
    if (model) setState((prev) => ({ ...prev, currentModel: model }));
  };

  const saveInitPoints = (pointList) =>
    setState((prev) => ({ ...prev, initPoints: pointList }));

  const refreshModelStatus = async (modelId) => {
    const response = await backend
      .get(`models/${modelId}`)
      .then(({ data: modelStatus }) => {
        if (modelStatus?.is_cutline_on_process === false) return response.data;
        return null;
      })
      .catch(console.error);
  };

  const createCutline = async () => {
    if (state.initPoints.length === 3) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, model: false },
        creationMode: false,
      }));
      await backend.post(
        `models/${state.currentModel.id}/init_cutline`,
        state.initPoints,
      );
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, model: false },
        currentModel: null,
        initPoints: [],
        loadedCutline: null,
      }));
      setInterval(async () => {
        await refreshModelStatus(state.currentModel.id)
          .then((refreshedModelData) =>
            setState((prev) => ({
              ...prev,
              currentModel: refreshedModelData,
            })),
          )
          .catch(console.error);
      }, 1000);
    } else if (state.initPoints.length < 3) {
      showSnackbar(
        translation("messages.cutlines.not_enough_points"),
        "warning",
      );
    } else {
      showSnackbar(translation("messages.cutlines.too_many_points"), "warning");
    }
  };

  const resetToCreationMode = async () => {
    await backend.post(`models/${state.currentModel.id}/reset_cutline`);
    setCutline(null);
    setState((prev) => ({
      ...prev,
      initPoints: [],
      creationMode: true,
    }));
  };

  const resetInitPoints = () => {
    setState((prev) => ({ ...prev, initPoints: [] }));
  };

  const providerValue = useMemo(
    () => ({
      ...state,
      setState,
      setSelectedModel,
      fetchModelsCutline,
      fetchPatient,
      setCutline,
      saveCurrentCutline,
      toggleCurrentModelValidation,
      cleanCurrentModelValidation,
      forceSaveCurrentCutline,
      goToNextModel,
      saveInitPoints,
      createCutline,
      resetToCreationMode,
      resetInitPoints,

      setups,
      latestSetup,
      createSetup,
      deleteModel,
    }),
    [
      state,
      fetchModelsCutline,
      fetchPatient,
      setCutline,
      saveCurrentCutline,
      toggleCurrentModelValidation,
      cleanCurrentModelValidation,
      forceSaveCurrentCutline,
      goToNextModel,
      saveInitPoints,
      createCutline,
      resetToCreationMode,
      resetInitPoints,
    ],
  );

  return (
    <InlineContext.Provider value={providerValue}>
      {children}
    </InlineContext.Provider>
  );
}
