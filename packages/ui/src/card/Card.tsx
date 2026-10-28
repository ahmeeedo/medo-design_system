import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { cx } from '../utils/cx';

export interface CardProps {
  /** Required: every card has a heading, so it can be scanned and announced. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Heading level of the title. Match the page outline (default h3). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** outlined (default) · elevated (needs attention, draggable) · filled (inside white areas) · brand (one per view) · plain (editorial). */
  variant?: 'outlined' | 'elevated' | 'filled' | 'brand' | 'plain';
  /** standard 24 px · compact 16 px (dense layouts and mobile). */
  density?: 'standard' | 'compact';
  /** vertical (media on top, 16:9) · horizontal (media 180 px left, for lists). */
  layout?: 'vertical' | 'horizontal';
  /** Image or video. Decorative images use alt="". */
  media?: ReactNode;
  /** Actions for the whole card, next to the title (ButtonGroup context="header"). */
  headerActions?: ReactNode;
  /** Actions that finish a task in the card (ButtonGroup context="footer"). */
  footer?: ReactNode;
  /** Makes the whole card open something: the title becomes one link stretched over the card. */
  href?: AriaLinkProps['href'];
  /** Link props such as target or routerOptions. */
  linkProps?: Omit<AriaLinkProps, 'href' | 'children' | 'className'>;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Card – a container for one topic. Rendered as an article with a heading. */
export function Card({
  title,
  subtitle,
  headingLevel = 3,
  variant = 'outlined',
  density = 'standard',
  layout = 'vertical',
  media,
  headerActions,
  footer,
  href,
  linkProps,
  children,
  className,
  style,
}: CardProps) {
  const Heading = `h${headingLevel}` as ElementType;
  const interactive = href !== undefined;
  return (
    <article
      className={cx(
        'medo-card',
        `medo-card--${variant}`,
        density === 'compact' && 'medo-card--compact',
        layout === 'horizontal' && 'medo-card--horizontal',
        interactive && 'medo-card--interactive',
        className,
      )}
      style={style}
    >
      {media && <div className="medo-card__media">{media}</div>}
      <div className="medo-card__main">
        <div className="medo-card__header">
          <div className="medo-card__heading">
            <Heading className="medo-card__title">
              {interactive ? (
                <AriaLink {...linkProps} href={href} className="medo-card__link">
                  {title}
                </AriaLink>
              ) : (
                title
              )}
            </Heading>
            {subtitle && <p className="medo-card__subtitle">{subtitle}</p>}
          </div>
          {headerActions && <div className="medo-card__header-actions">{headerActions}</div>}
        </div>
        {children && <div className="medo-card__body">{children}</div>}
        {footer && <div className="medo-card__footer">{footer}</div>}
      </div>
    </article>
  );
}
