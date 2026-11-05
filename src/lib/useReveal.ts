import { type RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, NO_PREFERENCE } from './gsap';

/**
 * Scroll reveals for a section. Elements opt in with data attributes:
 *   data-reveal  → rises and fades in
 *   data-line    → a thin rule that draws from the left
 *   data-clip    → an editorial clip-path wipe (top → bottom)
 * Hidden states are only applied when motion is allowed, so with
 * prefers-reduced-motion everything simply renders in place.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        gsap.set('[data-reveal]', { opacity: 0, y: 36 });
        gsap.set('[data-line]', { scaleX: 0, transformOrigin: 'left center' });
        gsap.set('[data-clip]', { clipPath: 'inset(0 0 100% 0)' });

        ScrollTrigger.batch('[data-reveal]', {
          start: 'top 88%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
        });
        ScrollTrigger.batch('[data-line]', {
          start: 'top 92%',
          once: true,
          onEnter: (els) => gsap.to(els, { scaleX: 1, duration: 1.1, ease: 'power3.inOut', stagger: 0.06 }),
        });
        ScrollTrigger.batch('[data-clip]', {
          start: 'top 85%',
          once: true,
          onEnter: (els) =>
            gsap.to(els, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut', stagger: 0.1 }),
        });
      });
      return () => mm.revert();
    },
    { scope },
  );
}
