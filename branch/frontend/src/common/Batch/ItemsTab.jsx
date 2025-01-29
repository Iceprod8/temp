import React from "react";
import { useTranslation } from "react-i18next";

export default function ItemsTab({ mode, children }) {
  const { t: translation } = useTranslation();
  return (
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: "35%" }}>
            <div className="td-alignItems">
              <div style={{ marginLeft: "24px" }}>
                {translation("3d_printing.table_pending_models.titles.orders")}
              </div>
            </div>
          </th>
          <th>{translation("3d_printing.table_pending_models.titles.edit")}</th>
          <th>
            {translation("3d_printing.table_pending_models.titles.remaining")}
          </th>
          <th style={{ width: "37%" }}>
            {translation(
              "3d_printing.table_pending_models.titles.select_actions",
            )}
          </th>
          <th style={{ width: "10%" }}>
            {translation(
              "3d_printing.table_pending_models.titles.current_selected",
            )}
          </th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
