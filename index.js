const express = require('express')
const smartpark_db = require('./database/smartpark_db')

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
    res.send("your stupid")
})

 app.get('/getSpots', async (req, res) => {
    const results = await smartpark_db.getAllSpots()
    res.send(results)
})

const SPOT_STATUS = Object.freeze({
    OPEN: "0",
    OCCUPIED: "1",
    RESERVED: "2"
})

app.get('/getStatus', async (req, res) => {
    const spot_id = parseInt(req.query['spot_id'])
    const query_results = (await smartpark_db.getStatus(spot_id))[0]
    if(query_results['is_reserved']){
        res.send(SPOT_STATUS.RESERVED)
    }
    else if(query_results['is_occupied']){
        res.send(SPOT_STATUS.OCCUPIED)
    }
    else{
        
        res.send(SPOT_STATUS.OPEN)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})