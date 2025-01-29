import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import logo2 from "@inplan/assets/images/Ortho3D_Icon_2.png";
import { useAppContext } from "@inplan/AppContext";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";

// import Fade from "./Fade";
import PractionnerModal from "./PractionnerModal";

function Navbar() {
  const [modal, setModal] = useState("");
  // const [cutCount, setCutCount] = useState(0);
  const { username, onConnect, activePatient, userData, userRights } =
    useAppContext();
  const navigate = useNavigate();
  const { t: translation } = useTranslation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access-token");
      if (token) {
        const response = await backend.post("logout/");
        if (!response.ok) {
          throw new Error("Failed to log out on the server.");
        }
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const hasInlaseViewAccess = userData?.office?.has_inlase > 0;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchCutCounts();
  //       const itemCount = Array.isArray(data) ? data.length : 0;
  //       setCutCount(itemCount);
  //     } catch (error) {
  //       console.error("Error fetching cut count:", error);
  //     }
  //   };

  //   fetchData();

  //   // Cleanup logic for unmounting (if required in the future)
  //   return () => {
  //     console.log("Navbar component unmounted");
  //   };
  // }, [fetchCutCounts]);

  const navItems = [
    {
      id: "patients",
      show: userRights?.patients_list,
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
      show: userRights?.inlase && hasInlaseViewAccess,
      to: "/inlase",
      label: "navbar.inlase",
    },
    {
      id: "users",
      show: userRights?.handle_users,
      to: "/users",
      label: "navbar.users",
    },
    {
      id: "licenses",
      show: userRights?.handle_licenses,
      to: "/licenses",
      label: "navbar.licenses",
    },
    {
      id: "management",
      show: userRights?.handle_licenses,
      to: "/management",
      label: "navbar.management",
    },
  ];

  return (
    <>
      {/* <Fade
        visible={modal === "modal-practitionner"}
        duration={300}
        zIndex={10000}
        onCleanup={(cleanupFunction) => {
          if (cleanupFunction && typeof cleanupFunction === "function") {
            try {
              cleanupFunction();
            } catch (error) {
              console.error("Error during Fade cleanup:", error);
            }
          }
        }}
      >
        <PractionnerModal setModal={setModal} />
      </Fade> */}
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
                ),
            )}
          </ul>
        </div>
        <div className="header-auth">
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
}

export default Navbar;
