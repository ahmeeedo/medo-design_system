import { Children, createContext, isValidElement, useContext, useEffect, useId, useState, type ReactElement, type ReactNode } from 'react';
import { Button as AriaButton, Disclosure, DisclosureGroup, DisclosurePanel, Heading, type DisclosureGroupProps, type Key } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { Button } from '../button/Button';
import { cx } from '../utils/cx';
import './accordion.css';

type AccordionSize = 'md' | 'lg';

const AccordionContext = createContext<{ size: AccordionSize; headingLevel: 2 | 3 | 4 }>({ size: 'md', headingLevel: 3 });

export interface AccordionProps extends Omit<DisclosureGroupProps, 'className' | 'style' | 'children'> {
  /** md: apps and settings · lg: websites and FAQs. */
  size?: AccordionSize;
  /** Heading level of the item titles (h2–h4), matching the page outline. */
  headingLevel?: 2 | 3 | 4;
  /** Several sections open at once (default). false: one at a time – only for short, mutually exclusive steps. */
  allowsMultipleExpanded?: boolean;
  /** “Expand all” / “Collapse all” above groups with more than 6 sections (multiple only). */
  expandAll?: boolean;
  expandAllLabel?: string;
  collapseAllLabel?: string;
  /** AccordionItems. */
  children: ReactNode;
  className?: string;
}

const hashId = () => (typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.slice(1)));

/**
 * Accordion – sections that open and close in place. Built on React Aria DisclosureGroup:
 * each header is a button inside a real heading (aria-expanded, aria-controls); closed panels stay findable by
 * the browser search (hidden="until-found"). Several open by default. A link to an item's id (#billing) opens it.
 */
export function Accordion({
  size = 'md',
  headingLevel = 3,
  allowsMultipleExpanded = true,
  expandAll = true,
  expandAllLabel = 'Expand all',
  collapseAllLabel = 'Collapse all',
  expandedKeys: expandedProp,
  defaultExpandedKeys,
  onExpandedChange,
  children,
  className,
  ...props
}: AccordionProps) {
  const ids = Children.toArray(children)
    .filter((c): c is ReactElement<AccordionItemProps> => isValidElement(c))
    .filter((c) => !c.props.isDisabled)
    .map((c) => c.props.id);
  const [inner, setInner] = useState<Set<Key>>(() => {
    const start = new Set<Key>(defaultExpandedKeys ?? []);
    const hash = hashId();
    if (ids.includes(hash)) start.add(hash);
    return start;
  });
  const expanded = expandedProp ? new Set(expandedProp) : inner;
  const setExpanded = (keys: Set<Key>) => {
    if (!expandedProp) setInner(keys);
    onExpandedChange?.(keys);
  };

  // Deep link: a link to #id opens that section and scrolls to it – on load and on every hash change.
  useEffect(() => {
    const open = () => {
      const hash = hashId();
      if (!ids.includes(hash)) return;
      setExpanded(new Set(allowsMultipleExpanded ? [...expanded, hash] : [hash]));
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }));
    };
    if (hashId()) requestAnimationFrame(() => document.getElementById(hashId())?.scrollIntoView({ block: 'start' }));
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  });

  const allOpen = ids.length > 0 && ids.every((id) => expanded.has(id));
  const showToggle = expandAll && allowsMultipleExpanded && Children.count(children) > 6;

  return (
    <AccordionContext.Provider value={{ size, headingLevel }}>
      <div className={cx('medo-accordion-wrap', className)}>
        {showToggle && (
          <div className="medo-accordion__toolbar">
            <Button variant="text" size="sm" onPress={() => setExpanded(allOpen ? new Set() : new Set(ids))}>
              {allOpen ? collapseAllLabel : expandAllLabel}
            </Button>
          </div>
        )}
        <DisclosureGroup
          {...props}
          allowsMultipleExpanded={allowsMultipleExpanded}
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
          className={cx('medo-accordion', `medo-accordion--${size}`)}
        >
          {children}
        </DisclosureGroup>
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  /** Required: key in expandedKeys and the anchor for links (#billing). */
  id: string;
  /** Short and scannable: nouns for settings, real questions for FAQs. */
  title: ReactNode;
  /** Second line in the header. Announced as the button's description. */
  description?: ReactNode;
  /** Decorative icon before the title (20 md / 24 lg). */
  icon?: ReactNode;
  /** Badge sm – part of the button name (“Billing, Payment failed”). */
  badge?: ReactNode;
  isDisabled?: boolean;
  /** Panel content – text, a form or a list. No accordion inside. */
  children: ReactNode;
}

/** One section of an Accordion: a header button inside a heading and its panel. */
export function AccordionItem({ id, title, description, icon, badge, isDisabled, children }: AccordionItemProps) {
  const { headingLevel } = useContext(AccordionContext);
  const descId = useId();
  return (
    <Disclosure id={id} isDisabled={isDisabled} className={cx('medo-accordion__item', !!icon && 'medo-accordion__item--icon')}>
      <Heading level={headingLevel} id={id} className="medo-accordion__heading">
        <AriaButton slot="trigger" className="medo-accordion__trigger" aria-describedby={description ? descId : undefined}>
          {icon && (
            <span className="medo-accordion__icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="medo-accordion__text">
            <span className="medo-accordion__title">{title}</span>
            {description && (
              // Read as description, not as part of the name.
              <span id={descId} className="medo-accordion__description" aria-hidden="true">
                {description}
              </span>
            )}
          </span>
          {badge && <span className="medo-accordion__badge">{badge}</span>}
          <ChevronDown className="medo-accordion__chevron" aria-hidden="true" />
        </AriaButton>
      </Heading>
      <DisclosurePanel className="medo-accordion__panel">
        <div className="medo-accordion__content">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  );
}
