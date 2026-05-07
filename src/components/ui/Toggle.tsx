import { cn } from '../../lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, size = 'md', disabled }: ToggleProps) {
  const dim = size === 'sm' ? { w: 32, h: 18, knob: 12 } : { w: 40, h: 22, knob: 16 };

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-block rounded-full transition-all duration-300',
          checked ? 'bg-positive/90 [box-shadow:0_0_0_1px_rgb(var(--positive)/0.4),0_0_8px_rgb(var(--positive)/0.4)]'
                  : 'bg-bg-base [box-shadow:inset_0_0_0_1px_rgb(var(--border-strong))]'
        )}
        style={{ width: dim.w, height: dim.h }}
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300',
            checked ? 'bg-white' : 'bg-text-muted'
          )}
          style={{
            width: dim.knob,
            height: dim.knob,
            left: checked ? dim.w - dim.knob - 3 : 3,
          }}
        />
      </span>
      {label && <span className="text-sm text-text-secondary">{label}</span>}
    </label>
  );
}
