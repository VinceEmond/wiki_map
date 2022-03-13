-- XXXXXXXXXXXXXXXXXXXXXXXXXXX
--       USER SPECIFIC
-- XXXXXXXXXXXXXXXXXXXXXXXXXXX

-- '/login/:id'

-- Get all maps owned by one user (via username)
    SELECT users.name AS map_owner, maps.name AS map_name
    FROM maps
    JOIN users ON users.id = maps.owner_id
    WHERE users.name = 'JohnFrank';

-- Get all map_points owned by one user (via username)
    SELECT *
    FROM map_points
    JOIN users ON users.id = map_points.owner_id
    WHERE users.name = 'JohnFrank';

-- Get all maps contributed by one user (via username)
-- NOTE: This does not include maps created by user
    SELECT users.name AS user_name, maps.name AS map_name
    FROM maps
    JOIN map_points ON map_points.map_id = maps.id
    JOIN users ON users.id = map_points.owner_id
    WHERE users.name = 'JohnFrank'
    GROUP BY users.name, maps.name;

-- Get all maps favourited by one user (via username)
    SELECT users.name AS user_name, maps.name AS fav_map
    FROM favourite_maps
    JOIN users ON users.id = favourite_maps.user_id
    JOIN maps ON maps.id = favourite_maps.map_id
    WHERE users.name = 'JohnFrank';



-- XXXXXXXXXXXXXXXXXXXXXXXXXXX
--           MAPS
-- XXXXXXXXXXXXXXXXXXXXXXXXXXX

-- GET maps/   ---   Browse all maps Limit to 10
    SELECT *
    FROM maps
    LIMIT 10;

-- GET maps/:id   ---   Read a single specific map
    SELECT *
    FROM maps
    WHERE maps.id = 1;

-- POST maps/:id   ---   Edit an exting map (name / description / image)
    UPDATE maps
    SET name = 'UpdatedName',
    description = 'Updated Description'
    WHERE maps.id = 1
    RETURNING *;

-- POST maps/   ---   Add a new map
    INSERT INTO maps (owner_id, name, description, coord_x, coord_y, zoom) VALUES
    1,
    'NewMapName',
    'This is the description of a new map name',
    45.42135855590803,
    -75.69668268181056,
    13;

-- POST maps/:id/delete
    DELETE FROM maps
    WHERE maps.id = 1;



-- XXXXXXXXXXXXXXXXXXXXXXXXXXX
--        MAP POINTS
-- XXXXXXXXXXXXXXXXXXXXXXXXXXX

-- GET map_points/   ---   Browse all map points for 1 map
    SELECT *
    FROM map_points
    WHERE map_id = 1;

-- GET map_points/:id   ---   Read details for an existing map_point
    SELECT *
    FROM map_points
    WHERE map_points.id = 1;

-- POST map_points/:id   ---   Edit details for an existing map_point
    UPDATE map_points
    SET name = 'UpdatedMapPointName',
    description = 'Updated Map Point Description',
    image = 'www.updatedmappointimageurl.com'
    WHERE maps.id = 1
    RETURNING *;

-- POST map_points/   ---   Add a new map_point
    INSERT INTO map_points (map_id, owner_id, name, coord_x, coord_y, zoom, description, image) VALUES (
      1,
      3,
      '49th Parallel Cafe',
      49.286328837515256,
      -123.12303651918343,
      16,
      'Premium quality single-origin coffees and espressos, blends, etc.',
      'https://lh5.googleusercontent.com/p/AF1QipO4u7FUScRtr2QGIF9nrrbr4We-JZs9P9WixOcE=w408-h271-k-no'
    );

-- POST map_points/:id/delete   ---   Delete an existing map point
    DELETE FROM map_points
    WHERE map_points.id = 1;



-- XXXXXXXXXXXXXXXXXXXXXXXXXXX
--      FAVOURITE MAPS
-- XXXXXXXXXXXXXXXXXXXXXXXXXXX

-- GET favourite_maps/
-- GET favourite_maps/:id
-- POST favourite_maps/:id (Not needed for MVD)


-- POST favourite_maps/   ---   Add map to favourites
    INSERT INTO favourite_maps (user_id, map_id) VALUES
      (1, 2);

-- POST favourite_maps/:id/delete   ---   Delete a map from favourites
    DELETE FROM favorites_maps
    WHERE user_id = 1
    AND map_id = 1;



-- XXXXXXXXXXXXXXXXXXXXXXXXXXX
--       OTHER QUERIES
-- XXXXXXXXXXXXXXXXXXXXXXXXXXX

-- All users ordered by user name
    SELECT *
    FROM users
    ORDER BY users.name;

-- All maps ordered by user name
    SELECT users.name AS user_name, maps.name AS map_name
    FROM maps
    JOIN users ON users.id = maps.owner_id
    ORDER BY users.name;

-- All map_points ordered by user name
    SELECT users.name AS user_name, maps.name AS map_name, map_points.name AS point_name
    FROM maps
    JOIN map_points ON map_points.map_id = maps.id
    JOIN users ON users.id = map_points.owner_id
    ORDER BY users.name, maps.name;

-- All favourites order by user name
    SELECT users.name AS user_name, maps.name AS fav_map
    FROM favourite_maps
    JOIN users ON users.id = favourite_maps.user_id
    JOIN maps ON maps.id = favourite_maps.map_id
    ORDER BY users.name;





