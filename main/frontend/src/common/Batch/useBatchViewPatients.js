import { useCallback, useReducer } from "react";
import { backend } from "@inplan/adapters/apiCalls";
import useIsMounted from "@inplan/common/useIsMounted";

function reducer(state, action) {
  console.debug("PATIENTS REDUCER", action.type, action);
  switch (action.type) {
    // Patients
    case "FETCHING_PATIENTS":
      return { ...state, loading: true };
    case "SET_PATIENTS":
      return { ...state, ...action.payload, loading: false };
    // Patient
    case "ADD_PATIENT":
      return { ...state, patients: [...state.patients, action.payload] };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: state.patients.map((p) =>
          p === action.target ? action.payload : p
        ),
      };
    case "FETCHING_PATIENT":
      return { ...state, loading: true };
    case "SET_PATIENT":
      return { ...state, patient: action.payload, loading: false };
    default:
      throw new Error(action.type);
  }
}

export default function useBatchViewPatients() {
  const [state, dispatch] = useReducer(reducer, {
    archived: 0,
    patients: [],
    patient: null,
    loading: false,
  });

  const { isMounted } = useIsMounted();

  return {
    patients: state.patients,
    patient: state.patient,
    archived: state.archived,

    fetchPatients: useCallback(
      async (filters) => {
        let patients = [];
        if (state.loading) {
          return;
        }
        dispatch({ type: "FETCHING_PATIENTS" });
        patients = await backend.get("patients/in_production", {
          params: filters,
        });
        patients = patients?.data?.results;

        const archived = 0;

        if (isMounted.current) {
          dispatch({
            type: "SET_PATIENTS",
            payload: { patients, archived },
          });
        } else {
          console.debug("The component is not mounted anymore");
        }
      },
      [state.patients]
    ),

    createPatient: useCallback(async (data) => {
      const { data: patient } = await backend.post("patients", data);
      dispatch({ type: "ADD_PATIENT", payload: patient });
    }, []),

    updatePatient: useCallback(async (patient, data) => {
      const { data: newPatient } = await backend.patch(
        `patients/${patient.id}`,
        data
      );

      /*
        FIXME: quick & dirty, must fix the backend to return
        active_step as an object instead of id when partial update
        is performed
      */
      newPatient.active_step = patient.active_step;

      dispatch({
        type: "UPDATE_PATIENT",
        payload: newPatient,
        target: patient,
      });
    }, []),

    fetchPatient: useCallback(async (id) => {
      if (state.loading) {
        return;
      }
      dispatch({ type: "FETCHING_PATIENT" });
      const { data: patient } = await backend.get(`patients/${id}`);
      dispatch({ type: "SET_PATIENT", payload: patient });
    }, []),
  };
}
