import { useEffect, useRef } from "react";

export default function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function assertMounted() {
    if (!isMounted.current) {
      throw new Error("Component is unmounted");
    }
  }

  return { isMounted, assertMounted };
}
