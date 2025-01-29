import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { mainColor } from "@inplan/common/Form/styles";
import AlignerUnit from "./AlignerUnit";

export default function Aligners({ control, getValues }) {
  const { t: translation } = useTranslation();
  const [maxAndminAligners, setmaxAndminAligners] = useState({});

  const [choseDifferentiate] = useState(true);

  useEffect(() => {
    const maxmins = { topMax: 1000, topMin: 0, botMax: 1000, botMin: 0 };
    setmaxAndminAligners(maxmins);
  }, [getValues("setup")]);

  return (
    <div style={{ marginRight: "15px", marginBottom: "15px" }}>
      <div
        style={{
          // width: "100%",
          textAlign: "center",
          textDecoration: "underline",
          marginBottom: 8,
          // height: 20,
          color: mainColor,
        }}
      >
        {translation("dashboard.orders.form.fields.aligners_detail.title")}
      </div>
      <div className="">
        <div>
          <div>
            <AlignerUnit
              control={control}
              getValues={getValues}
              top
              dual={choseDifferentiate && true}
              maxAndminAligners={maxAndminAligners}
            />
          </div>

          {choseDifferentiate && (
            <div style={{ marginTop: 8 }}>
              <AlignerUnit
                control={control}
                getValues={getValues}
                top={false}
                dual
                maxAndminAligners={maxAndminAligners}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
