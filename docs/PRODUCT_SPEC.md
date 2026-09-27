# Daily Culture Product Specification

| Field | Value |
|---|---|
| Status | Working draft |
| Version | 0.11 |
| Date | 2026-09-19 |
| Product | Daily Culture |
| Editorial owner | Julio Caggiano |
| Current phase | Artsy-inspired visual redesign of the working prototype; an original Daily Culture MVP follows |
| Primary source | Julio's initial project brief |
| Visual evidence | Current: Artsy iOS screens in signed-in Mobbin and official Palette v3 sources, reviewed on 2026-09-19; see `ARTSY_DESIGN_DIRECTION.md`. Historical: MoMA and DailyArt references remain preserved. |

## 1. How to read this document

This document is the project's durable source of truth. Update it when a decision changes.

Requirement labels have these meanings:

- **Confirmed:** Julio stated this directly.
- **Reference-derived:** The supplied DailyArt screenshots visibly support it.
- **Proposed:** It is a working product recommendation. Julio has not approved it yet.
- **Open:** A decision is still required.

The current brief describes a large product direction. It does not yet define every launch detail.

### Latest account and folder decisions — 2026-09-23

**Confirmed:** Add Share profile beside View profile. Align every Settings chevron to the right inset. Use a geometric user symbol in the bottom menu. Profiles show a username, theme-native statistics, two-column artwork grids, and folder cover cards with names and save counts. Remove the profile gear. Creating a folder should follow the fuller supplied reference, with cover, name, privacy, feed visibility, and collaborators before Create.

The prototype uses `@juliocaggiano`, local profile preview links, and optional folder metadata. Collaborators are selected from labeled sample accounts; there are no remote invitations or account permissions. The Library retains its circular folder rail. This supersedes the earlier profile layout and compact folder-creation sheet. [Implementation and checks](../qa/account-folders-refinement-2026-09-23/verification.md).

### Profile and Settings decision — 2026-09-23

**Confirmed:** Settings opens with an account card using the current reader's photo and name. Its secondary line shows the current saved-artwork and folder counts. **View profile** opens a separate profile screen. Settings has one visible section heading, keeps its existing preference controls, and ends with **About Taste · Version 1.2**, **Rate App** without a leading icon, then **Legal** last.

The profile shows four tappable sections: **Artworks**, **Folders**, **Following**, and **Followers**. Saved artworks open their reading detail. Folders show their saved members. Following lists accounts the current reader follows. The local preview starts with zero followers and an empty section because it has no incoming relationship data; future follower data should update the count and list. Do not infer a location or follower number from the supplied visual reference. This supersedes the earlier Settings card and menu order below. [Current implementation and checks](../qa/profile-settings-2026-09-23/verification.md).

### Current Library decision — 2026-09-23

**Confirmed:** The saved-reference destination has exactly two tabs: **Artworks / Folders**. Artworks shows all saved works, including those in no folder. Folders groups globally saved works into personal folders; a work may appear in multiple folders. Users can create a folder. The current prototype stores saves, folders, and private notes on the same device.

Opening a saved artwork uses the Home reading layout. The Library detail shows Back on the left and Edit on the right. Edit changes folder membership and a private note, while preserving the source artwork record. The existing full-screen image viewer remains available. This decision supersedes older Favourites tab, category-underline, and board-label requirements below. [Current implementation and checks](../qa/library-redesign-2026-09-23/verification.md).

### Settings refinement — 2026-09-20

**Confirmed:** The intended product signs users in during onboarding and retains their session. Settings exposes Switch Accounts. The web prototype switches between local preview identities with separate saved state; real authentication is not connected. [Current implementation and checks](../qa/switch-accounts-2026-09-24/verification.md).

The entire cultural-library card opens Favourites, including the image and blank space inside the card. Story repeats offers weekly, monthly, every six months, yearly, and never. Selected intervals persist locally. The Settings header omits the Daily Culture brand line, and its footer omits the slower-looking slogan. Keep these changes localized in all four languages.

Current implementation and verification: [`../qa/settings-2026-09-20/implementation.md`](../qa/settings-2026-09-20/implementation.md).

### Current visual exploration — 2026-09-19

**Confirmed scope:** Julio requested an Artsy-inspired redesign in the working web prototype. Use official Palette documentation and observed Artsy mobile screens to ground its style.

**Implementation direction:** Regular sans-serif type, white and neutral surfaces, thin rules, original artwork proportions, pill controls, and restrained blue interaction states. Bundled Inter substitutes for Unica77. Dark mode is a Daily Culture adaptation.

Preserve all confirmed product interactions, languages, local preferences, contribution drafts, editorial boundaries, and protected device behavior. Reference evidence and adaptation decisions are in [`ARTSY_DESIGN_DIRECTION.md`](ARTSY_DESIGN_DIRECTION.md). Verification is recorded in `../design-qa.md`. The visual direction is requested; final aesthetic acceptance remains Julio's.

### Historical visual exploration — 2026-09-05

**Confirmed scope:** Julio requested a new design-system exploration inspired by MoMA's website and wider design choices.

**Exploration choices:** The new direction uses bundled Inter, strong headings, white and near-black foundations, bright editorial panels, and square exhibition blocks. Fresh preferences default to Light. Existing stored theme choices remain respected.

This exploration supersedes historical DailyArt typography, dark-first presentation, rounded treatments, and visual geometry where they conflict. Later references to Newsreader or DailyArt measurements document the earlier baseline, not the active visual direction.

The visual exploration preserves product interactions, including Daily navigation as clarified below. The four locales, editorial ownership, rights boundaries, and protected mobile runtime remain unchanged. The 1px label-width Favourites underline remains active.

See [`MOMA_DESIGN_DIRECTION.md`](MOMA_DESIGN_DIRECTION.md) for observed evidence, adaptation choices, and review requirements. Final visual details await Julio's review. Final verification is pending.

## 2. Product definition

### Product statement

Daily Culture gives people one curated cultural piece each day. Each piece includes a short, source-backed story.

The collection can span film, photography, literature, visual art, craft, and cultural objects. Stories connect works with people, places, practices, and histories.

### Problem hypothesis

Culture-curious people face an endless volume of disconnected material. Learning across cultures can demand more time and context than they have.

Daily Culture reduces that burden. It offers one intentional entry point each day instead of an infinite feed.

This problem statement is a hypothesis. User research has not yet validated it.

### Core promise

Open the app once. Meet one cultural piece. Understand why it matters. Keep it for later.

### Product principles

1. **Curation over volume.** One deliberate selection matters more than an endless feed.
2. **The object opens the story.** Each piece leads into a wider cultural context.
3. **Context over trivia.** Explain relationships, tensions, and influence without flattening them.
4. **Editorial authorship stays visible.** Julio selects and writes the published material.
5. **Trust is part of the experience.** Every factual claim must be traceable.
6. **Discovery supports the daily ritual.** The archive expands learning without replacing the daily piece.
7. **Original identity follows the prototype.** DailyArt is a behavior reference, not the final brand.

## 3. Confirmed requirements

- **Confirmed:** The product name is **Daily Culture**.
- **Confirmed:** The intended product is a mobile app.
- **Confirmed:** The core interaction resembles DailyArt's daily-curation model.
- **Confirmed:** Users receive one featured cultural piece each day.
- **Confirmed:** Pieces can represent several art forms and cultural objects.
- **Confirmed:** Initial examples include film, photography, pottery, and literature.
- **Confirmed:** Stories can address countries, national contexts, and religious practices.
- **Confirmed:** Julio controls which pieces enter the collection.
- **Confirmed:** Julio writes the editorial stories shown to users.
- **Confirmed:** The experience should help users collect cultural knowledge and inspiration.
- **Confirmed:** Previously featured pieces can return after a meaningful interval.
- **Confirmed:** Six months and one year are candidate recurrence intervals.
- **Confirmed:** The first build should closely reproduce DailyArt's observable product behavior.
- **Confirmed:** The team will then adapt that baseline into Daily Culture.
- **Confirmed:** Today is the Daily anchor. A physical rightward pointer or finger drag reaches older editions one at a time.
- **Confirmed:** A physical leftward drag moves toward Today, then reaches the contribution invitation.
- **Confirmed:** Julio's latest request inverts the earlier directions. `endX < startX` reaches newer editions or Suggestion from Today; `endX > startX` reaches older editions. Preserve the protected natural drag behavior by rendering pages left to right as `Older editions | Yesterday | Today | Suggestion`.
- **Confirmed:** Horizontal browser scrolling follows the inverted actions: negative `deltaX` reaches newer editions or Suggestion; positive `deltaX` reaches older editions. Each scrolling burst advances at most one edition, including its momentum tail.
- **Confirmed:** Daily has no random, shuffle, or “show another story” button. Navigation follows the chronological swipe sequence, with keyboard access preserved.
- **Confirmed:** The contribution invitation opens a form where people identify an art piece, person, or cultural practice; explain why it matters; and optionally add sources, links, or images.
- **Confirmed:** The browser prototype simulates submission and image previews. It does not transmit data or upload files.
- **Confirmed:** The reference prototype must provide four working languages: English, Português, Italiano, and Español.
- **Confirmed:** Changing the reading language translates the prototype interface and sample stories, not only the preference label.
- **Confirmed:** The reference-prototype Settings screen includes Sign In, Language, Notifications, Widget, Legal, Units, Text Size, and Theme controls.
- **Confirmed:** Notifications and Widget are web simulations in this browser prototype. Native operating-system delivery and installation are outside this phase.
- **Confirmed:** The Favourites selection indicator is a dynamic, one-pixel underline matched to the selected label.
- **Confirmed:** Each completed Daily story ends with a **Check out more** rail when editor-approved related stories exist.
- **Confirmed:** The creator pill opens a creator or cultural-context “topic” profile.

## 4. Reference-derived baseline

### Evidence available

The current evidence contains twelve App Store and Google Play marketing screenshots, plus user-provided Settings and Daily-detail captures. They show selected states, not a complete product specification.

The evidence does not include DailyArt's source code, design files, API behavior, data, or full interaction recordings.

### Observable product structure

| Area | Visible reference behavior | Daily Culture interpretation |
|---|---|---|
| DailyArt | A large featured image leads into one daily story. Horizontal dragging or swiping reaches nearby dated entries. The reviewed Daily-detail captures also show a horizontal **Check out more** rail after the story. | Show one scheduled cultural piece each day, allow one-entry-at-a-time chronological archive navigation, and offer editor-approved continuations after the story. |
| Detail | The screen includes title, metadata, creator, date, story, save, and share. A compact creator pill is visible, but the supplied still image does not establish its tap behavior. | Use a flexible detail model for many cultural formats. Link attribution to a creator or cultural-context profile without inventing unknown biographical details. |
| Discover | Editorial cards lead to collections and grouped content. | Group pieces by culture, place, practice, format, era, or theme. |
| Search | A dedicated search destination appears in the main navigation. | Search titles, creators, places, communities, formats, and themes. |
| Favourites | Saved items appear in a browsable library. A thin underline tracks the selected category label. | Let users retain pieces and revisit their knowledge collection. Use a dynamic one-pixel category underline. |
| Settings | Settings appear as a main destination. The supplied screenshot shows Language, Notifications, Widget, and Legal rows plus Units, Text Size, and Theme segmented controls. | Hold preferences, simulated notification and widget controls, accessibility, and product information. |
| Sharing | Detail views expose a share action. | Share a link or preview without exposing restricted media. |
| Visual language | Dark surfaces, image-led cards, serif display type, pills, and a red accent. Roslindale Display Condensed is the strongest public-source inference for the reference serif. | Match measured structure during reference study. Use the SIL Open Font License 1.1-licensed Newsreader substitute instead of copying DailyArt's commercial font files. Then define an original brand system. |
| Navigation | Five bottom tabs stay visible in the captured main screens. | Use a stable mobile information architecture during the prototype. |

### Baseline navigation

The visible reference uses five destinations:

1. DailyArt
2. Discover
3. Search
4. Favourites
5. Settings

Daily Culture should use these destinations during the reference prototype. Labels can change during original product design.

### Unknown reference behavior

The screenshots do not confirm these behaviors:

- Onboarding and account creation
- Exact notification timing and native controls
- Exact gesture physics, thresholds, and transition timing
- Recommendation-card tap behavior, ranking logic, and nested-gesture physics
- The creator-pill destination and profile interaction
- Creator or cultural-context profile layout
- Offline support and caching
- Loading, empty, and error states
- Subscription or paywall rules
- Search ranking and filters
- Accessibility behavior
- How content is authored and published
- How daily scheduling works across time zones
- Whether recurrence is global or personalized

Do not describe these areas as one-to-one replicas until they are observed and tested.

## 5. Accuracy and intellectual property boundary

“Full replica” means an independent reconstruction of observable behavior for internal product study.

It does not mean copying DailyArt's proprietary source code. That code is not available from screenshots or store builds.

The project must not copy or ship:

- DailyArt source code or reverse-engineered private services
- DailyArt trademarks, logos, or product name
- DailyArt's proprietary editorial writing
- DailyArt's private content database
- Paid or restricted material
- Media without a valid license or public-domain basis

The prototype can study generic product patterns. Examples include daily delivery, bottom navigation, search, saving, and editorial collections.

DailyArt's official website stylesheet names Roslindale Display Condensed. Public app screenshots visually support that family as a strong inference, but the private app bundle was not inspected. Roslindale is a commercial typeface. The project must not copy, redistribute, or hotlink DailyArt's hosted font files.

The reference prototype uses Newsreader as a licensed clean-room substitute. Newsreader is available under the SIL Open Font License 1.1. This substitution aims for similar editorial density without claiming typeface identity.

Before any public release, Daily Culture needs its own brand, interface details, copy, content, and licensed assets.

This section is a product boundary, not legal advice. Public launch may require a formal rights review.

## 6. Target users and user needs

These users are proposed. Research must confirm them.

### Primary user: the culture-curious learner

- Wants a small, dependable learning ritual.
- Enjoys art and culture but lacks time for long research sessions.
- Wants context that connects a piece to a larger story.
- Wants to save meaningful discoveries.

### Secondary user: the collector of references

- Builds personal archives for creative work, study, or conversation.
- Wants search, categories, and favourites.
- Needs clear metadata and reliable sources.

### Core user stories

- As a culture-curious learner, I want one daily piece so I can learn without choosing a topic.
- As a reader, I want a concise story so I can understand why the piece matters.
- As a collector, I want to save a piece so I can revisit it later.
- As an explorer, I want themed collections so I can follow a cultural thread.
- As an explorer, I want related stories after each Daily entry so I can continue along a curated cultural connection.
- As a reader, I want to open the creator or context behind an attribution so I can understand the piece more fully.
- As a returning user, I want useful resurfacing so earlier knowledge does not disappear.
- As a careful reader, I want sources and attribution so I can trust the story.

## 7. Scope and requirements

### P0: Required for the Daily Culture MVP

#### P0.1 Daily piece

- Show one primary piece for the user's current day.
- Keep the same piece stable throughout that day.
- Let an editor override the schedule.
- Handle a missing scheduled piece without showing a broken screen.
- Render pages from left to right as `Older editions | Yesterday | Today | Suggestion` to preserve protected natural dragging.
- From Today, let a physical rightward pointer or finger drag reveal the previous edition.
- From an older edition, let a physical leftward drag move toward Today one edition at a time.
- From Today, let a physical leftward drag reveal the contribution invitation.
- Measure movement by pointer coordinates: left means `endX < startX`; right means `endX > startX`.
- Match keyboard arrows to those actions: Left Arrow reaches newer editions, then Suggestion; Right Arrow reaches older editions.
- Match horizontal browser scrolling to those actions: negative `deltaX` reaches newer editions, then Suggestion; positive `deltaX` reaches older editions.
- Advance at most one edition per horizontal scrolling burst, including its momentum tail. Preserve vertical reading, pinch zoom, and native scrolling in nested recommendation rails.
- Choose the destination from the full pointer displacement before release momentum. A brief reversal at release must not reverse the destination. Ignore movements below 40 logical pixels and cancelled gestures.
- Do not provide a random, shuffle, or “show another story” button in Daily.
- Snap to one complete entry after each horizontal navigation gesture.
- Preserve vertical reading inside the active entry without accidental horizontal changes.
- After the completed story, show an ordered **Check out more** rail when editor-approved related pieces exist.
- Keep the recommendation rail independent from chronological Daily navigation.
- Exclude the active piece, duplicate links, unpublished pieces, and rights-restricted pieces from the rail.
- Show one or two approved recommendations without creating filler duplicates. Remove drag affordance when the cards do not overflow.
- Let the contribution invitation open a complete, localized form.
- Let contributors identify an art piece, person, or cultural practice; explain why it matters; and optionally add sources or links and up to three images.
- Keep image previews local to the browser. Require a rights confirmation before a draft with images can complete.
- Preserve an unfinished draft and its local image previews when the sheet closes during the current app session.
- Explain that the prototype does not transmit the draft until a production submission service is connected.

Acceptance criteria:

- Given a valid daily entry, opening Today shows its media, title, metadata, and story.
- Reopening the app on the same day shows the same entry.
- Moving to the next scheduled day shows the next entry.
- A completed physical rightward drag from Today moves exactly one edition into the past.
- A completed physical leftward drag from an older edition moves exactly one edition toward Today.
- A completed physical leftward drag from Today opens the contribution invitation.
- A physical rightward drag from the contribution invitation returns to Today.
- Verify both directions with recorded pointer start and end coordinates, not page-position labels.
- Negative horizontal wheel `deltaX` moves toward Today, then Suggestion. Positive horizontal wheel `deltaX` moves into the past.
- A horizontal scrolling burst advances at most one edition, including momentum. Vertical reading, pinch zoom, and nested recommendation scrolling remain independent.
- Keyboard access remains available for the same chronological sequence and contribution invitation.
- Daily exposes no random, shuffle, or “show another story” button, while chronological keyboard navigation remains available.
- A short or mostly vertical drag leaves the current daily entry selected.
- The first and last available entries do not expose blank pages.
- A missing entry produces a clear fallback and records an error.
- A horizontal drag inside **Check out more** scrolls that rail without changing the active Daily date or entry.
- A vertical drag that starts on a recommendation card scrolls the active story without moving either horizontal rail.
- Tapping a recommendation opens the intended story as a standalone detail. It does not change the underlying Daily date.
- Back from a recommended story restores the originating Daily date at the top. It does not need to restore the prior vertical position or rail offset.
- Completing a drag never opens a recommendation card.
- The active Daily entry's measured height includes the recommendation section after image load, locale changes, text-size changes, and viewport resizing.
- If no approved related piece remains, the complete **Check out more** section stays hidden.
- The contribution call to action opens the form without showing the keyboard automatically.
- The art-piece, person, or cultural-practice field and the why-it-matters field expose separate validation and focus the first incomplete field.
- Closing and reopening the form restores the unfinished draft during the current app session.
- Valid image files show removable previews. Invalid type, size, quantity, or rights states show a clear error.
- Form and success copy stay conditional. They do not claim that data was sent, received, or reviewed.

#### P0.2 Cultural-piece detail

- Support still images at minimum.
- Support flexible metadata across different cultural formats.
- Show the original story, creator attribution, cultural context, and sources.
- Include save and share actions.
- Preserve the media's aspect ratio.
- Render an attribution pill as a control only when it has a stable creator or cultural-context target.
- Open named people or groups as creator profiles.
- An unknown maker can open a clearly labeled attribution profile when verified context exists. The page must not imply a known person or infer a community only because the maker is unknown.
- Show only verified profile facts, localized editorial context, and approved archive connections.

Acceptance criteria:

- A literature entry does not require painting-specific fields.
- An artifact can show maker, community, material, place, and period when known.
- Unknown metadata appears as unknown or stays absent. The app never invents it.
- Every published piece has alt text and rights information.
- Tapping an attribution pill opens the correct profile for that stable entity.
- A horizontal or vertical drag that begins on the pill never opens the profile.
- Closing the profile restores the originating story, including the same Daily entry when opened from Daily.
- An unknown maker never receives an invented name, biography, portrait, or individual claim.
- If minimum verified profile content is missing, the attribution remains readable text and does not open a blank profile.

#### P0.3 Discover and archive

- Show editor-created collections.
- Let users browse all available published pieces.
- Support more than one cultural classification per piece.
- Avoid treating a country, nationality, religion, and community as equivalent fields.

#### P0.4 Search

- Search across title, creator, place, community, format, and editorial tags.
- Return an explicit empty state when nothing matches.
- Open the selected result at its detail view.

#### P0.5 Saved-reference Library

- Let users save and unsave a piece from its detail view.
- Show all saved artworks in the Artworks tab, including those in no folder.
- Show personal folders in the Folders tab. Let users create folders and assign a work to multiple folders.
- Preserve saves, folder memberships, and private notes after the app closes on the same device.
- Provide an intentional empty state.
- Open saved pieces in the Home reading design. The Library detail exposes Back and Edit.
- Let Edit change a work's folder memberships and private note without changing its editorial record.

Acceptance criteria:

- Selecting Artworks or Folders updates the visible content and selected tab state.
- Selecting a folder shows only its globally saved members; unfiled works remain in Artworks.
- Back from a saved work restores the Library's selected tab, folder, position, and keyboard focus.
- Cancel discards Edit changes. Save persists them on the same device.

#### P0.6 Editorial content integrity

- Require a source record for factual published content.
- Require a media-rights status before publication.
- Keep the original source separate from Julio's interpretation.
- Record material corrections after publication.

#### P0.7 Accessibility foundation

- Support screen-reader labels for navigation and actions.
- Support text resizing without hiding essential content.
- Meet WCAG AA contrast for text and controls where applicable.
- Never rely on color alone to communicate state.
- Respect reduced-motion preferences.
- Give the recommendation rail, its cards, and every interactive attribution a descriptive accessible name.
- Preserve a visible focus state and logical keyboard order for recommendation cards and attribution controls.
- Move focus to the destination heading or close control after navigation. Return focus to the invoking card or pill after closing.
- Keep horizontally offscreen recommendation cards keyboard reachable and scroll each focused card into view.
- Keep recommendation controls inside inactive Daily entries out of the accessibility and tab order.

#### P0.8 Reference-prototype settings and localization

- Provide four prototype reading languages: English, Português, Italiano, and Español.
- Translate visible navigation, Settings, Search, feedback messages, and all sample story fields for every prototype language.
- Translate recommendation and profile interface labels, plus available prototype profile copy, in every prototype language.
- Use a safe fallback to English if a localized value is missing. Never show an empty label or story.
- Provide Settings rows for Switch Accounts, Language, Notifications, Widget, Story repeats, and Legal.
- Let Switch Accounts change local preview identities and keep each identity's saved state separate. Authentication still belongs to onboarding in the intended product.
- Make the entire cultural-library card open Favourites. Preserve scrolling and keyboard activation.
- Offer weekly, monthly, six-monthly, yearly, and never-repeat preferences. Preserve existing saved values and validate new values on reload.
- Provide Units choices for Centimeters and Inches.
- Provide Text Size choices for Default, Large, and System.
- Provide Theme choices for Light, Dark, and System.
- Apply the selected theme across the full prototype. Apply text size to all story-reading surfaces.
- Simulate notification scheduling and widget configuration inside the web app.
- State clearly that the simulation does not request operating-system notification permission or install a native widget.

Acceptance criteria:

- Selecting any of the four languages immediately updates every visible prototype screen and its sample content.
- Switching languages does not reset the active tab, selected daily entry, favourites, or other preferences.
- Missing translation data falls back to English and remains readable.
- Default, Large, and System text settings produce visibly distinct or system-matched story typography without clipping primary reading content.
- Light, Dark, and System theme settings update every main destination. System follows the browser or device color-scheme preference.
- Centimeters and Inches update any displayed dimensions that have convertible source data.
- Notifications and Widget open complete simulated controls and explain their prototype-only status.
- Legal opens a readable project notice rather than a dead row.

### P1: Strong follow-ups

- Native daily notifications with a user-selected time
- Share previews generated from licensed content
- Filters for format, place, culture, era, and theme
- Reading progress and viewed-state indicators
- Source links visible from the piece detail
- A simple editorial publishing interface
- A connected submission service with spam protection, rights review, moderation, and editorial routing. See the [prelaunch submission plan](CREATE_SUBMISSIONS_PRELAUNCH.md).
- Import from an agreed structured source
- Optional account sync across devices
- Offline access to today's piece and saved items

### P2: Future considerations

- Audio narration
- Video and audio works with licensed playback
- Production localization beyond the four prototype languages
- Personal notes and reflection prompts
- Recall questions that support real spaced repetition
- Personalized recurrence based on reading or recall history
- Collaborative curators or guest collections
- Open public submissions without an editorial review gate
- Social discussion
- Museum, venue, or city-guide features
- Sustainable revenue or membership models

## 8. Core flows

### Flow A: Read today's piece

1. The user opens the app.
2. Today shows the scheduled piece and primary media.
3. The user scans the title and essential metadata.
4. The user reads the editorial story.
5. The user can inspect sources, save the piece, or share it.

### Flow B: Save and revisit

1. The user saves a piece from its detail view.
2. The saved state updates immediately.
3. The user opens Favourites.
4. The user sees saved pieces in a stable order.
5. The user opens or removes a saved piece.

### Flow C: Explore a cultural thread

1. The user opens Discover.
2. The user selects a curated collection.
3. The collection explains its theme and scope.
4. The user browses related pieces.
5. Each item opens its complete detail view.

### Flow D: Search the archive

1. The user opens Search.
2. The user enters a term.
3. Results match across supported metadata.
4. The user refines or clears the query.
5. The user opens a result.

### Flow E: Encounter a resurfaced piece

1. The scheduler checks each piece's publication history.
2. It excludes pieces inside the configured no-repeat window.
3. It prefers unseen eligible pieces when available.
4. It uses an eligible past piece only when the recurrence rule allows it.
5. The detail view can identify the prior feature date if useful.

### Flow F: Change reading preferences

1. The user opens Settings.
2. The user selects a reading language, text size, theme, or units preference.
3. The prototype applies the preference without leaving the current product state.
4. The user can open Notifications or Widget to configure a clearly labeled web simulation.
5. The user returns to Daily and sees the selected language and appearance applied.

### Flow G: Continue from a Daily story

1. The user reaches **Check out more** after the Daily story.
2. The user drags the rail without changing the active Daily entry.
3. The user selects an editor-approved related story.
4. The selected story opens as a standalone detail without changing the underlying Daily date.
5. Back restores the originating Daily date at the top.

### Flow H: Open an attribution profile

1. The user selects the creator pill inside a story.
2. The app opens the linked creator or cultural-context profile.
3. The profile shows verified context and approved archive connections.
4. Closing the profile returns to the originating story, including the same Daily entry when opened from Daily.

### Flow I: Suggest a future story

1. From Today, the user drags physically left to reveal the contribution invitation.
2. The user opens the suggestion form.
3. The user identifies an art piece, person, or cultural practice; explains why it matters; and optionally adds sources or links.
4. The user can optionally attach up to three supported images and confirm sharing rights.
5. The prototype validates the draft and shows a local success state.
6. A production version sends accepted drafts into Julio's editorial review queue.

## 9. Content and editorial model

### Editorial ownership

Julio is the final curator and writer. Automation can assist research or formatting but cannot publish by itself.

The four localized sample versions remain prototype content until Julio reviews their language and cultural accuracy.

### Proposed workflow

1. **Capture:** Add a possible piece and its initial reason for inclusion.
2. **Research:** Gather reliable sources, metadata, context, and rights information.
3. **Draft:** Write the story in Daily Culture's editorial voice.
4. **Review:** Check facts, cultural framing, spelling, links, and media rights.
5. **Structure:** Add taxonomy, related pieces, accessibility text, and recurrence rules.
6. **Schedule:** Assign a first publication date or leave the piece eligible.
7. **Publish:** Freeze the approved version for that daily entry.
8. **Maintain:** Record corrections, expired links, or rights changes.

### Editorial quality bar

Every published entry should answer four questions:

1. What is this piece?
2. Who made, used, shaped, or preserved it?
3. What context helps the reader understand it?
4. Why does this piece matter in the collection?

Every material factual claim needs support. Contested interpretations need attribution and more than one perspective when appropriate.

### Fact-safe example

A future entry may feature Dante Alighieri's *Divine Comedy*.

Do not say that Italian was fully based on the work. A safer claim is:

> Dante's use of the Tuscan vernacular strongly influenced the development and prestige of standard Italian.

The final entry must cite sources and explain that language development had many contributors.

### Cultural representation rules

- Use the most specific supported term for a place, people, community, or practice.
- Do not use nationality as a shortcut for every cultural identity.
- Distinguish religion, religious practice, community, ethnicity, citizenship, and geography.
- Name uncertainty, disputed attribution, colonial acquisition, or contested ownership when relevant.
- Avoid presenting one object as a complete representation of a culture.
- Preserve original-language titles when useful. Provide a clear display translation.
- Let people and communities describe themselves when reliable first-party language exists.

## 10. Content and data model

The model must handle many formats without forcing every piece into painting metadata.

### Cultural piece

| Field | Purpose | Requirement |
|---|---|---|
| `id` | Stable internal identifier | Required |
| `slug` | Human-readable route identifier | Required |
| `title` | Display title | Required |
| `original_title` | Title in its original language | Optional |
| `format` | Film, photograph, literature, artifact, and other formats | Required |
| `summary` | Short introduction | Required |
| `story_body` | Julio's complete editorial story | Required |
| `localized_content` | Locale-specific title, summary, metadata labels, and story translations keyed by locale | Required for the four prototype locales; prototype text requires Julio's review |
| `creator_ids` | Links to one or more creator-attribution records | Optional |
| `creation_date` | Exact date, year, period, or unknown | Optional |
| `place_ids` | Creation, use, discovery, or current-location places | Optional |
| `context_ids` | Cultures, communities, practices, movements, and religions | Optional |
| `material_or_medium` | Format-specific physical or technical description | Optional |
| `dimensions_or_duration` | Physical dimensions or time length | Optional |
| `language_ids` | Original or relevant languages | Optional |
| `collection_ids` | Curated group memberships | Optional |
| `related_piece_links` | Ordered records containing `piece_id`, relationship label, and Julio's editorial rationale for **Check out more** | Optional; hide the rail when no eligible link remains |
| `tag_ids` | Search and editorial tags | Optional |
| `source_ids` | Evidence for metadata and story claims | Required |
| `asset_ids` | Images, video, audio, captions, and alt text | Required |
| `rights_status` | Public domain, licensed, owned, pending, or restricted | Required |
| `editorial_status` | Idea, research, draft, review, scheduled, published, archived | Required |
| `published_version` | Frozen content version used for publication | Required at publication |
| `correction_note` | Transparent material correction record | Optional |

### Supporting entities

- **Creator:** A person, group, studio, community, or unknown maker. An interactive profile also needs a stable ID, localized profile copy, `source_ids`, and ordered links to approved pieces.
- **Place:** A country, region, city, site, or institution with a defined relationship.
- **Cultural context:** A community, tradition, religion, practice, movement, or historical setting. An interactive profile also needs a stable ID, localized profile copy, `source_ids`, and ordered links to approved pieces.
- **Collection:** A curator-defined group with a title, rationale, cover, and ordered items.
- **Source:** A citation with title, author, publisher, date, link, access date, and evidence note.
- **Asset:** Media with owner, credit line, license, source, crop rules, caption, and alt text.
- **Schedule entry:** A date, piece, edition, status, and editorial override.
- **Publication event:** A record of when and where a piece appeared.
- **User state:** Favourite, viewed date, reading progress, and future recall state.

A profile can open only when it has a stable target, a verified title, a readable localized summary or English fallback, supporting sources, and rights-cleared media with alt text when media appears. Otherwise, the attribution stays plain text.

### Taxonomy rules

- Taxonomy values can overlap. A piece can belong to several contexts.
- Relationships need labels. “Created in,” “used by,” and “held in” mean different things.
- Unknown values stay unknown. Do not replace them with guesses.
- Editors can add new formats without changing old records.

## 11. Daily scheduling and recurrence

### Confirmed intent

Past pieces should return after a long interval. Six months and one year are candidate windows.

### Terminology

The initial feature is **scheduled resurfacing**. It is not full spaced repetition yet.

True spaced repetition usually responds to recall performance. Daily Culture has no confirmed recall task today.

### Proposed scheduling rules

- Each calendar day has one editorially controlled primary piece.
- A schedule entry always overrides automatic selection.
- The scheduler prefers never-published eligible pieces.
- Published schedule entries remain reachable through a chronological Daily archive.
- A published piece becomes eligible after the configured no-repeat window.
- The initial no-repeat window remains configurable between 180 and 365 days.
- A piece cannot reappear early unless an editor records an intentional override.
- Publication history remains immutable even if the story later changes.
- The system must prevent two primary pieces from occupying the same edition and date.
- Corrections can replace content without creating a false new publication event.

### Decisions still required

- One global daily edition or a date based on each user's time zone
- A fixed 180-day, fixed 365-day, or mixed recurrence rule
- Global recurrence or user-specific recurrence
- How much chronological history is cached for offline use
- Whether a resurfaced piece gets new editorial framing
- Minimum collection size before automatic recurrence begins

## 12. Essential states and edge cases

The prototype and MVP need explicit treatment for:

- First launch with no viewed history
- No network connection
- Media that fails to load
- Scheduled content that is missing or unpublished
- An empty search query
- No search results
- No favourites
- A removed or rights-restricted item inside Favourites
- Unknown creator, date, place, or material
- Very long titles and original-language text
- Right-to-left scripts
- A missing or incomplete localized value
- A missing profile translation or profile target
- A language change while a sheet, search query, or daily entry is active
- System text-size or theme preferences changing while the prototype is open
- Image, portrait, landscape, and square media
- An item with multiple creators or cultural contexts
- Self-referential, duplicate, unpublished, removed, or rights-restricted related-piece links
- No eligible related stories, or too few items to overflow the rail
- Nested horizontal intent between the recommendation rail and the Daily archive
- Back navigation from a creator or cultural-context profile
- A publication-day boundary while the app remains open
- A source link that no longer works
- A correction to a previously published story

## 13. Non-goals for the first Daily Culture MVP

- **No exact DailyArt code clone.** The project uses an independent implementation.
- **No final DailyArt visual identity.** The reference styling is temporary research material.
- **No automated editorial selection.** Julio retains final curation control.
- **No AI-written publishing pipeline.** Unreviewed generated text cannot reach users.
- **No exhaustive cultural encyclopedia.** The product remains a curated collection.
- **No social network or user profiles.** Comments, followers, and public user profiles do not support the first core ritual.
- **Editorial profiles are not user profiles.** Creator and cultural-context pages explain archive entities. They do not represent app users.
- **No live public-submission backend in the browser prototype.** The form simulates intake. Production needs rights review, abuse controls, storage, and editorial routing.
- **No travel guide requirement.** City guides appear in the reference but are not core to Julio's brief.
- **No confirmed monetization.** A paywall or subscription needs a separate decision.
- **No native notifications in the browser prototype.** Settings can simulate opt-in and scheduling without registering an operating-system notification.
- **No installable native widget in the browser prototype.** Settings can preview and configure a simulation without claiming installation.
- **No unlicensed Roslindale files.** The prototype uses Newsreader unless Daily Culture obtains its own suitable Roslindale license.

## 14. Success measures

No usage baseline exists. The targets below are proposed validation gates, not evidence-backed forecasts.

### Prototype gates

- 100% of P0 core flows work in the supported mobile test environment.
- 0 unplanned repeats occur inside the configured no-repeat window.
- 100% of published sample entries include sources, rights status, and alt text.
- 100% of visible prototype interface and sample-story fields have English, Portuguese, Italian, and Spanish values or a readable English fallback.
- Daily horizontal dragging passes one-entry snapping, boundary, and vertical-scroll conflict checks.
- Daily direction passes physical pointer checks: `endX < startX` from Today reaches the past; `endX > startX` reaches contribution.
- The simplified contribution form passes separate required-field validation, session draft persistence, local image-preview, removal, rights-confirmation, keyboard, and explicit prototype-state checks.
- The **Check out more** rail passes inner-rail, outer-Daily, vertical-scroll, tap-versus-drag, return-state, and dynamic-height checks.
- Every interactive attribution opens the correct profile and returns to its originating story state.
- Every Settings control changes a visible state or opens a complete, clearly labeled simulation.
- At least 4 of 5 usability participants find and read today's story without help.
- At least 4 of 5 usability participants can save and later reopen a piece without help.
- No critical accessibility issue blocks reading or primary navigation.

### Early product indicators

Collect a baseline before setting growth targets.

- Daily-piece open rate
- Story completion rate, using one agreed completion definition
- Favourite rate per opened piece
- Return rate after 7 and 30 days
- Search success rate
- Collection-to-piece open rate
- Notification opt-in and notification-open rate
- Source-link open rate
- Correction rate per published entry
- Coverage balance across agreed formats and cultural contexts

### Quality safeguards

- Never optimize daily opens by weakening source, rights, or cultural-review standards.
- Treat reading depth and user trust as important alongside retention.
- Review representation balance across the collection, not only item by item.

## 15. Assumptions to validate

- **Proposed:** The first version serves one primary user type.
- **Proposed:** The reference prototype can use local sample data.
- **Proposed:** The prototype can store favourites on one device.
- **Proposed:** A dedicated content management system is not required for the first prototype.
- **Proposed:** Notion may inspire the editorial structure but is not yet the production database.
- **Proposed:** Still images can cover the first technical release.
- **Proposed:** Public-domain or explicitly licensed media will supply prototype content.
- **Proposed:** The final app will retain a five-destination structure unless testing disproves it.

## 16. Open decisions

| Priority | Decision | Owner | Blocking point |
|---|---|---|---|
| High | Who is the first target user? | Product | Before user testing |
| High | Does “modern culture” mean contemporary works, or culture across eras? | Editorial | Before selecting the first content set |
| High | What is the exact recurrence rule? | Product and editorial | Before scheduler implementation |
| High | Is the daily date global or based on the user's time zone? | Product and engineering | Before production scheduling |
| High | Which platforms ship first: iOS, Android, or both? | Product and engineering | Before choosing the production stack |
| High | Which languages ship in production beyond the four prototype locales? | Product and editorial | Before final content modeling |
| High | What rights standard governs each media type? | Editorial and legal | Before public distribution |
| Medium | Does Notion remain a planning tool or become a content source? | Product and engineering | Before editorial-tool work |
| Medium | Are citations visible inline, at the end, or behind a sources action? | Design and editorial | Before final detail design |
| Medium | Do favourites require an account? | Product | Before cross-device work |
| Medium | Which discovery facets matter at launch? | Research and product | Before taxonomy freeze |
| Medium | Do resurfaced stories change or remain frozen? | Editorial | Before recurrence launch |
| Low | Does the production app include native notifications at MVP launch? | Product | Before launch planning |
| Low | Is monetization part of the capstone scope? | Product | Before business-model work |

## 17. Suggested phases

### Phase 0: Reference prototype

- Reconstruct visible DailyArt screens and core navigation independently.
- Use placeholder or licensed sample content.
- Verify behavior against available screenshots and direct observations.
- Support chronological Daily dragging, four localized prototype languages, and the documented Settings controls.
- Place the contribution invitation immediately before Today in the rendered page order and provide complete localized intake simulation.
- Simulate Notifications and Widget behavior without native operating-system integration.
- Use Newsreader as the licensed serif substitute and a dynamic one-pixel Favourites underline.
- Add the measured **Check out more** continuation rail and tappable creator or cultural-context profiles.
- Label unobserved behavior as an assumption.
- Keep the prototype local.

### Phase 1: Daily Culture MVP

- Replace all reference branding and copy.
- Add the flexible cultural-piece model.
- Add Today, detail, Discover, Search, Favourites, and Settings.
- Use Julio's approved pilot content.
- Add sources, rights, accessibility, and recurrence safeguards.

### Phase 2: Editorial operations

- Add structured authoring, review, scheduling, and correction workflows.
- Add notifications and stronger search filters.
- Add account sync only if the research supports it.

### Phase 3: Learning and personalization

- Test recall prompts and reflection tools.
- Personalize resurfacing only with clear user value.
- Add new media types when rights and playback are ready.

## 18. MVP release checklist

- [ ] The daily piece stays stable for the full defined day.
- [ ] Every core navigation destination has a complete loading, empty, and error state.
- [ ] Users can read, save, unsave, search, discover, and share supported pieces.
- [ ] Daily drag or swipe navigation snaps to one chronological entry and does not block vertical reading.
- [ ] A physical rightward drag from Today reaches the previous edition. A physical leftward drag from Today reaches contribution. A physical rightward drag from contribution returns to Today. Recorded pointer coordinates verify each direction.
- [ ] Left Arrow and negative horizontal wheel `deltaX` reach newer editions, then contribution. Right Arrow and positive `deltaX` reach older editions. Each scrolling burst advances at most one edition without disrupting vertical reading, pinch zoom, or nested rails.
- [ ] The contribution form validates the subject and why-it-matters fields, previews and removes supported images, confirms image rights, and never claims transmission.
- [ ] The **Check out more** rail scrolls independently, opens standalone detail on tap, and never activates after a drag.
- [ ] Back from a recommendation restores the originating Daily date at the top without requiring the old vertical or rail offset.
- [ ] The active Daily height includes the rail after media, locale, text-size, and supported-viewport changes.
- [ ] Creator and cultural-context profiles use stable IDs, verified content, and return to the originating story state.
- [ ] English, Portuguese, Italian, and Spanish update visible interface and sample-story content.
- [ ] Units, Text Size, and Theme segmented controls apply their selected states.
- [ ] Notifications and Widget are complete, clearly labeled web simulations.
- [ ] The Favourites underline is one pixel high and follows the selected label width.
- [ ] Published pieces include required sources, rights data, credits, and alt text.
- [ ] Flexible entries work for at least three different cultural formats.
- [ ] The recurrence engine passes boundary and override tests.
- [ ] The app does not expose DailyArt branding, text, code, or unlicensed data.
- [ ] Primary flows work with screen readers, larger text, and reduced motion.
- [ ] Julio reviews and approves the pilot editorial set.
- [ ] The team records all changed decisions in the iteration log.

## 19. Iteration log

| Version | Date | Change | Decision status |
|---|---|---|---|
| 0.1 | 2026-09-03 | Captured the initial concept, DailyArt reference baseline, product boundaries, MVP scope, editorial model, recurrence model, and open decisions. | Working draft |
| 0.2 | 2026-09-04 | Added chronological Daily dragging, four localized prototype languages, detailed Settings controls, web-only notification and widget simulations, the Roslindale licensing boundary, Newsreader substitution, and a dynamic one-pixel Favourites underline. | Confirmed prototype decisions |
| 0.3 | 2026-09-04 | Added the Daily end-of-story recommendation rail, creator or cultural-context profile behavior, stable relationship requirements, and nested-gesture acceptance criteria. | Confirmed prototype decisions |
| 0.4 | 2026-09-04 | Anchored Today between a contribution invitation and older editions, added a localized prototype submission form with local image previews, and reduced Daily pill-label typography. | Confirmed prototype decisions |
| 0.5 | 2026-09-05 | Simplified contribution intake to an art piece, person, or cultural practice; why it matters; optional sources or links; and optional images. Removed name, email, and the separate culture, place, or community field. | Confirmed prototype decisions |
| 0.6 | 2026-09-05 | Julio requested a MoMA-inspired design-system exploration. Added `MOMA_DESIGN_DIRECTION.md` to distinguish observed reference evidence from chosen typography, color, and layout adaptations. The exploration supersedes former DailyArt visual styling where it conflicts, while preserving product behavior, all four locales, stored preferences, protected runtime, and the local preview. | Exploration authorized by Julio; final visual details await review; verification pending |
| 0.7 | 2026-09-05 | Julio reaffirmed simple Daily navigation and requested removal of the random or shuffle button. Today stays the anchor: swipe left for older editions one at a time; swipe right from Today for the contribution invitation. Preserve keyboard access to the same sequence. | Confirmed by Julio |
| 0.8 | 2026-09-05 | Julio reiterated physical click-and-drag directions after a preview mismatch: a leftward pointer movement reaches older editions; a rightward movement reaches newer editions, then contribution from Today. Record pointer coordinates when verifying. Preserve protected natural dragging with rendered page order `Suggestion / Today / Yesterday / Older editions`. Keep chronological dates, restoration, one-edition navigation, and keyboard access. | Physical drag directions confirmed by Julio; verify the implementation in the preview |
| 0.9 | 2026-09-05 | Fix release momentum reversing the Daily destination. Choose the target from total pointer displacement; keep short or cancelled gestures on the same edition. Preserve the shared Carousel and nested recommendation gestures. | Implementation correction within Julio's requested navigation fix |
| 0.10 | 2026-09-05 | Julio requested inversion of the current left and right actions. Physical rightward dragging now opens older editions; leftward dragging moves toward Today, then contribution. Render pages as `Older editions / Yesterday / Today / Suggestion`. Left Arrow and negative horizontal wheel delta reach newer editions or contribution; Right Arrow and positive delta reach older editions. Preserve one-edition gestures, momentum handling, and nested scrolling. This supersedes the directional decisions in versions 0.7 and 0.8. | Direction inversion requested by Julio |

### Update rule

Add one row for every material scope or product decision. Do not silently replace a confirmed decision.

When a decision changes, record:

- What changed
- Why it changed
- Who approved it
- Which designs, content, data, or code it affects
