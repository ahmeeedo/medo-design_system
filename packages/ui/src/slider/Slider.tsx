import { useMemo, type ReactNode } from 'react';
import { Label, Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack, useLocale, type SliderProps as AriaSliderProps } from 'react-aria-components';
import { NumberField } from '../number-field/NumberField';
import { cx } from '../utils/cx';
import '../tooltip/tooltip.css';
import './slider.css';

type Value = number | number[];

export interface SliderProps<T extends Value = number> extends Omit<AriaSliderProps<T>, 'children' | 'className' | 'style'> {
  /** Visible label. Without it set `aria-label`. */
  label?: ReactNode;
  /** Range: a name per thumb („Minimum price“, „Maximum price“). Default: „Minimum“ / „Maximum“ + label. */
  thumbLabels?: [string, string];
  /** Tick marks for few fixed steps (≤ 10) – the thumb snaps to them. */
  showTicks?: boolean;
  /** Min and max below the track, when the range is not obvious from the label. */
  showMinMax?: boolean;
  /** The value label above the track (always visible by default). */
  showValue?: boolean;
  className?: string;
}

/**
 * Slider – pick an approximate value or a range by dragging (Figma: C32 Slider). Built on React Aria Slider:
 * arrow keys (step), Page Up/Down (10 %), Home/End, a click on the track moves the nearest thumb; range thumbs
 * never cross. The value is always shown next to the label and read out in the same format (`formatOptions`).
 * While dragging, a tooltip repeats it above the thumb. For exact values use SliderField.
 */
export function Slider<T extends Value = number>({
  label,
  thumbLabels,
  showTicks,
  showMinMax,
  showValue = true,
  minValue = 0,
  maxValue = 100,
  step = 1,
  formatOptions,
  className,
  ...props
}: SliderProps<T>) {
  const { locale } = useLocale();
  const format = useMemo(() => new Intl.NumberFormat(locale, formatOptions), [locale, formatOptions]);
  const steps = Math.round((maxValue - minValue) / step);
  const labelText = typeof label === 'string' ? label : (props['aria-label'] ?? '');

  return (
    <AriaSlider<T> {...props} minValue={minValue} maxValue={maxValue} step={step} formatOptions={formatOptions} className={cx('medo-slider', className)}>
      {({ state }) => {
        const range = state.values.length > 1;
        const start = range ? state.getThumbPercent(0) : 0;
        const end = state.getThumbPercent(state.values.length - 1);
        return (
          <>
            {(label || showValue) && (
              <div className="medo-slider__header">
                {label && (
                  <Label className="medo-slider__label" aria-disabled={props.isDisabled || undefined}>
                    {label}
                  </Label>
                )}
                {showValue && <SliderOutput className="medo-slider__value" aria-disabled={props.isDisabled || undefined} />}
              </div>
            )}
            <SliderTrack className="medo-slider__track">
              <span className="medo-slider__rail" aria-hidden="true" />
              {showTicks && steps <= 10 && (
                <span className="medo-slider__ticks" aria-hidden="true">
                  {Array.from({ length: steps + 1 }, (_, i) => (
                    <span key={i} className="medo-slider__tick" style={{ insetInlineStart: `${(i / steps) * 100}%` }} />
                  ))}
                </span>
              )}
              <span className="medo-slider__fill" style={{ insetInlineStart: `${start * 100}%`, inlineSize: `${(end - start) * 100}%` }} aria-hidden="true" />
              {state.values.map((_, i) => (
                <SliderThumb
                  key={i}
                  index={i}
                  aria-label={range ? (thumbLabels?.[i] ?? `${i === 0 ? 'Minimum' : 'Maximum'} ${labelText}`.trim()) : undefined}
                  className="medo-slider__thumb"
                >
                  {({ isDragging }) =>
                    // The finger covers the thumb: show the value above it while dragging.
                    isDragging && (
                      <span className="medo-tooltip medo-slider__bubble" aria-hidden="true">
                        {state.getThumbValueLabel(i)}
                      </span>
                    )
                  }
                </SliderThumb>
              ))}
            </SliderTrack>
            {showMinMax && (
              <div className="medo-slider__limits" aria-hidden="true">
                <span>{format.format(minValue)}</span>
                <span>{format.format(maxValue)}</span>
              </div>
            )}
          </>
        );
      }}
    </AriaSlider>
  );
}

export interface SliderFieldProps<T extends Value = number> extends Omit<SliderProps<T>, 'value' | 'defaultValue' | 'onChange' | 'showValue'> {
  value: T;
  onChange: (value: T) => void;
  /** Accessible names of the number inputs. Default: the label (single) or the thumb labels (range). */
  inputLabels?: [string, string];
}

/**
 * Slider field – a Slider plus number inputs for exact values (Figma: C32 Slider field). Single: input on the
 * right (88). Range: two inputs below (min – max). Slider and inputs stay in sync; the inputs clamp on blur.
 */
export function SliderField<T extends Value = number>({ value, onChange, inputLabels, ...props }: SliderFieldProps<T>) {
  const { minValue = 0, maxValue = 100, step = 1, formatOptions, isDisabled, label, thumbLabels } = props;
  const labelText = typeof label === 'string' ? label : (props['aria-label'] ?? '');
  const field = { step, formatOptions, isDisabled, size: 'md' as const };

  if (Array.isArray(value)) {
    const [lo, hi] = value as number[];
    const names = inputLabels ?? thumbLabels ?? [`Minimum ${labelText}`.trim(), `Maximum ${labelText}`.trim()];
    return (
      <div className="medo-slider-field medo-slider-field--range">
        <Slider<T> {...props} value={value} onChange={onChange} />
        <div className="medo-slider-field__inputs">
          <NumberField {...field} aria-label={names[0]} minValue={minValue} maxValue={hi} value={lo} onChange={(v) => !Number.isNaN(v) && onChange([v, hi] as T)} />
          <span className="medo-slider-field__dash" aria-hidden="true">
            –
          </span>
          <NumberField {...field} aria-label={names[1]} minValue={lo} maxValue={maxValue} value={hi} onChange={(v) => !Number.isNaN(v) && onChange([lo, v] as T)} />
        </div>
      </div>
    );
  }

  return (
    <div className="medo-slider-field medo-slider-field--single">
      <Slider<T> {...props} value={value} onChange={onChange} showValue={false} />
      <NumberField
        {...field}
        aria-label={inputLabels?.[0] ?? labelText}
        minValue={minValue}
        maxValue={maxValue}
        value={value as number}
        onChange={(v) => !Number.isNaN(v) && onChange(v as T)}
        className="medo-slider-field__input"
      />
    </div>
  );
}
