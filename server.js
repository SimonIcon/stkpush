const express = require('express')
const dotenv = require('dotenv')
const { stkRoute } = require('./src/routes/stkpush')
const bodyParser = require('body-parser')
const cors = require('cors')
const ngrok = require('ngrok')



// creating express app and make use of dotenv file
const app = express()
dotenv.config()

// using express middleware
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// creating home route
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/home.html")
})
// app middleware route
app.use('/', stkRoute)

// starting the server
app.listen(process.env.PORT, () => {
    console.log(`server started at port ${process.env.PORT} nicely`)
})
