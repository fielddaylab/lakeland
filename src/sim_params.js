var RESUME_SIM = 1;
var DOUBLETIME = 0;

var board_w = 50;
var board_h = 50;

var n_lakes = 4;
var lake_size_min = floor(50*board_w*board_h/2500);
var lake_size_max = floor(100*board_w*board_h/2500);

var n_rock_deposits = 8;
var rock_size_min = floor(20*board_w*board_h/2500);
var rock_size_max = floor(50*board_w*board_h/2500);

var n_forests = 2;
var forest_size_min = floor(100*board_w*board_h/2500);
var forest_size_max = floor(100*board_w*board_h/2500);

var farmbits_start_n = 0;
var money_start_n = 300;

//in order of priority
var fullness_desperate    = 0.015; //death
var energy_desperate      = 0.01; //sleep on spot
var joy_desperate         = 0.01; //refuse any other work
var fulfillment_desperate = 0.01; //n/a
var fullness_motivated    = 0.2;
var energy_motivated      = 0.2;
var joy_motivated         = 0.2;
var fulfillment_motivated = 0.2;
var fullness_content      = 0.4;
var energy_content        = 0.4;
var joy_content           = 0.4;
var fulfillment_content   = 0.4;

//applies to farm
var nutrition_desperate = 10000;
var nutrition_motivated = 20000;
var nutrition_content = 50000;

var fullness_depletion_rate    = 0.9997;
var energy_depletion_rate      = 0.999;
var joy_depletion_rate         = 0.999;
var fulfillment_depletion_rate = 0.999;

var wait_t = 100;
var export_t = 2000;

var nutrition_max = 1000000;
var nutrition_percent = nutrition_max/100;
var presim_nutrition_flow_rate_mul = 100; //*%
var nutrition_flow_rate = 0.00001; //*%
var rain_nutrition_flow_rate = 0.001; //*%
var watersrc_nutrition_flow_rate = 0.00001; //*%
var watersnk_nutrition_flow_rate = 0.001; //*%
var poop_nutrition_leak = 1; //+v
var fertilizer_nutrition_leak = 20; //+v
var farm_nutrition_uptake_p = 0.001; //*%
var farm_nutrition_uptake_max = 40; //+v
var farm_nutrition_uptake_min = 5; //+v //difference created out of thin air!
var farm_nutrition_req = 100000;
var farm_nutrition_fertilize_threshhold = nutrition_percent*20;
var fertilizer_nutrition = farm_nutrition_req*2;
var water_fouled_threshhold = nutrition_percent*10;
var livestock_poop_t = 8000;
var livestock_milk_t = 1;
var livestock_feed_threshhold = 0.2;
var livestock_food_val = 1;
var livestock_fullness_depletion_rate = 0.999;
var storage_max = 10;

var water_carryability = 0.2;
var food_carryability = 0.8;
var poop_raw_carryability = 0.2;
var poop_light_carryability = 0.6;
var poop_potent_carryability = 0.2;
var milk_carryability = 0.8;
var valuable_carryability = 0.2;

var land_walkability      = 1;
var rock_walkability      = 0.7;
var grave_walkability     = 0.2;
var sign_walkability      = 0.5;
var water_walkability     = 0.5;
var shore_walkability     = 0.8;
var forest_walkability    = 0.6;
var home_walkability      = 0.9;
var farm_walkability      = 0.9;
var livestock_walkability = 0.8;
var storage_walkability   = 0.9;
var processor_walkability = 0.9;
var road_walkability      = 4;
var export_walkability    = 1;

var plant_fulfillment     = 0.1;
var harvest_fulfillment   = 0.1;
var fertilize_fulfillment = 0.1;
var milking_fulfillment   = 0.1;
var feed_fulfillment      = 0.1;
var store_fulfillment     = 0.1;
var process_fulfillment   = 0.1;
var kick_fulfillment      = 0.1;
var swim_joy = 0.02; //per frame

var max_dist = 9999999;

var farmbit_cost = 500;
var home_cost = 200;
var farm_cost = 100;
var livestock_cost = 200;
var storage_cost = 10;
var processor_cost = 5000;
var sign_cost = 10;
var road_cost = 1000;
var demolish_cost = 10;
var free_money = 1000;
var festival_cost = 2000;

var harvest_profit = 0;

var item_worth_food = 100;
var item_worth_poop = 10;
var item_worth_milk = 200;
var item_worth_valuable = 5000;

var roads_per_buy = 10;

var debug_pathfinding = 0;
var debug_jobs = 0;

//don't change
var land_topo_levels = 4;
var land_detail_levels = 3;
var land_frames = 2;
var land_off = function(topo,detail,frame){return topo*(land_detail_levels*land_frames)+(detail*land_frames)+frame;}

