'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      
      Submission.belongsTo(models.Assignment, {
        foreignKey: 'assignment_id',
        targetKey: 'id',
      });

      Submission.belongsTo(models.User, {
        foreignKey: 'created_by',
        targetKey: 'id',
      });
    }
  }

  Submission.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    assignment_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Assignments',
        key: 'id',
      },
    },
    submission_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    submission_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    submission_updated: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Submission',
    timestamps: false,
  });

  return Submission;
};
