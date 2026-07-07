const express = require('express');
const router = express.Router();
const { getTasks, createTask, approveTask, rejectTask } = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', createTask);
router.post('/:id/approve', approveTask);
router.post('/:id/reject', rejectTask);

module.exports = router;
