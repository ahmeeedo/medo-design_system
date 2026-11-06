import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import readme from '../../../../README.md?raw';
import uiIndex from '../../../../packages/ui/src/index.ts?raw';
import { STATUS, STATUSES, type Status } from '../../.storybook/status';

/**
 * Component status (Guides / Component status): every component has exactly one tag `status:<level>` in the meta of
 * its stories, and the README's component table says the same. Tests only – hidden from the sidebar (`!dev`).
 */
const meta = {
  title: 'Tests/Status',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const stories = import.meta.glob<string>('../../../../packages/ui/src/*/*.stories.tsx', { query: '?raw', import: 'default', eager: true });

/** Folder → statuses of its stories (dialog: Dialog and Alert Dialog). */
function statusByFolder() {
  const byFolder = new Map<string, Status[]>();
  for (const [path, source] of Object.entries(stories)) {
    const metaPart = source.split('\nexport default')[0];
    const found = [...metaPart.matchAll(/'status:(\w+)'/g)].map((m) => m[1]);
    const folder = path.split('/').at(-2)!;
    expect(found, `${path}: exactly one status tag`).toHaveLength(1);
    expect(STATUSES, `${path}: known status`).toContain(found[0]);
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), found[0] as Status]);
  }
  return byFolder;
}

export const StatusTest: Story = {
  name: 'Status',
  render: () => <div />,
  play: async () => {
    const byFolder = statusByFolder();
    const folderOf = new Map<string, string>();
    for (const [, names, folder] of uiIndex.matchAll(/^export \{([^}]+)\} from '\.\/([^/]+)\//gm)) {
      for (const name of names.split(',')) folderOf.set(name.trim(), folder);
    }
    // README: | `Button`, `ButtonGroup` | Beta | … – the status of the folder of the first component.
    const rows = [...readme.matchAll(/^\| `([A-Za-z]+)`[^|]*\| (\w+) \|/gm)];
    await expect(rows.length).toBeGreaterThan(30);
    for (const [, name, label] of rows) {
      const folder = folderOf.get(name);
      const statuses = folder ? byFolder.get(folder) : undefined;
      if (!statuses) continue; // no docs page of its own (e.g. a hook)
      await expect(new Set(statuses).size, `${folder}: one status for the whole folder`).toBe(1);
      await expect(label, `README row ${name}`).toBe(STATUS[statuses[0]].label);
    }
  },
};
