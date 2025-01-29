import React from "react";
import { useTranslation } from "react-i18next";

import logo from "@inplan/assets/images/logo.png";

import { BACKEND_URL } from "@inplan/adapters/apiCalls";

class ResetPass extends React.Component {
  constructor(props) {
    super(props);
    const {
      match: { params },
    } = this.props;
    this.state = {
      token: params.token,
      password: "",
    };
  }

  handleChange = (event) => {
    const {
      target: { name, value },
    } = event;

    this.setState((prevstate) => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handlePassword = (e) => {
    e.preventDefault();
    const { password, token } = this.state;
    const json = JSON.stringify({
      password,
      token,
    });
    const { t: translation } = useTranslation();
    // not sure what to do with that
    fetch(`${BACKEND_URL}/password_reset/confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    })
      .then((res) => {
        if (res.status !== 200) {
          // throw new Error("Invalid Credentials");
          throw new Error(translation("messages.common.invalid_credentials"));
        }
        return res.json();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { password } = this.state;

    return (
      <div className="grid" style={{ background: "#FFFFFF" }}>
        <div className="auth-page">
          <div className="auth__img">
            <img src={logo} alt="logo" />
          </div>
          <div className="auth-hero">
            Reset your password <br />
          </div>
          <form
            onSubmit={(e) => this.handlePassword(e)}
            id="pass-form"
            name="pass-form"
            data-name="Pass Form"
            className="auth-form"
          >
            <div className="grid">
              <div className="form-group-auth">
                <label htmlFor="Email">New password</label>

                <input
                  value={password}
                  type="email"
                  maxLength="256"
                  name="email"
                  data-name="Email"
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group-auth">
                <label htmlFor="Email">Confirm new password</label>

                <input
                  type="email"
                  maxLength="256"
                  name="email"
                  data-name="Email"
                  required
                />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                value="Connexion"
                data-wait="Please wait..."
                className="btn-auth"
              >
                Confirm changes
              </button>
            </div>
          </form>
        </div>
        <div className="auth-image" />
      </div>
    );
  }
}

export default ResetPass;
