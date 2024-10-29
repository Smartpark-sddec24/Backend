const connection = require('./connection')

//Might want to turn this into a options object
function query(query_string, query_params, resolve_function, reject_function){
    connection.query(
        query_string,
        query_params, 
        (err, rows) => {
            if(err){
                reject_function(err);
            } else {
                resolve_function(rows);
            }
    })
}

async function getAllSpots() {
    return new Promise((resolve, reject) =>{
        query('SELECT * FROM spots', [], resolve, reject);
    })
}

async function getStatus(spot_id) {
    return new Promise((resolve, reject) => {
        query(
            `SELECT spot_id, is_reserved, is_occupied
            FROM spots
            WHERE spot_id = ?`,
            [spot_id],
            resolve, reject
        )
    })
}

module.exports = {
    getAllSpots,
    getStatus
}