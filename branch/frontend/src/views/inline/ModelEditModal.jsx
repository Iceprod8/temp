import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";
import { CgTrash } from "react-icons/cg";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import Modal from "@inplan/common/Modal";
import EditModalFooter from "./EditModalFooter";
import { useInlineContext } from "./InlineContext";

export default function ModelEditModal() {
  const {
    setModal,
    setCurrentModel,
    currentModel,
    deleteModel,
    models,
    setModels,
    updateModel,
    fetchPatientModels,
    resetInitPoints,
  } = useInlineContext();
  const { t: translation } = useTranslation();
  const [targetStep, setTargetStep] = useState("");

  const confirm = async () => {
    if (currentModel) {
      await updateModel(currentModel.id, { step: targetStep });
    }
    fetchPatientModels();
  };

  const askDeletion = async () => {
    const isConfirmed = window.confirm(
      translation("messages.cutlines.delete_model_confirmation")
    );

    if (isConfirmed) {
      const toDeleteModel = currentModel;
      setCurrentModel(null);
      await deleteModel(toDeleteModel);
      const updatedModels = models.filter((p) => p.id !== toDeleteModel.id);
      setModels(updatedModels);
      resetInitPoints();
      fetchPatientModels();
      setModal("");
      NotificationManager.success(
        translation("messages.cutlines.model_removed")
      );
    }
  };

  return (
    <Modal
      title={
        currentModel ? (
          <div className="flex">
            <CustomTranslation text="dashboard.cutlines.form.fields.title" />{" "}
            {currentModel.filename}
          </div>
        ) : (
          <CustomTranslation text="dashboard.cutlines.form.fields.title" />
        )
      }
      onClose={(page) => {
        setModal(page);
      }}
    >
      <div className="grid">
        <div className="grid">
          <div
            className="modal-batch__delete_cutlines"
            style={{ padding: 0 }}
            onClick={askDeletion}
          >
            <CustomTranslation text="dashboard.cutlines.form.fields.delete_message" />
            <CgTrash
              name="delete"
              className="icon icon-delete"
              size={25}
              style={{
                backgroundColor: "red",
                width: "25px",
                height: "25px",
                fill: "currentColor",
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
