// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuariosRutas = require('./src/routes/usuarios.routes');

// MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', UsuariosRutas);
//app.use('/api', ProductosRutas, SucursalesRutas, ProductosSucursalesRutas);


module.exports = app;