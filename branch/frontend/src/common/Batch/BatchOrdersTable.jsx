import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { NotificationManager } from "react-notifications";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";
import { useBatchContext } from "./BatchContext";

import ItemsTab from "./ItemsTab";
import OrderForBatch from "./OrderForBatch";

// Table to interact with the orders with aligners to be added into batch

export default function BatchOrdersTable({
  subject,
  verb = "Print",
  minBatch = 1,
  maxBatch = 10000,
  tableTitle,
}) {
  const { t: translation } = useTranslation();
  const { cart, setCart, batchViewOrders, createBatch, fetchBatches } =
    useBatchContext();

  const handleClick = async () => {
    if (cart.length >= minBatch && cart.length <= maxBatch) {
      const batch = {
        aligners: cart.map((a) => a.id),
      };
      await createBatch(batch);
      await fetchBatches();
    } else {
      NotificationManager.error(
        `${translation("messages.common.select_batch_between", {
          minBatch,
          maxBatch,
        })} ${translation(`utilities.variables.${subject}`)}`
      );
    }
  };

  if (!batchViewOrders) {
    return <></>;
  }

  // Reinit cart at each order change
  useEffect(() => {
    setCart([]);
  }, [batchViewOrders]);

  return (
    <main className="page-main">
      <div className="page-head">
        <div className="page-head__title">
          <h1 className="h1">{tableTitle}</h1>
        </div>
        <div className="page-head__actions">
          <button
            className={
              cart.length <= maxBatch && cart.length >= minBatch
                ? "btn-secondary rounded"
                : "btn-danger rounded"
            }
            type="button"
            onClick={handleClick}
            data-test="create_batch"
          >
            {translation(`utilities.variables.${verb.toLowerCase()}`)}{" "}
            {cart.length} {translation(`utilities.variables.${subject}`)}
          </button>
        </div>
      </div>
      <div className="page-tab">
        <ItemsTab mode={subject}>
          {batchViewOrders.map((order) => (
            <tr key={order.id}>
              <OrderForBatch
                batchViewOrder={order}
                subject={subject}
                aligners={order.aligners}
              />
            </tr>
          ))}
        </ItemsTab>
      </div>
    </main>
  );
}
