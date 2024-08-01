const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

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

    name: String,

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    isTechnician: {
        type: Boolean,
        default: false
    }
});
const User = model('User', userSchema);

// Password Hashing
userSchema.pre('save', async function (next) {

    if (!User.isModified('password'))
        {
            return(next);
        }
        try{
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            const hash = await bcrypt.hash(User.password,salt);
            User.password = hash;
            next();
        }
        catch (err){
            console.error(err);
            return next(err);
        }
});



module.exports = { Reservation, User };
