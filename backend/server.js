const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const connectDB = require("./config/Connect");
require('dotenv').config();
const passportSetup = require("./controllers/gooleAuth");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


connectDB();

app.use('/api', require('./routers/auth'));
app.use("/auth", require('./routers/googleAuth'));
app.use("/api/colleges",require("./routers/CollegeRoutes"));
app.use("/api",require("./routers/Admin/Admin"))
app.use("/api/organizer",require("./routers/OrganizerDashboard/Overview"));
app.use("/api/event",require("./routers/Event/EventPost"));
app.use("/api/subevent",require("./routers/Event/SubEvent"));
app.use("/api/eventRegister",require("./routers/Event/EventRegistrations"))
app.get('/', (req, res) => {
    res.send('Server is running successfully!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
