# Plan: Fix Lucide-React Imports in HomePage

The goal is to fix the build error "Export barChart doesn't exist in target module" in `src/app/page.tsx`.

## Changes
- In `src/app/page.tsx`:
    - Change `barChart as BarChart` to `BarChart`.
    - Change `cpu as Cpu` to `Cpu`.

## Verification
- Run `npm run build` or `npm run dev` to verify that the error is gone.
