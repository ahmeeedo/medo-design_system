import { Children, createContext, isValidElement, useContext, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  TooltipTriggerStateContext,
  type LinkProps as AriaLinkProps,
  type PressEvent,
} from 'react-aria-components';
import { ChevronDown, Ellipsis, Menu as MenuIcon, PanelLeft, X } from 'lucide-react';
import { Avatar } from '../avatar/Avatar';
import { BadgeCount, BadgeDot } from '../badge/Badge';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { IconButton } from '../icon-button/IconButton';
import { Tooltip, TooltipTrigger } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { useMediaQuery } from '../utils/useMediaQuery';
import { Drawer } from '../drawer/Drawer';
import './navigation.css';

/*
 * Navigation – med.o Design System (Figma: C24 Navigation)
 * Navigation is always made of links in a named <nav> region; the current page has aria-current="page".
 * One NavItem renders in four forms, chosen by the container: header · sidebar · rail · sheet.
 */

export type NavVariant = 'header' | 'sidebar' | 'rail' | 'sheet';
const NavVariantContext = createContext<NavVariant>('sidebar');

/** Side navigation: groups in the rail expand it (with the group open); links in the tablet drawer close it. */
const SideNavContext = createContext<{ expand: (group?: string) => void; openGroup?: string; onNavigate?: () => void } | null>(null);

const TABLET_QUERY = '(min-width: 640px) and (max-width: 1023.98px)';
const SITE_MENU_QUERY = '(max-width: 767.98px)';

/* ---------- Nav item ---------- */

export interface NavItemProps extends Omit<AriaLinkProps, 'children' | 'className' | 'style'> {
  /** Required. 1–2 words, a noun – the same name in header, sidebar, tab bar and page title. */
  children: string;
  /** Sidebar, rail and sheet: icon before the label (decorative). Header items have no icon. */
  icon?: ReactNode;
  /** The current page (exactly one). Marked with aria-current="page" and action/selected. */
  isCurrent?: boolean;
  /** Number in the item (Badge count, neutral). */
  count?: number;
  /** Screen-reader text of the count („3 unread“, „12 projects“). */
  countLabel?: string;
  /** The count is new or unread: in the rail it turns into a dot. Plain totals („12 projects“) are hidden there. */
  unread?: boolean;
}

/**
 * One navigation link (Figma: Nav item). Built on React Aria Link, so client-side routing works
 * with any router through RouterProvider. The container decides the form (header, sidebar, rail, sheet).
 */
export function NavItem({ children, icon, isCurrent, count, countLabel, unread, ...props }: NavItemProps) {
  const variant = useContext(NavVariantContext);
  const sideNav = useContext(SideNavContext);
  const rail = variant === 'rail';
  const content = (
    <>
      {icon && variant !== 'header' && (
        <span className="medo-nav-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={rail ? 'medo-visually-hidden' : 'medo-nav-item__label'}>{children}</span>
      {count !== undefined &&
        (rail ? (
          unread && count > 0 && <BadgeDot tone="danger" label={countLabel ?? String(count)} className="medo-nav-item__dot" />
        ) : (
          <BadgeCount count={count} tone="neutral" size="sm" label={countLabel ?? String(count)} />
        ))}
    </>
  );
  const linkProps = {
    ...props,
    onPress: (e: PressEvent) => {
      props.onPress?.(e);
      sideNav?.onNavigate?.();
    },
    'aria-current': isCurrent ? ('page' as const) : undefined,
    className: cx('medo-nav-item', `medo-nav-item--${variant}`),
  };
  return (
    <li className="medo-nav__entry">
      {rail ? (
        // Collapsed: the label appears as tooltip on hover and focus.
        <TooltipTrigger>
          <RailLink {...linkProps}>{content}</RailLink>
          <Tooltip placement="end">{children}</Tooltip>
        </TooltipTrigger>
      ) : (
        <AriaLink {...linkProps}>{content}</AriaLink>
      )}
    </li>
  );
}

/** React Aria's Link takes focus but not hover from a TooltipTrigger – open the tooltip on hover ourselves. */
function RailLink(props: AriaLinkProps) {
  const tooltip = useContext(TooltipTriggerStateContext);
  return <AriaLink {...props} onHoverStart={() => tooltip?.open()} onHoverEnd={() => tooltip?.close()} />;
}

/* ---------- Group (dropdown in the header, accordion elsewhere) ---------- */

export interface NavGroupProps {
  /** Label of the group button. */
  label: string;
  /** Sidebar, rail and sheet: icon before the label. */
  icon?: ReactNode;
  /** NavItems – one level only. */
  children: ReactNode;
  /** Open at start. Default: open when it contains the current page (sidebar, sheet). */
  defaultOpen?: boolean;
}

/** True when a NavItem child is the current page. */
function containsCurrent(children: ReactNode) {
  return Children.toArray(children).some((c) => isValidElement(c) && (c as ReactElement<NavItemProps>).props.isCurrent);
}

/**
 * A group of links behind a disclosure button (aria-expanded) – never a menu.
 * Header: a dropdown panel on the popover surface; Tab moves through the links, Esc or a click outside closes.
 * Sidebar and sheet: opens in place, one level. The parent shows „current“ only while it is closed.
 */
export function NavGroup({ label, icon, children, defaultOpen }: NavGroupProps) {
  const variant = useContext(NavVariantContext);
  const sideNav = useContext(SideNavContext);
  const hasCurrent = containsCurrent(children);
  const [open, setOpen] = useState(defaultOpen ?? (variant !== 'header' && (hasCurrent || sideNav?.openGroup === label)));
  const panelId = useId();
  const itemRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const floating = variant === 'header';

  // Header dropdown: Esc, a click outside or focus leaving closes it.
  useEffect(() => {
    if (!floating || !open) return;
    const item = itemRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => !item?.contains(e.target as Node) && setOpen(false);
    const onFocusOut = (e: FocusEvent) => e.relatedTarget && !item?.contains(e.relatedTarget as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    item?.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      item?.removeEventListener('focusout', onFocusOut);
    };
  }, [floating, open]);

  // Rail: the group cannot open in 64 px – pressing it expands the sidebar with the group open.
  if (variant === 'rail') {
    return (
      <li className="medo-nav__entry">
        <TooltipTrigger>
          <AriaButton
            className="medo-nav-item medo-nav-item--rail"
            data-current={hasCurrent || undefined}
            onPress={() => {
              setOpen(true);
              sideNav?.expand(label);
            }}
          >
            <span className="medo-nav-item__icon" aria-hidden="true">
              {icon}
            </span>
            <span className="medo-visually-hidden">{label}</span>
          </AriaButton>
          <Tooltip placement="end">{label}</Tooltip>
        </TooltipTrigger>
      </li>
    );
  }

  return (
    <li ref={itemRef} className={cx('medo-nav__entry', 'medo-nav-group', floating && 'medo-nav-group--floating')}>
      <AriaButton
        ref={buttonRef}
        aria-expanded={open}
        aria-controls={panelId}
        data-current={(hasCurrent && !open) || undefined}
        onPress={() => setOpen((o) => !o)}
        className={cx('medo-nav-item', `medo-nav-item--${variant}`, 'medo-nav-group__button')}
      >
        {icon && !floating && (
          <span className="medo-nav-item__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="medo-nav-item__label">{label}</span>
        <ChevronDown className="medo-nav-group__chevron" aria-hidden="true" />
      </AriaButton>
      <NavVariantContext.Provider value={floating ? 'sidebar' : variant}>
        <ul id={panelId} hidden={!open} className={cx('medo-nav__list', floating ? 'medo-nav-group__panel' : 'medo-nav-group__list')}>
          {children}
        </ul>
      </NavVariantContext.Provider>
    </li>
  );
}

/* ---------- Nav list ---------- */

export interface NavListProps {
  /** Form of the items: header (row) · sidebar · rail · sheet. */
  variant?: NavVariant;
  /** Name of the navigation region („Footer“, „Account“). */
  'aria-label': string;
  children: ReactNode;
  className?: string;
}

/** A named navigation region with items of one form – for navigation outside the ready-made headers and bars. */
export function NavList({ variant = 'sidebar', 'aria-label': label, children, className }: NavListProps) {
  return (
    <nav aria-label={label} className={className}>
      <NavVariantContext.Provider value={variant}>
        <ul className={cx('medo-nav__list', variant === 'header' && 'medo-nav__list--row', variant === 'rail' && 'medo-nav__list--rail')}>{children}</ul>
      </NavVariantContext.Provider>
    </nav>
  );
}

/* ---------- Section (sidebar) ---------- */

export interface NavSectionProps {
  /** Overline heading („Workspace“). In the rail the section is divided by a line. */
  title: string;
  children: ReactNode;
}

/** A titled section of the side navigation. */
export function NavSection({ title, children }: NavSectionProps) {
  const variant = useContext(NavVariantContext);
  const id = useId();
  return (
    <li className="medo-nav__entry medo-nav-section">
      {variant === 'rail' ? (
        <span className="medo-nav-section__divider" role="presentation" />
      ) : (
        <span id={id} className="medo-nav-section__title">
          {title}
        </span>
      )}
      <ul className="medo-nav__list" aria-labelledby={variant === 'rail' ? undefined : id} aria-label={variant === 'rail' ? title : undefined}>
        {children}
      </ul>
    </li>
  );
}

/* ---------- Skip link ---------- */

export interface SkipLinkProps {
  /** Id target of the main content. */
  href?: string;
  children?: string;
}

/** „Skip to content“ – the first focusable element on every page (WCAG 2.4.1). Visible on focus only. */
export function SkipLink({ href = '#main', children = 'Skip to content' }: SkipLinkProps) {
  return (
    <a href={href} className="medo-skip-link">
      {children}
    </a>
  );
}

/* ---------- Action links (header actions that navigate) ---------- */

export interface NavAction {
  label: string;
  /** Usually a link („Log in“, „Get started“). */
  href?: string;
  onPress?: (e: PressEvent) => void;
  /** primary: max one · secondary · ghost. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

/** Link (or press action) with the Button look – the actions of the website header. */
function ActionLink({ action, size }: { action: NavAction; size: 'sm' | 'md' | 'lg' }) {
  return (
    <AriaLink href={action.href} onPress={action.onPress} className={cx('medo-button', `medo-button--${action.variant ?? 'ghost'}`, `medo-button--${size}`)}>
      <span className="medo-button__label">{action.label}</span>
    </AriaLink>
  );
}

/* ---------- Website header ---------- */

export interface SiteHeaderProps {
  /** Logo link with a name („med.o home“). */
  logo: ReactNode;
  /** NavItems and NavGroups – max 5 links; more go into a group. */
  children: ReactNode;
  /** Max 2 actions, at most one primary (last). In the mobile menu they are pinned at the bottom (lg). */
  actions?: NavAction[];
  /** Name of the navigation region. */
  'aria-label'?: string;
  /** Mobile: label of the menu button and title of the fullscreen menu. */
  menuLabel?: string;
  closeLabel?: string;
  /** auto: menu button below 768 px · desktop · mobile (forced, e.g. for previews). */
  layout?: 'auto' | 'desktop' | 'mobile';
}

/**
 * Website header (Figma: Header, Type=Website): logo, links, actions. Sticky, with a divider once the page scrolls.
 * Below 768 px only the logo, the primary action and a menu button remain; the menu opens fullscreen.
 */
export function SiteHeader({ logo, children, actions = [], 'aria-label': label = 'Main', menuLabel = 'Menu', closeLabel = 'Close', layout = 'auto' }: SiteHeaderProps) {
  const narrow = useMediaQuery(SITE_MENU_QUERY);
  const compact = layout === 'mobile' || (layout === 'auto' && narrow);
  const scrolled = useScrolled();
  const primary = actions.find((a) => a.variant === 'primary');
  return (
    <header className={cx('medo-site-header', compact && 'medo-site-header--compact')} data-scrolled={scrolled || undefined}>
      <div className="medo-site-header__logo">{logo}</div>
      {compact ? (
        <div className="medo-site-header__actions">
          {primary && <ActionLink action={primary} size="sm" />}
          <NavFullscreen logo={logo} actions={actions} aria-label={label} menuLabel={menuLabel} closeLabel={closeLabel}>
            {children}
          </NavFullscreen>
        </div>
      ) : (
        <>
          <nav aria-label={label} className="medo-site-header__nav">
            <NavVariantContext.Provider value="header">
              <ul className="medo-nav__list medo-nav__list--row">{children}</ul>
            </NavVariantContext.Provider>
          </nav>
          {actions.length > 0 && (
            <div className="medo-site-header__actions">
              {actions.map((a) => (
                <ActionLink key={a.label} action={a} size="md" />
              ))}
            </div>
          )}
        </>
      )}
    </header>
  );
}

/** Fullscreen menu of the website on mobile (Figma: Nav fullscreen): large links, groups inline, actions at the bottom. */
function NavFullscreen({
  logo,
  actions,
  children,
  'aria-label': label,
  menuLabel,
  closeLabel,
}: Required<Pick<SiteHeaderProps, 'logo' | 'actions' | 'children' | 'aria-label' | 'menuLabel' | 'closeLabel'>>) {
  // Primary first when stacked – in thumb reach.
  const ordered = [...actions].sort((a, b) => Number(b.variant === 'primary') - Number(a.variant === 'primary'));
  return (
    <DialogTrigger>
      <IconButton variant="ghost" size="md" icon={<MenuIcon />} aria-label={menuLabel} tooltip={false} />
      <ModalOverlay className="medo-nav-fullscreen-overlay">
        <Modal className="medo-nav-fullscreen">
          <AriaDialog aria-label={menuLabel} className="medo-nav-fullscreen__dialog">
            {({ close }) => (
              <>
                <div className="medo-nav-fullscreen__header">
                  <div className="medo-site-header__logo">{logo}</div>
                  <IconButton variant="ghost" size="md" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />
                </div>
                <nav aria-label={label} className="medo-nav-fullscreen__nav">
                  <NavVariantContext.Provider value="sheet">
                    <ul className="medo-nav__list">{children}</ul>
                  </NavVariantContext.Provider>
                </nav>
                {ordered.length > 0 && (
                  <div className="medo-nav-fullscreen__actions">
                    {ordered.map((a) => (
                      <ActionLink key={a.label} action={a.variant === 'ghost' || !a.variant ? { ...a, variant: 'secondary' } : a} size="lg" />
                    ))}
                  </div>
                )}
              </>
            )}
          </AriaDialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

/* ---------- App header ---------- */

export interface AppHeaderProps {
  /** Page title – the same name as the current nav item. */
  title: ReactNode;
  /** Heading level of the title (default 1: the page title). */
  headingLevel?: 1 | 2 | 3;
  /** Mobile only: logo mark before the title (the side navigation is hidden there). */
  logo?: ReactNode;
  /** Search field (desktop). */
  search?: ReactNode;
  /** Notifications, account … */
  actions?: ReactNode;
}

/** App header (Figma: Header, Type=App): page title, search and actions. Navigation lives in the side navigation. */
export function AppHeader({ title, headingLevel = 1, logo, search, actions }: AppHeaderProps) {
  const scrolled = useScrolled();
  return (
    <header className="medo-app-header" data-scrolled={scrolled || undefined}>
      {logo && <div className="medo-app-header__logo">{logo}</div>}
      <Heading level={headingLevel} className="medo-app-header__title">
        {title}
      </Heading>
      {search && <div className="medo-app-header__search">{search}</div>}
      {actions && <div className="medo-app-header__actions">{actions}</div>}
    </header>
  );
}

/* ---------- Side navigation ---------- */

export interface SideNavUser {
  name: string;
  email?: string;
  src?: string;
}

export interface SideNavProps {
  /** Full logo (expanded). */
  logo: ReactNode;
  /** Logo mark (collapsed, 32 px). */
  logoMark: ReactNode;
  /** NavItems, NavSections and NavGroups. Most used first. */
  children: ReactNode;
  /** Signed-in user at the bottom. */
  user?: SideNavUser;
  /** Collapsed to the 64 px rail (controlled). Remember it per user via onCollapsedChange. */
  isCollapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Name of the navigation region. */
  'aria-label'?: string;
  collapseLabel?: string;
  expandLabel?: string;
  /** Close button of the tablet drawer. */
  closeLabel?: string;
}

/**
 * Side navigation for apps (Figma: Side navigation): 256 px with icons, counts, sections and groups;
 * collapses to a 64 px rail with tooltips. 640–1023 px: always a rail; expanding opens the full navigation
 * as a Drawer on the left (Figma: Drawer, navigation). Below 640 px it is hidden – use the BottomTabBar there.
 */
export function SideNav({
  logo,
  logoMark,
  children,
  user,
  isCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  'aria-label': label = 'App',
  collapseLabel = 'Collapse navigation',
  expandLabel = 'Expand navigation',
  closeLabel = 'Close',
}: SideNavProps) {
  const [ownCollapsed, setOwnCollapsed] = useState(defaultCollapsed);
  const tablet = useMediaQuery(TABLET_QUERY);
  const [drawer, setDrawer] = useState(false);
  const [openGroup, setOpenGroup] = useState<string>();
  const collapsed = tablet || (isCollapsed ?? ownCollapsed);

  const expand = (group?: string) => {
    setOpenGroup(group);
    if (tablet) return setDrawer(true);
    if (isCollapsed === undefined) setOwnCollapsed(false);
    onCollapsedChange?.(false);
  };
  const collapse = () => {
    if (isCollapsed === undefined) setOwnCollapsed(true);
    onCollapsedChange?.(true);
  };
  useEffect(() => {
    if (!tablet) setDrawer(false);
  }, [tablet]);

  const toggle = (
    <IconButton
      variant="ghost"
      size="sm"
      icon={<PanelLeft />}
      aria-label={collapsed ? expandLabel : collapseLabel}
      aria-expanded={tablet ? drawer : !collapsed}
      onPress={() => (collapsed ? expand() : collapse())}
    />
  );

  return (
    <aside className={cx('medo-sidenav', collapsed && 'medo-sidenav--collapsed')}>
      <div className="medo-sidenav__panel">
        <div className="medo-sidenav__top">
          <div className="medo-sidenav__logo">{collapsed ? logoMark : logo}</div>
          {!collapsed && toggle}
        </div>
        <nav aria-label={label} className="medo-sidenav__nav">
          <SideNavContext.Provider value={{ expand, openGroup }}>
            <NavVariantContext.Provider value={collapsed ? 'rail' : 'sidebar'}>
              <ul className="medo-nav__list">{children}</ul>
            </NavVariantContext.Provider>
          </SideNavContext.Provider>
        </nav>
        <div className="medo-sidenav__bottom">
          {collapsed && toggle}
          {user && (
            <div className="medo-sidenav__user">
              <Avatar name={user.name} src={user.src} size="md" decorative={!collapsed} />
              {!collapsed && (
                <span className="medo-sidenav__user-text">
                  <span className="medo-sidenav__user-name">{user.name}</span>
                  {user.email && <span className="medo-sidenav__user-email">{user.email}</span>}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {tablet && (
        // Tablet: the full navigation as a Drawer on the left. Choosing a page closes it.
        <Drawer side="left" size="sm" title={logo} aria-label={label} closeLabel={closeLabel} isOpen={drawer} onOpenChange={setDrawer}>
          <nav aria-label={label}>
            <SideNavContext.Provider value={{ expand, openGroup, onNavigate: () => setDrawer(false) }}>
              <NavVariantContext.Provider value="sidebar">
                <ul className="medo-nav__list">{children}</ul>
              </NavVariantContext.Provider>
            </SideNavContext.Provider>
          </nav>
        </Drawer>
      )}
    </aside>
  );
}

/* ---------- Bottom tab bar (apps, mobile) ---------- */

export interface BottomTabBarProps {
  /** 3–5 TabBarItems; the last can be TabBarMore. */
  children: ReactNode;
  'aria-label'?: string;
  /** mobile: only below 640 px (default) · always (e.g. in a native-like web app). */
  display?: 'mobile' | 'always';
}

/**
 * Bottom tab bar (Figma: Bottom tab bar): the main destinations of an app on phones, in thumb reach.
 * Max 4 destinations + „More“. Fixed to the bottom with the safe area; set `--medo-toast-offset` so toasts stay above it.
 */
export function BottomTabBar({ children, 'aria-label': label = 'App', display = 'mobile' }: BottomTabBarProps) {
  return (
    <nav aria-label={label} className={cx('medo-tab-bar', display === 'always' && 'medo-tab-bar--always')}>
      <ul className="medo-tab-bar__list">{children}</ul>
    </nav>
  );
}

export interface TabBarItemProps extends Omit<AriaLinkProps, 'children' | 'className' | 'style'> {
  /** Always visible – icons alone are ambiguous. */
  children: string;
  icon: ReactNode;
  isCurrent?: boolean;
  /** Something new (dot). Name it for screen readers with dotLabel. */
  dot?: boolean;
  dotLabel?: string;
}

/** One destination of the bottom tab bar: icon in a pill indicator, label below. */
export function TabBarItem({ children, icon, isCurrent, dot, dotLabel = 'new', ...props }: TabBarItemProps) {
  return (
    <li className="medo-tab-bar__entry">
      <AriaLink {...props} aria-current={isCurrent ? 'page' : undefined} className="medo-tab-bar-item">
        <TabBarIcon icon={icon} dot={dot} dotLabel={dotLabel} />
        <span className="medo-tab-bar-item__label">{children}</span>
      </AriaLink>
    </li>
  );
}

function TabBarIcon({ icon, dot, dotLabel }: { icon: ReactNode; dot?: boolean; dotLabel?: string }) {
  return (
    <span className="medo-tab-bar-item__indicator">
      <span className="medo-tab-bar-item__icon" aria-hidden="true">
        {icon}
      </span>
      {dot && <BadgeDot tone="danger" label={dotLabel} className="medo-tab-bar-item__dot" />}
    </span>
  );
}

export interface TabBarMoreProps {
  /** Label of the button and title of the sheet. */
  label?: string;
  /** NavItems for the remaining destinations (rendered large in the Nav sheet). */
  children: ReactNode;
  closeLabel?: string;
}

/** „More“: opens the remaining destinations in the Nav sheet (Bottom Sheet). Shows „current“ when one of them is. */
export function TabBarMore({ label = 'More', children, closeLabel }: TabBarMoreProps) {
  const hasCurrent = containsCurrent(children);
  return (
    <li className="medo-tab-bar__entry">
      <DialogTrigger>
        <AriaButton className="medo-tab-bar-item" aria-haspopup="dialog" data-current={hasCurrent || undefined}>
          <TabBarIcon icon={<Ellipsis />} />
          <span className="medo-tab-bar-item__label">{label}</span>
        </AriaButton>
        <BottomSheet title={label} closeLabel={closeLabel}>
          <nav aria-label={label} className="medo-nav-sheet">
            <NavVariantContext.Provider value="sheet">
              <ul className="medo-nav__list">{children}</ul>
            </NavVariantContext.Provider>
          </nav>
        </BottomSheet>
      </DialogTrigger>
    </li>
  );
}

/* ---------- Helpers ---------- */

/** True once the page is scrolled: headers show their divider. */
function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return scrolled;
}
