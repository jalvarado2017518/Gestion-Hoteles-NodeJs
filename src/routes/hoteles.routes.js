const express = require('express');
const hotelController = require('../controllers/hoteles.controller');
const md_autenticacion = require('../middlewares/autenticacion');



const api = express.Router();

api.post('/agregarHotel', md_autenticacion.Auth, hotelController.agregarHotel)
api.put('/editarHotel/:idHotel', hotelController.editarHotel)
api.delete('/eliminarHotel/:idHotel', hotelController.eliminarHotel)
api.get('/hoteles',md_autenticacion.Auth, hotelController.ObtenerHoteles)
api.post('/buscarHotelPorPais', md_autenticacion.Auth, hotelController.buscarHotelesPais)
api.get('/hoteles/:idHotel', hotelController.ObtenerHotelesId);

module.exports = api;