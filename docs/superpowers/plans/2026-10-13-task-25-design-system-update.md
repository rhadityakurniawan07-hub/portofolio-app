# Task: UI/UX Design System Update

## Overview
Update the UI/UX design system of the portfolio app to match the new design reference.

## Requirements
- [ ] Update design system (colors, typography, spacing) in globals.css
- [ ] Update Navbar component
- [ ] Update HeroSection layout and styling
- [ ] Update ProfileCard component
- [ ] Update ProjectCard component
- [ ] Update ProfileModal form
- [ ] Update ProjectCard and ProjectModal
- [ ] Update Navbar component
- [ ] Update Footer component
- [ ] Update globals.css with new design tokens
- [ ] Run verification - type-check, lint, build, tests

## Design Requirements
- [ ] Update color scheme (primary, secondary, accent colors)
- [ ] Update typography (font families, sizes, weights)
- [ ] Update spacing system
- [ ] Update border radius, shadows, transitions
- [ ] Update component styling (buttons, cards, forms, modals)
- [ ] Update form components (inputs, buttons, selects, textareas)

## Design Reference
- Reference: User provided design image (to be matched)
- Theme: Dark mode with modern, clean aesthetic
- Color scheme: To be determined from reference image

## Components to Update
1. `apps/web/app/globals.css` - Design tokens
2. `apps/web/app/components/Navbar.tsx`
3. `apps/web/app/components/HeroSection.tsx`
3. `apps/web/app/components/ProfileCard.tsx`
4. `apps/web/app/components/ProjectCard.tsx`
5. `apps/web/app/components/ProfileModal.tsx`
6. `apps/web/app/components/ProjectCard.tsx`
6. `apps/web/app/components/ProjectModal.tsx`
7. `apps/web/app/components/Navbar.tsx`
8. `apps/web/app/components/Footer.tsx`
8. `apps/web/app/globals.css`

## Acceptance Criteria
- [ ] TypeScript check passes (`bunx turbo run check-types --filter=web`)
- [ ] Lint passes (`bunx turbo run lint --filter=web`)
- [ ] Build succeeds (`bunx turbo run build --filter=web`)
- [ ] Tests pass (`node --test apps/web/lib/portfolio.test.ts`)

## Notes
- Do not modify existing data/tasks - only update UI/styling
- Keep all data dynamic (from database/state)
- Maintain existing functionality while updating visual design