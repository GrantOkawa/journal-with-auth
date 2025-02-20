const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const EntryRoutes = require("./routes/entries");
const path = require('path');

require("dotenv").config({ path: './config/.env' });

// Passport config
require("./config/passport")(passport);

connectDB();

app.set("view engine", "ejs");
app.use('/public', express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(logger("dev"));
// Sessions
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", mainRoutes);
app.use("/entries", EntryRoutes);

app.listen(process.env.PORT, () => {
    console.log(
        `Server is running on localhost:${process.env.PORT}, you better catch it!`
    );
});