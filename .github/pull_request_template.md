## What and why

<!-- One or two sentences. Link the issue if there is one. -->

## Checks

- [ ] `npm test` is green
- [ ] Changeset added (`npm run changeset`) – or not needed: docs, CI or tests only
- [ ] Screenshots: changed on purpose → workflow **Update screenshots** run on this branch

## Checklist for Stable

Only when this pull request makes a component Stable (Guides / Component status). Every point must hold.

**Design**
- [ ] Component in the design library, built on the tokens – variants and states as in code
- [ ] No hard-coded values in the CSS: colors, spacing, radii and font sizes from tokens

**Behaviour**
- [ ] Behaviour and semantics from React Aria Components
- [ ] A story for every state: default, hover, pressed, focus, disabled – invalid, read-only, pending, empty where they apply
- [ ] Everything works with the keyboard; the keys are in the Accessibility section

**Tests**
- [ ] axe finds nothing in Light and Dark
- [ ] Interaction test for every interactive behaviour; green in Chromium, WebKit and Firefox
- [ ] Screenshot references for every documented story, Light and Dark

**Content**
- [ ] Built-in texts in English and German; components with texts run in German too (tag `locale-de`)
- [ ] Works at 320 px and with long content

**Docs**
- [ ] Usage, Playground, examples, Accessibility and Styling on the page
- [ ] Every prop has a description

**Screen readers**
- [ ] Tested with NVDA (Windows), VoiceOver (iPhone) and TalkBack (Android) following the test script
- [ ] Result in the Accessibility section: “Tested with … on …”
- [ ] Tag changed to `status:stable`, README table updated
