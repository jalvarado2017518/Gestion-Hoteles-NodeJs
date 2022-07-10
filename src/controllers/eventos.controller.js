const Hotel = require('../models/hoteles.model')
const evento = require('../models/eventos.model')
const underscore = require('underscore');

function agregarEvento(req, res) {
    var parametros = req.body;
    var eventoModel = new evento;
    if (parametros.nombreEvento, parametros.precio) {
        evento.findOne({ nombreEvento: parametros.nombreEvento }, (err, eventoAgregado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (underscore.isEmpty(eventoAgregado)) {
                    eventoModel.nombreEvento = parametros.nombreEvento;
                    eventoModel.descripcion = parametros.descripcion;
                    eventoModel.precio = parametros.precio;
                    eventoModel.idAdmin = req.user.sub;
                    eventoModel.idHotel = parametros.idHotel;
                    eventoModel.save((err, eventoGuardado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' })
                        return res.status(200).send({ mensaje: eventoGuardado })
                    })
            } else {
                return res.status(200).send({ mensaje: 'Ese nombre ya esta utilizado, intente con otro' })
            }
        })
    } else {
        return res.status(500).send({ mensaje: 'Por favor, llena todos los campos' })
    }

}

function editarEvento(req, res) {
    var idEvento = req.params.idEvento;
    var parametros = req.body;
    evento.findByIdAndUpdate(idEvento, parametros, { new: true }, (err, eventoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEditado) return res.status(404).send({ mensaje: 'Error al editar el usuario' });
        return res.status(200).send({ evento: eventoEditado })
    })

}

function eliminarEvento(req, res) {
    var idEvento = req.params.idEvento;
    evento.findByIdAndDelete(idEvento, (err, eventoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el evento' });
        return res.status(200).send({ evento: eventoEliminado });
    })

}

/*function obtenerEventos(req, res) {
    evento.find((err, eventoEncontrado) => {
        if (err) return res.send({ mensaje: "Error: " + err })
        for (let i = 0; i < eventoEncontrado.length; i++) {
        }
        return res.status(200).send({ eventos: eventoEncontrado })
    })
}*/

function obtenerEventos (req, res) {
    if (req.user.rol == "SuperAdmin" || req.user.rol == "Cliente") {
        evento.find((err, eventoEncontrado) => {
            if (err) return res.send({ mensaje: "Error: " + err })
            for (let i = 0; i < eventoEncontrado.length; i++) {
            }
            return res.status(200).send({ eventos: eventoEncontrado })
        })
    }else{
        evento.find({idAdmin: req.user.sub},(err, eventoEncontrado) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            return res.send({ eventos: eventoEncontrado })
    
        })
    }
}

function ObtenerEventosId(req, res) {
    var idEvent = req.params.idEvento;

    evento.findById(idEvent, (err, eventoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEncontrado) return res.status(500).send( { mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ evento: eventoEncontrado });
    })
}

function ObtenerEventosHoteles(req, res) {
    var idHote = req.params.idHotel;

    evento.find({idHotel:idHote}, (err, eventosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventosEncontrados) return res.status(404).send( { mensaje: 'Error al obtener los datos' });
   
       
        return res.status(200).send({ eventos: eventosEncontrados });
    })
}

module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEvento,
    obtenerEventos,
    ObtenerEventosId,
    ObtenerEventosHoteles
}