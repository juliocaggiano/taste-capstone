const records = JSON.parse(document.getElementById('review-data').textContent);
const byId = new Map(records.map(record => [record.id, record]));
const testMode = new URLSearchParams(location.search).has('test');
const storageKey = 'taste-batch-001-review-v2';
const batchConfig = JSON.parse(document.getElementById('review-config').textContent);
const expectedEntries = batchConfig.expectedEntryIds;
const expectedCount = expectedEntries.length;
if (testMode) document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.getAttribute('href'), location.href);
  if (url.origin === location.origin && /\/(REVIEW|IMAGES)\.html$/.test(url.pathname)) { url.searchParams.set('test', '1'); link.href = url.href; }
});
let state = {version:2, entries:{}};
let canSave = true;
let pendingWrites = [];
const saveStatus = document.getElementById('save-status');
function mergePending(saved) {
  const merged = {...saved, entries:{...saved.entries}};
  for (const edit of pendingWrites) {
    const old = merged.entries[edit.id] || {};
    merged.entries[edit.id] = {...old, ...edit.apply(old)};
  }
  return merged;
}
function readSaved() {
  if (testMode) return state;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    return mergePending(saved?.version === 2 && saved.entries && typeof saved.entries === 'object' ? saved : state);
  } catch { canSave = false; return state; }
}
state = readSaved();
function commentsFor(record) {
  const comments = state.entries[record.id]?.comments;
  return Array.isArray(comments) ? comments.filter(c => c && typeof c.id === 'string' && typeof c.quote === 'string' && typeof c.text === 'string') : [];
}
function effective(record) {
  const saved = state.entries[record.id] || {};
  return {
    imageOption:(saved.imageHash === record.imageHash || record.compatibleImageSelections?.some(previous => previous.imageHash === saved.imageHash && previous.optionIds.includes(saved.imageOption))) && record.options.some(o => o.id === saved.imageOption && o.approvalEligible !== false) ? saved.imageOption : null,
    writingStatus:saved.bodyHash === record.bodyHash && ['approved','changes_requested'].includes(saved.writingStatus) ? saved.writingStatus : 'pending',
    notes:saved.notes || '', comments:commentsFor(record)
  };
}
function save() {
  if (testMode) { saveStatus.textContent = 'Test mode · choices are temporary'; return; }
  try { localStorage.setItem(storageKey, JSON.stringify(state)); pendingWrites = []; canSave = true; saveStatus.textContent = 'Saved in this browser'; }
  catch { canSave = false; saveStatus.textContent = 'Could not save · export your review'; }
}
// Merge the edited field into the latest saved entry so another tab's notes survive.
function updateEntry(id, patch) {
  state = readSaved();
  const old = state.entries[id] || {};
  const updatedAt = new Date().toISOString();
  const apply = latest => ({...(typeof patch === 'function' ? patch(latest) : patch), updatedAt});
  state.entries[id] = {...old, ...apply(old)};
  if (!testMode) pendingWrites.push({id, apply});
  save();
}
// Reconcile Julio's dated dictation once. Preserve notes, quotes and later UI edits.
function applyRecordedDecisions() {
  for (const record of records) {
    const decision = record.recordedDecision;
    if (!decision?.decisionId || state.entries[record.id]?.appliedDecisionIds?.includes(decision.decisionId)) continue;
    // A stale decision must not replace a later review or be marked as applied.
    if (decision.bodyHash !== record.bodyHash || decision.imageHash !== record.imageHash) continue;
    updateEntry(record.id, old => {
      const patch = {appliedDecisionIds:[...(old.appliedDecisionIds || []),decision.decisionId]};
      if (decision.bodyHash === record.bodyHash) {
        patch.writingStatus = decision.writingStatus;
        patch.bodyHash = record.bodyHash;
      }
      if (decision.imageHash === record.imageHash) {
        patch.imageOption = decision.imageStatus === 'approved' ? decision.imageOption : null;
        patch.imageHash = record.imageHash;
      }
      if (decision.resolvedCommentIds?.length && decision.bodyHash === record.bodyHash) {
        patch.comments = (old.comments || []).map(comment => decision.resolvedCommentIds.includes(comment.id)
          ? {...comment,resolved:true,resolvedAt:decision.recordedAt,resolutionEvidence:decision.decisionId}
          : comment);
      }
      return patch;
    });
  }
}
function applyFeedbackRevisions() {
  for (const record of records) {
    for (const revision of record.feedbackRevisions || []) {
      if (revision.toBodyHash !== record.bodyHash || state.entries[record.id]?.appliedFeedbackRevisionIds?.includes(revision.revisionId)) continue;
      updateEntry(record.id, old => feedbackRevisionPatch(record, revision, old));
    }
  }
}
function isApproved(record) {
  const value = effective(record);
  return !record.onHold && value.writingStatus === 'approved' && Boolean(value.imageOption) && !value.comments.some(comment => !comment.resolved);
}
const displayedVersions = new Map();
function differsFromLive(record) {
  if (!record.published || record.body !== record.published.body) return true;
  const option = effective(record).imageOption;
  const selected = record.options.find(o=>o.id===option);
  return Boolean(selected && (selected.id !== record.published.selectedOption || (record.published.sourceAssetSha256 && selected.assetSha256 !== record.published.sourceAssetSha256)));
}
function isReady(record) { return isApproved(record) && differsFromLive(record); }
function needsReview(record) {
  const value = effective(record);
  return !isApproved(record) && (differsFromLive(record) || value.writingStatus === 'changes_requested' || value.comments.some(c=>!c.resolved) || record.onHold);
}
function showVersion(record, version) {
  const article = document.getElementById(record.id);
  const live = article?.querySelector('[data-live]'), draft = article?.querySelector('[data-draft]');
  if (!draft) return;
  const showLive = Boolean(record.published && version === 'live');
  if (live) live.hidden = !showLive;
  draft.hidden = showLive;
  article.querySelectorAll('[data-version]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.version === (showLive ? 'live' : 'draft'))));
  article.dataset.version = showLive ? 'live' : 'draft';
}
function hasCompleteImageSet(record) {
  if (record.pendingImages === true && record.options.length === 0 && batchConfig.awaitingImageEntryIds?.includes(record.id)) return true;
  const rule = batchConfig.imageOptionsByMedium?.[record.medium] || {min:batchConfig.optionsPerEntry,max:batchConfig.optionsPerEntry};
  const ids = record.options.map(option => option.id);
  return ids.length >= rule.min && ids.length <= rule.max && new Set(ids).size === ids.length && ['A','B','C'].slice(0,ids.length).every(id => ids.includes(id));
}
function releaseEligibility() {
  const completeSet = expectedCount > 0 && new Set(expectedEntries).size === expectedCount && records.length === expectedCount && byId.size === expectedCount && expectedEntries.every(id => byId.has(id)) && records.every(hasCompleteImageSet);
  const readyIds = records.filter(isApproved).map(record => record.id);
  return {ready:completeSet && readyIds.length > 0, approvedEntries:readyIds.length, readyEntryIds:completeSet ? readyIds : [], expectedEntries:expectedCount, requires:'Current writing approval, a current image choice and resolved comments for each submission. Theater is on hold.', publicationStatus:batchConfig.prototypeImport ? 'local_prototype_has_imported_subset' : 'not_imported', prototypeImport:batchConfig.prototypeImport || null, releaseMode:'approved_submissions_for_later_import'};
}
function render() {
  let chosen = 0, reviewed = 0;
  for (const record of records) {
    const value = effective(record);
    if (value.imageOption) chosen++;
    if (value.writingStatus !== 'pending') reviewed++;
    const article = document.getElementById(record.id);
    if (!article) continue;
    article.querySelectorAll('[data-option]').forEach(card => card.classList.toggle('selected', card.dataset.option === value.imageOption));
    article.querySelectorAll('[data-entry]').forEach(input => { input.checked = input.value === value.imageOption; });
    article.querySelectorAll('[data-writing]').forEach(input => { input.checked = input.value === value.writingStatus; });
    const notes = article.querySelector('[data-notes]');
    if (notes && document.activeElement !== notes) notes.value = value.notes;
    renderComments(record);
  }
  applyReviewFilters();
}
function changeImage(id, option) {
  const record = byId.get(id);
  if (!record?.options.some(x => x.id === option && x.approvalEligible !== false)) return;
  updateEntry(id, {imageOption:option, imageHash:record.imageHash}); render();
}
document.querySelectorAll('[data-entry]').forEach(input => input.addEventListener('change', () => changeImage(input.dataset.entry, input.value)));
document.querySelectorAll('[data-writing]').forEach(input => input.addEventListener('change', () => {
  const record = byId.get(input.dataset.writing);
  updateEntry(record.id, {writingStatus:input.value, bodyHash:record.bodyHash}); render();
}));
document.querySelectorAll('[data-notes]').forEach(input => input.addEventListener('input', () => updateEntry(input.dataset.notes, {notes:input.value, notesBodyHash:byId.get(input.dataset.notes).bodyHash})));
function reviewView() {
  let target = ''; try { target = decodeURIComponent(location.hash.slice(1)); } catch {}
  const entry = byId.get(target);
  const [first, second] = target.split('/');
  const status = ['live','approved','to-review'].includes(first) ? first : 'all';
  const candidate = status === 'all' ? target : second;
  const medium = [...batchConfig.activeMedia,'visual-studies'].includes(candidate) ? candidate : entry?.medium || 'all';
  return {status, medium, entry};
}
function restoreReviewFocus(target) {
  const article = target?.closest?.('.entry');
  const visible = target?.isConnected && !article?.hidden;
  (visible ? target : document.querySelector('[data-status][aria-current="true"]'))?.focus({preventScroll:true});
}
function applyReviewFilters() {
  const {status, medium} = reviewView();
  const approved = records.filter(isReady).length;
  const focusedEntry = document.activeElement?.closest?.('.entry');
  let shown = 0;
  document.querySelectorAll('.entry').forEach(article => {
    const record = byId.get(article.id);
    const statusMatches = status === 'all' || (status === 'live' ? Boolean(record.published) : status === 'approved' ? isReady(record) : needsReview(record));
    showVersion(record, displayedVersions.get(record.id) || (status === 'live' || (status === 'all' && record.published && !differsFromLive(record)) ? 'live' : 'draft'));
    article.hidden = !statusMatches || (medium !== 'all' && article.dataset.medium !== medium);
    if (!article.hidden) shown++;
  });
  const studies = document.getElementById('visual-studies'); if (studies) studies.hidden = medium !== 'visual-studies';
  document.querySelectorAll('[data-status]').forEach(link => {
    link.setAttribute('aria-current', String(link.dataset.status === status && medium !== 'visual-studies'));
    const counts = {all:records.length,live:records.filter(r=>r.published).length,approved,'to-review':records.filter(needsReview).length};
    link.querySelector('.tab-count').textContent = counts[link.dataset.status];
  });
  document.querySelectorAll('[data-filter]').forEach(link => {
    const filter = link.dataset.filter;
    link.setAttribute('aria-current', String(filter === medium));
    const hash = filter === 'visual-studies' ? filter : status === 'all' ? filter : filter === 'all' ? status : `${status}/${filter}`;
    const url = new URL(link.href); url.hash = hash; link.href = url.href;
  });
  const empty = document.getElementById('review-empty');
  if (empty) { empty.hidden = shown > 0 || medium === 'visual-studies'; empty.textContent = status === 'approved' ? 'No new approved versions to publish.' : 'No entries to review in this view.'; }
  if (focusedEntry?.hidden) restoreReviewFocus(null);
}
function filterFromHash() {
  const {entry} = reviewView();
  displayedVersions.clear();
  applyReviewFilters();
  hideSelectionAction(); hover.hidden = true;
  if (entry) document.getElementById(entry.id)?.scrollIntoView({block:'start'}); else window.scrollTo({top:0, behavior:'instant'});
}
window.addEventListener('hashchange', filterFromHash);
document.querySelectorAll('[data-filter],[data-status]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); const next = new URL(link.href).hash; if (location.hash === next) filterFromHash(); else location.hash = next; }));
const viewer = document.getElementById('image-viewer');
let currentPreview = null;
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
  const [id, optionId] = button.dataset.preview.split(':');
  const record = byId.get(id), option = record.options.find(o => o.id === optionId);
  currentPreview = {id, optionId};
  document.getElementById('choose-from-viewer').hidden = option.approvalEligible === false;
  document.getElementById('viewer-title').textContent = `${record.title} · Option ${optionId}`;
  document.getElementById('viewer-description').textContent = option.description || option.label;
  document.getElementById('original-image').href = option.imageUrl;
  const frame = document.getElementById('viewer-image'); frame.replaceChildren(); frame.dataset.medium = record.medium;
  let visual;
  if (option.thumbnailWindow) {
    const {x,y,w,h} = option.thumbnailWindow, ns = 'http://www.w3.org/2000/svg';
    visual = document.createElementNS(ns, 'svg');
    visual.setAttribute('viewBox', `${x*option.width} ${y*option.height} ${w*option.width} ${h*option.height}`);
    visual.setAttribute('role', 'img');
    const clip = document.createElementNS(ns, 'clipPath'), rect = document.createElementNS(ns, 'rect');
    clip.id = `crop-${id}-${optionId}`; clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    for (const [key,value] of Object.entries({x:x*option.width,y:y*option.height,width:w*option.width,height:h*option.height})) rect.setAttribute(key,value);
    clip.append(rect);
    const defs = document.createElementNS(ns, 'defs'); defs.append(clip); visual.append(defs);
    const image = document.createElementNS(ns, 'image');
    image.setAttribute('href', option.imageUrl); image.setAttribute('width', option.width); image.setAttribute('height', option.height);
    image.setAttribute('clip-path', `url(#${clip.id})`); visual.append(image);
  } else visual = button.querySelector('.book-cover,svg,img').cloneNode(true);
  if (visual.tagName.toLowerCase() === 'svg') {
    const map = new Map();
    visual.querySelectorAll('[id]').forEach(el => { map.set(el.id, `viewer-${el.id}`); el.id = `viewer-${el.id}`; });
    visual.querySelectorAll('*').forEach(el => { for (const attr of Array.from(el.attributes)) { let value = attr.value; for (const [from,to] of map) value = value.replaceAll(`#${from}`, `#${to}`); if (map.has(value)) value = map.get(value); if (value !== attr.value) el.setAttribute(attr.name, value); } });
    visual.setAttribute('aria-label', option.altText); visual.removeAttribute('aria-labelledby');
  } else { visual.removeAttribute('loading'); visual.querySelectorAll('img').forEach(img => img.removeAttribute('loading')); }
  frame.append(visual); viewer.showModal(); document.body.classList.add('viewer-open');
}));
document.querySelectorAll('[data-source-preview]').forEach(button => button.addEventListener('click', () => {
  const [id, optionId] = button.dataset.sourcePreview.split(':');
  const record = byId.get(id), option = record.options.find(o => o.id === optionId);
  if (!option.originalImageUrl) return;
  currentPreview = null;
  document.getElementById('choose-from-viewer').hidden = true;
  document.getElementById('viewer-title').textContent = `${record.title} · Original source for ${optionId}`;
  document.getElementById('viewer-description').textContent = option.fidelityNotes || 'Original source before image treatment.';
  document.getElementById('original-image').href = option.originalImageUrl;
  const frame = document.getElementById('viewer-image'); frame.replaceChildren(); frame.dataset.medium = 'source';
  const visual = document.createElement('img'); visual.src = option.originalImageUrl; visual.alt = `Original source for ${record.title}, option ${optionId}`;
  frame.append(visual); viewer.showModal(); document.body.classList.add('viewer-open');
}));
document.getElementById('close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => document.body.classList.remove('viewer-open'));
document.getElementById('choose-from-viewer').addEventListener('click', () => { if (currentPreview) changeImage(currentPreview.id, currentPreview.optionId); viewer.close(); });

// Anchors use rendered prose text, including the explicit newline between paragraphs.
const selectionAction = document.getElementById('add-passage-comment');
const editor = document.getElementById('comment-editor');
const hover = document.getElementById('comment-hover');
const commentText = document.getElementById('comment-text');
const resolveButton = document.getElementById('resolve-comment');
let pendingSelection = null, editingComment = null, commentReturnFocus = null;
function storyFor(record) { return document.querySelector(`[data-story="${record.id}"]`); }
function isCurrentAnchor(record, comment, text) {
  return comment.bodyHash === record.bodyHash && Number.isInteger(comment.start) && Number.isInteger(comment.end) && comment.start >= 0 && comment.end > comment.start && text.slice(comment.start, comment.end) === comment.quote;
}
function textNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = []; let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}
function renderComments(record) {
  const story = storyFor(record), panel = document.querySelector(`[data-comments="${record.id}"]`);
  if (!story || !panel) return;
  story.querySelectorAll('mark.passage-highlight').forEach(mark => mark.replaceWith(...mark.childNodes)); story.normalize();
  const text = story.textContent, comments = commentsFor(record);
  const anchored = comments.filter(c => isCurrentAnchor(record, c, text));
  let offset = 0;
  for (const node of textNodes(story)) {
    const start = offset, end = offset + node.length; offset = end;
    const matches = anchored.filter(c => c.start < end && c.end > start);
    if (!matches.length) continue;
    const cuts = [...new Set([start, end, ...matches.flatMap(c => [Math.max(start,c.start),Math.min(end,c.end)])])].sort((a,b) => a-b);
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < cuts.length-1; i++) {
      const from = cuts[i], to = cuts[i+1], segment = node.textContent.slice(from-start,to-start);
      const active = matches.filter(c => c.start < to && c.end > from);
      if (!active.length || !segment.trim()) fragment.append(document.createTextNode(segment));
      else {
        const mark = document.createElement('mark'); mark.className = 'passage-highlight'; mark.textContent = segment;
        mark.dataset.commentIds = active.map(c => c.id).join(' '); mark.dataset.commentEntry = record.id;
        mark.tabIndex = 0; mark.setAttribute('role','button'); mark.setAttribute('aria-label', `Open ${active.length === 1 ? 'comment' : `${active.length} comments`} on ${segment}`);
        mark.classList.toggle('is-resolved', active.every(c => c.resolved)); fragment.append(mark);
      }
    }
    node.replaceWith(fragment);
  }
  const wasOpen = panel.querySelector('details')?.open; panel.replaceChildren();
  if (!comments.length) return;
  const details = document.createElement('details'); details.className = 'comment-list'; details.open = wasOpen ?? comments.some(c => !c.resolved);
  const summary = document.createElement('summary'); summary.textContent = `Passage comments · ${comments.filter(c => !c.resolved).length} open`; details.append(summary);
  for (const comment of comments) {
    const card = document.createElement('article'); card.className = 'passage-comment'; card.dataset.commentCard = comment.id;
    const quote = document.createElement('blockquote'); quote.textContent = comment.quote;
    const feedback = document.createElement('p'); feedback.className = 'comment-feedback'; feedback.textContent = comment.text;
    const meta = document.createElement('p'); meta.className = 'comment-meta'; meta.textContent = `${comment.resolved ? 'Resolved' : 'Open'}${isCurrentAnchor(record, comment, text) ? '' : ' · Earlier draft; original passage retained'}`;
    const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = 'Open comment'; edit.addEventListener('click', () => openComment(record.id, comment.id, edit));
    card.append(quote, feedback, meta, edit); details.append(card);
  }
  panel.append(details);
}
function hideSelectionAction() { selectionAction.hidden = true; }
function captureSelection() {
  if (document.querySelector('.prose-editor')) { hideSelectionAction(); return; }
  if (editor.open || viewer.open) return;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) { hideSelectionAction(); return; }
  const range = selection.getRangeAt(0);
  const element = node => node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  const story = element(range.startContainer)?.closest('.story-text');
  if (!story?.dataset.story || element(range.endContainer)?.closest('.story-text') !== story) { hideSelectionAction(); return; }
  const before = document.createRange(); before.selectNodeContents(story); before.setEnd(range.startContainer,range.startOffset);
  const start = before.toString().length, quote = range.toString(), end = start + quote.length;
  if (!quote.trim() || story.textContent.slice(start,end) !== quote) { hideSelectionAction(); return; }
  const rect = range.getBoundingClientRect(), record = byId.get(story.dataset.story);
  pendingSelection = {entryId:record.id, start, end, quote, prefix:story.textContent.slice(Math.max(0,start-50),start), suffix:story.textContent.slice(end,end+50), bodyHash:record.bodyHash, rect:{left:rect.left,top:rect.top,bottom:rect.bottom}};
  selectionAction.hidden = false;
  selectionAction.style.left = `${Math.max(12,Math.min(innerWidth-190,rect.left))}px`;
  selectionAction.style.top = `${Math.max(8,Math.min(innerHeight-52,rect.top-44))}px`;
}
document.addEventListener('selectionchange', () => requestAnimationFrame(captureSelection));
document.addEventListener('pointerup', captureSelection);
document.addEventListener('keyup', captureSelection);
window.addEventListener('scroll', () => { hideSelectionAction(); hover.hidden = true; }, {passive:true});
selectionAction.addEventListener('pointerdown', event => event.preventDefault());
selectionAction.addEventListener('click', () => {
  if (!pendingSelection) return;
  const {entryId,rect,...anchor} = pendingSelection;
  editingComment = {entryId,anchor,id:null}; showCommentEditor('',anchor.quote,false,storyFor(byId.get(entryId)),rect);
});
function showCommentEditor(text, quote, stale, returnFocus, rect) {
  commentReturnFocus = returnFocus; hideSelectionAction(); hover.hidden = true;
  document.getElementById('comment-quote').textContent = quote; commentText.value = text;
  document.getElementById('comment-version-note').hidden = !stale;
  const existing = editingComment.id ? commentsFor(byId.get(editingComment.entryId)).find(c => c.id === editingComment.id) : null;
  resolveButton.hidden = !existing; resolveButton.textContent = existing?.resolved ? 'Reopen comment' : 'Resolve comment';
  editor.style.left = `${Math.max(12,Math.min(innerWidth-392,rect?.left || 12))}px`;
  editor.style.top = `${Math.max(12,Math.min(innerHeight-440,(rect?.bottom || 80)+10))}px`;
  editor.showModal();
  editor.style.left = `${Math.max(12,Math.min(innerWidth-editor.offsetWidth-12,rect?.left || 12))}px`;
  editor.style.top = `${Math.max(12,Math.min(innerHeight-editor.offsetHeight-12,(rect?.bottom || 80)+10))}px`;
  commentText.focus();
}
function openComment(entryId, commentId, target) {
  const record = byId.get(entryId), comment = commentsFor(record).find(c => c.id === commentId);
  if (!comment) return;
  editingComment = {entryId,id:commentId,anchor:comment};
  showCommentEditor(comment.text,comment.quote,!isCurrentAnchor(record,comment,storyFor(record).textContent),target,target?.getBoundingClientRect());
}
function saveCommentPatch(patch) {
  const {entryId,id,anchor} = editingComment, now = new Date().toISOString(), commentId = id || crypto.randomUUID();
  updateEntry(entryId, old => {
    const comments = Array.isArray(old.comments) ? old.comments.slice() : [];
    const index = comments.findIndex(c => c.id === commentId);
    const comment = {...(index >= 0 ? comments[index] : {...anchor,id:commentId,createdAt:now,resolved:false}),...patch,updatedAt:now};
    if (index >= 0) comments[index] = comment; else comments.push(comment);
    return {comments};
  });
}
document.getElementById('comment-form').addEventListener('submit', event => {
  event.preventDefault(); if (!editingComment || !commentText.value.trim()) return;
  saveCommentPatch({text:commentText.value.trim()}); editor.close(); render();
});
resolveButton.addEventListener('click', () => {
  if (!editingComment?.id) return;
  const existing = commentsFor(byId.get(editingComment.entryId)).find(c => c.id === editingComment.id);
  saveCommentPatch({text:commentText.value.trim() || existing.text,resolved:!existing.resolved}); editor.close(); render();
});
document.getElementById('cancel-comment').addEventListener('click', () => editor.close());
editor.addEventListener('close', () => {
  window.getSelection()?.removeAllRanges(); pendingSelection = null; hideSelectionAction();
  const target = commentReturnFocus; requestAnimationFrame(() => restoreReviewFocus(target?.isConnected ? target : editingComment && storyFor(byId.get(editingComment.entryId))));
});
function highlightTarget(event) { return event.target.closest?.('mark.passage-highlight'); }
document.addEventListener('click', event => {
  const mark = highlightTarget(event); if (!mark || window.getSelection()?.toString()) return;
  const ids = mark.dataset.commentIds.split(' ');
  if (ids.length === 1) openComment(mark.dataset.commentEntry, ids[0], mark);
  else { const panel = document.querySelector(`[data-comments="${mark.dataset.commentEntry}"] details`); panel.open = true; panel.scrollIntoView({block:'nearest'}); panel.querySelector('button')?.focus(); }
});
document.addEventListener('keydown', event => {
  const mark = highlightTarget(event); if (mark && ['Enter',' '].includes(event.key)) { event.preventDefault(); window.getSelection()?.removeAllRanges(); mark.click(); }
});
document.addEventListener('pointerover', event => {
  const mark = highlightTarget(event); if (!mark || editor.open) return;
  const record = byId.get(mark.dataset.commentEntry), ids = mark.dataset.commentIds.split(' ');
  hover.textContent = commentsFor(record).filter(c => ids.includes(c.id)).map(c => c.text).join('\n\n');
  const rect = mark.getBoundingClientRect(); hover.style.left = `${Math.max(12,Math.min(innerWidth-332,rect.left))}px`; hover.style.top = `${Math.max(12,Math.min(innerHeight-170,rect.bottom+8))}px`; hover.hidden = false;
});
document.addEventListener('pointerout', event => { if (highlightTarget(event)) hover.hidden = true; });

document.getElementById('export-review').addEventListener('click', () => {
  const eligibility = releaseEligibility();
  const result = {batchId:batchConfig.additionalBatches?.length ? 'editorial-review' : 'batch-001',batchIds:[...new Set(records.map(record => record.sourceBatchId || 'batch-001'))],testMode,exportedAt:new Date().toISOString(),releaseEligibility:{...eligibility,ready:!testMode && eligibility.ready},activeMedia:batchConfig.activeMedia,onHoldMedia:batchConfig.onHoldMedia,visualStudies:exportVisualStudyFeedback(),entries:records.map(record => ({...effective(record),entryId:record.id,sourceBatchId:record.sourceBatchId || 'batch-001',title:record.title,revision:record.revision,feedbackRevisions:record.feedbackRevisions,revisionHistory:state.entries[record.id]?.revisionHistory || [],body:record.body,published:record.published,bodyHash:record.bodyHash,imageHash:record.imageHash,selectedImage:record.options.find(o => o.id === effective(record).imageOption) || null}))};
  const url = URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = `${testMode ? 'TEST-ONLY-' : ''}taste-editorial-review.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
});
window.addEventListener('storage', event => {
  if (testMode || event.key !== storageKey) return;
  try { const saved = JSON.parse(event.newValue); if (saved?.version === 2 && saved.entries) { state = mergePending(saved); applyFeedbackRevisions(); render(); } else if (event.newValue === null) { state = mergePending({version:2,entries:{}}); render(); } } catch {}
});
// Direct edits save to the source dataset. Approval is always tied to the saved body.
function proseHTML(body) {
  const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const inline = text => escape(text).replace(/\*([^*]+)\*/g,'<em>$1</em>');
  return body.trim().split('\n\n').map(p=>p.startsWith('> ') ? `<blockquote>${inline(p.slice(2))}</blockquote>` : `<p>${inline(p)}</p>`).join('\n');
}
function openTextEditor(id) {
  const record = byId.get(id), article = document.getElementById(id), story = storyFor(record);
  if (!story || article.querySelector('.prose-editor')) return;
  displayedVersions.set(id,'draft'); showVersion(record,'draft');
  window.getSelection()?.removeAllRanges(); hideSelectionAction(); hover.hidden = true;
  const form = document.createElement('form'); form.className='prose-editor';
  const text = document.createElement('textarea'); text.value=record.body; text.setAttribute('aria-label',`Edit text of ${record.title}`);
  text.rows=Math.min(30,Math.max(10,record.body.split('\n').length+5));
  const actions=document.createElement('div'); actions.className='prose-editor-actions';
  const saveButton=document.createElement('button'); saveButton.type='submit'; saveButton.textContent='Save draft';
  const cancel=document.createElement('button'); cancel.type='button'; cancel.textContent='Cancel';
  const notice=document.createElement('p'); notice.className='editor-notice'; notice.setAttribute('role','status');
  actions.append(saveButton,cancel); form.append(text,actions,notice); story.hidden=true; story.after(form);
  article.querySelector('[data-edit-story]').hidden=true;
  const finish=()=>{form.remove();story.hidden=false;article.querySelector('[data-edit-story]').hidden=false;story.focus({preventScroll:true});};
  cancel.addEventListener('click',finish);
  form.addEventListener('keydown',event=>{if(event.key==='Escape' && !saveButton.disabled){event.preventDefault();finish();}});
  const baseHash=record.bodyHash;
  form.addEventListener('submit',async event=> {
    event.preventDefault(); if(!text.value.trim()) {notice.textContent='Enter the draft text.'; return;}
    saveButton.disabled=true;cancel.disabled=true;notice.textContent='Saving…';
    try {
      let updated;
      if(testMode) updated={...record,body:text.value.trim(),bodyHash:`test-${Date.now()}`,revision:record.revision+1};
      else {
        const response=await fetch(`/api/entries/${id}/body`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body:text.value,baseHash})});
        const result=await response.json();if(!response.ok)throw new Error(result.error);updated=result.record;
      }
      const changed=updated.bodyHash!==record.bodyHash;
      Object.assign(record,updated);
      if(changed) updateEntry(id,{bodyHash:record.bodyHash,writingStatus:'pending'});
      story.innerHTML=proseHTML(record.body);
      finish(); render();
      article.querySelector('[data-edit-status]').textContent=testMode ? 'Test draft saved' : changed ? 'Draft saved · needs approval' : 'No changes';
    } catch(error) {notice.textContent=error.message;saveButton.disabled=false;cancel.disabled=false;}
  });
  text.focus();
}
document.querySelectorAll('[data-edit-story]').forEach(button=>button.addEventListener('click',()=>openTextEditor(button.dataset.editStory)));
document.querySelectorAll('[data-story]').forEach(story=>story.addEventListener('dblclick',event=>{if(!event.target.closest('mark'))openTextEditor(story.dataset.story);}));
document.querySelectorAll('[data-versions]').forEach(group=>group.addEventListener('click',event=>{
  const button=event.target.closest('[data-version]');if(!button)return;
  if(document.getElementById(group.dataset.versions).querySelector('.prose-editor'))return;
  displayedVersions.set(group.dataset.versions,button.dataset.version);showVersion(byId.get(group.dataset.versions),button.dataset.version);hideSelectionAction();
}));
document.querySelectorAll('[data-open-draft]').forEach(button=>button.addEventListener('click',()=>{
  const id=button.dataset.openDraft;
  if(storyFor(byId.get(id)))openTextEditor(id);else location.href=`REVIEW.html${testMode ? '?test=1' : ''}#${id}`;
}));
window.addEventListener('beforeunload',event=>{if(document.querySelector('.prose-editor')){event.preventDefault();event.returnValue='';}});
// The server's verified publication snapshot is independent of local review votes.
async function refreshPublishedCatalog() {
  try {
    const response=await fetch('/api/catalog');if(!response.ok)return;
    const catalog=await response.json();
    for(const record of records) {
      const live=catalog.entries.find(entry=>entry.id===record.id);
      // A newly published work needs the builder's Live panel as well as its data.
      if(Boolean(live)!==Boolean(record.published)) { document.getElementById('save-status').textContent='Publication changed. Reload to see the latest catalog.'; continue; }
      if(live && JSON.stringify(live)!==JSON.stringify(record.published)) {
        record.published=live;
        const panel=document.querySelector(`[data-live="${record.id}"]`);
        panel.querySelector('.live-story').innerHTML=proseHTML(live.body);
        panel.querySelector('img').src='catalog-assets/'+live.image.split('/').pop();
        panel.querySelector('a').href=panel.querySelector('img').src;
      }
    }
    applyReviewFilters();
  } catch { /* The embedded verified snapshot remains available offline. */ }
}
window.addEventListener('focus',refreshPublishedCatalog);
applyRecordedDecisions(); applyFeedbackRevisions(); filterFromHash(); render();
refreshPublishedCatalog();

if (testMode) saveStatus.textContent = 'Test mode · choices are temporary'; else if (!canSave) saveStatus.textContent = 'Could not load saved choices';
