import { useEffect, useRef } from "react";
import { useInlineContext } from "@inplan/contexts/InlineContext";

import useIsMounted from "./useIsMounted";

export default function usePeriodTask(task, delay) {
  const { isMounted } = useIsMounted();
  const { selectedSetup } = useInlineContext();
  const refreshTimeId = useRef(null);

  const round = () => {
    if (isMounted.current && task()) {
      refreshTimeId.current = setTimeout(round, delay);
    }
  };

  useEffect(() => {
    if (refreshTimeId.current !== null) {
      clearTimeout(refreshTimeId.current);
    }
    round();
  }, [selectedSetup, task]);
}
