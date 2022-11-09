var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  //PAGINACION
  //FORMATO localhost:3001/ins?pagina=__&cantidad=__
  const pagina = Number.parseInt(req.query.pagina);
  const cantidad = Number.parseInt(req.query.cantidad);

  console.log("Esto es un mensaje para ver en consola");
  models.inscripciones
    .findAll({
      attributes: ["id", "fecha", "id_alumno", "id_materia"],
      limit: cantidad,
      offset: pagina * cantidad,
    })
    .then((inscripciones) => res.send(inscripciones))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.inscripciones
    .create({
      fecha: req.body.fecha,
      id_alumno: req.body.id_alumno,
      id_materia: req.body.id_materia,
    })
    .then((inscripciones) => res.status(201).send({ id: inscripciones.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send("Bad request:");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findInscripcion = (id, { onSuccess, onNotFound, onError }) => {
  models.inscripciones
    .findOne({
      attributes: ["id", "fecha", "id_alumno", "id_materia"],
      where: { id },
    })
    .then((inscripciones) =>
      inscripciones ? onSuccess(inscripciones) : onNotFound()
    )
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findInscripcion(req.params.id, {
    onSuccess: (inscripciones) => res.send(inscripciones),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = (inscripciones) =>
    inscripciones
      .update(
        {
          fecha: req.body.fecha,
          id_alumno: req.body.id_alumno,
          id_materia: req.body.id_materia,
        },
        { fields: ["fecha", "id_alumno", "id_materia"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send("Bad request:");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = (inscripciones) =>
    inscripciones
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findInscripcion(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
