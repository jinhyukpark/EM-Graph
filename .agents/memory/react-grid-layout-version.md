---
name: react-grid-layout version pin
description: Why react-grid-layout must stay on v1.x for the dashboard Edit Template feature
---

The dashboard Edit Template feature (client/src/pages/Home.tsx) imports `{ Responsive, WidthProvider } from "react-grid-layout"`.

Rule: keep `react-grid-layout` pinned to `^1.5.3` (v1.x).

**Why:** v2.x changed the module exports — `WidthProvider` is no longer a named export, causing a runtime SyntaxError ("does not provide an export named 'WidthProvider'"). The auto package installer defaults to the latest major (v2), which breaks the dashboard.

**How to apply:** If the dashboard goes blank with a WidthProvider export error, verify the installed version is v1.x, reinstall `react-grid-layout@1.5.3`, then clear the Vite dep cache (`rm -rf node_modules/.vite`) and restart the workflow so Vite re-optimizes against the correct version.
