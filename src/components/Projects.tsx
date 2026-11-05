import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger, useGSAP, NO_PREFERENCE } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';
import { Flashlight } from './Flashlight';
import { PROJECTS } from '../data/content';

const { illusion, smartprint, cardiologist } = PROJECTS;

function Links({ repo, demo }: { repo: string; demo?: string }) {
  const spring = { type: 'spring', stiffness: 400, damping: 22 } as const;
  return (
    <div className="case-links">
      <motion.a
        className="btn btn--ghost"
        href={repo}
        target="_blank"
        rel="noreferrer noopener"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
      >
        Repository ↗
      </motion.a>
      {demo ? (
        <motion.a
          className="btn btn--ghost"
          href={demo}
          target="_blank"
          rel="noreferrer noopener"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        >
          Demo video ↗
        </motion.a>
      ) : null}
    </div>
  );
}

function Stack({ items }: { items: readonly string[] }) {
  return (
    <ul className="stack mono" aria-label="Technologies used">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/* ───────────────────────── 01 · ILLUSION — horizontal storytelling ───────────────────────── */

function Architecture() {
  return (
    <svg className="arch" viewBox="0 0 520 300" role="img" aria-labelledby="arch-t arch-d">
      <title id="arch-t">Project ILLUSION service layout</title>
      <desc id="arch-d">
        A React frontend talks to a Spring Boot backend secured with JWT and role-based access control. The backend
        uses PostgreSQL and a Python AI service for RAG and vision. All services are containerised with Docker.
      </desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </marker>
      </defs>
      <rect x="8" y="8" width="504" height="284" rx="14" className="arch-docker" />
      <text x="24" y="30" className="arch-tag">DOCKER</text>

      <g className="arch-node">
        <rect x="28" y="120" width="104" height="52" rx="3" />
        <text x="80" y="143" textAnchor="middle">React 18</text>
        <text x="80" y="160" textAnchor="middle" className="arch-sub">frontend</text>
      </g>
      <g className="arch-node arch-node--hot">
        <rect x="186" y="116" width="148" height="60" rx="3" />
        <text x="260" y="140" textAnchor="middle">Spring Boot 3</text>
        <text x="260" y="158" textAnchor="middle" className="arch-sub">JWT · RBAC · JPA</text>
      </g>
      <g className="arch-node">
        <rect x="392" y="52" width="100" height="46" rx="3" />
        <text x="442" y="80" textAnchor="middle">PostgreSQL</text>
      </g>
      <g className="arch-node">
        <rect x="392" y="190" width="100" height="62" rx="3" />
        <text x="442" y="212" textAnchor="middle">Python AI</text>
        <text x="442" y="228" textAnchor="middle" className="arch-sub">RAG · Gemini</text>
        <text x="442" y="242" textAnchor="middle" className="arch-sub">vision</text>
      </g>

      <g className="arch-edge" markerEnd="url(#arrow)">
        <path d="M132 146 H186" markerEnd="url(#arrow)" />
        <path d="M334 134 L392 80" markerEnd="url(#arrow)" />
        <path d="M334 160 L392 216" markerEnd="url(#arrow)" />
      </g>
    </svg>
  );
}

function IllusionCase() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const pin = root.current!.querySelector<HTMLElement>('.hpin')!;
        const track = root.current!.querySelector<HTMLElement>('.htrack')!;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
          },
        });
        gsap.to('.hprogress-bar', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: pin, scrub: true, start: 'top top', end: () => `+=${dist()}` },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="case case--illusion">
      <div className="hpin">
        <div className="hprogress" aria-hidden="true">
          <span className="hprogress-bar" />
        </div>
        <div className="htrack">
          <article className="hpanel hpanel--intro">
            <p className="case-no mono">Case 01 · {illusion.when}</p>
            <h3 className="case-title">
              Project
              <br />
              <span className="outline">ILLUSION</span>
            </h3>
            <p className="case-sub">{illusion.subtitle}</p>
            <Links repo={illusion.repo} demo={illusion.demo} />
            <Stack items={illusion.stack} />
          </article>

          <article className="hpanel">
            <p className="chapter mono">I / IV — The platform</p>
            <h4>A full-stack assessment platform, secured end to end.</h4>
            <p>
              REST APIs for candidate management, assessment and evaluation on Java, Spring Boot, Hibernate/JPA and
              PostgreSQL. Spring Security with JWT authentication and role-based access control manages access across
              user roles. Backend, React frontend and Python AI service are all containerised with Docker.
            </p>
            <Architecture />
          </article>

          <article className="hpanel">
            <p className="chapter mono">II / IV — The questions</p>
            <h4>
              Questions grounded in <em>documents</em>.
            </h4>
            <p>
              RAG with the Google Gemini API generates document-grounded assessment questions and post-assessment viva
              questions. Microsoft Edge TTS delivers the questions, and candidate responses are evaluated with keyword
              matching assisted by Gemini.
            </p>
          </article>

          <article className="hpanel hpanel--watch">
            <p className="chapter mono">III / IV — The proctor</p>
            <h4>An AI-powered proctoring system.</h4>
            <p>
              Built with OpenCV, MediaPipe FaceMesh and YOLOv8 to detect gaze deviations, abnormal head movements and
              unauthorized devices.
            </p>
            <p className="bignum" aria-label="Under 80 milliseconds vision inference per frame">
              <span className="mono">under</span>
              <span className="outline">80</span>
              <span className="mono">ms / frame</span>
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 02 · SmartPrint — torchlit ledger ───────────────────────── */

function Ledger({ lit }: { lit: boolean }) {
  const rows = [
    { n: '4,800+', l: 'records served with Hibernate batch fetching' },
    { n: '0.77', l: 'R² — leakage-free Gradient Boosting Regressor' },
    { n: '1.46', l: 'days MAE on production turnaround prediction' },
  ];
  return (
    <ul className={`ledger ${lit ? 'ledger--lit' : 'ledger--dim'}`}>
      {rows.map((r) => (
        <li key={r.n}>
          <span className="ledger-n">{r.n}</span>
          <span className="ledger-l mono">{r.l}</span>
        </li>
      ))}
    </ul>
  );
}

function SmartPrintCase() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div ref={root} className="case case--smartprint">
      <div className="case-head">
        <p className="case-no mono" data-reveal>
          Case 02 · {smartprint.when}
        </p>
        <h3 className="case-title" data-reveal>
          SmartPrint <span className="outline">AI</span>
        </h3>
        <p className="case-sub" data-reveal>
          {smartprint.subtitle}
        </p>
      </div>

      <div className="case-cols">
        <div className="case-copy">
          <p data-reveal>
            A Spring Boot backend on Java 21, Hibernate/JPA and PostgreSQL with REST APIs for job card management,
            customer operations, production tracking and billing.
          </p>
          <p data-reveal>
            JPA entity models use embedded value objects, automated timestamping and sequential job ID generation.
            A Gradient Boosting model predicts production turnaround, served through Flask-based inference with
            automated deadline-expedite alerts.
          </p>
          <p data-reveal>
            A Python ETL pipeline and PostgreSQL OLAP analytics layer drive RFM customer segmentation, revenue
            analysis, machine utilization and operator performance.
          </p>
          <div data-reveal>
            <Links repo={smartprint.repo} />
          </div>
          <div data-reveal>
            <Stack items={smartprint.stack} />
          </div>
        </div>

        <div className="case-visual" data-clip>
          <Flashlight
            className="ledger-stage"
            base={<Ledger lit={false} />}
            reveal={<Ledger lit />}
            radius={190}
            rest={{ x: 0.3, y: 0.3 }}
            glow="rgba(242, 194, 48, 0.1)"
          />
          <p className="caption mono" aria-hidden="true">
            Fig. 2 — Shine a light on the numbers
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 03 · AI Cardiologist — scroll-drawn ECG ───────────────────────── */

const ECG =
  'M0 80 H110 l12 -6 l12 6 H210 l10 6 l12 -70 l16 118 l12 -54 H330 q22 -34 44 0 H470 l10 6 l12 -70 l16 118 l12 -54 H590 q22 -34 44 0 H730 l10 6 l12 -70 l16 118 l12 -54 H850 q22 -34 44 0 H1200';

function CardiologistCase() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const path = root.current!.querySelector<SVGPathElement>('.ecg-line')!;
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 40%', scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="case case--cardio">
      <svg className="ecg" viewBox="0 0 1200 160" aria-hidden="true">
        <path className="ecg-ghost" d={ECG} />
        <path className="ecg-line" d={ECG} pathLength={1} strokeDasharray={1} />
      </svg>

      <div className="case-head">
        <p className="case-no mono" data-reveal>
          Case 03 · {cardiologist.when}
        </p>
        <h3 className="case-title" data-reveal>
          AI <span className="outline outline--red">Cardiologist</span>
        </h3>
        <p className="case-sub" data-reveal>
          {cardiologist.subtitle}
        </p>
      </div>

      <dl className="cardio-stats">
        <div data-reveal>
          <dt className="mono">patient records</dt>
          <dd>10,000</dd>
        </div>
        <div data-reveal>
          <dt className="mono">clinical &amp; lab biomarkers</dt>
          <dd>17</dd>
        </div>
        <div data-reveal>
          <dt className="mono">reported accuracy, hybrid ensemble</dt>
          <dd>90.94%</dd>
        </div>
        <div data-reveal>
          <dt className="mono">voting classifier, 5-fold CV</dt>
          <dd>88.58%</dd>
        </div>
      </dl>

      <div className="case-cols case-cols--text">
        <p data-reveal>
          A Django clinical decision support system that assesses post-COVID cardiovascular risk. A hybrid ensemble of
          Decision Tree, XGBoost and Extra Trees classifies patients into Low, Medium and High risk.
        </p>
        <p data-reveal>
          A Voting Classifier, plus Modified LeNet and custom CNN models for five-class ECG and cardiac image
          classification, are integrated into a web app with patient authentication, risk assessment, image-based
          diagnosis, patient record management and prediction analytics.
        </p>
      </div>
      <div className="case-foot" data-reveal>
        <Links repo={cardiologist.repo} />
        <Stack items={cardiologist.stack} />
      </div>
    </div>
  );
}

export function Projects() {
  // Pinned/measured layouts depend on font metrics; refresh once fonts are in.
  useGSAP(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
    };
  });

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="work-intro">
        <p className="eyebrow mono">
          <span>02</span> Selected work
        </p>
        <h2 id="work-title" className="visually-hidden">
          Selected projects
        </h2>
      </div>
      <IllusionCase />
      <SmartPrintCase />
      <CardiologistCase />
    </section>
  );
}
