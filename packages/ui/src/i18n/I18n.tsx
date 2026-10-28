import { createContext, useContext, type ReactNode } from 'react';
import { useLocale } from 'react-aria-components';
import { de } from './de';
import { en } from './en';
import type { Messages } from './messages';

/**
 * Languages of the built-in texts. The language comes from React Aria (`I18nProvider`, else the browser) –
 * the same source as date and number formats. Regional variants use their language (de-AT, de-CH → de).
 * Any other language falls back to English.
 */
const builtIn: Record<string, Messages> = { en, de };

const MessagesContext = createContext<Messages | null>(null);

/**
 * Own texts for all components below, e.g. another language or a different tone:
 *   <MessagesProvider messages={{ ...enMessages, common: { ...enMessages.common, close: 'Fermer' } }}>
 * Wins over the built-in languages. Props of a single component still win over both.
 */
export function MessagesProvider({ messages, children }: { messages: Messages; children: ReactNode }) {
  return <MessagesContext.Provider value={messages}>{children}</MessagesContext.Provider>;
}

/** The built-in texts for the current language. */
export function useMessages(): Messages {
  const custom = useContext(MessagesContext);
  const { locale } = useLocale();
  return custom ?? builtIn[locale.split('-')[0].toLowerCase()] ?? en;
}

export { de, en };
export type { EmbedMessages, Messages } from './messages';
