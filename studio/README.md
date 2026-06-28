# Portfolio Studio (no-code content editor)

This is the admin UI for the portfolio. Once deployed, you log in at
`https://<your-name>.sanity.studio`, edit content, hit **Publish**, and the live
site updates — no code, no redeploy.

## One-time setup

1. **Create a project** at https://www.sanity.io/manage → *New project*. Copy the **Project ID**.
2. **Add the ID here**: copy `.env.example` to `.env` and paste it:
   ```
   SANITY_STUDIO_PROJECT_ID=your_project_id
   ```
3. **Install + log in + deploy** (run inside this `studio/` folder):
   ```bash
   npm install
   npx sanity login
   npx sanity deploy        # pick a studio hostname → gives you the hosted admin URL
   ```
4. **Point the website at the same project** — in the repo root `.env`:
   ```
   VITE_SANITY_PROJECT_ID=your_project_id
   VITE_SANITY_DATASET=production
   ```
   For the GitHub Pages build, add `VITE_SANITY_PROJECT_ID` as a repo secret and
   pass it into the build step (see the deploy notes).
5. **Allow the website to read your content** (CORS):
   ```bash
   npx sanity cors add http://localhost:3000 --no-credentials
   npx sanity cors add https://<your-username>.github.io --no-credentials
   ```

## Daily use

- Edit locally: `npm run dev` → http://localhost:3333
- Or just use the hosted studio URL from step 3 (works from any browser/phone).
- Add a project / article / skill → fill the fields → **Publish**. Done.

## Content types

`project` · `skillCategory` · `experience` · `education` · `article` · `contactInfo`

The field names match what the website expects — don't rename them. Icon fields
(`skillCategory`, `contactInfo`) are dropdowns whose values map to icons in the UI.
Until at least one document of a type is published, the site falls back to the
local defaults in `src/data/fallbackData.ts`, so nothing ever looks empty.
