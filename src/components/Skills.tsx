import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '../lib/useReveal';
import { SKILL_GROUPS } from '../data/content';

export function Skills() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="skills" className="section skills" aria-labelledby="skills-title">
      <p className="eyebrow mono" data-reveal>
        <span>03</span> Skills
      </p>
      <h2 id="skills-title" className="section-title" data-reveal>
        The toolkit, <em>by discipline</em>.
      </h2>
      <ol className="skill-index">
        {SKILL_GROUPS.map((g, i) => (
          <motion.li
            key={g.name}
            className="skill-row"
            whileHover={{ x: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <span className="rule" data-line />
            <span className="skill-no mono">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="skill-name" data-reveal>
              {g.name}
            </h3>
            <p className="skill-items" data-reveal>
              {g.items.join('  /  ')}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
