import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { AppContext } from "@inplan/AppContext";
import logo from "@inplan/assets/images/logo.png";
import { BACKEND_URL } from "@inplan/adapters/apiCalls";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

import LoginView from "./LoginView";

const styles = {
  logo: {
    display: "flex",
    justifyContent: "center",
    width: "484px",
  },
};

class IndexView extends React.Component {
  handleLogin = (data) => {
    const { t: translation, navigate, showSnackbar } = this.props; // Utilisation du destructuring
    const { setOnConnect } = this.context;

    fetch(`${BACKEND_URL}/api/1/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 409) {
          return res.json().then((json) => {
            const forceDisconnect = window.confirm(
              translation("messages.common.already_connected_elsewhere"),
            );
            if (forceDisconnect) {
              return fetch(`${BACKEND_URL}/api/1/force-disconnect/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: data.username,
                  password: data.password,
                }),
              })
                .then((disconnectRes) => {
                  if (!disconnectRes.ok) {
                    throw new Error(
                      translation("messages.common.force_disconnect_failed"),
                    );
                  }
                  return fetch(`${BACKEND_URL}/api/1/token/`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  });
                })
                .then((retryRes) => {
                  if (!retryRes.ok) {
                    throw new Error(
                      translation("messages.common.invalid_credentials"),
                    );
                  }
                  return retryRes.json();
                });
            }
            throw new Error(
              translation("messages.common.session_already_active"),
            );
          });
        }
        if (!res.ok) {
          throw new Error(translation("messages.common.invalid_credentials"));
        }
        return res.json();
      })
      .then((json) => {
        setOnConnect(true);
        localStorage.setItem("access-token", json.access);
        localStorage.setItem("refresh-token", json.refresh);
        navigate("/patients"); // Utilisation de la navigation passée en prop
        showSnackbar(translation("messages.common.login_success"), "success");
      })
      .catch((err) => {
        console.error(err);
        showSnackbar(
          err.message ||
            translation(
              "messages.common.unknown_user_or_application_not_available",
            ),
          "error",
        );
      });
  };

  render() {
    const { onConnect } = this.context;
    const { t: translation } = this.props; // Destructuring dans render
    return (
      <Routes>
        <Route
          path="/"
          element={
            onConnect ? (
              <Navigate to="/patients" />
            ) : (
              <div
                className="grid"
                style={{ background: "#FFFFFF", height: "100vh" }}
              >
                <div className="auth-page">
                  <div style={styles.logo}>
                    <img src={logo} alt="logo" />
                  </div>
                  <div className="auth-hero">
                    {translation("login.form.title")}
                  </div>
                  <div style={{ padding: "50px 0 20px 0" }}>
                    <LoginView handleLogin={this.handleLogin} />
                  </div>
                </div>
                <div className="auth-image" />
              </div>
            )
          }
        />
      </Routes>
    );
  }
}

IndexView.contextType = AppContext;

function IndexViewWithNavigate(props) {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  return (
    <IndexView {...props} navigate={navigate} showSnackbar={showSnackbar} />
  );
}

export default withTranslation()(IndexViewWithNavigate);
