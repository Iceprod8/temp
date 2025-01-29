import React from "react";
import { TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { useAppContext } from "@inplan/AppContext";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import Modal from "./Modal";

/* TODO: would be moved to dashboard directory */

export default function NoteModal({ patientId, updateNotes, notes }) {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const { modal, updateModale, selectedNote, updateSelectedNote } =
    useAppContext();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      if (modal === "note") {
        const result = await backend.post("patient_notes", {
          content: selectedNote.body,
          patient: patientId,
        });

        if (result.status === 201) {
          if (updateNotes) {
            const newArray = [result?.data, ...notes];
            updateNotes(newArray);
          }
          showSnackbar(translation("messages.common.note_added"), "success");
        }
      } else if (modal === "note-update") {
        const noteId = selectedNote.id;
        await backend.patch(`patient_notes/${noteId}`, {
          content: selectedNote.body,
        });
        showSnackbar(translation("messages.common.note_updated"), "success");
      }
      updateModale("");
    } catch (err) {
      console.error(err);
      showSnackbar(translation("messages.common.error_occurred"), "error");
    }
    updateSelectedNote("");
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateSelectedNote({ ...selectedNote, [name]: value });
  };

  const closeModal = () => {
    updateModale("");
    updateSelectedNote("");
  };

  return (
    <Modal title="Note" onClose={closeModal}>
      <form noValidate autoComplete="off" onSubmit={onSubmit}>
        <TextField
          id="outlined-multiline-flexible"
          label={translation("patients.table.note_form.fields.description")}
          multiline
          rows={15}
          name="body"
          onChange={handleChange}
          variant="outlined"
          value={selectedNote.body}
          data-test="note_body"
          fullWidth
          style={{ margin: "20px 0px" }}
          inputProps={{ sx: { cursor: "pointer" } }}
        />
        <div className="grid2">
          <Button
            className="btn-modal-muted"
            onClick={closeModal}
            variant="contained"
          >
            {translation("patients.table.note_form.buttons.cancel")}
          </Button>
          <Button
            className="btn-modal-secondary"
            type="submit"
            variant="contained"
            data-test="note_confirm"
          >
            {translation("patients.table.note_form.buttons.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
