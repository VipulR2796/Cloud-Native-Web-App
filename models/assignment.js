
'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
      class Assignment extends Model {
        static associate(models) {
          Assignment.belongsTo(models.User, {
            foreignKey: 'created_by',
            targetKey: 'id',
          });
        }
      }
      Assignment.init({
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
          unique: true
        },
        title: Sequelize.STRING,
        points: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1,
            max: 10
          }
        },
        num_of_attempts: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1,
            max: 3
          }
        },
        deadline: Sequelize.DATE,
        created_by: {
          type: Sequelize.UUID, 
          references: {
            model: 'Users', 
            key: 'id'      
          }
        },
        assignment_created: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        assignment_updated: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      }, {
        sequelize,
        modelName: 'Assignment',
        timestamps: false
      });
    
      return Assignment;
    };