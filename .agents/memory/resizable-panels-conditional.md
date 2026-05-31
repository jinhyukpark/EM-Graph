---
name: react-resizable-panels conditional panels crash
description: Conditionally-rendered ResizablePanels crash on resize unless the PanelGroup gets a key tied to which panels are visible
---

# react-resizable-panels: conditional panels need a changing key

When a `ResizablePanelGroup` contains `ResizablePanel`s that are conditionally
rendered (e.g. `{showGraph && <ResizablePanel/>}`), dragging a `ResizableHandle`
throws an uncaught exception (surfaces as the vague "An uncaught exception occured
but the error was not an error object"), and the console shows
"WARNING: Invalid layout total size ... Layout normalization will be applied".

**Fix:** give the `ResizablePanelGroup` a `key` that changes whenever the set of
visible panels changes, e.g.
`key={\`kg-inner-${showDocDetails?'d':''}${showGraph?'g':''}${showCopilot?'c':''}\`}`.
This forces the group to remount and re-initialize its internal layout state so it
matches the actual children.

**Why:** the library keeps internal layout state keyed by panel order/count. When
panels mount/unmount without the group remounting, that state desyncs from the real
children and resize math throws.

**How to apply:** any time panels inside a group are wrapped in conditionals, add a
visibility-derived key to the group. In KnowledgeGarden.tsx both `kg-outer`
(explorer) and `kg-inner` (docdetails/graph/copilot) groups use this.
