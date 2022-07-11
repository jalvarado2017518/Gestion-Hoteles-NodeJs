const express = require('express');
const EventoController = require('../controllers/eventos.controller');
const md_autenticacion = require('../middlewares/autenticacion');



const api = express.Router();

api.post('/agregarEvento', md_autenticacion.Auth,EventoController.agregarEvento);
api.put('/editarEvento/:idEvento', EventoController.editarEvento);
api.delete('/eliminarEvento/:idEvento',  EventoController.eliminarEvento);
api.get('/eventos',md_autenticacion.Auth, EventoController.obtenerEventos);
api.get('/eventos/:idEvento', EventoController.ObtenerEventosId);
api.get('/eventosHotel/:idHotel', EventoController.ObtenerEventosHoteles);

module.exports = api;