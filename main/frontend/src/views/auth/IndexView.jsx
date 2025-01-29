import React from "react";
import { Redirect, Route } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { withTranslation } from "react-i18next";
import { AppContext } from "@inplan/AppContext";
import logo from "@inplan/assets/images/logo.png";
import { BACKEND_URL } from "@inplan/adapters/apiCalls";

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
    const { t: translation } = this.props;
    const { setOnConnect } = this.context;
    const { history } = this.props;

    fetch(`${BACKEND_URL}/api/1/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 409) {
          // Handle session conflict
          return res.json().then((json) => {
            const forceDisconnect = window.confirm(
              translation("messages.common.already_connected_elsewhere")
            );
            if (forceDisconnect) {
              // Send credentials to force disconnect
              return fetch(`${BACKEND_URL}/api/1/force-disconnect/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: data.username, // Pass the username
                  password: data.password, // Pass the password
                }),
              })
                .then((disconnectRes) => {
                  if (!disconnectRes.ok) {
                    throw new Error(
                      translation("messages.common.force_disconnect_failed")
                    );
                  }
                  // Retry login after force disconnect
                  return fetch(`${BACKEND_URL}/api/1/token/`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data), // Retry with the original login data
                  });
                })
                .then((retryRes) => {
                  if (!retryRes.ok) {
                    throw new Error(
                      translation("messages.common.invalid_credentials")
                    );
                  }
                  return retryRes.json();
                });
            }
            throw new Error(
              translation("messages.common.session_already_active")
            );
          });
        }
        if (!res.ok) {
          throw new Error(translation("messages.common.invalid_credentials"));
        }
        return res.json();
      })
      .then((json) => {
        // Successfully logged in
        setOnConnect(true);
        localStorage.setItem("access-token", json.access); // Save access token
        localStorage.setItem("refresh-token", json.refresh); // Save refresh token
        history.push("/patients"); // Redirect to patients page
      })
      .catch((err) => {
        console.error(err);
        NotificationManager.error(
          err.message ||
            translation(
              "messages.common.unknown_user_or_application_not_available"
            )
        );
      });
  };

  render() {
    const { onConnect } = this.context;
    const { t: translation } = this.props;
    return (
      <Route
        render={() =>
          onConnect ? (
            <Redirect to="/patients" />
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
    );
  }
}
IndexView.contextType = AppContext;

export default withTranslation()(IndexView);
