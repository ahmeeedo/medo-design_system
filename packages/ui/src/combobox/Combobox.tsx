import { useContext, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Collection,
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  Group,
  Input,
  Popover,
  type ComboBoxProps as AriaComboBoxProps,
  type Key,
} from 'react-aria-components';
import { ChevronDown, Plus, X } from 'lucide-react';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox, ListBoxMessage, ListBoxSection, Option } from '../listbox/ListBox';
import { Tag, TagGroup } from '../tag/Tag';
import { InputAction, type InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { useFitCount } from '../utils/useFitCount';
import '../text-field/input.css';
import '../tag/tag.css';
import './combobox.css';

type ComboMode = 'single' | 'multiple';
type Value = Key | null | Key[];

/** Key of the „Add …“ row. Never stored as a value. */
const CREATE_KEY = '__medo_create__';

export interface ComboboxProps<T extends object, M extends ComboMode = 'single'>
  extends Omit<AriaComboBoxProps<T, M>, 'children' | 'className' | 'style' | 'placeholder' | 'menuTrigger'> {
  /** Visible label. Always set one. */
  label: ReactNode;
  /** Helper text below the field. Replaced by the error message when invalid. */
  description?: ReactNode;
  /** Error text shown when the field is invalid. */
  errorMessage?: ReactNode;
  /** A hint like „Search…“. */
  placeholder?: string;
  /** sm 32 · md 40 · lg 48 px. lg on mobile. */
  size?: InputSize;
  /** Decorative icon before the text, e.g. a search icon. */
  leadingIcon?: ReactNode;
  /** Server search: shows a loading row (previous results stay) and marks the list busy. */
  isLoading?: boolean;
  /** Empty list text. Default: „No results for „…““. */
  noResultsMessage?: (inputValue: string) => ReactNode;
  /** Multi only: shows an „Add …“ row for text without an exact match. Return the key of the new item to select it. */
  onCreate?: (text: string) => Key | void;
  /** Option and ListBoxSection elements, or a render function with items / defaultItems. */
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
}

/**
 * Combobox – a Select you can type into; typing filters the list (Figma: C09 Combobox).
 * Built on React Aria ComboBox: opens on typing, arrow down or the chevron – never on focus.
 * Contains-match, case and accent insensitive; the first match is highlighted, Enter picks it.
 * Leaving without a selection restores the last valid value.
 * Local data: `defaultItems` (filtered here). Server data: `items` + `inputValue` / `onInputChange` + `isLoading`.
 */
export function Combobox<T extends object, M extends ComboMode = 'single'>({
  label,
  description,
  errorMessage,
  placeholder = 'Search…',
  size = 'md',
  leadingIcon,
  isLoading,
  noResultsMessage = (text) => (text ? `No results for „${text}“` : 'No results'),
  onCreate,
  children,
  className,
  selectionMode,
  value: valueProp,
  defaultValue,
  onChange,
  onInputChange,
  ...props
}: ComboboxProps<T, M>) {
  const multiple = selectionMode === 'multiple';
  const groupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const entryRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef('');
  const [text, setText] = useState('');
  const [exact, setExact] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Own value state, so the „Add …“ row can be intercepted before it becomes a value.
  const [inner, setInner] = useState<Value>((defaultValue as Value) ?? (multiple ? [] : null));
  const value = (valueProp !== undefined ? valueProp : inner) as Value;
  const setValue = (next: Value) => {
    if (valueProp === undefined) setInner(next);
    (onChange as ((v: Value) => void) | undefined)?.(next);
  };

  const handleChange = (next: Value) => {
    if (Array.isArray(next) && next.includes(CREATE_KEY)) {
      const rest = next.filter((k) => k !== CREATE_KEY);
      const created = onCreate?.(textRef.current.trim());
      setValue(created != null ? [...rest, created] : rest);
      return;
    }
    setValue(next);
  };

  // Click on the free space of the field puts the caret into the input.
  const focusInput = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  return (
    <AriaComboBox<T, M>
      {...(props as AriaComboBoxProps<T, M>)}
      selectionMode={selectionMode}
      value={value as never}
      onChange={handleChange as never}
      onInputChange={(text) => {
        textRef.current = text;
        setText(text.trim());
        onInputChange?.(text);
      }}
      menuTrigger="input"
      allowsEmptyCollection
      className={cx('medo-field', 'medo-combobox', className)}
    >
      <FieldLabel isRequired={props.isRequired}>{label}</FieldLabel>
      <Group ref={groupRef} className={cx('medo-input', `medo-input--${size}`, 'medo-combobox__field')} onMouseDown={focusInput}>
        {leadingIcon && (
          <span className="medo-input__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {multiple ? (
          /* Tags and input share one line; the tags get what is left after 4 rem for typing. */
          <span className="medo-combobox__entry" ref={entryRef}>
            <SelectedTags entryRef={entryRef} size={size} label={label} isDisabled={props.isDisabled} isReadOnly={props.isReadOnly} />
            <ComboInput ref={inputRef} placeholder={placeholder} multiple onRemoved={setAnnouncement} />
          </span>
        ) : (
          <ComboInput ref={inputRef} placeholder={placeholder} multiple={false} onRemoved={setAnnouncement} />
        )}
        <ClearButton inputRef={inputRef} isDisabled={props.isDisabled || props.isReadOnly} />
        {!props.isReadOnly && (
          <AriaButton className="medo-input__action medo-combobox__toggle">
            <ChevronDown aria-hidden="true" />
          </AriaButton>
        )}
      </Group>
      <FieldFooter description={description} errorMessage={errorMessage} />
      <span className="medo-visually-hidden" aria-live="polite">
        {announcement}
      </span>
      <Popover offset={4} className="medo-listbox-popover">
        <ComboList<T>
          size={size}
          items={props.items ?? props.defaultItems}
          isLoading={isLoading}
          noResultsMessage={noResultsMessage}
          creatable={multiple && !!onCreate}
          text={text}
          exact={exact}
          onExactChange={setExact}
        >
          {children}
        </ComboList>
      </Popover>
    </AriaComboBox>
  );
}

/** Text input. Multi: Backspace in the empty input removes the last value. */
function ComboInput({
  ref,
  placeholder,
  multiple,
  onRemoved,
}: {
  ref: React.Ref<HTMLInputElement>;
  placeholder: string;
  multiple: boolean;
  onRemoved: (message: string) => void;
}) {
  const state = useContext(ComboBoxStateContext);
  const values = Array.isArray(state?.value) ? state.value : [];
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!multiple || !state || e.key !== 'Backspace' || state.inputValue !== '' || values.length === 0) return;
    const last = state.selectedItems.at(-1);
    state.setValue(values.slice(0, -1));
    if (last) onRemoved(`${last.textValue} removed`);
  };
  return (
    <Input
      ref={ref}
      className="medo-input__control medo-combobox__input"
      // Multi with values: the placeholder would compete with the tags.
      placeholder={multiple && values.length > 0 ? undefined : placeholder}
      onKeyDown={onKeyDown}
    />
  );
}

/** Clears text and value. Visible with text or a value. Beside the toggle, never inside another button. */
function ClearButton({ inputRef, isDisabled }: { inputRef: React.RefObject<HTMLInputElement | null>; isDisabled?: boolean }) {
  const state = useContext(ComboBoxStateContext);
  if (!state || isDisabled) return null;
  const hasValue = Array.isArray(state.value) ? state.value.length > 0 : state.value != null;
  if (!hasValue && !state.inputValue) return null;
  return (
    <InputAction
      // slot={null}: not the ComboBox's own toggle button.
      slot={null}
      excludeFromTabOrder
      aria-label={Array.isArray(state.value) ? 'Clear all' : 'Clear'}
      icon={<X />}
      onPress={() => {
        state.setValue(Array.isArray(state.value) ? [] : null);
        state.setInputValue('');
        inputRef.current?.focus();
      }}
    />
  );
}

/** Multi: chosen values as removable tags in one line, the rest as „+N“; the caret sits after them. */
function SelectedTags({
  entryRef,
  size,
  label,
  isDisabled,
  isReadOnly,
}: {
  entryRef: React.RefObject<HTMLSpanElement | null>;
  size: InputSize;
  label: ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}) {
  const state = useContext(ComboBoxStateContext);
  const items = (state?.selectedItems ?? []).filter(Boolean);
  const values = Array.isArray(state?.value) ? state.value : [];
  const key = items.map((item) => item.key).join('\u0000');
  const measureRef = useRef<HTMLSpanElement>(null);
  // Keeps room for the text input (4 rem + gap) next to the tags.
  const visible = useFitCount(entryRef, measureRef, key, items.length, 68);
  if (!state || items.length === 0) return null;
  const tagSize = size === 'lg' ? 'md' : 'sm';
  const hidden = items.length - visible;
  const name = typeof label === 'string' ? label : 'Selected';

  return (
    <span className="medo-combobox__tags-row">
      <span className={cx('medo-combobox__measure')} ref={measureRef} aria-hidden="true">
        {items.map((item) => (
          <span key={item.key} className={cx('medo-tag', `medo-tag--${tagSize}`)} data-allows-removing="">
            <span className="medo-tag__label">{item.textValue}</span>
            <span className="medo-tag__remove" />
          </span>
        ))}
        <span className={cx('medo-tag', `medo-tag--${tagSize}`)}>+{items.length}</span>
      </span>
      <TagGroup
        aria-label={`${name}: selected`}
        size={tagSize}
        className="medo-combobox__tags"
        items={items.slice(0, visible)}
        disabledKeys={isDisabled ? items.map((item) => item.key) : undefined}
        onRemove={isReadOnly ? undefined : (keys) => state.setValue(values.filter((k) => !keys.has(k)))}
      >
        {(item) => <Tag id={item.key}>{item.textValue}</Tag>}
      </TagGroup>
      {hidden > 0 && (
        <span className={cx('medo-tag', `medo-tag--${tagSize}`, 'medo-combobox__more')}>
          +{hidden}
          <span className="medo-visually-hidden"> more selected</span>
        </span>
      )}
    </span>
  );
}

/**
 * The list: options, optional „Add …“ row, empty message and loading row.
 * Note: React Aria builds the collection from these children before the ComboBox state exists,
 * so everything inside the ListBox depends on props (`text`, `exact`), never on the state.
 */
function ComboList<T extends object>({
  size,
  items,
  isLoading,
  noResultsMessage,
  creatable,
  text,
  exact,
  onExactChange,
  children,
}: {
  size: InputSize;
  items?: Iterable<T>;
  isLoading?: boolean;
  noResultsMessage: (inputValue: string) => ReactNode;
  creatable: boolean;
  text: string;
  exact: boolean;
  onExactChange: (exact: boolean) => void;
  children: ReactNode | ((item: T) => ReactNode);
}) {
  const state = useContext(ComboBoxStateContext);
  const nodes = state ? [...state.collection].filter((node) => node.key !== CREATE_KEY) : [];
  const hasItems = nodes.length > 0;
  const exactNow = nodes.some((node) => node.textValue.toLocaleLowerCase() === text.toLocaleLowerCase());
  useEffect(() => {
    if (state && exactNow !== exact) onExactChange(exactNow);
  });

  // „First match ready“: while typing, the first enabled option is highlighted, so Enter picks it.
  const typing = !!state?.isOpen && text !== '';
  useEffect(() => {
    if (!state || !typing) return;
    // After React Aria's own update (it resets the focused option on every input change).
    const frame = requestAnimationFrame(() => {
      const manager = state.selectionManager;
      let key = state.collection.getFirstKey();
      while (key != null) {
        const node = state.collection.getItem(key);
        if (node?.type === 'item' && !manager.isDisabled(key)) break;
        key = state.collection.getKeyAfter(key);
      }
      if (key == null) return;
      manager.setFocused(true);
      if (manager.focusedKey !== key) manager.setFocusedKey(key);
    });
    return () => cancelAnimationFrame(frame);
    // Re-run when the filter result changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing, text, state?.collection]);

  return (
    <>
      <ListBox<T>
        size={size === 'lg' ? 'lg' : 'md'}
        renderEmptyState={() => <ListBoxMessage>{isLoading ? 'Loading…' : noResultsMessage(text)}</ListBoxMessage>}
      >
        {typeof children === 'function' ? <Collection items={items}>{children}</Collection> : children}
        {creatable && text && !exact && (
          <ListBoxSection aria-label="Create">
            <Option id={CREATE_KEY} icon={<Plus />} textValue={text}>
              {`Add „${text}“`}
            </Option>
          </ListBoxSection>
        )}
      </ListBox>
      {/* Server search: previous results stay, the loading row sits below them. */}
      {isLoading && hasItems && <ListBoxMessage>Loading…</ListBoxMessage>}
    </>
  );
}
