const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const models = require('../models');
// const disallowBody = require('../middleware/middlewares');


const validateAssignment = (req) => {
  const { title, points, num_of_attempts, deadline } = req.body;
  
  // Check for unexpected keys
  const expectedKeys = ['title', 'points', 'num_of_attempts', 'deadline'];
  const receivedKeys = Object.keys(req.body);
  const unexpectedKeys = receivedKeys.filter(key => !expectedKeys.includes(key));

  if (unexpectedKeys.length > 0) {
    return { error: `Bad Request: Unexpected keys found: ${unexpectedKeys.join(', ')}` };
  }

  // Validation: Request body should have only 4 keys
  const allKeysValid = Object.keys(req.body).every(key => expectedKeys.includes(key));
  if (!allKeysValid) {
    return { error: 'Bad Request: Invalid keys in request body' };
  }

  // Convert deadline to Date object
  const deadlineDate = new Date(deadline);

  // Validation: Data types
  if (typeof title !== 'string' || typeof points !== 'number' || typeof num_of_attempts !== 'number' || !(deadlineDate instanceof Date)) {
    return { error: 'Bad Request: Invalid data types in request body' };
  }

  // Validation: Points within acceptable range
  if (points < 1 || points > 10) {
    return { error: 'Points must be between 1 and 10' };
  }

  //Validation: Attempts within acceptable range
  if (num_of_attempts < 1 || num_of_attempts > 3) {
    return { error: 'Attempts must be between 1 and 3' };
  }

  // Check if deadline is in the past
  const currentDate = new Date();
  if (deadlineDate < currentDate) {
    return { error: 'Bad Request: Deadline must be in the future' };
  }

  // If all validations pass, return null (no error)
  return null;
};

const createAssignment = async (req, res) => {
  try {
    // console.log('Request Body:', req.body);
    // console.log('user : ', req.user);
    
    const validationError = validateAssignment(req);

    if (validationError) {
      return res.status(400).json(validationError);
    }
    const { title, points, num_of_attempts, deadline } = req.body;

    const createdByUser = req.user;

    if(createdByUser == false){
        return res.sendStatus(401);
    }
    // Create assignment
    const assignment = await models.Assignment.create({
      title,
      points,
      num_of_attempts,
      deadline,
      created_by : createdByUser.id,
      assignment_created: new Date(),
      assignment_updated: new Date(),
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAssignments = async (req, res) => {
  if(req.headers['content-length']){
    return res.status(400).send();
  }  
  try {
      
        const assignments = await models.Assignment.findAll();
        return res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  

const getAssignmentById = async (req, res) => {
    const { id } = req.params;
    if(req.headers['content-length']){
      return res.status(400).send();
    }
    try {
      const assignment = await models.Assignment.findOne({
        where: { id },
      });
      
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      return res.json(assignment);
    } catch (error) {
      console.error(`Error fetching assignment with id ${id}:`, error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const updateAssignmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, points, num_of_attempts, deadline } = req.body;
      const user_id = req.user.id;
  
      // Check if the assignment exists
      const assignment = await models.Assignment.findOne({ where: { id } });
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      // Check if the user is authorized to update the assignment
      if (assignment.created_by !== user_id) {
        return res.status(403).json({ error: 'Forbidden: You are not authorized to update this assignment' });
      }

    const validationError = validateAssignment(req);

    if (validationError) {
      return res.status(400).json(validationError);
    }
  
      // Update the assignment
      await assignment.update({
        title,
        points,
        num_of_attempts,
        deadline,
        assignment_updated: new Date(),
      });
  
      return res.json({ message: 'Assignment updated successfully' });
    } catch (error) {
      console.error(`Error updating assignment with id ${id}:`, error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const deleteAssignmentById = async (req, res) => {
    if(req.headers['content-length']){
      return res.status(400).send();
    }
    try {
      const { id } = req.params;
      const user_id = req.user.id;
  
      // Check if the assignment exists
      const assignment = await models.Assignment.findOne({ where: { id } });
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
  
      // Check if the user is authorized to delete the assignment
      if (assignment.created_by !== user_id) {
        return res.status(403).json({ error: 'Forbidden: You are not authorized to delete this assignment' });
      }
  
      // Delete the assignment
      await assignment.destroy();
  
      return res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      console.error(`Error deleting assignment with id ${id}:`, error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignmentById,
    deleteAssignmentById
};