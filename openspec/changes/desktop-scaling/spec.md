# Desktop Scaling — Specification

## Goal
Adapt the NetMetric layout for desktop screens (≥1024px) so the UI uses available space effectively while preserving the mobile-first cyberpunk aesthetic.

## Requirements

### R1: Container Max-Width
- Define container-max as 1200px in globals.css
- Main content stays centered with max-width, gutters scale with viewport

### R2: Speed Gauge Scaling
- On desktop (≥1024px): button increases from 48x48 to 56x56 (h-56 w-56)
- ProgressRing scales accordingly from 64x64 to 72x72 (h-72 w-72)
- Text scales proportionally

### R3: Test Panel Side-by-Side
- On desktop: SpeedGauge on left, results (Upload + Metrics) on right
- Flex row with `lg:flex-row lg:items-start lg:gap-xl`
- Maintains column layout on mobile

### R4: Upload Speed Integration
- Upload speed appears alongside gauge on desktop instead of below
- On mobile: stays below gauge (current behavior)

### R5: ThroughputChart Desktop
- Chart container uses more horizontal space
- No change to SVG rendering logic

### R6: HistoryList Two Columns
- On desktop: entries display in 2-column grid (`lg:grid-cols-2`)
- On mobile: single column (current behavior)

### R7: Header Desktop Spacing
- Increased horizontal padding: `lg:px-xl`
- Increased vertical padding: `lg:py-md`

### R8: BottomNav Hidden on Desktop
- Bottom nav hidden on desktop (`lg:hidden`)
- All navigation accessible via the scroll buttons + header

### R9: SecondaryMetrics No Change
- Already 3-column grid, works on both mobile and desktop

## Files to Modify
- src/app/globals.css
- src/app/page.tsx
- src/components/test/speed-gauge/index.tsx
- src/components/test/speed-test-panel.tsx
- src/components/test/upload-speed.tsx
- src/components/test/throughput-chart/index.tsx
- src/components/ui/history-list.tsx
- src/components/layout/header.tsx
- src/components/layout/bottom-nav.tsx
