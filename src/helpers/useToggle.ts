import { useCallback, useState } from 'react';

export const useToggle = (
  initialValue?: boolean
  // eslint-disable-next-line no-unused-vars
): [value: boolean, toggle: (val?: boolean) => void] => {
  const [value, setValue] = useState(
    initialValue !== undefined ? initialValue : false
  );

  const toggle = useCallback(
    (toggleValue?: boolean) =>
      setValue((prevValue) =>
        toggleValue !== undefined ? toggleValue : !prevValue
      ),
    []
  );

  return [value, toggle];
};
