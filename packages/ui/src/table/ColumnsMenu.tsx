import { Columns3 } from 'lucide-react';
import { Button } from '../button/Button';
import { Checkbox, CheckboxGroup } from '../checkbox/Checkbox';
import { Popover, PopoverTrigger } from '../popover/Popover';

export interface ColumnOption {
  id: string;
  label: string;
  /** Can't be hidden: the first column (row header) and actions. */
  isLocked?: boolean;
}

export interface ColumnsMenuProps {
  /** All columns that can be shown, in table order. */
  columns: ColumnOption[];
  /** Ids of the visible columns. */
  visibleColumns: string[];
  onVisibleColumnsChange: (ids: string[]) => void;
  /** Button label. */
  label?: string;
  /** Title of the list. */
  title?: string;
}

/**
 * Columns menu – shows or hides table columns (Figma: C37 Table · Column visibility). A ghost button sm in the
 * table toolbar opens a Popover sm with checkboxes; locked columns stay visible. Render only the visible columns.
 */
export function ColumnsMenu({ columns, visibleColumns, onVisibleColumnsChange, label = 'Columns', title = 'Show columns' }: ColumnsMenuProps) {
  const locked = columns.filter((c) => c.isLocked).map((c) => c.id);
  return (
    <PopoverTrigger>
      <Button variant="ghost" size="sm" startIcon={<Columns3 />}>
        {label}
      </Button>
      <Popover size="sm" aria-label={title}>
        <CheckboxGroup
          label={title}
          value={visibleColumns}
          // Locked columns can't be unchecked; keep the table order.
          onChange={(ids) => onVisibleColumnsChange(columns.map((c) => c.id).filter((id) => ids.includes(id) || locked.includes(id)))}
        >
          {columns.map((c) => (
            <Checkbox key={c.id} value={c.id} isDisabled={c.isLocked}>
              {c.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Popover>
    </PopoverTrigger>
  );
}
