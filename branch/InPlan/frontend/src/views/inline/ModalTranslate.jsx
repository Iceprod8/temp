import React from "react";
import { IoIosArrowDropright } from "react-icons/io";

export default function DashboardModalTranslate({ onClick, setAnimate }) {
  return (
    <div
      className="dashboard-body__translate"
      onClick={() => {
        const timer = setTimeout(() => {
          setAnimate(true);
        }, 300);
        onClick(false);

        return () => {
          clearTimeout(timer);
        };
      }}
    >
      <div className="dashboard-control">
        <div className="dashboard-control__head">
          <IoIosArrowDropright name="double-right-arrow" size={30} />
        </div>
      </div>
    </div>
  );
}
