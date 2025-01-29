import React from "react";
import { Checkbox } from "@mui/material";
import CustomTranslation from "@inplan/common/translation/CustomTranslation";
import { useInlineContext } from "@inplan/contexts/InlineContext";
import CardModelHeader from "./CardModelHeader";

export default function DashboardControlCards({
  models,
  modelType,
  CardBody,
  handleSelectAll,
  isSelectedUpperJaw,
  isSelectedLowerJaw,
}) {
  const { setState } = useInlineContext();
  const subs = models.map((m) => [
    m,
    <CardModelHeader model={m} modelType={modelType} key={m.id}>
      <CardBody model={m} />
    </CardModelHeader>,
  ]);

  return (
    <div className="dashboard-control-models">
      <div
        className="dashboard-control-models__maxi"
        data-test="model-cards-upper"
        style={{ flex: 1 }}
      >
        <div className="h4">
          <CustomTranslation text="dashboard.cutlines.upper_jaw" />
        </div>
        <div className="flex alignItems-center">
          <Checkbox
            checked={isSelectedUpperJaw}
            onClick={(event) => handleSelectAll(event, 0)}
          />
          <CustomTranslation text="dashboard.cutlines.select_all" />
        </div>
        {subs.filter((e) => e[0].type === 0).map((e) => e[1]) || (
          <div className="dashboard-control__download" />
        )}
      </div>
      <div
        className="dashboard-control-models__maxi"
        data-test="model-cards-lower"
        style={{ flex: 1 }}
      >
        <div className="h4">
          <CustomTranslation text="dashboard.cutlines.lower_jaw" />
        </div>
        <div className="flex alignItems-center">
          <Checkbox
            checked={isSelectedLowerJaw}
            onClick={(event) => handleSelectAll(event, 1)}
          />
          <CustomTranslation text="dashboard.cutlines.select_all" />
        </div>
        {subs.filter((e) => e[0].type === 1).map((e) => e[1]) || (
          <div className="dashboard-control__download" />
        )}
      </div>
    </div>
  );
}
