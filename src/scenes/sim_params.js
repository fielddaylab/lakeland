var board_w = 50;
var board_h = 50;

var n_lakes = 4;
var lake_size_min = 50;
var lake_size_max = 100;

var n_rock_deposits = 8;
var rock_size_min = 20;
var rock_size_max = 50;

var n_forrests = 2;
var forrest_size_min = 100;
var forrest_size_max = 100;

var farmbits_start_n = 1;
var money_start_n = 100;

//in order of priority
var fullness_motivated    = 0.2;
var energy_motivated      = 0.2;
var joy_motivated         = 0.2;
var fulfillment_motivated = 0.2;
var fullness_content      = 0.4;
var energy_content        = 0.4;
var joy_content           = 0.4;
var fulfillment_content   = 0.4;

var fullness_depletion_rate    = 0.9995;
var energy_depletion_rate      = 0.999;
var joy_depletion_rate         = 0.999;
var fulfillment_depletion_rate = 0.999;

var wait_t = 10;

var nutrition_flow_rate = 0.001;
var poop_nutrition_leak = 0.0001;
var farm_nutrition_uptake_p = 0.0005; //*%
var farm_nutrition_uptake_max = 0.0002; //+v
var farm_nutrition_uptake_min = 0.00001; //+v //difference created out of thin air!
var farm_nutrition_req = 0.1;
var farm_nutrition_fertilize_threshhold = 1;//0.2;
var livestock_poop_t = 1000;
var livestock_feed_threshhold = 0.2;
var livestock_food_val = 1;
var livestock_fullness_depletion_rate = 0.999;
var storage_food_max = 10;
var storage_poop_max = 10;

var food_carryability = 0.8;
var poop_carryability = 0.2;

var land_walkability      = 1;
var rock_walkability      = 0.8;
var water_walkability     = 0.5;
var shore_walkability     = 0.8;
var forrest_walkability   = 0.7;
var home_walkability      = 0.9;
var farm_walkability      = 0.9;
var livestock_walkability = 0.8;
var storage_walkability   = 0.9;
var road_walkability      = 4;

var plant_fulfillment     = 0.1;
var harvest_fulfillment   = 0.1;
var fertilize_fulfillment = 0.1;
var feed_fulfillment      = 0.1;
var store_fulfillment     = 0.1;
var kick_fulfillment      = 0.1;

var max_dist = 9999999;

var farmbit_cost = 500;
var home_cost = 100;
var farm_cost = 100;
var livestock_cost = 200;
var storage_cost = 10;
var road_cost = 1000;
var free_money = 1000;

var harvest_profit = 10;

var roads_per_card = 10;
var min_card_drag_t = 50;

var debug_pathfinding = 0;
var debug_jobs = 0;

