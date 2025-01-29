import { backend } from "@inplan/adapters/apiCalls";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";

// This function is used to complete the order object before printing, gathering all needed data for display.
// It should not be needed if specific fetch views are well set in backend.
// TODO - remove duplicates with PrintLabel.jsx and orderColumns.js

// Fixme, common function but synch
export const getSheetDict = async (translation) => {
  const { data: res } = await backend.get("sheets/available");
  const sheetList = [
    {
      id: "0",
      name: capitalizeFirstLetter(translation("utilities.variables.undefined")),
      provider: "Undefined",
      thickness: 0,
    },
  ].concat(res);

  const newSheetDict = sheetList.reduce((newDict, sheet) => {
    return { ...newDict, [sheet.id]: sheet };
  }, {});
  return newSheetDict;
};

// Fixme, common function but synch
export const getDoctorDict = async () => {
  const { data: res } = await backend.get("doctors/available");
  const doctorList = [
    {
      id: "0",
      appellation: "Unspecified",
    },
  ].concat(res);

  const newDoctorDict = doctorList.reduce((newDict, doctor) => {
    return { ...newDict, [doctor.id]: doctor };
  }, {});

  return newDoctorDict;
};

export const getLastNote = (order) => {
  let currentNote = "";
  if (order && order.notes) {
    const lastNote = order.notes
      .map((x) => x.body)
      .sort((a, b) => {
        const updateA = order.notes.find((note) => note.body === a).update;
        const updateB = order.notes.find((note) => note.body === b).update;
        return new Date(updateA) - new Date(updateB);
      })
      .slice(-1)[0];
    currentNote = lastNote;
  }
  return currentNote;
};

export const getOfficeName = async () => {
  const { data: res } = await backend.get("offices/current");
  return res.name;
};

const completeOrder = (
  orderInput,
  sheetDict,
  doctorDict,
  officeName,
  lastNote
) => {
  // If sheets or doctors are not updated, wait
  const newOrder = orderInput;

  // Update sheet
  if (
    newOrder.sheet &&
    newOrder.sheet !== null &&
    newOrder.sheet in sheetDict
  ) {
    newOrder.sheetDesc = sheetDict[newOrder.sheet];
  } else {
    newOrder.sheetDesc = sheetDict["0"];
  }

  // update doctor
  if (
    newOrder.doctor &&
    newOrder.doctor !== null &&
    newOrder.doctor !== 0 &&
    newOrder.doctor in doctorDict
  ) {
    newOrder.doctor_name = doctorDict[newOrder.doctor].appellation;
  } else {
    newOrder.doctor_name = doctorDict["0"].appellation;
  }

  // update office
  if (officeName && officeName !== null) {
    newOrder.office_name = officeName;
  } else {
    newOrder.office_name = "";
  }

  // Update note
  if (lastNote && lastNote !== null) {
    newOrder.last_note = lastNote;
  } else {
    newOrder.last_note = "";
  }

  return newOrder;
};

export default async function getDetailedOrder(order, translation) {
  const sheetDict = await getSheetDict(translation);
  const doctorDict = await getDoctorDict();
  const officeName = await getOfficeName();
  const lastNote = getLastNote(order);
  const detailedOrder = completeOrder(
    order,
    sheetDict,
    doctorDict,
    officeName,
    lastNote
  );

  detailedOrder.hasAlignerTop =
    order.start_aligner_top >= 0 &&
    order.end_aligner_top >= order.start_aligner_top;

  detailedOrder.hasAlignerBottom =
    order.start_aligner_bottom >= 0 &&
    order.end_aligner_bottom >= order.start_aligner_bottom;

  return detailedOrder;
}
