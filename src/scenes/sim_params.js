var board_w = 100;
var board_h = 100;

var farmbits_start_n = 10;

//in order of priority
var fullness_motivated    = 0.2;
var energy_motivated      = 0.2;
var joy_motivated         = 0.2;
var fulfillment_motivated = 0.2;
var fullness_content      = 0.4;
var energy_content        = 0.4;
var joy_content           = 0.4;
var fulfillment_content   = 0.4;

var farm_phosphorus_uptake_p = 0.0005; //*%
var farm_phosphorus_uptake_max = 0.0002; //+v
var farm_grow_v = 0.1;
var livestock_poop_t = 1000;
var storage_food_max = 10;

var max_dist = 99999;

