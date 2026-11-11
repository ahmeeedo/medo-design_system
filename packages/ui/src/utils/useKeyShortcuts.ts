import { useCallback, type Ref } from 'react';

/**
 * React Aria's Button and ToggleButton drop aria-keyshortcuts (filterDOMProps keeps only a few ARIA props).
 * This ref sets the attribute on the rendered element instead, so screen readers announce the shortcut.
 * Merges with a ref passed by the caller.
 */
export function useKeyShortcuts<T extends Element>(value: string | undefined, ref?: Ref<T>) {
  return useCallback(
    (el: T | null) => {
      if (el) {
        if (value) el.setAttribute('aria-keyshortcuts', value);
        else el.removeAttribute('aria-keyshortcuts');
      }
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: T | null }).current = el;
    },
    [value, ref],
  );
}
