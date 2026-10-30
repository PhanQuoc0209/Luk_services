import test from 'node:test';
import assert from 'node:assert/strict';

// Business rule simulation for Review creation
function validateReviewSubmission({ orderStatus, existingReview, rating, comment }) {
  if (orderStatus !== 'COMPLETED') {
    throw new Error('ORDER_NOT_COMPLETED: Only completed orders can be reviewed');
  }

  if (existingReview) {
    throw new Error('DUPLICATE_REVIEW: Order already has a submitted review');
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error('INVALID_RATING: Rating must be between 1 and 5');
  }

  if (!comment || comment.trim().length < 5) {
    throw new Error('INVALID_COMMENT: Comment must have at least 5 characters');
  }

  return {
    valid: true,
    rating,
    comment: comment.trim(),
  };
}

// Business rule simulation for Guest Order Access with Tracking Token
function verifyOrderAccess({ user, order, providedToken }) {
  if (user && user.role === 'ADMIN') return true;
  if (user && order.userId && user.id === order.userId) return true;
  if (providedToken && providedToken === order.trackingToken) return true;
  throw new Error('ACCESS_DENIED: Invalid authorization or tracking token');
}

// Debate Library Filter logic
function filterDebateResources(resources, { q, topic, format, difficulty }) {
  return resources.filter((item) => {
    if (q) {
      const query = q.toLowerCase();
      const match =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.toLowerCase().includes(query);
      if (!match) return false;
    }
    if (topic && topic !== 'ALL' && item.topic !== topic) return false;
    if (format && format !== 'ALL' && item.format !== format) return false;
    if (difficulty && difficulty !== 'ALL' && item.difficulty !== difficulty) return false;
    return true;
  });
}

test('Reviews: Non-completed order cannot be reviewed', () => {
  assert.throws(
    () =>
      validateReviewSubmission({
        orderStatus: 'IN_PROGRESS',
        existingReview: null,
        rating: 5,
        comment: 'Dịch vụ rất tốt!',
      }),
    /ORDER_NOT_COMPLETED/,
    'Should throw error if order is not completed'
  );

  assert.throws(
    () =>
      validateReviewSubmission({
        orderStatus: 'QUOTED',
        existingReview: null,
        rating: 5,
        comment: 'Dịch vụ rất tốt!',
      }),
    /ORDER_NOT_COMPLETED/
  );
});

test('Reviews: Completed order allows review creation', () => {
  const result = validateReviewSubmission({
    orderStatus: 'COMPLETED',
    existingReview: null,
    rating: 5,
    comment: 'Slide được thiết kế rất tỉ mỉ và đúng hạn!',
  });
  assert.equal(result.valid, true);
  assert.equal(result.rating, 5);
});

test('Reviews: Duplicate review is strictly rejected', () => {
  assert.throws(
    () =>
      validateReviewSubmission({
        orderStatus: 'COMPLETED',
        existingReview: { id: 'rev_1', rating: 5, comment: 'Đã đánh giá' },
        rating: 4,
        comment: 'Đánh giá lần 2',
      }),
    /DUPLICATE_REVIEW/,
    'Should prevent multiple reviews on the same order'
  );
});

test('Reviews: Rating must be within range 1 to 5', () => {
  assert.throws(
    () =>
      validateReviewSubmission({
        orderStatus: 'COMPLETED',
        existingReview: null,
        rating: 6,
        comment: 'Quá xuất sắc!',
      }),
    /INVALID_RATING/
  );

  assert.throws(
    () =>
      validateReviewSubmission({
        orderStatus: 'COMPLETED',
        existingReview: null,
        rating: 0,
        comment: 'Không tốt',
      }),
    /INVALID_RATING/
  );
});

test('Guest Tracking: Unguessable tracking token grants access, invalid token denied', () => {
  const order = {
    id: 'ord_1',
    orderCode: 'LUK-2610-8888',
    trackingToken: 'cuid_secret_unguessable_token_xyz',
    userId: null,
  };

  // Valid token
  assert.equal(
    verifyOrderAccess({
      user: null,
      order,
      providedToken: 'cuid_secret_unguessable_token_xyz',
    }),
    true
  );

  // Invalid token
  assert.throws(
    () =>
      verifyOrderAccess({
        user: null,
        order,
        providedToken: 'wrong_guess_token',
      }),
    /ACCESS_DENIED/
  );

  // Admin always has access
  assert.equal(
    verifyOrderAccess({
      user: { id: 'adm_1', role: 'ADMIN' },
      order,
      providedToken: null,
    }),
    true
  );
});

test('Debate Hub: Search and filter by topic and format', () => {
  const mockDebateList = [
    {
      id: '1',
      title: 'Thuế Carbon Toàn Cầu',
      description: 'Phân tích cơ chế CBAM',
      topic: 'Môi trường & Phát triển bền vững',
      format: 'PDF Case File',
      difficulty: 'Trung cấp (Open)',
      tags: 'carbon, climate',
    },
    {
      id: '2',
      title: 'Quyền Dữ Liệu Cá Nhân',
      description: 'Đạo luật bảo vệ dữ liệu',
      topic: 'Công nghệ & AI',
      format: 'DOCX Brief',
      difficulty: 'Nâng cao (Championship)',
      tags: 'ai, data privacy',
    },
    {
      id: '3',
      title: 'Slide Masterclass AREL',
      description: 'Cấu trúc luận điểm tranh biện',
      topic: 'Xã hội & Đạo đức',
      format: 'Slide PPTX',
      difficulty: 'Cơ bản (Novice)',
      tags: 'arel, slide',
    },
  ];

  const searchResults = filterDebateResources(mockDebateList, { q: 'carbon' });
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, '1');

  const topicResults = filterDebateResources(mockDebateList, {
    topic: 'Công nghệ & AI',
  });
  assert.equal(topicResults.length, 1);
  assert.equal(topicResults[0].id, '2');

  const formatResults = filterDebateResources(mockDebateList, {
    format: 'Slide PPTX',
  });
  assert.equal(formatResults.length, 1);
  assert.equal(formatResults[0].id, '3');
});
