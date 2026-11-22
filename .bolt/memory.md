# Project memory

## Product intent & audience

- Mandas 1 Shot Film Studio — a studio/landing page served only at a specific production URL.
- Intended for visitors arriving at the exact bolt.host subdomain; all other hostnames should not reach the studio page.

## Brand personality & voice

- Film/studio branding ("Mandas 1 Shot Film Studios").
- Production-grade, bespoke presentation expected (per global instructions in `.bolt/prompt`).

## Visual design & UX direction

- Built with Vite + React (JSX), Tailwind CSS, Lucide React icons.
- Access to the studio page is gated by hostname logic in `index.html`, not purely by routing inside React.
- `#studio` hash also opens the studio page as an alternative entry.

## Decisions, constraints & rationale

- Studio page must load **only** when the hostname is exactly `mands1shot1filmstudios.bolt.host` (or via `#studio` hash).
- Removed prior loose hostname prefix matching (`mandasfilm`, `mandas1shot`) so other addresses no longer redirect into the studio.
- No UI/theme/icon packages beyond the template defaults; Lucide React is the icon library.
- Build verification (Vite build) is used to confirm changes pass before finishing.

## Open questions & assumptions

- Whether other hostnames should show a default landing/placeholder page or simply not load the studio (assumed: studio simply unavailable, no custom fallback specified yet).
- Whether `#studio` hash access should remain long-term or is a dev/testing convenience.
- Brochure/content details for the studio page are not yet specified.