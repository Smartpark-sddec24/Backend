const connection = require('./connection')

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
        query('SELECT * FROM smartpark.spots', [], resolve, reject);
    })
}

// async function getStatus(spot_id) {
//     return new Promise((resolve, reject) => {
//         connection.query(
//             ''
//         )
//     })
// }

module.exports = {
    getAllSpots,
}