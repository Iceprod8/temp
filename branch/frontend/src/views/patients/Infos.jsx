import React from "react";
import { MdTrendingUp } from "react-icons/md";
import {
  HiOutlineFolderRemove,
  HiOutlinePrinter,
  HiEyeOff,
} from "react-icons/hi";
import { FiCheckCircle } from "react-icons/fi";

import { onGoingC, partialC, terminatedC } from "@inplan/adapters/functions";

const commonStyle = {
  padding: "5px",
  width: "40px",
  height: "40px",
  borderRadius: "30px",
};

export default function PatientsInfos({ patients, archived }) {
  return (
    <div className="patients-infos">
      <div className="patients-infos__item flex alignItems-center">
        <MdTrendingUp
          name="traitement"
          size={40}
          style={{
            ...commonStyle,
            fill: "#00B8D4",
            backgroundColor: "#E0F7FA",
          }}
        />
        <span>{onGoingC(patients)}</span>
        <div style={{ marginTop: "10px" }}>current treatments</div>
      </div>
      <div className="patients-infos__item flex alignItems-center">
        <HiOutlineFolderRemove
          name="folder"
          style={{
            ...commonStyle,
            color: "#FF9100",
            backgroundColor: "#FFF3E0",
          }}
        />
        <span>{partialC(patients)}</span>
        <div style={{ marginTop: "10px" }}>incomplete records</div>
      </div>
      <div className="patients-infos__item flex alignItems-center">
        <HiOutlinePrinter
          name="impressions"
          style={{
            ...commonStyle,
            color: "#7C4DFF",
            backgroundColor: "#EDE7F6",
          }}
        />
        <span>
          {patients
            .map((p) => p.models.to_print - p.models.printed)
            .reduce((c, x) => c + x, 0)}
        </span>
        <div style={{ marginTop: "10px" }}>impressions expected</div>
      </div>
      <div className="patients-infos__item flex alignItems-center">
        <FiCheckCircle
          name="validated"
          style={{
            ...commonStyle,
            color: "#13C095",
            backgroundColor: "#E9FDF8",
          }}
        />
        <span>{terminatedC(patients)}</span>
        <div style={{ marginTop: "10px" }}>completed treatments</div>
      </div>
      <div className="patients-infos__item flex alignItems-center">
        <HiEyeOff
          style={{
            ...commonStyle,
            color: "#263238",
          }}
          name="archived"
          width="40"
          height="40"
        />
        <span>{archived}</span>
        <div style={{ marginTop: "10px" }}>archived patients</div>
      </div>
    </div>
  );
}
