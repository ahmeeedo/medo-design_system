import type { ReactNode } from 'react';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import { FileText, Globe } from 'lucide-react';
import { AvatarSizeContext } from '../avatar/Avatar';
import { Badge } from '../badge/Badge';
import { IconTile } from '../empty-state/EmptyState';
import { cx } from '../utils/cx';
import { Highlight } from '../utils/highlight';

export type SearchResultType = 'page' | 'document' | 'person' | 'media';

export interface SearchResultProps {
  /** Sets the default leading icon: page (globe), document (file). Person and media take `leading`. */
  type?: SearchResultType;
  /** base: divider between hits, title in brand colour · aesthetic: no divider, larger title, rounded hover surface. */
  variant?: 'base' | 'aesthetic';
  /** Required. The hit's title – a link to the result. */
  title: string;
  href: string;
  /** Search term: shown in bold in title and snippet (every match), never by colour alone. */
  query?: string;
  /** Where it lives (“Help center › Billing”). */
  path?: ReactNode;
  /** Text around the match, max 2 lines. A string gets the highlight. */
  snippet?: ReactNode;
  /** Type label as Badge sm (“Page”, “PDF”, “Video”). */
  badge?: string;
  /** Meta text next to the badge (“Updated 3 days ago”). */
  meta?: ReactNode;
  /** Person: Avatar (sized lg automatically). Media: an image (4:3; 128 wide, 160 in aesthetic). Overrides the type icon. */
  leading?: ReactNode;
  /** Heading level of the title. Match the page outline (default h3 below the results heading). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Router options or target for the link. */
  linkProps?: Omit<AriaLinkProps, 'href' | 'children' | 'className'>;
  className?: string;
}

const icons: Partial<Record<SearchResultType, ReactNode>> = { page: <Globe />, document: <FileText /> };

/**
 * Search result – one hit: path, title with the search term in bold, snippet,
 * meta row with type badge. The whole result is one link (the title), so it is one tab stop.
 * Put results into `<ul role="list" className="medo-search-results">` with one `<li>` per hit.
 */
export function SearchResult({
  type = 'page',
  variant = 'base',
  title,
  href,
  query,
  path,
  snippet,
  badge,
  meta,
  leading,
  headingLevel = 3,
  linkProps,
  className,
}: SearchResultProps) {
  const Heading = `h${headingLevel}` as const;
  const lead = leading ?? (icons[type] && <IconTile size="sm">{icons[type]}</IconTile>);
  return (
    <article className={cx('medo-search-result', `medo-search-result--${variant}`, `medo-search-result--${type}`, className)}>
      {lead && (
        <AvatarSizeContext.Provider value="lg">
          <span className="medo-search-result__leading">{lead}</span>
        </AvatarSizeContext.Provider>
      )}
      <div className="medo-search-result__content">
        {path && <span className="medo-search-result__path">{path}</span>}
        <Heading className="medo-search-result__title">
          <AriaLink {...linkProps} href={href} className="medo-search-result__link">
            <Highlight text={title} query={query} all className="medo-search-result__match" />
          </AriaLink>
        </Heading>
        {snippet && (
          <p className="medo-search-result__snippet">
            {typeof snippet === 'string' ? <Highlight text={snippet} query={query} all className="medo-search-result__match" /> : snippet}
          </p>
        )}
        {(badge || meta) && (
          <span className="medo-search-result__meta">
            {badge && (
              <Badge tone="neutral" size="sm">
                {badge}
              </Badge>
            )}
            {meta && <span className="medo-search-result__meta-text">{meta}</span>}
          </span>
        )}
      </div>
    </article>
  );
}
