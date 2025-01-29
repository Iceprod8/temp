import { useCallback, useState } from "react";

export default function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toogle = useCallback(() => {
    setState((n) => !n);
  }, [setState]);

  return [state, toogle];
}
