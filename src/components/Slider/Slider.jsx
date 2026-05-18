import { Slider as SliderPrimitive } from '../ui/slider'

export function Slider({ value, onChange, min = 0, max = 100, step = 1, disabled }) {
  return (
    <SliderPrimitive
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
    />
  )
}
