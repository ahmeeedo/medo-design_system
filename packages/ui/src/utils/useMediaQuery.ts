import { useSyncExternalStore } from 'react';

/** Below breakpoint/sm (640 px): mobile behaviour for Select, Combobox and Bottom Sheet. */
export const MOBILE_QUERY = '(max-width: 639.98px)';

/** True while the media query matches. SSR-safe (false on the server). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
