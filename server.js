const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')

// Database connection
const url="mongodb+srv://aditya:aditya123@cluster0.s8e6v.mongodb.net/pizza"

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



//assets
app.use(express.static('public'))

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


app.listen(PORT , ()=>{
    console.log(`Listening on Port ${PORT}`)
})