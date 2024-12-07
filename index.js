const express = require('express')
const bodyParser = require('body-parser')
const smartpark_db = require('./database/smartpark_db');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const { networkInterfaces } = require('os');
const { ok } = require('assert');

const app = express()
const port = process.env.PORT
const nets = networkInterfaces()

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("your stupid")
})

 app.get('/getSpots', async (req, res) => {
    const results = await smartpark_db.getAllSpots()
    res.send(results)
})

app.get('/initialize', async (req, res) => {
    try{
        const mac_addr = req.query['mac_address'];
        const location_id = 2;
        let board_spots = await smartpark_db.getBoardSpots(mac_addr)

        if(board_spots.length == 0){
            console.log("spots not found");
            await smartpark_db.initialize(mac_addr, location_id)
            for(let i = 0; i < 4; i++){
                console.log("adding spot ", i)
                await smartpark_db.createSpot(mac_addr)
            }
            board_spots = await smartpark_db.getBoardSpots(mac_addr)
        }
        res.send([
            board_spots[0].spot_id,
            board_spots[1].spot_id,
            board_spots[2].spot_id,
            board_spots[3].spot_id
        ])
    } catch (err){
        res.send(err)
    }
    
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
    const location_id = req.query.location_id
    try {
        const openSpot = (await smartpark_db.getOneOpen(location_id))[0];
        
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
});j

app.post('/updateSpot', async (req, res) => {
    try{
        let index = 0;
        let is_reserved_arr = [];
        for(spot of req.body)
        {
            if(spot.is_occupied == 1){
                console.log("Spot ", spot.spot_id, " is now occupied")
            } else {
                console.log("Spot ", spot.spot_id, " is now unoccupied")
            }
            is_reserved_arr[index] = (await smartpark_db.updateStatus(spot.spot_id, spot.is_occupied))[1][0].is_reserved;
            index++;
        }
        res.send(is_reserved_arr);
    } catch (err) {
        throw err;
    }
})

function is_open(spot){
    if(spot['is_reserved'] | spot['is_occupied']){
        return false;
    } else {
        return true;
    }
}

async function handle_payment(spot, res){
    try {
        var args = {
          amount: 1099,
          currency: 'usd',
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {enabled: true},
        };
        const intent = await stripe.paymentIntents.create(args);
        res.json({
          client_secret: intent.client_secret,
        });
        await smartpark_db.reserveSpot(spot.spot_id);
      } catch (err) {
        res.status(err.statusCode).json({ error: err.message })
      }
}

app.post('/reserve', async(req, res) => {
    const spot_id = req.query.spot_id
    let this_spot = (await smartpark_db.getSpot(spot_id))[0]
    while(this_spot != null){
        if(is_open(this_spot)){
            await handle_payment(this_spot, res)
            return;
        } else {
            this_spot = (await smartpark_db.getOneOpen(this_spot.location_id))[0];
        }
    }
    res.send("no open spots")
})

app.listen(port, () => {
    ip = nets['wlp3s0'][0]['address']
    console.log(`SmartPark server listening on port at http://${ip}:${port}`)
})