/**
 * Component status – one source: the tag `status:<level>` in the meta of a component's stories.
 * Read by the docs page header (badge), the sidebar (marker) and the test “Status” (every component has exactly one,
 * the README says the same). The levels and the checklist for Stable: Guides / Component status.
 */
export const STATUSES = ['experimental', 'beta', 'stable', 'deprecated'] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS: Record<Status, { label: string; tone: 'warning' | 'info' | 'success' | 'danger'; meaning: string }> = {
  experimental: { label: 'Experimental', tone: 'warning', meaning: 'New – the API may still change in a minor release.' },
  beta: { label: 'Beta', tone: 'info', meaning: 'Complete and tested automatically; the manual checks for Stable are still open.' },
  stable: { label: 'Stable', tone: 'success', meaning: 'Meets every point of the checklist. Changes only with the rules for breaking changes.' },
  deprecated: { label: 'Deprecated', tone: 'danger', meaning: 'Will be removed – the page names the replacement.' },
};

/** The status in a list of tags, e.g. ['autodocs', 'status:beta'] → 'beta'. */
export const statusOf = (tags: readonly string[] = []) => tags.map((t) => t.match(/^status:(\w+)$/)?.[1]).find((s): s is Status => STATUSES.includes(s as Status));

/** The guide page that explains the levels. */
export const STATUS_GUIDE_ID = 'guides-component-status--docs';
