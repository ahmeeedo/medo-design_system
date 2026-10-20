import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * How many items of a one-line row fit, keeping room for a „+N“ item (Select and Combobox tags).
 *
 * The caller renders a hidden measure row (same gap as the visible row): one child per item and,
 * as the last child, a „+N“ probe. `reserve` keeps extra space free, e.g. for a text input.
 * At least one item stays visible (it may truncate).
 */
export function useFitCount(
  rowRef: RefObject<HTMLElement | null>,
  measureRef: RefObject<HTMLElement | null>,
  key: string,
  total: number,
  reserve = 0,
) {
  const [visible, setVisible] = useState(total);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;
    const fit = () => {
      const items = [...measure.children] as HTMLElement[];
      const plus = items.pop();
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      const avail = row.clientWidth - reserve;
      let used = 0;
      let count = 0;
      for (let i = 0; i < items.length; i++) {
        const width = items[i].offsetWidth + (i ? gap : 0);
        const plusRoom = i < items.length - 1 ? gap + (plus?.offsetWidth ?? 0) : 0;
        if (used + width + plusRoom > avail) break;
        used += width;
        count = i + 1;
      }
      setVisible(Math.min(total, Math.max(1, count)));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(row);
    return () => observer.disconnect();
  }, [rowRef, measureRef, key, total, reserve]);

  return Math.min(visible, total);
}
