const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

//imports schemas
const { Reservation, User } = require('./schemas');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect('mongodb://localhost:27017/labReservation', {})
    //added error handling
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Initial data
const initialData = [
    { date: '2024-08-15', lab: 'lab1', seat: 1, user: 'alice@dlsu.edu.ph', anonymous: false, time: '10:00' },
    { date: '2024-08-15', lab: 'lab1', seat: 2, user: 'bob@dlsu.edu.ph', anonymous: true, time: '10:10' },
    { date: '2024-08-15', lab: 'lab2', seat: 3, user: 'charlie@dlsu.edu.ph', anonymous: false, time: '10:20' },
    { date: '2024-08-15', lab: 'lab1', seat: 3, user: 'david@dlsu.edu.ph', anonymous: false, time: '10:00' },
    { date: '2024-08-15', lab: 'lab1', seat: 4, user: 'eli@dlsu.edu.ph', anonymous: true, time: '10:10' },
    { date: '2024-08-15', lab: 'lab2', seat: 1, user: 'frank@dlsu.edu.ph', anonymous: false, time: '10:20' }
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


app.use(session({
    secret: 'popsicle-stick',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
        maxAge: 3 * 7 * 24 * 60 * 60 * 1000  }, 
  }));



// The network thingies.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/homepage-student', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage-student.html'));
});

app.get('/homepage-technician', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage-technician.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/see_reserve', (req, res) => {
    res.sendFile(path.join(__dirname, 'see_reserve.html'));
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

app.get('/reserve', (req, res) => {
    res.sendFile(path.join(__dirname, 'reserve.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'edit.html'));
});




// Endpoints, the html files calls this to update the database.

//REGISTRATION
// Checks if email exists already in DB
app.get('/email', async (req, res) =>{
    try {
        const email = req.query.email;
        const data = await User.find({ email: email });
        res.json(data);
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).send("Server error while checking user.");
    }
})

// Checks if technician already exists
app.get('/email/technician', async (req, res) =>{
    try {
        const email = req.query.email;
        const data = await User.find({ email: email, isTechnician: true });
        res.json(data);
    } catch (error) {
        console.error("Error checking technician:", error);
        res.status(500).send("Server error while checking technician.");
    }
})

// Registers student account
app.post('/register/student', async (req, res) =>{
    console.log('Received body:', req.body);
    try {
        let newStud = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            isTechnician: false
        });
        await newStud.save();
        console.log("Successfully Registered Student!");
        res.status(200).send("Successfully Registered Student!")

    } catch (error) {
        console.error("Error Registering Student:", error);
        res.status(500).send("Error Registering Student.");
    }
})

// Registers technician account
app.post('/register/technician', async (req, res) =>{

    try {
        let newTech = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            isTechnician: true
        });
        await newTech.save();
        console.log("Successfully Registered Technician!");
        res.status(200).send("Successfully Registered Student!")

    } catch (error) {
        console.error("Error Registering Technician:", error);
        res.status(500).send("Error Registering Technician.");
    }
});

// LOGIN
app.get('/login', async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    const rememberMe = req.query.rememberMe;

    //debugging
    console.log('Received login request');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            const isPasswordCorrect = await user.comparePassword(password);
            //debugging
            console.log('Is password correct:', isPasswordCorrect);

            if (isPasswordCorrect) {
                if (rememberMe == 1) {
                    req.session.user = user.email;
                    req.session.rememberMe = true;
                    req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // 3 weeks
                }
                else{
                    req.session.user = user.email;
                    req.session.rememberMe = false;
                    req.session.cookie.expires = false; 
                }
                
                // res.setHeader('Content-Type', 'application/json');

                res.json({ status: "success", role: user.isTechnician ? 'technician' : 'student' });
                console.log("Login Success!");
                console.log("remembered: " + req.session.rememberMe)
            } else {
                res.json({ status: "fail", role: ""});
                console.log("Incorrect password.");
            }
        } else {
            res.json({ status: "fail", role: "" });
            console.log("User not found.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
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

app.post('/reserve', async (req, res) => {
    const { lab, date, time, seat, user } = req.body;
    try {
        const existingReservation = await Reservation.findOne({ lab, date, time, seat });
        if (existingReservation) {
            return res.status(400).send('Seat already reserved');
        }

        const newReservation = new Reservation({ lab, date, time, seat, user, anonymous: user === 'anonymous' });
        await newReservation.save();
        res.status(200).send('Reservation successful');
    } catch (err) {
        res.status(500).send('Error making reservation');
    }
});

app.put('/edit-reservation', async (req, res) => {
    const { id, lab, date, time, seat } = req.body;
    console.log('Received edit request:', { id, lab, date, time, seat });

    try {
        const existingReservation = await Reservation.findOne({ lab, date, time, seat });
        if (existingReservation && existingReservation._id.toString() !== id) {
            console.log('Seat already reserved');
            return res.status(400).send('Seat already reserved');
        }

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            console.log('Reservation not found');
            return res.status(404).send('Reservation not found');
        }

        reservation.lab = lab;
        reservation.date = date;
        reservation.time = time;
        reservation.seat = seat;
        await reservation.save();
        console.log('Reservation updated successfully');
        res.status(200).send('Reservation updated successfully');
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server error');
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
    const { lab, date, time } = req.query;
    let reservations;

    if (lab && date && time) {
        reservations = await Reservation.find({ lab, date, time });
    } else if (lab && date) {
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

app.get('/user-status', async (req, res) => {
    const email = req.session.user;
    try {
        const user = await User.findOne({ email: email });
        res.json({ isTechnician: user.isTechnician, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user status' });
    }
});

app.get('/get-reservations', async (req, res) => {
    const { lab, date } = req.query;
    try {
        const reservations = await Reservation.find({ lab, date });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching reservations' });
    }
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


app.get('/api/reservations', async (req, res) => {
    const { user } = req.query;
    try {
        let reservations;
        if (user) {
            reservations = await Reservation.find({ user: new RegExp(user, 'i') });
        } else {
            reservations = await Reservation.find();
        }
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations' });
    }
});

app.get('/api/profile', async (req, res) => {
    try {
        const userProfile = await getUserProfile(req.user.id);
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user profile' });
    }
});

app.put('/api/profile', async (req, res) => {
    try {
        const { picture, description } = req.body;
        await updateProfile(req.user.id, picture, description);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user profile' });
    }
});

app.delete('/api/profile', async (req, res) => {
    try {
        await deleteProfile(req.user.id);
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user profile' });
    }
});

app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await getReservations(req.user.id);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user reservations' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});