import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dropzone, FileItem, FileTile, FileTrigger, UploadField, type UploadFile } from './Upload';
import { LightDark, samplePhoto, semantic } from '../story-helpers';

/* Sample thumbnails (shared story images, inline SVG, no network). */
const photo = samplePhoto(0, { width: 400, height: 400 });
const photo2 = samplePhoto(1, { width: 400, height: 400 });

const MB = 1_000_000;
const pdf = 'application/pdf';
const network = 'Upload interrupted. Check your connection and retry.';

const box: React.CSSProperties = { maxInlineSize: '35rem' };
const stack: React.CSSProperties = { display: 'grid', gap: 'var(--medo-space-2)', maxInlineSize: '30rem' };
const tiles: React.CSSProperties = { display: 'flex', gap: 'var(--medo-space-6)', flexWrap: 'wrap' };
const actions = { onRemove: fn(), onCancel: fn(), onRetry: fn() };

/** Simulated uploads: progress every 300 ms; names containing „offline“ fail. */
function useFakeUploads(initial: UploadFile[] = []) {
  const [files, setFiles] = useState<UploadFile[]>(initial);
  const timer = useRef<number>(undefined);
  useEffect(() => {
    timer.current = window.setInterval(() => {
      setFiles((all) =>
        all.some((f) => f.status === 'uploading')
          ? all.map((f) => {
              if (f.status !== 'uploading' || f.loaded == null) return f;
              const loaded = Math.min(f.size, f.loaded + f.size / 6);
              if (/offline/i.test(f.name) && loaded > f.size / 2) return { ...f, status: 'error', error: network };
              return loaded >= f.size ? { ...f, loaded, status: 'done' } : { ...f, loaded };
            })
          : all,
      );
    }, 300);
    return () => window.clearInterval(timer.current);
  }, []);

  return {
    files,
    onAdd: (picked: File[]) =>
      setFiles((all) => [
        ...all,
        ...picked.map<UploadFile>((f) => ({
          id: crypto.randomUUID(),
          name: f.name,
          size: f.size,
          type: f.type,
          status: 'uploading',
          loaded: 0,
          previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
        })),
      ]),
    onRemove: (id: string) => setFiles((all) => all.filter((f) => f.id !== id)),
    onRetry: (id: string) =>
      setFiles((all) => all.map((f) => (f.id === id ? { ...f, status: 'uploading', loaded: 0, error: undefined, name: f.name.replace(/offline/i, 'online') } : f))),
  };
}

const sampleList: UploadFile[] = [
  { id: '1', name: 'Invoice_2026-10_final.pdf', size: 2.4 * MB, type: pdf, status: 'done' },
  { id: '2', name: 'Site-photo_entrance.jpg', size: 2.4 * MB, type: 'image/jpeg', status: 'done', previewUrl: photo },
  { id: '3', name: 'Offer_Campus-Docs_v3.pdf', size: 2.4 * MB, type: pdf, status: 'uploading', loaded: 1.6 * MB },
  { id: '4', name: 'Contract_scan_offline.pdf', size: 3.2 * MB, type: pdf, status: 'error', error: network },
];

const sampleGrid: UploadFile[] = [
  { id: 'a', name: 'Team-offsite.jpg', size: 3.1 * MB, type: 'image/jpeg', status: 'uploading', loaded: 2 * MB, previewUrl: photo },
  { id: 'b', name: 'Team-offsite-valley.jpg', size: 2.8 * MB, type: 'image/jpeg', status: 'done', previewUrl: photo2 },
];

type PlaygroundArgs = React.ComponentProps<typeof UploadField>;

function Demo(args: Partial<PlaygroundArgs> & { initial?: UploadFile[] }) {
  const { initial, ...rest } = args;
  const uploads = useFakeUploads(initial);
  return <UploadField {...rest} {...uploads} />;
}

const meta = {
  title: 'Components/Upload',
  component: UploadField,
  tags: ['autodocs'],
  args: {
    label: 'Documents and photos',
    layout: 'auto',
    acceptedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
    typesLabel: 'PDF, JPG or PNG',
    maxSize: 10 * MB,
    maxFiles: 5,
    isRequired: false,
    isDisabled: false,
    errorMessage: '',
    files: [],
    onAdd: fn(),
    onRemove: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    layout: {
      control: 'inline-radio',
      options: ['auto', 'list', 'compact', 'grid'],
      description: 'auto: Dropzone + list, File trigger below 640 px. grid: images only.',
    },
    maxFiles: { control: { type: 'number', min: 1, max: 10 }, description: '1: single file picker („Choose file“).' },
    maxSize: { control: false },
    acceptedFileTypes: { control: false },
    typesLabel: { control: 'text' },
    errorMessage: { control: 'text', description: 'Field error from the app, e.g. „Add at least one file.“ on submit.' },
    isRequired: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    hint: { control: 'text', description: 'Default: types and max size.' },
    defaultCamera: semantic,
    texts: semantic,
    'aria-label': semantic,
    files: { control: false },
    onAdd: { control: false },
    onRemove: { control: false },
    onCancel: { control: false },
    onRetry: { control: false },
  },
  parameters: {
    medo: { code: 'C33', subtitle: 'Add files by drag and drop or by choosing them – with clear limits, progress and fixable errors.', figma: '303:26' },
    docs: {
      description: {
        component:
          'React Aria DropZone + FileTrigger. The button always opens the system picker – drag and drop is a shortcut (WCAG 2.5.7); the zone is focusable for paste (Ctrl+V). ' +
          '**UploadField** is controlled: the app holds `files` (status, `loaded`, `error`, `previewUrl`), uploads in `onAdd` right away and updates the list. Type, size and count are checked before upload (check again on the server); wrong types and too many files show at the picker, too large files as a removable error row. ' +
          'Every file shows its own progress; errors stay at the file with Retry and Remove; icon buttons name the file. Names truncate in the middle (start + last 12 characters). Results are announced politely. ' +
          'Layouts: list (documents and mixed uploads – images get a thumbnail), grid (images only), compact (forms, mobile; auto below 640 px). Parts: `Dropzone`, `FileTrigger`, `FileItem`, `FileTile`. Styles: `medo-upload`, `medo-dropzone`, `medo-file-item`, `medo-file-tile`.',
      },
    },
  },
  render: (args) => (
    <div style={args.layout === 'compact' ? { maxInlineSize: '22.5rem' } : box}>
      <Demo
        key={`${args.layout}-${args.maxFiles}`}
        {...args}
        errorMessage={args.errorMessage || undefined}
        hint={args.hint || undefined}
        initial={args.layout === 'grid' ? sampleGrid : sampleList}
      />
    </div>
  ),
} satisfies Meta<typeof UploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Layouts: Story = {
  name: 'List · Grid · Compact',
  parameters: {
    docs: {
      description: {
        story:
          'List for documents and mixed uploads: images show their thumbnail, other files the type icon. Grid only when nothing but images is allowed. Compact for forms and mobile. Try a file named „…offline….pdf“ to see the network error and Retry.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-12)', ...box }}>
      <Demo
        label="Documents and photos"
        layout="list"
        acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
        typesLabel="PDF, JPG or PNG"
        maxSize={10 * MB}
        initial={sampleList}
      />
      <Demo
        label="Photos"
        layout="grid"
        acceptedFileTypes={['image/jpeg', 'image/png']}
        typesLabel="JPG or PNG"
        maxSize={10 * MB}
        texts={{ title: 'Drag and drop photos here' }}
        initial={sampleGrid}
      />
      <div style={{ maxInlineSize: '22.5rem' }}>
        <Demo
          label="Attachments"
          layout="compact"
          maxFiles={1}
          acceptedFileTypes={['.pdf', '.jpg', '.jpeg']}
          typesLabel="PDF or JPG"
          maxSize={10 * MB}
          initial={[{ id: 'cv', name: 'CV_Ahmet_2026.pdf', size: 1.1 * MB, type: pdf, status: 'done' }]}
        />
      </div>
    </div>
  ),
};

export const DropzoneStates: Story = {
  name: 'Dropzone',
  parameters: {
    docs: {
      description: {
        story:
          'Dashed border = „drop here“. Dragging files over it turns the border solid action/primary on surface/brand-subtle and changes the text („Drop files to upload“). Focus (Tab) shows the focus ring – paste works then. Error: dashed border/danger + message. Disabled 50 %.',
      },
    },
  },
  render: () => (
    <LightDark>
      <div style={{ display: 'grid', gap: 'var(--medo-space-4)' }}>
        <Dropzone hint="PDF, JPG or PNG · max. 10 MB each" onSelect={fn()} />
        <Dropzone hint="PDF, JPG or PNG · max. 10 MB each" errorMessage="“Contract.docx” is not allowed. Use PDF, JPG or PNG." onSelect={fn()} />
        <Dropzone hint="PDF, JPG or PNG · max. 10 MB each" isDisabled onSelect={fn()} />
      </div>
    </LightDark>
  ),
};

export const Files: Story = {
  name: 'Files: uploading · done · error',
  parameters: {
    docs: {
      description: {
        story:
          'Each file is its own row (or tile for images). Progress per file, not one bar for all. Errors stay at the file that caused them, with Retry and Remove. Without `onRetry` (or `canRetry: false`) only Remove.',
      },
    },
  },
  render: () => (
    <LightDark>
      <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
        <div style={stack}>
          <FileItem {...actions} file={{ id: '1', name: 'Invoice_2026-10_final.pdf', size: 2.4 * MB, type: pdf, status: 'uploading', loaded: 1.6 * MB }} />
          <FileItem {...actions} file={{ id: '2', name: 'Invoice_2026-10_final.pdf', size: 2.4 * MB, type: pdf, status: 'done' }} />
          <FileItem
            {...actions}
            file={{ id: '3', name: 'Invoice_2026-10_final.pdf', size: 14 * MB, type: pdf, status: 'error', error: 'File is 14 MB – max. 10 MB allowed', canRetry: false }}
          />
          <FileItem
            {...actions}
            file={{ id: '4', name: 'Team-offsite-valley.jpg', size: 2.4 * MB, type: 'image/jpeg', status: 'uploading', loaded: 0.6 * MB, previewUrl: photo }}
          />
          <FileItem {...actions} file={{ id: '5', name: 'Team-offsite-valley.jpg', size: 2.4 * MB, type: 'image/jpeg', status: 'done', previewUrl: photo }} />
          <FileItem
            {...actions}
            file={{ id: '6', name: 'Team-offsite-valley.jpg', size: 2.4 * MB, type: 'image/jpeg', status: 'error', error: network, previewUrl: photo }}
          />
        </div>
        <div style={tiles}>
          <FileTile {...actions} file={{ id: 'a', name: 'Team-offsite.jpg', size: 3 * MB, status: 'uploading', loaded: 1.92 * MB, previewUrl: photo }} />
          <FileTile {...actions} file={{ id: 'b', name: 'Team-offsite.jpg', size: 3 * MB, status: 'done', previewUrl: photo2 }} />
          <FileTile {...actions} file={{ id: 'c', name: 'Team-offsite.jpg', size: 14 * MB, status: 'error', error: 'Too large · 14 MB', previewUrl: photo }} />
        </div>
      </div>
    </LightDark>
  ),
};

export const LongNames: Story = {
  name: 'Long file names',
  parameters: {
    docs: {
      description: {
        story:
          'Names truncate in the middle, so the start and the extension stay visible. Always one line; the meta line never truncates. The full name is the hover title and part of the accessible names („Remove Quarterly-report_…_final-v3.pdf“), shown in the button tooltips.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
      <div style={stack}>
        <FileItem
          {...actions}
          file={{ id: '1', name: 'Quarterly-report_Campus-Lingo_October-2026_reviewed-by-legal_final-v3.pdf', size: 2.4 * MB, type: pdf, status: 'done' }}
        />
        <FileItem
          {...actions}
          file={{
            id: '2',
            name: 'Quarterly-report_Campus-Lingo_October-2026_reviewed-by-legal_final-v3.pdf',
            size: 14 * MB,
            type: pdf,
            status: 'error',
            error: 'File is 14 MB – max. 10 MB allowed',
          }}
        />
      </div>
      <div style={tiles}>
        <FileTile {...actions} file={{ id: 'a', name: 'IMG_20261012_093215_entrance.jpg', size: 3 * MB, status: 'done', previewUrl: photo2 }} />
      </div>
    </div>
  ),
};

export const Compact: Story = {
  name: 'File trigger (compact)',
  parameters: {
    docs: {
      description: {
        story:
          'Forms and mobile: no drag and drop on touch. The system picker offers camera, photos and files on its own; `acceptedFileTypes={["image/*"]}` shows the camera first. Required: check on submit and pass `errorMessage` („Add at least one file.“).',
      },
    },
  },
  render: () => (
    <LightDark>
      <div style={{ display: 'grid', gap: 'var(--medo-space-6)' }}>
        <FileTrigger label="Attachments" hint="PDF or JPG · max. 10 MB" allowsMultiple={false} onSelect={fn()} />
        <FileTrigger label="Attachments" isRequired hint="PDF or JPG · max. 10 MB" errorMessage="Add at least one file." allowsMultiple={false} onSelect={fn()} />
      </div>
    </LightDark>
  ),
};

export const Validation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checked in the browser before upload: only PDF, max. 1 MB, max. 2 files. Wrong types and too many files show at the Dropzone, too large files as an error row. Every message says what happened and how to fix it.',
      },
    },
  },
  render: () => (
    <div style={box}>
      <Demo label="Contracts" layout="list" acceptedFileTypes={['.pdf']} typesLabel="PDF" maxSize={1 * MB} maxFiles={2} />
    </div>
  ),
};
