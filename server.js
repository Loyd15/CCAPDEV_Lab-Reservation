const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/labReservation', { useNewUrlParser: true, useUnifiedTopology: true });

const reservationSchema = new mongoose.Schema({
    date: String,
    user: String,
    lab: String,
    seat: Number,
    anonymous: Boolean,
    time: String
}, { collection: 'reservation' });

const Reservation = mongoose.model('Reservation', reservationSchema);

// Initial data
const initialData = [
    { date: '2024-06-04', lab: 'lab1', seat: 1, user: 'Alice', anonymous: false, time: '2024-06-04T10:00' },
    { date: '2024-06-04', lab: 'lab1', seat: 2, user: 'Bob', anonymous: true, time: '2024-06-04T10:10' },
    { date: '2024-06-04', lab: 'lab2', seat: 3, user: 'Charlie', anonymous: false, time: '2024-06-04T10:20' },
    { date: '2024-06-04', lab: 'lab1', seat: 3, user: 'David', anonymous: false, time: '2024-06-04T10:00' },
    { date: '2024-06-04', lab: 'lab1', seat: 4, user: 'Eli', anonymous: true, time: '2024-06-04T10:10' },
    { date: '2024-06-04', lab: 'lab2', seat: 1, user: 'Frank', anonymous: false, time: '2024-06-04T10:20' }
];

// Function to add initial data if there's no data
const addInitialData = async () => {
    try {
        const count = await Reservation.countDocuments();
        if (count === 0) {
            await Reservation.insertMany(initialData);
            console.log('Initial data added to the database.');
        } else {
            console.log('Database already has data. Initial data not added.');
        }
    } catch (error) {
        console.error('Error adding initial data:', error);
    }
};

addInitialData();


app.use(express.static(path.join(__dirname)));


// The network thingies.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname,'search.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'view.html'));
});

app.get('/remove', (req, res) => {
    res.sendFile(path.join(__dirname, 'remove.html'));
});

app.get('/see_reserve', (req, res) => {
    res.sendFile(path.join(__dirname, 'see_reserve.html'));
});

// Endpoints, the html files calls this to update the database.

app.post('/submit-student-data', (req, res) => {
    const { email, password } = req.body;
    res.send(`${email} ${password} Submitted Successfully`);
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    // MCO3
    res.send(`${email} registered successfully.`);
});

app.get('/reservation-date', async (req, res) => {
    const { date } = req.query;
    const reservation = await Reservation.findOne({ date });
    if (reservation) {
        res.json({ status: `Reserved by: ${reservation.user}` });
    } else {
        res.json({ status: 'No reservation found for this date and time.' });
    }
});

app.get('/reservation-user', async (req, res) => {
    const { user } = req.query;
    const reservation = await Reservation.findOne({ user });
    if (reservation) {
        res.json({ status: `User ${reservation.user} has a reservation on ${reservation.date}` });
    } else {
        res.json({ status: 'No reservation found for this user.' });
    }
});

app.get('/lab-availability', async (req, res) => {
    const { lab, date } = req.query;
    const reservations = await Reservation.find({ lab, date });
    const seats = Array.from({ length: 30 }, (_, i) => ({
        seat: i + 1,
        user: '',
        anonymous: true
    }));

    reservations.forEach(reservation => {
        seats[reservation.seat - 1] = {
            seat: reservation.seat,
            user: reservation.user,
            anonymous: reservation.anonymous
        };
    });

    res.json(seats);
});

app.get('/get-reservations', async (req, res) => {
    const { lab, date } = req.query;
    let reservations;

    if (lab && date) {
        reservations = await Reservation.find({ lab, date });
    } else {
        reservations = await Reservation.find();
    }

    res.json(reservations);
});

app.delete('/remove-reservation', async (req, res) => {
    const { id } = req.query;
    await Reservation.findByIdAndDelete(id);
    res.sendStatus(200);
});


app.get('/get-reservations-by-date', async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    try {
        const reservation = await Reservation.findOne({ date: date });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/get-reservations-by-user', async (req, res) => {
    const { user } = req.query;

    if (!user) {
        return res.status(400).json({ error: 'User is required' });
    }

    try {
        const reservations = await Reservation.find({ user: new RegExp(user, 'i') });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});