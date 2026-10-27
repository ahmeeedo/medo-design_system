import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList,
  Text,
  type Key,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps,
  type TagProps as AriaTagProps,
} from 'react-aria-components';
import { Check, X } from 'lucide-react';
import { FieldLabel } from '../field/Field';
import { cx } from '../utils/cx';
import './tag.css';

type TagSize = 'sm' | 'md';
const TagSizeContext = createContext<TagSize>('md');

export interface TagGroupProps<T> extends Omit<AriaTagGroupProps, 'children' | 'className' | 'style'> {
  /** Visible label. Without it, set aria-label. */
  label?: ReactNode;
  /** Helper text below the tags. */
  description?: ReactNode;
  /** sm 24 px · md 32 px. Follows the field size (Select sm/md → sm, lg/mobile → md). */
  size?: TagSize;
  /** Tags, or a render function together with `items`. */
  children: TagListProps<T>['children'];
  items?: Iterable<T>;
  /** Shown when there are no tags. */
  renderEmptyState?: () => ReactNode;
  /** Text announced after a removal. Default: “{label} removed”. */
  removedMessage?: (labels: string[]) => string;
  className?: string;
}

/**
 * Tag group – a labelled list of tags. Built on React Aria TagGroup:
 * arrow keys move between tags, Backspace/Delete removes, Space/Enter toggles a filter.
 *
 * Two roles, never mixed in one group:
 * - removable values: pass `onRemove`
 * - filters: pass `selectionMode="multiple"` (or "single"). Click again to deselect.
 */
export function TagGroup<T extends object>({
  label,
  description,
  size = 'md',
  children,
  items,
  renderEmptyState,
  onRemove,
  removedMessage = (labels) => `${labels.join(', ')} removed`,
  className,
  ...props
}: TagGroupProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState('');

  // Removals are announced politely, so screen reader users know it worked.
  const handleRemove =
    onRemove &&
    ((keys: Set<Key>) => {
      const labels = [...keys].map(
        (key) => ref.current?.querySelector(`[data-key="${CSS.escape(String(key))}"] .medo-tag__label`)?.textContent ?? String(key),
      );
      onRemove(keys);
      setAnnouncement(removedMessage(labels));
    });

  return (
    <AriaTagGroup {...props} ref={ref} onRemove={handleRemove} className={cx('medo-field', 'medo-field--group', className)}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <TagSizeContext.Provider value={size}>
        <TagList items={items} renderEmptyState={renderEmptyState} className="medo-tag-list">
          {children}
        </TagList>
      </TagSizeContext.Provider>
      {description && (
        <div className="medo-field__footer">
          <Text slot="description" className="medo-field__description">
            {description}
          </Text>
        </div>
      )}
      <span className="medo-visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </AriaTagGroup>
  );
}

export interface TagProps extends Omit<AriaTagProps, 'children' | 'className'> {
  /** Short label; long text is truncated at 200 px. */
  children: ReactNode;
  /** Leading icon (decorative). A selected filter shows a check instead. */
  icon?: ReactNode;
  className?: string;
}

/** A single tag inside a TagGroup. */
export function Tag({ children, icon, textValue, className, ...props }: TagProps) {
  const size = useContext(TagSizeContext);
  return (
    <AriaTag
      {...props}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={({ selectionMode }) =>
        cx('medo-tag', `medo-tag--${size}`, selectionMode !== 'none' && 'medo-tag--selectable', className)
      }
    >
      {({ allowsRemoving, isSelected, selectionMode }) => (
        <>
          {selectionMode !== 'none' && isSelected ? (
            <span className="medo-tag__icon" aria-hidden="true">
              <Check />
            </span>
          ) : (
            icon && (
              <span className="medo-tag__icon" aria-hidden="true">
                {icon}
              </span>
            )
          )}
          <span className="medo-tag__label">{children}</span>
          {allowsRemoving && (
            <AriaButton slot="remove" className="medo-tag__remove">
              <X aria-hidden="true" />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  );
}
