import React from "react";

import { BsPlusCircle } from "react-icons/bs";

import CardPeriod from "./CardPeriod";
import { useDashboardContext } from "./Context";

export default function DashboardPeriods() {
  const { setModal, periods, currentPeriod, setCurrentPeriod } =
    useDashboardContext();

  return (
    // <div className="">
    <div className="flex overflow-auto">
      {periods
        .sort((pA, pB) => new Date(pA.start_date) - new Date(pB.start_date))
        .map((p) => (
          <CardPeriod
            key={p.id}
            period={p}
            currentPeriod={currentPeriod}
            onDelete={setModal}
            onClick={setCurrentPeriod}
          />
        ))}
    </div>
    // </div>
  );
}
