const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const routes = require('./routes/routes')

PORT = process.env.PORT || 5000
URI = process.env.URI

const app = express()

app.use(express.json())

mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const connection = mongoose.connection
connection.once('open', () => { console.log("Connected to Mongoose") })

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})