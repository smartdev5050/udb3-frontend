import { MutableRefObject, ReactNode, useEffect, useRef } from 'react';

type UseAutoFocusOptions = {
  /**
   * A boolean that indicates whether the element should be focused on initial load
   */
  focusOnLoad?: boolean;
  /**
   * A prop that retriggers the focus when its value changes
   */
  retriggerOn?: ReactNode;
};

type UseAutoFocusReturn<T extends HTMLElement> = [
  reference: MutableRefObject<T>,
  focus: () => void,
];

export const useAutoFocus = <T extends HTMLElement>({
  focusOnLoad = true,
  retriggerOn = undefined,
}: UseAutoFocusOptions = {}): UseAutoFocusReturn<T> => {
  const element = useRef<T>();
  const focus = () => element.current?.focus();

  useEffect(() => {
    if (!focusOnLoad) return;
    focus();
  }, [element, focusOnLoad]);

  useEffect(() => {
    focus();
  }, [element, retriggerOn]);

  return [element, focus];
};
