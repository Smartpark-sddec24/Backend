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
    return query('SELECT * FROM spots_status', []);
}

async function getStatus(spot_id) {
    return query(
        `SELECT spot_id, is_reserved, is_occupied
        FROM spots_status
        WHERE spot_id = ?`,
        [spot_id]
    )
}

async function getOneOpen(location_id) {
    return query(
        `SELECT * 
        FROM spots_status
        JOIN boards ON boards.board_id = spots_status.board_id
        WHERE is_reserved = 0 
        AND is_occupied = 0 
        AND location_id = ?
        LIMIT 1`,
        [location_id]
    );
}

async function getTotalSpots(location_id) {
    return query(
        `SELECT COUNT(*) AS totalSpot
        FROM spots_status
        JOIN boards ON spots_status.board_id = boards.board_id
        JOIN locations ON locations.location_id = boards.location_id
        WHERE locations.location_id = ?`,
        [location_id]
    );
}

async function getAvailableSpots(location_id) {
    return query(
        `SELECT COUNT(*) AS availableSpot
        FROM spots_status
        JOIN boards ON spots_status.board_id = boards.board_id
        JOIN locations ON locations.location_id = boards.location_id
        WHERE locations.location_id = ? AND spots_status.is_occupied = 0 AND spots_status.is_reserved = 0`,
        [location_id]
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

async function reserveSpot(spot_id) {
    return query(
        `
        INSERT INTO reservations (spot_id)
        VALUES (?);
        `,
        [spot_id]
    )
}

async function getSpot(spot_id) {
    return query(
        `SELECT *
        FROM spots_status
        JOIN boards ON boards.board_id = spots_status.board_id
        WHERE spot_id = ?`,
        [spot_id]
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
    getLocations,
    getOneOpen,
    getTotalSpots,
    getAvailableSpots,
    getSpot,
    reserveSpot
}