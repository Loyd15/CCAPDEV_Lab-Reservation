const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reservationSchema = new Schema({
    date: String,
    user: String,
    lab: String,
    seat: Number,
    anonymous: Boolean,
    time: String
}, { collection: 'reservation' });

const Reservation = model('Reservation', reservationSchema);

const userSchema = new Schema({
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

const User = model('User', userSchema);

module.exports = { Reservation, User };
