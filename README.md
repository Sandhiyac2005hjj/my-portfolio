# Sandhiya C — Portfolio

Cinematic editorial portfolio. React 19 + TypeScript + Vite, with **GSAP (+ ScrollTrigger, @gsap/react)** for timelines, scroll reveals, parallax and the pinned project sequence, and **Framer Motion** for UI interaction (buttons, nav indicator, contact overlay morph).

```bash
npm install
npm run dev        # local dev
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/content.ts` | **All content and links.** Sourced from the resume, including the URLs embedded in it. Edit here only. |
| `src/components/Flashlight.tsx`, `useFlashlight.ts` | Reusable torchlight: `<Flashlight base={…} reveal={…} radius rest core glow />` |
| `src/components/Hero.tsx` | Opening timeline, portrait, outlined name, flashlight-revealed annotations |
| `src/components/Projects.tsx` | Three case studies, each with its own layout |
| `src/components/Collaborate.tsx`, `ContactOverlay.tsx` | "Let's collaborate" section and dialog |
| `src/lib/useReveal.ts` | `data-reveal`, `data-line`, `data-clip` scroll reveals |
| `public/portrait-*.jpg` | Portrait (cropped to remove the corner watermark) |

## Motion ownership (to avoid GSAP/Framer conflicts)

- GSAP: hero timeline, parallax, scroll reveals, pinned horizontal sequence, ECG draw, string drawing/sway, hand pull, section entrance.
- Framer Motion: button hover/tap/tilt/light-sweep, nav underline, mobile menu, overlay morph (`layoutId="collab"`).
- Reduced motion: GSAP work lives inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`, so content simply renders in place; the flashlight becomes a static beam; Framer uses `MotionConfig reducedMotion="user"`.

## Flashlight notes

The lit layer is a second copy of the composition masked by a radial gradient driven by `--fx-x/--fx-y/--fx-r`. A single rAF loop writes those variables (no React re-renders), runs only while the beam moves and is on screen, and is disabled (static beam) for reduced motion or devices reporting ≤2 CPU cores / ≤2 GB memory. Touch: tap or drag moves the beam; vertical swipes still scroll.

## Not verified yet

Dependencies could not be installed where this was written, so `npm run build` and a browser check have not been run. Please run them first.
