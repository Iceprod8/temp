import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";
import usePatients from "@inplan/common/usePatients";
import {
  useModels,
  usePeriods,
  useSetups,
  useOrders,
  useAppointments,
  useProfiles,
} from "@inplan/common/collections";

const DashboardContext = createContext();

export function useDashboardContext() {
  return useContext(DashboardContext);
}

export function DashboardContextProvider({ children }) {
  const { patient, fetchPatient } = usePatients();

  const {
    items: periods,
    fetchItems: fetchPeriods,
    createItem: createPeriod,
    updateItem: updatePeriod,
    deleteItem: deletePeriod,
    loading: loadingPeriods,
  } = usePeriods();

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
    items: models,
    fetchItems: fetchModels,
    loading: loadingModels,
  } = useModels();

  const {
    items: orders,
    fetchItems: fetchOrders,
    createItem: createOrder,
    updateItem: updateOrder,
    deleteItem: deleteOrder,
    loading: loadingOrders,
  } = useOrders();

  const {
    items: profile,
    fetchItems: fetchProfiles,
    createItem: createProfile,
    updateItem: updateProfile,
    deleteItem: deleteProfile,
    loading: loadingProfile,
  } = useProfiles();

  const {
    items: appointments,
    nextAppointment,
    fetchItems: fetchAppointments,
    createItem: createAppointment,
    updateItem: updateAppointment,
    deleteItem: deleteAppointment,
    loading: loadingAppointments,
  } = useAppointments();

  const { t: translation } = useTranslation();

  const [page, setPage] = useState("informations");
  const [modal, setModal] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [loading, setLoading] = useState({});
  const [sheets, setSheets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [producers, setProducers] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: resOffices } = await backend.get("offices/current");
      const usedSheetListIds = resOffices?.used_sheet_list || [];
      const { data: allSheets } = await backend.get("sheets");
      const usedSheetListDescriptions = allSheets?.results.filter((sheet) =>
        usedSheetListIds.includes(sheet.id),
      );

      setSheets([
        {
          id: "0",
          name: capitalizeFirstLetter(
            translation("utilities.variables.undefined"),
          ),
          provider: "Undefined",
          thickness: 0,
        },
        ...(usedSheetListDescriptions || []),
      ]);
    })();
  }, [translation]);

  useEffect(() => {
    (async () => {
      const { data: res } = await backend.get("doctors/available");
      setDoctors(
        res.length
          ? res
          : [
              {
                id: "0",
                appellation: capitalizeFirstLetter(
                  translation("utilities.variables.unspecified"),
                ),
              },
            ],
      );
    })();
  }, [translation]);

  useEffect(() => {
    (async () => {
      const { data: resOffices } = await backend.get("offices/current");
      const usedProducerList = resOffices?.producer_list || [];
      const { data: res } = await backend.get("producers");
      const producerList = res?.results.filter((producer) =>
        usedProducerList.includes(producer.id),
      );

      setProducers(
        producerList.length
          ? producerList
          : [
              {
                id: "0",
                name: capitalizeFirstLetter(
                  translation("utilities.variables.unspecified"),
                ),
              },
            ],
      );
    })();
  }, [translation]);

  useEffect(() => {
    if (!patient) return;
    [
      fetchPeriods,
      fetchSetups,
      fetchModels,
      fetchAppointments,
      fetchOrders,
      fetchProfiles,
    ].forEach((f) => f({ patient_id: patient.id }));
  }, [patient]);

  useEffect(() => {
    setLoading({
      ...loading,
      orders: loadingOrders,
      periods: loadingPeriods,
      setups: loadingSetups,
      models: loadingModels,
      appointments: loadingAppointments,
      profile: loadingProfile,
    });
  }, [
    loadingOrders,
    loadingPeriods,
    loadingSetups,
    loadingModels,
    loadingAppointments,
    loadingProfile,
  ]);

  const contextValue = useMemo(
    () => ({
      sheets,
      doctors,
      producers,
      page,
      setPage,
      modal,
      setModal,
      patient,
      fetchPatient,
      periods,
      currentPeriod,
      setCurrentPeriod,
      fetchPatientPeriods: (params) =>
        patient && fetchPeriods({ patient_id: patient.id, ...params }),
      createPeriod,
      updatePeriod,
      deletePeriod,
      appointments,
      nextAppointment,
      fetchPatientAppointments: (params) =>
        patient && fetchAppointments({ patient_id: patient.id, ...params }),
      createAppointment,
      updateAppointment,
      deleteAppointment,
      latestSetup,
      setups,
      fetchPatientSetups: (params) =>
        patient && fetchSetups({ patient_id: patient.id, ...params }),
      createSetup,
      updateSetup,
      deleteSetup,
      loadingSetups,
      models,
      fetchPatientModels: (params) =>
        patient && fetchModels({ patient_id: patient.id, ...params }),
      orders,
      fetchPatientOrders: (params) =>
        patient && fetchOrders({ patient_id: patient.id, ...params }),
      createOrder,
      updateOrder,
      deleteOrder,
      profile,
      fetchPatientProfiles: (params) =>
        patient && fetchProfiles({ patient_id: patient.id, ...params }),
      createProfile,
      updateProfile,
      deleteProfile,
      loading: Object.values(loading).every((x) => x),
    }),
    [
      sheets,
      doctors,
      producers,
      page,
      modal,
      patient,
      periods,
      currentPeriod,
      appointments,
      nextAppointment,
      latestSetup,
      setups,
      models,
      orders,
      profile,
      loading,
    ],
  );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
}
