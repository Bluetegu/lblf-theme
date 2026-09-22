# LBLF Theme Development Plan

## Phase 1 — Hebrew Bilingual Support (complete)

- RTL layout switching via `/he/` route detection
- Hebrew home/index collection template (`index-he.hbs`) with `tag:[hash-he]` filter
- Language switcher (EN / עברית) in navigation — home-only
- Hebrew branding overrides (logo, title, description) via `locales/he.json` and `assets/images/logo-he.png`
- LTR enforcement on forms and footer copyright alignment for Hebrew pages
- Gulp `copyThemeLocales` task to bundle locale files into `assets/built/locales/`
- VS Code workspace guard (`.vscode/settings.json`) to prevent Handlebars auto-format corruption
- `.gitignore` updated to exclude `.DS_Store` and `dist/`

---

## Phase 2 — Known Limitations and Options

### 1. Tag pages show posts from both languages

Tag pages (`tag.hbs`) use Ghost's built-in template with no language filter,
so a tag page will show both Hebrew and English posts.

**Options (in order of effort):**

| Option                          | Approach                                                                                                                                                                                                                                                        | Effort        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| A. Accept as-is                 | Tag pages are discovery pages; mixing languages may be acceptable for a small audience.                                                                                                                                                                         | None          |
| B. Client-side hide             | JS snippet on `tag.hbs` that hides post cards whose URL starts (or does not start) with `/he/`. Simple but causes flash-of-wrong-content and breaks pagination counts.                                                                                          | Low           |
| C. `routes.yaml` custom routing | Ghost's dynamic routing lets you define `/he/tag/:slug/` and `/tag/:slug/` as separate collections filtered by both the tag slug and `tag:[hash-he]` membership. Add a matching `tag-he.hbs` template. This is the correct Ghost-native architectural solution. | Medium        |
| D. Tag namespacing              | Prefix Hebrew-only tags (`he-basketball` vs `basketball`) so they never share a tag page. Content-management discipline rather than code; practical only before a large tag library exists.                                                                     | Low (ongoing) |

**Recommended:** Option C if significant Hebrew readership ever follows tags; otherwise Option A.

---

### 2. Email subscriptions are unified

Ghost's default email system sends to all subscribed members. There is no
per-language filter on the subscribe button.

**Options (in order of effort):**

| Option                               | Approach                                                                                                                                                                                                                                           | Effort                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| A. Accept as-is                      | Send bilingual newsletters, or accept that some readers will unsubscribe from content in a language they don't read. Fine for a small audience.                                                                                                    | None                        |
| B. Ghost multiple newsletters        | Create named newsletters in Ghost Admin → Settings → Newsletters (e.g. "English" and "עברית"). The Portal subscribe button lets members choose. **No code changes required — pure Ghost Admin config.** This is the standard Ghost recommendation. | Low (config only)           |
| C. Label-based segmentation          | Assign member labels (`he-reader`) in Ghost Admin and filter recipients per label when sending. Labels must be assigned manually or via webhook; members cannot self-select at signup.                                                             | Medium                      |
| D. Language-prefilled subscribe link | Pair with Option B: change the Hebrew page subscribe buttons to a Portal link that pre-selects the Hebrew newsletter at signup (`#/portal/signup?newsletter=<uuid>`). Requires a small template change in `partials/components/navigation.hbs`.    | Low (after B is configured) |

**Recommended:** Option B (Ghost Admin config only) as the immediate step if newsletters are needed. Follow with Option D to auto-select the newsletter from Hebrew pages.

---

## Phase 3 — Future Fixes / Potential Upstream Contributions

Found while fixing the `/page/2/` and `/he/` pagination duplicate-posts bug (see git history).
Both items below are independent of this theme's own fix and worth raising upstream.

### 1. Ghost core: collection `template:` arrays aren't page-aware

`core/frontend/services/rendering/templates.js`'s `getEntriesTemplateHierarchy` builds its
template candidate list via `routerOptions.templates.forEach(t => templateList.unshift(t))`,
with no regard for the current page number. For a routes.yaml collection declaring
`template: [home, index]`, this makes `home` the top-priority candidate on *every* page, not just
page 1 — the separate, page-aware `frontPageTemplate` mechanism in the same function only ever
applies to the primary `/` collection (it checks `path === '/'`), so it can mask this for the
default collection but not for any secondary one. Net effect: any collection with more than one
`template:` entry always renders its first-listed template, on every page, regardless of
pagination — which is what caused this theme's `/page/2/`+ bug (production is still running with
the unfixed `template: [home, index]` array).

**Where this theme worked around it:** `routes.yaml` now declares a single template name per
collection (`index` / `index-he`), and `index.hbs`/`index-he.hbs` each include the header/featured/CTA
layout unconditionally rather than relying on Ghost to swap in a separate `home.hbs` per page.

**Potential upstream fix:** make the `routerOptions.templates` loop only include a given template
name when appropriate for the current page (e.g. treat the *first* declared template the same way
`frontPageTemplate` treats `home` today — page 1 only — for both primary and secondary collections),
or deprecate/warn on multi-name `template:` lists in `gscan` until that's fixed. Worth filing as a
Ghost core issue with a minimal repro (two-page collection, `template: [a, b]`, observe `b` never
renders) before considering a PR.

### 2. Theme CSS: `.gh-more` visibility hardcodes `12` instead of referencing `posts_per_page`

`assets/css/screen.css` has `.gh-feed:has(> :nth-child(12):last-child)~.gh-more { display: block; }`
— the `12` only happens to match this repo's `package.json` `config.posts_per_page: 12` by
coincidence, not by reference (CSS can't read a Handlebars/theme config value). If `posts_per_page`
is ever changed, this rule silently stops matching and the "See all" link disappears again. This
pre-dates this theme's Hebrew fork (inherited from the Ghost Casper/Source theme lineage), so a fix
should go upstream: either drop the `:nth-child(12)` cardinality check from that CSS rule (the
Handlebars-level `{{#match pagination.pages ">" 1}}` guard in `post-list.hbs` already prevents the
markup from rendering when there's nothing more to show, making the CSS check partially redundant),
or generate the number into the compiled CSS from the theme's own `posts_per_page` config at build
time.
