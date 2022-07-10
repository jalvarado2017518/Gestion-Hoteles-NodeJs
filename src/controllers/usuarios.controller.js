const Usuarios = require('../models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')


/*function UsuarioInicial() {
    Empresas.find({ rol: "SuperAdmin", usuario: "SuperAdmin" }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
          Empresas.create({
            usuario: "SuperAdmin",
            password: passwordEncriptada,
            rol: "SuperAdmin",
          });
        });
      }
    });
  }
  */
  


//Login
 function Login(req, res) {
    var parametros = req.body;
    Usuarios.findOne({ email: parametros.email }, (err, usuariosEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (usuariosEncontrado) {
             // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuariosEncontrado.password,
                (err, verificacionPassword) => {
                        // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if (verificacionPassword) {
                             // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuariosEncontrado) })
                        } else {
                            usuariosEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: usuariosEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: "La contraseña no coincide, intente de nuevo" });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: "El correo no existe, intente de nuevo" })
        }
    })
}
//Agregar Usuario
function agregarUsuario(req, res) {
    var parametros = req.body;
    var usuariosModel = new Usuarios();

    if (parametros.nombre && parametros.email && parametros.password) {
        usuariosModel.nombre = parametros.nombre;
        usuariosModel.apellido = parametros.apellido;
        usuariosModel.email = parametros.email;
        usuariosModel.password = parametros.password;
        
        usuariosModel.rol = 'Cliente';
        

        Usuarios.find({ email: parametros.email }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuariosModel.password = passwordEncriptada;

                    usuariosModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: "Error en la peticion" });
                        if (!usuarioGuardado) return res.status(500)
                            .send({ mensaje: "Error al agregar el usuario" });
                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: "Este correo ya existe" });
            }
        })
    }
}

//Editar Empresa
/*function editarEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var parametros = req.body;

    if (req.user.rol == 'Empresa') {
        if (parametros.rol) {
            return res.status(500).send({ message: "No eres Admin no puedes editar" })
        } else {
            Empresas.findByIdAndUpdate({ _id: req.user.sub }, parametros, { new: true }, (err, empresaActualizada) => {
                if (err) return res.status(500).send({ message: "Error en la peticion" });
                if (!empresaActualizada) return res.status(404).send({ message: "Error en la petición" });

                return res.status(200).send({ empresa: empresaActualizada });
            });
        }
    } else {
        Empresas.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!empresaEncontrada) return res.status(500).send({ message: "Error en la petición" });
                
            if (empresaEncontrada.rol == 'Empresa') {
                Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                    if (err) return res.status(500).send({ message: "Error en la peticion" });
                    if (!empresaActualizada) return res.status(404).send({ message: "Error no puedes editar" });

                    return res.status(200).send({ empresa: empresaActualizada });
                });
            } else {
                if (idEmpresa == req.user.sub) {
                    if (!parametros.rol) {
                        Empresas.findByIdAndUpdate({ _id: idEmpresa }, parametros, { new: true }, (err, empresaActualizada) => {
                            if (err) return res.status(500).send({ message: "Error en la peticion" });
                            if (!empresaActualizada) return res.status(404).send({ message: "Error, no puedes editar" });

                            return res.status(200).send({ empresa: empresaActualizada });
                        });
                    } else {
                        return res.status(500).send({ mensaje: "No puedes editar el Rol" })
                    }
                } else {
                    return res.status(500).send({ mensaje: "No puedes editar esta empresa, intenta de nuevo" });
                }
            }
        })

    }

}*/

function editarUsuario (req, res) {
    var idUser = req.params.idEmpresa;
    var parametros = req.body;

    Usuarios.findByIdAndUpdate(req.user.sub, parametros, { new: true } ,(err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send( { mensaje: 'Error al Editar el usuario'});

        return res.status(200).send({ usuario: usuarioActualizado});
    });
}

function editarUsuarioAdmin (req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    //if(idEmpr !== req.user.sub) return res.status(500).send({mensaje: 'No puede editar otras Empresas'});

    Usuarios.findByIdAndUpdate(idUser, parametros, { new: true } ,(err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(404).send( { mensaje: 'Error al Editar la empresa'});

        return res.status(200).send({ usuario: usuarioActualizado});
    });
}

//Eliminar
function eliminarUsuario(req, res) {
    var idUser = req.params.idUsuario;

    Usuarios.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!usuarioEliminado) return res.status(500).send({ mensaje: "Error al eliminar este usuario, intenta de nuevo" });
        return res.status(200).send({ usuario: usuarioEliminado });
    })
}

function ObtenerUsuarios(req,res){
    Usuarios.find((err,usuariosObtenidos)=>{
        if(err) return res.send({mensaje: "Error: " + err})

        return res.send({usuarios: usuariosObtenidos})
    })
}

function ObtenerUsuarioId(req, res) {
    var idUser = req.params.idUsuario;

    Usuarios.findById(idUser, (err, usuarioEcontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEcontrado) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ usuario: usuarioEcontrado });
    })
}



module.exports = {
    //UsuarioInicial,
    Login,
    agregarUsuario,
    editarUsuario,
    ObtenerUsuarios,
    ObtenerUsuarioId,
    eliminarUsuario,
    editarUsuarioAdmin
}
