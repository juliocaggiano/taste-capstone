# Taste

Taste is Julio Caggiano's Minerva University capstone: a prototype for discovering artwork through a daily reading practice.

- [Live prototype](https://taste-capstone.vercel.app/)
- [Process documentation](https://taste-capstone.vercel.app/?view=scrum)
- [Design system](https://taste-capstone.vercel.app/?view=design-system)

## Project structure

- `app/`: React and TypeScript prototype, assets, tests and build scripts.
- `docs/`: product decisions, design guidance and editorial work.
- `docs/editorial/batches/`: editorial drafts, selected images and the review interface.
- `docs/editorial/approved-submissions/`: preserved approved submission packages.
- `references/`: documented design references.

The repository is private. Coursework, local QA captures, exported deliverables, credentials and generated builds stay outside Git. See `.gitignore` for the exact exclusions.

## Run locally

Use a current Node.js version compatible with the app's dependencies. The Vercel project is configured for Node.js 24.

```sh
cd app
npm ci
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

An existing local preview service may already own port 4173. Reuse that preview rather than starting a second server.

## Build and check

```sh
cd app
npm run check:runtime
npm run build
```

The website output is `app/dist/client/`. The build also prepares separate Sites hosting files. The build does not publish anything.

## Version history

The first commit records the project as it exists on 27 September 2026. It does not reconstruct earlier edits. Existing process documentation and editorial records describe earlier decisions.

Each saved Git commit creates a version. Pushing that commit uploads it to GitHub. Files edited in a browser, such as personal Library data or Process board changes, are not captured unless exported into project files first.

See [Version control](docs/VERSION_CONTROL.md) for the workflow and scope.

## Publication

Vercel hosts the existing review website. Its current deployment workflow uploads a locally built website directly. This repository does not enable automatic deployment.

See [Deployment record](docs/VERCEL_REVIEW_DEPLOYMENT.md). Publication uses the Taste Vercel account, separate from the portfolio account.

## Content and use

This is a review prototype, not a released native app. Keep the documented distinction between approved catalog content, pending editorial work and validated research findings. Third-party artwork and design references retain their recorded attribution and usage conditions. This repository does not grant rights to redistribute those materials.
