const mongoose = require('mongoose');
const app = require('./app');
const Usuario = require('./src/models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('./src/services/jwt');

//Importacion de variables de entorno
require('dotenv').config();
//console.log(process.env)

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_CONNECT , {
     useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    app.listen(process.env.PORT || 3000, function () {
        console.log("Hola IN6BM!");
        console.log("La base de datos esta corriendo en el puerto 3000!");
        Usuario.find({ nombre: 'SuperAdmin' }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado == 0) {

                bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                    Usuario.create({
                        nombre: 'SuperAdmin',
                        email: 'admin@gmail.com',
                        rol: 'SuperAdmin',
                        password: passwordEncriptada
                       
                    })

                });
            } else {

            }

        })
    })


}).catch(error => console.log(error))