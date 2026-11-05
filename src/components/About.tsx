import { useRef } from 'react';
import { useReveal } from '../lib/useReveal';
import { COMPETENCIES, INTERESTS, SUMMARY } from '../data/content';

export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="about" className="section about" aria-labelledby="about-title">
      <p className="eyebrow mono" data-reveal>
        <span>01</span> About
      </p>
      <div className="about-grid">
        <h2 id="about-title" className="about-statement" data-reveal>
          Backends that are <em>secure</em>, databases that are <em>sound</em>, and intelligence that is{' '}
          <em>grounded</em>.
        </h2>
        <div className="about-body">
          <p data-reveal>{SUMMARY}</p>
          <hr className="rule" data-line />
          <dl className="about-facts">
            <div data-reveal>
              <dt className="mono">Interested in</dt>
              <dd>{INTERESTS}</dd>
            </div>
            <div data-reveal>
              <dt className="mono">Works with</dt>
              <dd>{COMPETENCIES.join(' · ')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
