import React from "react";
import { useTranslation } from "react-i18next";
import { CgTrash } from "react-icons/cg";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import Modal from "@inplan/common/Modal";
import { useInlineContext } from "@inplan/contexts/InlineContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

export default function ModelEditModal() {
  const {
    setState,
    currentModel,
    deleteModel,
    models,
    fetchPatientModels,
    resetInitPoints,
  } = useInlineContext();
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const askDeletion = async () => {
    const isConfirmed = window.confirm(
      translation("messages.cutlines.delete_model_confirmation"),
    );

    if (isConfirmed) {
      const toDeleteModel = currentModel;
      setState((prev) => ({
        ...prev,
        currentModel: null,
      }));
      await deleteModel(toDeleteModel);
      const updatedModels = models.filter((p) => p.id !== toDeleteModel.id);
      setState((prev) => ({
        ...prev,
        models: updatedModels,
        modal: "",
      }));
      resetInitPoints();
      fetchPatientModels();
      showSnackbar(translation("messages.cutlines.model_removed"), "success");
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
        setState((prev) => ({
          ...prev,
          modal: page,
        }));
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
