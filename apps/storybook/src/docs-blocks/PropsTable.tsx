/**
 * Playground props table, built from our own components (replaces Storybook's Controls block).
 *
 * Reads the story's argTypes (incl. the controls Storybook infers from the types) and its current args,
 * and talks to the preview through Storybook's public events:
 *   STORY_ARGS_UPDATED  args changed (by us, the toolbar or a play function)
 *   UPDATE_STORY_ARGS   set one arg
 *   RESET_STORY_ARGS    back to the story's initial args
 *
 * Controls follow the design system rules:
 *   boolean                  Switch
 *   2–4 options (radio)      RadioGroup, horizontal
 *   5+ options or select     Select
 *   check                    CheckboxGroup, horizontal
 *   text / color / date      TextField
 *   number                   NumberField · range: Slider
 *   object / array           TextField multiline (JSON, applied on blur)
 *   no control               “–”
 * Every control is named by its property (aria-label); the row header shows the same name.
 */
import { useContext, useEffect, useMemo, useState } from 'react';
import type { ModuleExport } from 'storybook/internal/types';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from 'storybook/internal/core-events';
import { includeConditionalArg } from 'storybook/internal/csf';
import { DocsContext, useOf } from '@storybook/addon-docs/blocks';
import { RotateCcw } from 'lucide-react';
import {
  Badge,
  Checkbox,
  CheckboxGroup,
  IconButton,
  NumberField,
  Option,
  Radio,
  RadioGroup,
  Select,
  Slider,
  StaticTable,
  Switch,
  TextField,
} from '@med-o/ui';
import { Rich, Tok } from './text';

type Args = Record<string, unknown>;
type Control = { type?: string; disable?: boolean; labels?: Record<string, string>; min?: number; max?: number; step?: number };
type ArgType = {
  name: string;
  description?: string;
  control?: false | string | Control;
  options?: readonly unknown[];
  mapping?: Record<string, unknown>;
  if?: unknown;
  type?: { name?: string; required?: boolean; value?: unknown };
  table?: { disable?: boolean; category?: string; type?: { summary?: string }; defaultValue?: { summary?: string } };
};
type Filter = string[] | RegExp | undefined;

/** Up to this many options a RadioGroup, more: a Select (design system rule). */
const MAX_RADIOS = 4;

const matches = (filter: Filter, name: string) => (Array.isArray(filter) ? filter.includes(name) : filter instanceof RegExp ? filter.test(name) : false);

function controlOf(argType: ArgType): Control | undefined {
  const { control } = argType;
  if (control === false || control === undefined) return undefined;
  const c = typeof control === 'string' ? { type: control } : control;
  return c.disable || !c.type ? undefined : c;
}

/* ---------- args of a story, live ---------- */

function useStoryArgs(storyId: string, initial: Args) {
  const context = useContext(DocsContext);
  const [args, setArgs] = useState<Args>(initial);
  useEffect(() => {
    const onUpdated = ({ storyId: id, args: next }: { storyId: string; args: Args }) => {
      if (id === storyId) setArgs(next);
    };
    context.channel.on(STORY_ARGS_UPDATED, onUpdated);
    return () => context.channel.off(STORY_ARGS_UPDATED, onUpdated);
  }, [context.channel, storyId]);
  const update = (updatedArgs: Args) => context.channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs });
  const reset = () => context.channel.emit(RESET_STORY_ARGS, { storyId });
  return { args, update, reset };
}

/* ---------- table ---------- */

export function PropsTable({ of }: { of: ModuleExport }) {
  const context = useContext(DocsContext);
  const { story } = useOf(of, ['story']);
  const storyContext = context.getStoryContext(story);
  const { args, update, reset } = useStoryArgs(story.id, storyContext.args);
  const { include, exclude } = (story.parameters.controls ?? {}) as { include?: Filter; exclude?: Filter };

  const groups = useMemo(() => {
    const visible = (Object.values(story.argTypes) as ArgType[]).filter(
      (a) => !a.table?.disable && (!include || matches(include, a.name)) && !matches(exclude, a.name),
    );
    const byCategory = new Map<string, ArgType[]>();
    for (const a of visible) {
      const key = a.table?.category ?? '';
      byCategory.set(key, [...(byCategory.get(key) ?? []), a]);
    }
    // Uncategorised props first, then the categories in their order of appearance.
    return [...byCategory].sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : 0));
  }, [story.argTypes, include, exclude]);

  if (!groups.length) return null;

  return (
    <StaticTable className="doc-props" caption="Properties" captionHidden>
      <thead>
        <tr>
          <th scope="col">Property</th>
          <th scope="col">Description</th>
          <th scope="col">Default</th>
          <th scope="col">
            <span className="doc-props-control-head">
              Control
              <IconButton size="sm" icon={<RotateCcw />} aria-label="Reset controls" onPress={reset} />
            </span>
          </th>
        </tr>
      </thead>
      {groups.map(([category, argTypes]) => (
        <tbody key={category || 'props'}>
          {category ? (
            <tr className="doc-props-group">
              <th scope="colgroup" colSpan={4}>
                {category}
              </th>
            </tr>
          ) : null}
          {argTypes
            .filter((a) => includeConditionalArg(a as Parameters<typeof includeConditionalArg>[0], args, storyContext.globals))
            .map((a) => (
              <PropRow key={a.name} argType={a} value={args[a.name]} onChange={(v) => update({ [a.name]: v })} />
            ))}
        </tbody>
      ))}
    </StaticTable>
  );
}

function PropRow({ argType, value, onChange }: { argType: ArgType; value: unknown; onChange: (value: unknown) => void }) {
  // Storybook fills table.type for docgen props only; plain types (boolean, function …) come as type.name.
  const typeName = argType.type?.name;
  const type = argType.table?.type?.summary ?? (typeName && typeName !== 'other' ? typeName : undefined);
  const fallback = argType.table?.defaultValue?.summary;
  return (
    <tr>
      <th scope="row">
        <span className="doc-props-name">
          <Tok>{argType.name}</Tok>
          {argType.type?.required ? (
            <Badge size="sm" tone="neutral">
              Required
            </Badge>
          ) : null}
        </span>
      </th>
      <td>
        <div className="doc-props-desc">
          {argType.description ? <span>{<Rich>{argType.description}</Rich>}</span> : null}
          {type ? <span className="doc-props-type">{type}</span> : null}
        </div>
      </td>
      <td className="doc-props-default">{fallback ? <Tok>{fallback}</Tok> : <span className="doc-muted">–</span>}</td>
      <td className="doc-props-control">
        <PropControl argType={argType} value={value} onChange={onChange} />
      </td>
    </tr>
  );
}

/* ---------- one control ---------- */

function PropControl({ argType, value, onChange }: { argType: ArgType; value: unknown; onChange: (value: unknown) => void }) {
  const control = controlOf(argType);
  const name = argType.name;
  if (!control) return <span className="doc-muted">–</span>;

  const options = (argType.options ?? (argType.type?.name === 'enum' ? (argType.type.value as unknown[]) : undefined)) as unknown[] | undefined;

  // Options are addressed by index, so numbers, booleans and mapped keys (slot()) all work.
  // With a mapping the args may hold the mapped value: find its key.
  const indexOf = (v: unknown) => {
    const direct = options?.findIndex((o) => o === v) ?? -1;
    if (direct >= 0 || !argType.mapping) return direct;
    return options?.findIndex((o) => argType.mapping?.[String(o)] === v) ?? -1;
  };
  const label = (o: unknown) => control.labels?.[String(o)] ?? String(o);

  switch (control.type) {
    case 'boolean':
      return (
        <Switch isSelected={Boolean(value)} onChange={onChange}>
          <span className="medo-visually-hidden">{name}</span>
        </Switch>
      );

    case 'radio':
    case 'inline-radio':
    case 'select':
      if (!options?.length) break;
      if (control.type !== 'select' && options.length <= MAX_RADIOS) {
        return (
          <RadioGroup aria-label={name} orientation="horizontal" value={String(indexOf(value))} onChange={(i) => onChange(options[Number(i)])}>
            {options.map((o, i) => (
              <Radio key={i} value={String(i)}>
                {label(o)}
              </Radio>
            ))}
          </RadioGroup>
        );
      }
      return (
        <Select
          aria-label={name}
          overlay="popover"
          value={indexOf(value) >= 0 ? String(indexOf(value)) : null}
          onChange={(i) => i !== null && onChange(options[Number(i)])}
          placeholder="Choose…"
        >
          {options.map((o, i) => (
            <Option key={i} id={String(i)}>
              {label(o)}
            </Option>
          ))}
        </Select>
      );

    case 'check':
    case 'inline-check':
    case 'multi-select': {
      if (!options?.length) break;
      const selected = Array.isArray(value) ? value.map((v) => String(indexOf(v))) : [];
      return (
        <CheckboxGroup aria-label={name} orientation="horizontal" value={selected} onChange={(keys) => onChange(keys.map((i) => options[Number(i)]))}>
          {options.map((o, i) => (
            <Checkbox key={i} value={String(i)}>
              {label(o)}
            </Checkbox>
          ))}
        </CheckboxGroup>
      );
    }

    case 'number':
      return (
        <NumberField
          aria-label={name}
          value={typeof value === 'number' ? value : NaN}
          minValue={control.min}
          maxValue={control.max}
          step={control.step}
          onChange={(n) => onChange(Number.isNaN(n) ? undefined : n)}
        />
      );

    case 'range':
      return (
        <Slider
          aria-label={name}
          value={typeof value === 'number' ? value : (control.min ?? 0)}
          minValue={control.min ?? 0}
          maxValue={control.max ?? 100}
          step={control.step ?? 1}
          onChange={(n) => onChange(n)}
        />
      );

    case 'object':
      return <JsonControl name={name} value={value} onChange={onChange} />;
  }

  // text, color, date and anything else: a text field.
  return <TextField aria-label={name} value={value == null ? '' : String(value)} onChange={onChange} />;
}

/** Objects and arrays as JSON. Applied on blur, so typing never breaks the story half-way. */
function JsonControl({ name, value, onChange }: { name: string; value: unknown; onChange: (value: unknown) => void }) {
  const text = toJson(value);
  if (text === null) return <span className="doc-muted">–</span>;
  return <JsonField name={name} text={text} onChange={onChange} />;
}

/** JSON text, or null when the value cannot be shown as JSON (React elements, functions, cycles). */
function toJson(value: unknown) {
  if (value === undefined) return '';
  try {
    return JSON.stringify(value, (_key, v) => {
      if (typeof v === 'function' || (v && typeof v === 'object' && '$$typeof' in v)) throw new Error('not JSON');
      return v;
    }, 2);
  } catch {
    return null;
  }
}

function JsonField({ name, text, onChange }: { name: string; text: string; onChange: (value: unknown) => void }) {
  const [draft, setDraft] = useState(text);
  const [invalid, setInvalid] = useState(false);
  useEffect(() => setDraft(text), [text]);
  return (
    <TextField
      aria-label={name}
      multiline
      value={draft}
      isInvalid={invalid}
      errorMessage="Not valid JSON."
      onChange={(v) => {
        setDraft(v);
        setInvalid(false);
      }}
      onBlur={() => {
        if (draft.trim() === '') return onChange(undefined);
        try {
          onChange(JSON.parse(draft));
        } catch {
          setInvalid(true);
        }
      }}
    />
  );
}
