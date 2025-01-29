import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";

import getVersion from "./version";
import checkUser from "./adapters/checkUser";
import {
  useLicenseTypes,
  useOffices,
  useUserLicenses,
  useUsers,
  useCutCounts,
} from "./common/collections";

const DEBUG = process.env.REACT_APP_DEBUG === "1" || false;

export const AppContext = createContext({
  version: {
    frontendVersion: "",
    backendVersion: "",
  },
  debug: false,
  username: null,
  language: null,
  onConnect: null, // true, false, or null if not set
  setOnConnect: Function,
  name: null,
  email: null,
  id: null,
  activePatient: null,

  modal: "",
  updateModale: Function,
  selectedNote: {},
  practitioner: {},
  updatePractitioner: Function,
});

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
  // Batch preferences options
  const [preserveBatchOnValidation, setPreserveBatchOnValidation] =
    useState(true);
  const [preserveCutterBatchOnValidation, setPreserveCutterBatchOnValidation] =
    useState(true);

  // order_template options
  const [defaultOrderType, setDefaultOrderType] = useState(null);
  const [defaultPickupLocation, setDefaultPickupLocation] = useState(null);
  const [defaultDeadlineType, setDefaultDeadlineType] = useState(null);
  const [defaultTemplateSheet, setDefaultTemplateSheet] = useState(null);
  const [defaultSheet, setDefaultSheet] = useState(null);
  const [defaultDoctor, setDefaultDoctor] = useState(null);

  const {
    items: userLicenses,
    fetchItems: fetchUserLicenses,
    createItem: createUserLicense,
    updateItem: updateUserLicense,
    deleteItem: deleteUserLicense,
    loading: loadingUserLicenses,
  } = useUserLicenses();

  const {
    items: users,
    fetchItems: fetchUsers,
    createItem: createUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    loading: loadingUsers,
  } = useUsers();

  const {
    items: cutCounts,
    fetchItems: fetchCutCounts,
    createItem: createCutCount,
    updateItem: updateCutCount,
    deleteItem: deleteCutCount,
    loading: loadingCutCounts,
  } = useCutCounts();

  const {
    items: offices,
    fetchItems: fetchOffices,
    loading: loadingOffices,
  } = useOffices();

  const {
    items: licenseTypes,
    fetchItems: fetchLicenseTypes,
    loading: loadingLicenseTypes,
  } = useLicenseTypes();

  async function getUserRights() {
    try {
      const { data } = await backend.get("users/get_user_rights");
      if (Object.keys(data).length === 0) {
        console.log("The user does not have any rights");
        setUserRights(null);
      } else {
        setUserRights(data);
      }
      return data;
    } catch (error) {
      console.log("Error: ", error);
    }
    return null;
  }

  useEffect(
    () =>
      (async () => {
        if (onConnect === false) return;
        const ver = await getVersion();
        if (ver) {
          setVersion(ver);
        }
        const response = await checkUser();
        if (response.data) {
          await getUserRights();
          setUsername(response.data.username);
          setLanguage(response.data.language);
          setPreserveBatchOnValidation(
            response.data.preserve_batch_on_validation
          );
          setPreserveCutterBatchOnValidation(
            response.data.preserve_cutter_batch_on_validation
          );

          if (response.data.order_template) {
            setDefaultOrderType(response.data.order_template.type);
            setDefaultPickupLocation(
              response.data.order_template.pickup_location
            );
            setDefaultDeadlineType(response.data.order_template.deadline_type);
            setDefaultTemplateSheet(
              response.data.order_template.template_sheet
            );
            setDefaultSheet(response.data.order_template.sheet);
            setDefaultDoctor(response.data.order_template.doctor);
          } else {
            console.log("User does not have order template");
            setDefaultOrderType(1); // aligner
            setDefaultPickupLocation(0); // clinic
            setDefaultDeadlineType(1); // appointment
          }
          setUserData(response.data);
          setOnConnect(true);
          i18n.changeLanguage(response.data.language);
          const { data: practitioner1 } = await backend.get(
            `practitioners/${response.data.id}`
          );
          setPractitioner(practitioner1);
        } else {
          setOnConnect(false);
        }
      })(),
    [onConnect]
  );

  useEffect(async () => {
    if (userRights?.handle_licenses && userRights?.to_read) {
      await fetchUserLicenses();
      await fetchLicenseTypes();
      await fetchUsers();
    }
    if (userRights?.handle_users && userRights?.to_read_user) {
      await fetchUsers();
      await fetchOffices();
    }
  }, [userRights]);

  return (
    <AppContext.Provider
      value={{
        version,
        debug: DEBUG,
        username,
        userRights,
        getUserRights,
        userLicenses,
        fetchUserLicenses,
        createUserLicense,
        updateUserLicense,
        deleteUserLicense,
        loadingUserLicenses,
        licenseTypes,
        fetchLicenseTypes,
        users,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        fetchCutCounts,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
