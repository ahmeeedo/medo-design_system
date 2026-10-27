import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Button,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components';
import { X } from 'lucide-react';
import './toast.css';

/*
 * React Aria's Toast is still marked UNSTABLE. Only this file imports it, so an API change
 * in React Aria stays here – apps use `ToastRegion` and `toast()`.
 */

export interface ToastAction {
  /** „Undo“, „View“ or „Retry“. It must also be reachable elsewhere in the app. */
  label: string;
  onAction: () => void;
}

export interface ToastOptions {
  /** Max one action. Pressing it runs the action and closes the toast. */
  action?: ToastAction;
  /** Errors („Could not save“): stays until closed. Otherwise 5 s, with an action 8 s. */
  persistent?: boolean;
  /** Called when the toast closes (timeout, close button, Esc or action). */
  onClose?: () => void;
}

interface ToastContent {
  message: string;
  action?: ToastAction;
}

/** Timing: message only 5 s, with action 8 s, errors without timeout. */
const TIMEOUT = 5000;
const TIMEOUT_ACTION = 8000;
const MAX_VISIBLE = 3;

/** The app-wide queue: max 3 visible, newest first. Changes run in a View Transition where supported. */
const queue = new ToastQueue<ToastContent>({
  maxVisibleToasts: MAX_VISIBLE,
  wrapUpdate(fn) {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => flushSync(fn));
    } else {
      fn();
    }
  },
});

/**
 * Shows a toast: short, temporary feedback after an action.
 * Write the result, not the process („Q3-Report.pdf deleted“), one line, max about 50 characters.
 * Returns the key for `toast.close(key)`. The same message is never shown twice at once.
 */
export function toast(message: string, { action, persistent = false, onClose }: ToastOptions = {}): string {
  const same = queue.visibleToasts.find((t) => t.content.message === message);
  if (same) return same.key;
  // Max 3 – the oldest leaves first (React Aria would hold it back and show it again later).
  const visible = queue.visibleToasts;
  if (visible.length >= MAX_VISIBLE) queue.close(visible[visible.length - 1].key);
  return queue.add({ message, action }, { timeout: persistent ? undefined : action ? TIMEOUT_ACTION : TIMEOUT, onClose });
}

/** Closes a toast by its key. */
toast.close = (key: string) => queue.close(key);
/** Closes all toasts (e.g. on sign-out). */
toast.clear = () => queue.clear();

let regionMounted = false;

/** Esc closes the focused toast (React Aria's Toast has no key handling of its own). React 19 ref cleanup removes the listener. */
function closeOnEscape(el: HTMLElement | null, key: string) {
  if (!el) return;
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    queue.close(key);
  };
  el.addEventListener('keydown', onKeyDown);
  return () => el.removeEventListener('keydown', onKeyDown);
}

export interface ToastRegionProps {
  /** Accessible name of the landmark. Default: „Notifications“ (localized by React Aria). */
  'aria-label'?: string;
  /** Accessible name of the close buttons. Default: „Close“ (localized by React Aria). */
  closeLabel?: string;
}

/**
 * The place where toasts appear – render it once at the root of the app.
 * A landmark: F6 moves focus into it, new toasts are announced. Desktop bottom right,
 * mobile full width (set `--medo-toast-offset` to the height of a bottom navigation).
 * Hover, focus and a hidden window pause the timers (WCAG 2.2.1).
 */
export function ToastRegion({ closeLabel, ...props }: ToastRegionProps) {
  // One region per page: a second one (e.g. several Storybook stories) stays empty instead of duplicating toasts.
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (regionMounted) return;
    regionMounted = true;
    setActive(true);
    // Do not lose messages in a background tab.
    const onVisibility = () => (document.hidden ? queue.pauseAll() : queue.resumeAll());
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      regionMounted = false;
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  if (!active) return null;

  return (
    <AriaToastRegion {...props} queue={queue} className="medo-toast-region">
      {({ toast: t }) => (
        <AriaToast
          toast={t}
          className="medo-toast"
          style={{ viewTransitionName: t.key }}
          ref={(el) => closeOnEscape(el, t.key)}
        >
          <AriaToastContent className="medo-toast__content">
            <Text slot="title" className="medo-toast__message">
              {t.content.message}
            </Text>
          </AriaToastContent>
          {t.content.action && (
            <Button
              className="medo-toast__button medo-toast__action"
              onPress={() => {
                t.content.action?.onAction();
                queue.close(t.key);
              }}
            >
              {t.content.action.label}
            </Button>
          )}
          <Button slot="close" aria-label={closeLabel} className="medo-toast__button medo-toast__close">
            <X aria-hidden="true" />
          </Button>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}
