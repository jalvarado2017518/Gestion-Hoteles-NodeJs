const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var ReservacionSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    nombre: { type: Schema.Types.Object, ref: 'Hoteles'},
    numeroDeHabitacion: { type: Schema.Types.Object, ref: 'Habitacion'},
    nombreEvento: { type: Schema.Types.Object, ref: 'Evento'},
    nombreServicio: { type: Schema.Types.Object, ref: 'Servicio'},
    fechaInicio: String,
    fechaFinal: String,

})

module.exports=mongoose.model('Reservacion',ReservacionSchema)