import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import logo2 from "@inplan/assets/images/Ortho3D_Icon_2.png";
import { useAppContext } from "@inplan/AppContext";
import { useTranslation } from "react-i18next";

import { backend } from "@inplan/adapters/apiCalls";

import Fade from "./Fade";
import PractionnerModal from "./PractionnerModal";

const Navbar = () => {
  const [modal, setModal] = useState("");
  const [cutCount, setCutCount] = useState(0); // Store the cut count
  const {
    username,
    onConnect,
    setOnConnect,
    activePatient,
    userData,
    userRights,
    fetchCutCounts,
  } = useAppContext();
  const history = useHistory();
  const location = useLocation();
  const { t: translation } = useTranslation();

  const handleLogout = async () => {
    console.info("logging out");
    try {
      const token = localStorage.getItem("access-token");

      if (token) {
        // Call the logout API on the backend
        const response = await backend.post("logout/");

        if (!response.ok) {
          throw new Error("Failed to log out on the server.");
        }
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear tokens and disconnect on the frontend
      localStorage.removeItem("token");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");

      // Redirect the user to the root
      history.push("/");
    }
  };
  // FIXME has_inlase_view_access - should be using rights only
  // To be tested : is the page broken if no inlase exist ? (probably)

  // Determine permissions and route visibility
  const has_inlase_view_access = userData?.office?.has_inlase > 0;

  // Count nbCut
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCutCounts();
        const itemCount = Array.isArray(data) ? data.length : 0;
        setCutCount(itemCount);
      } catch (error) {
        console.error("Error fetching cut count:", error);
      }
    };
    fetchData();
  }, []);

  // Update condition to handle dynamic routes
  const isExcludedPath =
    location.pathname.startsWith("/dashboard") ||
    location.pathname === "/profile";

  const shouldShowNbCute = !isExcludedPath;

  // Navigation items with conditions
  const navItems = [
    {
      id: "patients",
      show: userRights?.patients_list || userRights?.reduced_patients_list,
      to: "/patients",
      label: "navbar.patients",
    },
    {
      id: "laboratory",
      show: userRights?.order_list,
      to: "/laboratory",
      label: "navbar.laboratory",
    },
    {
      id: "models",
      show: userRights?.printing,
      to: "/models",
      label: "navbar.models",
    },
    {
      id: "aligners",
      show: userRights?.thermoforming,
      to: "/aligners",
      label: "navbar.aligners",
    },
    {
      id: "inlase",
      show: userRights?.inlase && has_inlase_view_access,
      to: "/inlase",
      label: "navbar.inlase",
    },
    {
      id: "users",
      show: userRights?.handle_users && userRights?.to_read_user,
      to: "/users",
      label: "navbar.users",
    },
    {
      id: "licenses",
      show: userRights?.handle_licenses && userRights?.to_read,
      to: "/licenses",
      label: "navbar.licenses",
    },
    {
      id: "management",
      show: userRights?.handle_licenses && userRights?.to_read,
      to: "/management",
      label: "Management",
    },
  ];

  return (
    <>
      <Fade
        visible={modal === "modal-practitionner"}
        duration={300}
        zIndex={10000}
        from={{ opacity: 0 }}
      >
        <PractionnerModal setModal={setModal} />
      </Fade>
      <nav className="header">
        <div className="header-home">
          <NavLink to="/" className="header-home__logo">
            <img src={logo2} width="60" alt="Logo" />
          </NavLink>
          {activePatient && (
            <NavLink
              to={`/dashboard/${activePatient.id}`}
              className="header-home__patient"
              style={{
                margin: "29px 16px 29px 40px",
                display: "grid",
                gridTemplateColumns: "auto auto",
              }}
            >
              <CgProfile
                size={20}
                style={{ color: "#DADDE2", borderRadius: "5em" }}
              />
              {`\u00A0${activePatient.last_name} ${activePatient.first_name}`}
            </NavLink>
          )}
        </div>
        <div className="header-main">
          <ul>
            {navItems.map(
              ({ id, show, to, label }) =>
                show && (
                  <li key={id}>
                    <NavLink to={to}>{translation(label)}</NavLink>
                  </li>
                )
            )}
          </ul>
        </div>
        <div className="header-auth">
          {/* 
          
          COUNTER 

          {shouldShowNbCute && (
            <div
              style={{
                marginRight: 8,
                color: "#DADDE2",
                fontSize: "14px",
              }}
            >
              Total Nb of Cuts: {cutCount}
            </div>
          )} */}
          <MdOutlineSettings
            style={{ marginRight: 8 }}
            className="header-auth__user"
          />
          <NavLink to="/profile" className="header-auth__user">
            {onConnect ? username : translation("navbar.profile.not_connected")}
          </NavLink>
          <FiLogOut className="icon icon-logout" onClick={handleLogout} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
