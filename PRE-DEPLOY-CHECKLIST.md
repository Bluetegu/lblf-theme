# Pre-Deploy Manual QA Checklist

Run through this before uploading a rebased theme zip to the production site. Most
items are covered by `pnpm test` (gscan) and the automated build, but gscan can't
catch visual/interactive regressions — check those here.

## Every time (after any rebase onto a new upstream tag)

- [ ] `pnpm install && pnpm run build && pnpm test` all pass clean.
- [ ] EN home (`/`) renders correctly (logo, hero, post list, footer/newsletter).
- [ ] HE home (`/he/`) renders correctly, RTL mirrored (nav/menu sides swapped,
      Hebrew title reads right-to-left, Hebrew logo shows).
- [ ] A post page renders correctly (title, author, feature image, "Read more").
- [ ] Remark42 comments widget attempts to load on a post (fails locally without a
      Remark42 backend running — that's expected, not a regression).
- [ ] Language switcher (EN / עברית) works both directions.
- [ ] Tag/author archive pages still load.
- [ ] `/page/2/` (and `/he/` pagination) shows the correct posts, no duplicates.

## Mobile / small-viewport checks (not covered by the desktop-only checks above)

- [ ] Stacked navigation layout looks correct at tablet width (~768–900px).
- [ ] Opening the mobile hamburger menu locks background scroll; closing it restores
      scroll correctly.
- [ ] Feature-image lightbox opens/closes correctly on a post (tap to open, tap/swipe
      to dismiss).

## Known gaps carried over from the v1.7.1 → v1.7.6 rebase (2026-10-29)

These upstream fixes were merged in but only verified by clean build + code review,
**not** interactively tested — check them the first time you deploy after this rebase:

- [ ] **Stacked nav at tablet widths** (upstream v1.7.5 fix).
- [ ] **Mobile menu background-scroll lock** (upstream v1.7.6 fix).
- [ ] **Lightbox on feature images** (upstream v1.7.3 fix) — confirmed working in one
      manual desktop-browser check during the rebase, but not on an actual mobile
      viewport/touch device.

Once verified on production (or a staging copy), move these into "Every time" above if
they're now part of the routine, or delete them if they've since been re-verified.
