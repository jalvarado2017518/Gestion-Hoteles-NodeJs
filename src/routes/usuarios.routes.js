const express = require('express');
const usuarioControlador = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');


const api = express.Router();

api.post('/login', usuarioControlador.Login);
api.get('/usuarios',md_autenticacion.Auth, usuarioControlador.ObtenerUsuarios);
api.get('/usuarios/:idUsuario', usuarioControlador.ObtenerUsuarioId);
api.post('/agregarUsuarios', usuarioControlador.agregarUsuario);
api.put('/editarUsuario/:idUsuario',md_autenticacion.Auth, usuarioControlador.editarUsuario);

api.put('/editarUsuarioAdmin/:idUsuario', usuarioControlador.editarUsuarioAdmin);
api.delete('/eliminarUsuario/:idUsuario',  usuarioControlador.eliminarUsuario);
//api.put('/editarEmpresaAdmin/:idEmpresa',  empresaControlador.editarEmpresaAdmin);

module.exports = api;

