---
'@med-o/ui': minor
---

New `Stepper` and `Step`: where someone is in a task of several steps (checkout, sign-up). Done steps are links back (`href` or `onPress`), the current step has `aria-current="step"`, upcoming steps cannot be reached yet. Optional `description` per step. Below 640 px (`layout="auto"`): “Step 2 of 4”, the current step and one bar segment per step.

**Breaking:** new built-in texts `stepper.label`, `stepper.count` and `stepper.completed`. If you pass your own language to `MessagesProvider`, add them – TypeScript names the missing texts.
