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


// Password Hashing
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')){
            return(next);
    }
    try{
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(this.password,salt);
        console.log('Hashing password: ', this.password, ' to ', hash);
        this.password = hash;
        next();
    } catch (err){
        console.error(err);
        return next(err);
    }
});

userSchema.method('comparePassword', function(candidatePassword) {
    console.log('Comparing passwords: ', candidatePassword, this.password);
    return bcrypt.compare(candidatePassword,this.password);
 })

const User = model('User', userSchema);
module.exports = { Reservation, User };
