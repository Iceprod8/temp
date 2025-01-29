import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import { toISODateString } from "@inplan/adapters/functions";

import { useDashboardContext } from "./Context";

function Section({ title, value }) {
  return value !== undefined && value !== null ? (
    <p className="h4">
      <span>{title}:</span> {value}
    </p>
  ) : null;
}

export default function FollowUp() {
  const { t: translation } = useTranslation();
  const { periods, patient } = useDashboardContext();
  const [day, setDay] = useState({});

  useEffect(() => {
    if (!patient) return;
    (async () => {
      const { data: timeline } = await backend.get(
        `patients/${patient.id}/history?single=${toISODateString(new Date())}`,
      );
      const nday = timeline.history[0];

      function expand(key, list) {
        nday[key] = timeline[list].find((e) => e.id === nday[key]);
      }
      expand("setup", "setups");
      expand("step", "steps");
      expand("maxillary", "models");
      expand("mandibular", "models");
      setDay(nday);
    })();
  }, [periods, patient /* must include appointments */]);

  return (
    <div className="dashboard-sidebar-infos">
      <p>{translation("dashboard.period_information.follow_up.title")}:</p>
      {!day.step
        ? `${translation(
            "dashboard.period_information.follow_up.no_active_period",
          )}`
        : null}
      <Section title="Setup" value={day.setup?.name} />

      <Section
        title={translation("dashboard.period_information.follow_up.period")}
        value={day.step?.name}
      />
      <Section
        title={translation("dashboard.period_information.follow_up.start")}
        value={day.step?.start_date}
      />

      <Section title="Aligners maxillary" value={day.maxillary?.rank} />
      <Section title="Aligners mandibular" value={day.mandibular?.rank} />
    </div>
  );
}
