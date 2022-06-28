const Reservaciones = require('../models/reservacion.model');
const Hoteles = require('../models/hotel.model');

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

    if (req.user.role == 'Admin') return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});

    if(parametros.idHotel && parametros.idHabitacion && parametros.fechaInicio && parametros.fechaFinal){
        reservacionModel.idHotel = parametros.idHotel;
        reservacionModel.idHabitacion = parametros.idHabitacion;
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

function eliminarReservacion(req, res){
    var reserva = req.params.idReservacion;

    Reservaciones.findOneAndDelete({ _id: reserva, idUsuario : req.user.sub}, parametros, { new : true }, (err, reservacionEliminada) => {
        if (err) return res.status(500).send({message: 'Ocurrio un error en la petición, intentelo de nuevo mas tarde'});
        if (!reservacionEliminada) return res.status(404).send({message: 'No se pudo eliminar la reservación'});

        return res.status(200).send({ reservacion: reservacionEliminada });
    });

}

module.exports = {
    obtenerReservacionHotel,
    obtenerReservacionesUsuario,
    agregarReservacion,
    editarReservacion,
    eliminarReservacion
}