# Taste public review prototype

Published with Julio's authorization on 26 September 2026.

- Prototype: https://taste-capstone.vercel.app/
- Process documentation: https://taste-capstone.vercel.app/?view=scrum
- Vercel team: `juliocaggiano2022-8011s-projects`
- Project: `taste-capstone`
- Current deployment: `dpl_CFyrE4NyfPzvBeoobrc7kdpb2VF5`
- App directory: `app/`
- Build command: `npm run build`
- Public output: `dist/client`
- Local project link: `app/.vercel/project.json`, ignored by source control.
- Isolated CLI configuration: `/tmp/taste-vercel-cli-20260926`, separate from the portfolio account. Authentication may need renewing if this temporary configuration is cleared. Do not copy tokens into project files.

Use a local production build followed by a prebuilt production deployment. This uploads the prepared public output. Keep environment files and private source material outside deployed artifacts. `X-Robots-Tag: noindex, nofollow` is set for the review site.

The published Process board contains 51 source-seeded tasks. Its current local browser data matched those tasks; the personally shortened Sprint 1 goal was included before publication. Subsequent browser-local board edits do not automatically update other browsers or deployments.

## Verification

The prototype and Process routes returned HTTP 200 without authentication. The public JavaScript asset was byte-identical to the verified local build after the Home wheel correction. The published in-app browser opened David, moved to Stańczyk with a rightward gesture, and returned with a leftward gesture.

Focused wheel stability checks passed in Chromium and WebKit, on iPhone and Pixel layouts. Details: `../qa/home-scroll-jitter-2026-09-26/verification.md`.

The existing Google Doc Project Brief has the prototype and Process links. It was verified saved to Drive. Julio's latest personal edits were retained. The current Google Doc is the editable brief; earlier local DOCX/PDF exports are not synchronized with its newest edits.

This deployment is the review web prototype. It does not establish a native TestFlight release, real authentication, user-study findings or image clearance for a commercial release.

## Painting update — 27 September 2026

The public catalog now has 20 works. Saturn Devouring His Son and The Death of Socrates were added with selected image A; Liberty Leading the People received its newly approved body. Other 17 catalog records stayed unchanged. The Gulf Stream received its exact requested sentence deletion in the review only and still needs writing approval.

Production deployment `dpl_CFyrE4NyfPzvBeoobrc7kdpb2VF5` used the same team and project. The public bundle matched the local build byte for byte; all three imported image checksums matched their selected source files. Evidence: `../qa/painting-approval-import-2026-09-27/verification.md`.
