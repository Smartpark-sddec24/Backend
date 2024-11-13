DROP SCHEMA IF EXISTS smartpark;

-- smartpark.sql
CREATE SCHEMA smartpark;

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
    board_id INT NOT NULL PRIMARY KEY,
    location_id INT NOT NULL,
    last_ping DATETIME,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

-- Create the 'spots' table
CREATE TABLE smartpark.spots (
    spot_id INT NOT NULL PRIMARY KEY,
    is_reserved BOOLEAN DEFAULT FALSE,
    is_occupied BOOLEAN DEFAULT FALSE,
    board_id INT NOT NULL,
    spot_name VARCHAR(3),
    spot_price INT,
    FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

-- Create the 'reservation' table
CREATE TABLE smartpark.reservations (
    reserve_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    spot_id INT NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    license_plate VARCHAR(15),
    license_state VARCHAR(2),
    reserved_by VARCHAR(255),
    amount INT,
    FOREIGN KEY (spot_id) REFERENCES spots(spot_id)
);
