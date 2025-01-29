import React, { useEffect } from "react";
import { useAppContext } from "@inplan/AppContext";

import LabelParameters from "@inplan/views/practitioner/LabelParameters";
import LanguageParameters from "@inplan/common/translation/LanguageParameters";
import Licenses from "@inplan/views/practitioner/Licenses";
import OrderParameters from "@inplan/views/practitioner/OrderParameters"; // Import the separated component
import BatchPreferences from "@inplan/views/practitioner/BatchPreferences";

export default function Profile() {
  const { userData, onConnect, userRights, getUserRights, updatePractitioner } =
    useAppContext();

  useEffect(() => {
    getUserRights();
  }, []);

  if (!onConnect) {
    return <></>;
  }

  return (
    <div className="page-light">
      <div className="page-profil" style={{ paddingTop: "0" }}>
        <div style={{ marginTop: "16px", padding: "2rem" }}>
          <LanguageParameters />
        </div>
        {(userRights?.bag_label_parameters ||
          userRights?.order_label_parameters) && (
          <div style={{ padding: "2rem" }}>
            <LabelParameters
              bag_label={userRights?.bag_label_parameters}
              order_label={userRights?.order_label_parameters}
            />
          </div>
        )}
        {/* Pass userData and onConnect as props to OrderParameters */}
        {userRights?.order_parameters && (
          <OrderParameters
            userData={userData}
            onConnect={onConnect}
            updatePractitioner={updatePractitioner}
            userRights={userRights}
          />
        )}

        {/* New BatchPreferences Component */}
        {userRights && (
          <div style={{ padding: "2rem" }}>
            <BatchPreferences />
          </div>
        )}
      </div>

      {/* LICENSES */}
      {userRights?.license_parameters && (
        <div className="page-profil" style={{ marginTop: 10, paddingTop: "0" }}>
          <div style={{ padding: "2rem" }}>
            <Licenses />
          </div>
        </div>
      )}
    </div>
  );
}
