---
name: Swapping React children inside contentEditable crashes
description: Conditionally swapping children of a contentEditable div throws removeChild DOMException; remount with a key
---

# contentEditable + conditional React children

A `contentEditable` div whose children are swapped by React state (e.g. switching
between an "original" body and a template-rendered body) can throw a removeChild
DOMException during reconciliation, because the browser mutates the contentEditable
DOM out from under React.

**Fix:** put a `key` on the contentEditable div that changes with the active
variant (e.g. `key={activeDocTab}`) so React fully unmounts/remounts the element
instead of reconciling its children.
