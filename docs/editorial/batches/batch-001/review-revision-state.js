// Archive only the exact feedback explicitly addressed by this content revision.
// A new version alone never means that every outstanding note was handled.
function feedbackRevisionPatch(record, revision, saved) {
  if (revision.toBodyHash !== record.bodyHash || (saved.appliedFeedbackRevisionIds || []).includes(revision.revisionId)) return {};
  const comments = Array.isArray(saved.comments) ? saved.comments : [];
  const addressed = comments.filter(comment => comment.bodyHash === revision.fromBodyHash && revision.comments.some(item =>
    item.id === comment.id && item.quote === comment.quote && item.text === comment.text));
  const notesMatch = Boolean(revision.notes) && saved.notes === revision.notes &&
    (!saved.notesBodyHash || saved.notesBodyHash === revision.fromBodyHash);
  const patch = {
    appliedFeedbackRevisionIds:[...(saved.appliedFeedbackRevisionIds || []), revision.revisionId],
    revisionHistory:[...(saved.revisionHistory || []), {
      revisionId:revision.revisionId, fromBodyHash:revision.fromBodyHash, toBodyHash:revision.toBodyHash,
      revisedOn:revision.revisedOn, summary:revision.summary,
      notes:notesMatch ? saved.notes : '', comments:addressed
    }]
  };
  if (notesMatch) { patch.notes = ''; patch.notesBodyHash = record.bodyHash; }
  if (addressed.length) patch.comments = comments.filter(comment => !addressed.includes(comment));
  return patch;
}
if (typeof module !== 'undefined' && module.exports) module.exports = {feedbackRevisionPatch};
