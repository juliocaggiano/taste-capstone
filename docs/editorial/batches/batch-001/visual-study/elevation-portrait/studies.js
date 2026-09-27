const visualStudyRecords = JSON.parse(document.getElementById('visual-studies-data').textContent);
const visualStudyKey = 'taste-batch-001-visual-directions-v1';
let visualStudyState = {};
let visualStudyDirty = {};
const visualStudyStatus = document.getElementById('study-save-status');
function mergeVisualStudyDirty(saved) {
  const merged = {...saved};
  for (const [medium, patch] of Object.entries(visualStudyDirty)) merged[medium] = {...merged[medium], ...patch};
  return merged;
}
function readVisualStudyState() {
  if (testMode) return visualStudyState;
  try { return mergeVisualStudyDirty(JSON.parse(localStorage.getItem(visualStudyKey) || '{}')); }
  catch { return mergeVisualStudyDirty(visualStudyState); }
}
visualStudyState = readVisualStudyState();
function exportVisualStudyFeedback() {
  return Object.entries(visualStudyRecords).map(([medium, record]) => {
    const saved = visualStudyState[medium] || {};
    const chosen = saved.fingerprint === record.fingerprint ? record.options.find(o => o.id === saved.choice) || null : null;
    return {medium, artForm:record.medium || medium, round:record.round || 1, fingerprint:record.fingerprint, preferredImage:chosen, notes:saved.notes || '', status:'visual_experiment_only'};
  });
}
function renderVisualStudyState() {
  for (const result of exportVisualStudyFeedback()) {
    document.querySelectorAll(`[data-study-choice="${result.medium}"]`).forEach(input => {
      input.checked = input.value === result.preferredImage?.id;
      input.closest('.study-card').classList.toggle('selected', input.checked);
    });
    const notes = document.querySelector(`[data-study-notes="${result.medium}"]`);
    if (notes && document.activeElement !== notes) notes.value = result.notes;
  }
}
function updateVisualStudy(medium, patch) {
  visualStudyState = readVisualStudyState();
  const changedFields = {...patch, updatedAt:new Date().toISOString()};
  visualStudyState[medium] = {...visualStudyState[medium], ...changedFields};
  if (testMode) visualStudyStatus.textContent = 'Test mode · visual feedback is temporary';
  else {
    visualStudyDirty[medium] = {...visualStudyDirty[medium], ...changedFields};
    try { localStorage.setItem(visualStudyKey, JSON.stringify(visualStudyState)); visualStudyDirty = {}; visualStudyStatus.textContent = 'Visual feedback saved in this browser'; }
    catch { visualStudyStatus.textContent = 'Could not save · export your review to keep this feedback'; }
  }
  renderVisualStudyState();
}
document.querySelectorAll('[data-study-choice]').forEach(input => input.addEventListener('change', () => updateVisualStudy(input.dataset.studyChoice, {choice:input.value, fingerprint:visualStudyRecords[input.dataset.studyChoice].fingerprint})));
document.querySelectorAll('[data-study-notes]').forEach(input => input.addEventListener('input', () => updateVisualStudy(input.dataset.studyNotes, {notes:input.value})));
function openVisualStudy(button, original = false) {
  const [medium, id] = (original ? button.dataset.studyOriginal : button.dataset.studyPreview).split(':');
  const option = visualStudyRecords[medium].options.find(o => o.id === id);
  currentPreview = null;
  document.getElementById('viewer-title').textContent = `${option.title} · ${original ? 'Original source' : `Visual study ${option.label}`}`;
  document.getElementById('viewer-description').textContent = original ? 'Original source used for this treatment.' : option.description;
  document.getElementById('original-image').href = original ? option.originalImageUrl : option.imageUrl;
  document.getElementById('choose-from-viewer').hidden = true;
  const frame = document.getElementById('viewer-image'); frame.replaceChildren(); frame.dataset.medium = 'study';
  const image = button.querySelector('img').cloneNode(true); image.removeAttribute('loading'); image.removeAttribute('style'); frame.append(image);
  viewer.showModal(); document.body.classList.add('viewer-open');
}
document.querySelectorAll('[data-study-preview]').forEach(button => button.addEventListener('click', () => openVisualStudy(button)));
document.querySelectorAll('[data-study-original]').forEach(button => button.addEventListener('click', () => openVisualStudy(button, true)));
window.addEventListener('storage', event => { if (!testMode && event.key === visualStudyKey) { visualStudyState = readVisualStudyState(); renderVisualStudyState(); } });
renderVisualStudyState();
if (testMode) visualStudyStatus.textContent = 'Test mode · visual feedback is temporary';
