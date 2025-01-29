import React from "react";
import { CgProfile } from "react-icons/cg";
import { HiCamera } from "react-icons/hi";

import { useAppContext } from "@inplan/AppContext";

import Modal from "./Modal";

// This menu is used to manage the information of one practioner
// This menu is not used anymore
// There is no plan to use it again shortly, so it has not been translated

export default function PractionnerModal({ setModal }) {
  const { username, onConnect, userData } = useAppContext();

  if (!onConnect) {
    return null;
  }

  const handleSubmit = () => {};

  return (
    <Modal title="Mon profil" onClose={setModal}>
      <form className="form" onSubmit={handleSubmit}>
        <div className="modal-content__patient">
          <div className="grid">
            <CgProfile
              name="pp"
              size={130}
              style={{
                color: "#DADDE2",
                borderRadius: "5em",
              }}
            />
            <HiCamera
              name="camera"
              className="icon icon-camera"
              size={32}
              style={{
                color: "white",
                backgroundColor: "#2061D1",
                padding: "3px",
                borderRadius: "5em",
                position: "absolute",
                left: "110px",
                top: "88px",
              }}
            />{" "}
            <div className="form-group">
              <label htmlFor="last_name">Nom d&apos;utilisateur</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder={username}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder={userData.email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="first_name">Prénom</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                placeholder={userData.first_name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Nom de famille</label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                placeholder={userData.last_name}
              />
            </div>
            <hr style={{ marginTop: "8px" }} />
            <div className="form-group">
              <label htmlFor="phone_number">Téléphone portable</label>
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                placeholder={userData.phone_number}
              />
            </div>
            <div className="grid2">
              <button
                className="btn-modal-muted"
                type="button"
                onClick={() => setModal("")}
              >
                Annuler
              </button>
              <button
                className="btn-modal-secondary"
                type="button"
                onClick={() => setModal("")}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
