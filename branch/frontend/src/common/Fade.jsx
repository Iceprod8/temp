import React, { useEffect, useRef, useState } from "react";

const VISIBLE = 1;
const HIDDEN = 2;
const ENTERING = 3;
const LEAVING = 4;

export default function Fade({
  type,
  visible,
  zIndex = 0,
  children,
  duration = 300,
  animateEnter = false,
  from = { opacity: 0 },
}) {
  const nodeRef = useRef(null);
  const [state, setState] = useState(
    visible ? (animateEnter ? ENTERING : VISIBLE) : HIDDEN,
  );
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!visible) {
      if (!init) {
        setState(HIDDEN);
        setInit(true);
        return;
      }
      setState(LEAVING);
    } else {
      setState((s) => (s === HIDDEN ? ENTERING : VISIBLE));
    }
  }, [visible]);

  useEffect(() => {
    if (state === LEAVING) {
      const timer = setTimeout(() => {
        setState(HIDDEN);
      }, duration);
      return () => {
        clearTimeout(timer);
      };
    }

    if (state === ENTERING) {
      setState(VISIBLE);
    }
    return () => {};
  }, [state]);

  if (state === HIDDEN) {
    return null;
  }

  const style = {
    transitionDuration: `${duration}ms`,
    transitionProperty: "opacity transform",
    position: "relative",
    zIndex: `${zIndex}`,
    ...(state !== VISIBLE && {
      opacity: from.opacity ?? 0,
      transform:
        type === "translate3D"
          ? `translate3d(${from.x ?? 0}px, ${from.y ?? 0}px, ${from.z ?? 0}px)`
          : undefined,
    }),
  };

  return (
    <div ref={nodeRef} style={style}>
      {children}
    </div>
  );
}
