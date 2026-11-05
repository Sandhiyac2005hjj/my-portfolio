import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { CONTACT } from '../data/content';

interface Props {
  onClose: () => void;
  /** Element to hand focus back to once the overlay has closed. */
  returnFocusTo: RefObject<HTMLElement | null>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(
  "Hi Sandhiya,\n\nI'd like to talk about a project.\n\n",
)}`;

/**
 * Contact dialog. The panel shares layoutId="collab" with the pill button, so
 * Framer Motion morphs the button into the dialog. Escape and the close
 * button dismiss it; focus is trapped inside and restored afterwards.
 */
export function ContactOverlay({ onClose, returnFocusTo }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeBtn.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      // The trigger button re-mounts as the overlay leaves; focus it on the next frame.
      requestAnimationFrame(() => returnFocusTo.current?.focus());
    };
  }, [onClose, returnFocusTo]);

  const rows = [
    { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: 'LinkedIn', value: 'linkedin.com/in/sandhiya-c', href: CONTACT.linkedin },
    { label: 'GitHub', value: 'github.com/Sandhiyac2005hjj', href: CONTACT.github },
  ];

  return createPortal(
    <div className="overlay-root">
      <motion.div
        className="overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        layoutId="collab"
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-title"
        transition={{ type: 'spring', stiffness: 220, damping: 30 }}
        style={{ borderRadius: 28 }}
      >
        <motion.div
          className="overlay-inner"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <button ref={closeBtn} type="button" className="overlay-close mono" onClick={onClose} aria-label="Close contact dialog">
            Close ✕
          </button>
          <p className="eyebrow mono">Hire me</p>
          <h2 id="overlay-title" className="overlay-title">
            Let&rsquo;s <span className="outline">collaborate</span>.
          </h2>
          <ul className="overlay-links">
            {rows.map((r) => (
              <li key={r.label}>
                <a href={r.href} target={r.label === 'Email' ? undefined : '_blank'} rel="noreferrer noopener">
                  <span className="mono">{r.label}</span>
                  <span className="overlay-value">{r.value}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <motion.a
            className="btn btn--yellow"
            href={mailto}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            Start a Project →
          </motion.a>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
