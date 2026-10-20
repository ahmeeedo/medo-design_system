import { useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Popover,
  Select as AriaSelect,
  SelectStateContext,
  SelectValue,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';

type SelectMode = 'single' | 'multiple';
import { ChevronDown, X } from 'lucide-react';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox } from '../listbox/ListBox';
import { InputAction, type InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { useFitCount } from '../utils/useFitCount';
import '../text-field/input.css';
import '../tag/tag.css';
import './select.css';

export interface SelectProps<T extends object, M extends SelectMode = 'single'>
  extends Omit<AriaSelectProps<T, M>, 'children' | 'className' | 'style' | 'placeholder'> {
  /** Visible label. Always set one. */
  label: ReactNode;
  /** Helper text below the field. Replaced by the error message when invalid. */
  description?: ReactNode;
  /** Error text shown when the field is invalid. Validate on submit or blur, not while open. */
  errorMessage?: ReactNode;
  /** A hint like „Select…“. Never required information. */
  placeholder?: string;
  /** sm 32 · md 40 · lg 48 px. lg on mobile (opens the lg list). */
  size?: InputSize;
  /** Decorative icon before the value. */
  leadingIcon?: ReactNode;
  /** Single only: shows a clear button for optional fields. Multi always has clear-all. */
  clearable?: boolean;
  /** Value can be read and copied but not changed. Not the same as disabled. */
  isReadOnly?: boolean;
  /** Options as data; then pass a render function as children. */
  items?: Iterable<T>;
  /** Option and ListBoxSection elements, or a render function with items. */
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
}

/**
 * Select – choose one or several values from a list (Figma: C08 Select).
 * Built on React Aria Select with a hidden native select: forms, autofill and validation keep working.
 * 2–4 options: Radio. 5–10: Select. More, or users know what to type: Combobox.
 */
export function Select<T extends object, M extends SelectMode = 'single'>({
  label,
  description,
  errorMessage,
  placeholder = 'Select…',
  size = 'md',
  leadingIcon,
  clearable,
  isReadOnly,
  items,
  children,
  className,
  selectionMode,
  ...props
}: SelectProps<T, M>) {
  const multiple = selectionMode === 'multiple';
  const [hasValue, setHasValue] = useState(false);
  /* The popover aligns to the whole field (border incl.), not only the inner trigger button. */
  const fieldRef = useRef<HTMLDivElement>(null);
  return (
    <AriaSelect<T, M>
      {...props}
      selectionMode={selectionMode}
      placeholder={placeholder}
      /* Read-only: never opens. */
      isOpen={isReadOnly ? false : props.isOpen}
      data-readonly={isReadOnly || undefined}
      className={cx(
        'medo-field',
        'medo-select',
        multiple && hasValue && 'medo-select--tags',
        (multiple || clearable) && hasValue && !isReadOnly && !props.isDisabled && 'medo-select--clearable',
        className,
      )}
    >
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      <div ref={fieldRef} className={cx('medo-input', `medo-input--${size}`, 'medo-select__field')}>
        <ReadOnlyKeys isReadOnly={isReadOnly}>
          <AriaButton className="medo-select__trigger">
            {leadingIcon && (
              <span className="medo-input__icon" aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            <SelectValue<T> className="medo-select__value">
              {/* The field shows only the label of the option – no description or option icon (Figma: one line, ellipsis). */}
              {({ defaultChildren, isPlaceholder, selectedText }) => (
                <>
                  {isPlaceholder ? defaultChildren : multiple ? <SelectedTags size={size} /> : selectedText}
                  {isReadOnly && <span className="medo-visually-hidden">, read only</span>}
                </>
              )}
            </SelectValue>
            {!isReadOnly && (
              <span className="medo-select__chevron" aria-hidden="true">
                <ChevronDown />
              </span>
            )}
          </AriaButton>
        </ReadOnlyKeys>
        <ClearButton enabled={(multiple || !!clearable) && !isReadOnly && !props.isDisabled} onHasValue={setHasValue} />
      </div>
      <FieldFooter description={description} errorMessage={errorMessage} />
      <Popover triggerRef={fieldRef} offset={4} className="medo-listbox-popover">
        <ListBox<T> size={size === 'lg' ? 'lg' : 'md'} items={items}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

/** Read-only: blocks type-to-select and arrow keys on the trigger; Tab still moves on. */
function ReadOnlyKeys({ isReadOnly, children }: { isReadOnly?: boolean; children: ReactNode }) {
  if (!isReadOnly) return <>{children}</>;
  const block = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') e.stopPropagation();
  };
  return (
    <div style={{ display: 'contents' }} onKeyDownCapture={block}>
      {children}
    </div>
  );
}

/** Clear (single, optional) or clear-all (multi). Next to the trigger, never inside it. */
function ClearButton({ enabled, onHasValue }: { enabled: boolean; onHasValue: (v: boolean) => void }) {
  const state = useContext(SelectStateContext);
  const hasValue = !!state && (Array.isArray(state.value) ? state.value.length > 0 : state.value != null);
  useLayoutEffect(() => onHasValue(hasValue), [hasValue, onHasValue]);
  const ref = useRef<HTMLSpanElement>(null);
  if (!enabled || !hasValue || !state) return null;
  return (
    <span className="medo-select__clear" ref={ref}>
      <InputAction
        // slot={null}: opts out of the Select's trigger context, so this stays its own button.
        slot={null}
        aria-label={Array.isArray(state.value) ? 'Clear all' : 'Clear selection'}
        icon={<X />}
        onPress={() => {
          state.setValue(Array.isArray(state.value) ? [] : null);
          // The clear button disappears: move focus back to the trigger.
          (ref.current?.parentElement?.querySelector('.medo-select__trigger') as HTMLElement | null)?.focus();
        }}
      />
    </span>
  );
}

/** Selected values as tags in one line; what does not fit becomes „+N“. Screen readers get the full list. */
function SelectedTags({ size }: { size: InputSize }) {
  const state = useContext(SelectStateContext);
  const labels = state?.selectedItems.map((item) => item.textValue) ?? [];
  const key = labels.join('\u0000');
  const rowRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const visible = useFitCount(rowRef, measureRef, key, labels.length);
  const tagClass = cx('medo-tag', size === 'lg' ? 'medo-tag--md' : 'medo-tag--sm');

  const hidden = labels.length - visible;
  return (
    <span className="medo-select__tags" ref={rowRef}>
      <span className="medo-visually-hidden">{labels.join(', ')}</span>
      <span className="medo-select__measure" ref={measureRef} aria-hidden="true">
        {labels.map((label, i) => (
          <span key={i} className={tagClass}>
            {label}
          </span>
        ))}
        <span className={tagClass}>+{labels.length}</span>
      </span>
      {labels.slice(0, visible).map((label, i) => (
        <span key={i} className={tagClass} aria-hidden="true">
          <span className="medo-select__tag-label">{label}</span>
        </span>
      ))}
      {hidden > 0 && (
        <span className={tagClass} aria-hidden="true">
          +{hidden}
        </span>
      )}
    </span>
  );
}
