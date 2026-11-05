import { useEffect, type RefObject } from 'react';

export interface FlashlightOptions {
  /** Beam radius in px (mouse). */
  radius?: number;
  /** Where the beam rests when the pointer is away / on first paint, as fractions of the container. */
  rest?: { x: number; y: number };
  /** 0–1 smoothing factor per frame; lower = heavier, more cinematic lag. */
  lerp?: number;
  /** Radius multiplier while a finger is down. */
  touchScale?: number;
}

/**
 * Drives the CSS custom properties --fx-x / --fx-y / --fx-r on `ref`.
 * Pointer events only store coordinates; a single requestAnimationFrame loop
 * (running only while the beam is moving and the element is on screen) writes
 * the variables. No React state, so no re-renders.
 *
 * Modes (exposed as data-fx-mode for CSS):
 *  - "live":   pointer/touch tracked with eased motion
 *  - "static": prefers-reduced-motion or a low-powered device → the beam stays
 *              at its rest position with a wider radius and nothing is tracked.
 */
export function useFlashlight(
  ref: RefObject<HTMLElement | null>,
  { radius = 240, rest = { x: 0.65, y: 0.4 }, lerp = 0.16, touchScale = 1.25 }: FlashlightOptions = {},
) {
  const restX = rest.x;
  const restY = rest.y;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
    const isStatic = reduced || lowPower;
    el.dataset.fxMode = isStatic ? 'static' : 'live';

    const restPoint = () => ({ x: el.clientWidth * restX, y: el.clientHeight * restY });
    const cur = restPoint();
    const tgt = { ...cur };
    let r = isStatic ? radius * 1.2 : radius;
    let rTgt = r;
    let raf = 0;
    let visible = true;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      el.style.setProperty('--fx-x', `${cur.x.toFixed(1)}px`);
      el.style.setProperty('--fx-y', `${cur.y.toFixed(1)}px`);
      el.style.setProperty('--fx-r', `${r.toFixed(1)}px`);
    };

    const tick = () => {
      raf = 0;
      if (pending) {
        const box = el.getBoundingClientRect();
        tgt.x = pending.x - box.left;
        tgt.y = pending.y - box.top;
        pending = null;
      }
      cur.x += (tgt.x - cur.x) * lerp;
      cur.y += (tgt.y - cur.y) * lerp;
      r += (rTgt - r) * 0.12;
      apply();
      const moving =
        Math.abs(tgt.x - cur.x) > 0.3 || Math.abs(tgt.y - cur.y) > 0.3 || Math.abs(rTgt - r) > 0.3;
      if (visible && moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    apply();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);

    const ro = new ResizeObserver(() => {
      if (isStatic) {
        const p = restPoint();
        cur.x = tgt.x = p.x;
        cur.y = tgt.y = p.y;
        apply();
      }
    });
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      pending = { x: e.clientX, y: e.clientY };
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      rTgt = radius * touchScale;
      onMove(e);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      rTgt = radius; // beam stays where the finger left it
      kick();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pending = null;
      const p = restPoint();
      tgt.x = p.x;
      tgt.y = p.y;
      kick();
    };

    if (!isStatic) {
      el.addEventListener('pointermove', onMove, { passive: true });
      el.addEventListener('pointerdown', onDown, { passive: true });
      el.addEventListener('pointerup', onUp, { passive: true });
      el.addEventListener('pointercancel', onUp, { passive: true });
      el.addEventListener('pointerleave', onLeave, { passive: true });
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, radius, restX, restY, lerp, touchScale]);
}
