# Artwork submissions before TestFlight

Status: proposed production design, 24 September 2026. No shared submission service is connected yet.

## What the preview does today

Create is a local interaction preview. Its draft belongs to the selected local preview account. **Finish preview** clears the saved draft and uploaded image files, then shows a local confirmation. It makes no network submission, creates no shared record, and does not add artwork to Library or the separate editorial Batch 001.

The onboarding and Switch accounts screens also use local preview identities. They cannot identify a person across devices. TestFlight feedback in App Store Connect is feedback about the beta build, not an inbox for artwork submissions.

## Proposed reader-to-editor flow

1. A reader signs in with a real account and completes the current artwork form.
2. Submission saves a database record and up to three image files. Images stay private. The new record starts as **Pending review**.
3. The reader receives a submission receipt and can see their own status. A failed upload stays a draft with a clear retry path; it must not claim success.
4. Julio opens a private review table. Each row links to the full text, artist identity, images, image-rights confirmation, submitter, and submission date. The table can be filtered by status and exported as CSV.
5. Julio can **Approve**, **Request changes**, or **Reject**. Only an explicit approval can publish the work to the public catalogue. Review actions record who acted and when.
6. Readers can report public artwork. Julio can remove it and block an abusive account. Account deletion also removes or otherwise handles the reader's submissions and uploaded files under the published policy.

A spreadsheet is useful as a review view or export. It should not be the primary store for account access, private images, and publication decisions. A reasonable first implementation is Supabase Auth, a Postgres `submissions` table, private Storage, row-level access rules, and an owner-only review page. This is a proposed choice, not an existing integration. Its [Table Editor](https://supabase.com/docs/guides/database/tables#creating-tables) provides a spreadsheet-like view; [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security) and [Storage access rules](https://supabase.com/docs/guides/storage/security/access-control) enforce who can read records and files.

## Minimum record and safeguards

Each submission needs an ID, account ID, title/unknown flag, artist or unknown choice, art form, context, optional year/material/sources, image references, image-rights confirmation and timestamp, status, submission timestamp, reviewer, review timestamp, and review note. Keep public catalogue records separate from pending submissions.

Access rules should let a reader create and view their own submissions. Only the trusted review service should change review status or publish. Uploaded files need private storage, validated type/size, owner-scoped paths, and cleanup for abandoned or deleted submissions. Back up database records and images separately. Do not place an owner credential in the app.

## Build order

1. Choose the production account method and create the backend project under Julio's control.
2. Add the submission table, private image storage, access rules, and a repeatable migration.
3. Connect Create and the reader's submission status. Change **Finish preview** to a truthful production action such as **Submit for review** only when the connection works.
4. Build the private review table and publication action. Test with two reader accounts and one reviewer account; verify one reader cannot see another's private records or images.
5. Add deletion, reporting, moderation, privacy copy, and rights handling. Test uploads, retries, rejection, approval, deletion, and backup restoration on a real iPhone build.
6. Prepare a working reviewer/demo account, live backend, and accurate App Store Connect information before external TestFlight review.

Apple says TestFlight builds must follow its [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/). Those guidelines ask for a live backend and demo access when login is required, user-generated-content controls if submissions can become public, account deletion when the app offers account creation, and rights to displayed material. The exact policy text and moderation process need review before release. [TestFlight](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/) distributes a build and collects tester feedback; it does not provide this submission database.
