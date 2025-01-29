import React from "react";
import { CircularProgress } from "@mui/material";
import { HiShare } from "react-icons/hi";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";

// Used to display the status of the cutline during cutline creation / edition / validation
function CardModelBodyLine({ model }) {
  return model.is_cutline_on_process ? (
    <div className="badge-little-waiting flex alignItems-center">
      <CircularProgress />
      <CustomTranslation text="dashboard.cutlines.card_model.line_preparation" />
    </div>
  ) : !model.active_cutline ? (
    <div className="badge-little-waiting">
      <CustomTranslation text="dashboard.cutlines.card_model.no_line" />
    </div>
  ) : model.base && model.is_validated ? (
    <></>
  ) : model.is_validated ? (
    <div className="badge-little-success" data-test="badge-ok">
      <CustomTranslation text="dashboard.cutlines.card_model.line_validated" />
    </div>
  ) : !model.is_validated ? (
    <div className="badge-little-waiting">
      <CustomTranslation text="dashboard.cutlines.card_model.line_edition" />
    </div>
  ) : null;
}

// Used to display the status of the base during cutline creation / edition / validation
function CardModelBodyModel({ model }) {
  return model.base_error ? (
    <div className="infoPopAligner badge-little-error flex alignItems-center">
      <CustomTranslation text="dashboard.cutlines.card_model.base_error" />
    </div>
  ) : // FIXME DEBUG FOR WARNING
  model.base && model.is_validated && model.has_collisions ? (
    <>
      <div className="infoPopAligner badge-little-notice" data-test="badge-ok">
        <CustomTranslation text="dashboard.cutlines.card_model.ready_with_errors" />
      </div>
      <div className="infoPopAligner badge-little-success" data-test="badge-ok">
        <CustomTranslation text="dashboard.cutlines.card_model.ready_for_printing" />
      </div>
    </>
  ) : model.base && model.is_validated ? (
    <>
      <div className="infoPopAligner badge-little-success" data-test="badge-ok">
        <CustomTranslation text="dashboard.cutlines.card_model.ready_for_printing" />
      </div>
    </>
  ) : model.is_base_on_process ? (
    <div className="infoPopAligner badge-little-waiting flex alignItems-center">
      <CircularProgress />
      <CustomTranslation text="dashboard.cutlines.card_model.base_preparation" />
    </div>
  ) : model.base ? (
    <div className="infoPopAligner badge-little-success">
      <CustomTranslation text="dashboard.cutlines.card_model.existing_base" />
    </div>
  ) : (
    <div className="infoPopAligner badge-little-waiting">
      <CustomTranslation text="dashboard.cutlines.card_model.no_base" />
    </div>
  );
}

// used to display linea and base status during cutline creation / edition / verification
// Not used to edit the model
export function CardModelBodyEdit({ model }) {
  return (
    <>
      <CardModelBodyLine model={model} />
      <CardModelBodyModel model={model} />
    </>
  );
}

export function CardModelBodyExport({ model }) {
  return (
    <>
      {model.base ? (
        <HiShare name="export" className="icon icon-export" size={16} />
      ) : (
        <div className="badge-little-waiting">
          <CustomTranslation text="dashboard.cutlines.card_model.no_base" />
        </div>
      )}
      <a className="card-link" href={model.base}>
        &nbsp;
      </a>
    </>
  );
}

export function CardBodyProgressAndEdit({ model, setModal, setCurrentModel }) {
  return (
    <>
      <div>
        <CardModelBodyEdit model={model} />
      </div>
    </>
  );
}
