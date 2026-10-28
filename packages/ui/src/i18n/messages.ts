/**
 * Built-in texts of the components: button labels, screen-reader names, announcements, validation messages.
 * One object per language (en.ts, de.ts). TypeScript checks that every language has every text with the
 * right parameters. A component prop (e.g. `closeLabel`) always wins over these defaults.
 */
export interface Messages {
  common: {
    close: string;
    cancel: string;
    back: string;
    more: string;
    done: string;
    search: string;
    showResults: string;
    loading: string;
    clear: string;
    clearAll: string;
    noResults: string;
    noResultsFor: (query: string) => string;
    /** Name of a chosen value list: “Assignee: selected”. */
    selected: (name: string) => string;
    /** Announcement after removing values: “Design removed”. */
    removed: (labels: string[]) => string;
    /** Combobox: row that creates a new value. */
    add: (text: string) => string;
    create: string;
    reset: string;
    /** Sheet footer: “3 selected”. */
    countSelected: (count: number) => string;
    /** Fallback name of chosen values without a text label. */
    selectedValues: string;
  };
  /** Key names in shortcuts (⌘, ⇧ and Alt are the same everywhere). */
  keys: { control: string };
  accordion: { expandAll: string; collapseAll: string };
  alert: { dismiss: string };
  avatar: {
    status: Record<'online' | 'away' | 'busy' | 'offline', string>;
    unknownPerson: string;
    unknownOrganization: string;
    more: (count: number) => string;
  };
  breadcrumbs: { label: string; more: (count: number) => string };
  bulkActionBar: { label: string; count: (count: number) => string; clear: string; more: string };
  calendar: {
    previousMonth: string;
    nextMonth: string;
    previousYear: string;
    nextYear: string;
    previousYears: string;
    nextYears: string;
    chooseMonth: (title: string) => string;
    chooseYear: (year: string) => string;
    weekNumber: string;
  };
  datePicker: {
    openCalendar: string;
    time: string;
    presets: string;
    beforeMin: (date: string) => string;
    afterMax: (date: string) => string;
    unavailable: string;
    reversed: string;
    today: string;
    yesterday: string;
    last7Days: string;
    last14Days: string;
    last30Days: string;
    thisMonth: string;
    lastMonth: string;
    availableTimes: string;
  };
  dialog: { discardTitle: string; discardDescription: string; discardAction: string; discardCancel: string };
  embed: {
    video: EmbedMessages;
    map: EmbedMessages;
    generic: EmbedMessages;
    privacy: string;
  };
  list: { notIncluded: string };
  listView: { unread: string };
  navigation: {
    skipToContent: string;
    main: string;
    app: string;
    menu: string;
    collapse: string;
    expand: string;
  };
  pagination: {
    label: string;
    summary: (from: number, to: number, total: number) => string;
    pageSize: string;
    previous: string;
    next: string;
    page: (page: number) => string;
    pageOf: (page: number, total: number) => string;
  };
  quickSearch: {
    placeholder: string;
    suggestions: string;
    allResults: (query: string) => string;
    noResults: (query: string) => string;
    searchAll: (query: string) => string;
    navigate: string;
    open: string;
  };
  searchField: { clear: string };
  select: { placeholder: string; clearSelection: string };
  combobox: { placeholder: string };
  slider: { minimum: (label: string) => string; maximum: (label: string) => string };
  table: { columns: string; showColumns: string };
  textField: {
    counter: (count: number, limit: number) => string;
    tooMany: (over: number) => string;
    /** Announcement after a pause. */
    charactersLeft: (left: number) => string;
    charactersTooMany: (over: number) => string;
  };
  upload: {
    title: string;
    dropTitle: string;
    chooseFiles: string;
    chooseFile: string;
    listLabel: string;
    cancel: (name: string) => string;
    remove: (name: string) => string;
    retry: (name: string) => string;
    retryShort: string;
    uploading: (name: string) => string;
    progress: (loaded: string, total: string, percent: number) => string;
    typeNotAllowed: (names: string, types: string) => string;
    tooLarge: (size: string, max: string) => string;
    tooMany: (max: number) => string;
    uploaded: (name: string) => string;
    failed: (name: string, error: string) => string;
  };
}

/** Texts of the Embed consent for one type. provider: the service (“Example Video”), to: who receives the data (“Example Inc.”). */
export interface EmbedMessages {
  title: string;
  body: (provider: string | undefined, to: string | undefined) => string;
  bodyCompact: (provider: string | undefined, company: string | undefined, to: string | undefined) => string;
  load: string;
  remember: (provider: string | undefined) => string;
}
