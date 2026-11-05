import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap, ScrollTrigger, useGSAP, NO_PREFERENCE } from '../lib/gsap';
import { ContactOverlay } from './ContactOverlay';

/* ───────────── Geometry (SVG user units; the stage is 1000 × 620) ───────────── */

interface V2 {
  x: number;
  y: number;
}
interface Pull {
  x: number;
  y: number;
  r: number;
}

const HAND = { tx: 200, ty: 560, rot: 32, s: 1.35 };

/** One string per fingertip. `k` = resting slack offsets for the two bezier control points. */
const STRINGS = [
  { tip: { x: -90, y: 0 }, anchor: { x: 512, y: 222 }, k: [-34, 46, 18, 38], amp: 9, speed: 0.9, phase: 0.2, w: 1.4 },
  { tip: { x: -60, y: -96 }, anchor: { x: 552, y: 240 }, k: [24, 58, -30, 30], amp: 12, speed: 0.7, phase: 1.6, w: 1.1 },
  { tip: { x: -18, y: -112 }, anchor: { x: 602, y: 245 }, k: [-20, 40, 26, 52], amp: 8, speed: 1.1, phase: 2.9, w: 1.6 },
  { tip: { x: 22, y: -102 }, anchor: { x: 662, y: 245 }, k: [30, 34, -14, 44], amp: 11, speed: 0.8, phase: 4.1, w: 1.2 },
  { tip: { x: 59, y: -80 }, anchor: { x: 722, y: 245 }, k: [-12, 52, 22, 28], amp: 10, speed: 1.0, phase: 5.3, w: 1.3 },
] as const;

const RAD = Math.PI / 180;

function handRotation(pull: Pull, ptr: V2) {
  return HAND.rot + pull.r + ptr.x * 1.6;
}

function tipWorld(local: V2, pull: Pull, ptr: V2): V2 {
  const a = handRotation(pull, ptr) * RAD;
  const sx = local.x * HAND.s;
  const sy = local.y * HAND.s;
  return {
    x: HAND.tx + pull.x + sx * Math.cos(a) - sy * Math.sin(a),
    y: HAND.ty + pull.y + sx * Math.sin(a) + sy * Math.cos(a),
  };
}

function stringD(i: number, t: number, pull: Pull, ptr: V2): string {
  const f = STRINGS[i];
  const S = tipWorld(f.tip, pull, ptr);
  const E = f.anchor;
  const s1 = Math.sin(t * f.speed + f.phase);
  const s2 = Math.sin(t * f.speed * 1.3 + f.phase * 1.7);
  const c1x = S.x + (E.x - S.x) * 0.33 + f.k[0] + s1 * f.amp + ptr.x * 10;
  const c1y = S.y + (E.y - S.y) * 0.33 + f.k[1] + s2 * f.amp * 0.6 + ptr.y * 6;
  const c2x = S.x + (E.x - S.x) * 0.7 + f.k[2] - s2 * f.amp + ptr.x * 7;
  const c2y = S.y + (E.y - S.y) * 0.7 + f.k[3] + s1 * f.amp * 0.5 + ptr.y * 4;
  return `M${S.x.toFixed(1)} ${S.y.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${E.x} ${E.y}`;
}

function handTransform(pull: Pull, ptr: V2) {
  return `translate(${(HAND.tx + pull.x).toFixed(1)} ${(HAND.ty + pull.y).toFixed(1)}) rotate(${handRotation(pull, ptr).toFixed(2)}) scale(${HAND.s})`;
}

const REST_PULL: Pull = { x: 0, y: 0, r: 0 };
const REST_PTR: V2 = { x: 0, y: 0 };

const finger = (x: number, w: number, h: number, lean: number) =>
  `M${x} 6 L${x + lean} ${-h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w + lean} ${-h + w / 2} L${x + w} 6`;

/* ───────────── Illustration: hand-drawn, black and ivory, inline SVG ───────────── */

function HandIllustration() {
  const ink = '#0b0b0b';
  return (
    <g className="hand" transform={handTransform(REST_PULL, REST_PTR)}>
      <g fill="url(#skin)" stroke={ink} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        {/* thumb sits behind the palm */}
        <path d="M-50 120 C-86 108 -108 66 -102 24 C-99 4 -82 -6 -76 10 C-70 30 -62 50 -48 64 Z" />
        <path d={finger(-58, 24, 96, -14)} />
        <path d={finger(-28, 26, 112, -3)} />
        <path d={finger(2, 25, 102, 8)} />
        <path d={finger(30, 22, 80, 18)} />
        <path d="M-62 4 Q-2 -12 58 4 C60 50 54 100 46 150 L50 214 L-50 214 L-44 150 C-56 100 -64 50 -62 4 Z" />
      </g>
      {/* sleeve */}
      <path d="M-56 200 L56 200 L68 360 L-68 360 Z" fill={ink} />
      <path d="M-56 200 L56 200" stroke="#f4f2ec" strokeWidth="1.2" opacity=".55" />
      {/* hand-drawn creases and knuckle marks */}
      <g fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" opacity=".8">
        <path d="M-34 44 q20 11 46 -4" />
        <path d="M-42 74 q30 14 72 -6" />
        <path d="M-30 -2 q4 5 9 0" />
        <path d="M-2 -4 q4 5 9 0" />
        <path d="M26 -1 q4 5 9 0" />
        <path d="M-46 128 q18 10 40 4" />
      </g>
      {/* pencil hatching for depth on the right side of the palm */}
      <g fill="none" stroke={ink} strokeWidth=".9" strokeLinecap="round" opacity=".45">
        <path d="M40 50 l-9 12" />
        <path d="M44 68 l-10 13" />
        <path d="M45 88 l-10 12" />
        <path d="M44 108 l-9 11" />
        <path d="M40 128 l-8 10" />
      </g>
      {/* soft highlight along the left edge */}
      <path d="M-56 14 C-60 50 -52 96 -42 140" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </g>
  );
}

/* ───────────── Section ───────────── */

export function Collaborate() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Pointer tilt for the button (Framer Motion owns every property on the button itself).
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 220, damping: 20 });

  const onBtnMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - b.left) / b.width);
    my.set((e.clientY - b.top) / b.height);
  };
  const onBtnLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  useGSAP(
    () => {
      const stageEl = stage.current;
      if (!stageEl) return;
      const paths = gsap.utils.toArray<SVGPathElement>('.string', stageEl);
      const knots = gsap.utils.toArray<SVGCircleElement>('.knot', stageEl);
      const hand = stageEl.querySelector<SVGGElement>('.hand');
      if (!hand) return;

      // GSAP owns: section copy, stage entrance, strings (dash + path data), hand transform attribute.
      // Framer Motion owns: the button's hover / tap / tilt / layout morph.
      const mm = gsap.matchMedia();
      mm.add(NO_PREFERENCE, () => {
        const pull: Pull = { ...REST_PULL };
        const ptr: V2 = { ...REST_PTR };
        let t = 0;
        let live = false;
        let inView = false;
        let pullTl: gsap.core.Timeline | null = null;

        const render = () => {
          paths.forEach((p, i) => p.setAttribute('d', stringD(i, t, pull, ptr)));
          knots.forEach((k, i) => {
            const w = tipWorld(STRINGS[i].tip, pull, ptr);
            k.setAttribute('cx', w.x.toFixed(1));
            k.setAttribute('cy', w.y.toFixed(1));
          });
          hand.setAttribute('transform', handTransform(pull, ptr));
        };
        const tick = (time: number) => {
          if (!live || !inView) return;
          t = time;
          render();
        };

        // Hidden start state (only applied when motion is allowed).
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(hand, { opacity: 0 });
        gsap.set(knots, { opacity: 0 });
        gsap.set('.collab-btn-wrap', { opacity: 0, y: 28, scale: 0.94 });
        gsap.set('.collab-copy > *', { opacity: 0, y: 24 });

        const intro = gsap.timeline({
          scrollTrigger: { trigger: stageEl, start: 'top 72%', once: true },
          onComplete: () => {
            gsap.set(paths, { strokeDasharray: 'none' });
            live = true;
            pullTl = gsap
              .timeline({ repeat: -1, repeatDelay: 0.5, paused: !inView })
              .to(pull, { x: -12, y: 14, r: -2.5, duration: 1.1, ease: 'power2.inOut' })
              .to(pull, { x: 3, y: -3, r: 0.8, duration: 0.55, ease: 'back.out(2)' })
              .to(pull, { x: 0, y: 0, r: 0, duration: 0.8, ease: 'sine.inOut' });
          },
        });
        intro
          .to('.collab-copy > *', { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
          .to(hand, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.1)
          .to(knots, { opacity: 1, duration: 0.4, stagger: 0.08 }, 0.5)
          .to(paths, { strokeDashoffset: 0, duration: 1.5, stagger: 0.14, ease: 'power2.inOut' }, 0.5)
          .to('.collab-btn-wrap', { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.6)' }, 0.9);

        // Only animate while the stage is on screen.
        const visibility = ScrollTrigger.create({
          trigger: stageEl,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            inView = self.isActive;
            pullTl?.paused(!inView);
          },
        });

        // Restrained pointer response (works for touch drags too; vertical page scroll is left alone via CSS).
        const qx = gsap.quickTo(ptr, 'x', { duration: 0.9, ease: 'power3.out' });
        const qy = gsap.quickTo(ptr, 'y', { duration: 0.9, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
          const b = stageEl.getBoundingClientRect();
          qx(gsap.utils.clamp(-1, 1, ((e.clientX - b.left) / b.width - 0.5) * 2));
          qy(gsap.utils.clamp(-1, 1, ((e.clientY - b.top) / b.height - 0.5) * 2));
        };
        const onLeave = () => {
          qx(0);
          qy(0);
        };
        stageEl.addEventListener('pointermove', onMove, { passive: true });
        stageEl.addEventListener('pointerleave', onLeave, { passive: true });
        stageEl.addEventListener('pointerup', onLeave, { passive: true });
        gsap.ticker.add(tick);

        return () => {
          gsap.ticker.remove(tick);
          stageEl.removeEventListener('pointermove', onMove);
          stageEl.removeEventListener('pointerleave', onLeave);
          stageEl.removeEventListener('pointerup', onLeave);
          visibility.kill();
          pullTl?.kill();
          intro.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const initialTips = STRINGS.map((s) => tipWorld(s.tip, REST_PULL, REST_PTR));

  return (
    <section ref={root} id="contact" className="section collab" aria-labelledby="collab-title">
      <div className="collab-copy">
        <p className="eyebrow mono">
          <span>05</span> Hire me
        </p>
        <h2 id="collab-title" className="collab-title">
          Let&rsquo;s build something <em>together</em>.
        </h2>
      </div>

      <div ref={stage} className="collab-stage">
        <svg className="collab-svg" viewBox="0 0 1000 620" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fbfaf6" />
              <stop offset="1" stopColor="#d9d5ca" />
            </linearGradient>
          </defs>
          <g className="strings" fill="none" stroke="#0b0b0b" strokeLinecap="round">
            {STRINGS.map((s, i) => (
              <path
                key={i}
                className="string"
                pathLength={1}
                strokeWidth={s.w}
                d={stringD(i, 0, REST_PULL, REST_PTR)}
              />
            ))}
          </g>
          <g fill="#0b0b0b">
            {STRINGS.map((s, i) => (
              <circle key={`a${i}`} cx={s.anchor.x} cy={s.anchor.y} r="2.2" />
            ))}
            {initialTips.map((p, i) => (
              <circle key={`k${i}`} className="knot" cx={p.x} cy={p.y} r="2.8" />
            ))}
          </g>
          <HandIllustration />
        </svg>

        <div className="collab-btn-wrap">
          <div className="collab-ground-shadow" aria-hidden="true" />
          <div className="collab-persp">
            {!open && (
              <motion.button
                ref={triggerRef}
                layoutId="collab"
                type="button"
                className="collab-btn"
                aria-haspopup="dialog"
                initial="rest"
                animate="rest"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  rest: {
                    y: 0,
                    scale: 1,
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,.28), inset 0 -10px 16px rgba(0,0,0,.65), 0 18px 30px -14px rgba(0,0,0,.55), 0 4px 10px -4px rgba(0,0,0,.4)',
                  },
                  hover: {
                    y: -7,
                    scale: 1.035,
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,.36), inset 0 -10px 16px rgba(0,0,0,.65), 0 34px 44px -18px rgba(0,0,0,.6), 0 10px 18px -8px rgba(0,0,0,.45)',
                  },
                  tap: { y: -1, scale: 0.97 },
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                style={{ rotateX, rotateY, borderRadius: 999 }}
                onPointerMove={onBtnMove}
                onPointerLeave={onBtnLeave}
                onClick={() => setOpen(true)}
              >
                <span className="collab-label">LET&rsquo;S COLLABORATE</span>
                <motion.span
                  className="collab-sweep"
                  aria-hidden="true"
                  initial={{ x: '-140%' }}
                  style={{ skewX: -20 }}
                  variants={{
                    rest: { x: '-140%', transition: { duration: 0 } },
                    hover: { x: '140%', transition: { duration: 0.9, ease: 'easeInOut' } },
                  }}
                />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <p className="collab-note mono">Press the button, or tap it on touch, to open my contact details.</p>

      <AnimatePresence>{open ? <ContactOverlay onClose={close} returnFocusTo={triggerRef} /> : null}</AnimatePresence>
    </section>
  );
}
