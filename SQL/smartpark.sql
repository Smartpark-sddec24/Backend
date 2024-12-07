DROP SCHEMA IF EXISTS smartpark;

-- smartpark.sql
CREATE SCHEMA smartpark;
USE smartpark;

-- Create the 'location' table
CREATE TABLE smartpark.locations (
    location_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    longitude DOUBLE,
    latitude DOUBLE,
    location_name VARCHAR(45),
    location_price INT NOT NULL
);

-- Create the 'boards' table
CREATE TABLE smartpark.boards (
    board_mac_address VARCHAR(20) NOT NULL PRIMARY KEY,
    location_id INT NOT NULL,
    last_ping DATETIME,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Create the 'spots' table
CREATE TABLE smartpark.spots (
    spot_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    is_occupied BOOLEAN DEFAULT FALSE,
    board_mac_address VARCHAR(20) NOT NULL,
    spot_name VARCHAR(3),
    spot_price INT,
    FOREIGN KEY (board_mac_address) REFERENCES boards(board_mac_address)
);

-- Create the 'reservation' table
CREATE TABLE smartpark.reservations (
    reserve_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    spot_id INT NOT NULL,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME DEFAULT (ADDDATE(CURRENT_TIMESTAMP, INTERVAL 5 MINUTE)),
    license_plate VARCHAR(15),
    license_state VARCHAR(2),
    reserved_by VARCHAR(255),
    amount INT,
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);

-- create virtual view for spot status
CREATE VIEW spots_status AS
SELECT s.*,
CASE
	WHEN s.is_occupied = FALSE AND s.is_reserved = FALSE THEN TRUE
    ELSE FALSE
END AS is_open
FROM (
	SELECT spots.*,
		CASE
			WHEN MAX(end_time) < CURRENT_TIMESTAMP THEN FALSE
			WHEN MAX(end_time) > CURRENT_TIMESTAMP THEN TRUE
			ELSE FALSE
		END AS is_reserved
	FROM spots
    LEFT JOIN reservations ON spots.spot_id = reservations.spot_id
    GROUP BY spots.spot_id
) AS s