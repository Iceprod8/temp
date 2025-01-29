import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";

import getVersion from "./version";
import checkUser from "./adapters/checkUser";
import {
  useLicenseTypes,
  useOffices,
  useUserLicenses,
  useUsers,
} from "./common/collections";

const DEBUG = process.env.REACT_APP_DEBUG === "1" || false;

export const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppContextProvider({ children }) {
  const { i18n } = useTranslation();
  const [version, setVersion] = useState({
    frontendVersion: "",
    backendVersion: "",
  });
  const [username, setUsername] = useState(null);
  const [userRights, setUserRights] = useState(null);
  const [language, setLanguage] = useState(null);
  const [userData, setUserData] = useState({});
  const [onConnect, setOnConnect] = useState(null);
  const [modal, setModal] = useState("");
  const [practitioner, setPractitioner] = useState({});
  const [activePatient, setActivePatient] = useState(null);
  const [selectedNote, setSelectedNote] = useState({
    title: "",
    body: "",
    patient: null,
  });
  const [preserveBatchOnValidation, setPreserveBatchOnValidation] =
    useState(true);
  const [preserveCutterBatchOnValidation, setPreserveCutterBatchOnValidation] =
    useState(true);

  const [defaultOrderType, setDefaultOrderType] = useState(null);
  const [defaultPickupLocation, setDefaultPickupLocation] = useState(null);
  const [defaultDeadlineType, setDefaultDeadlineType] = useState(null);
  const [defaultTemplateSheet, setDefaultTemplateSheet] = useState(null);
  const [defaultSheet, setDefaultSheet] = useState(null);
  const [defaultDoctor, setDefaultDoctor] = useState(null);

  const { items: userLicenses, fetchItems: fetchUserLicenses } =
    useUserLicenses();
  const { items: users, fetchItems: fetchUsers } = useUsers();
  const { items: offices, fetchItems: fetchOffices } = useOffices();
  const { items: licenseTypes, fetchItems: fetchLicenseTypes } =
    useLicenseTypes();

  async function getUserRights() {
    try {
      const { data } = await backend.get("users/get_user_rights");
      setUserRights(data || null);
      return data;
    } catch (error) {
      console.error("Error fetching user rights:", error);
    }
    return null;
  }

  useEffect(() => {
    (async () => {
      if (onConnect === false) return;
      const ver = await getVersion();
      if (ver) setVersion(ver);

      const response = await checkUser();
      if (response.data) {
        await getUserRights();
        setUsername(response.data.username);
        setLanguage(response.data.language);
        setPreserveBatchOnValidation(
          response.data.preserve_batch_on_validation,
        );
        setPreserveCutterBatchOnValidation(
          response.data.preserve_cutter_batch_on_validation,
        );
        if (response.data.order_template) {
          setDefaultOrderType(response.data.order_template.type);
          setDefaultPickupLocation(
            response.data.order_template.pickup_location,
          );
          setDefaultDeadlineType(response.data.order_template.deadline_type);
          setDefaultTemplateSheet(response.data.order_template.template_sheet);
          setDefaultSheet(response.data.order_template.sheet);
          setDefaultDoctor(response.data.order_template.doctor);
        }
        setUserData(response.data);
        setOnConnect(true);
        i18n.changeLanguage(response.data.language);
        const { data: practitioner1 } = await backend.get(
          `practitioners/${response.data.id}`,
        );
        setPractitioner(practitioner1);
      } else {
        setOnConnect(false);
      }
    })();
  }, [onConnect]);

  useEffect(() => {
    if (userRights?.handle_licenses && userRights?.to_read) {
      fetchUserLicenses();
      fetchLicenseTypes();
    }
    if (userRights?.handle_users && userRights?.to_read_user) {
      fetchUsers();
      fetchOffices();
    }
  }, [userRights]);

  const contextValue = useMemo(
    () => ({
      version,
      debug: DEBUG,
      username,
      userRights,
      getUserRights,
      userLicenses,
      fetchUserLicenses,
      licenseTypes,
      fetchLicenseTypes,
      users,
      fetchUsers,
      offices,
      fetchOffices,
      language,
      onConnect,
      activePatient,
      setActivePatient,
      setOnConnect,
      userData,
      setUserData,
      modal,
      updateModale: setModal,
      selectedNote,
      updateSelectedNote: setSelectedNote,
      practitioner,
      updatePractitioner: setPractitioner,
      defaultOrderType,
      setDefaultOrderType,
      defaultPickupLocation,
      setDefaultPickupLocation,
      defaultDeadlineType,
      setDefaultDeadlineType,
      defaultTemplateSheet,
      setDefaultTemplateSheet,
      defaultSheet,
      setDefaultSheet,
      defaultDoctor,
      setDefaultDoctor,
      preserveBatchOnValidation,
      setPreserveBatchOnValidation,
      preserveCutterBatchOnValidation,
      setPreserveCutterBatchOnValidation,
    }),
    [
      version,
      username,
      userRights,
      userLicenses,
      licenseTypes,
      users,
      offices,
      language,
      onConnect,
      activePatient,
      userData,
      modal,
      selectedNote,
      practitioner,
      defaultOrderType,
      defaultPickupLocation,
      defaultDeadlineType,
      defaultTemplateSheet,
      defaultSheet,
      defaultDoctor,
      preserveBatchOnValidation,
      preserveCutterBatchOnValidation,
    ],
  );
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
