import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppContext } from "@inplan/AppContext";
import useQuery from "@inplan/common/useQuery";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import PanelWithVisu from "@inplan/views/inline/PanelWithVisu";
import DashboardPeriods from "./Periods";
import DashboardSidebar from "./Sidebar";
import DashboardModalManager from "./ModalManager";
import { useDashboardContext, DashboardContextProvider } from "./Context";
import DashboardControlInfos from "./ControlInfos";
import DashboardControlOrders from "./ControlOrders";
import DashboardControlAppointments from "./ControlAppointments";
import DashboardControlSetups from "./ControlSetups";
import DashboardControlPatient from "./ControlPatient";
import { InlineContextProvider } from "../inline/InlineContext";

function DashboardInner({ submenu }) {
  const { setActivePatient, userRights, getUserRights } = useAppContext();
  const { t: translation } = useTranslation();
  /* TODO: must put all these state in a context */
  const [hidden, setHidden] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const [animate, setAnimate] = useState(true);

  const { idPatient } = useParams();
  const query = useQuery();

  const history = useHistory();

  useEffect(() => {
    getUserRights();
  }, []);
  // Context var
  const {
    page,
    setPage,
    setModal,
    fetchPatient,
    periods,
    patient,
    doctors,
    producers,
    loadingSetups,
    sheets,
  } = useDashboardContext();

  //  FIXME those 2 dead code

  // const hasOnlyInline = userData?.office?.has_only_inline;
  // useEffect(() => {
  //   if (hasOnlyInline !== null && hasOnlyInline !== undefined) {
  //     setAnimate(hasOnlyInline);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (userRights !== null) {
  //     setAnimate(userRights?.cutlines);
  //   }
  // }, []);

  // Fetch patient and periods data
  useEffect(() => {
    if (!idPatient) return;
    /* Fetch the patient */
    fetchPatient(idPatient);
  }, [idPatient]);

  useEffect(() => {
    if (patient && patient.archived === true) {
      history.push("/patients");
      return;
    }

    /* FIXME: bad design ? */
    if (query.get("new-period")) {
      setModal("modal-createPeriod");
    }
    // if (patient.archived === false) setActivePatient(patient);

    setActivePatient(patient);
  }, [patient]);

  // FIXME: hack to load a specific submenu
  useEffect(() => {
    setPage(submenu);
  }, [submenu]);

  // Animation effect
  if (!periods) {
    return <>{translation("messages.common.loading")}</>;
  }

  const body =
    page === "orders" ? (
      // The component is loaded before useDashboardContext() is ready,
      // so <patient>, <doctors>, <setups> and <sheets> must be checked to have initial values
      // Because setups variable takes null or an array, it must validate that the request has finished
      // doctors variable takes always an array with real doctors or
      // if there are no doctors, a single position array is assigned [{id : "0", appellation : "undefinied"}]
      // producers variable takes always an array with real producers or
      // if there are no producers, a single position array is assigned [{id : "0", name : "undefinied"}]
      patient &&
      doctors?.length > 0 &&
      producers?.length > 0 &&
      sheets?.length > 0 &&
      !loadingSetups ? (
        <DashboardControlOrders />
      ) : null
    ) : page === "appointment" ? (
      <DashboardControlAppointments />
    ) : page === "setups" ? (
      <DashboardControlSetups />
    ) : page === "patient" ? (
      <DashboardControlPatient />
    ) : page === "informations" ? (
      <div className="dashboard-control__body">
        <DashboardPeriods />
        <DashboardControlInfos />
      </div>
    ) : ["cutlines", "models"].includes(page) ? (
      <InlineContextProvider>
        <PanelWithVisu
          hidden={hidden}
          animate={animate}
          setAnimate={setAnimate}
          isTranslate={isTranslate}
          setIsTranslate={setIsTranslate}
        />
      </InlineContextProvider>
    ) : (
      <div className="dashboard-control__body" />
    );

  return (
    <section className="dashboard">
      <DashboardModalManager />
      <div className="dashboard__main">
        <DashboardSidebar
          animate={animate}
          setAnimate={setAnimate}
          setHidden={setHidden}
          isTranslate={isTranslate}
          setIsTranslate={setIsTranslate}
        />
        <div className="dashboard-body">{body}</div>
      </div>
    </section>
  );
}

export default function Dahboard(props) {
  return (
    <DashboardContextProvider>
      <DashboardInner {...props} />
    </DashboardContextProvider>
  );
}
