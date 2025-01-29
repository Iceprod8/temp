import React from "react";

import { backend } from "@inplan/adapters/apiCalls";

export default function FavortiteCol(tableIcons, materialTableRef, rowData) {
  const { current } = materialTableRef;
  return (
    <button
      type="button"
      onClick={async () => {
        await backend.patch(`patients/${rowData.patient.id}`, {
          favorite: !rowData.favorite,
        });
        current.onQueryChange();
      }}
    >
      {rowData.favorite ? (
        <tableIcons.Star fontSize="large" color="primary" />
      ) : (
        <tableIcons.StarBorder fontSize="large" color="primary" />
      )}
    </button>
  );
}
