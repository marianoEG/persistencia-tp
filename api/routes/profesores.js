var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  //PAGINACION
  //FORMATO localhost:3001/prof?pagina=__&cantidad=__
  const pagina = Number.parseInt(req.query.pagina);
  const cantidad = Number.parseInt(req.query.cantidad);

  console.log(
    "Pagina número " +
      pagina +
      ", Cantidad de profesores por página " +
      cantidad
  );
  models.profesor
    .findAll({
      attributes: ["id", "nombre", "dni"],
      limit: cantidad,
      offset: pagina * cantidad,
    })
    .then((profesor) => res.send(profesor))
    .catch(() => res.sendStatus(500));
});

// PROFESORES CON MATERIAS
router.get("/materias", (req, res) => {
  console.log("Profesores con materias");
  models.profesor
    .findAll({
      attributes: ["id", "nombre", "dni"],
      include: [
        {
          model: models.materia,
          as: "materias-de-profesor",
          attributes: ["nombre"],
        },
      ],
    })
    .then((profesor) => res.send(profesor))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  console.log("Ingreso de profesor");
  models.profesor
    .create({ nombre: req.body.nombre, dni: req.body.dni })
    .then((profesor) => res.status(201).send({ id: profesor.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otro profesor con el mismo dni");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ["id", "nombre", "dni"],
      where: { id },
      include: [
        {
          model: models.materia,
          as: "materias-de-profesor",
          attributes: ["nombre"],
        },
      ],
    })
    .then((profesor) => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  console.log("Busqueda de profesor por id");
  findProfesor(req.params.id, {
    onSuccess: (profesor) => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  console.log("Actualizacion de profesor");
  const onSuccess = (profesor) =>
    profesor
      .update(
        { nombre: req.body.nombre, dni: req.body.dni },
        { fields: ["nombre", "dni"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res
            .status(400)
            .send("Bad request: existe otro profesor con el mismo dni");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  console.log("Eliminacion de profesor");
  const onSuccess = (profesor) =>
    profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
