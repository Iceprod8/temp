import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@inplan/AppContext";
import { backend } from "@inplan/adapters/apiCalls";
import { useOrders } from "@inplan/common/collections";
import getDetailedOrder from "@inplan/common/GetDetailedOrder";

import { OrderLabel } from "./PrintLabel";

function goPrint() {
  window.print();
}

// FIXME factorize with PrintBag
const getLabelDescription = async () => {
  const undefinedSetting = {
    id: "0",
  };
  const response = await backend.get(`offices/get_label_description`);
  if (response.status === 200) {
    return response.data;
  }
  console.error("Error fetching backend get");
  return { undefinedSetting };
};

export default function OrderLabelView() {
  const { idOrder } = useParams();
  const { t: translation } = useTranslation();

  const { fetchItem: fetchOrder } = useOrders({
    fetchItem: { view_type: "printer" },
  });

  const [order, setOrder] = useState(null);
  const [labelDescription, setLabelDescription] = useState({});
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  useEffect(() => {
    async function fetchOrderLabel() {
      if (!idOrder) return;

      const order1 = await fetchOrder(idOrder);
      if (!order1) return;

      const order2 = await getDetailedOrder(order1, translation);
      setOrder(order2);

      const labelDescriptionFetched = await getLabelDescription();
      setLabelDescription(labelDescriptionFetched);

      goPrint();
    }
    fetchOrderLabel();
  }, [idOrder]);

  return (
    <>
      <div className="label-print-action">
        <button
          className="btn-primary notinprint"
          type="button"
          onClick={() => {
            window.print();
          }}
        >
          {translation("laboratory.print.title")}
        </button>
      </div>
      <div>
        <div className="printer-labels">
          {order && (
            <OrderLabel order={order} labelDescription={labelDescription} />
          )}
        </div>
      </div>
    </>
  );
}
