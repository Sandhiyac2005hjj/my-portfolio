import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV } from '../data/content';

export function Nav() {
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Track which section is in view (plain IntersectionObserver, no scroll listener).
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <a className="nav-brand mono" href="#top" aria-label="Sandhiya C, back to top">
        SC<span aria-hidden="true">/26</span>
      </a>

      <nav aria-label="Primary" className="nav-links">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="nav-link mono" aria-current={active === n.id ? 'true' : undefined}>
            {active === n.id ? <motion.span layoutId="nav-underline" className="nav-underline" /> : null}
            {n.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="nav-toggle mono"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close' : 'Menu'}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="nav-mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
