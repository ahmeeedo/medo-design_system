import { useContext, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import {
  Autocomplete,
  Button as AriaButton,
  Collection,
  CollectionBuilder,
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  Group,
  Input,
  Popover,
  TextField as AriaTextField,
  useFilter,
  type ComboBoxProps as AriaComboBoxProps,
  type Key,
  type Selection,
} from 'react-aria-components';
import { ChevronDown, CircleAlert, Plus, Search, X } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { Button } from '../button/Button';
import { FieldFooter, FieldLabel } from '../field/Field';
import { ListBox, ListBoxMessage, ListBoxSection, OptionHighlightContext, Option } from '../listbox/ListBox';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import { Tag, TagGroup } from '../tag/Tag';
import { InputAction, type InputSize } from '../text-field/TextField';
import { cx } from '../utils/cx';
import { useFitCount } from '../utils/useFitCount';

type ComboMode = 'single' | 'multiple';
type Value = Key | null | Key[];

/** Key of the “Add …” row. Never stored as a value. */
const CREATE_KEY = '__medo_create__';

export interface ComboboxProps<T extends object, M extends ComboMode = 'single'>
  extends Omit<AriaComboBoxProps<T, M>, 'children' | 'className' | 'style' | 'placeholder' | 'menuTrigger'> {
  /** Visible label. Always set one. */
  label: ReactNode;
  /** Helper text below the field. Replaced by the error message when invalid. */
  description?: ReactNode;
  /** Error text shown when the field is invalid. */
  errorMessage?: ReactNode;
  /** A hint like “Search…”. */
  placeholder?: string;
  /** sm 32 · md 40 · lg 48 px. lg on mobile. */
  size?: InputSize;
  /** Decorative icon before the text, e.g. a search icon. */
  leadingIcon?: ReactNode;
  /** Server search: shows a loading row (previous results stay) and marks the list busy. */
  isLoading?: boolean;
  /** Empty list text. Default: “No results for “…””. */
  noResultsMessage?: (inputValue: string) => ReactNode;
  /** Multi only: shows an “Add …” row for text without an exact match. Return the key of the new item to select it. */
  onCreate?: (text: string) => Key | void;
  /** Option and ListBoxSection elements, or a render function with items / defaultItems. */
  children: ReactNode | ((item: T) => ReactNode);
  /** auto (default): popover on desktop, Bottom Sheet with search below 640 px · popover · sheet. */
  overlay?: 'auto' | 'popover' | 'sheet';
  /** Multi in the sheet: live (forms, footer “Done”) · onClose (filters: onApply once when the sheet closes, if changed). */
  commit?: 'live' | 'onClose';
  /** commit="onClose": apply the selection (load results, write the URL …). */
  onApply?: (value: Key[]) => void;
  /** commit="onClose": label of the primary sheet button, ideally with the live result count. */
  resultLabel?: (value: Key[]) => ReactNode;
  className?: string;
}

/**
 * Combobox – a Select you can type into; typing filters the list.
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
  noResultsMessage = (text) => (text ? `No results for “${text}”` : 'No results'),
  onCreate,
  children,
  overlay = 'auto',
  commit = 'live',
  onApply,
  resultLabel = () => 'Show results',
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

  // Own value state, so the “Add …” row can be intercepted before it becomes a value.
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

  const mobile = useMediaQuery(MOBILE_QUERY);
  if (overlay === 'sheet' || (overlay === 'auto' && mobile)) {
    return (
      <ComboboxSheet<T>
        {...{
          label,
          description,
          errorMessage,
          placeholder,
          size,
          leadingIcon,
          isLoading,
          noResultsMessage,
          onCreate,
          children,
          className,
        }}
        multiple={multiple}
        value={value}
        onValueChange={handleChange}
        textRef={textRef}
        items={props.items}
        defaultItems={props.defaultItems}
        inputValue={props.inputValue}
        onInputChange={onInputChange}
        isDisabled={props.isDisabled}
        isReadOnly={props.isReadOnly}
        isInvalid={props.isInvalid}
        isRequired={props.isRequired}
        name={props.name}
        commit={commit}
        onApply={onApply}
        resultLabel={resultLabel}
      />
    );
  }

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

/** Multi: chosen values as removable tags in one line, the rest as “+N”; the caret sits after them. */
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
 * The list: options, optional “Add …” row, empty message and loading row.
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

  // “First match ready”: while typing, the first enabled option is highlighted, so Enter picks it.
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
              {`Add “${text}”`}
            </Option>
          </ListBoxSection>
        )}
      </ListBox>
      {/* Server search: previous results stay, the loading row sits below them. */}
      {isLoading && hasItems && <ListBoxMessage>Loading…</ListBoxMessage>}
    </>
  );
}

/* ---------- Mobile: Bottom Sheet with search ---------- */

interface ComboboxSheetProps<T> {
  label: ReactNode;
  description?: ReactNode;
  errorMessage?: ReactNode;
  placeholder: string;
  size: InputSize;
  leadingIcon?: ReactNode;
  isLoading?: boolean;
  noResultsMessage: (inputValue: string) => ReactNode;
  onCreate?: (text: string) => Key | void;
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
  multiple: boolean;
  value: Value;
  onValueChange: (value: Value) => void;
  textRef: React.RefObject<string>;
  items?: Iterable<T>;
  defaultItems?: Iterable<T>;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  commit: 'live' | 'onClose';
  onApply?: (value: Key[]) => void;
  resultLabel: (value: Key[]) => ReactNode;
}

/**
 * Below 640 px the field becomes a button that opens a Bottom Sheet: search on top (fixed 90 % height,
 * so it does not jump with the keyboard), options lg, single closes on tap, multi with Done or result button.
 */
function ComboboxSheet<T extends object>({
  label,
  description,
  errorMessage,
  placeholder,
  size,
  leadingIcon,
  isLoading,
  noResultsMessage,
  onCreate,
  children,
  className,
  multiple,
  value,
  onValueChange,
  textRef,
  items,
  defaultItems,
  inputValue,
  onInputChange,
  isDisabled,
  isReadOnly,
  isInvalid,
  isRequired,
  name,
  commit,
  onApply,
  resultLabel,
}: ComboboxSheetProps<T>) {
  const id = useId();
  const [isOpen, setOpen] = useState(false);
  const [ownSearch, setOwnSearch] = useState('');
  const search = inputValue ?? ownSearch;
  const setSearch = (text: string) => {
    textRef.current = text;
    if (inputValue === undefined) setOwnSearch(text);
    onInputChange?.(text);
  };
  const { contains } = useFilter({ sensitivity: 'base' });
  const list = items ?? defaultItems;
  const keys = Array.isArray(value) ? value : value == null ? [] : [value];
  const opened = useRef<string | null>(null);

  const query = search.trim();
  const content = typeof children === 'function' ? <Collection items={list}>{children}</Collection> : children;

  const open = (next: boolean) => {
    if (next) {
      setSearch('');
      opened.current = JSON.stringify(keys);
    } else if (commit === 'onClose' && multiple && opened.current !== null && opened.current !== JSON.stringify(keys)) {
      onApply?.(keys);
    }
    if (!next) opened.current = null;
    setOpen(next);
  };

  const onSelectionChange = (selection: Selection) => {
    const next = selection === 'all' ? [] : [...selection];
    if (multiple) {
      onValueChange(next);
    } else {
      // Tapping the chosen option again deselects it in the list: keep the value, just close (single closes on tap).
      onValueChange(next[0] ?? value);
      open(false);
    }
  };

  const descId = description ? `${id}-desc` : undefined;
  const errId = isInvalid && errorMessage ? `${id}-err` : undefined;

  // The field shows the labels of the chosen values: React Aria builds the collection from the options
  // without rendering them, the same way the Select gets its labels.
  return (
    <CollectionBuilder content={content}>
      {(collection) => {
        const nodes = [...collection.getKeys()].map((key) => collection.getItem(key)).filter((node) => node?.type === 'item');
        const text = keys.map((key) => collection.getItem(key)?.textValue ?? String(key));
        const exact = nodes.some((node) => node!.textValue.toLocaleLowerCase() === query.toLocaleLowerCase());
        return (
          <div
            className={cx('medo-field', 'medo-combobox', 'medo-select', multiple && keys.length > 0 && 'medo-select--tags', className)}
            data-invalid={isInvalid || undefined}
            data-disabled={isDisabled || undefined}
            data-readonly={isReadOnly || undefined}
            data-open={isOpen || undefined}
          >
            <span className="medo-field__label" id={`${id}-label`}>
              {label}
              {isRequired && (
                <span className="medo-field__required" aria-hidden="true">
                  *
                </span>
              )}
            </span>
            <div className={cx('medo-input', `medo-input--${size}`, 'medo-select__field')}>
              <AriaButton
                className="medo-select__trigger"
                isDisabled={isDisabled}
                aria-haspopup="dialog"
                aria-labelledby={`${id}-label ${id}-value`}
                aria-describedby={[errId ?? descId].filter(Boolean).join(' ') || undefined}
                onPress={() => !isReadOnly && open(true)}
              >
                {leadingIcon && (
                  <span className="medo-input__icon" aria-hidden="true">
                    {leadingIcon}
                  </span>
                )}
                <span className="medo-select__value" id={`${id}-value`} data-placeholder={keys.length === 0 || undefined}>
                  {keys.length === 0 ? placeholder : multiple ? <DisplayTags labels={text} size={size} /> : text[0]}
                  {isReadOnly && <span className="medo-visually-hidden">, read only</span>}
                </span>
                {!isReadOnly && (
                  <span className="medo-select__chevron" aria-hidden="true">
                    <ChevronDown />
                  </span>
                )}
              </AriaButton>
            </div>
            <div className="medo-field__footer">
              {isInvalid && errorMessage ? (
                <span className="medo-field__error" id={errId}>
                  <CircleAlert aria-hidden="true" />
                  <span>{errorMessage}</span>
                </span>
              ) : (
                description && (
                  <span className="medo-field__description" id={descId}>
                    {description}
                  </span>
                )
              )}
            </div>
            {name && keys.map((key) => <input key={String(key)} type="hidden" name={name} value={String(key)} />)}

            <BottomSheet
              title={label}
              height="full"
              isOpen={isOpen}
              onOpenChange={open}
              footer={
                multiple
                  ? commit === 'onClose'
                    ? (close) => (
                        <>
                          <Button size="lg" onPress={close}>
                            {resultLabel(keys)}
                          </Button>
                          <Button size="lg" variant="secondary" onPress={() => onValueChange([])} isDisabled={keys.length === 0}>
                            Reset
                          </Button>
                        </>
                      )
                    : (close) => (
                        <>
                          <p className="medo-sheet__count" aria-live="polite">
                            {keys.length} selected
                          </p>
                          <Button size="lg" onPress={close}>
                            Done
                          </Button>
                        </>
                      )
                  : undefined
              }
            >
              <Autocomplete inputValue={search} onInputChange={setSearch} filter={items ? undefined : contains}>
                <div className="medo-sheet__search">
                  <AriaTextField aria-label="Search" autoFocus className="medo-input medo-input--lg">
                    <span className="medo-input__icon" aria-hidden="true">
                      <Search />
                    </span>
                    <Input className="medo-input__control" placeholder={placeholder} />
                  </AriaTextField>
                </div>
                <OptionHighlightContext.Provider value={query}>
                  <ListBox<T>
                    size="lg"
                    aria-labelledby={`${id}-label`}
                    selectionMode={multiple ? 'multiple' : 'single'}
                          selectedKeys={keys}
                    onSelectionChange={onSelectionChange}
                    renderEmptyState={() => <ListBoxMessage>{isLoading ? 'Loading…' : noResultsMessage(query)}</ListBoxMessage>}
                  >
                    {content}
                    {multiple && onCreate && query && !exact && (
                      <ListBoxSection aria-label="Create">
                        <Option id={CREATE_KEY} icon={<Plus />} textValue={query}>
                          {`Add “${query}”`}
                        </Option>
                      </ListBoxSection>
                    )}
                  </ListBox>
                </OptionHighlightContext.Provider>
                {isLoading && list && [...list].length > 0 && <ListBoxMessage>Loading…</ListBoxMessage>}
              </Autocomplete>
            </BottomSheet>
          </div>
        );
      }}
    </CollectionBuilder>
  );
}

/** Chosen values as display-only tags in one line (inside the trigger button: no remove buttons). */
function DisplayTags({ labels, size }: { labels: string[]; size: InputSize }) {
  const rowRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const visible = useFitCount(rowRef, measureRef, labels.join('\u0000'), labels.length);
  const tagClass = cx('medo-tag', size === 'lg' ? 'medo-tag--md' : 'medo-tag--sm');
  return (
    <span className="medo-select__tags" ref={rowRef}>
      <span className="medo-visually-hidden">{labels.join(', ')}</span>
      <span className="medo-select__measure" ref={measureRef} aria-hidden="true">
        {labels.map((l, i) => (
          <span key={i} className={tagClass}>
            {l}
          </span>
        ))}
        <span className={tagClass}>+{labels.length}</span>
      </span>
      {labels.slice(0, visible).map((l, i) => (
        <span key={i} className={tagClass} aria-hidden="true">
          <span className="medo-select__tag-label">{l}</span>
        </span>
      ))}
      {labels.length > visible && (
        <span className={tagClass} aria-hidden="true">
          +{labels.length - visible}
        </span>
      )}
    </span>
  );
}
