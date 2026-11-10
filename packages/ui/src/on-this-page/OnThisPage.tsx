import { useEffect, useId, useState, type MouseEvent } from 'react';
import { Button as AriaButton, Disclosure, DisclosurePanel } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { cx } from '../utils/cx';
import { useMessages } from '../i18n/I18n';

/*
 * On this page – med.o Design System
 * Links to the sections of a long page, in a named <nav> region.
 *   rail        sticky next to the content (desktop), marks the current section with aria-current="location"
 *   disclosure  a button below the page header (mobile), closes after a jump
 */

export interface OnThisPageItem {
  /** Id of the target element on the page, usually the section heading. */
  id: string;
  /** Short section title, the same words as the heading. */
  label: string;
}

export interface OnThisPageProps {
  /** Sections in page order. 3 or more – with fewer, leave the component out. */
  items: OnThisPageItem[];
  /** rail: desktop, next to the content. disclosure: mobile, below the page header. */
  variant?: 'rail' | 'disclosure';
  /** Title and name of the navigation region. Default: built-in text (“On this page”). */
  label?: string;
  className?: string;
}

/** Id of the last section whose target has passed the upper third of the viewport. */
function useCurrentSection(ids: string[], enabled: boolean) {
  const [current, setCurrent] = useState<string | undefined>(ids[0]);
  const key = ids.join('\u0000');
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.max(96, window.innerHeight * 0.3);
      let next = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) next = id;
      }
      setCurrent(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
    // ids are compared by value through key, so a new array with the same ids does not restart the listener.
  }, [key, enabled]);
  return [current, setCurrent] as const;
}

/** Scrolls to the target, moves focus there (for keyboard and screen reader users) and updates the address. */
function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
}

/**
 * On this page – links to the sections of a long page. Use the rail next to the content on wide screens and the
 * disclosure below the page header on small ones; render both and show one with CSS, or pick one by viewport.
 * Links are plain anchors (#id), so they work without JavaScript; with it, the jump is smooth and moves focus.
 */
export function OnThisPage({ items, variant = 'rail', label, className }: OnThisPageProps) {
  const m = useMessages();
  const title = label ?? m.onThisPage.label;
  const titleId = useId();
  const [current, setCurrent] = useCurrentSection(
    items.map((i) => i.id),
    variant === 'rail',
  );
  const [open, setOpen] = useState(false);

  if (!items.length) return null;

  const list = (
    <ol className="medo-on-this-page__list">
      {items.map((item) => {
        const isCurrent = variant === 'rail' && current === item.id;
        return (
          <li key={item.id}>
            <a
              className="medo-on-this-page__link"
              href={`#${item.id}`}
              aria-current={isCurrent ? 'location' : undefined}
              data-current={isCurrent || undefined}
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                // Modified clicks (new tab, new window) keep the browser default.
                if (!document.getElementById(item.id) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                setCurrent(item.id);
                if (variant === 'disclosure') {
                  // Close first, then scroll: the closed panel no longer shifts the target.
                  setOpen(false);
                  requestAnimationFrame(() => scrollToSection(item.id));
                } else scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === 'disclosure') {
    return (
      <nav aria-label={title} className={cx('medo-on-this-page', 'medo-on-this-page--disclosure', className)}>
        <Disclosure isExpanded={open} onExpandedChange={setOpen} className="medo-on-this-page__disclosure">
          <AriaButton slot="trigger" className="medo-on-this-page__trigger">
            <span>{title}</span>
            <ChevronDown className="medo-on-this-page__chevron" aria-hidden="true" />
          </AriaButton>
          <DisclosurePanel className="medo-on-this-page__panel">{list}</DisclosurePanel>
        </Disclosure>
      </nav>
    );
  }

  return (
    <nav aria-labelledby={titleId} className={cx('medo-on-this-page', 'medo-on-this-page--rail', className)}>
      <p id={titleId} className="medo-on-this-page__title">
        {title}
      </p>
      {list}
    </nav>
  );
}
