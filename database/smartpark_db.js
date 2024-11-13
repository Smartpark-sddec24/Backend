const connection = require('./connection')

//Might want to turn this into a options object
function query(query_string, query_params) {
    return new Promise((resolve, reject) => {
        connection.query(
            query_string,
            query_params, 
            (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                }
        })
    })
}

async function getAllSpots() {
    return query('SELECT * FROM spots', []);
}

async function getStatus(spot_id) {
    return query(
        `SELECT spot_id, is_reserved, is_occupied
        FROM spots
        WHERE spot_id = ?`,
        [spot_id]
    )
}

async function updateStatus(spot_id, is_occupied) {
    return query(
        `UPDATE spots
        SET is_occupied = ?
        WHERE spot_id = ?`,
        [is_occupied, spot_id]
    )
}

async function getLocations() {
    return query(
        `SELECT *
        FROM locations`
    )
}
module.exports = {
    getAllSpots,
    getStatus,
    updateStatus,
    getLocations
}