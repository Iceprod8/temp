import React from "react";
import { useTranslation } from "react-i18next";

import logo from "@inplan/assets/images/logo.png";
import { BACKEND_URL } from "@inplan/adapters/apiCalls";

class ForgotPass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
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

  handleForgot = (e) => {
    const { t: translation } = useTranslation();
    e.preventDefault();
    const { email } = this.state;
    const json = JSON.stringify({ email });

    // not sure what to do with that one
    fetch(`${BACKEND_URL}/password_reset/`, {
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
    const { email } = this.state;

    return (
      <div className="grid" style={{ background: "#FFFFFF" }}>
        <div className="auth-page">
          <div className="auth__img">
            <img src={logo} alt="logo" />
          </div>
          <div className="auth-hero">
            Forgot your password ? <br />
          </div>
          <form
            onSubmit={(e) => this.handleForgot(e)}
            id="email-form"
            name="email-form"
            data-name="Email Form"
            className="auth-form"
          >
            <div className="grid">
              <div className="form-group-auth">
                <label htmlFor="Email">Email</label>

                <input
                  value={email}
                  type="email"
                  maxLength="256"
                  name="email"
                  data-name="Email"
                  onChange={this.handleChange}
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
                Follow instructions
              </button>
            </div>
          </form>
        </div>
        <div className="auth-image" />
      </div>
    );
  }
}

export default ForgotPass;
