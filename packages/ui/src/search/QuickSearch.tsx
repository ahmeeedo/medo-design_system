import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { Autocomplete, Button as AriaButton, Dialog, Modal, ModalOverlay, useFilter } from 'react-aria-components';
import { Search } from 'lucide-react';
import { Badge } from '../badge/Badge';
import { Button } from '../button/Button';
import { Link } from '../link/Link';
import { ListBox, OptionHighlightContext } from '../listbox/ListBox';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { SearchField } from './SearchField';
import '../dialog/dialog.css';
import './search.css';

export interface QuickSearchProps<T extends object> {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Opens with Cmd / Ctrl + K (ignored while the user types in another field). */
  shortcut?: boolean;
  /** The search term (controlled) – e.g. to load suggestions from the server. */
  inputValue?: string;
  onInputChange?: (value: string) => void;
  /** Filters the options on the client (contains, case insensitive). Off when the server filters. */
  clientFilter?: boolean;
  /** Empty field: Recent and Suggested. While typing: hits grouped by type (ListBoxSection), max 5 per group. */
  children: ReactNode | ((item: T) => ReactNode);
  items?: Iterable<T>;
  /** Opens the highlighted hit (Enter or click). */
  onAction?: (key: React.Key) => void;
  /** “All results”: the search page with the same term. */
  allResultsHref?: (query: string) => string;
  /** Enter without a highlighted hit, and “Search all content” when nothing matches. */
  onSearch?: (query: string) => void;
  /** Texts (localize). */
  'aria-label'?: string;
  placeholder?: string;
  cancelLabel?: string;
  suggestionsLabel?: string;
  allResultsLabel?: (query: string) => string;
  noResultsLabel?: (query: string) => string;
  searchAllLabel?: (query: string) => string;
  hints?: { navigate: string; open: string; close: string };
}

/**
 * Quick search – find and open pages, files and people from anywhere. A modal with
 * React Aria Autocomplete: focus stays in the field while ↑ ↓ move through the suggestions, Enter opens the
 * highlighted hit, Esc closes and focus returns to the trigger. Desktop: overlay 640 wide · mobile: full screen with Cancel.
 */
export function QuickSearch<T extends object>({
  isOpen,
  defaultOpen,
  onOpenChange,
  shortcut = true,
  inputValue,
  onInputChange,
  clientFilter = false,
  children,
  items,
  onAction,
  allResultsHref,
  onSearch,
  'aria-label': ariaLabel = 'Search',
  placeholder = 'Search pages, files, people …',
  cancelLabel = 'Cancel',
  suggestionsLabel = 'Suggestions',
  allResultsLabel = (q) => `All results for “${q}”`,
  noResultsLabel = (q) => `No results for “${q}”. Check the spelling or try other words.`,
  searchAllLabel = (q) => `Search all content for “${q}”`,
  hints = { navigate: 'Navigate', open: 'Open', close: 'Close' },
}: QuickSearchProps<T>) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const [innerOpen, setInnerOpen] = useState(defaultOpen ?? false);
  const open = isOpen ?? innerOpen;
  const setOpen = (value: boolean) => {
    if (isOpen === undefined) setInnerOpen(value);
    onOpenChange?.(value);
  };
  const [innerQuery, setInnerQuery] = useState('');
  const query = inputValue ?? innerQuery;
  const setQuery = (value: string) => {
    if (inputValue === undefined) setInnerQuery(value);
    onInputChange?.(value);
  };
  const { contains } = useFilter({ sensitivity: 'base' });

  // Cmd / Ctrl + K – not while typing in another field.
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      setOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const term = query.trim();
  const close = () => setOpen(false);
  // The list reports when nothing matches; “Search all content” then sits below it (a button may not live inside a listbox).
  const [empty, setEmpty] = useState(false);

  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={setOpen}
      isDismissable
      className={cx('medo-dialog-overlay', 'medo-quick-search-overlay', mobile && 'medo-quick-search-overlay--mobile')}
    >
      <Modal className={cx('medo-dialog', 'medo-quick-search', mobile && 'medo-quick-search--mobile')}>
        <Dialog aria-label={ariaLabel} className="medo-quick-search__dialog">
          <Autocomplete inputValue={query} onInputChange={setQuery} filter={clientFilter ? contains : undefined}>
            <div className="medo-quick-search__bar">
              <SearchField
                aria-label={ariaLabel}
                placeholder={placeholder}
                size="lg"
                autoFocus
                onSubmit={(value) => value.trim() && onSearch?.(value.trim())}
                // Esc in an empty field closes the dialog; with text it clears first.
                className="medo-quick-search__field"
              />
              {mobile && (
                <Button variant="text" size="lg" onPress={close}>
                  {cancelLabel}
                </Button>
              )}
            </div>
            {/* Scroll region: focusable, so keyboard users can scroll it too (the options use virtual focus). */}
            <div className="medo-quick-search__scroll" tabIndex={0} aria-label={suggestionsLabel} role="region">
              <OptionHighlightContext.Provider value={term}>
                <ListBox<T>
                  aria-label={ariaLabel}
                  size={mobile ? 'lg' : 'md'}
                  items={items}
                  onAction={(key) => {
                    onAction?.(key);
                    close();
                  }}
                  className="medo-quick-search__list"
                  renderEmptyState={() => (term ? <EmptyReporter onChange={setEmpty} message={noResultsLabel(term)} /> : null)}
                >
                  {children}
                </ListBox>
              </OptionHighlightContext.Provider>
              {empty && term && onSearch && (
                <AriaButton className="medo-quick-search__all" onPress={() => onSearch(term)}>
                  <Search aria-hidden="true" />
                  {searchAllLabel(term)}
                </AriaButton>
              )}
            </div>
          </Autocomplete>
          {!mobile && (
            <div className="medo-quick-search__footer">
              <span className="medo-quick-search__hint" aria-hidden="true">
                <Badge size="sm">↑ ↓</Badge>
                {hints.navigate}
              </span>
              <span className="medo-quick-search__hint" aria-hidden="true">
                <Badge size="sm">Enter</Badge>
                {hints.open}
              </span>
              <span className="medo-quick-search__hint" aria-hidden="true">
                <Badge size="sm">Esc</Badge>
                {hints.close}
              </span>
              {term && !empty && allResultsHref && (
                <Link variant="standalone" size="md" arrow href={allResultsHref(term)} className="medo-quick-search__all-results" onPress={close}>
                  {allResultsLabel(term)}
                </Link>
              )}
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

/** Renders the “no results” message and tells QuickSearch that the list is empty. */
function EmptyReporter({ message, onChange }: { message: string; onChange: (empty: boolean) => void }) {
  useLayoutEffect(() => {
    onChange(true);
    return () => onChange(false);
  }, [onChange]);
  return (
    <p role="status" className="medo-quick-search__message">
      {message}
    </p>
  );
}
