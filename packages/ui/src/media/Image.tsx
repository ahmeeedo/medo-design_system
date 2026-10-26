import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react';
import { ImageOff, Play } from 'lucide-react';
import { Skeleton } from '../progress/Progress';
import { cx } from '../utils/cx';
import './media.css';

export type ImageRatio = '1:1' | '3:4' | '4:3' | '3:2' | '16:9' | '21:9' | 'original';

/* ---------- Media play button ---------- */

export interface MediaPlayButtonProps {
  /** md 48 (cards, lists) · lg 64 (hero, player). */
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * Media play button – marks video on a thumbnail (Figma: C30 Media play button). Visual only: the whole
 * thumbnail is the hit area (a link or button around it); hover, pressed and focus come from there.
 */
export function MediaPlayButton({ size = 'md', className }: MediaPlayButtonProps) {
  return (
    <span className={cx('medo-media-play', `medo-media-play--${size}`, className)} aria-hidden="true">
      <Play />
    </span>
  );
}

/* ---------- Image ---------- */

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src' | 'placeholder' | 'children' | 'className' | 'style'> {
  /** Without src the image stays in its loading state (e.g. while the URL is resolved). */
  src?: string;
  /** Required. Describe the purpose, not the pixels. Decorative images: alt="" on purpose. */
  alt: string;
  /** Reserves the space before the file arrives. original: from width/height (fallback 3:2 while loading). */
  ratio?: ImageRatio;
  /** cover: photos (fills, crops) · contain: logos, screenshots, product shots, charts (shows everything). */
  fit?: 'cover' | 'contain';
  /** Default radius/md; in cards the image takes the card's radius (none). */
  radius?: 'none' | 'sm' | 'md' | 'lg';
  /** 1 px border/media inside – for images on a similar background. */
  bordered?: boolean;
  /** Tiny preview (≈ 20 px, data URI) for blur-up. Without it a Skeleton shows. */
  placeholder?: string;
  /** Hero / largest image at the top: loads first (eager, fetchpriority high). Everything else loads lazily. */
  priority?: boolean;
  /** Text on a gradient – translatable, searchable, read by screen readers. Never bake text into images. */
  overlay?: { title: ReactNode; meta?: ReactNode; position?: 'bottom' | 'top' };
  /** One Badge (sm), top left. */
  badge?: ReactNode;
  /** Marks video. */
  play?: 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

/**
 * Image – an image with reserved space and calm loading states (Figma: C30 Image). Loading: blur-up preview or
 * Skeleton; the image fades in (250 ms; 100 ms with reduced motion). Error keeps the space and shows image-off;
 * the alt text stays available. Overlays (text, badge, play) only on the loaded image.
 */
export function Image({
  src,
  alt,
  ratio = 'original',
  fit = 'cover',
  radius = 'md',
  bordered,
  placeholder,
  priority,
  overlay,
  badge,
  play,
  className,
  style,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  // A new source starts loading again.
  useLayoutEffect(() => setState('loading'), [src]);

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && src) setState(img.naturalWidth > 0 ? 'loaded' : 'error');
  }, [src]);

  const original = ratio === 'original';
  const { width, height } = props;
  const aspect = original ? (width && height ? `${width} / ${height}` : state === 'loaded' ? undefined : '3 / 2') : ratio.replace(':', ' / ');

  return (
    <div
      className={cx('medo-image', `medo-image--${fit}`, `medo-image--radius-${radius}`, bordered && 'medo-image--bordered', className)}
      data-state={state}
      style={{ aspectRatio: aspect, ...style }}
    >
      {state === 'loading' &&
        (placeholder ? <img className="medo-image__preview" src={placeholder} alt="" aria-hidden="true" /> : <Skeleton shape="rect" className="medo-image__skeleton" />)}
      {state === 'error' && (
        <span className="medo-image__error" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
          <ImageOff aria-hidden="true" />
        </span>
      )}
      <img
        {...props}
        ref={ref}
        src={src}
        alt={alt}
        hidden={state === 'error'}
        loading={priority ? 'eager' : (props.loading ?? 'lazy')}
        fetchPriority={priority ? 'high' : props.fetchPriority}
        decoding="async"
        className="medo-image__img"
        onLoad={(e) => {
          setState('loaded');
          onLoad?.(e);
        }}
        onError={(e) => {
          setState('error');
          onError?.(e);
        }}
      />
      {state === 'loaded' && overlay && (
        <div className={cx('medo-image__overlay', `medo-image__overlay--${overlay.position ?? 'bottom'}`)}>
          <span className="medo-image__title">{overlay.title}</span>
          {overlay.meta && <span className="medo-image__meta">{overlay.meta}</span>}
        </div>
      )}
      {state === 'loaded' && badge && <span className="medo-image__badge">{badge}</span>}
      {state === 'loaded' && play && <MediaPlayButton size={play} className="medo-image__play" />}
    </div>
  );
}

/* ---------- Figure ---------- */

export interface FigureProps {
  /** The Image. */
  children: ReactNode;
  /** Describes what matters (adds to the image – never repeat the alt text). */
  caption?: ReactNode;
  /** Names the source („© Photographer“). */
  credit?: ReactNode;
  className?: string;
}

/** Figure – image with caption and credit (Figma: C30 Figure). A real figure + figcaption. */
export function Figure({ children, caption, credit, className }: FigureProps) {
  return (
    <figure className={cx('medo-figure', className)}>
      {children}
      {(caption || credit) && (
        <figcaption className="medo-figure__caption">
          {caption && <span>{caption}</span>}
          {credit && <span className="medo-figure__credit">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
