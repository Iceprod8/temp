import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@inplan/contexts/SnackbarContext";
import useCollection from "./useCollection";
import uploadModels from "./uploadModels";

export function useSetups() {
  const handlers = useCollection("setups", (s1, s2) =>
    s1.creation.localeCompare(s2.creation),
  );

  const { items } = handlers;

  /* Active setup is the last, not archived and validated */
  const latestSetup = [...items]
    ?.sort((a, b) => new Date(a.creation) - new Date(b.creation))
    .filter((a) => !a.is_archived)
    .pop();

  return {
    latestSetup,
    ...handlers,
  };
}

export function useAppointments() {
  const handlers = useCollection("appointments", (a1, a2) =>
    a1.date.localeCompare(a2.date),
  );

  const { items } = handlers;

  const now = new Date().getTime();

  const nextAppointment = items
    .map((a) => [new Date(a.date).getTime(), a])
    .filter(([i]) => i >= now)
    .sort(([a], [b]) => a - b)
    .map(([, item]) => item)[0];

  return {
    nextAppointment,
    ...handlers,
  };
}

export function usePeriods() {
  const handlers = useCollection("steps", (s1, s2) =>
    s1.start_date.localeCompare(s2.start_date),
  );
  return handlers;
}

export function useOrders(defaultParams) {
  const handlers = useCollection(
    "orders",
    (o1, o2) => o1.creation_date.localeCompare(o2.creation_date),
    defaultParams,
  );
  return handlers;
}

export function useModels(defaultParams) {
  const handlers = useCollection(
    "models",
    (m1, m2) => m1.rank - m2.rank,
    defaultParams,
  );

  const { fetchItems } = handlers;
  const { t: translation } = useTranslation();
  const { showSnackbar } = useSnackbar();
  return {
    ...handlers,
    uploadModels: useCallback(async (files, setup, parameters) => {
      await uploadModels(showSnackbar, files, setup, parameters, translation);
      fetchItems({ patient_id: setup.patient.id });
    }, []),
  };
}

export function useUserLicenses() {
  const handlers = useCollection("user_licenses", (license1, license2) =>
    license2.end_date.localeCompare(license1.end_date),
  );
  return handlers;
}

export function useLicenseTypes() {
  const handlers = useCollection("license_type", (type1, type2) =>
    type1.creation_time.localeCompare(type2.creation_time),
  );
  return handlers;
}

export function useUsers() {
  const handlers = useCollection("users", (user1, user2) =>
    user1.creation_time.localeCompare(user2.creation_time),
  );
  return handlers;
}

export function useOffices() {
  const handlers = useCollection("offices", (office1, office2) =>
    office1.creation_time.localeCompare(office2.creation_time),
  );
  return handlers;
}

export function useProfiles(defaultParams) {
  const handlers = useCollection("profiles", defaultParams);
  return handlers;
}

// export function useCutCounts(defaultParams) {
//   const handlers = useCollection("cut_count", defaultParams);
//   return handlers;
// }
