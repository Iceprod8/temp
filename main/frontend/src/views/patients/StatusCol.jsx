import React from "react";
import { HiOutlineFolderRemove } from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";

const styles = {
  icons: {
    width: "40px",
    height: "40px",
    borderRadius: "30px",
  },
  validated: {
    color: "#13C095",
    padding: "7px",
    backgroundColor: "#E9FDF8",
  },
  folder: {
    color: "#FF9100",
    padding: "5px",
    backgroundColor: "#FFF3E0",
  },
};

export default function StatusCol({ status }) {
  return (
    <span>
      {status ? (
        <FiCheckCircle
          name="validated"
          style={{ ...styles.icons, ...styles.validated }}
        />
      ) : (
        <HiOutlineFolderRemove
          name="folder"
          style={{ ...styles.icons, ...styles.folder }}
        />
      )}
    </span>
  );
}
