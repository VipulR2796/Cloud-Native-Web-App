const express = require('express');
const assignmentController = require( '../controllers/assignmentController');
const authMiddleware = require( '../middleware/authMiddleware');

const router = express.Router();

router.route('/:id')
    .get(authMiddleware, assignmentController.getAssignmentById)
    .put(authMiddleware, assignmentController.updateAssignmentById)
    .delete(authMiddleware, assignmentController.deleteAssignmentById);
router.route('/')
    .post(authMiddleware, assignmentController.createAssignment)
    .get(authMiddleware, assignmentController.getAssignments);

module.exports = router;