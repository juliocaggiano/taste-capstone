# Taste version control

Started on 27 September 2026 at Julio's request.

## Repository

- Account: `juliocaggiano`
- Name: `taste-capstone`
- Visibility: private
- Main branch: `main`
- Local root: the existing Capstone (Daily Culture) folder, containing `app/` and `docs/`.

## What is saved

The repository tracks prototype source, bundled artwork, editable product documentation, editorial batches, review tools and approved submission packages. It also includes the app's tests and dependency lockfile.

The first commit is a current baseline. Previous uncommitted edits cannot be recovered as past commits. Existing written process records remain available.

## What stays local

Credentials, environment files, installed dependencies, generated builds, QA captures, academic assignment files, exported deliverables and editorial research capture directories are ignored. They remain on the computer. GitHub is therefore not a complete backup of this entire folder.

The deployed website and browser storage are separate from source control. Personal saves, local review decisions and Process board edits need an explicit export into files before Git can track them. A commit alone does not publish a Vercel deployment.

## Save a new version

1. Review the changed files.
2. Run the checks relevant to the change.
3. Commit the intended files with a short description of the change.
4. Push the commit to GitHub.

Avoid committing credentials, private research participant records or unrelated coursework. Preserve concurrent work when selecting files for a commit.

## Deployment

The existing Taste Vercel project continues to use its direct deployment workflow. Automatic deployment from GitHub is not enabled by this setup. Keep the separate Taste account and existing public URL.
