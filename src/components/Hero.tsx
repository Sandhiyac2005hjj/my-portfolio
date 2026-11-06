import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, useGSAP, NO_PREFERENCE } from '../lib/gsap';
import { Flashlight } from './Flashlight';
import { CONTACT } from '../data/content';

/**
 * The composition is rendered twice by <Flashlight>: once dim (the accessible
 * copy, with the real <h1>) and once lit (decorative). Both copies share the
 * exact same layout so the beam lines up pixel for pixel.
 */
const base = import.meta.env.BASE_URL;

function Composition({ lit }: { lit: boolean }) {
  const Name = lit ? 'p' : 'h1';
  return (
    <div className={`comp ${lit ? 'comp--lit' : 'comp--dim'}`}>
      <div className="portrait-frame">
        <div className="portrait-mask">
          <img
            className="hero-portrait"
            src={`${base}portrait-860.jpg`}
            srcSet={`${base}portrait-860.jpg 860w, ${base}portrait-1290.jpg 1290w`}
            sizes="(max-width: 800px) 80vw, 38vw"
            width={1290}
            height={1640}
            alt={lit ? '' : 'Portrait of Sandhiya C, smiling, in a maroon top'}
            decoding="async"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="name-wrap">
        <Name className="name">
          <span className="name-clip">
            <span className="name-line">SANDHIYA</span>
          </span>
          <span className="name-clip name-clip--c">
            <span className="name-line name-c">C.</span>
          </span>
        </Name>
      </div>

      {lit ? (
        <>
          <p className="annot annot--a">
            <span className="annot-line" />
            Spring Security · JWT · RBAC
          </p>
          <p className="annot annot--b">
            <span className="annot-line" />
            RAG × Google Gemini API
          </p>
          <p className="annot annot--c">
            <span className="annot-line" />
            Under 80 ms vision inference per frame
          </p>
          <p className="annot annot--d">
            <span className="annot-line" />
            Hibernate batch fetching · 4,800+ records
          </p>
        </>
      ) : null}
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.fx-base, .fx-reveal', { opacity: 0, duration: 1.4, ease: 'power2.out' })
          .fromTo(
            '.portrait-mask',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut' },
            0.15,
          )
          .from('.name-line', { yPercent: 115, duration: 1.2, stagger: 0.1 }, 0.55)
          .from('.annot-line', { scaleX: 0, transformOrigin: 'left center', duration: 1, stagger: 0.12 }, 1.1)
          .from('[data-hero-cap]', { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 }, 0.9);

        // Subtle parallax. Both copies move identically so the beam stays aligned.
        const trigger = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero-portrait', { yPercent: -6, ease: 'none', scrollTrigger: trigger });
        gsap.to('.name-wrap', { yPercent: -14, ease: 'none', scrollTrigger: trigger });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" aria-label="Introduction">
      <Flashlight
        className="hero-stage"
        base={<Composition lit={false} />}
        reveal={<Composition lit />}
        radius={260}
        rest={{ x: 0.68, y: 0.36 }}
      >
        <div className="hero-top mono">
          <span data-hero-cap>PORTFOLIO — 2026</span>
          <span data-hero-cap>{CONTACT.location.toUpperCase()}</span>
        </div>

        <div className="hero-bottom">
          <p className="hero-kicker mono" data-hero-cap>
            Information Technology Graduate · Java · Spring Boot · AI
          </p>
          <p className="hero-desc" data-hero-cap>
            Building secure, database-driven backends — and wiring machine learning and RAG into full-stack
            products.
          </p>
          <div className="hero-cta" data-hero-cap>
            <motion.a
              className="btn btn--solid"
              href="#work"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              View selected work
            </motion.a>
            <motion.a
              className="btn btn--ghost"
              href="#contact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Get in touch
            </motion.a>
          </div>
        </div>

        <p className="hero-hint mono" data-hero-cap aria-hidden="true">
          <span className="hint-mouse">Move your light ↗</span>
          <span className="hint-touch">Drag to light ↗</span>
        </p>
      </Flashlight>
    </section>
  );
}
