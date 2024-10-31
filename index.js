const express = require('express')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
const port = process.env.PORT

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
})


app.get('/', (req, res) => {
    res.send("your stupid")
})

app.get('/getSpots', (req, res) => {
    connection.query( "SELECT * FROM Spots", (error, results, fields) => {
        console.log(results)
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})