import { MotionConfig } from 'framer-motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education } from './components/Education';
import { Collaborate } from './components/Collaborate';
import { CONTACT } from './data/content';

export default function App() {
  return (
    // "user" makes every Framer Motion animation honour prefers-reduced-motion
    // (transform/layout animations are skipped; opacity still fades).
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Collaborate />
      </main>
      <footer className="footer mono">
        <span>© 2026 {CONTACT.name}</span>
        <span>{CONTACT.location}</span>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </footer>
    </MotionConfig>
  );
}
