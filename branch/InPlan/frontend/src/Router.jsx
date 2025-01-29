import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

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

import PrivateRoute from "./PrivateRoute";
import NoRights from "./common/NoRights";
import Licenses from "./views/licenses";
import Management from "./views/management/management";
import Users from "./views/users";

export default function Router() {
  const { onConnect, userRights } = useAppContext();
  const renderComponent = (check, component) => {
    return check ? component : <NoRights />;
  };
  return (
    <BrowserRouter>
      {onConnect ? <Navbar /> : null}
      <Switch>
        <Route path="/" exact render={(props) => <IndexView {...props} />} />

        {/* DASHBOARD OPTIONS */}
        <PrivateRoute path="/dashboard/:idPatient" exact>
          {userRights?.order_creation || userRights?.reduced_order_creation ? (
            <Dashboard submenu="orders" />
          ) : userRights?.cutlines ? (
            <Dashboard submenu="cutlines" />
          ) : userRights?.patient_profile ? (
            <Dashboard submenu="patient" />
          ) : userRights?.setups ? (
            <Dashboard submenu="setups" />
          ) : userRights?.appointments ? (
            <Dashboard submenu="appointment" />
          ) : userRights?.periods ? (
            <Dashboard submenu="informations" />
          ) : (
            <NoRights />
          )}
        </PrivateRoute>

        <PrivateRoute path="/dashboard/:idPatient/periods" exact>
          {renderComponent(
            userRights?.periods,
            <Dashboard submenu="informations" />
          )}
        </PrivateRoute>

        <PrivateRoute path="/dashboard/:idPatient/orders" exact>
          {renderComponent(
            userRights?.order_creation || userRights?.reduced_order_creation,
            <Dashboard submenu="orders" />
          )}
        </PrivateRoute>

        <PrivateRoute path="/dashboard/:idPatient/setups" exact>
          {renderComponent(userRights?.setups, <Dashboard submenu="setups" />)}
        </PrivateRoute>

        <PrivateRoute path="/dashboard/:idPatient/cutlines" exact>
          {renderComponent(
            userRights?.cutlines,
            <Dashboard submenu="cutlines" />
          )}
        </PrivateRoute>

        <PrivateRoute path="/dashboard/:idPatient/appointment" exact>
          {renderComponent(
            userRights?.appointments,
            <Dashboard submenu="appointment" />
          )}
        </PrivateRoute>
        {/* END DASHBOARD OPTIONS */}

        {/* NAVBAR OPTIONS */}
        <PrivateRoute path="/patients" exact>
          {renderComponent(
            userRights?.patients_list || userRights?.reduced_patients_list,
            <Patients />
          )}
        </PrivateRoute>

        <PrivateRoute path="/laboratory" exact>
          {renderComponent(userRights?.order_list, <Laboratory />)}
        </PrivateRoute>

        <PrivateRoute path="/models" exact>
          {renderComponent(userRights?.printing, <Models />)}
        </PrivateRoute>

        <PrivateRoute path="/aligners" exact>
          {renderComponent(userRights?.thermoforming, <Aligners />)}
        </PrivateRoute>

        <PrivateRoute path="/inlase" exact>
          {renderComponent(userRights?.inlase, <Inlase />)}
        </PrivateRoute>

        <PrivateRoute exact path="/profile">
          <Profile />
        </PrivateRoute>
        {/* END NAVBAR OPTIONS */}

        <PrivateRoute path="/calibration" exact>
          {renderComponent(userRights?.calibration_screen, <Calibration />)}
        </PrivateRoute>

        <PrivateRoute path="/licenses" exact>
          {renderComponent(
            userRights?.handle_licenses && userRights?.to_read,
            <Licenses />
          )}
        </PrivateRoute>
        <PrivateRoute path="/management" exact>
          {renderComponent(
            userRights?.handle_licenses && userRights?.handle_users,
            <Management />
          )}
        </PrivateRoute>

        <PrivateRoute path="/users" exact>
          {renderComponent(
            userRights?.handle_users && userRights?.to_read_user,
            <Users />
          )}
        </PrivateRoute>

        <PrivateRoute path="/labels1/:idOrder" exact>
          {renderComponent(
            userRights?.bag_label_parameters,
            <PrintBagLabelView />
          )}
        </PrivateRoute>

        <PrivateRoute path="/addresslabel/:idPatient" exact>
          {renderComponent(
            userRights?.patient_profile,
            <PrintPatientAddressLabelView />
          )}
        </PrivateRoute>

        <PrivateRoute path="/orderlabel/:idOrder" exact>
          {renderComponent(
            userRights?.order_label_parameters,
            <OrderLabelView />
          )}
        </PrivateRoute>

        <PrivateRoute path="/orderedit/:orderId" exact>
          {renderComponent(userRights?.order_edit, <OrderEditView />)}
        </PrivateRoute>

        <Route component={Register} path="/register" exact />
        <Route component={ForgotPass} path="/forgot-password" exact />
        <Route component={ResetPass} path="/reset-password/:token" />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}
