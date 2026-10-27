import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Building2, User } from 'lucide-react';
import { cx } from '../utils/cx';
import './avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

const TONES = ['blue', 'violet', 'pink', 'amber', 'green', 'teal'] as const;
/** Size for avatars inside a group or a list row (internal, set by the container). */
export const AvatarSizeContext = createContext<AvatarSize | undefined>(undefined);

/** Same input, same tone: a small string hash modulo 6. */
function toneFor(key: string) {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.codePointAt(0)!) | 0;
  return TONES[Math.abs(hash) % TONES.length];
}

/** First letters of first and last name; one word: first two letters. */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join('').toUpperCase();
  return (Array.from(words[0])[0] + Array.from(words[words.length - 1])[0]).toUpperCase();
}

const STATUS_TEXT: Record<AvatarStatus, string> = { online: 'online', away: 'away', busy: 'busy', offline: 'offline' };

export interface AvatarProps {
  /** Person or organization name. Used for alt text, initials and (without `colorKey`) the tone. */
  name?: string;
  /** Photo URL. Falls back to initials if it is missing or fails to load. */
  src?: string;
  /** xs 20 · sm 24 · md 32 · lg 40 · xl 56 · 2xl 80 px. */
  size?: AvatarSize;
  /** circle = person · square = organization, team, workspace. */
  shape?: 'circle' | 'square';
  /** Stable id (user id) for the initials colour, so it survives name changes. */
  colorKey?: string;
  /** Presence dot. Also added to the accessible name (“Lea M., online”). */
  status?: AvatarStatus;
  /** Words for the status in the accessible name. */
  statusLabels?: Partial<Record<AvatarStatus, string>>;
  /** Next to a visible name the avatar is decorative and hidden from screen readers. */
  decorative?: boolean;
  /** Accessible name when the name is unknown (guest, deleted account). */
  unknownLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/** Avatar – picture of a person or organization with fallback image → initials → icon. */
export function Avatar({
  name,
  src,
  size,
  shape = 'circle',
  colorKey,
  status,
  statusLabels,
  decorative,
  unknownLabel,
  className,
  style,
}: AvatarProps) {
  const groupSize = useContext(AvatarSizeContext);
  const finalSize = size ?? groupSize ?? 'md';
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const initials = name ? initialsOf(name) : '';
  const showImage = Boolean(src) && !failed;
  const tone = initials ? toneFor(colorKey ?? name!) : 'neutral';
  const statusText = status ? (statusLabels?.[status] ?? STATUS_TEXT[status]) : undefined;
  const fallbackName = unknownLabel ?? (shape === 'square' ? 'Unknown organization' : 'Unknown person');
  const label = [name || fallbackName, statusText].filter(Boolean).join(', ');

  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cx(
        'medo-avatar',
        `medo-avatar--${finalSize}`,
        `medo-avatar--${shape}`,
        `medo-avatar--${tone}`,
        showImage && 'medo-avatar--has-image',
        className,
      )}
      style={style}
    >
      {initials ? (
        <span className="medo-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <span className="medo-avatar__icon" aria-hidden="true">
          {shape === 'square' ? <Building2 /> : <User />}
        </span>
      )}
      {showImage && <img className="medo-avatar__image" src={src} alt="" onError={() => setFailed(true)} />}
      {status && <span className={cx('medo-avatar__status', `medo-avatar__status--${status}`)} aria-hidden="true" />}
    </span>
  );
}

export interface AvatarGroupProps {
  /** Avatars, most relevant first (owner, you). */
  children: ReactNode;
  /** Visible avatars before “+N”. */
  max?: number;
  /** xs · sm · md · lg. */
  size?: Exclude<AvatarSize, 'xl' | '2xl'>;
  /** Name of the group, e.g. “Assignees”. */
  'aria-label': string;
  /** Opens the full list (e.g. a popover). Without it “+N” is plain text. */
  onMorePress?: () => void;
  /** Accessible name of “+N”. Default: “N more”. */
  moreLabel?: (count: number) => string;
  className?: string;
}

/** Overlapping avatars, max 4 + “+N”. */
export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  onMorePress,
  moreLabel = (n) => `${n} more`,
  className,
  ...props
}: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  const moreClass = cx('medo-avatar', `medo-avatar--${size}`, 'medo-avatar--circle', 'medo-avatar--neutral', 'medo-avatar--more');

  return (
    <div role="group" aria-label={props['aria-label']} className={cx('medo-avatar-group', `medo-avatar-group--${size}`, className)}>
      <AvatarSizeContext.Provider value={size}>
        {visible.map((child, i) =>
          // The first avatar sits on top.
          isValidElement<AvatarProps>(child)
            ? cloneElement(child as ReactElement<AvatarProps>, { style: { ...child.props.style, zIndex: visible.length - i } })
            : child,
        )}
      </AvatarSizeContext.Provider>
      {hidden > 0 &&
        (onMorePress ? (
          <AriaButton className={moreClass} onPress={onMorePress} aria-label={moreLabel(hidden)}>
            +{hidden}
          </AriaButton>
        ) : (
          <span className={moreClass} role="img" aria-label={moreLabel(hidden)}>
            +{hidden}
          </span>
        ))}
    </div>
  );
}
