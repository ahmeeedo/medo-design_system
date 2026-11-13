import { Children, createContext, isValidElement, useContext, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  type LinkProps as AriaLinkProps,
  type PressEvent,
} from 'react-aria-components';
import { ChevronDown, Ellipsis, Menu as MenuIcon, PanelLeft, X } from 'lucide-react';
import { Avatar } from '../avatar/Avatar';
import { BadgeCount, BadgeDot } from '../badge/Badge';
import { BottomSheet } from '../bottom-sheet/BottomSheet';
import { IconButton } from '../icon-button/IconButton';
import { Tooltip, TooltipLink, TooltipTrigger } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { useMediaQuery } from '../utils/useMediaQuery';
import { Drawer } from '../drawer/Drawer';
import { useMessages } from '../i18n/I18n';

/*
 * Navigation – med.o Design System
 * Navigation is always made of links in a named <nav> region; the current page has aria-current="page".
 * One NavItem renders in four forms, chosen by the container: header · sidebar · rail · sheet.
 */

export type NavVariant = 'header' | 'sidebar' | 'rail' | 'sheet';
const NavVariantContext = createContext<NavVariant>('sidebar');

/** Side navigation: groups in the rail expand it (with the group open); links in the tablet drawer close it. */
const SideNavContext = createContext<{ expand: (group?: string) => void; openGroup?: string; onNavigate?: () => void } | null>(null);

/** An overlay that holds nav links (the fullscreen menu): closes when one of them is chosen, also with client-side routing. */
const NavCloseContext = createContext<(() => void) | null>(null);

/** How deep a NavGroup sits (0 at the top) and whether it is inside a header dropdown. Sidebar and sheet allow two levels. */
const NavGroupDepthContext = createContext<{ depth: number; inHeader: boolean }>({ depth: 0, inHeader: false });

// Bundlers replace process.env.NODE_ENV at build time; without one, process may not exist.
declare const process: { env: { NODE_ENV?: string } } | undefined;

const TABLET_QUERY = '(min-width: 640px) and (max-width: 1023.98px)';

/* ---------- Nav item ---------- */

export interface NavItemProps extends Omit<AriaLinkProps, 'children' | 'className' | 'style'> {
  /** Required. 1–2 words, a noun – the same name in header, sidebar, tab bar and page title. */
  children: string;
  /** Sidebar, rail and sheet: icon before the label (decorative). Header items have no icon. */
  icon?: ReactNode;
  /** Icon after the label (decorative), e.g. ExternalLink for a page on another site. Hidden in the rail. */
  endIcon?: ReactNode;
  /** target="_blank" adds rel="noopener noreferrer" and this hidden text. Default: built-in text (“(opens in a new tab)”). */
  newTabLabel?: string;
  /** The current page (exactly one). Marked with aria-current="page" and action/selected. */
  isCurrent?: boolean;
  /** Number in the item (Badge count, neutral). */
  count?: number;
  /** Screen-reader text of the count (“3 unread”, “12 projects”). */
  countLabel?: string;
  /** The count is new or unread: in the rail it turns into a dot. Plain totals (“12 projects”) are hidden there. */
  unread?: boolean;
}

/**
 * One navigation link. Built on React Aria Link, so client-side routing works
 * with any router through RouterProvider. The container decides the form (header, sidebar, rail, sheet).
 */
export function NavItem({ children, icon, endIcon, newTabLabel, isCurrent, count, countLabel, unread, ...props }: NavItemProps) {
  const m = useMessages();
  const variant = useContext(NavVariantContext);
  const newTab = props.target === '_blank';
  const sideNav = useContext(SideNavContext);
  const closeOverlay = useContext(NavCloseContext);
  const rail = variant === 'rail';
  const content = (
    <>
      {icon && variant !== 'header' && (
        <span className="medo-nav-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={rail ? 'medo-visually-hidden' : 'medo-nav-item__label'}>
        {children}
        {newTab && <span className="medo-visually-hidden"> {newTabLabel ?? m.common.newTab}</span>}
      </span>
      {endIcon && !rail && (
        <span className="medo-nav-item__icon medo-nav-item__end-icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
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
    rel: newTab ? (props.rel ?? 'noopener noreferrer') : props.rel,
    onPress: (e: PressEvent) => {
      props.onPress?.(e);
      sideNav?.onNavigate?.();
      closeOverlay?.();
    },
    'aria-current': isCurrent ? ('page' as const) : undefined,
    className: cx('medo-nav-item', `medo-nav-item--${variant}`),
  };
  return (
    <li className="medo-nav__entry">
      {rail ? (
        // Collapsed: the label appears as tooltip on hover and focus.
        <TooltipTrigger>
          <TooltipLink {...linkProps}>{content}</TooltipLink>
          <Tooltip placement="end">{children}</Tooltip>
        </TooltipTrigger>
      ) : (
        <AriaLink {...linkProps}>{content}</AriaLink>
      )}
    </li>
  );
}

/* ---------- Group (dropdown in the header, accordion elsewhere) ---------- */

export interface NavGroupProps {
  /** Label of the group button. */
  label: string;
  /** Sidebar, rail and sheet: icon before the label. */
  icon?: ReactNode;
  /** NavItems. In the sidebar and the sheet also NavGroups, for a second level (Components › Actions › Button) – never deeper. */
  children: ReactNode;
  /** Open at start. Default: open when it contains the current page (sidebar, sheet). */
  defaultOpen?: boolean;
}

/** True when a NavItem child – or a NavItem in a nested NavGroup – is the current page. */
function containsCurrent(children: ReactNode): boolean {
  return Children.toArray(children).some((c) => {
    if (!isValidElement(c)) return false;
    const props = (c as ReactElement<NavItemProps & NavGroupProps>).props;
    return c.type === NavGroup ? containsCurrent(props.children) : Boolean(props.isCurrent);
  });
}

/**
 * A group of links behind a disclosure button (aria-expanded) – never a menu.
 * Header: a dropdown panel on the popover surface; Tab moves through the links, Esc or a click outside closes.
 * Sidebar and sheet: opens in place, up to two levels; a nested group indents one more step.
 * A group shows “current” only while it is closed. Header and rail: one level.
 */
export function NavGroup({ label, icon, children, defaultOpen }: NavGroupProps) {
  const variant = useContext(NavVariantContext);
  const sideNav = useContext(SideNavContext);
  const { depth, inHeader } = useContext(NavGroupDepthContext);
  const tooDeep = depth > 1 || (depth > 0 && inHeader);
  useEffect(() => {
    if (!tooDeep || (typeof process !== 'undefined' && process.env.NODE_ENV === 'production')) return;
    console.warn(`@med-o/ui: NavGroup “${label}” is nested too deep. Sidebar and sheet take two levels, header and rail one.`);
  }, [tooDeep, label]);
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
        <NavGroupDepthContext.Provider value={{ depth: depth + 1, inHeader: inHeader || floating }}>
          <ul id={panelId} hidden={!open} className={cx('medo-nav__list', floating ? 'medo-nav-group__panel' : 'medo-nav-group__list')}>
            {children}
          </ul>
        </NavGroupDepthContext.Provider>
      </NavVariantContext.Provider>
    </li>
  );
}

/* ---------- Nav list ---------- */

export interface NavListProps {
  /** Form of the items: header (row) · sidebar · rail · sheet. */
  variant?: NavVariant;
  /** Name of the navigation region (“Footer”, “Account”). */
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
  /** Overline heading (“Workspace”). In the rail the section is divided by a line. */
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

/** “Skip to content” – the first focusable element on every page (WCAG 2.4.1). Visible on focus only. */
export function SkipLink({ href = '#main', children }: SkipLinkProps) {
  const m = useMessages();
  return (
    <a href={href} className="medo-skip-link">
      {children ?? m.navigation.skipToContent}
    </a>
  );
}

/* ---------- Action links (header actions that navigate) ---------- */

export interface NavAction {
  label: string;
  /** Usually a link (“Log in”, “Get started”). */
  href?: string;
  onPress?: (e: PressEvent) => void;
  /** primary: max one · secondary · ghost. */
  variant?: 'primary' | 'secondary' | 'ghost';
}

/** Link (or press action) with the Button look – the actions of the website header. */
function ActionLink({ action, size }: { action: NavAction; size: 'sm' | 'md' | 'lg' }) {
  const closeOverlay = useContext(NavCloseContext);
  return (
    <AriaLink
      href={action.href}
      onPress={(e) => {
        action.onPress?.(e);
        closeOverlay?.();
      }}
      className={cx('medo-button', `medo-button--${action.variant ?? 'ghost'}`, `medo-button--${size}`)}>
      <span className="medo-button__label">{action.label}</span>
    </AriaLink>
  );
}

/* ---------- Website header ---------- */

export interface SiteHeaderProps {
  /** Logo link with a name (“med.o home”). */
  logo: ReactNode;
  /** NavItems and NavGroups – max 5 links; more go into a group. */
  children: ReactNode;
  /** start: links after the logo (default) · center: links in the middle of the header. */
  align?: 'start' | 'center';
  /**
   * Right side of the header. A list: max 2 actions, at most one primary (last); on mobile the primary stays in the
   * bar and all are pinned at the bottom of the menu (lg). Free content (search, links, a menu): shown from 768 px.
   */
  actions?: NavAction[] | ReactNode;
  /** Below 768 px: content next to the menu button, e.g. a search button. Default: the primary action of a list. */
  compactActions?: ReactNode;
  /** Extra sections in the fullscreen menu, between the links and the pinned actions: resources, a theme select, a docs tree. */
  menuContent?: ReactNode;
  /** Pinned at the bottom of the fullscreen menu, after the actions of a list: free content such as a theme select or a feedback button (size lg). */
  menuActions?: ReactNode;
  /** Icon of the menu button below 768 px. Default: the menu (hamburger) icon. */
  menuIcon?: ReactNode;
  /** Name of the navigation region. */
  'aria-label'?: string;
  /** Mobile: label of the menu button and title of the fullscreen menu. */
  menuLabel?: string;
  /** Close button of the fullscreen menu. Default: built-in text. */
  closeLabel?: string;
  /** auto: menu button below 768 px (CSS, so static pages do not jump) · desktop · mobile (forced, e.g. for previews). */
  layout?: 'auto' | 'desktop' | 'mobile';
}

/**
 * Website header: logo, links, actions. Sticky, with a divider once the page scrolls.
 * Below 768 px only the logo, the compact actions and a menu button remain; the menu opens fullscreen.
 * Both layouts are rendered and CSS shows one (layout="auto"), so prerendered pages are right before hydration.
 */
export function SiteHeader({
  logo,
  children,
  align = 'start',
  actions = [],
  compactActions,
  menuContent,
  menuActions,
  menuIcon,
  'aria-label': labelProp,
  menuLabel: menuLabelProp,
  closeLabel: closeLabelProp,
  layout = 'auto',
}: SiteHeaderProps) {
  const m = useMessages();
  const label = labelProp ?? m.navigation.main;
  const menuLabel = menuLabelProp ?? m.navigation.menu;
  const closeLabel = closeLabelProp ?? m.common.close;
  const scrolled = useScrolled();
  const list = Array.isArray(actions) ? (actions as NavAction[]) : null;
  const primary = list?.find((a) => a.variant === 'primary');
  const wideActions = list ? (
    list.length > 0 ? (
      list.map((a) => <ActionLink key={a.label} action={a} size="md" />)
    ) : null
  ) : (
    (actions as ReactNode)
  );
  const narrowActions = compactActions ?? (primary ? <ActionLink action={primary} size="sm" /> : null);
  return (
    <header
      className={cx('medo-site-header', `medo-site-header--${align}`, layout !== 'auto' && `medo-site-header--${layout === 'mobile' ? 'compact' : 'wide'}`)}
      data-scrolled={scrolled || undefined}
    >
      <div className="medo-site-header__logo">{logo}</div>
      {layout !== 'mobile' && (
        <>
          <nav aria-label={label} className="medo-site-header__nav medo-site-header__wide">
            <NavVariantContext.Provider value="header">
              <ul className="medo-nav__list medo-nav__list--row">{children}</ul>
            </NavVariantContext.Provider>
          </nav>
          {wideActions && <div className="medo-site-header__actions medo-site-header__wide">{wideActions}</div>}
        </>
      )}
      {layout !== 'desktop' && (
        <div className="medo-site-header__actions medo-site-header__narrow">
          {narrowActions}
          <NavFullscreen logo={logo} actions={list ?? []} menuContent={menuContent} menuActions={menuActions} menuIcon={menuIcon} aria-label={label} menuLabel={menuLabel} closeLabel={closeLabel}>
            {children}
          </NavFullscreen>
        </div>
      )}
    </header>
  );
}

/** Fullscreen menu of the website on mobile: large links, groups inline, extra sections, actions at the bottom. */
function NavFullscreen({
  logo,
  actions,
  menuContent,
  menuActions,
  menuIcon,
  children,
  'aria-label': label,
  menuLabel,
  closeLabel,
}: Required<Pick<SiteHeaderProps, 'logo' | 'children' | 'aria-label' | 'menuLabel' | 'closeLabel'>> & {
  actions: NavAction[];
  menuContent?: ReactNode;
  menuActions?: ReactNode;
  menuIcon?: ReactNode;
}) {
  // Primary first when stacked – in thumb reach.
  const ordered = [...actions].sort((a, b) => Number(b.variant === 'primary') - Number(a.variant === 'primary'));
  return (
    <DialogTrigger>
      <IconButton variant="ghost" size="md" icon={menuIcon ?? <MenuIcon />} aria-label={menuLabel} tooltip={false} />
      <ModalOverlay className="medo-nav-fullscreen-overlay">
        <Modal className="medo-nav-fullscreen">
          <AriaDialog aria-label={menuLabel} className="medo-nav-fullscreen__dialog">
            {({ close }) => (
              // Choosing a link (page, extra section or action) closes the menu – a client-side router keeps the page.
              <NavCloseContext.Provider value={close}>
                <div className="medo-nav-fullscreen__header">
                  <div className="medo-site-header__logo">{logo}</div>
                  <IconButton variant="ghost" size="md" icon={<X />} aria-label={closeLabel} tooltip={false} onPress={close} />
                </div>
                {/* Links and extra sections scroll together; the actions stay pinned at the bottom. */}
                <div className="medo-nav-fullscreen__body">
                  <nav aria-label={label} className="medo-nav-fullscreen__nav">
                    <NavVariantContext.Provider value="sheet">
                      <ul className="medo-nav__list">{children}</ul>
                    </NavVariantContext.Provider>
                  </nav>
                  {menuContent && <div className="medo-nav-fullscreen__content">{menuContent}</div>}
                </div>
                {(ordered.length > 0 || menuActions) && (
                  <div className="medo-nav-fullscreen__actions">
                    {ordered.map((a) => (
                      <ActionLink key={a.label} action={a.variant === 'ghost' || !a.variant ? { ...a, variant: 'secondary' } : a} size="lg" />
                    ))}
                    {menuActions}
                  </div>
                )}
              </NavCloseContext.Provider>
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

/** App header: page title, search and actions. Navigation lives in the side navigation. */
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
 * Side navigation for apps: 280 px with icons, counts, sections and groups;
 * collapses to a 64 px rail with tooltips. 640–1023 px: always a rail; expanding opens the full navigation
 * as a Drawer on the left. Below 640 px it is hidden – use the BottomTabBar there.
 */
export function SideNav({
  logo,
  logoMark,
  children,
  user,
  isCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  'aria-label': labelProp,
  collapseLabel: collapseLabelProp,
  expandLabel: expandLabelProp,
  closeLabel: closeLabelProp,
}: SideNavProps) {
  const m = useMessages();
  const label = labelProp ?? m.navigation.app;
  const collapseLabel = collapseLabelProp ?? m.navigation.collapse;
  const expandLabel = expandLabelProp ?? m.navigation.expand;
  const closeLabel = closeLabelProp ?? m.common.close;
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
 * Bottom tab bar: the main destinations of an app on phones, in thumb reach.
 * Max 4 destinations + “More”. Fixed to the bottom with the safe area; set `--medo-toast-offset` so toasts stay above it.
 */
export function BottomTabBar({ children, 'aria-label': labelProp, display = 'mobile' }: BottomTabBarProps) {
  const m = useMessages();
  const label = labelProp ?? m.navigation.app;
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

/** “More”: opens the remaining destinations in the Nav sheet (Bottom Sheet). Shows “current” when one of them is. */
export function TabBarMore({ label: labelProp, children, closeLabel }: TabBarMoreProps) {
  const m = useMessages();
  const label = labelProp ?? m.common.more;
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
/** True once the page has scrolled – for a divider under a sticky header (SiteHeader and AppHeader use it). */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return scrolled;
}
