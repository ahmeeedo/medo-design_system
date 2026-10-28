/** Icon docs: sizes and the icons with a fixed meaning in med.o (as the components use them). */
import type { ComponentType, SVGProps } from 'react';
import {
  Archive,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Info,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  TriangleAlert,
  Upload,
  X,
} from 'lucide-react';
import { StaticTable } from '@med-o/ui';
import { Tok } from '../../docs-blocks/DocBlocks';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const sizes: [string, string, string][] = [
  ['size/icon/sm', '16 px', 'Inside sm controls, inline with body/sm text, table cells.'],
  ['size/icon/md', '20 px', 'Default: buttons md, fields, menu items, navigation.'],
  ['size/icon/lg', '24 px', 'Buttons lg, touch targets, empty states (inside a tile).'],
];

export function IconSizes() {
  return (
    <StaticTable>
      <thead>
        <tr>
          <th scope="col">Token</th>
          <th scope="col">Size</th>
          <th scope="col">Example</th>
          <th scope="col">Use</th>
        </tr>
      </thead>
      <tbody>
        {sizes.map(([token, px, use]) => (
          <tr key={token}>
            <th scope="row">
              <Tok>{token}</Tok>
            </th>
            <td>{px}</td>
            <td>
              <Settings aria-hidden="true" style={{ inlineSize: px, blockSize: px, display: 'block' }} />
            </td>
            <td className="doc-cell-muted">{use}</td>
          </tr>
        ))}
      </tbody>
    </StaticTable>
  );
}

const meanings: [Icon, string, string][] = [
  [X, 'X', 'Close a dialog, sheet, popover, toast; remove a tag or file.'],
  [Ellipsis, 'Ellipsis', 'More actions (opens a Menu).'],
  [Plus, 'Plus', 'Create or add.'],
  [Pencil, 'Pencil', 'Edit.'],
  [Copy, 'Copy', 'Copy to the clipboard.'],
  [Trash2, 'Trash2', 'Delete (danger, last in its group).'],
  [Archive, 'Archive', 'Archive (swipe right, bulk action).'],
  [Download, 'Download', 'Download or export.'],
  [Upload, 'Upload', 'Upload files.'],
  [Search, 'Search', 'Search field, quick search.'],
  [ChevronDown, 'ChevronDown', 'Opens a list (Select, Combobox, groups).'],
  [ChevronRight, 'ChevronRight', 'Goes deeper: list rows, submenus, breadcrumbs.'],
  [ExternalLink, 'ExternalLink', 'Link to another website.'],
  [Check, 'Check', 'Selected or done.'],
  [Info, 'Info', 'Tone info.'],
  [CircleCheck, 'CircleCheck', 'Tone success.'],
  [TriangleAlert, 'TriangleAlert', 'Tone warning.'],
  [CircleAlert, 'CircleAlert', 'Tone danger, field errors.'],
];

export function IconMeanings() {
  return (
    <StaticTable>
      <thead>
        <tr>
          <th scope="col">Icon</th>
          <th scope="col">Lucide name</th>
          <th scope="col">Meaning</th>
        </tr>
      </thead>
      <tbody>
        {meanings.map(([Glyph, name, meaning]) => (
          <tr key={name}>
            <td>
              <Glyph aria-hidden="true" style={{ inlineSize: 20, blockSize: 20, display: 'block' }} />
            </td>
            <th scope="row">
              <Tok>{name}</Tok>
            </th>
            <td className="doc-cell-muted">{meaning}</td>
          </tr>
        ))}
      </tbody>
    </StaticTable>
  );
}
