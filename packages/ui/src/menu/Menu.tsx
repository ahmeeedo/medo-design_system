import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  Header,
  Keyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover,
  SubmenuTrigger,
  Text,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components';
import { ChevronRight, Ellipsis } from 'lucide-react';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { IconButton } from '../icon-button/IconButton';
import { formatShortcut } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import '../listbox/listbox.css';
import './menu.css';

type MenuSize = 'md' | 'lg';

/** md: desktop popover · lg: mobile sheet (no shortcuts); push opens a submenu as second view in the sheet. */
interface MenuMode {
  size: MenuSize;
  push?: (title: ReactNode, children: ReactNode) => void;
}
const MenuModeContext = createContext<MenuMode>({ size: 'md' });

export interface MenuTriggerProps extends Omit<AriaMenuTriggerProps, 'children'> {
  /** The trigger (default: an ellipsis Icon Button) and the Menu. Without a trigger, pass `label`. */
  children: ReactNode;
}

/** Opens a Menu from a trigger (React Aria MenuTrigger). Focus returns to the trigger. */
export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

/**
 * Default trigger: ghost Icon Button with an ellipsis. The name includes the object
 * (“More actions for Q3-Report.pdf”); it looks pressed while the menu is open.
 */
export function MenuButton({ 'aria-label': label, size = 'md' }: { 'aria-label': string; size?: 'sm' | 'md' | 'lg' }) {
  return <IconButton variant="ghost" size={size} icon={<Ellipsis />} aria-label={label} />;
}

export interface MenuProps<T> extends Omit<AriaMenuProps<T>, 'className' | 'style'> {
  /** Mobile sheet title: the object the actions apply to (“Q3-Report.pdf”). */
  title?: ReactNode;
  /** auto: popover on desktop, Bottom Sheet below 640 px · popover · sheet. */
  overlay?: 'auto' | 'popover' | 'sheet';
  className?: string;
}

/**
 * Menu – a list of actions. Built on React Aria Menu: arrow keys, Enter runs the item,
 * Esc closes, type to jump, Home/End. Every item has an icon, labels start with a verb; danger items last.
 * Not for values (Select) or site navigation (disclosure pattern).
 */
export function Menu<T extends object>({ title, overlay = 'auto', className, ...props }: MenuProps<T>) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const sheet = overlay === 'sheet' || (overlay === 'auto' && mobile);
  if (sheet) return <SheetMenu title={title} className={className} {...props} />;
  return (
    <Popover placement="bottom end" offset={4} className="medo-menu-popover">
      <MenuModeContext.Provider value={{ size: 'md' }}>
        <AriaMenu {...props} className={cx('medo-menu', 'medo-menu--md', className)} />
      </MenuModeContext.Provider>
    </Popover>
  );
}

/** Mobile: Bottom Sheet with lg items; a submenu replaces the list as a second view with a back button. */
function SheetMenu<T extends object>({ title, className, ...props }: Omit<MenuProps<T>, 'overlay'>) {
  const [view, setView] = useState<{ title: ReactNode; children: ReactNode } | null>(null);
  return (
    <BottomSheet
      title={view ? view.title : (title ?? props['aria-label'])}
      onBack={view ? () => setView(null) : undefined}
      onOpenChange={(open) => !open && setView(null)}
    >
      <MenuModeContext.Provider value={{ size: 'lg', push: (t, c) => setView({ title: t, children: c }) }}>
        {view ? (
          <AriaMenu key="sub" aria-label={typeof view.title === 'string' ? view.title : undefined} autoFocus="first" className={cx('medo-menu', 'medo-menu--lg', className)}>
            {view.children}
          </AriaMenu>
        ) : (
          <AriaMenu {...props} key="main" className={cx('medo-menu', 'medo-menu--lg', className)} />
        )}
      </MenuModeContext.Provider>
    </BottomSheet>
  );
}

export interface MenuItemProps extends Omit<AriaMenuItemProps, 'children' | 'className' | 'style'> {
  /** Label, starting with a verb (“Duplicate”). “…” only when a dialog or second step follows. */
  children: string;
  /** Required: shows the action. Decorative for screen readers – the label carries the meaning. */
  icon: ReactNode;
  /** Keyboard shortcut in aria-keyshortcuts syntax; “Mod” = ⌘ on Apple, Ctrl elsewhere. Desktop only. It must also work without the menu. */
  shortcut?: string;
  /** Destructive action: red, last in its own group. Irreversible actions open a confirmation dialog. */
  variant?: 'default' | 'danger';
}

/** One action in a Menu. */
export function MenuItem({ children, icon, shortcut, variant = 'default', textValue, ...props }: MenuItemProps) {
  const { size } = useContext(MenuModeContext);
  return (
    <AriaMenuItem
      {...props}
      textValue={textValue ?? children}
      className={cx('medo-menu-item', variant === 'danger' && 'medo-menu-item--danger')}
    >
      {({ hasSubmenu }) => (
        <>
          <span className="medo-menu-item__icon" aria-hidden="true">
            {icon}
          </span>
          <Text slot="label" className="medo-menu-item__label">
            {children}
          </Text>
          {/* Keyboard is linked to the item (aria-describedby), so screen readers hear the shortcut. */}
          {shortcut && size === 'md' && <Keyboard className="medo-menu-item__shortcut">{formatShortcut(shortcut)}</Keyboard>}
          {hasSubmenu && (
            <span className="medo-menu-item__chevron" aria-hidden="true">
              <ChevronRight />
            </span>
          )}
        </>
      )}
    </AriaMenuItem>
  );
}

export interface SubmenuProps {
  /** Label of the parent item. */
  label: string;
  icon: ReactNode;
  /** The submenu's items (one level only). */
  children: ReactNode;
  isDisabled?: boolean;
}

/** Submenu (one level). Desktop: opens to the side. Mobile: second view in the sheet with a back button. */
export function Submenu({ label, icon, children, isDisabled }: SubmenuProps) {
  const { size, push } = useContext(MenuModeContext);
  if (push) {
    return (
      <AriaMenuItem
        textValue={label}
        isDisabled={isDisabled}
        shouldCloseOnSelect={false}
        onAction={() => push(label, children)}
        className="medo-menu-item"
      >
        <span className="medo-menu-item__icon" aria-hidden="true">
          {icon}
        </span>
        <Text slot="label" className="medo-menu-item__label">
          {label}
        </Text>
        <span className="medo-menu-item__chevron" aria-hidden="true">
          <ChevronRight />
        </span>
      </AriaMenuItem>
    );
  }
  return (
    <SubmenuTrigger>
      <MenuItem icon={icon} isDisabled={isDisabled}>
        {label}
      </MenuItem>
      {/* Side placement, first item level with the parent item (popover padding + border). */}
      <Popover placement="end top" offset={4} crossOffset={-5} className="medo-menu-popover">
        <AriaMenu aria-label={label} className={cx('medo-menu', `medo-menu--${size}`)}>
          {children}
        </AriaMenu>
      </Popover>
    </SubmenuTrigger>
  );
}

export interface MenuSectionProps {
  /** Optional overline heading. Without a title the group is only divided by a line; then set aria-label if it helps. */
  title?: ReactNode;
  'aria-label'?: string;
  children: ReactNode;
}

/** A group of related actions. Groups are divided by a line; the danger group comes last. */
export function MenuSection({ title, children, ...props }: MenuSectionProps) {
  return (
    <AriaMenuSection aria-label={props['aria-label']} className="medo-menu__section">
      {title && <Header className="medo-listbox__header">{title}</Header>}
      {children}
    </AriaMenuSection>
  );
}
