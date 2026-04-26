import { useState } from 'react'
import styles from './Toggle.module.css'

/**
 * Toggle
 */
export function Toggle({ label, checked: controlledChecked, defaultChecked = false, onChange }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (e) => {
    if (!isControlled) setInternalChecked(e.target.checked)
    onChange?.(e.target.checked)
  }

  return (
    <label className={styles.toggleWrap}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={styles.hiddenInput}
      />
      <div className={[styles.track, checked ? styles.checked : ''].join(' ')}>
        <div className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}

/**
 * Checkbox
 */
export function Checkbox({ label, checked: controlledChecked, defaultChecked = false, onChange, disabled }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const handleChange = (e) => {
    if (!isControlled) setInternalChecked(e.target.checked)
    onChange?.(e.target.checked)
  }

  return (
    <label className={[styles.checkRow, disabled ? styles.disabled : ''].join(' ')}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <div className={[styles.checkBox, checked ? styles.checkBoxChecked : ''].join(' ')}>
        {checked && <CheckIcon />}
      </div>
      {label && <span className={styles.checkLabel}>{label}</span>}
    </label>
  )
}

/**
 * Radio
 */
export function Radio({ label, checked, onChange, name, value, disabled }) {
  return (
    <label className={[styles.checkRow, disabled ? styles.disabled : ''].join(' ')}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <div className={[styles.radioBox, checked ? styles.radioBoxChecked : ''].join(' ')}>
        {checked && <div className={styles.radioDot} />}
      </div>
      {label && <span className={styles.checkLabel}>{label}</span>}
    </label>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
