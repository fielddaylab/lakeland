var food_img;
{
  var ctx;
  var s = 10;
  food_img = GenIcon(s,s*1.25);
  ctx = food_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = yellow;
  ctx.fillRect(3,4,1,6); //stalk left
  ctx.fillRect(4,6,2,6); //stalk middle
  ctx.fillRect(6,4,1,6); //stalk right
  ctx.fillRect(2,2,3,3); //bulb left
  ctx.fillRect(3,4,4,3); //bulb middle
  ctx.fillRect(5,2,3,3); //bulb right
}

var milk_img;
{
  var ctx;
  var s = 10;
  milk_img = GenIcon(s,s*1.25);
  ctx = milk_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = white;
  ctx.fillRect(4,6,2,6); //stalk middle
  ctx.fillRect(6,4,4,3); //bulb middle
}

var poop_img;
{
  var ctx;
  var s = 10;
  poop_img = GenIcon(s,s*1.25);
  ctx = poop_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = brown;
  ctx.fillRect(2,8,6,2); //bottom
  ctx.fillRect(3,6,4,2); //middle
  ctx.fillRect(4,4,2,2); //top
  ctx.fillRect(2,2,1,3); //stink left
  ctx.fillRect(6,1,1,3); //stink right
}

var fertilizer_img;
{
  var ctx;
  var s = 10;
  fertilizer_img = GenIcon(s,s*1.25);
  ctx = fertilizer_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = brown;
  ctx.fillRect(2,8,6,2); //bottom
  ctx.fillRect(3,6,4,2); //middle
  ctx.fillRect(4,4,2,2); //top
  ctx.fillRect(2,2,1,3); //stink left
  ctx.fillRect(6,1,1,3); //stink right
}

var poop_light_img;
{
  var ctx;
  var s = 10;
  poop_light_img = GenIcon(s,s*1.25);
  ctx = poop_light_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = brown;
  ctx.fillRect(1,1,2,2); //bottom
  ctx.fillRect(2,7,2,2); //stink left
  ctx.fillRect(3,2,2,2); //middle
  ctx.fillRect(5,6,2,2); //top
  ctx.fillRect(7,4,2,2); //stink right
}

var valuable_img;
{
  var ctx;
  var s = 10;
  valuable_img = GenIcon(s,s*1.25);
  ctx = valuable_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = green;
  ctx.fillRect(2,8,6,2); //bottom
  ctx.fillRect(3,6,4,2); //middle
  ctx.fillRect(4,4,2,2); //top
  ctx.fillRect(2,2,1,3); //stink left
  ctx.fillRect(6,1,1,3); //stink right
}

var land_img;
{
  var ctx;
  var s = 10;
  land_img = GenIcon(s,s*1.25);
  ctx = land_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = "rgba(0,125,50)";
  ctx.fillRect(0,0,s,s);
}

var shore_img;
{
  var ctx;
  var s = 10;
  shore_img = GenIcon(s,s*1.25);
  ctx = shore_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = "rgba(150,150,255)";
  ctx.fillRect(0,0,s,s);
}

var livestock_img;
{
  var ctx;
  var s = 10;
  livestock_img = GenIcon(s,s*1.25);
  ctx = livestock_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = blue;
  ctx.fillRect(0,0,s,s);
}

var storage_img;
{
  var ctx;
  var s = 10;
  storage_img = GenIcon(s,s*1.25);
  ctx = storage_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = purple;
  ctx.fillRect(0,0,s,s);
}

var processor_img;
{
  var ctx;
  var s = 10;
  processor_img = GenIcon(s,s*1.25);
  ctx = processor_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = orange;
  ctx.fillRect(0,0,s,s);
}

var skimmer_img;
{
  var ctx;
  var s = 10;
  skimmer_img = GenIcon(s,s*1.25);
  ctx = skimmer_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = orange;
  ctx.fillRect(0,0,s,s);
}

var sign_img;
{
  var ctx;
  var s = 10;
  sign_img = GenIcon(s,s*1.25);
  ctx = sign_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = orange;
  ctx.fillRect(s/2-1,s/2,2,s/2);
  ctx.fillStyle = white;
  ctx.fillRect(0,0,s,s/2);
}

var road_img;
{
  var ctx;
  var s = 10;
  road_img = GenIcon(s,s*1.25);
  ctx = road_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = gray;
  ctx.fillRect(0,0,s,s);
}

var lake_img;
{
  var ctx;
  var s = 10;
  lake_img = GenIcon(s,s*1.25);
  ctx = lake_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = blue;
  ctx.fillRect(0,0,s,s);
  ctx.fillStyle = "#8888FF";
  ctx.fillRect(1,3,3,1);
  ctx.fillRect(4,7,3,1);
}

var water_img;
{
  var ctx;
  var s = 10;
  water_img = GenIcon(s,s*1.25);
  ctx = water_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = blue;
  ctx.fillRect(0,0,s,s);
  ctx.fillStyle = "#8888FF";
  ctx.fillRect(1,3,3,1);
  ctx.fillRect(4,7,3,1);
}

var rock_img;
{
  var ctx;
  var s = 10;
  rock_img = GenIcon(s,s*1.25);
  ctx = rock_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = gray;
  ctx.fillRect(0,0,s,s);
  ctx.fillStyle = "#AAAAAA";
  ctx.fillRect(1,3,3,1);
  ctx.fillRect(4,7,3,1);
}

var forest_img;
{
  var ctx;
  var s = 10;
  forest_img = GenIcon(s,s*1.25);
  ctx = forest_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = "#007733";
  ctx.fillRect(0,0,s,s);
  ctx.fillStyle = "#00AA44";
  ctx.fillRect(1,3,3,1);
  ctx.fillRect(4,7,3,1);
}

var home_img;
{
  var ctx;
  var s = 10;
  home_img = GenIcon(s,s*1.25);
  ctx = home_img.context;
  ctx.translate(0,s*0.25);
  ctx.clearRect(0,0,s,s);
  ctx.fillStyle = blue;
  ctx.fillRect(2,3,6,7);
  ctx.fillStyle = red;
  ctx.fillRect(1,2,8,1);
  ctx.fillRect(2,1,6,1);
  ctx.fillRect(3,0,4,1);
}

var festival_img;
{
  var ctx;
  var s = 10;
  festival_img = GenIcon(s,s*1.25);
  ctx = festival_img.context;
  ctx.translate(0,s*0.25);
  ctx.clearRect(0,0,s,s);
  ctx.fillStyle = blue;
  ctx.fillRect(2,3,6,7);
  ctx.fillStyle = red;
  ctx.fillRect(1,2,8,1);
  ctx.fillRect(2,1,6,1);
  ctx.fillRect(3,0,4,1);
}


var farm_img;
{
  var ctx;
  var s = 10;
  farm_img = GenIcon(s,s*1.25);
  ctx = farm_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = brown;
  ctx.fillRect(0,0,s,s);
}

var grave_img;
{
  var ctx;
  var s = 10;
  farm_img = GenIcon(s,s*1.25);
  ctx = farm_img.context;
  ctx.translate(0,s*0.25);
  ctx.fillStyle = "#555555";
  ctx.fillRect(0,0,s,s);
}

var down_img;
{
  var ctx;
  var s = 50;
  down_img = GenIcon(s,s);
  ctx = down_img.context;
  ctx.lineWidth = s/4;
  ctx.fillStyle = "#FF0000";
  ctx.strokeStyle = "#FF0000";
  drawArrow(s/2,0,s/2,s*3/4,s/8,ctx)
}

var up_img;
{
  var ctx;
  var s = 50;
  up_img = GenIcon(s,s);
  ctx = up_img.context;
  ctx.lineWidth = s/4;
  ctx.fillStyle = "#00FF00";
  ctx.strokeStyle = "#00FF00";
  drawArrow(s/2,s*3/4,s/2,0,s/8,ctx)
}

//var farmbit_imgs = [];
var tfood_img = new Image();
tfood_img.onload = function(){ food_img = tfood_img; };
tfood_img.src = "assets/food.png";
var tpoop_img = new Image();
tpoop_img.onload = function(){ poop_img = tpoop_img; };
tpoop_img.src = "assets/poop.png";
var tpoop_light_img = new Image();
tpoop_light_img.onload = function(){ poop_light_img = tpoop_light_img; };
tpoop_light_img.src = "assets/poop_light.png";
var tvaluable_img = new Image();
tvaluable_img.onload = function(){ valuable_img = tvaluable_img; };
tvaluable_img.src = "assets/valuable.png";
var land_imgs = [];
for(var i = 0; i < land_topo_levels*land_detail_levels*land_frames; i++) land_imgs[i] = land_img;
for(var t = 0; t < land_topo_levels; t++) //topography
{
  for(var d = 0; d < land_detail_levels; d++) //detail
  {
    for(var f = 0; f < land_frames; f++) //frame
    {
      land_img = new Image();
      land_img.onload = (function(img,i){return function(){ land_imgs[i] = img; };})(land_img,land_off(t,d,f));
      land_img.src = "assets/grass_t"+t+"_d"+d+"_f"+f+".png";
    }
  }
}
var tshore_img = new Image();
tshore_img.onload = function(){ shore_img = tshore_img; };
tshore_img.src = "assets/shore.png";
var tlivestock_img = new Image();
tlivestock_img.onload = function(){ livestock_img = tlivestock_img; };
tlivestock_img.src = "assets/livestock.png";
var tstorage_img = new Image();
tstorage_img.onload = function(){ storage_img = tstorage_img; };
tstorage_img.src = "assets/storage.png";
var tprocessor_img = new Image();
tprocessor_img.onload = function(){ processor_img = tprocessor_img; };
tprocessor_img.src = "assets/processor.png";
var troad_img = new Image();
troad_img.onload = function(){ road_img = troad_img; };
troad_img.src = "assets/road.png";
var tsign_img = new Image();
tsign_img.onload = function(){ sign_img = tsign_img; };
tsign_img.src = "assets/sign.png";
var tlake_img = new Image();
tlake_img.onload = function(){ lake_img = tlake_img; };
tlake_img.src = "assets/lake.png";
var twater_img = new Image();
twater_img.onload = function(){ water_img = twater_img; };
twater_img.src = "assets/water.png";
var trock_img = new Image();
trock_img.onload = function(){ rock_img = trock_img; };
trock_img.src = "assets/rock.png";
var tforest_img = new Image();
tforest_img.onload = function(){ forest_img = tforest_img; };
tforest_img.src = "assets/forest.png";
var thome_img = new Image();
thome_img.onload = function(){ home_img = thome_img; };
thome_img.src = "assets/home.png";
var tfarm_img = new Image();
tfarm_img.onload = function(){ farm_img = tfarm_img; };
tfarm_img.src = "assets/farm.png";
var tgrave_img = new Image();
tgrave_img.onload = function(){ grave_img = tgrave_img; };
tgrave_img.src = "assets/grave.png";
var tmilk_img = new Image();
tmilk_img.onload = function(){ milk_img = tmilk_img; };
tmilk_img.src = "assets/milk.png";
var tfertilizer_img = new Image();
tfertilizer_img.onload = function(){ fertilizer_img = tfertilizer_img; };
tfertilizer_img.src = "assets/fertilizer.png";

var ENUM;

ENUM = 0;
var FARMBIT_ANIM_FRONT = ENUM; ENUM++;
var FARMBIT_ANIM_BACK  = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_ANIM_IDLE  = ENUM; ENUM++;
var FARMBIT_ANIM_WALK  = ENUM; ENUM++;
var FARMBIT_ANIM_SWIM  = ENUM; ENUM++;
var FARMBIT_ANIM_CARRY = ENUM; ENUM++;
var FARMBIT_ANIM_SLEEP = ENUM; ENUM++;
var FARMBIT_ANIM_COUNT = ENUM; ENUM++;

var farmbit_anim_names = [];
farmbit_anim_names[FARMBIT_ANIM_IDLE] = "idle";
farmbit_anim_names[FARMBIT_ANIM_WALK] = "walk";
farmbit_anim_names[FARMBIT_ANIM_SWIM] = "swim";
farmbit_anim_names[FARMBIT_ANIM_CARRY] = "carry";
farmbit_anim_names[FARMBIT_ANIM_SLEEP] = "sleep";

var farmbit_anim_nframes = [];
farmbit_anim_nframes[FARMBIT_ANIM_IDLE] = 2;
farmbit_anim_nframes[FARMBIT_ANIM_WALK] = 2;
farmbit_anim_nframes[FARMBIT_ANIM_SWIM] = 2;
farmbit_anim_nframes[FARMBIT_ANIM_CARRY] = 2;
farmbit_anim_nframes[FARMBIT_ANIM_SLEEP] = 2;

var farmbit_imgs = [];
for(var a = 0; a < FARMBIT_ANIM_COUNT; a++)
{
  farmbit_imgs[a] = [];
  var name = farmbit_anim_names[a];
  for(var s = 0; s < 2; s++)
  {
    var side = s ? "back" : "front";
    farmbit_imgs[a][s] = [];
    for(var f = 0; f < farmbit_anim_nframes[a]; f++)
      farmbit_imgs[a][s][f] = GenImg("assets/farmbit_"+name+"_"+side+"_"+f+".png");
  }
}

var mayor_img = GenImg("assets/mayor.png");
var business_img = GenImg("assets/business.png");
var farmer_img = GenImg("assets/farmer.png");

var clouds_img = GenImg("assets/clouds.png");
var bloom_img = GenImg("assets/bloom.png");
var skull_img = GenImg("assets/skull.png");
var coin_img = GenImg("assets/coin.png");
var cow_img = GenImg("assets/cow.png");

