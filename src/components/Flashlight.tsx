import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useFlashlight, type FlashlightOptions } from './useFlashlight';

interface FlashlightProps extends FlashlightOptions {
  /** The dim layer: always visible, readable but unlit. */
  base: ReactNode;
  /** The lit layer: same layout as `base`, revealed only inside the beam. Decorative (aria-hidden). */
  reveal: ReactNode;
  /** Always-visible content above both layers (essential text, navigation, buttons). */
  children?: ReactNode;
  className?: string;
  /** Ambient glow colour painted around the beam. */
  glow?: string;
  /** 0–1: how much of the radius is fully bright before the feathered falloff begins. */
  core?: number;
}

/**
 * Reusable torchlight. Two stacked copies of a composition: the lit copy is
 * masked by a radial gradient that follows the pointer, so the beam reveals
 * real underlying content rather than decorating the cursor.
 */
export function Flashlight({
  base,
  reveal,
  children,
  className = '',
  glow = 'rgba(242, 194, 48, 0.14)',
  core = 0.16,
  radius = 240,
  rest = { x: 0.65, y: 0.4 },
  lerp,
  touchScale,
}: FlashlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFlashlight(ref, { radius, rest, lerp, touchScale });

  const style = {
    '--fx-x': `${rest.x * 100}%`,
    '--fx-y': `${rest.y * 100}%`,
    '--fx-r': `${radius}px`,
    '--fx-core': core,
    '--fx-glow': glow,
  } as CSSProperties;

  return (
    <div ref={ref} className={`flashlight ${className}`} style={style}>
      <div className="fx-base">{base}</div>
      <div className="fx-glow" aria-hidden="true" />
      <div className="fx-reveal" aria-hidden="true">
        {reveal}
      </div>
      {children ? <div className="fx-static">{children}</div> : null}
    </div>
  );
}
