import { backend } from "@inplan/adapters/apiCalls";
import React from "react";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// CONST //

export const orderStatusOptions = {
  0: <CustomTranslation text="utilities.orderStatusOptions.new_order" />,
  1: <CustomTranslation text="utilities.orderStatusOptions.laboratory" />,
  2: <CustomTranslation text="utilities.orderStatusOptions.doctor" />,
  3: <CustomTranslation text="utilities.orderStatusOptions.done" />,
  4: <CustomTranslation text="utilities.orderStatusOptions.canceled" />,
  5: <CustomTranslation text="utilities.orderStatusOptions.in_progress" />,
  6: <CustomTranslation text="utilities.orderStatusOptions.in_printing" />,
  7: <CustomTranslation text="utilities.orderStatusOptions.in_thermofoming" />,
  8: <CustomTranslation text="utilities.orderStatusOptions.in_cutting" />,
  9: (
    <CustomTranslation text="utilities.orderStatusOptions.in_progress_externally" />
  ),
};

// FUNCTIONS //

export const getOrderTypeOptions = (translation) => {
  const mySelection = {
    0: translation("utilities.orderTypeOptions.setup"),
    1: translation("utilities.orderTypeOptions.aligner"),
    2: translation("utilities.orderTypeOptions.check"),
    3: translation("utilities.orderTypeOptions.retainer"),
    4: translation("utilities.orderTypeOptions.import"),
    5: translation("utilities.orderTypeOptions.other"),
  };
  return mySelection;
};

export const getDeliveryOptions = (translation) => {
  const mySelection = {
    0: translation("utilities.deliveryOptions.clinic"),
    1: translation("utilities.deliveryOptions.reception"),
    2: translation("utilities.deliveryOptions.home"),
    3: translation("utilities.deliveryOptions.other"),
  };
  return mySelection;
};

export const getPositionOptions = (translation) => {
  const mySelection = {
    0: translation("utilities.positionOptions.upper"),
    1: translation("utilities.positionOptions.lower"),
  };
  return mySelection;
};

export const getPossibleProcessSteps = (translation) => {
  const mySelection = {
    0: translation("utilities.possibleProcessSteps.incorrect_value"),
    1: translation("utilities.possibleProcessSteps.error"),
    2: translation("utilities.possibleProcessSteps.initialized"),
    3: translation("utilities.possibleProcessSteps.in_upload"),
    4: translation("utilities.possibleProcessSteps.uploaded"),
    5: translation("utilities.possibleProcessSteps.initializing_cutline"),
    6: translation("utilities.possibleProcessSteps.cutline_editing"),
    7: translation("utilities.possibleProcessSteps.base_in_creation"),
    8: translation("utilities.possibleProcessSteps.base_ready"),
    9: translation("utilities.possibleProcessSteps.ordered"),
    10: translation("utilities.possibleProcessSteps.to_be_printed"),
    11: translation("utilities.possibleProcessSteps.in_printing_batch"),
    12: translation("utilities.possibleProcessSteps.to_be_thermoformed"),
    13: translation("utilities.possibleProcessSteps.in_thermoformed_batch"),
    14: translation("utilities.possibleProcessSteps.to_be_cut"),
    15: translation("utilities.possibleProcessSteps.in_cutting_batch"),
    16: translation("utilities.possibleProcessSteps.already_cut"),
    17: translation("utilities.possibleProcessSteps.stored"),
    18: translation("utilities.possibleProcessSteps.delivered"),
    19: translation("utilities.possibleProcessSteps.archived"),
    20: translation("utilities.possibleProcessSteps.other"),
    21: translation("utilities.possibleProcessSteps.canceled"),
  };
  return mySelection;
};

export const getSelectableProcessSteps = (translation) => {
  const mySelection = {
    0: translation("utilities.selectableProcessSteps.no_change"),
    9: translation("utilities.selectableProcessSteps.ordered"),
    10: translation("utilities.selectableProcessSteps.to_be_printed"),
    14: translation("utilities.selectableProcessSteps.to_be_cut"),
    16: translation("utilities.selectableProcessSteps.already_cut"),
    21: translation("utilities.selectableProcessSteps.canceled"),
  };
  return mySelection;
};

export const generateAlignersDesciptions = (
  order,
  setTopContentDesciption,
  setBottomContentDescription,
  translation,
) => {
  if (order) {
    if (order.type === 1) {
      // aligner case

      const hasAlignerTop =
        order.start_aligner_top >= 0 &&
        order.end_aligner_top >= order.start_aligner_top;
      const hasAlignerBottom =
        order.start_aligner_bottom >= 0 &&
        order.end_aligner_bottom >= order.start_aligner_bottom;

      // const topDescription = `Upper aligners ${order.start_aligner_top} to ${order.end_aligner_top}`;
      // const bottomDescription = `Bottom aligners ${order.start_aligner_bottom} to ${order.end_aligner_bottom}`;
      const topDescription = translation("orderedit.header.upper_aligner", {
        start_aligner_top: order.start_aligner_top,
        end_aligner_top: order.end_aligner_top,
      });
      const bottomDescription = translation("orderedit.header.bottom_aligner", {
        start_aligner_bottom: order.start_aligner_bottom,
        end_aligner_bottom: order.end_aligner_bottom,
      });
      const noTop = translation("orderedit.header.no_upper_aligner");
      const noBottom = translation("orderedit.header.no_bottom_aligner");

      if (hasAlignerTop) {
        setTopContentDesciption(topDescription);
      } else {
        setTopContentDesciption(noTop);
      }
      if (hasAlignerBottom) {
        setBottomContentDescription(bottomDescription);
      } else {
        setBottomContentDescription(noBottom);
      }
    } else if (order.type === 3) {
      // Retainer case

      const hasAlignerTop =
        order.start_aligner_top >= 0 && order.multiplicity_top >= 1;
      const hasAlignerBottom =
        order.start_aligner_bottom >= 0 && order.multiplicity_bottom >= 1;

      // const topDescription = `Upper retainer rank ${order.start_aligner_top} with multiplicity ${order.multiplicity_top}`;
      // const bottomDescription = `Lower retainer rank ${order.start_aligner_bottom} with multiplicity ${order.multiplicity_bottom}`;
      const topDescription = translation("orderedit.header.upper_retainer", {
        start_aligner_top: order.start_aligner_top,
        multiplicity_top: order.multiplicity_top,
      });
      const bottomDescription = translation(
        "orderedit.header.bottom_retainer",
        {
          start_aligner_bottom: order.start_aligner_bottom,
          multiplicity_bottom: order.multiplicity_bottom,
        },
      );
      const noTop = translation("orderedit.header.no_upper_retainer");
      const noBottom = translation("orderedit.header.no_bottom_retainer");

      if (hasAlignerTop) {
        setTopContentDesciption(topDescription);
      } else {
        setTopContentDesciption(noTop);
      }
      if (hasAlignerBottom) {
        setBottomContentDescription(bottomDescription);
      } else {
        setBottomContentDescription(noBottom);
      }
    } else {
      setTopContentDesciption(null);
      setBottomContentDescription(null);
    }
  }
};

// could be done with  import { format } from "date-fns";
// Format the date
export const formatDate = (dateFromBackend, translation) => {
  const originalDate = new Date(dateFromBackend);
  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = originalDate.getDate().toString().padStart(2, "0");
  const hours = originalDate.getHours().toString().padStart(2, "0");
  const minutes = originalDate.getMinutes().toString().padStart(2, "0");

  // const formattedDate = `${year}.${month}.${day} at ${hours}:${minutes}`;
  const formattedDate = `${translation("utilities.variables.format_date", {
    year,
    month,
    day,
    hours,
    minutes,
  })}`;
  return formattedDate;
};

export const getInlaseAvailableSheets = async (
  setSheetsList,
  setsheetsDict,
  translation,
) => {
  try {
    const { data: res } = await backend.get("sheets/available");
    const validSheetData = Array.isArray(res) ? res : [];
    const sheetList = [
      {
        id: "0",
        name: capitalizeFirstLetter(
          translation("utilities.variables.undefined"),
        ),
        provider: "Undefined",
        thickness: 0,
      },
    ].concat(validSheetData);
    setSheetsList(sheetList);

    const newsheetsDict = sheetList.reduce((newDict, sheet) => {
      const id = sheet.id ?? "unknown";
      const name = sheet.name ?? "Unnamed";
      const provider = sheet.provider ?? "Unknown";
      const thickness =
        typeof sheet.thickness === "number" ? sheet.thickness : 0;

      return { ...newDict, [id]: { id, name, provider, thickness } };
    }, {});

    setsheetsDict(newsheetsDict);
  } catch (error) {
    console.error("Error fetching available sheets:", error);
    setSheetsList([]);
    setsheetsDict({});
  }
};

export const getAllUsedSheets = async (
  setSheetsList,
  setsheetsDict,
  translation,
) => {
  let usedSheetListIds = [];
  try {
    const { data: resOffices } = await backend.get("offices/current");

    // Check if `resOffices` is valid and extract `used_sheet_list`
    if (resOffices && Array.isArray(resOffices.used_sheet_list)) {
      usedSheetListIds = resOffices.used_sheet_list;
    }
  } catch (error) {
    console.error("Error fetching current office data:", error);
  }

  let usedSheetListDescriptions = [];
  try {
    const { data: allSheets } = await backend.get("sheets");

    // Validate the response and filter sheets based on the usedSheetListIds
    if (allSheets && Array.isArray(allSheets.results)) {
      usedSheetListDescriptions = allSheets.results.filter((sheet) =>
        usedSheetListIds.includes(sheet.id),
      );
    }
  } catch (error) {
    console.error("Error fetching sheets data:", error);
  }

  const sheetList = [
    {
      id: "0",
      name: capitalizeFirstLetter(translation("utilities.variables.undefined")),
      provider: "Undefined",
      thickness: 0,
    },
    ...usedSheetListDescriptions.map((sheet) => ({
      id: sheet.id ?? "unknown",
      name: sheet.name ?? "Unnamed",
      provider: sheet.provider ?? "Unknown",
      thickness: typeof sheet.thickness === "number" ? sheet.thickness : 0,
    })),
  ];

  setSheetsList(sheetList);

  const newsheetsDict = sheetList.reduce((newDict, sheet) => {
    return { ...newDict, [sheet.id]: sheet };
  }, {});

  setsheetsDict(newsheetsDict);
};

export const getSheets = async (setSheetsList, setsheetsDict, translation) => {
  getAllUsedSheets(setSheetsList, setsheetsDict, translation);
};

export const getDoctors = async (
  setDoctorsList,
  setDoctorsDict,
  translation,
) => {
  const { data: res } = await backend.get("doctors/available");
  const doctorList = [
    {
      id: "0",
      appellation: capitalizeFirstLetter(
        translation("utilities.variables.unspecified"),
      ),
    },
  ].concat(res);

  setDoctorsList(doctorList);

  const newDoctorDict = doctorList.reduce((newDict, doctor) => {
    return { ...newDict, [doctor.id]: doctor };
  }, {});

  setDoctorsDict(newDoctorDict);
};

export const sendToOrderLabel = (orderId) => {
  window.open(`/orderlabel/${orderId}`, "_blank");
};

export const sendToBagLabel = (orderId) => {
  window.open(`/labels1/${orderId}`, "_blank");
};

// FIXME duplicated from OrderInProgress
// FIXME add default refresh order to do nothing for making it optional
// Refresh order is the local function to fetch order and update the display

export const cancelOrder = async (order, refreshOrder) => {
  await backend.post(`orders/${order.id}/cancel`);
  await refreshOrder();
};

export const askForCancelOrder = async (order, refreshOrder, translation) => {
  const showSnackbar = useSnackbar();
  const message = translation("messages.orders.cancel_order_confirmation");
  if (order.status === 3) {
    showSnackbar(
      translation("messages.orders.finished_order_cannot_be_canceled"),
      "warning",
    );
  } else if (order.status === 4) {
    showSnackbar(
      translation("messages.orders.order_already_canceled"),
      "warning",
    );
  } else {
    const confirmed = window.confirm(message);
    if (confirmed) {
      await cancelOrder(order, refreshOrder);
      showSnackbar(
        translation("messages.orders.canceling_the_order"),
        "success",
      );
    }
  }
};

export const printOrder = async (order, refreshOrder, translation) => {
  const showSnackbar = useSnackbar();
  try {
    const { id, aligners, type } = order;
    if (aligners.length > 0) {
      await backend.post(`orders/${id}/send_to_print`);
    }
    refreshOrder();
    if (type === 0) {
      // if Order type is SETUP
      showSnackbar(
        translation("messages.orders.order_started", { type: "Setup" }),
        "success",
      );
    } else if (type === 5) {
      // if Order type is OTHER
      showSnackbar(
        translation("messages.orders.order_started", {
          type: translation("utilities.orderTypeOptions.other"),
        }),
        "success",
      );
    } else {
      showSnackbar(
        translation("messages.orders.models_available_in_models_tabs"),
        "success",
      );
    }
  } catch (error) {
    showSnackbar(translation("messages.orders.error_updating_order"), "error");
    console.error("Error updating order:", error);
  }
};

export const askForPrintOrder = async (order, refreshOrder, translation) => {
  const showSnackbar = useSnackbar();
  const confirmMessage = translation(
    "messages.orders.reset_the_status_of_all_aligners_confirmation",
  );
  if (order.status === 3 || order.status === 4) {
    showSnackbar(
      translation("messages.orders.finished_or_canceled_order_cannot_be_reset"),
      "warning",
    );
  } else if (order.is_started) {
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      await printOrder(order, refreshOrder, translation);
    }
  } else {
    await printOrder(order, refreshOrder, translation);
  }
};

// Signal to the aligners that their order is terminated
// to update their status and batch
const terminateAligner = (alignerId) => {
  return backend.post(`ordered_aligners/${alignerId}/validate`);
};

export const terminateOrder = async (order, refreshOrder, translation) => {
  const showSnackbar = useSnackbar();
  try {
    await backend.post(`orders/${order.id}/terminate`);
    refreshOrder();
    showSnackbar(translation("messages.orders.order_terminated"), "success");
  } catch (error) {
    showSnackbar(translation("messages.text55"), "error");

    console.error("Error updating order:", error);
  }
};

export const askForTerminateOrder = async (
  order,
  refreshOrder,
  translation,
) => {
  const showSnackbar = useSnackbar();
  const confirmMessage = translation(
    "messages.orders.mark_order_as_terminated_confirmation",
  );
  if (order.status === 3 || order.status === 4) {
    showSnackbar(
      translation("messages.orders.order_already_finished_or_canceled"),
      "warning",
    );
  } else if (order.is_started) {
    const confirmed = window.confirm(confirmMessage);
    if (confirmed) {
      await terminateOrder(order, refreshOrder, translation);
    }
  } else {
    await terminateOrder(order, refreshOrder, translation);
  }
};

export function createFormData(formDataObject) {
  const sentData = new FormData();

  // Iterate over the key-value pairs in formDataObject and append them to sentData
  Object.entries(formDataObject).forEach(([key, value]) => {
    // If the value is an array, append each element separately
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        sentData.append(`${key}[${index}]`, item);
      });
    } else {
      sentData.append(key, value);
    }
  });

  return sentData;
}
