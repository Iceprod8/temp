import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { HiMinus, HiPlus } from "react-icons/hi";
import { BsCart4 } from "react-icons/bs";
import { useAppContext } from "@inplan/AppContext";
import { useBatchContext } from "@inplan/common/Batch/BatchContext";
import { backend } from "@inplan/adapters/apiCalls";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";

// One line in the space to prepare batch from orders
// Describe the order, the remaining aligners to be batched, the aligners about to be added to a batch
// Contains the commands to add to the next batch

export default function OrderForBatch({
  subject,
  batchViewOrder,
  aligners,
  maxInBatch = 1000,
}) {
  const { t: translation } = useTranslation();
  const showSnackbar = useSnackbar();
  const { userData, userRights } = useAppContext();
  const { cart, setCart, fetchBatches } = useBatchContext();
  const [localCart, setLocalCart] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(batchViewOrder.aligners);
    setLocalCart([]);
  }, [aligners]);

  if (filteredItems.length === 0) {
    return null;
  }

  const remain = filteredItems.length - localCart.length;

  // TODO rename models -> aligners
  const delModels = (ms) => {
    setLocalCart(localCart.filter((m) => !ms.includes(m)));
    setCart(cart.filter((m) => !ms.includes(m)));
  };

  const addModels = (ms) => {
    delModels(ms);
    setLocalCart([...localCart, ...ms]);
    setCart([...cart, ...ms]);
  };

  const isCutting = subject === "aligners";

  const hasInlase = userRights?.inlase && userData?.office?.has_inlase > 0;

  const displayAllInTray = hasInlase && isCutting;

  const handleAllInTraysClick = async () => {
    const listOfIds = aligners.map((aligner) => aligner.id);
    const { data: res } = await backend.post(
      "cutter_batches/create_all_trays",
      listOfIds,
    );
    if (res?.message) {
      showSnackbar(
        translation(`messages.cutlines.${res?.message}`, {
          remainder: `${res?.remainder}`,
        }),
        "error",
      );
    }
    fetchBatches();
  };

  return (
    <>
      <td>
        <div className="td-alignItems">
          <span style={{ marginLeft: "24px" }}>
            {batchViewOrder.description}
          </span>
        </div>
      </td>
      <td>
        <Link to={`orderedit/${batchViewOrder.id}`}>
          <BsCart4 style={{ cursor: "pointer", fontSize: 40, padding: 6 }} />
        </Link>
      </td>
      <td>{filteredItems.length}</td>
      <td>
        <div className="table__actions">
          {displayAllInTray && (
            <button
              className={clsx("btn-table-secondary")}
              type="button"
              data-test="print_patient"
              onClick={handleAllInTraysClick}
            >
              {/* All in InLase trays */}
              {translation(
                "3d_printing.table_pending_models.columns.actions.buttons.allInTray",
              )}
            </button>
          )}
          <button
            className={clsx("btn-table-secondary")}
            type="button"
            data-test="print_patient"
            onClick={() => {
              const ms = filteredItems.filter((m) => !cart.includes(m));
              addModels(ms);
            }}
          >
            {/* {`Add the ${filteredItems.length} ${subject}`} */}
            {translation(
              "3d_printing.table_pending_models.columns.actions.buttons.add_models",
              {
                filteredItemsLength: filteredItems.length,
                subject: translation(`utilities.variables.${subject}`),
              },
            )}
          </button>
          <button
            className={clsx(
              localCart.length > 0 ? "btn-table-primary" : "btn-table-muted",
            )}
            type="button"
            onClick={() => {
              if (localCart.length > 0) {
                const m = localCart[localCart.length - 1];
                delModels([m]);
              }
            }}
          >
            <HiMinus name="minus" style={{ width: "16px", height: "16px" }} />
          </button>
          <button
            className={clsx(
              remain > 0 ? "btn-table-primary" : "btn-table-muted",
            )}
            type="button"
            onClick={() => {
              if (remain) {
                const m = filteredItems[localCart.length];
                addModels([m]);
              }
            }}
          >
            <HiPlus style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </td>
      <td>{localCart.length}</td>
    </>
  );
}
