import React from "react";
import { IoIosArrowDropleft, IoIosCube } from "react-icons/io";
import { BsImage, BsInfo } from "react-icons/bs";
import { RiFlag2Fill } from "react-icons/ri";
import { HiShare } from "react-icons/hi";
import { FaTeethOpen } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import DashboardControlCutlines from "./ControlCutlines";

// This element is used for the list and control
// of the list of models / aligners etc with a vizualizer
// The left side of the screen is used by this, hideable
// The right side is used by the vizualiser

export default function ModalBody({
  title,
  iconName,
  onClose,
  setAnimate,
  setmeshOpacity,
  meshOpacity,
}) {
  const icon = {
    model: <IoIosCube size={20} />,
    photo: <BsImage size={20} />,
    plan: <RiFlag2Fill size={20} />,
    generalInfo: <BsInfo size={30} />,
    aligneur: <FaTeethOpen size={20} />,
    export: <HiShare />,
    orders: <MdSend />,
  };
  return (
    <div className="dashboard-control">
      <div className="dashboard-control__head">
        <div className="h3 flex alignItems-center">
          {icon[iconName]}
          {title}
        </div>
        <div className="dashboard-body-actions flex alignItems-center">
          <IoIosArrowDropleft
            name="double-left-arrow"
            size={24}
            className="icon icon-close"
            onClick={() => {
              const timer = setTimeout(() => {
                onClose(true);
              }, 300);
              setAnimate(false);
              return () => {
                clearTimeout(timer);
              };
            }}
          />
        </div>
      </div>
      <DashboardControlCutlines
        meshOpacity={meshOpacity}
        setmeshOpacity={setmeshOpacity}
      />
    </div>
  );
}
