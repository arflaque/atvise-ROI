import { useROIState } from '../../hooks/useROIState';
import { cn } from '../../lib/cn';

interface Props {
  /** Height of the logos in px */
  size?: number;
  /** Whether to show the divider between atvise and Vester */
  withDivider?: boolean;
  className?: string;
}

/**
 * Renders the atvise + Vester lockup, swapping to the appropriate variant for the
 * active theme so both wordmarks stay legible on dark and corporate backgrounds.
 */
export function BrandLogos({ size = 28, withDivider = true, className }: Props) {
  const { state } = useROIState();
  const isDark = state.theme === 'dark';
  const base = import.meta.env.BASE_URL;
  const atvise = `${base}atvise-on-${isDark ? 'dark' : 'light'}.svg`;
  const vester = `${base}vester-on-${isDark ? 'dark' : 'light'}.svg`;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src={atvise}
        alt="atvise"
        style={{ height: size }}
        className="w-auto select-none"
        draggable={false}
      />
      {withDivider && (
        <span
          aria-hidden
          className="block h-6 w-px bg-border"
        />
      )}
      <img
        src={vester}
        alt="Vester Business"
        style={{ height: size }}
        className="w-auto select-none"
        draggable={false}
      />
    </div>
  );
}

