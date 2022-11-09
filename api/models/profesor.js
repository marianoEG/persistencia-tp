"use strict";
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define(
    "profesor",
    {
      nombre: DataTypes.STRING,
      dni: DataTypes.STRING,
    },
    {}
  );
  profesor.associate = function (models) {
    profesor.hasMany(models.materia, {
      as: "materias-de-profesor",
      foreignKey: "id_profesor",
    });
    // associations can be defined here
  };
  return profesor;
};
