var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  //PAGINACION
  //FORMATO localhost:3001/car?pagina=__&cantidad=__
  const pagina = Number.parseInt(req.query.pagina);
  const cantidad = Number.parseInt(req.query.cantidad);

  console.log(
    "Pagina número " + pagina + ", Cantidad de carreras por página " + cantidad
  );
  models.carrera
    .findAll({
      attributes: ["id", "nombre"],
      limit: cantidad,
      offset: pagina * cantidad,
    })
    .then((carreras) => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

// CARRERAS CON MATERIAS
router.get("/materias", (req, res) => {
  console.log("Carreras con materias");
  models.carrera
    .findAll({
      include: [
        {
          model: models.materia,
          as: "materias-de-carrera",
          attributes: ["nombre"],
        },
      ],
      attributes: ["id", "nombre"],
    })
    .then((carreras) => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  console.log("Ingreso de alumno");
  models.carrera
    .create({ nombre: req.body.nombre })
    .then((carrera) => res.status(201).send({ id: carrera.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otra carrera con el mismo nombre");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id },
      include: [
        {
          model: models.materia,
          as: "materias-de-carrera",
          attributes: ["nombre"],
        },
      ],
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  console.log("Busqueda de carrera por id");
  findCarrera(req.params.id, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  console.log("Actualizacion de carrera");
  const onSuccess = (carrera) =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res
            .status(400)
            .send("Bad request: existe otra carrera con el mismo nombre");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  console.log("Eliminacion de carrera");
  const onSuccess = (carrera) =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
