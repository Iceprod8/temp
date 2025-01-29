import { useCallback, useMemo, useReducer } from "react";
import useIsMounted from "@inplan/common/useIsMounted";
import { backend } from "@inplan/adapters/apiCalls";

function reducer(name, state, action) {
  console.debug(`${name} BATCH REDUCER`, action.type, action);
  switch (action.type) {
    case "FETCHING_BATCH":
      return { ...state, loading: true };
    case "SET_BATCH":
      return { ...state, batches: action.payload, loading: false };
    case "ADD_BATCH":
      return { ...state, batches: [...state.batches, action.payload] };
    case "UPDATE_BATCH":
      return {
        ...state,
        batches: state.batches.map((b) =>
          b === action.target ? action.payload : b,
        ),
      };
    case "DELETE_BATCH":
      return {
        ...state,
        batches: state.batches.filter((b) => b !== action.payload),
      };
    case "SELECT_BATCH":
      return { ...state, selectedBatchId: action.payload };
    case "DESELECT_BATCH":
      return { ...state, selectedBatchId: null };
    default:
      throw new Error(action.type);
  }
}

export default function useBatch(name) {
  const resource = `${name.toLowerCase()}_batches`;
  const resourceFiltered = resource;
  // const resourceFiltered = `${name.toLowerCase()}_batches?status!=2`;
  const [state, dispatch] = useReducer((s, a) => reducer(name, s, a), {
    /*
       Use null for not yet fetch resource beacause, to prevent from
       fetching too many times the other resources.
       Check BatchContext useEffect that fetch patients.
       It is not import to fetch patients if batches are not yet here
     */
    batches: null,
    loading: false,
    selectedBatchId: null,
  });

  const { isMounted } = useIsMounted();

  const selectedBatch = useMemo(() => {
    if (!Array.isArray(state.batches)) {
      return null;
    }
    return state.batches.find((b) => b.id === state.selectedBatchId);
  }, [state.batches, state.selectedBatchId]);

  return {
    batches: state.batches,
    selectedBatch,
    fetchBatches: useCallback(async () => {
      if (state.loading) {
        return;
      }
      dispatch({ type: "FETCHING_BATCH" });
      // const {
      //   data: { results: batches },
      // } = await backend.get(resourceFiltered);
      // const {
      //   data: { results: batches },
      //   // } = await backend.get(resource);
      // } = await backend.get(resourceFiltered, {
      //   params: { view_type: "batchview" },
      // });

      const {
        data: { results: batches },
      } = await backend.get(resourceFiltered, {
        params: { view_type: "batchview" },
      });

      if (isMounted.current) {
        dispatch({ type: "SET_BATCH", payload: batches });
      }
    }, [state.batches]),
    fetchBatch: useCallback(async (batch, type) => {
      if (type === "select") {
        dispatch({ type: "SELECT_BATCH", payload: batch.id });
      }
    }, []),
    createBatch: useCallback(async (data) => {
      const { data: batch } = await backend.post(resource, data);
      dispatch({ type: "ADD_BATCH", payload: batch });
    }, []),

    updateBatch: useCallback(async (batch, data, type) => {
      if (type === "validate") {
        const { data: newValidatedBatch } = await backend.get(
          `${resource}/${batch.id}/validate`,
        );
        dispatch({
          type: "UPDATE_BATCH",
          payload: newValidatedBatch,
          target: batch,
        });
      } else {
        const { data: newPatchedBatch } = await backend.patch(
          `${resource}/${batch.id}`,
          data,
        );
        dispatch({
          type: "UPDATE_BATCH",
          payload: newPatchedBatch,
          target: batch,
        });
      }
    }, []),

    deleteBatch: useCallback(async (batch) => {
      await backend.delete(`${resource}/${batch.id}`);
      dispatch({ type: "DELETE_BATCH", payload: batch });
    }, []),
    unselectBatch: useCallback(() => dispatch({ type: "DESELECT_BATCH" }), []),
  };
}
