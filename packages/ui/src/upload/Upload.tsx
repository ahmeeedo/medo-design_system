import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Button as AriaButton,
  DropZone,
  FileTrigger as AriaFileTrigger,
  Text,
  useLocale,
  type DropZoneProps as AriaDropZoneProps,
  type FileDropItem,
} from 'react-aria-components';
import { CircleAlert, CircleCheck, CloudUpload, FileText, Image as ImageIcon, RotateCw, Trash2, Upload, X } from 'lucide-react';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { IconTile } from '../empty-state/EmptyState';
import { ProgressBar } from '../progress/Progress';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import '../utils/utilities.css';
import '../field/field.css';
import '../empty-state/empty-state.css';
import './upload.css';

/* ---------- Helpers ---------- */

const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

function unitOf(bytes: number) {
  let i = 0;
  let value = bytes;
  while (value >= 1000 && i < units.length - 1) {
    value /= 1000;
    i++;
  }
  return { value, i, digits: i < 2 ? 0 : 1 };
}

/** „2.4 MB“, „860 kB“ – decimal units like the operating systems' file dialogs. */
export function formatBytes(bytes: number, locale = 'en-US') {
  const { value, i, digits } = unitOf(bytes);
  return new Intl.NumberFormat(locale, { style: 'unit', unit: units[i], unitDisplay: 'short', maximumFractionDigits: digits }).format(value);
}

/** „1.6“ when both values share the unit („1.6 of 2.4 MB“), else the full size („860 kB“). */
function formatLoaded(loaded: number, total: number, locale: string) {
  const a = unitOf(loaded);
  if (a.i !== unitOf(total).i) return formatBytes(loaded, locale);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: a.digits }).format(a.value);
}

/** Accept list as for <input accept>: „.pdf“, „image/*“, „application/pdf“. */
function isAccepted(file: File, accepted?: string[]) {
  if (!accepted?.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accepted.some((a) => {
    const rule = a.trim().toLowerCase();
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/* ---------- File name (truncates in the middle) ---------- */

/**
 * The start shrinks and gets the „…“, the last 12 characters (incl. extension) always stay visible.
 * No measuring: two spans and CSS. The full name is the accessible text and the hover title.
 */
function FileName({ name, className }: { name: string; className?: string }) {
  const keep = 12;
  const start = name.length > keep + 4 ? name.slice(0, -keep) : name;
  const end = name.length > keep + 4 ? name.slice(-keep) : '';
  return (
    <span className={cx('medo-file-name', className)}>
      <span className="medo-visually-hidden">{name}</span>
      <span className="medo-file-name__visual" title={name} aria-hidden="true">
        <span className="medo-file-name__start">{start}</span>
        {end && <span className="medo-file-name__end">{end}</span>}
      </span>
    </span>
  );
}

/* ---------- Types and texts ---------- */

export interface UploadFile {
  /** Stable id (e.g. crypto.randomUUID() when the file is added). */
  id: string;
  name: string;
  /** Size in bytes. */
  size: number;
  /** MIME type. image/* with a `previewUrl` shows a thumbnail, everything else a type icon. */
  type?: string;
  status: 'uploading' | 'done' | 'error';
  /** Uploaded bytes (ProgressEvent.loaded). Without it the bar is indeterminate. */
  loaded?: number;
  /** What happened and how to fix it („Upload interrupted. Check your connection and retry.“). No error codes. */
  error?: string;
  /** Thumbnail (URL.createObjectURL(file) or the server URL). */
  previewUrl?: string;
  /** false hides „Retry“ (e.g. the server rejected the file). Default true. */
  canRetry?: boolean;
}

export interface UploadTexts {
  /** Dropzone and trigger. */
  title: string;
  dropTitle: string;
  chooseFiles: string;
  chooseFile: string;
  listLabel: string;
  /** File actions – always name the file. */
  cancel: (name: string) => string;
  remove: (name: string) => string;
  retry: (name: string) => string;
  retryShort: string;
  /** Name of the progress bar. */
  uploading: (name: string) => string;
  /** „1.6 of 2.4 MB · 64 %“ */
  progress: (loaded: string, total: string, percent: number) => string;
  /** Validation (Figma: Validation table). */
  typeNotAllowed: (names: string, types: string) => string;
  tooLarge: (size: string, max: string) => string;
  tooMany: (max: number) => string;
  /** Polite announcements. */
  uploaded: (name: string) => string;
  failed: (name: string, error: string) => string;
}

export const defaultUploadTexts: UploadTexts = {
  title: 'Drag and drop files here',
  dropTitle: 'Drop files to upload',
  chooseFiles: 'Choose files',
  chooseFile: 'Choose file',
  listLabel: 'Uploaded files',
  cancel: (name) => `Cancel upload of ${name}`,
  remove: (name) => `Remove ${name}`,
  retry: (name) => `Retry ${name}`,
  retryShort: 'Retry',
  uploading: (name) => `Uploading ${name}`,
  progress: (loaded, total, percent) => `${loaded} of ${total} · ${percent} %`,
  typeNotAllowed: (names, types) => `${names} ${names.includes(',') ? 'are' : 'is'} not allowed.${types ? ` Use ${types}.` : ''}`,
  tooLarge: (size, max) => `File is ${size} – max. ${max} allowed`,
  tooMany: (max) => `You can add up to ${max} files. Remove one to add another.`,
  uploaded: (name) => `${name} uploaded`,
  failed: (name, error) => `${name}: ${error}`,
};

interface ItemActions {
  onRemove: (id: string) => void;
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  texts?: Partial<UploadTexts>;
}

const isImage = (file: UploadFile) => !!file.previewUrl && (!file.type || file.type.startsWith('image/'));
const percentOf = (file: UploadFile) => (file.loaded != null && file.size > 0 ? Math.min(100, Math.round((file.loaded / file.size) * 100)) : undefined);

/* ---------- File item (row) ---------- */

export interface FileItemProps extends ItemActions {
  file: UploadFile;
  className?: string;
}

/**
 * File item – one file in the upload list (Figma: C33 File item). Uploading: progress + cancel · Done: size +
 * remove · Error: the reason + retry + remove. Images show a 40 px thumbnail, other files a type icon.
 */
export function FileItem({ file, onRemove, onCancel, onRetry, texts: own, className }: FileItemProps) {
  const t = { ...defaultUploadTexts, ...own };
  const { locale } = useLocale();
  const percent = percentOf(file);
  const size = formatBytes(file.size, locale);

  let meta: ReactNode;
  if (file.status === 'uploading') {
    meta = (
      <>
        <span className="medo-file-item__meta">{percent != null ? t.progress(formatLoaded(file.loaded ?? 0, file.size, locale), size, percent) : size}</span>
        <ProgressBar
          size="sm"
          showValue={false}
          aria-label={t.uploading(file.name)}
          value={percent}
          isIndeterminate={percent == null}
          className="medo-file-item__progress"
        />
      </>
    );
  } else {
    const error = file.status === 'error';
    meta = (
      <span className={cx('medo-file-item__meta', error && 'medo-file-item__meta--error')}>
        {error ? <CircleAlert aria-hidden="true" /> : <CircleCheck aria-hidden="true" className="medo-file-item__done" />}
        <span>{error ? file.error : size}</span>
      </span>
    );
  }

  return (
    <div className={cx('medo-file-item', `medo-file-item--${file.status}`, className)}>
      {isImage(file) ? (
        <img className="medo-file-item__thumb" src={file.previewUrl} alt="" />
      ) : (
        <span className="medo-file-item__icon" aria-hidden="true">
          {file.type?.startsWith('image/') ? <ImageIcon /> : <FileText />}
        </span>
      )}
      <div className="medo-file-item__content">
        <FileName name={file.name} className="medo-file-item__name" />
        {meta}
      </div>
      <div className="medo-file-item__actions">
        {file.status === 'uploading' && <IconButton size="sm" icon={<X />} aria-label={t.cancel(file.name)} onPress={() => (onCancel ?? onRemove)(file.id)} />}
        {file.status === 'error' && onRetry && file.canRetry !== false && (
          <IconButton size="sm" icon={<RotateCw />} aria-label={t.retry(file.name)} onPress={() => onRetry(file.id)} />
        )}
        {file.status !== 'uploading' && (
          <IconButton size="sm" icon={file.status === 'done' ? <Trash2 /> : <X />} aria-label={t.remove(file.name)} onPress={() => onRemove(file.id)} />
        )}
      </div>
    </div>
  );
}

/* ---------- File tile (grid, images) ---------- */

export interface FileTileProps extends ItemActions {
  file: UploadFile;
  className?: string;
}

/**
 * File tile – an image in the grid view (Figma: C33 File tile). Uploading: dark overlay with % and bar ·
 * Done: remove top right · Error: danger border, the overlay retries, the caption names the problem.
 */
export function FileTile({ file, onRemove, onCancel, onRetry, texts: own, className }: FileTileProps) {
  const t = { ...defaultUploadTexts, ...own };
  const percent = percentOf(file);
  const retry = file.status === 'error' && onRetry && file.canRetry !== false;

  return (
    <div className={cx('medo-file-tile', `medo-file-tile--${file.status}`, className)}>
      <div className="medo-file-tile__media">
        {file.previewUrl ? (
          <img className="medo-file-tile__image" src={file.previewUrl} alt="" />
        ) : (
          <span className="medo-file-tile__placeholder" aria-hidden="true">
            <ImageIcon />
          </span>
        )}
        {file.status === 'uploading' && (
          <div className="medo-file-tile__overlay">
            <span className="medo-file-tile__percent" aria-hidden="true">
              {percent != null ? `${percent} %` : ''}
            </span>
            <ProgressBar
              size="sm"
              showValue={false}
              aria-label={t.uploading(file.name)}
              value={percent}
              isIndeterminate={percent == null}
              className="medo-file-tile__progress"
            />
          </div>
        )}
        {file.status === 'error' &&
          (retry ? (
            <AriaButton className="medo-file-tile__overlay medo-file-tile__retry" aria-label={t.retry(file.name)} onPress={() => onRetry(file.id)}>
              <CircleAlert aria-hidden="true" />
              <span aria-hidden="true">{t.retryShort}</span>
            </AriaButton>
          ) : (
            <div className="medo-file-tile__overlay" aria-hidden="true">
              <CircleAlert />
            </div>
          ))}
        <IconButton
          variant="media"
          size="sm"
          icon={<X />}
          aria-label={file.status === 'uploading' ? t.cancel(file.name) : t.remove(file.name)}
          onPress={() => (file.status === 'uploading' ? (onCancel ?? onRemove) : onRemove)(file.id)}
          className="medo-file-tile__remove"
        />
      </div>
      {file.status === 'error' ? (
        <span className="medo-file-tile__caption medo-file-tile__caption--error">
          <span className="medo-visually-hidden">{file.name}: </span>
          {file.error}
        </span>
      ) : (
        <FileName name={file.name} className="medo-file-tile__caption" />
      )}
    </div>
  );
}

/* ---------- Dropzone ---------- */

interface PickerProps {
  /** Accepted types as for <input accept>: [„.pdf“, „image/*“]. Checked again before upload. */
  acceptedFileTypes?: string[];
  /** Several files at once. Default true. */
  allowsMultiple?: boolean;
  /** Mobile: open the camera first („environment“ = back camera). */
  defaultCamera?: 'user' | 'environment';
  isDisabled?: boolean;
  /** Types, size and count – shown before the user picks a file. */
  hint?: ReactNode;
  /** Validation or required message. Never only by color. */
  errorMessage?: ReactNode;
  onSelect: (files: File[]) => void;
  texts?: Partial<UploadTexts>;
  className?: string;
}

export interface DropzoneProps extends PickerProps {
  /** Ids of elements that also name the zone (the field label). */
  'aria-labelledby'?: string;
}

type DropEvent = Parameters<NonNullable<AriaDropZoneProps['onDrop']>>[0];

async function filesFrom(e: DropEvent) {
  const items = e.items.filter((i): i is FileDropItem => i.kind === 'file');
  return Promise.all(items.map((i) => i.getFile()));
}

/**
 * Dropzone – drag and drop files or choose them (Figma: C33 Dropzone). Built on React Aria DropZone +
 * FileTrigger: the button always opens the system picker (drag and drop is only a shortcut, WCAG 2.5.7),
 * the zone is focusable for paste (Ctrl+V). Below 640 px use the FileTrigger instead.
 */
export function Dropzone({
  acceptedFileTypes,
  allowsMultiple = true,
  defaultCamera,
  isDisabled,
  hint,
  errorMessage,
  onSelect,
  texts: own,
  className,
  ...props
}: DropzoneProps) {
  const t = { ...defaultUploadTexts, ...own };
  const hintId = useId();
  const errorId = useId();
  return (
    <DropZone
      aria-labelledby={props['aria-labelledby']}
      isDisabled={isDisabled}
      onDrop={async (e) => onSelect(await filesFrom(e))}
      className={cx('medo-dropzone', !!errorMessage && 'medo-dropzone--invalid', className)}
    >
      {({ isDropTarget }) => (
        <>
          <IconTile size="md">
            <CloudUpload />
          </IconTile>
          <Text slot="label" className="medo-dropzone__title" aria-disabled={isDisabled || undefined}>
            {isDropTarget ? t.dropTitle : t.title}
          </Text>
          <AriaFileTrigger
            acceptedFileTypes={acceptedFileTypes}
            allowsMultiple={allowsMultiple}
            defaultCamera={defaultCamera}
            onSelect={(list) => list && onSelect([...list])}
          >
            <Button
              variant="secondary"
              size="sm"
              isDisabled={isDisabled}
              className="medo-dropzone__button medo-upload__choose"
              aria-describedby={[hint && hintId, errorMessage && errorId].filter(Boolean).join(' ') || undefined}
            >
              {allowsMultiple ? t.chooseFiles : t.chooseFile}
            </Button>
          </AriaFileTrigger>
          {hint && (
            <span id={hintId} className="medo-dropzone__hint" aria-disabled={isDisabled || undefined}>
              {hint}
            </span>
          )}
          {errorMessage && (
            <span id={errorId} className="medo-field__error medo-dropzone__error">
              <CircleAlert aria-hidden="true" />
              <span>{errorMessage}</span>
            </span>
          )}
        </>
      )}
    </DropZone>
  );
}

/* ---------- File trigger (compact) ---------- */

export interface FileTriggerProps extends PickerProps {
  label?: ReactNode;
  /** Visual marker; check „at least one file“ on submit and pass `errorMessage`. */
  isRequired?: boolean;
}

/**
 * File trigger – compact upload for forms and mobile (Figma: C33 File trigger): label, Button secondary with
 * upload icon, hint, error. The system picker offers camera, photos and files on touch devices.
 */
export function FileTrigger({
  label,
  isRequired,
  acceptedFileTypes,
  allowsMultiple = true,
  defaultCamera,
  isDisabled,
  hint,
  errorMessage,
  onSelect,
  texts: own,
  className,
}: FileTriggerProps) {
  const t = { ...defaultUploadTexts, ...own };
  const labelId = useId();
  const buttonId = useId();
  const hintId = useId();
  const errorId = useId();
  return (
    <div className={cx('medo-field', 'medo-file-trigger', className)}>
      {label && (
        <span id={labelId} className="medo-field__label">
          {label}
          {isRequired && (
            <span className="medo-field__required" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
      <div>
        <AriaFileTrigger
          acceptedFileTypes={acceptedFileTypes}
          allowsMultiple={allowsMultiple}
          defaultCamera={defaultCamera}
          onSelect={(list) => list && onSelect([...list])}
        >
          <Button
            id={buttonId}
            variant="secondary"
            startIcon={<Upload />}
            isDisabled={isDisabled}
            className="medo-upload__choose"
            aria-labelledby={label ? `${labelId} ${buttonId}` : undefined}
            aria-describedby={[hint && hintId, errorMessage && errorId].filter(Boolean).join(' ') || undefined}
          >
            {allowsMultiple ? t.chooseFiles : t.chooseFile}
          </Button>
        </AriaFileTrigger>
      </div>
      {(hint || errorMessage) && (
        <div className="medo-field__footer">
          {hint && !errorMessage && (
            <span id={hintId} className="medo-field__description">
              {hint}
            </span>
          )}
          {errorMessage && (
            <span id={errorId} className="medo-field__error">
              <CircleAlert aria-hidden="true" />
              <span>{errorMessage}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Upload field (composition) ---------- */

export interface UploadFieldProps extends Omit<ItemActions, 'texts'> {
  /** Visible label. Without it set `aria-label`. */
  label?: ReactNode;
  'aria-label'?: string;
  /** The files – controlled. The app uploads them (fetch, S3, tus …) and updates status and `loaded`. */
  files: UploadFile[];
  /** Files that passed type, size and count. Start the upload right away. */
  onAdd: (files: File[]) => void;
  /**
   * auto: Dropzone + list, below 640 px the File trigger (default) · list · compact (File trigger + list, forms) ·
   * grid (images only: tiles; below 640 px with the File trigger).
   */
  layout?: 'auto' | 'list' | 'compact' | 'grid';
  acceptedFileTypes?: string[];
  /** Readable form of the types for hint and message („PDF, JPG or PNG“). */
  typesLabel?: string;
  /** Max size per file in bytes. */
  maxSize?: number;
  /** Max number of files. 1 = single file picker. */
  maxFiles?: number;
  defaultCamera?: 'user' | 'environment';
  /** Default: „{typesLabel} · max. {maxSize} each“. */
  hint?: ReactNode;
  /** Field error from the app (e.g. required on submit). Wins over the built-in validation message. */
  errorMessage?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
  texts?: Partial<UploadTexts>;
  className?: string;
}

/**
 * Upload field – ready composition (Figma: C33 Upload field). Checks type, size and count in the browser
 * before anything is uploaded (check again on the server). Rejected types and too many files show at the
 * picker, too large files as an error row – removable. Results are announced in a polite live region.
 */
export function UploadField({
  label,
  'aria-label': ariaLabel,
  files,
  onAdd,
  onRemove,
  onCancel,
  onRetry,
  layout = 'auto',
  acceptedFileTypes,
  typesLabel,
  maxSize,
  maxFiles,
  defaultCamera,
  hint,
  errorMessage,
  isRequired,
  isDisabled,
  texts: own,
  className,
}: UploadFieldProps) {
  const t = useMemo(() => ({ ...defaultUploadTexts, ...own }), [own]);
  const { locale } = useLocale();
  const mobile = useMediaQuery(MOBILE_QUERY);
  const labelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [rejected, setRejected] = useState<UploadFile[]>([]);
  const [pickerError, setPickerError] = useState<string>();
  const [announcement, setAnnouncement] = useState('');

  const compact = layout === 'compact' || (layout !== 'list' && mobile);
  const grid = layout === 'grid';
  const allowsMultiple = maxFiles !== 1;
  const maxLabel = maxSize ? formatBytes(maxSize, locale) : undefined;
  const shownHint = hint ?? ([typesLabel, maxLabel && `max. ${maxLabel}${allowsMultiple ? ' each' : ''}`].filter(Boolean).join(' · ') || undefined);

  const add = (picked: File[]) => {
    const wrongType = picked.filter((f) => !isAccepted(f, acceptedFileTypes));
    let ok = picked.filter((f) => isAccepted(f, acceptedFileTypes));
    const tooLarge = maxSize ? ok.filter((f) => f.size > maxSize) : [];
    ok = ok.filter((f) => !tooLarge.includes(f));
    const messages: string[] = [];
    if (wrongType.length) messages.push(t.typeNotAllowed(wrongType.map((f) => `“${f.name}”`).join(', '), typesLabel ?? ''));
    if (maxFiles && files.length + ok.length > maxFiles) {
      ok = ok.slice(0, Math.max(0, maxFiles - files.length));
      messages.push(t.tooMany(maxFiles));
    }
    const errors = tooLarge.map<UploadFile>((f) => ({
      id: `rejected-${f.name}-${f.size}-${f.lastModified}`,
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'error',
      error: t.tooLarge(formatBytes(f.size, locale), maxLabel ?? ''),
      canRetry: false,
    }));
    setRejected((r) => [...r.filter((x) => !errors.some((e) => e.id === x.id)), ...errors]);
    setPickerError(messages.join(' ') || undefined);
    setAnnouncement([...messages, ...errors.map((e) => t.failed(e.name, e.error!))].join(' '));
    if (ok.length) onAdd(ok);
  };

  // Announce finished and failed uploads once (the bar itself is not live, so progress never chatters).
  const previous = useRef(new Map<string, UploadFile['status']>());
  useEffect(() => {
    const said: string[] = [];
    for (const f of files) {
      const before = previous.current.get(f.id);
      if (before === f.status) continue;
      if (f.status === 'done' && before) said.push(t.uploaded(f.name));
      if (f.status === 'error' && f.error) said.push(t.failed(f.name, f.error));
    }
    previous.current = new Map(files.map((f) => [f.id, f.status]));
    if (said.length) setAnnouncement(said.join(' '));
  }, [files, t]);

  // Removing a file must not lose focus: move it to the same position in the list, else to the picker.
  const focusAt = useRef<number | null>(null);
  const all = [...files, ...rejected];
  useLayoutEffect(() => {
    if (focusAt.current == null) return;
    const items = rootRef.current?.querySelectorAll<HTMLElement>('.medo-upload__item');
    const target = items?.length
      ? items[Math.min(focusAt.current, items.length - 1)].querySelector<HTMLElement>('button')
      : rootRef.current?.querySelector<HTMLElement>('.medo-upload__choose');
    focusAt.current = null;
    target?.focus();
  });
  const remember = (id: string) => (focusAt.current = all.findIndex((f) => f.id === id));
  const actions = {
    texts: own,
    onRetry,
    onCancel: (id: string) => {
      remember(id);
      (onCancel ?? onRemove)(id);
    },
    onRemove: (id: string) => {
      remember(id);
      if (rejected.some((r) => r.id === id)) setRejected((r) => r.filter((x) => x.id !== id));
      else onRemove(id);
    },
  };

  const picker = { acceptedFileTypes, allowsMultiple, defaultCamera, isDisabled, hint: shownHint, errorMessage: errorMessage ?? pickerError, onSelect: add, texts: own };

  return (
    <div
      ref={rootRef}
      role={compact ? undefined : 'group'}
      aria-labelledby={label && !compact ? labelId : undefined}
      aria-label={label || compact ? undefined : ariaLabel}
      className={cx('medo-upload', grid && 'medo-upload--grid', compact && 'medo-upload--compact', className)}
    >
      {compact ? (
        <FileTrigger {...picker} label={label} isRequired={isRequired} />
      ) : (
        <>
          {label && (
            <span id={labelId} className="medo-field__label">
              {label}
              {isRequired && (
                <span className="medo-field__required" aria-hidden="true">
                  *
                </span>
              )}
            </span>
          )}
          <Dropzone {...picker} aria-labelledby={label ? labelId : undefined} />
        </>
      )}
      {all.length > 0 && (
        <ul className={cx('medo-upload__list', grid && 'medo-upload__list--grid')} aria-label={t.listLabel}>
          {all.map((file) => (
            <li key={file.id} className="medo-upload__item">
              {grid ? <FileTile file={file} {...actions} /> : <FileItem file={file} {...actions} />}
            </li>
          ))}
        </ul>
      )}
      <span role="status" className="medo-visually-hidden">
        {announcement}
      </span>
    </div>
  );
}
