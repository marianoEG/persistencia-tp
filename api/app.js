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

//Login con JWT

const jwt = require('jsonwebtoken');

const keys = require('./settings/keys');
const { decode } = require("punycode");

app.set('key', keys.key);
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/', (req,res)=>{
  res.send('HOLA MUNDO')
})

app.post('/login', (req,res)=>{
  if(req.body.usuario == 'admin' && req.body.pass == '12345'){
    const payload = {
      check:true
    };
    const token = jwt.sign(payload, app.get('key'),{
      expiresIn:'7d'
    });
    res.json({
      message:'¡AUTENTICACIÓN EXITOSA!',
      token: token
    });
  }else{
    res.json({
      message:'Usuario y/o password son incorrectos'
    })
  }
});

const verificacion = express.Router();

verificacion.use((req, res, next)=>{
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  //console.log(token);
  if(!token){
    res.status(401).send({
      error: 'Es necesario un token de autenticación'
    })
    return
  }
  if(token.startsWith('Bearer ')){
    token = token.slice(7, token.length);
    console.log(token);
  }
  if(token){
    jwt.verify(token, app.get('key'), (error, decoded)=>{
      if(error){
        return res.json({
          message:'El token no es válido'
        });
      }else{
        req.decoded = decoded;
        next();
      }
    })
  }

});

app.get('/info', verificacion, (req,res)=>{
  res.json('INFORMACIÓN IMPORTANTE ENTREGADA');
})


//app.listen(3001, ()=>{
//  console.log('Servidor UP en http://localhost:3000');
// })

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
