# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for **AppTeck.ai** (Melbourne-based AI agent agency for Australian SMBs). Deployed via GitHub Pages with custom domain `appteck.ai` (see `CNAME`). No build step, no package manager, no test suite — pushing to `main` deploys.

## Structure

- `index.html`, `agents.html` — page entry points. Each manually `<link>`s the CSS files it needs and `<script>`s the JS modules at the bottom.
- `assets/css/` — split by concern: `main.css` (tokens/reset), `layout.css`, `components.css`, `chat.css`, `agents.css` (page-specific).
- `assets/js/` — vanilla JS, no bundler. `main.js` (nav/scroll/FAQ), `form.js`, `chat.js`, `agents.js`. Each file wires its own listeners on `DOMContentLoaded`; there is no shared module system.
- `assets/` (root) — SVG logos.
- `CNAME` — GitHub Pages custom domain.

## Local preview

`python -m http.server 8000` from the repo root, then open `http://localhost:8000/`. Opening the HTML files via `file://` works for layout but breaks the `fetch()` calls in `chat.js` / `form.js` due to CORS.

## Backend dependencies

Two external endpoints the frontend talks to. They are **not** in this repo.

- `https://leads.appteck.ai/lead` — lead capture (POST JSON). Called from `assets/js/form.js`.
- `https://leads.appteck.ai/chat` — Anthropic-backed chat proxy (POST `{ messages: [...] }`, returns `{ reply }` or raw Anthropic `{ content: [{ text }] }`). Called from `assets/js/chat.js`. **The system prompt lives server-side**, not in this repo — do not try to add one client-side.
- `https://formspree.io/f/mzdkeznw` — Formspree fallback for the lead form.

The form fires both `formspree` and `leads.appteck.ai/lead` in parallel and treats success if **either** returns ok — preserve that redundancy when editing `form.js`.

The chat keeps a rolling history capped at `MAX_HISTORY = 20` turns and sends the full array every request; the proxy is therefore stateless from the frontend's perspective.

## Cross-page consistency

Pricing tiers (Small / Medium / Large), setup timelines, and the AU compliance list (Privacy Act 1988, AHPRA, TGA, NCCP) appear in marketing copy across `index.html` *and* in the chat's server-side system prompt. When changing any of these numbers/claims here, the prompt on `leads.appteck.ai` also needs updating or the chat will give stale answers.

## Styling

All colors, fonts, and the dark-theme palette are CSS custom properties under `:root` in `assets/css/main.css`. Reuse those tokens instead of hardcoding hex values. Sections that should fade in on scroll need the `.reveal` class — `main.js` wires the IntersectionObserver.
