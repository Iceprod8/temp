import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { IoIosArrowDown, IoIosCube } from "react-icons/io";
import { FaTeethOpen } from "react-icons/fa";
import { BsInfo } from "react-icons/bs";
import { RiFlag2Fill, RiUser3Line } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import { BiCalendarCheck } from "react-icons/bi";

import Fade from "@inplan/common/Fade";
import { SidebarSeparator } from "@inplan/common/Icon";
import { useAppContext } from "@inplan/AppContext";

import { useDashboardContext } from "./Context";
import FollowUp from "./FollowUp";

function Option({
  opage,
  title,
  icon,
  children,
  animate,
  setHidden,
  setAnimate,
  isTranslate,
  setIsTranslate,
  dropdownState,
}) {
  const { page, setPage } = useDashboardContext();

  const [dropdown, setDropdown] = dropdownState;

  // Reset submenu in sidebar
  const handleDropdown = (name) => {
    if (name === dropdown) {
      setDropdown("");
    } else {
      setDropdown(name);
    }
  };

  const handleAnimate = (currentPage) => {
    if (animate === false) {
      if (isTranslate) {
        const timer = setTimeout(() => {
          setAnimate(true);
        }, 300);

        return () => {
          clearTimeout(timer);
        };
      }
      setAnimate(true);
    }

    if (page === currentPage) {
      setAnimate(false);
      if (animate === false) {
        setAnimate(true);
      }
    }
    return null;
  };

  const handleClick = () => {
    setHidden(false);
    setIsTranslate(false);
    handleDropdown(opage);
    setPage(opage);
    handleAnimate(opage);
  };

  return (
    <>
      <li
        onClick={handleClick}
        className={clsx(
          "flex alignItems-center",
          page === opage ? "is-primary" : null
        )}
        data-test={opage}
      >
        {icon({
          size: 20,
          className: "icon icon-general-info",
        })}
        {title}
        {children ? (
          <IoIosArrowDown
            name="arrow-bottom"
            className={clsx(
              "icon icon-arrow-bottom",
              dropdown === opage ? "icon-up" : null
            )}
            heigh="14"
            width="14"
          />
        ) : null}
      </li>
      <Fade
        visible={animate && page === opage}
        from={{ opacity: 0 }}
        duration={page === opage ? 300 : 0}
      >
        {children}
      </Fade>
    </>
  );
}

export default function DashboardSidebar(props) {
  const { t: translation } = useTranslation();
  const { userData, userRights } = useAppContext();

  const dropdownState = useState("");

  return (
    <div className="dashboard-sidebar">
      <div className="dashboard-sidebar__wrapper">
        {userRights?.periods && <FollowUp />}
        {userRights?.periods && (
          <SidebarSeparator className="icon icon-sidebar-separator" />
        )}
        <div className="sidebar-main">
          <ul>
            {userRights?.periods && (
              <Option
                {...props}
                dropdownState={dropdownState}
                opage="informations"
                title={translation("dashboard.period_information.title")}
                icon={BsInfo}
              />
            )}

            {(userRights?.order_creation ||
              userRights?.reduced_order_creation) &&
              userData?.production_ready && (
                <Option
                  {...props}
                  dropdownState={dropdownState}
                  opage="orders"
                  title={translation("dashboard.orders.title")}
                  icon={MdSend}
                />
              )}

            {userRights?.setups && (
              <Option
                {...props}
                dropdownState={dropdownState}
                opage="setups"
                title={translation("dashboard.setups.title")}
                icon={RiFlag2Fill}
              />
            )}

            {userRights?.cutlines && (
              <Option
                {...props}
                dropdownState={dropdownState}
                opage="cutlines"
                title={translation("dashboard.cutlines.title")}
                icon={IoIosCube}
              />
            )}

            {userRights?.appointments && (
              <Option
                {...props}
                dropdownState={dropdownState}
                opage="appointment"
                title={translation("dashboard.appointments.title")}
                icon={BiCalendarCheck}
              />
            )}

            {userRights?.patient_profile && (
              <Option
                {...props}
                dropdownState={dropdownState}
                opage="patient"
                title={translation("dashboard.patient_profile")}
                icon={RiUser3Line}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
