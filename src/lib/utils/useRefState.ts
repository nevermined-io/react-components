import React, { useState, useRef, useEffect, Dispatch, SetStateAction, MutableRefObject } from "react";

function useRefState<T>(initialValue: T): [MutableRefObject<T> | any, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef(state);

  useEffect(
    () => {
      stateRef.current = state;
    },
    [state],
  );
  return [stateRef, setState];
};

export default useRefState;
