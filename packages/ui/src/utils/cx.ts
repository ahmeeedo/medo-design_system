/** Joins class names and drops empty values. */
export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
