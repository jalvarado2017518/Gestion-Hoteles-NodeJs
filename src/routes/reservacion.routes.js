const express = require('express');
const reservacionesController = require('../controllers/reservaciones.controller');
const md_autentificacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/agregarReservacion', md_autentificacion.Auth, reservacionesController.agregarReservacion);
api.get("/reservaciones-hotel/:idHotel", md_autentificacion.Auth,reservacionesController.obtenerReservacionHotel);
api.get("/reservaciones-usuario", md_autentificacion.Auth,reservacionesController.obtenerReservacionesUsuario);
api.put('/editarReservacion/:idReservacion', reservacionesController.editarReservacion)
api.delete('/eliminarReservacion/:idReservacion', reservacionesController.eliminarReservacion);
api.get('/reservaciones/:idReservacion', reservacionesController.ObtenerReservacionesId);
api.get('/reservaciones',md_autentificacion.Auth, reservacionesController.ObtenerReservaciones)
api.post('/generarFactura', md_autentificacion.Auth,reservacionesController.generarFactura);
api.get('/facturas',md_autentificacion.Auth, reservacionesController.ObtenerFacturas)


 
module.exports = api;