import type { CSSProperties, ElementType, HTMLAttributes, Ref } from 'react';
import { cx } from '../utils/cx';

/**
 * Spacing rules: every gap between elements comes from one of six rules. The values grow with the layout mode
 * (mobile · tablet · desktop), so a layout needs no breakpoints for its spacing.
 *
 * inline 8 · content 16 · fields 16/24/24 · items 16/24/24 · group 32/40/48 · section 48/64/96 px
 */
export type SpacingRule = 'inline' | 'content' | 'fields' | 'items' | 'group' | 'section';

/** Elements a layout component can render as. Choose the one that says what the content is. */
export type LayoutElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'main'
  | 'header'
  | 'footer'
  | 'nav'
  | 'ul'
  | 'ol'
  | 'li'
  | 'form'
  | 'fieldset';

interface LayoutProps extends HTMLAttributes<HTMLElement> {
  /** HTML element, e.g. `ul` for a list of cards or `section` for a page section. Default: `div`. */
  as?: LayoutElement;
  ref?: Ref<HTMLElement>;
}

/* ---------- Stack ---------- */

export interface StackProps extends LayoutProps {
  /** vertical (default) · horizontal. */
  direction?: 'vertical' | 'horizontal';
  /** Spacing rule. Default: `content` when vertical, `inline` when horizontal. */
  gap?: SpacingRule;
  /** Cross axis: start · center · end · stretch (default) · baseline. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main axis: start · center · end · between. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Horizontal only: wrap to the next line when space runs out. */
  wrap?: boolean;
}

/**
 * Stack – elements below or next to each other with a spacing rule.
 * Vertical uses the rule `content`, horizontal the rule `inline`; pass `gap` for another rule.
 */
export function Stack({ as: Tag = 'div', direction = 'vertical', gap, align, justify, wrap, className, ...props }: StackProps) {
  const El = Tag as ElementType;
  return (
    <El
      {...props}
      className={cx(
        'medo-stack',
        direction === 'horizontal' && 'medo-stack--horizontal',
        wrap && 'medo-stack--wrap',
        align && `medo-stack--align-${align}`,
        justify && `medo-stack--justify-${justify}`,
        gap && `medo-gap-${gap}`,
        className,
      )}
    />
  );
}

/* ---------- Grid ---------- */

export interface GridProps extends LayoutProps {
  /**
   * Columns. Without it: as many as fit, each at least `minItemSize` wide – no breakpoints needed.
   * A number: that many equal columns. `layout`: the layout grid (4 · 8 · 12 columns), place children with `GridItem`.
   */
  columns?: number | 'layout';
  /** Without `columns`: the narrowest a column may get (CSS length). Default `16rem`. */
  minItemSize?: string;
  /** Spacing rule. Default: `items` (the layout gutter). */
  gap?: SpacingRule;
}

/** Grid – cards, tiles and page areas in columns. The gap between items is always the rule `items` unless set. */
export function Grid({ as: Tag = 'div', columns, minItemSize, gap, className, style, ...props }: GridProps) {
  const El = Tag as ElementType;
  const vars = {
    ...(typeof columns === 'number' ? { '--medo-grid-columns': columns } : {}),
    ...(minItemSize ? { '--medo-grid-min': minItemSize } : {}),
  } as CSSProperties;
  return (
    <El
      {...props}
      style={{ ...vars, ...style }}
      className={cx(
        'medo-grid',
        typeof columns === 'number' && 'medo-grid--columns',
        columns === 'layout' && 'medo-grid--layout',
        gap && `medo-gap-${gap}`,
        className,
      )}
    />
  );
}

export interface GridItemProps extends LayoutProps {
  /** Columns to span, or `full`. Never more than there are: span 6 is full width on a phone (4 columns). */
  span?: number | 'full';
}

/** GridItem – a child of `Grid` that spans several columns. */
export function GridItem({ as: Tag = 'div', span = 1, className, style, ...props }: GridItemProps) {
  const El = Tag as ElementType;
  return (
    <El
      {...props}
      style={span === 'full' ? style : ({ '--medo-grid-span': span, ...style } as CSSProperties)}
      className={cx('medo-grid__item', span === 'full' && 'medo-grid__item--full', className)}
    />
  );
}

/* ---------- Container ---------- */

export interface ContainerProps extends LayoutProps {
  /** Width of the content: prose 680 (running text) · md 768 · lg 1024 · xl 1280 (default) · full. */
  size?: 'prose' | 'md' | 'lg' | 'xl' | 'full';
}

/** Container – centres the content, limits its width and adds the page margin of the layout mode. */
export function Container({ as: Tag = 'div', size = 'xl', className, ...props }: ContainerProps) {
  const El = Tag as ElementType;
  return <El {...props} className={cx('medo-container', size !== 'xl' && `medo-container--${size}`, className)} />;
}
