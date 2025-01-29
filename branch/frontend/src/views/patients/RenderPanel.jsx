import React, { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@mui/styles"; // deprecated
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import NoteModal from "@inplan/common/NoteModal";
import { useAppContext } from "@inplan/AppContext";

export default function RenderPanel({ rowData }) {
  const { notes: listPatientNotes, patient } = rowData;
  const { t: translation } = useTranslation();
  const [notes, setNotes] = useState(listPatientNotes);

  const { updateModale } = useAppContext();

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      height: "30ch",
      overflowY: "scroll",
      overflowWrap: "break-word",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
  }));

  const classes = useStyles();

  const body = (
    <>
      {typeof notes[0] !== "undefined" ? (
        <List className={classes.root}>
          {notes.map((note) => (
            <div key={note.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  data-test="notes"
                  primary={note.author_name}
                  secondary={
                    <fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {`${note.created_at.split("T")[0]} à ${
                          note.created_at.split("T")[1].split(":")[0]
                        }:${note.created_at.split("T")[1].split(":")[1]}`}
                      </Typography>
                      {` — `}
                      {note.content &&
                        note.content.split("\n").map((para) => (
                          <span key={`${note.id}-${para.slice(0, 10)}`}>
                            {para}
                            <br />
                          </span>
                        ))}
                    </fragment>
                  }
                />
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </div>
          ))}
        </List>
      ) : (
        <div
          style={{
            textAlign: "center",
            fontSize: "1.5em",
            opacity: "0.6",
          }}
        >
          <h2>{translation("patients.table.no_notes")}</h2>
        </div>
      )}
    </>
  );

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px 1fr",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => updateModale("note")}
            data-test="add_note"
          >
            <BsPlusCircle size={32} />
          </button>
        </div>
        <div>{body}</div>
      </div>
      <NoteModal
        patientId={patient.id}
        updateNotes={setNotes}
        notes={notes}
        currentPeriod={patient.activeStep}
      />
    </>
  );
}
