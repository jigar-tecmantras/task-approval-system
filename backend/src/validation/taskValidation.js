const VALID_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

const validateTaskPayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return 'Payload is required';
  }
  const title = payload.title?.trim();
  const description = payload.description?.trim();
  if (!title) {
    return 'Title is required';
  }
  if (!description) {
    return 'Description is required';
  }
  if (title.length > 150) {
    return 'Title cannot exceed 150 characters';
  }
  if (description.length > 1000) {
    return 'Description cannot exceed 1000 characters';
  }
  return null;
};

const validateRejectPayload = (comment) => {
  const trimmed = comment?.trim();
  if (!trimmed) {
    return 'Reviewer comment is required when rejecting a task';
  }
  if (trimmed.length < 5) {
    return 'Reviewer comment must include at least 5 characters';
  }
  return null;
};

module.exports = { VALID_STATUSES, validateTaskPayload, validateRejectPayload };
