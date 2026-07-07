const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  approveTask,
  rejectTask,
  blockTask
} = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', createTask);
router.post('/:id/approve', approveTask);
router.post('/:id/reject', rejectTask);
router.post('/:id/block', blockTask);

module.exports = router;
