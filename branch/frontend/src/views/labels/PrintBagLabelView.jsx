import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@inplan/AppContext";
import { useOrders } from "@inplan/common/collections";
import { backend } from "@inplan/adapters/apiCalls";
import getDetailedOrder from "@inplan/common/GetDetailedOrder";

import PrintLabel from "./PrintLabel";

function goPrint() {
  window.print();
}

const getLabelDescription = async () => {
  const undefinedSetting = {
    id: "0",
  };
  const response = await backend.get(`offices/get_label_description`);
  if (response.status === 200) {
    return response.data;
  }
  console.error("Error fetching backend get");
  return { undefinedSetting };
};

// TODO - remove duplicates with PrintLabel.jsx and orderColumns.js
function minAlignerInCommand(order) {
  const startTop =
    order.start_aligner_top >= 0 ? order.start_aligner_top : Infinity;
  const startBottom =
    order.start_aligner_bottom >= 0 ? order.start_aligner_bottom : Infinity;
  return Math.min(startTop, startBottom);
}

function maxAlignerInCommand(order) {
  return Math.max(order.end_aligner_top, order.end_aligner_bottom);
}

// Combines upper and lower ranges
function combinesRanges(minTop, maxTop, minBot, maxBot) {
  const uniqueNumbers = new Set();

  if (minTop >= 0 && maxTop >= 0) {
    for (let index = minTop; index <= maxTop; index += 1) {
      uniqueNumbers.add(index);
    }
  }

  if (minBot >= 0 && maxBot >= 0) {
    for (let index = minBot; index <= maxBot; index += 1) {
      uniqueNumbers.add(index);
    }
  }

  // Convert the Set to an Array and sort
  return Array.from(uniqueNumbers).sort((x, y) => x - y);
}

// Get the list of rank to be considered
function getRankList(order) {
  const minTop = order.start_aligner_top;
  const maxTop = order.end_aligner_top;
  const minBot = order.start_aligner_bottom;
  const maxBot = order.end_aligner_bottom;
  return combinesRanges(minTop, maxTop, minBot, maxBot);
}

export default function Labels() {
  const { idOrder } = useParams();
  const { t: translation } = useTranslation();
  const { fetchItem: fetchOrder } = useOrders({
    fetchItem: { view_type: "printer" },
  });

  const [order, setOrder] = useState(null);
  const [labelDescription, setLabelDescription] = useState({});
  const [alignersNum, setAligersNum] = useState([]);
  const { getUserRights } = useAppContext();
  useEffect(() => {
    getUserRights();
  }, []);
  useEffect(() => {
    async function OrderLabelFetch() {
      if (!idOrder) return;

      const order1 = await fetchOrder(idOrder);
      if (!order1) return;

      const rankList = getRankList(order1);
      setAligersNum(rankList);

      const order2 = await getDetailedOrder(order1, translation);
      setOrder(order2);

      const labelDescriptionFetched = await getLabelDescription();
      setLabelDescription(labelDescriptionFetched);

      goPrint();
    }
    OrderLabelFetch();
  }, [idOrder]);

  return (
    <>
      <div className="label-print-action">
        <button
          className="btn-primary notinprint"
          type="button"
          onClick={() => {
            window.print();
          }}
        >
          {translation("laboratory.print.title")}
        </button>
      </div>
      <div>
        <div className="printer-labels">
          {order &&
            alignersNum?.map((alignerNum) => (
              <PrintLabel
                key={alignerNum * 2}
                rank={alignerNum}
                order={order}
                labelDescription={labelDescription}
              />
            ))}
        </div>
      </div>
    </>
  );
}

/*
Numero d’aligneurs + Serie d'aligneurs


- NOM Prénom du patient +/- Logo du cab


- NOM Prénom du praticien


- La nature de la commande : plusieurs points

- Aligneurs, fil de contention, gouttière de contention, autres dispositifs (avec ou sas aligneurs)

- la date de réalisation : à savoir la date pour laquelle les aligneurs sont commandés. Cela sert à identifier les aligneurs qui sont restés dans les placards trop longtemps s’ils n’ont pas été distribués en cas de RDV manqués du patient. Mais aussi, s’il y a des doublons de numero d’aligneurs en cas de reprise de quelques aligneurs si perte de contrôle, a identifier la série de l’aligneurs). 2 possibilités
               - commande pour le jour meme (si commande urgente, ou que le praticien souhaite revoir le patient avant de lancer les suites de production)
                - commande pour le prochain RDV

      - le lieux :
               - domicile (si envoi a domicile), clinique, secrétariat
               - secretariat (si le patient passe juste récupérer sa gouttière Penn double ou de contention)
               - clinique (pour rdv clinique classique)
*/
