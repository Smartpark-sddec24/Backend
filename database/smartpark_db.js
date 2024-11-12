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

async function getOneOpen() {
    return query(
        `SELECT * FROM spots
        WHERE is_reserved = 0 AND is_occupied = 0
        LIMIT 1`
    );
}

async function updateStatus(spot_id, is_occupied) {
    return query(
        `UPDATE spots
        SET is_occupied = ?
        WHERE spot_id = ?`,
        [is_occupied, spot_id]
    )
}

module.exports = {
    getAllSpots,
    getStatus,
    getOneOpen,
    updateStatus
}