import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Globe, MapPin, Play } from 'lucide-react';
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { IconTile } from '../empty-state/EmptyState';
import { Link } from '../link/Link';
import { cx } from '../utils/cx';
import type { ImageRatio } from './Image';
import '../empty-state/empty-state.css';
import './media.css';

export type EmbedType = 'video' | 'map' | 'generic';

export interface EmbedTexts {
  title: string;
  /** Default size: who provides it and what is sent. */
  body: string;
  /** Compact size (< 480 px). */
  bodyCompact: string;
  load: string;
  remember: string;
  privacy: string;
}

/** Figma texts per type. provider: „YouTube“, „Google Maps“ · company: „Google“. */
export function defaultEmbedTexts(type: EmbedType, provider?: string, company?: string): EmbedTexts {
  const to = company ?? provider;
  if (type === 'video')
    return {
      title: 'Load external video',
      body: `This video is provided by ${provider ?? 'a third party'}. Loading it sends data such as your IP address to ${to ?? 'the provider'}.`,
      bodyCompact: `Loading this video sends data to ${provider && company && provider !== company ? `${provider} (${company})` : (to ?? 'a third party')}.`,
      load: 'Load video',
      remember: provider ? `Always load ${provider} videos` : 'Always load videos from this provider',
      privacy: 'Privacy policy',
    };
  if (type === 'map')
    return {
      title: 'Load map',
      body: `This map is provided by ${provider ?? 'a third party'}. Loading it sends data such as your IP address to ${to ?? 'the provider'}.`,
      bodyCompact: `Loading this map sends data to ${to ?? 'a third party'}.`,
      load: 'Load map',
      remember: provider ? `Always load ${provider}` : 'Always load maps from this provider',
      privacy: 'Privacy policy',
    };
  return {
    title: 'Load external content',
    body: `This content is provided by ${provider ?? 'a third party'}. Loading it sends data such as your IP address to ${to ?? 'the provider'}.`,
    bodyCompact: `Loading this content sends data to ${to ?? 'a third party'}.`,
    load: 'Load content',
    remember: provider ? `Always load content from ${provider}` : 'Always load content from this provider',
    privacy: 'Privacy policy',
  };
}

const icons = { video: <Play />, map: <MapPin />, generic: <Globe /> };

export interface EmbedConsentProps {
  type?: EmbedType;
  /** „YouTube“, „Google Maps“, „Vimeo“ … */
  provider?: string;
  /** Who receives the data, when it differs („Google“). */
  company?: string;
  /** The embed URL – requested only after consent. Prefer privacy-friendly URLs (youtube-nocookie.com). */
  src: string;
  /** Required: names the iframe („Video: Product tour“). */
  title: string;
  /** Ratio of the final embed. The placeholder may grow so text never clips. */
  ratio?: Exclude<ImageRatio, 'original'>;
  /** The provider's privacy policy (or your own). */
  privacyHref: string;
  /** Stored consent from the consent manager – loads at once. */
  isConsented?: boolean;
  /** The user clicked „Load“; `remember` = „Always load …“ checked – store it per provider in the consent manager. */
  onConsent?: (remember: boolean) => void;
  /** iframe permissions, e.g. „autoplay; encrypted-media; picture-in-picture; fullscreen“. */
  allow?: string;
  texts?: Partial<EmbedTexts>;
  className?: string;
}

/**
 * Embed consent – two-click placeholder for third-party embeds (Figma: C30 Embed consent, GDPR / TTDSG § 25).
 * Nothing loads from the provider – not even a thumbnail – until the user clicks. Then the iframe replaces the
 * placeholder in place and takes the focus. Compact below 480 px width (measured on the component).
 */
export function EmbedConsent({
  type = 'generic',
  provider,
  company,
  src,
  title,
  ratio = '16:9',
  privacyHref,
  isConsented,
  onConsent,
  allow,
  texts,
  className,
}: EmbedConsentProps) {
  const t = { ...defaultEmbedTexts(type, provider, company), ...texts };
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [clicked, setClicked] = useState(false);
  const [remember, setRemember] = useState(false);
  const [compact, setCompact] = useState(false);
  const loaded = isConsented || clicked;

  // Default from 480 px width, Compact below – the component's own width, not the viewport.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || loaded) return;
    const ro = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 480));
    ro.observe(el);
    return () => ro.disconnect();
  }, [loaded]);

  // After the click the iframe takes the focus, so keyboard users land in the content.
  useEffect(() => {
    if (clicked) frame.current?.focus();
  }, [clicked]);

  const style = { aspectRatio: ratio.replace(':', ' / ') };

  if (loaded) {
    return (
      <div className={cx('medo-embed', 'medo-embed--loaded', className)} style={style}>
        <iframe
          ref={frame}
          src={src}
          title={title}
          allow={allow}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="medo-embed__frame"
        />
      </div>
    );
  }

  return (
    <div ref={ref} role="region" aria-label={title} className={cx('medo-embed', compact && 'medo-embed--compact', className)} style={style}>
      {!compact && (
        <IconTile size="sm" tone="raised">
          {icons[type]}
        </IconTile>
      )}
      <div className="medo-embed__content">
        <p className="medo-embed__title">{t.title}</p>
        <p className="medo-embed__body">{compact ? t.bodyCompact : t.body}</p>
      </div>
      <div className="medo-embed__actions">
        <Button
          size={compact ? 'sm' : 'md'}
          onPress={() => {
            onConsent?.(remember);
            setClicked(true);
          }}
        >
          {t.load}
        </Button>
        <Link variant="standalone" size={compact ? 'sm' : 'md'} href={privacyHref}>
          {t.privacy}
        </Link>
      </div>
      {!compact && (
        <Checkbox isSelected={remember} onChange={setRemember}>
          {t.remember}
        </Checkbox>
      )}
    </div>
  );
}
