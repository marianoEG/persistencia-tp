"use strict";
module.exports = (sequelize, DataTypes) => {
  const inscripciones = sequelize.define(
    "inscripciones",
    {
      fecha: DataTypes.STRING,
      id_materia: DataTypes.INTEGER,
      id_alumno: DataTypes.INTEGER,
    },
    {}
  );
  inscripciones.associate = function (models) {
    inscripciones.belongsTo(models.materia, {
      as: "Materia-Relacionada",
      foreignKey: "id_materia",
    });

    inscripciones.belongsTo(models.alumno, {
      as: "Alumno-Relacionado",
      foreignKey: "id_alumno",
    });
    // associations can be defined here
  };
  return inscripciones;
};
