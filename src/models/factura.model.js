const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var FacturaSchema = Schema({
    nit: String,
    estado:String,
    fecha: String,
    idAdmin: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idReservacion : { type: Schema.Types.ObjectId, ref: 'Reservacion'}
})

module.exports=mongoose.model('Factura',FacturaSchema)