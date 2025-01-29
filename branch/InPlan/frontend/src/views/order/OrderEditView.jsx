import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "@inplan/AppContext";
import OrderEditor from "./OrderEditor";

// This view is separated from the order editor
// It is planned to have the order editor as a modal whenever possible

export default function OrderEditView() {
  const { orderId } = useParams();
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  return (
    <div className="page">
      <div className="page-light">
        <div className="page-profil">
          <OrderEditor orderId={orderId} />
        </div>
      </div>
    </div>
  );
}
