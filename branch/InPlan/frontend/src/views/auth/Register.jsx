import React from "react";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";

import logo from "@inplan/assets/images/logo.png";
import { BACKEND_URL } from "@inplan/adapters/apiCalls";

function handleRegister(e) {
  e.preventDefault();
  const { t: translation } = useTranslation();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  if (data.password !== data.verif_password) {
    NotificationManager.error(
      translation("messages.common.passwords_not_match")
    );
  } else {
    delete data.verif_password;
    fetch(`${BACKEND_URL}/api/1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error(translation("messages.common.invalid_credentials"));
        }
        return res.json();
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const Register = () => (
  <div className="grid" style={{ background: "#FFFFFF" }}>
    <div className="auth-page">
      <div className="auth__img">
        <img src={logo} alt="logo" />
      </div>
      <div className="auth-hero">
        Register <br />
        <span>
          or <Link to="/">sign in</Link>
        </span>
      </div>
      <form
        onSubmit={(e) => handleRegister(e)}
        id="email-form"
        name="email-form"
        data-name="Email Form"
        className="auth-form"
      >
        <div className="grid2">
          <div className="form-group-auth">
            <label htmlFor="Email">Email</label>

            <input
              type="email"
              maxLength="256"
              name="email"
              data-name="Email"
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="Username">Username</label>

            <input
              type="text"
              maxLength="256"
              name="username"
              data-name="Username"
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="First_name">First name</label>

            <input
              type="text"
              maxLength="256"
              name="first_name"
              data-name="First_name"
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="Last_name">Last name</label>

            <input
              type="text"
              maxLength="256"
              name="last_name"
              data-name="Last_name"
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="Password">Password</label>

            <input
              type="password"
              maxLength="256"
              name="password"
              data-name="Password"
              required
            />
          </div>

          <div className="form-group-auth">
            <label htmlFor="Verif_password">Confirm password</label>

            <input
              type="password"
              maxLength="256"
              name="verif_password"
              data-name="Verif_password"
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
            Register
          </button>
        </div>
      </form>
    </div>
    <div className="auth-image" />
  </div>
);

export default Register;
