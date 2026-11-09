# Public projects page

Static page served by GitHub Pages. Everything in this repo is public.

- Edit `projects.json`, then run `node build.mjs` to regenerate `index.html`, and commit both.
- The build refuses to write a page containing private-looking details (Railway URLs, email addresses, internal branch names, secrets).
- Only link sites that are meant to be public. The private index of all projects lives elsewhere.
