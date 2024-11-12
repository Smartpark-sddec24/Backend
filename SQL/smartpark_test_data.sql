INSERT INTO smartpark.locations (location_id, location_name, location_price, latitude, longitude) 
VALUES 
(1, "Lot 21", 190, 42.02982, -93.65154),
(2, "Lot 11E", 0, 42.03014, -93.65268);
INSERT INTO smartpark.boards(board_id, location_id) VALUES 
(1, 2), 
(2, 1);
INSERT INTO smartpark.spots(spot_id, board_id, is_reserved, is_occupied) VALUES 
(1, 1, 1, 1),
(2, 1, 1, 0),
(3, 1, 0, 1),
(4, 1, 0, 0),
(5, 2, 0, 0),
(6, 2, 0, 1),
(7, 2, 1, 0),
(8, 2, 1, 1);