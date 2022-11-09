"use strict";
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define(
    "alumno",
    {
      nombre: DataTypes.STRING,
      dni: DataTypes.STRING,
    },
    {}
  );
  alumno.associate = function (models) {
    alumno.hasMany(models.inscripciones, {
      as: "inscripciones-de-alumno",
      foreignKey: "id_alumno",
    });
    // associations can be defined here
  };
  return alumno;
};
