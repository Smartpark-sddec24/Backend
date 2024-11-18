const express = require('express')
const smartpark_db = require('./database/smartpark_db');

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

app.get('/getLocations', async (req, res) => {
    const locations = await smartpark_db.getLocations()
    res.send(locations)
})

app.get('/getOneOpen', async (req, res) => {
    try {
        const openSpot = (await smartpark_db.getOneOpen())[0];
        
        if (openSpot) {
            res.send(openSpot);
        } else {
            res.send("");
        }
    } catch (error) {
        console.error("Error fetching an open spot:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/getAvailableSpots', async (req, res) => {
    const location_id = parseInt(req.query.location_id);

    if (isNaN(location_id)) {
        return res.status(400).send("Invalid location_id");
    }

    try {
        const result1 = await smartpark_db.getTotalSpots(location_id)
        const result2 = await smartpark_db.getAvailableSpots(location_id)
        
        res.send({
            totalSpot: result1[0].totalSpot,
            availableSpot: result2[0].availableSpot
        });
    } catch (error) {
        console.error("Error fetching available spots:", error)
        res.status(500).send("Internal Server Error")
    }
});

app.post('/updateSpot', async (req, res) => {
    const spot_id = req.query['spot_id']
    const is_occupied = req.query['is_occupied']
    await smartpark_db.updateStatus(spot_id, is_occupied)
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})