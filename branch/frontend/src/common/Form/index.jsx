import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { MdSend } from "react-icons/md";
import { useForm } from "react-hook-form";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import { submitFormSx, mainColor } from "./styles";

export default function Form({
  FormContent,
  titles,
  subject,
  onSubmit,
  defaultValues,
}) {
  const { handleSubmit, control, reset, watch, getValues } = useForm({
    defaultValues,
  });
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();

  const innerOnSubmit = async (data) => {
    try {
      const isOk = await onSubmit(data);

      if (isOk) {
        showSnackbar(
          `${translation("messages.common.subject_was_created", {
            subject: capitalizeFirstLetter(
              translation(`utilities.variables.${subject.toLowerCase()}`),
            ),
          })}`,
          "success",
        ); // reset(defaultValues); // Reset is not working properly, probably got wrong defaults FIXME
      } else {
        showSnackbar(
          `${translation("messages.common.subject_was_not_created", {
            subject: capitalizeFirstLetter(
              translation(`utilities.variables.${subject.toLowerCase()}`),
            ),
          })}`,
          "error",
        );
        console.error("Backend error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar(translation("messages.common.error_occurred"), "error");
    }
  };

  return (
    <form
      className="order-container"
      onSubmit={handleSubmit(innerOnSubmit)}
      data-test="submit-order"
    >
      <div className="order-header">
        <div className="empty-div" />

        <div className="order-title">
          <Button
            data-test="submit"
            type="submit"
            variant="outlined"
            sx={{
              ...submitFormSx,
              fontSize: 15,
            }}
          >
            {titles.submit}
            <MdSend style={{ color: mainColor }} />
          </Button>
        </div>
        <div className="empty-div" />
      </div>
      <FormContent
        defaultValues={defaultValues}
        control={control}
        reset={reset}
        watch={watch}
        getValues={getValues}
      />
    </form>
  );
}
