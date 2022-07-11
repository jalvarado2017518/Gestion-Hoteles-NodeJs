const Reservaciones = require('../models/reservacion.model');
const Hoteles = require('../models/hoteles.model');
const Factura = require('../models/factura.model');

function obtenerReservacionHotel(req, res) {
    var idHotel = req.params.idHotel;

    if (req.user.rol == 'Usuario') return res.status(500).send({message: 'No tienes acceso a esta información'});

    Hoteles.find({_id: idHotel, idUsuario: req.user.rol}, (err, hotelesEncontradas) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!hotelesEncontradas) return res.status(404).send({message: 'No perteneces a este hotel'});

        Reservaciones.find({ idHotel: idHotel }, (err, reservacionesEncontradas) => {
            if (err) return res.status(500).send({message: 'Error en la peticion'});
            if (!reservacionesEncontradas) return res.status(404).send({message: 'Este hotel no tiene con reservaciones'});

            return res.status(200).send({reservaciones: reservacionesEncontradas});
        });
    });   
}

function obtenerReservacionesUsuario(req, res){
    if (req.user.role == 'Admin') return res.status(500).send({message: 'No tienes acceso a esta información'});

    Reservaciones.find({ idUsuario : req.user.sub}, (err, reservacionesEncontradas) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!reservacionesEncontradas) return res.status(404).send({message: 'No hay historial de reservaciones a tu nombre'});

        return res.status(200).send({reservaciones: reservacionesEncontradas})
    });
}

function agregarReservacion(req, res) {
    var parametros = req.body;
    var reservacionModel = new Reservaciones();

    if( parametros.numeroDeHabitacion && parametros.fechaInicio && parametros.fechaFinal){
        reservacionModel.nombre = parametros.nombre;
        reservacionModel.numeroDeHabitacion = parametros.numeroDeHabitacion;
        reservacionModel.nombreEvento = parametros.nombreEvento;
        reservacionModel.nombreServicio = parametros.nombreServicio;
        reservacionModel.idUsuario = req.user.sub;
        reservacionModel.fechaInicio = parametros.fechaInicio;
        reservacionModel.fechaFinal = parametros.fechaFinal;

        reservacionModel.save((err, reservacionGuardada) => {
            if (err) return res.status(500).send({message: 'Error en la peticion'});
            if (!reservacionGuardada) return res.status(404).send({message: 'No se pudo guardar la reservación'});

            return res.status(200).send({ reservacion: reservacionGuardada });
        });
    }else{
        return res.status(500).send({message: 'Alguno de los campos esta vacio'});
    }
}

function editarReservacion(req, res){
    var parametros = req.body;
    var reserva = req.params.idReservacion;

    Reservaciones.findOneAndUpdate({ _id: reserva, idUsuario : req.user.sub}, parametros, { new : true }, (err, reservacionActualizada) => {
        if (err) return res.status(500).send({message: 'Error en la peticion'});
        if (!reservacionActualizada) return res.status(404).send({message: 'No se pudo editar la reservación'});

        return res.status(200).send({ reservacion: reservacionActualizada });
    });

}
function editarReservacion (req, res) {
    var reserva = req.params.idReservacion;
    var parametros = req.body;

    Reservaciones.findByIdAndUpdate(reserva, parametros, { new: true } ,(err, reservacionEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!reservacionEliminada) return res.status(404).send( { mensaje: 'Error al Editar el Hotel'});

        return res.status(200).send({ reservacion: reservacionEliminada});
    });
}


function eliminarReservacion(req, res) {
    var reserva = req.params.idReservacion;

    Reservaciones.findByIdAndDelete(reserva, (err, reservacionEliminada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!reservacionEliminada) return res.status(500).send({ mensaje: "Error al eliminar este hotel, intenta de nuevo" });
        return res.status(200).send({ reservacion: reservacionEliminada });
    })
}


function ObtenerReservaciones (req, res) {
    if (req.user.rol == "SuperAdmin") {
        Reservaciones.find((err, reservacionesEncontradas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ reservaciones: reservacionesEncontradas })

    })
    }else{
        Reservaciones.find({idUsuario: req.user.sub},(err, reservacionesEncontradas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ reservaciones: reservacionesEncontradas })
    
        })
    }
}

function ObtenerReservacionesId(req, res) {
    var idReserva = req.params.idReservacion;

    Reservaciones.findById(idReserva, (err, reservacionEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!reservacionEncontrada) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ reservacion: reservacionEncontrada });
    })
}

function generarFactura(req, res){
    var parametros = req.body;
    var facturaModel = new Factura();
    
    if(parametros.nit, parametros.estado, parametros.fecha){
                
                        facturaModel.nit = parametros.nit;
                        facturaModel.estado = parametros.estado;
                        facturaModel.fecha = parametros.fecha;
                        facturaModel.idAdmin = req.user.sub;
                        facturaModel.idReservacion = parametros.idReservacion;
                        facturaModel.save((err, facturaGuardada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                            return res.status(200).send({ mensaje: facturaGuardada }) 
                        })
                    
                            
    }else {
        return res.status(500).send({ mensaje: "Por favor, llene todos los campos" })
    }
}

function ObtenerFacturas (req, res) {
    if (req.user.rol == "SuperAdmin") {
        Factura.find((err, facturasEncontradas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        return res.send({ facturas: facturasEncontradas })

    })
    }else{
        Factura.find({idUsuario: req.user.sub},(err, facturasEncontradas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ facturas: facturasEncontradas })
    
        })
    }
}


module.exports = {
    obtenerReservacionHotel,
    obtenerReservacionesUsuario,
    agregarReservacion,
    editarReservacion,
    eliminarReservacion,
    ObtenerReservaciones,
    ObtenerReservacionesId,
    generarFactura,
    ObtenerFacturas
}