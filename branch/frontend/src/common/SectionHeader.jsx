import React from "react";
import { useTranslation } from "react-i18next";
import { IoSyncOutline } from "react-icons/io5";
import { AiFillSchedule } from "react-icons/ai";
import { RiTableFill } from "react-icons/ri";
import { mainColor } from "@inplan/common/Form/styles";

const fontSettings = {
  color: mainColor,
  fontFamily: "Source Sans Pro !important",
  fontWeight: 700,
  fontSize: 15,
};

const mapping = (translation) => {
  const options = {
    orders: {
      title: translation("dashboard.orders.table.name"),
      icon: IoSyncOutline,
    },
    appointments: {
      title: translation("dashboard.appointments.table.name"),
      icon: AiFillSchedule,
    },
    setups: {
      title: translation("dashboard.setups.table.name"),
      icon: RiTableFill,
    },
  };
  return options;
};

const SectionHeader = ({ type }) => {
  const { t: translation } = useTranslation();
  const style = { fontSize: "24px", color: mainColor };
  const Icon = React.createElement(mapping(translation)[type].icon, {
    style,
  });
  return (
    <div className="order-header" style={{ height: 36 }}>
      <div className="empty-div" />

      <div className="order-title">
        <div style={{ margin: "0px 8px", ...fontSettings }}>
          {mapping(translation)[type].title}
        </div>
        {Icon}
      </div>

      <div className="empty-div" />
    </div>
  );
};

export default SectionHeader;
