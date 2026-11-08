import type { ArgTypesEnhancer } from 'storybook/internal/types';

/**
 * Descriptions of the props that come from React Aria or the DOM and mean the same in every component. The docs read
 * a description from the component's own JSDoc first; this list fills only what is still empty – one wording for
 * `isDisabled` on every page. A prop of our own gets JSDoc in the component, not an entry here.
 */
export const sharedPropDocs: Record<string, string> = {
  // State
  isDisabled: 'Cannot be used; keyboard focus skips it.',
  isRequired: 'Must be filled in before the form is sent. Screen readers announce it as required.',
  isReadOnly: 'Shows the value but cannot be changed. Stays focusable and readable.',
  isInvalid: 'Marks the value as wrong. Show what to fix with `errorMessage`.',
  isIndeterminate: 'Partly checked – some of the items below are selected. Wins over `isSelected` visually.',
  isOpen: 'Open or closed, controlled. Use with `onOpenChange`.',
  defaultOpen: 'Open on first render, uncontrolled.',
  isKeyboardDismissDisabled: 'Esc does not close it – for content that must be confirmed.',
  // Values
  value: 'Current value, controlled. Use with `onChange`.',
  defaultValue: 'Value on first render, uncontrolled.',
  minValue: 'Lowest allowed value.',
  maxValue: 'Highest allowed value.',
  step: 'Steps between values.',
  formatOptions: 'Number format (`Intl.NumberFormatOptions`), e.g. percent or a currency. Follows the language.',
  placeholderValue: 'Date the empty field and the calendar start from.',
  isDateUnavailable: 'Returns `true` for dates that cannot be picked, e.g. booked days.',
  orientation: 'Direction of the items.',
  placement: 'Preferred side; flips when there is no room.',
  offset: 'Distance from the trigger in px.',
  // Collections
  items: 'Items for a dynamic collection; `children` then renders one item.',
  defaultItems: 'All items; the list filters them while typing.',
  selectionMode: 'None, one or several items can be selected.',
  selectedKey: 'Selected item, controlled. Use with `onSelectionChange`.',
  defaultSelectedKey: 'Selected item on first render, uncontrolled.',
  disabledKeys: 'Items that cannot be used.',
  keyboardActivation: '`automatic`: arrow keys select at once. `manual`: arrow keys move the focus, Enter or Space selects.',
  renderEmptyState: 'Content when there are no items, e.g. an Empty State.',
  // Events
  onPress: 'Called on click, tap, Enter and Space. Use it instead of `onClick`.',
  onChange: 'Called with the new value.',
  onChangeEnd: 'Called once when dragging ends – for saving.',
  onOpenChange: 'Called when it opens or closes.',
  onSelectionChange: 'Called with the new selection.',
  onAction: 'Called with the key of the item that was activated.',
  onSubmit: 'Called on Enter with the search term.',
  onClear: 'Called when the field is emptied with the clear button or Esc.',
  // DOM
  'aria-label': 'Accessible name when there is no visible label. Only where the context names it.',
  href: 'Target of the link. Internal paths go through the app router (`RouterProvider`).',
  srcSet: 'Image files in several widths. The browser picks one with `sizes`.',
  sizes: 'Display width of the image per layout, e.g. `(min-width: 640px) 50vw, 100vw`.',
  acceptedFileTypes: 'Allowed file types as MIME types or extensions, e.g. `["image/*", ".pdf"]`.',
  ref: 'React ref to the DOM element.',
};

/**
 * Fills empty descriptions from `sharedPropDocs`. Runs after the docgen step, so JSDoc in the component always wins.
 * Props that only appear in a story's `args` (inherited from React Aria, e.g. `isDisabled`) get their argType later
 * from Storybook's inferArgTypes, which keeps what is set here.
 */
export const describeSharedProps: ArgTypesEnhancer = ({ argTypes, initialArgs }) => {
  const names = new Set([...Object.keys(argTypes), ...Object.keys(initialArgs ?? {})]);
  return Object.fromEntries(
    [...names].map((name) => {
      const argType = argTypes[name];
      const shared = sharedPropDocs[name];
      if (!shared || argType?.description) return [name, argType];
      return [name, { ...argType, name, description: shared }];
    }).filter(([, argType]) => argType),
  );
};
