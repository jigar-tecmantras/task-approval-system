const prisma = require('../prisma/client');
const {
  VALID_STATUSES,
  validateTaskPayload,
  validateRejectPayload,
  validateBlockPayload
} = require('../validation/taskValidation');

const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const ensurePending = (task, next, action) => {
  if (task.status !== 'PENDING') {
    next(createError(409, `Cannot ${action} a task that is currently ${task.status.toLowerCase()}.`));
    return false;
  }
  return true;
};

const getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const normalizedStatus = status ? status.toUpperCase() : undefined;
    if (normalizedStatus && !VALID_STATUSES.includes(normalizedStatus)) {
      return next(createError(400, 'Invalid status filter provided'));
    }
    const tasks = await prisma.task.findMany({
      where: normalizedStatus ? { status: normalizedStatus } : {},
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const validation = validateTaskPayload(req.body);
    if (validation) {
      return next(createError(400, validation));
    }
    const { title, description } = req.body;
    const task = await prisma.task.create({
      data: { title: title.trim(), description: description.trim() }
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const approveTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    if (!ensurePending(task, next, 'approve')) {
      return;
    }
    const payload = { status: 'APPROVED' };
    if (req.body.comment && req.body.comment.trim()) {
      payload.reviewerComment = req.body.comment.trim();
    }
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: payload
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const rejectTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    if (!ensurePending(task, next, 'reject')) {
      return;
    }
    const validation = validateRejectPayload(req.body.comment);
    if (validation) {
      return next(createError(400, validation));
    }
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { status: 'REJECTED', reviewerComment: req.body.comment.trim() }
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const blockTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: Number(id) } });
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    if (!ensurePending(task, next, 'block')) {
      return;
    }
    const validation = validateBlockPayload(req.body.comment);
    if (validation) {
      return next(createError(400, validation));
    }
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { status: 'BLOCKED', blockerComment: req.body.comment.trim() }
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, approveTask, rejectTask, blockTask };
