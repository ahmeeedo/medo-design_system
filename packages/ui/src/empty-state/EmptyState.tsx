import { useId, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Folder, Lock, Search } from 'lucide-react';
import { Button } from '../button/Button';
import { Link } from '../link/Link';
import { cx } from '../utils/cx';
import './empty-state.css';

export type EmptyStateType = 'first-use' | 'no-results' | 'error' | 'no-access' | 'all-done';
export type EmptyStateSize = 'page' | 'section' | 'inline';

export interface EmptyStateAction {
  /** Verb that says what happens („Create project“, „Clear filters“, „Try again“). */
  label: string;
  /** Runs the action. */
  onPress?: () => void;
  /** Second action only: navigates – rendered as a Link („Learn more“, „View archive“). */
  href?: string;
  isDisabled?: boolean;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Sets the default icon, its tone and the look of the main action. */
  type?: EmptyStateType;
  /** page: a whole view · section: a card or panel · inline: inside a list or table (header stays). */
  size?: EmptyStateSize;
  /** Required. The situation in plain words – never „No data“. */
  title: ReactNode;
  /** Why it is empty or what comes next, in one or two sentences. */
  description?: ReactNode;
  /** Main action: primary for first use, secondary for all other types. „All done“ needs none. */
  action?: EmptyStateAction;
  /** Second action as a text button, or a Link with `href`. */
  secondaryAction?: EmptyStateAction;
  /** Replaces the type's default icon (Lucide). */
  icon?: ReactNode;
  /** Illustration instead of the icon – only from the shared illustration style. Decorative. */
  illustration?: ReactNode;
  /** Heading level of the title (page and section). Match the page outline. Default: page h2, section h3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const defaults: Record<EmptyStateType, { icon: ReactNode; tone: IconTileTone }> = {
  'first-use': { icon: <Folder />, tone: 'neutral' },
  'no-results': { icon: <Search />, tone: 'neutral' },
  error: { icon: <CircleAlert />, tone: 'danger' },
  'no-access': { icon: <Lock />, tone: 'neutral' },
  'all-done': { icon: <CircleCheck />, tone: 'success' },
};

const tileSize = { page: 'lg', section: 'md', inline: 'sm' } as const;

/**
 * Empty state – what users see when there is nothing to show, and what they can do next (Figma: C36 Empty state).
 * Page and section render a `<section>` named by its heading; inline renders a plain block, so it does not add
 * a landmark inside a list or table. „No results“ puts its text in a polite status region; focus stays where it was.
 */
export function EmptyState({
  type = 'first-use',
  size = 'page',
  title,
  description,
  action,
  secondaryAction,
  icon,
  illustration,
  headingLevel,
  className,
  ...props
}: EmptyStateProps) {
  const titleId = useId();
  const { icon: defaultIcon, tone } = defaults[type];
  const isInline = size === 'inline';
  const Tag: ElementType = isInline ? 'div' : 'section';
  const Title: ElementType = isInline ? 'p' : `h${headingLevel ?? (size === 'page' ? 2 : 3)}`;
  const buttonSize = size === 'page' ? 'md' : 'sm';

  return (
    <Tag {...props} aria-labelledby={isInline ? undefined : titleId} className={cx('medo-empty-state', `medo-empty-state--${size}`, className)}>
      {illustration ? (
        <span className="medo-empty-state__illustration" aria-hidden="true">
          {illustration}
        </span>
      ) : (
        <IconTile size={tileSize[size]} tone={tone}>
          {icon ?? defaultIcon}
        </IconTile>
      )}
      {/* „No results“ after a search or filter is announced politely. */}
      <div className="medo-empty-state__content" role={type === 'no-results' ? 'status' : undefined}>
        <Title id={titleId} className="medo-empty-state__title">
          {title}
        </Title>
        {description && <p className="medo-empty-state__description">{description}</p>}
      </div>
      {(action || secondaryAction) && (
        <div className="medo-empty-state__actions">
          {action && (
            <Button variant={type === 'first-use' ? 'primary' : 'secondary'} size={buttonSize} onPress={action.onPress} isDisabled={action.isDisabled}>
              {action.label}
            </Button>
          )}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Link variant="standalone" href={secondaryAction.href} isDisabled={secondaryAction.isDisabled}>
                {secondaryAction.label}
              </Link>
            ) : (
              <Button variant="text" size={buttonSize} onPress={secondaryAction.onPress} isDisabled={secondaryAction.isDisabled}>
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </Tag>
  );
}

/* ---------- Icon tile (internal, Figma: _Icon tile – shared with Dropzone and Embed consent) ---------- */

/** raised: surface/default – on surface/subtle (Embed consent). */
export type IconTileTone = 'neutral' | 'raised' | 'danger' | 'success';

/** Round, decorative icon tile: sm 40 / icon 20 · md 48 / 24 · lg 64 / 32. Internal, not exported from the package. */
export function IconTile({ size = 'md', tone = 'neutral', children }: { size?: 'sm' | 'md' | 'lg'; tone?: IconTileTone; children: ReactNode }) {
  return (
    <span className={cx('medo-icon-tile', `medo-icon-tile--${size}`, `medo-icon-tile--${tone}`)} aria-hidden="true">
      {children}
    </span>
  );
}
