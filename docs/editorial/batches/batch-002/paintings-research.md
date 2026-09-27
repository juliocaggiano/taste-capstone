# Batch 002 — painting research and visual review

Prepared 25 September 2026. Five new candidates; none approved. All use `VOICE_GUIDE.md` v0.20 and the image workflow. These drafts do not inherit approval from earlier calibration exercises.

## Editorial checks

| Entry | Required central account | Main evidence | Boundary checked |
|---|---|---|---|
| The Third of May 1808 | Occupation, reprisals, individual victims and Christian martyr imagery | [Fundación Goya catalogue](https://fundaciongoyaenaragon.es/eng/obra/el-tres-de-mayo-de-1808/181), [Prado educational account](https://www.museodelprado.es/en/whats-on/multimedia/el-3-de-mayo-en-madrid-o-los-fusilamientos/9cd56487-45e7-5345-b265-f42ce572115a), [Smarthistory](https://smarthistory.org/art-historical-analysis/) | Avoid a military-victory summary. Do not identify the execution site as certain or claim that Goya witnessed the scene. |
| The Raft of the Medusa | Abandonment and political responsibility; cannibalism and violence during survival; hope and the Black signalman | [Louvre educational dossier, printed pages 36–37](https://api-www.louvre.fr/sites/default/files/2024-10/V4_DOSSIER_PEDAGOGIQUE_GUILLON_LETHIERE.pdf), [Claire Black McCoy](https://smarthistory.org/theodore-gericault-raft-of-the-medusa/) | The final canvas does not show people actively eating a body. Do not confuse fifteen rescued with ten longer-term survivors. “About 150” accommodates differing initial counts. |
| The Potato Eaters | Work, food and dignity; deliberate resistance to an attractive rural idyll | [Museum-authored collection text](https://artsandculture.google.com/asset/the-potato-eaters/7gFcKarE9QeaXw?avm=2&hl=en), [letter 497](https://vangoghletters.org/vg/letters/let497/letter.html), [letter 499](https://vangoghletters.org/vg/letters/let499/letter.html) | Artist intention is documented. Do not attribute feelings to the sitters, describe poverty as morally superior, or substitute the earlier painted study. |
| The Gleaners | Poverty beside abundance; dignity of repetitive work; politically uneasy reception after 1848 | [Orsay curatorial account](https://www.musee-orsay.fr/en/artworks/des-glaneuses-342), [Met essay](https://www.metmuseum.org/ru/essays/nineteenth-century-french-realism) | Political reception is not proof that Millet intended a revolutionary manifesto. Gleaning is explained for a reader unfamiliar with the custom. |
| Las Meninas | The viewer’s relationship to the mirror and unseen canvas; the painter’s claim to intellectual and social status | [Prado / Javier Portús](https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7800-9ade-48b0-ab8b-edee94ea877f), [GrandPalaisRmn](https://panoramadelart.com/analyse/les-menines), [Letha Ch’ien](https://smarthistory.org/diego-velazquez-las-meninas/) | Mirror mechanics remain disputed. Avoid presenting equality between all court members as its message, or replacing interpretation with a list of people. |

Sources and exact claim support are also stored per entry in `paintings.json`. Private `meaningBrief` fields state the interpretive anchor and pitfalls. Body lengths at handoff were 216, 233, 228, 237 and 243 words respectively. The Potato Eaters includes one short, verified artist quotation; its edition belongs in metadata.

## Evidence access and exclusions

- The Fundación Goya, Orsay, Met, Grand Palais, museum-authored Google Arts & Culture account and both Van Gogh letters supplied substantive readable text.
- The Louvre dossier was read at printed pages 36–37. Its political and abolitionist account informed the Raft interpretation.
- Prado and some Smarthistory URLs returned direct-access errors. Substantial indexed catalogue/article paragraphs were available and read. They were supplemented with fully accessible specialist or museum texts. The source records preserve this distinction.
- The Grand Palais Las Meninas article contains a separate dynastic interpretation and a cross-on-the-costume anecdote. Neither is used. Neither is needed for the supported viewer-position and artist-status account.
- One Smarthistory account of Goya makes a commissioning claim inconsistent with other accounts. No commissioning claim is included.
- The Commons Gleaners C page has inconsistent physical-dimension metadata. Physical dimensions are omitted; digital pixel dimensions are measured from the downloaded file.

## Public reception cross-check

These discussions were read as clues to what viewers notice or misunderstand. They do not establish historical facts or represent a measured audience consensus.

- [Goya discussion](https://www.reddit.com/r/BattlePaintings/comments/1kdsr5c/el_tres_de_mayo_de_1808_en_madrid_by_francisco/): prompted checking the reprisals, rather than importing unsupported claims about execution rules.
- [Raft discussion](https://www.reddit.com/r/ArtHistory/comments/1k1gooj/the_painting_that_exposed_a_corrupt_government/): prompted separating documented cannibalism from the moment actually depicted.
- [Potato Eaters post](https://www.reddit.com/user/HackrLife/comments/1alw8kd/the_potato_eaters/): a weak reception source with little discussion. Artist letters and museum interpretation carry the analysis.
- [Gleaners discussion](https://www.reddit.com/r/ArtHistory/comments/1t0pp7i/why_did_jeanfran%C3%A7ois_millets_peasants_cause_so/): prompted distinguishing reception from an inferred revolutionary intention.
- [Las Meninas discussion](https://www.reddit.com/r/ArtHistory/comments/vqy1dw/las_meninas_painting_what_meanings_or_imagery_do/): prompted making the viewer’s position explicit and rejecting an unsupported equality thesis.

## Image identity, quality and provenance

Fifteen local JPEG files accompany `paintings-images.json`. All were opened for visual inspection. Fourteen were compared together on a temporary contact sheet; the final Grand Palais Las Meninas image was inspected separately at large size. The checks covered complete composition, exact work, legibility, visible differences and accidental substitution. No reproduction was created with AI or locally recoloured, sharpened or cropped.

The options compare existing published reproductions, not three sizes of one file. A different publisher or tonal rendering does not establish an independent photographic capture or more accurate colour. Those limits appear in option metadata.

| Painting | A | B | C |
|---|---|---|---|
| The Third of May 1808 | Prado / Google Earth, 1920 × 1483 | Earlier Prado publication, 1920 × 1476 | Yorck, 960 × 744 |
| The Raft of the Medusa | Louvre, 1280 × 872 | 1996 art-book scan, 1920 × 1298 | Web Gallery of Art, 960 × 652 |
| The Potato Eaters | Museum reproduction, 1920 × 1354 | Museum / Google Art, 1920 × 1361 | Book scan, 1920 × 1380 |
| The Gleaners | Orsay / Google Art, 1920 × 1437 | Web Gallery of Art, 1280 × 964 | Published Yorck derivative, 1920 × 1452 |
| Las Meninas | Prado / Google Earth, 1920 × 2210 | Yorck, 1920 × 2225 | Grand Palais / Prado, 1700 × 1934 |

- **Potato Eaters identity:** all three show the final Amsterdam painting, F82 / JH764 / s0005V1962. The deceptively similar Commons Google Art Project filename without `(5776925)` depicts the earlier Kröller-Müller study F78. That candidate was excluded.
- **Goya and Raft C:** 960-pixel options are suitable for thumbnail comparison, with less zoom detail. The limitation is visible in their descriptions. No artificial upscaling was applied.
- **Gleaners C:** Commons records an existing contributor colour adjustment on 11 September 2026. This is disclosed. It is a published reproduction variant, not a new photograph or this project’s treatment.
- **Potato Eaters C:** Commons identifies a book scan but does not name the book. Attribution remains limited to what the record provides.
- **Las Meninas C:** downloaded directly from GrandPalaisRmn’s article. The source credits it to the Prado with a public-domain / CC0 label.
- **Rights:** historic painting copyright, a source’s reproduction licence statement, editorial image approval and clearance for later public app use remain separate. All fifteen options stay `review_only_pending_clearance`; none has a selected or approved state.

The manifest stores full source-page URLs, museum object references, original/download URLs, pixel dimensions, measured file hashes and review dates. Initial hero images use A only as a neutral starting preview.
