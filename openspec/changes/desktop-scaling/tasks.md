# Desktop Scaling — Tasks

## T1: globals.css — Add container-max token
- Add `--spacing-container-max: 1200px` to @theme
- Verify `max-w-container-max` works

## T2: Speed Gauge — Responsive sizing
- Add `lg:h-56 lg:w-56` to the gauge button
- Add `lg:h-72 lg:w-72` to ProgressRing wrapper
- Scale text if needed

## T3: SpeedTestPanel — Side-by-side desktop layout
- Wrap gauge + upload in a flex container
- `lg:flex-row lg:items-start lg:gap-xl` on desktop
- Mobile stays column

## T4: UploadSpeed — Desktop positioning
- The component stays the same, but its container handles positioning

## T5: ThroughputChart — Full width on desktop
- Already full width, verify it uses available space

## T6: HistoryList — 2-column grid on desktop
- Add `lg:grid-cols-2` to the entries container

## T7: Header — Desktop spacing
- Add `lg:px-xl lg:py-md` to header element

## T8: BottomNav — Hide on desktop
- Add `lg:hidden` to the nav element

## T9: Verify
- Build passes
- Desktop layout renders correctly
- Mobile layout unchanged
