import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import {
  Button as AriaButton,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList,
  TooltipTriggerStateContext,
  type TooltipTriggerState,
  Text,
  type Key,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps,
  type TagProps as AriaTagProps,
} from 'react-aria-components';
import { Check, X } from 'lucide-react';
import { FieldLabel } from '../field/Field';
import { Tooltip } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

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
  removedMessage: removedMessageProp,
  className,
  ...props
}: TagGroupProps<T>) {
  const m = useMessages();
  const removedMessage = removedMessageProp ?? m.common.removed;
  const ref = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState('');

  // Removals are announced politely, so screen reader users know it worked.
  const handleRemove =
    onRemove &&
    ((keys: Set<Key>) => {
      const labels = [...keys].map((key) => ref.current?.querySelector(`[data-key="${CSS.escape(String(key))}"] .medo-tag__label`)?.textContent ?? String(key));
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
  /** Short label. Over 200 px it is cut; the full label shows in a tooltip on hover and focus. */
  children: ReactNode;
  /** Leading icon (decorative). A selected filter shows a check instead. */
  icon?: ReactNode;
  className?: string;
}

/** A single tag inside a TagGroup. */
export function Tag({ children, icon, textValue, className, ...props }: TagProps) {
  const size = useContext(TagSizeContext);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <AriaTag
      {...props}
      ref={ref}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={({ selectionMode }) => cx('medo-tag', `medo-tag--${size}`, selectionMode !== 'none' && 'medo-tag--selectable', className)}
    >
      {({ allowsRemoving, isSelected, selectionMode, isHovered, isFocused }) => (
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
          <TagLabel tag={ref} hovered={isHovered} focused={isFocused}>
            {children}
          </TagLabel>
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

/**
 * The label. Cut at 200 px, it shows in full in a tooltip on hover (after 500 ms, like every Tooltip) and on focus
 * (a tap focuses the tag); Esc hides it. Screen readers already get the full name – the tooltip is hidden from them.
 */
const OPEN: TooltipTriggerState = { isOpen: true, open: () => {}, close: () => {}, shouldSkipAnimation: false };

function TagLabel({ tag, hovered, focused, children }: { tag: RefObject<HTMLDivElement | null>; hovered: boolean; focused: boolean; children: ReactNode }) {
  const label = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useLayoutEffect(() => {
    const el = label.current;
    if ((hovered || focused) && el) setCut(el.scrollWidth > el.clientWidth + 1);
    if (!hovered && !focused) setDismissed(false);
  }, [hovered, focused]);
  useEffect(() => {
    if (!hovered) return setHoverOpen(false);
    const timer = setTimeout(() => setHoverOpen(true), 500);
    return () => clearTimeout(timer);
  }, [hovered]);
  useEffect(() => {
    const el = tag.current;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDismissed(true);
    el?.addEventListener('keydown', onKey);
    return () => el?.removeEventListener('keydown', onKey);
  }, [tag]);
  return (
    <>
      <span ref={label} className="medo-tag__label">
        {children}
      </span>
      {cut && !dismissed && (hoverOpen || focused) && (
        // Inside a TagGroup there is no TooltipTrigger: the tooltip gets its open state here.
        <TooltipTriggerStateContext.Provider value={OPEN}>
          <Tooltip triggerRef={tag} isOpen aria-hidden>
            {children}
          </Tooltip>
        </TooltipTriggerStateContext.Provider>
      )}
    </>
  );
}
