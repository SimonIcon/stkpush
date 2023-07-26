const express = require('express')
const dotenv = require('dotenv')
const { stkRoute } = require('./src/routes/stkpush')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDb = require('./src/config/connectDb')




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
connectDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server started at port ${process.env.PORT} nicely and connected to mongoose database`)
    })
}).catch((err) => {
    console.log(`error while connecting to the database ${err}`)
})
