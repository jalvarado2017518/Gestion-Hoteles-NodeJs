const Habitacion = require('../models/habitacion.model')
const underscore = require('underscore')
const Hotel = require('../models/hoteles.model')

//agregar habitaciones
function agregarHabitacion(req, res) {
    var parametros = req.body
    var habitacionModel = new Habitacion()

    if (parametros.numeroDeHabitacion, parametros.precio) {
        Habitacion.findOne({ numeroDeHabitacion: parametros.numeroDeHabitacion }, (err, habitcacionEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (underscore.isEmpty(habitcacionEncontrada)) {
               // Hotel.findOne({ idAdmin: req.user.sub, nombre: { $regex: parametros.hotel, $options:'i'} }, (err, hotelEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" + err})
                    //if (!underscore.isEmpty(hotelEncontrado)) {
                        habitacionModel.numeroDeHabitacion = parametros.numeroDeHabitacion;
                        habitacionModel.disponible = parametros.disponible;
                        habitacionModel.precio = parametros.precio;
                        habitacionModel.idAdmin = req.user.sub;
                        habitacionModel.idHotel = parametros.idHotel;
                        if(parametros.descripcion) habitacionModel.descripcion=parametros.descripcion
                        habitacionModel.save((err, habitacionCreada) => {
                            return res.status(200).send({habitacion: habitacionCreada })
                        })
                    /*}else{
                        return res.status(500).send({ mensaje: "El hotel no exite, intente con otro" }) 
                    }*/
                //})
            } else {
                return res.status(500).send({ mensaje: "Esa habitacion ya existe, intente con otra" })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Por favor, llene todos los campos" })
    }
}

function editarHabitacion(req, res) {
    var parametros = req.body
    var idHabitacion = req.params.idHabitacion
    Habitacion.findByIdAndUpdate(idHabitacion, parametros, { new: true }, (err, habitacionEditada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEditada) return res.status(404).send({ mensaje: 'Error no se pudo editar la habitacion' });
        return res.status(200).send({ habitacion: habitacionEditada })
    })
}
 
function eliminarHabitacion(req, res) {
    var idHabitacion = req.params.idHabitacion;
    Habitacion.findByIdAndDelete(idHabitacion, (err, habitacionEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEliminada) return res.status(404).send({ mensaje: 'Error al eliminar la habitacion' });
        return res.status(200).send({habitacion: habitacionEliminada });
    })
}

//listar todas las habitaciones por hotel
function buscarHabitaciones(req, res) {
    Habitacion.find({idAdmin: req.user.sub},(err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionesEncontradas) return res.status(404).send({ mensaje: 'Error no se pudo obtener las habitaciones' });
        return res.status(200).send({ habitaciones: habitacionesEncontradas })
    })
}

/*function ObtenerHabitaciones (req, res) {
    var idHotel = req.params.idHotel;

    if (req.user.rol == "SuperAdmin" || req.user.rol == "Cliente") {
        Habitacion.find((err, habitacionesEncontradas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ habitaciones: habitacionesEncontradas })

    })
    }else{
        Habitacion.find(idHotel,(err, habitacionesObtenidas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ hoteles: hotelesObtenidos })
    
        })
    }
}*/

/*function ObtenerHabitaciones(req,res){
    Habitacion.find((err,habitacionesObtenidas)=>{
        if(err) return res.send({mensaje: "Error: " + err})

        return res.send({habitaciones: habitacionesObtenidas})
    })
}*/

function ObtenerHabitaciones (req, res) {
    if (req.user.rol == "SuperAdmin" || req.user.rol == "Cliente") {
        Habitacion.find((err,habitacionesObtenidas)=>{
            if(err) return res.send({mensaje: "Error: " + err})
    
            return res.send({habitaciones: habitacionesObtenidas})
        })
    }else{
        Habitacion.find({idAdmin: req.user.sub},(err, habitacionesObtenidas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ habitaciones: habitacionesObtenidas })
    
        })
    }
}

function ObtenerHabitacionesHoteles(req, res) {
    var idHote = req.params.idHotel;

    Habitacion.find({idHotel:idHote}, (err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionesEncontradas) return res.status(404).send( { mensaje: 'Error al obtener los datos' });
   
       
        return res.status(200).send({ habitaciones: habitacionesEncontradas });
    })
}

/*function ObtenerHabitacionesHoteles(req, res) {
    var idHote = req.params.idHotel;
    var parametros = req.body;

    Hotel.findOne(idHote, (err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!hotelEncontrado) return res.status(404).send( { mensaje: 'Error al obtener los datos1' });

        Habitacion.find(parametros._id, (err, habitacionesEncontradas) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!habitacionesEncontradas) return res.status(404).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({habitaciones: habitacionesEncontradas})
        })
    })
}*/


function habitacionDisponible(req, res) {
    let cont = 0;
    let parametros = req.body;
    if (parametros.nombre) {
        Hotel.findOne({ nombre: parametros.nombre }, (err, hotelEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (underscore.isEmpty(hotelEncontrado)) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });

            Habitacion.find({ idHotel: hotelEncontrado._id, disponible: true }, (err, habitacioDisponible) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!habitacioDisponible) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });
                habitacioDisponible.forEach(habitaciones => { habitaciones.nombre, cont++; })
                return res.status(200).send({ habitacion: cont })
            })
        })
    } else {
        return res.status(404).send({ mensaje: 'Ingresa todos los datos, Por favor' })
    }
}

function ObtenerHabitacionesId(req, res) {
    var idRoom = req.params.idHabitacion;

    Habitacion.findById(idRoom, (err, habitacionEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEncontrada) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ habitacion: habitacionEncontrada });
    })
}

module.exports = {
    agregarHabitacion,
    editarHabitacion,
    eliminarHabitacion,
    buscarHabitaciones,
    habitacionDisponible,
    ObtenerHabitaciones,
    ObtenerHabitacionesId,
    ObtenerHabitacionesHoteles
}