# Franklin refinement

Built-in `image_gen__imagegen`. Input 1: round 3 close-up. Input 2: untouched Met frontal photograph DT2883.jpg.

Use case: precise-object-edit. Image 1 is the current approved-direction portrait of Houdon's Benjamin Franklin marble bust on black. Image 2 is the untouched museum photograph, the authority for facial/carving identity. Improve image 1 with ONLY two restrained refinements: (1) a slightly tighter source-based crop so the existing marble shoulders fill the ENTIRE bottom edge including both bottom corners, absolutely no dark triangular background slivers at bottom left/right; achieve by cropping a small amount from sides and lower edge, never extending or inventing anatomy/clothing. (2) improve photographic crispness and edge clarity in face, carved eyes, hair and scarf using details visible in image 2, without over-sharpen halos or invented pitting. Preserve the EXACT pose, eye-level frontal viewpoint, asymmetrical face, proportions, expression, hair arrangement, cream marble color and soft sculptural light. Preserve image1's generous near-black space above his head (about 16-18% height) and subtle charcoal lower backdrop. Do not reintroduce pedestal or lower rounded bust boundary. Do not restore, beautify or symmetrize. No new blemishes, false skin pores, added sculpture details or altered buttons. No illustration, painterly smoothing, waxy blur or aggressive dramatic lighting. Output a sharp, clean high-resolution 4:5 portrait, approximately 2048x2560 or larger. Entire bottom edge must be marble all the way across and beyond both side borders; head top and headroom must remain visible. No text, border, arrows, graphic marks or watermark. This is a conservative faithful photographic refinement, not a new imagined sculpture.

## Result and limits

Output: `assets/houdon-franklin-refined.png`, 1122 × 1402. The tool retained the prior dimensions despite the larger requested size. This is a clarity refinement, not a higher-resolution original.

Both bottom corners now contain marble, with no background wedges. The tool generated the small lower shoulder extensions rather than performing a pure crop; this is disclosed as foreground refinement. The black headroom and frontal view remain. Carved edges and local contrast look crisper. Fine surface grain was regenerated and differs from the original; the output remains a labeled AI study, not documentary evidence of finer sculpture details.

The Met's frontal original is itself 1454 × 1861 and soft. The accessible gallery version is smaller; its additional images show different views. No sharper same-view original was found. Source: https://www.metmuseum.org/art/collection/search/208578

Default output preserved at `/Users/juliocaggiano/.codex/generated_images/01a0bb1c-c5ec-74b2-aca8-0e50c144d1ee/exec-7c2e08b5-4c73-4aa8-8c02-5d85b70e5b04.png`.
