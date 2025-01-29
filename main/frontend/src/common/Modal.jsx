import React from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal">
      <div className="modal-wrapper" onClick={() => onClose("")} />
      <div className="modal-body">
        <div className="modal-close">
          <IoClose
            name="rounded-close"
            size={24}
            style={{
              backgroundColor: "#282C33",
              borderRadius: "3em",
              padding: "2px",
            }}
            className="icon icon-close"
            onClick={() => onClose("")}
          />
        </div>
        <div className="modal-head">
          <div className="modal-head__title">{title}</div>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
