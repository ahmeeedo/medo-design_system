import { useLayoutEffect, useRef, useState } from 'react';
import { Breadcrumb, Breadcrumbs as AriaBreadcrumbs, Button as AriaButton, Link as AriaLink } from 'react-aria-components';
import { ChevronLeft, ChevronRight, Ellipsis, Folder, House } from 'lucide-react';
import { Menu, MenuItem, MenuTrigger } from '../menu/Menu';
import { Tooltip, TooltipLink, TooltipTrigger } from '../tooltip/Tooltip';
import { cx } from '../utils/cx';
import { MOBILE_QUERY, useMediaQuery } from '../utils/useMediaQuery';
import './breadcrumbs.css';

export interface BreadcrumbItem {
  /** The page name – the same words as its title. */
  label: string;
  /** Link to the page. The last item is the current page and needs none. */
  href?: string;
}

export interface BreadcrumbsProps {
  /** The path from the top: first the start page, last the current page (not a link). */
  items: BreadcrumbItem[];
  /** sm: dense apps (caption, 24) · md: websites (body/sm, 28). */
  size?: 'sm' | 'md';
  /** The first item shows a house icon; its label stays the accessible name („Home“). */
  homeIcon?: boolean;
  /** auto: full path, below 640 px only a link to the parent page · full · back. From 5 levels the middle collapses into „…“. */
  layout?: 'auto' | 'full' | 'back';
  /** Texts (localize). */
  'aria-label'?: string;
  moreLabel?: (count: number) => string;
  className?: string;
}

/**
 * Breadcrumbs – where a page sits in the hierarchy, with links to the levels above (Figma: C44 Breadcrumbs).
 * Built on React Aria Breadcrumbs: a navigation region with an ordered list, the current page last with
 * aria-current="page". Not on the start page; place it above the page title.
 */
export function Breadcrumbs({
  items,
  size = 'md',
  homeIcon = true,
  layout = 'auto',
  'aria-label': ariaLabel = 'Breadcrumb',
  moreLabel = (n) => `Show ${n} more levels`,
  className,
}: BreadcrumbsProps) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const back = layout === 'back' || (layout === 'auto' && mobile);

  // A single level needs no breadcrumbs.
  if (items.length < 2) return null;

  if (back) {
    const parent = items[items.length - 2];
    return (
      <nav aria-label={ariaLabel} className={cx('medo-breadcrumbs', `medo-breadcrumbs--${size}`, 'medo-breadcrumbs--back', className)}>
        <AriaLink href={parent.href} className="medo-breadcrumbs__link medo-breadcrumbs__back">
          <ChevronLeft className="medo-breadcrumbs__back-icon" aria-hidden="true" />
          <Label text={parent.label} />
        </AriaLink>
      </nav>
    );
  }

  // From 5 levels: start page, „…“, the last two levels and the current page.
  const collapse = items.length >= 5;
  const hidden = collapse ? items.slice(1, -3) : [];
  const shown = collapse ? [items[0], null, ...items.slice(-3)] : items;
  const last = shown.length - 1;

  return (
    <nav aria-label={ariaLabel} className={cx('medo-breadcrumbs', `medo-breadcrumbs--${size}`, className)}>
      <AriaBreadcrumbs className="medo-breadcrumbs__list">
        {shown.map((item, i) => {
          const separator = i < last && <ChevronRight className="medo-breadcrumbs__separator" aria-hidden="true" />;
          if (!item) {
            return (
              <Breadcrumb key="more" id="more" className="medo-breadcrumbs__item">
                <MenuTrigger>
                  <AriaButton aria-label={moreLabel(hidden.length)} className="medo-breadcrumbs__icon-part">
                    <Ellipsis aria-hidden="true" />
                  </AriaButton>
                  <Menu>
                    {hidden.map((h) => (
                      <MenuItem key={h.label} id={h.label} href={h.href} icon={<Folder />}>
                        {h.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </MenuTrigger>
                {separator}
              </Breadcrumb>
            );
          }
          const isHome = homeIcon && i === 0;
          return (
            <Breadcrumb key={`${i}-${item.label}`} id={`${i}-${item.label}`} className="medo-breadcrumbs__item">
              {isHome ? (
                <AriaLink href={item.href} aria-label={item.label} className="medo-breadcrumbs__icon-part">
                  <House aria-hidden="true" />
                </AriaLink>
              ) : i === last ? (
                // The current page: not a link (React Aria sets aria-current="page").
                <AriaLink className="medo-breadcrumbs__link medo-breadcrumbs__current">
                  <Label text={item.label} />
                </AriaLink>
              ) : (
                <TruncatedLink href={item.href} label={item.label} />
              )}
              {separator}
            </Breadcrumb>
          );
        })}
      </AriaBreadcrumbs>
    </nav>
  );
}

function Label({ text }: { text: string }) {
  return <span className="medo-breadcrumbs__label">{text}</span>;
}

/** A link whose label is cut at 200 px shows the full name in a Tooltip on hover and focus. */
function TruncatedLink({ href, label }: { href?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) setCut(el.scrollWidth > el.clientWidth);
  }, [label]);
  const text = (
    <span ref={ref} className="medo-breadcrumbs__label">
      {label}
    </span>
  );
  if (!cut) {
    return (
      <AriaLink href={href} className="medo-breadcrumbs__link">
        {text}
      </AriaLink>
    );
  }
  return (
    <TooltipTrigger>
      <TooltipLink href={href} className="medo-breadcrumbs__link">
        {text}
      </TooltipLink>
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}
