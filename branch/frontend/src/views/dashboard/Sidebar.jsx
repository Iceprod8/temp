import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { IoIosArrowDown, IoIosCube } from "react-icons/io";
import { BsInfo } from "react-icons/bs";
import { RiFlag2Fill, RiUser3Line } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import { BiCalendarCheck } from "react-icons/bi";
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
  const location = useLocation();
  const navigate = useNavigate();

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
    const newPath =
      location.pathname
        .split("/")
        .map((p, i) => (i === 3 ? opage : p))
        .join("/") || `/${opage}`;
    navigate(newPath);
    setPage(opage);
    handleAnimate(opage);
    console.log(opage);
  };

  return (
    <>
      <li
        onClick={handleClick}
        className={clsx(
          "flex alignItems-center",
          page === opage ? "is-primary" : null,
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
              dropdown === opage ? "icon-up" : null,
            )}
            heigh="14"
            width="14"
          />
        ) : null}
      </li>
      {children}
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
                opage="periods"
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
