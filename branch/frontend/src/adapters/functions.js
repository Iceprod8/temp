import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// Utils

/* From dict to formdata */
export function dict2formdata(object) {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

// Dashboard
export function getGeneratedModels(type, models) {
  if (type === "originals") {
    // Find original models
    return (models || []).filter((m) => m.is_original);
  }

  if (type === "templates") {
    // Find template models
    return (models || []).filter((m) => m.is_template);
  }

  if (type === "remaining") {
    return (models || []).filter((m) => !m.is_original && !m.is_template);
  }

  if (type === "all") {
    // all = all used, means no original
    return (models || []).filter((m) => !m.is_original);
  }

  return [];
}

export function formattedFilename(filename) {
  if (filename.length < 16) {
    return filename;
  }
  return filename.slice(0, 16);
}

export function getSignature(filename) {
  // Const CLUE_MAXI = /maxi|upper|supérieur/gm;
  const clueMandi = /mandi|lower|inferieur/gm;

  const norm = filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const type = clueMandi.exec(norm) ? 1 : 0;

  const extractor = /\d+/gm;

  const sign = [...norm.matchAll(extractor)]
    .map((m) => m[0].padStart(8, 0))
    .join("");

  return [type, sign];
}

// Pagination
export function pagination(currentPage, pageCount) {
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  let result = [];

  result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(
    (i) => i && i >= left && i < right,
  );

  if (result.length > 1) {
    // Add first page and dots
    if (result[0] > 1) {
      if (result[0] > 2) {
        result.unshift(0);
      }
      result.unshift(1);
    }

    // Add dots and last page
    if (result[result.length - 1] < pageCount) {
      if (result[result.length - 1] !== pageCount - 1) {
        result.push(0);
      }
      result.push(pageCount);
    }
  }

  return result;
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Batch
// FIXME placeholder
export function createBatchName(selectedBatch, subject, translation) {
  if (selectedBatch === null) return translation("messages.common.error_batch");

  const date =
    selectedBatch && selectedBatch.creation ? selectedBatch.creation : "";

  const size =
    selectedBatch && selectedBatch.aligners ? selectedBatch.aligners.length : 0;

  const batchMainName =
    selectedBatch && selectedBatch.name
      ? selectedBatch.name
      : `${capitalizeFirstLetter(
          translation("utilities.variables.batch"),
        )} ${translation(`utilities.variables.${subject}`)} ${date}`;

  // const batchName = `${batchMainName} [${size} aligners]`;
  const batchName = `${batchMainName} [${size} ${translation(
    "utilities.variables.aligners",
  )}]`;

  return batchName;
}

// Patients
export function onGoingC(patients) {
  const date = new Date();
  const today = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  );
  return patients.reduce(
    (acc, p) =>
      acc +
      (p.archived
        ? 0
        : p.active_step
          ? new Date(p.active_step.end_date) > today
            ? 1
            : 0
          : 0),
    0,
  );
}

export function partialC(patients) {
  return patients.reduce(
    (acc, p) => acc + (p.archived ? 0 : !p.active_step ? 1 : 0),
    0,
  );
}

export function toprintC(patients) {
  let toPrint = 0;
  patients.forEach((p) => {
    if (p.models) {
      toPrint += p.models.validated - p.models.printed;
    }
  });
  return toPrint;
}

export function tocutC(patients) {
  let toCut = 0;
  patients.forEach((p) => {
    if (p.models) {
      toCut += p.models.printed - p.models.cut - p.models.archived;
    }
  });
  return toCut;
}

export function terminatedC(patients) {
  const date = new Date();
  const today = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  );
  return patients.reduce(
    (acc, p) =>
      acc +
      (!p.archived
        ? p.active_step
          ? new Date(p.active_step.end_date) < today
            ? 1
            : 0
          : 0
        : 0),
    0,
  );
}

export function weekDiff(date1, date2) {
  const d1 = new Date(date1.concat(" 00:00:00"));
  const d2 = new Date(date2.concat(" 00:00:00"));

  const newD1 = d1.getTime() / 86400000;
  const newD2 = d2.getTime() / 86400000;
  const days = Number(newD2 - newD1).toFixed(0);
  return Math.round(days / 7);
}

export function toISODateString(date) {
  return date.toISOString().slice(0, 10);
}

export function toReadableDateString(date) {
  return date?.toLocaleDateString();
}

export function toReadableDatetimeString(date) {
  return date?.toLocaleString();
}

export function daysFromDuration(str) {
  return parseInt(str.split(" ")[0], 10);
}

export const formatDelay = (input, ref, translation) => {
  const hourTime = `${input.getUTCHours()}:${input.getMinutes()}`;

  const date = input.getTime();
  const now = ref.getTime();
  const difMs = now - date;
  const difS = (difMs / 1000).toFixed(0);
  const difMin = (difS / 60).toFixed(0);
  const difHours = (difMin / 60).toFixed(0);
  const difDays = (difHours / 24).toFixed(0);

  let d;
  if (difMs < 1000) {
    d = translation("utilities.time_delay.milliseconds", { nbr: difMs });
  } else if (difS < 60) {
    d = translation("utilities.time_delay.seconds", { nbr: difS });
  } else if (difMin < 60) {
    d = translation("utilities.time_delay.minutes", { nbr: difMin });
  } else if (difHours < 24) {
    d = translation("utilities.time_delay.hours", { nbr: difHours });
  } else if (difDays < 30) {
    d = translation("utilities.time_delay.days", { nbr: difDays });
  }
  return d;
};

// Control cuntline

export function validateAllCutline(
  modelsList,
  updateModel,
  applySmooth,
  translation,
) {
  const showSnackbar = useSnackbar();
  const validatedModelsListPromise = modelsList.map((model) =>
    updateModel(model.id, { is_validated: true, apply_smooth: applySmooth }),
  );

  Promise.all(validatedModelsListPromise)
    .then((modelsListUpload) => {
      const modelsTovalidate = modelsListUpload.filter(
        (model) => model === undefined,
      ).length;
      const validatedModel = modelsListUpload.length - modelsTovalidate;

      if (validatedModel > 0) {
        showSnackbar(
          `${translation("messages.cutlines.validated_models", {
            value1: validatedModel,
            value2: modelsListUpload.length,
          })}`,
          "success",
        );
      }

      if (modelsTovalidate > 0) {
        const error = new Error(
          `${translation("messages.cutlines.error_during_validation", {
            nbr: modelsTovalidate,
          })}`,
        );
        throw error;
      }
    })
    .catch((e) => {
      showSnackbar(e.message, "error");
    });
}
