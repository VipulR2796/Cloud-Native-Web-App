const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const models = require('../models');
// const disallowBody = require('../middleware/middlewares');

const createAssignment = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('user : ', req.user);
    const { name, points, num_of_attempts, deadline } = req.body;
    const createdByUser = req.user;

    if(createdByUser == false){
        return res.sendStatus(401);
    }
    // Validate points within acceptable range
    if (points < 1 || points > 10) {
      return res.status(400).json({ error: 'Points must be between 1 and 10' });
    }

    // Create assignment
    const assignment = await models.Assignment.create({
      name,
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
  
    try {
      const assignment = await models.Assignment.findOne({
        where: { id },
      });
      
    //   const currUser = req.user.id;
    //   const assignmentOwner = assignment.created_by;
    //   if(currUser != assignmentOwner){
    //     return res.sendStatus(403);
    //   }
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
      const { name, points, num_of_attempts, deadline } = req.body;
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
  
      // Update the assignment
      await assignment.update({
        name,
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
