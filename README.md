# ELEVATE project page

Vite + React single-page site for *ELEVATE: Agentic Learning of Missing Capabilities
for Quadrupedal Manipulation*. Layout follows the Eureka-style research page template.

## Commands

```sh
npm install
npm run dev          # public build (author names) at http://localhost:5173
npm run dev:anon     # anonymous build (no names, links, or BibTeX)
npm run build:site   # -> dist/review (anonymous) + dist/public (named) + root redirect
npm run deploy       # runs build:site, then pushes dist/ to the gh-pages branch
```

Deployed layout on GitHub Pages:

| URL | Content |
|---|---|
| `/` | redirects to `/review/` |
| `/review/` | anonymous version |
| `/public/` | version with authors, links, and BibTeX |

`npm run build:anon` / `npm run build:public` still produce a single build in `dist/`
for local checks.

`identity.json` holds the real author data and is git-ignored so it never enters the public
repo; copy `identity.example.json` to `identity.json` on a new machine before a public build.

The anonymity switch is the `VITE_ANONYMOUS` environment variable, read once in
`src/content.js`. Everything identifying (authors, affiliations, contact line,
arXiv/Code buttons, BibTeX, footer acknowledgment) is gated on it.

## Where things live

| What | Where |
|---|---|
| All text, numbers, links, author list | `src/content.js` |
| Interactive task timeline (hero) | `src/components/TaskTimeline.jsx` |
| Per-task success chart + table | `src/components/SuccessChart.jsx` |
| Video slots with placeholder fallback | `src/components/VideoSlot.jsx`, files in `public/videos/` |
| Page layout and sections | `src/App.jsx` |
| Styles | `src/App.css`, `src/index.css` |
| Figures rendered from the paper PDFs | `public/imgs/` (task thumbnails in `public/imgs/tasks/`) |

## Videos

Copy MP4 files into `public/videos/` using the names listed in
`public/videos/README.md`. Slots show a "video coming soon" placeholder until the
file exists.

## Deploying to GitHub Pages

`vite.config.js` uses a relative base path (`base: './'`), so the built site works at
`https://<user>.github.io/<repo>/` for any repo name, and at `https://<user>.github.io/`
if the repo is named `<user>.github.io`.

One-time setup (run in this folder):

```sh
git init -b main
git config user.name  "<github-username>"
git config user.email "<id>+<github-username>@users.noreply.github.com"
git add -A
git commit -m "Initial project page"
git remote add origin https://github.com/<github-username>/<repo>.git
git push -u origin main
```

Publish (repeat after every change):

```sh
npm run deploy          # builds review/ and public/, then pushes dist/ to gh-pages
```

Then in the GitHub repo: Settings > Pages > Build and deployment > Source
"Deploy from a branch", branch `gh-pages`, folder `/ (root)`, Save.

The deploy script passes the repo-local `user.name`/`user.email` to gh-pages, so commits
on the `gh-pages` branch carry that identity rather than a global one. Keep the
noreply address if the site must stay anonymous.
