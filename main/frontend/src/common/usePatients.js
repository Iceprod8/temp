import { useCallback, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
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

export default function usePatients() {
  const [state, dispatch] = useReducer(reducer, {
    archived: 0,
    patients: [],
    patient: null,
    loading: false,
  });
  const { t: translation } = useTranslation();

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
        patients = await backend.get("patients", {
          params: filters,
        });
        patients = patients?.data?.results;

        // const {
        //   data: { count: archived },
        // } = await backend.get("patients/archived");

        const archived = 0; // FIXME: should get rid of this part

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
      try {
        const patientCreationResponse = await backend.post(
          "patients/get_or_create",
          data
        );
        if (patientCreationResponse.status === 201) {
          // if 201 - patient created - ADD PATIENT
          dispatch({
            type: "ADD_PATIENT",
            payload: patientCreationResponse.data,
          });
        } else if (patientCreationResponse.status === 200) {
          // 200 : the patient was not created because he/she already exists
          NotificationManager.warning(
            translation("messages.patients.patient_already_exists")
          );
        }
      } catch (error) {
        if (error.response.status === 409) {
          NotificationManager.error(
            translation(
              "messages.patients.patient_with_same_name_already_exist_check_birth_dates"
            )
          );
        } else {
          NotificationManager.error(
            translation("messages.patients.error_during_patient_creation")
          );
        }
      }
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
