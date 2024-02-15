require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbstore = require('connect-mongo')//session store
const passport = require('passport')

// Database connection
const url="URL for MongoDB Connection"

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => console.log(" Mongoose is connected"),
    );
  } catch (e) {
    console.log("could not connect");
  }
  
  const connection = mongoose.connection;
  connection.on("error", (err) => console.log(`Connection error ${err}`));
  connection.once("open", () => console.log("Connected to DB!"));


// Session store
let mongoStore = MongoDbstore.create({
  mongooseConnection: connection,
  collection: 'sessions',
  mongoUrl: url
})

//Session config
app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}))

app.use(flash())

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//assets
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


app.listen(PORT , ()=>{
    console.log(`Listening on Port ${PORT}`)
})
