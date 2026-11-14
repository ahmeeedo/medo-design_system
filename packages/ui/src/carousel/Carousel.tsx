import {
  Children,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import { useMessages } from '../i18n/I18n';
import { cx } from '../utils/cx';

export interface CarouselProps {
  /** The slides or cards, one child per item. Each item becomes a group announced as “3 of 5”. */
  children: ReactNode;
  /** Heading above the carousel; it also names it. Without a title, set aria-label. */
  title?: ReactNode;
  /** Heading level of the title. Match the page outline (default h2). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Name of the carousel when there is no visible title. */
  'aria-label'?: string;
  /** single: one slide at a time, full width (media) · row: items side by side, the next one peeks in (cards). */
  layout?: 'single' | 'row';
  /** base: clean and compact · aesthetic: larger title, radius and controls, centered indicator. One style per page. */
  variant?: 'base' | 'aesthetic';
  /** Width of the items in a row: sm 280 · md 320 · lg 400 px (below 640 px: 240 · 280 · 300). Default: md, lg for aesthetic. */
  itemSize?: 'sm' | 'md' | 'lg';
  /** A “View all” link next to the title, e.g. to the full list. */
  viewAll?: { href: string; label?: string };
  /**
   * Moves on by itself – only for marketing heroes, never for content to read or act on. true: every 6 s; a number:
   * the interval in ms (at least 5000). Shows a Pause button, pauses on hover and focus, stops on the last slide and
   * stays off with reduced motion.
   */
  autoplay?: boolean | number;
  className?: string;
  style?: CSSProperties;
}

/** Up to this many slides the indicator shows dots, above it a counter “3 / 12”. */
const MAX_DOTS = 7;
const MIN_INTERVAL = 5000;
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Carousel (W3C carousel pattern) – a row of slides or cards, browsed by swipe, Previous / Next and, for single
 * slides, dots. Native scroll snapping: touch and trackpads scroll as usual. No loop: Previous is disabled on the
 * first position, Next on the last. Items that are not fully in view are inert, so Tab only reaches what is visible.
 * Controls sit outside the content and disappear when everything fits; on touch screens there are no arrows.
 */
export function Carousel({
  children,
  title,
  headingLevel = 2,
  'aria-label': ariaLabel,
  layout = 'row',
  variant = 'base',
  itemSize,
  viewAll,
  autoplay = false,
  className,
  style,
}: CarouselProps) {
  const m = useMessages();
  const titleId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState<boolean[]>(() => items.map((_, i) => i === 0));
  const [edges, setEdges] = useState({ start: true, end: true });
  const [keyboardScroll, setKeyboardScroll] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [paused, setPaused] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const [playing, setPlaying] = useState(false);
  const Heading = `h${headingLevel}` as const;
  const single = layout === 'single';
  const size = itemSize ?? (variant === 'aesthetic' ? 'lg' : 'md');
  const interval = typeof autoplay === 'number' ? Math.max(autoplay, MIN_INTERVAL) : 6000;

  // Position, ends and the items fully in view – read from the scroll position.
  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    const nearest = kids.reduce((best, kid, i) => (Math.abs(kid.offsetLeft - left) < Math.abs(kids[best].offsetLeft - left) ? i : best), 0);
    setIndex(nearest);
    setVisible(kids.map((kid) => kid.offsetLeft >= left - 1 && kid.offsetLeft + kid.offsetWidth <= right + 1));
    setEdges({ start: left <= 1, end: right >= el.scrollWidth - 1 });
  }, []);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    measure();
    // Without focusable content (images only), the scroll area itself takes the keyboard focus.
    setKeyboardScroll(!el.querySelector(FOCUSABLE));
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(onScroll);
    observer?.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [measure, total]);

  const goTo = useCallback(
    (target: number, byUser = true) => {
      const el = viewport.current;
      const kid = el?.children[Math.max(0, Math.min(target, total - 1))] as HTMLElement | undefined;
      if (!el || !kid) return;
      el.scrollTo({ left: kid.offsetLeft, behavior: reducedMotion() ? 'auto' : 'smooth' });
      // Changes the user makes are announced; slides that move on by themselves are not.
      if (byUser) setAnnounce(m.carousel.slideLabel(Math.max(0, Math.min(target, total - 1)) + 1, total));
    },
    [total, m],
  );

  // Autoplay: off with reduced motion, paused by the user, suspended on hover, focus and a hidden tab.
  useEffect(() => {
    setPlaying(Boolean(autoplay) && !paused && !reducedMotion());
  }, [autoplay, paused]);
  useEffect(() => {
    const onVisibility = () => setSuspended(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  useEffect(() => {
    if (!playing || suspended) return;
    if (edges.end) {
      // No loop: autoplay stops on the last slide.
      setPaused(true);
      return;
    }
    const timer = window.setTimeout(() => goTo(index + 1, false), interval);
    return () => window.clearTimeout(timer);
  }, [playing, suspended, index, edges.end, interval, goTo]);

  const scrolls = !(edges.start && edges.end);
  const dots = single && total > 1 && total <= MAX_DOTS;
  const counter = single && total > MAX_DOTS;
  const control = variant === 'aesthetic' ? 'md' : 'sm';

  const previous = (
    <IconButton
      variant="secondary"
      size={control}
      icon={<ChevronLeft />}
      aria-label={m.carousel.previous}
      isDisabled={edges.start}
      onPress={() => goTo(index - 1)}
      className="medo-carousel__arrow"
    />
  );
  const next = (
    <IconButton
      variant="secondary"
      size={control}
      icon={<ChevronRight />}
      aria-label={m.carousel.next}
      isDisabled={edges.end}
      onPress={() => goTo(index + 1)}
      className="medo-carousel__arrow"
    />
  );
  const pause = autoplay ? (
    <IconButton
      variant="secondary"
      size={control}
      icon={playing ? <Pause /> : <Play />}
      aria-label={playing ? m.carousel.pause : m.carousel.play}
      tooltip={false}
      onPress={() => setPaused(playing)}
    />
  ) : null;
  const indicator =
    dots || counter ? (
      <div className="medo-carousel__indicator">
        {dots ? (
          <div role="group" aria-label={m.carousel.slides} className="medo-carousel__dots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className="medo-carousel__dot"
                aria-label={m.carousel.dot(i + 1, total)}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : (
          <span className="medo-carousel__counter" aria-hidden="true">
            {`${index + 1} / ${total}`}
          </span>
        )}
      </div>
    ) : null;

  // Base: arrows next to the title of a row, below a single slide. Aesthetic: everything below, centered for single.
  const headerArrows = variant === 'base' && !single && scrolls;
  const showHeader = title || viewAll || headerArrows;
  const footer = scrolls && !headerArrows;

  return (
    <section
      aria-roledescription={m.carousel.carousel}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel}
      className={cx('medo-carousel', `medo-carousel--${variant}`, `medo-carousel--${layout}`, `medo-carousel--${size}`, className)}
      style={style}
      onPointerEnter={() => setSuspended(true)}
      onPointerLeave={() => setSuspended(false)}
      onFocus={() => setSuspended(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSuspended(false);
      }}
    >
      {showHeader && (
        <div className="medo-carousel__header">
          {title && (
            <Heading id={titleId} className="medo-carousel__title">
              {title}
            </Heading>
          )}
          {viewAll && (
            <Button variant="text" size="sm" href={viewAll.href} className="medo-carousel__view-all">
              {viewAll.label ?? m.carousel.viewAll}
            </Button>
          )}
          {headerArrows && (
            <div className="medo-carousel__controls">
              {previous}
              {next}
              {pause}
            </div>
          )}
        </div>
      )}
      <div
        ref={viewport}
        className="medo-carousel__viewport"
        {...(keyboardScroll && scrolls ? { tabIndex: 0, role: 'group', 'aria-label': m.carousel.slides } : {})}
      >
        {items.map((item, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription={m.carousel.slide}
            aria-label={m.carousel.slideLabel(i + 1, total)}
            className="medo-carousel__item"
            inert={!visible[i] || undefined}
          >
            {item}
          </div>
        ))}
      </div>
      {footer &&
        (variant === 'aesthetic' && single ? (
          <div className="medo-carousel__footer medo-carousel__footer--center">
            {previous}
            {indicator}
            {next}
            {pause}
          </div>
        ) : (
          <div className="medo-carousel__footer">
            {indicator}
            <div className="medo-carousel__controls">
              {previous}
              {next}
              {pause}
            </div>
          </div>
        ))}
      {/* Changes by Previous, Next and the dots; silent while autoplay runs (WCAG 4.1.3, W3C carousel). */}
      <p className="medo-visually-hidden" aria-live={playing && !suspended ? 'off' : 'polite'}>
        {announce}
      </p>
    </section>
  );
}
