/* Anchor ids are derived from translated headings and are therefore
   language-dependent: umlauts drop out without replacement, so "Größen"
   becomes "gren". The search index generator reads this same function, so
   pre-generated anchors cannot drift from the rendered ones. */
export const generateId = (text) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
