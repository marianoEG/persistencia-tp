var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  //PAGINACION
  //FORMATO localhost:3001/alu?pagina=__&cantidad=__
  const pagina = Number.parseInt(req.query.pagina);
  const cantidad = Number.parseInt(req.query.cantidad);

  console.log("Pagina número " + pagina + ", Cantidad de alumnos por página " +  cantidad);
  models.alumno
    .findAll({
      attributes: ["id", "nombre", "dni"],
      limit: cantidad,
      offset: pagina * cantidad,
    })
    .then((alumnos) => res.send(alumnos))
    .catch(() => res.sendStatus(500));
});

// ALUMNOS CON INSCRIPCIONES
router.get("/inscripciones", (req, res) => {
  console.log("Esto es un mensaje para ver en consola");
  models.alumno
    .findAll({
      attributes: ["id", "nombre", "dni"],
      include: [
        {
          model: models.inscripciones,
          as: "inscripciones-de-alumno",
          attributes: ["fecha", "id_materia"],
        },
      ],
    })
    .then((alumnos) => res.send(alumnos))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.alumno
    .create({ nombre: req.body.nombre, dni: req.body.dni })
    .then((alumno) => res.status(201).send({ id: alumno.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otro alumno con el mismo dni");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre", "dni"],
      where: { id },
      include: [
        {
          model: models.inscripciones,
          as: "inscripciones-de-alumno",
          attributes: ["fecha", "id_materia"],
        },
      ],
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: (alumno) => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .update(
        { nombre: req.body.nombre, dni: req.body.dni },
        { fields: ["nombre", "dni"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res
            .status(400)
            .send("Bad request: existe otro alumno con el mismo dni");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = (alumno) =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
