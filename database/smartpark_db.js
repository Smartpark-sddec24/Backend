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
        JOIN boards ON board.board_mac_address = spots_status.board_mac_address
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
        JOIN boards ON spots_status.board_mac_address = boards.board_mac_address
        JOIN locations ON locations.location_id = boards.location_id
        WHERE locations.location_id = ?`,
        [location_id]
    );
}

async function getAvailableSpots(location_id) {
    return query(
        `SELECT COUNT(*) AS availableSpot
        FROM spots_status
        JOIN boards ON spots_status.board_mac_address = boards.board_mac_address
        JOIN locations ON locations.location_id = boards.location_id
        WHERE locations.location_id = ? AND spots_status.is_occupied = 0 AND spots_status.is_reserved = 0`,
        [location_id]
    );
}

async function updateStatus(spot_id, is_occupied) {
    return query(
        `UPDATE spots
        SET is_occupied = ?
        WHERE spot_id = ?;
        
        SELECT is_reserved
        FROM spots_status
        WHERE spot_id = ?`,
        [is_occupied, spot_id, spot_id]
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
        JOIN boards ON boards.board_mac_address = spots_status.board_mac_address
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

async function initialize(mac_address) {
    return query(
        `
        INSERT INTO boards (board_mac_address, location_id, last_ping)
        VALUES (?, 1, current_timestamp())
        `,
        [mac_address]
    )
}

async function createSpot(mac_address) {
    return query(
        `
        INSERT INTO spots (board_mac_address)
        VALUES (?)
        `,
        [mac_address]
    )
}

async function getBoardSpots(mac_address) {
    return query(
        `
        SELECT spot_id
        FROM spots
        WHERE board_mac_address = ?
        ORDER BY spot_id
        `,
        [mac_address]
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
    reserveSpot,
    initialize,
    getBoardSpots,
    createSpot
}