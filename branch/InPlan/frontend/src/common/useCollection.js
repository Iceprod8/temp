import { useCallback, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";

import { backend } from "@inplan/adapters/apiCalls";
import useIsMounted from "@inplan/common/useIsMounted";

export default function useCollection(collection, compareFn, defaultParams) {
  const { t: translation } = useTranslation();
  const ucollection = collection.toUpperCase();

  function reducer(state, action) {
    console.debug(`${ucollection} REDUCER`, action.type, action);
    let unsortedItems;
    switch (action.type) {
      case "FETCHING_ITEMS":
        return { ...state, loading: true };
      case "SET_ITEMS":
        unsortedItems = [...action.payload];
        break;
      case "ADD_ITEM":
        unsortedItems = [...state.items, action.payload];
        break;
      case "UPDATE_ITEM":
        unsortedItems = state.items.map((p) =>
          p?.id === action.target ? action.payload : p
        );
        break;
      case "DELETE_ITEM":
        unsortedItems = state.items.filter((p) => p.id !== action.payload.id);
        break;
      default:
        throw new Error(action.type);
    }
    const items = [...unsortedItems];
    items.sort(compareFn);
    return {
      ...state,
      unsortedItems,
      items,
      loading: false,
    };
  }

  const [state, dispatch] = useReducer(reducer, {
    unsortedItems: [],
    items: [],
    loading: false,
  });

  const [total, setTotal] = useState(0);

  const { isMounted } = useIsMounted();

  return {
    unsortedItems: state.unsortedItems,
    items: state.items,
    total,
    loading: state.loading,

    fetchItem: useCallback(async (id, params) => {
      try {
        const { data: item } = await backend.get(`${collection}/${id}`, {
          params: { ...params, ...defaultParams?.fetchItem },
        });

        if (isMounted.current) {
          dispatch({ type: "UPDATE_ITEM", payload: item, target: id });
        }
        return item;
      } catch (error) {
        NotificationManager.error(translation("messages.common.backend_issue"));
        console.error(error);
      }
      return undefined;
    }, []),

    fetchItems: useCallback(
      async (params) => {
        try {
          if (state.loading) {
            return undefined;
          }

          dispatch({ type: "FETCHING_ITEMS" });
          const {
            data: { results, count },
          } = await backend.get(collection, {
            params: { ...params, ...defaultParams?.fetchItems },
          });

          if (isMounted.current) {
            setTotal(count);
            dispatch({ type: "SET_ITEMS", payload: results });
          } else {
            console.debug("The component is not mounted anymore");
          }
          return results;
        } catch (error) {
          NotificationManager.error(
            translation("messages.common.backend_issue")
          );
          console.error(error);
        }
        return undefined;
      },
      [state.items]
    ),

    createItem: useCallback(async (patientId, data) => {
      try {
        const { data: item } = await backend.post(collection, {
          ...data,
          patient: patientId,
          ...defaultParams?.createItem,
        });

        dispatch({ type: "ADD_ITEM", payload: item });
        return item;
      } catch (error) {
        NotificationManager.error(translation("messages.common.backend_issue"));
        console.error(error);
      }
      return undefined;
    }, []),

    updateItem: useCallback(async (itemId, data) => {
      try {
        const { data: nItem } = await backend.patch(`${collection}/${itemId}`, {
          ...data,
          ...defaultParams?.updateItem,
        });
        dispatch({ type: "UPDATE_ITEM", payload: nItem, target: itemId });
        return nItem;
      } catch (error) {
        NotificationManager.error(translation("messages.common.backend_issue"));
        console.error(error);
      }
      return undefined;
    }, []),

    deleteItem: useCallback(async (item) => {
      try {
        await backend.delete(`${collection}/${item.id}`, {
          ...defaultParams?.deleteItem,
        });
        dispatch({ type: "DELETE_ITEM", payload: item });
      } catch (error) {
        NotificationManager.error(translation("messages.common.backend_issue"));
        console.error(error);
      }
      return undefined;
    }, []),
  };
}
