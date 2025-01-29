import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "@inplan/common/Navbar";
import IndexView from "@inplan/views/auth/IndexView";
import Dashboard from "@inplan/views/dashboard/Dashboard";
import Patients from "@inplan/views/patients/Patients";
import Models from "@inplan/views/models/Models";
import Aligners from "@inplan/views/aligners/Aligners";
import PrintBagLabelView from "@inplan/views/labels/PrintBagLabelView";
import PrintPatientAddressLabelView from "@inplan/views/labels/PrintPatientAddressLabelView";
import OrderLabelView from "@inplan/views/labels/PrintOrderLabelView";
import Inlase from "@inplan/views/inlase";
import Calibration from "@inplan/views/calibration/Calibration";
import OrderEditView from "@inplan/views/order/OrderEditView";
import Profile from "@inplan/views/practitioner/Profile";
import { Register, ForgotPass, ResetPass } from "@inplan/views/auth/index";
import NotFound from "@inplan/common/NotFound";
import Laboratory from "@inplan/views/laboratory";
import { useAppContext } from "@inplan/AppContext";
import Licenses from "./views/licenses";
import Management from "./views/management/management";
import Users from "./views/users";
import PrivateRoute from "./PrivateRoute";
import Test from "./Test";

export default function GlobalRouter() {
  const { userRights } = useAppContext();
  const isLoading = !userRights;

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<IndexView />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />

        {/* Private Routes */}
        <Route
          path="/dashboard/:idPatient/orders"
          element={
            <PrivateRoute
              condition={
                userRights?.order_creation || userRights?.reduced_order_creation
              }
              loading={isLoading}
            >
              <Dashboard submenu="orders" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:idPatient/periods"
          element={
            <PrivateRoute condition={userRights?.periods} loading={isLoading}>
              <Dashboard submenu="informations" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:idPatient/setups"
          element={
            <PrivateRoute condition={userRights?.setups} loading={isLoading}>
              <Dashboard submenu="setups" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:idPatient/cutlines"
          element={
            <PrivateRoute condition={userRights?.cutlines} loading={isLoading}>
              <Dashboard submenu="cutlines" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:idPatient/appointment"
          element={
            <PrivateRoute
              condition={userRights?.appointments}
              loading={isLoading}
            >
              <Dashboard submenu="appointment" />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/:idPatient/patient"
          element={
            <PrivateRoute
              condition={userRights?.patient_profile}
              loading={isLoading}
            >
              <Dashboard submenu="settings" />
            </PrivateRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <PrivateRoute
              condition={
                userRights?.patients_list || userRights?.reduced_patients_list
              }
              loading={isLoading}
            >
              <Patients />
            </PrivateRoute>
          }
        />
        <Route
          path="/laboratory"
          element={
            <PrivateRoute
              condition={userRights?.order_list}
              loading={isLoading}
            >
              <Laboratory />
            </PrivateRoute>
          }
        />
        <Route
          path="/models"
          element={
            <PrivateRoute condition={userRights?.printing} loading={isLoading}>
              <Models />
            </PrivateRoute>
          }
        />
        <Route
          path="/aligners"
          element={
            <PrivateRoute
              condition={userRights?.thermoforming}
              loading={isLoading}
            >
              <Aligners />
            </PrivateRoute>
          }
        />
        <Route
          path="/inlase"
          element={
            <PrivateRoute condition={userRights?.inlase} loading={isLoading}>
              <Inlase />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              condition={userRights?.parameters_screen}
              loading={isLoading}
            >
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/calibration"
          element={
            <PrivateRoute
              condition={userRights?.calibration_screen}
              loading={isLoading}
            >
              <Calibration />
            </PrivateRoute>
          }
        />
        <Route
          path="/licenses"
          element={
            <PrivateRoute
              condition={userRights?.handle_licenses && userRights?.to_read}
              loading={isLoading}
            >
              <Licenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/management"
          element={
            <PrivateRoute
              condition={
                userRights?.handle_licenses && userRights?.handle_users
              }
              loading={isLoading}
            >
              <Management />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute
              condition={userRights?.handle_users && userRights?.to_read_user}
              loading={isLoading}
            >
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/labels1/:idOrder"
          element={
            <PrivateRoute
              condition={userRights?.bag_label_parameters}
              loading={isLoading}
            >
              <PrintBagLabelView />
            </PrivateRoute>
          }
        />
        <Route
          path="/addresslabel/:idPatient"
          element={
            <PrivateRoute
              condition={userRights?.patient_profile}
              loading={isLoading}
            >
              <PrintPatientAddressLabelView />
            </PrivateRoute>
          }
        />
        <Route
          path="/orderlabel/:idOrder"
          element={
            <PrivateRoute
              condition={userRights?.order_label_parameters}
              loading={isLoading}
            >
              <OrderLabelView />
            </PrivateRoute>
          }
        />
        <Route
          path="/orderedit/:orderId"
          element={
            <PrivateRoute
              condition={userRights?.order_edit}
              loading={isLoading}
            >
              <OrderEditView />
            </PrivateRoute>
          }
        />
        <Route path="/test" element={<Test />} />
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
