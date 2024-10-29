const express = require('express')
const smartpark_db = require('./database/smartpark_db')

const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send("your stupid")
})

 app.get('/getSpots', async (req, res) => {
    const results = await smartpark_db.getAllSpots()
    console.log(results)
    res.send(results)
})

app.get('/getStatus', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})