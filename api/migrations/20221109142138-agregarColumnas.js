"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("materia", "id_profesor", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("inscripciones", "id_materia", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("inscripciones", "id_alumno", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("materia", "id_profesor"),
      queryInterface.removeColumn("inscripciones", "id_materia"),
      queryInterface.removeColumn("inscripciones", "id_alumno"),
    ]);
  },
};
