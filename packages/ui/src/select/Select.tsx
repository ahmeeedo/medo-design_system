import { useContext, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Popover,
  Select as AriaSelect,
  SelectStateContext,
  SelectValue,
  type Key,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import { ChevronDown, X } from 'lucide-react';
import { BottomSheetPopover } from '../bottom-sheet/BottomSheet';
import { Button } from '../button/Button';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox } from '../listbox/ListBox';
import { InputAction, type InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { useFitCount } from '../utils/useFitCount';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';

type SelectMode = 'single' | 'multiple';
type ValueOf<M extends SelectMode> = M extends 'multiple' ? Key[] : Key | null;

/** Where the options open. auto: popover on desktop; below 640 px native picker (single) or Bottom Sheet (multi). */
export type SelectOverlay = 'auto' | 'popover' | 'sheet' | 'native';

export interface SelectProps<T extends object, M extends SelectMode = 'single'> extends Omit<AriaSelectProps<T, M>, 'children' | 'className' | 'style' | 'placeholder'> {
  /** Visible label. Without it set `aria-label` – only where the context names the field (filter bars, toolbars). */
  label?: ReactNode;
  /** Helper text below the field. Replaced by the error message when invalid. */
  description?: ReactNode;
  /** Error text shown when the field is invalid. Validate on submit or blur, not while open. */
  errorMessage?: ReactNode;
  /** A hint like “Select…”. Never required information. */
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
  /** auto (default) · popover · sheet (Bottom Sheet) · native (system picker, single only). */
  overlay?: SelectOverlay;
  /**
   * Multi: what happens with the selection. live (forms): it is the value, nothing else happens.
   * onClose (filters, reloads): `onApply` runs once when the list closes – any way – and only if the selection changed.
   */
  commit?: 'live' | 'onClose';
  /** commit="onClose": apply the selection (load results, write the URL …). */
  onApply?: (value: ValueOf<M>) => void;
  /** commit="onClose": label of the primary sheet button, ideally with the live result count (“Show 128 results”). */
  resultLabel?: (value: ValueOf<M>) => ReactNode;
  className?: string;
}

/**
 * Select – choose one or several values from a list.
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
  overlay = 'auto',
  commit = 'live',
  onApply,
  resultLabel = () => 'Show results',
  className,
  selectionMode,
  ...props
}: SelectProps<T, M>) {
  const multiple = selectionMode === 'multiple';
  const mobile = useMediaQuery(MOBILE_QUERY);
  const mode = overlay === 'auto' ? (mobile ? (multiple ? 'sheet' : 'native') : 'popover') : overlay === 'native' && multiple ? 'sheet' : overlay;
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
      {label && <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>}
      <div ref={fieldRef} className={cx('medo-input', `medo-input--${size}`, 'medo-select__field')}>
        <ReadOnlyKeys isReadOnly={isReadOnly}>
          {/* With the native picker the invisible <select> on top takes focus and taps; the button only shows the value. */}
          <AriaButton className="medo-select__trigger" excludeFromTabOrder={mode === 'native'} aria-hidden={mode === 'native' || undefined}>
            {leadingIcon && (
              <span className="medo-input__icon" aria-hidden="true">
                {leadingIcon}
              </span>
            )}
            <SelectValue<T> className="medo-select__value">
              {/* The field shows only the label of the option – no description or option icon (one line, ellipsis). */}
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
        {mode === 'native' && !isReadOnly && <NativePicker label={label ?? props['aria-label']} placeholder={placeholder} isRequired={props.isRequired} />}
        <ClearButton enabled={(multiple || !!clearable) && !isReadOnly && !props.isDisabled} onHasValue={setHasValue} />
      </div>
      <FieldFooter description={description} errorMessage={errorMessage} />
      {commit === 'onClose' && onApply && <ApplyOnClose onApply={onApply as (value: Key[] | Key | null) => void} />}
      {mode === 'sheet' ? (
        <BottomSheetPopover
          title={label ?? props['aria-label']}
          footer={multiple ? <SheetFooter commit={commit} resultLabel={resultLabel as (value: Key[] | Key | null) => ReactNode} /> : undefined}
        >
          <ListBox<T> size="lg" items={items}>
            {children}
          </ListBox>
        </BottomSheetPopover>
      ) : (
        <Popover triggerRef={fieldRef} offset={4} className="medo-listbox-popover">
          <ListBox<T> size={size === 'lg' ? 'lg' : 'md'} items={items}>
            {children}
          </ListBox>
        </Popover>
      )}
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

/** Selected values as tags in one line; what does not fit becomes “+N”. Screen readers get the full list. */
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

/**
 * Mobile, single: an invisible native <select> over the field opens the system picker.
 * The options come from the Select's collection; the change goes into the same state.
 */
function NativePicker({ label, placeholder, isRequired }: { label: ReactNode; placeholder: string; isRequired?: boolean }) {
  const state = useContext(SelectStateContext);
  if (!state) return null;
  const keys = new Map<string, Key>();
  const option = (key: Key) => {
    const node = state.collection.getItem(key);
    if (!node || node.type !== 'item') return null;
    keys.set(String(key), key);
    return (
      <option key={String(key)} value={String(key)} disabled={state.selectionManager.isDisabled(key)}>
        {node.textValue}
      </option>
    );
  };
  const value = state.value == null || Array.isArray(state.value) ? '' : String(state.value);
  return (
    <select
      className="medo-select__native"
      aria-label={typeof label === 'string' ? label : undefined}
      required={isRequired}
      value={value}
      onChange={(e) => state.setValue(e.target.value === '' ? null : (keys.get(e.target.value) ?? e.target.value))}
    >
      <option value="" disabled={isRequired}>
        {placeholder}
      </option>
      {[...state.collection].map((node) =>
        node.type === 'section' ? (
          <optgroup key={String(node.key)} label={node.textValue || node['aria-label'] || ''}>
            {[...state.collection.getChildren!(node.key)].map((child) => option(child.key))}
          </optgroup>
        ) : (
          option(node.key)
        ),
      )}
    </select>
  );
}

/** Sheet footer for multi: live → “3 selected” + Done · onClose → result button + Reset below (thumb reach). */
function SheetFooter({ commit, resultLabel }: { commit: 'live' | 'onClose'; resultLabel: (value: Key[] | Key | null) => ReactNode }) {
  const state = useContext(SelectStateContext);
  if (!state) return null;
  const count = Array.isArray(state.value) ? state.value.length : state.value == null ? 0 : 1;
  return commit === 'onClose' ? (
    <>
      <Button size="lg" onPress={() => state.close()}>
        {resultLabel(state.value as Key[])}
      </Button>
      <Button size="lg" variant="secondary" onPress={() => state.setValue([])} isDisabled={count === 0}>
        Reset
      </Button>
    </>
  ) : (
    <>
      <p className="medo-sheet__count" aria-live="polite">
        {count} selected
      </p>
      <Button size="lg" onPress={() => state.close()}>
        Done
      </Button>
    </>
  );
}

/** commit="onClose": calls onApply once when the list closes (any way), if the selection changed while open. */
function ApplyOnClose({ onApply }: { onApply: (value: Key[] | Key | null) => void }) {
  const state = useContext(SelectStateContext);
  const opened = useRef<string | null>(null);
  const isOpen = !!state?.isOpen;
  useEffect(() => {
    if (!state) return;
    const snapshot = JSON.stringify(state.value);
    if (isOpen) opened.current = snapshot;
    else if (opened.current !== null) {
      if (opened.current !== snapshot) onApply(state.value as Key[]);
      opened.current = null;
    }
    // Only the open/close transition matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  return null;
}
