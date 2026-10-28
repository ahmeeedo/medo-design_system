import type { ReactNode } from 'react';
import { Button as AriaButton, Input as AriaInput, SearchField as AriaSearchField, type SearchFieldProps as AriaSearchFieldProps } from 'react-aria-components';
import { Search, X } from 'lucide-react';
import { FieldFooter, FieldLabel } from '../field/Field';
import type { InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, 'children' | 'className' | 'style'> {
  /** Visible label. Without it set `aria-label` (e.g. in a table toolbar or the header). */
  label?: ReactNode;
  /** Helper text below the field. */
  description?: ReactNode;
  /** A hint like “Search invoices”. Never the only label. */
  placeholder?: string;
  /** sm 32 (toolbars) · md 40 · lg 48 (search page, Quick search, mobile). */
  size?: InputSize;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  className?: string;
}

/**
 * Search field – a text field for a search term. Built on React Aria
 * SearchField: Enter submits (`onSubmit`), Esc or × clears. Put it in a `<search>` element (search landmark);
 * keep the term in the field after searching.
 */
export function SearchField({ label, description, placeholder, size = 'md', clearLabel, className, ...props }: SearchFieldProps) {
  const m = useMessages();
  return (
    <AriaSearchField {...props} className={cx('medo-field', 'medo-search-field', className)}>
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <div className={cx('medo-input', `medo-input--${size}`)}>
        <span className="medo-input__icon" aria-hidden="true">
          <Search />
        </span>
        <AriaInput className="medo-input__control" placeholder={placeholder} />
        {/* React Aria keeps it out of the tab order – Esc clears from the field. */}
        <AriaButton aria-label={clearLabel ?? m.searchField.clear} className="medo-input__action medo-search-field__clear">
          <X />
        </AriaButton>
      </div>
      {description && <FieldFooter description={description} />}
    </AriaSearchField>
  );
}
