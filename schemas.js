const { Schema, model } = require('mongoose');


const reservationSchema = new Schema({
    date: String,
    user: String,
    lab: String,
    seat: Number,
    anonymous: Boolean,
    time: String
}, { collection: 'reservation' });

const Reservation = mongoose.model('Reservation', reservationSchema);

const accountSchema = new Schema({
    email: {
        type: String, 
        unique: true, 
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const Account = model('Account', accountSchema);

module.exports = { Reservation, Account };
