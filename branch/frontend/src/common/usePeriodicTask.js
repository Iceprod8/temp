import { useEffect, useState } from "react";
import { useInlineContext } from "@inplan/views/inline/InlineContext";

import useIsMounted from "./useIsMounted";

export default function usePeriodTask(task, delay) {
  const { isMounted } = useIsMounted();
  const { selectedSetup } = useInlineContext();
  const [refreshTimeId, setRefreshTimeId] = useState(null);

  const round = () => {
    if (isMounted.current && task()) {
      setRefreshTimeId(setTimeout(round, delay));
    }
  };

  useEffect(() => {
    if (refreshTimeId !== null) {
      clearTimeout(refreshTimeId);
    }
    round();
  }, [selectedSetup]);
}
