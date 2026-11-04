# GitHub Pages — deploy / live

How this portfolio ships as a static site on **`https://icodeayush.github.io/`**.

## What we use

| Piece | Role |
|---|---|
| `next.config.js` | `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true` → build writes static HTML to `out/` |
| `.github/workflows/deploy-github-pages.yml` | On push to `main` (or manual run): `npm ci` → `npm run build` → upload `out/` → deploy Pages |
| GitHub repo named **`icodeayush.github.io`** | User site; URL is the account root (no `/repo` path, no `basePath`) |

Local `npm run dev` is unchanged. Production on Pages is the static `out/` folder only (no Next server, no API routes).

## Remotes (this machine)

Keep the main product remote separate from the Pages remote:

```bash
git remote -v
# origin  → your normal project remote (dev / source of truth)
# pages   → https://github.com/icodeayush/icodeayush.github.io.git
```

Add the Pages remote if missing:

```bash
git remote add pages https://github.com/icodeayush/icodeayush.github.io.git
```

**Do not** push portfolio Pages updates with `git push origin` unless you also intend to update that other repo.

## First-time setup (live account)

1. Create a **public** empty repo named exactly **`icodeayush.github.io`** (no README / .gitignore / license).
2. Auth as the account that owns that repo (`gh auth login` or a PAT with `repo` + `workflow`).
3. From this project:

   ```bash
   git remote add pages https://github.com/icodeayush/icodeayush.github.io.git
   git push -u pages main
   ```

4. Repo → **Settings → Pages** → Source: **GitHub Actions** (not “Deploy from a branch”).
5. Wait for **Actions → Deploy GitHub Pages** to finish.
6. Open **https://icodeayush.github.io/**

Fine-grained PATs need **Contents: Read and write**, **Metadata**, and **Workflows** on that repo (or all repos). Classic PAT: scopes **`repo`** + **`workflow`**.

## Update the live site later

1. Commit your changes on `main` in this project.
2. Push only to Pages:

   ```bash
   git push pages main
   ```

3. Confirm the **Deploy GitHub Pages** workflow is green.
4. Hard-refresh the site (CDN can cache ~minutes).

Manual redeploy without a new commit: GitHub → Actions → **Deploy GitHub Pages** → **Run workflow**.

## Local check before push

```bash
npm run build
# inspect out/ — should contain index.html, _next/, etc.
npx serve out   # optional smoke test
```

If `npm run build` fails, Pages will fail too.

## Gotchas

- Repo name must be **`username.github.io`** for the root user URL. A differently named repo becomes `username.github.io/repo-name/` and would need `basePath` / `assetPrefix` (this project is set up for the root user site — no `basePath`).
- Pages source must be **GitHub Actions**. Branch-from-root would serve Next source, not `out/`.
- `next/image` stays unoptimized under static export.
- **Fonts:** load Google Fonts with `<link>` in `src/app/layout.tsx`, not `@import` in SCSS. Production CSS bundling can place `@import` mid-file; browsers ignore those, so text falls back to system sans and looks tighter/wrong vs local.
- Do not put secrets or private CMS URLs in this Doc or in repo config comments.
- After going live, set real `metadataBase` / OG URLs in `src/app/layout.tsx` to `https://icodeayush.github.io` (or your custom domain).

## Quick checklist

- [ ] `npm run build` succeeds locally  
- [ ] Changes committed on `main`  
- [ ] `git push pages main`  
- [ ] Actions → Deploy GitHub Pages = success  
- [ ] https://icodeayush.github.io/ looks right  
