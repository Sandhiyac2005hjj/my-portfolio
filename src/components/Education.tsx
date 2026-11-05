import { useRef } from 'react';
import { useReveal } from '../lib/useReveal';
import { CERTIFICATIONS, EDUCATION, LANGUAGES, LEADERSHIP } from '../data/content';

export function Education() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="education" className="section edu" aria-labelledby="edu-title">
      <p className="eyebrow mono" data-reveal>
        <span>04</span> Education &amp; recognition
      </p>
      <h2 id="edu-title" className="visually-hidden">
        Education, certifications and leadership
      </h2>

      <div className="edu-grid">
        <div className="edu-col">
          <h3 className="mono col-title" data-reveal>
            Education
          </h3>
          <ul className="timeline">
            {EDUCATION.map((e) => (
              <li key={e.title} data-reveal>
                <span className="year">{e.when}</span>
                <div>
                  <p className="tl-title">{e.title}</p>
                  <p className="tl-where">{e.where}</p>
                  <p className="tl-score mono">{e.score}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="edu-col">
          <h3 className="mono col-title" data-reveal>
            Certifications
          </h3>
          <ul className="certs">
            {CERTIFICATIONS.map((c) => (
              <li key={c.title} data-reveal>
                <span className="tl-title">{c.title}</span>
                <span className="tl-where">
                  {c.by} · {c.when}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="edu-col">
          <h3 className="mono col-title" data-reveal>
            Leadership
          </h3>
          <div data-reveal>
            <p className="tl-title">{LEADERSHIP.role}</p>
            <p className="tl-where">
              {LEADERSHIP.org} · {LEADERSHIP.when}
            </p>
            <p className="lead-text">{LEADERSHIP.text}</p>
          </div>
          <h3 className="mono col-title col-title--spaced" data-reveal>
            Languages
          </h3>
          <p className="lead-text" data-reveal>
            {LANGUAGES.join(' · ')}
          </p>
        </div>
      </div>
    </section>
  );
}
