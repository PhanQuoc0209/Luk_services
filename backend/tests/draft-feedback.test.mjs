import test from 'node:test';
import assert from 'node:assert/strict';

function processDraftUpload(order, draftData) {
  const version = (order.drafts?.length || 0) + 1;
  const draft = {
    id: `draft_${version}`,
    versionNumber: version,
    versionType: draftData.versionType,
    title: draftData.title,
    canDownload: Boolean(draftData.canDownload),
    isFinal: Boolean(draftData.isFinal || draftData.versionType === 'FINAL'),
    createdAt: new Date(),
  };

  order.drafts = order.drafts || [];
  order.drafts.push(draft);

  if (draft.isFinal) {
    order.status = 'COMPLETED';
  } else {
    order.status = 'DRAFT_DELIVERED';
  }

  return draft;
}

function processFeedback(order, feedbackData) {
  const feedback = {
    id: `fb_${Date.now()}`,
    content: feedbackData.content,
    revisionRequested: Boolean(feedbackData.revisionRequested),
    createdAt: new Date(),
  };

  order.feedbacks = order.feedbacks || [];
  order.feedbacks.push(feedback);

  if (feedback.revisionRequested && order.status !== 'COMPLETED') {
    order.status = 'REVISING';
  }

  return feedback;
}

test('Draft & Feedback: Uploading preliminary draft sets status to DRAFT_DELIVERED', () => {
  const order = { id: 'ord_1', status: 'IN_PROGRESS', drafts: [], feedbacks: [] };

  processDraftUpload(order, {
    versionType: 'DRAFT',
    title: 'Bản thảo slide v1',
    canDownload: true,
  });

  assert.equal(order.drafts.length, 1);
  assert.equal(order.drafts[0].versionNumber, 1);
  assert.equal(order.status, 'DRAFT_DELIVERED');
});

test('Draft & Feedback: Revision request moves order to REVISING', () => {
  const order = { id: 'ord_1', status: 'DRAFT_DELIVERED', drafts: [{ id: 'd_1' }], feedbacks: [] };

  processFeedback(order, {
    content: 'Cần đổi font chữ slide 3 sang Montserrat và thêm biểu đồ tròn',
    revisionRequested: true,
  });

  assert.equal(order.feedbacks.length, 1);
  assert.equal(order.status, 'REVISING');
});

test('Draft & Feedback: Only final version marks order as COMPLETED', () => {
  const order = { id: 'ord_1', status: 'REVISING', drafts: [{ id: 'd_1' }], feedbacks: [] };

  // Sending draft v2 without final flag does not complete
  processDraftUpload(order, {
    versionType: 'DRAFT',
    title: 'Bản thảo slide v2',
    isFinal: false,
  });
  assert.equal(order.status, 'DRAFT_DELIVERED');

  // Delivering final version marks order as COMPLETED
  processDraftUpload(order, {
    versionType: 'FINAL',
    title: 'Bản hoàn thiện chốt nộp',
    isFinal: true,
  });
  assert.equal(order.status, 'COMPLETED');
});
