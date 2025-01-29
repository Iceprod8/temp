import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { backend } from "@inplan/adapters/apiCalls";
import useToggle from "@inplan/common/useToogle";
import useBatch from "@inplan/common/Batch/useBatch";
import { capitalizeFirstLetter } from "@inplan/adapters/functions";

const BatchContext = createContext({
  modal: "",
  setModal: Function,
  allSelected: false,
  setAllSelected: Function,
  cart: [],
  setCart: Function,

  patients: [],
  fetchPatients: Function,

  batches: null,
  selectedBatch: null,
  fetchBatches: Function,
  fetchBatch: Function,
  createBatch: Function,
  updateBatch: Function,
  deleteBatch: Function,
  unselectBatch: Function,

  loading: false,
  setLoading: Function,
});

export function useBatchContext() {
  return useContext(BatchContext);
}

export function BatchContextProvider({
  batchType,
  alignerStatus,
  maxBatchSize,
  children,
}) {
  //   //   /*
  //   //   In backend a concept of "views" for specific serializer has
  //   //   been developed. A view is the using of a specific serializer
  //   //   dedicated for this preice purposes. So the "batchview" view
  //   //   customizes the serialization to download only the needed data.
  //   //   With the generic mechanism, we call "batchview_serializer_class"
  //   //   of the ModelViewSet in the backend.
  //   //   The batchview must contain all flags of the models used by
  //   //   modelFilter (check views/models.jx and views/aligner.jsx).
  //   //   */
  //   //   fetchItems: { view_type: "batchview" },
  // });

  const {
    batches,
    selectedBatch,
    fetchBatches,
    fetchBatch,
    createBatch,
    updateBatch,
    deleteBatch,
    unselectBatch,
  } = useBatch(batchType);

  const [modal, setModal] = useState("");
  const [allSelected, setAllSelected] = useToggle(false);
  const [selected, setSelected] = useState({});
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t: translation } = useTranslation();
  // BatchViewOrders: list of order with restricted data for batch view
  const [batchViewOrders, setBatchViewOrders] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [sheetDict, setSheetDict] = useState([]);

  // Get the orders and aligners to be put in new batches
  const fetchBatchViewOrders = async () => {
    const ordersReply = await backend.get("ordered_aligners/in_production", {
      params: { aligner_status: alignerStatus },
    });
    const ordersResults = ordersReply.data.results;
    const orderList = Object.values(ordersResults);
    // ascending order by creation_time
    orderList?.sort(
      (a, b) => new Date(a.creation_time) - new Date(b.creation_time)
    );
    // ascending order by deadline, and deadline == null at the end
    orderList?.sort((a, b) => {
      if (a.deadline === null && b.deadline === null)
        return new Date(a.creation_time) - new Date(b.creation_time);
      if (a.deadline === null) return 1;
      if (b.deadline === null) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setBatchViewOrders(orderList);
  };

  // useEffect(() => {
  //   fetchBatchViewOrders();
  // }, []);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (batches !== null) {
      fetchBatchViewOrders();
      setCart([]);
      setSelected({});
    }
  }, [batches]);

  // TODO PUT in a function
  useEffect(() => {
    (async () => {
      const { data: res } = await backend.get("sheets/available");
      const sheetList = [
        {
          id: "0",
          name: capitalizeFirstLetter(
            translation("utilities.variables.undefined")
          ),
          provider: "Undefined",
          thickness: 0,
        },
      ].concat(res);

      setSheets(sheetList);

      const { data: response } = await backend.get("sheets");
      const allSheetList = [
        {
          id: "0",
          name: capitalizeFirstLetter(
            translation("utilities.variables.undefined")
          ),
          provider: "Undefined",
          thickness: 0,
        },
      ].concat(response?.results);
      const newSheetDict = allSheetList.reduce((newDict, sheet) => {
        return { ...newDict, [sheet.id]: sheet };
      }, {});

      setSheetDict(newSheetDict);
    })();
  }, []);

  return (
    <BatchContext.Provider
      value={{
        modal,
        setModal,
        allSelected,
        setAllSelected,
        selected,
        setSelected,
        cart,
        setCart,

        batchViewOrders,

        batches,
        selectedBatch,
        fetchBatches,
        fetchBatch,
        createBatch,
        updateBatch,
        deleteBatch,
        unselectBatch,

        loading,
        setLoading,

        sheets,
        sheetDict,

        maxBatchSize,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
}
