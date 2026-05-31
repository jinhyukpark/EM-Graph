---
name: react-grid-layout React 19 drag/resize stack
description: Version constraints for react-grid-layout + react-draggable + react-resizable so the dashboard Edit Template drag/resize works under React 19
---

The dashboard Edit Template feature (client/src/pages/Home.tsx) uses `react-grid-layout` with `{ Responsive, WidthProvider }` for draggable/resizable widgets. This project runs React 19, which removed `ReactDOM.findDOMNode`.

Working dependency set (all pass a `nodeRef`, so they avoid `findDOMNode`):
- `react-grid-layout` ^1.5.3  — GridItem passes `nodeRef` for moving; exports `Responsive` + `WidthProvider` as NAMED exports.
- `react-resizable` 3.2.0      — Resizable passes `nodeRef` to DraggableCore for resize handles.
- `react-draggable` 4.5.0+/4.6.0 — DraggableCore.findDOMNode() returns `nodeRef.current` when provided.

**Why:** Under React 19 any of these libraries that does NOT pass `nodeRef` falls back to `ReactDOM.findDOMNode` (undefined) and throws "ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop." Known bad combos:
- `react-grid-layout` v2.x → drops the named `WidthProvider` export, causing a Vite "does not provide an export named 'WidthProvider'" SyntaxError and a blank dashboard. Stay on v1.x.
- `react-resizable` 4.0.1 → does NOT pass nodeRef. The throw happens while the resize handles mount; the app's global error suppression (App.tsx isBenignError) swallows it, so the grid renders but drag AND resize are silently inert. Use 3.2.0.

**How to apply:** If dashboard widgets render but won't drag/resize, suspect a nodeRef-less version in this stack. Pin `react-resizable@3.2.0` and keep `react-grid-layout@^1.5.3`; confirm each installed lib references `nodeRef` (rg -rn nodeRef node_modules/<lib>). After changing versions, `rm -rf node_modules/.vite` and restart the workflow so Vite re-optimizes deps.
