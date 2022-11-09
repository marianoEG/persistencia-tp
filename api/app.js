var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var carrerasRouter = require("./routes/carreras");
var materiasRouter = require("./routes/materias"); //Agregado materias
var alumnosRouter = require("./routes/alumnos"); //Agregado alumnos
var profesoresRouter = require("./routes/profesores"); //Agregado profesores
var inscripcionesRouter = require("./routes/inscripciones"); //Agregado inscripciones

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/car", carrerasRouter);
app.use("/mat", materiasRouter); //Agregado materias
app.use("/alu", alumnosRouter); //Agregado alumnos
app.use("/prof", profesoresRouter); //Agregado profesores
app.use("/ins", inscripcionesRouter); //Agregado inscripciones
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
