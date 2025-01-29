import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@inplan/AppContext";
import useQuery from "@inplan/common/useQuery";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import PanelWithVisu from "@inplan/views/inline/PanelWithVisu";
import DashboardPeriods from "./Periods";
import DashboardSidebar from "./Sidebar";
import { useDashboardContext, DashboardContextProvider } from "./Context";
import DashboardControlInfos from "./ControlInfos";
import DashboardControlOrders from "./ControlOrders";
import DashboardControlAppointments from "./ControlAppointments";
import DashboardControlSetups from "./ControlSetups";
import DashboardControlPatient from "./ControlPatient";
import { InlineContextProvider } from "../../contexts/InlineContext";
import CreateModalPeriod from "./CreatePeriodModals";
import DeleteModalPeriod from "./DeleteModalPeriod";

function DashboardInner({ submenu }) {
  const { setActivePatient, getUserRights } = useAppContext();
  const { t: translation } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const [animate, setAnimate] = useState(true);

  const { idPatient } = useParams();
  const query = useQuery();

  const navigate = useNavigate();

  useEffect(() => {
    getUserRights();
  }, []);
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

  useEffect(() => {
    if (!idPatient) return;
    fetchPatient(idPatient);
  }, [idPatient]);

  useEffect(() => {
    if (patient && patient.archived === true) {
      navigate("/patients");
      return;
    }
    if (query.get("new-period")) {
      setModal("modal-createPeriod");
    }
    setActivePatient(patient);
  }, [patient]);

  useEffect(() => {
    setPage(submenu);
  }, [submenu]);

  if (!periods) {
    return <>{translation("messages.common.loading")}</>;
  }

  const body =
    page === "orders" ? (
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
      <CreateModalPeriod />
      <DeleteModalPeriod />
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
