var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  //PAGINACION
  //FORMATO localhost:3001/mat?pagina=__&cantidad=__
  const pagina = Number.parseInt(req.query.pagina);
  const cantidad = Number.parseInt(req.query.cantidad);

  console.log(
    "Pagina número " + pagina + ", Cantidad de materias por página " + cantidad
  );
  models.materia
    .findAll({
      attributes: ["id", "nombre", "id_carrera", "id_profesor"],
      limit: cantidad,
      offset: pagina * cantidad,
    })
    .then((materias) => res.send(materias))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  console.log("Ingreso de materia");
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then((materia) => res.status(201).send({ id: materia.id }))
    .catch((error) => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res
          .status(400)
          .send("Bad request: existe otra materia con el mismo nombre");
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre", "id_carrera", "id_profesor"],
      where: { id },
      include: [
        {
          model: models.inscripciones,
          as: "inscripciones",
          attributes: ["id_alumno"],
        },
      ],
    })
    .then((materia) => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  console.log("Busqueda de materia por id");
  findMateria(req.params.id, {
    onSuccess: (materia) => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.put("/:id", (req, res) => {
  console.log("Actualizacion de materia");
  const onSuccess = (materia) =>
    materia
      .update(
        {
          nombre: req.body.nombre,
          id_carrera: req.body.id_carrera,
          id_profesor: req.body.id_profesor,
        },
        { fields: ["nombre", "id_carrera", "id_profesor"] }
      )
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res
            .status(400)
            .send("Bad request: existe otra materia con el mismo nombre");
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`
          );
          res.sendStatus(500);
        }
      });
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

router.delete("/:id", (req, res) => {
  console.log("Eliminacion de materia");
  const onSuccess = (materia) =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;
