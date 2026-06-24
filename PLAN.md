# LBLF Theme Development Plan

## Phase 1 — Hebrew Bilingual Support (complete)

- RTL layout switching via `/he/` route detection
- Hebrew home/index collection templates (`home-he.hbs`, `index-he.hbs`) with `tag:[hash-he]` filter
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
