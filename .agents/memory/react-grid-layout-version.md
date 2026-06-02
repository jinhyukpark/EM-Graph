---
name: react-grid-layout drag/resize on Replit (React 19 + Vite)
description: Dependency and Vite-config requirements so the dashboard Edit Template drag/resize actually works in the browser
---

The dashboard Edit Template feature (client/src/pages/Home.tsx) uses `react-grid-layout` with `{ Responsive, WidthProvider }` for draggable/resizable widgets. Getting drag/resize to actually work in this Vite + React 19 setup required THREE separate fixes — they are easy to confuse because each produces a different failure mode.

1. **react-grid-layout must stay on v1.x (^1.5.3).** v2.x drops the named `WidthProvider` export → Vite "does not provide an export named 'WidthProvider'" SyntaxError → blank dashboard.

2. **Whole drag/resize stack must pass `nodeRef` (React 19 removed `ReactDOM.findDOMNode`).** Working set: `react-grid-layout`@1.5.3 (GridItem passes nodeRef for moving), `react-resizable`@3.2.0 (passes nodeRef for resize handles), `react-draggable`@4.5.0+ (DraggableCore.findDOMNode returns nodeRef.current). `react-resizable`@4.0.1 does NOT pass nodeRef → throws while resize handles mount; the app's global error suppression (App.tsx isBenignError) swallows it, so the grid renders but is inert.

3. **react-draggable references `process.env.DRAGGABLE_DEBUG` at runtime, which crashes in the browser.** Its `log()` helper runs `if (process.env.DRAGGABLE_DEBUG) ...` and is called from `handleDragStart`. `process` is undefined in the browser → `ReferenceError: process is not defined` the moment you start dragging. Fix in vite.config.ts: add the replacement to BOTH `define` AND `optimizeDeps.esbuildOptions.define`:
   ```ts
   define: { "process.env.DRAGGABLE_DEBUG": "false" },
   optimizeDeps: { esbuildOptions: { define: { "process.env.DRAGGABLE_DEBUG": "false" } } },
   ```
   **Why both:** Vite's top-level `define` is NOT applied to dependency pre-bundling. Without the `optimizeDeps.esbuildOptions.define` copy, the optimized dep bundle still contains the raw `process.env.DRAGGABLE_DEBUG` and still crashes. Verify the replacement landed: `rg "DRAGGABLE_DEBUG" node_modules/.vite/deps/react-grid-layout.js` should show `if (false) console.log(...)`.

**How to apply / verify:** After any of these changes, `rm -rf node_modules/.vite`, restart the workflow, then load /#/dashboard once (Vite optimizes deps lazily on first request) before checking the bundle/console.
