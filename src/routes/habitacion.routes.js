const express = require('express');
const habitacionController = require('../controllers/habitacion.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarHabitacion', md_autenticacion.Auth, habitacionController.agregarHabitacion);
api.put('/editarHabitacion/:idHabitacion', habitacionController.editarHabitacion);
api.delete('/eliminarHabitacion/:idHabitacion', habitacionController.eliminarHabitacion);
api.get('/buscarHabitaciones', md_autenticacion.Auth, habitacionController.buscarHabitaciones);
api.post('/buscarHotelDisponible', habitacionController.habitacionDisponible);
//api.get('/buscarHabitaciones', md_autenticacion.Auth, habitacionController.buscarHabitaciones);
api.get('/habitaciones', md_autenticacion.Auth, habitacionController.ObtenerHabitaciones);
api.get('/habitaciones/:idHabitacion', habitacionController.ObtenerHabitacionesId);
api.get('/habitacionesHotel/:idHotel', habitacionController.ObtenerHabitacionesHoteles);

module.exports = api;