var farmbit_imgs = [];
{
  var ctx;
  var s = 10;
  var i = 0;
  //idle
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //shrug
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //walk- fat arms
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  i++

  //walk- fat legs
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //idle- water
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //shrug- water
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat arms- water
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat legs- water
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //idle- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //shrug- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //walk- fat arms- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  i++

  //walk- fat legs- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  i++

  //idle- water- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //shrug- water- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
  ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat arms- water- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(1,4,2,4); //left_arm
  ctx.fillRect(7,4,1,4); //right_arm
  ctx.fillRect(3,7,1,3); //left_leg
  ctx.fillRect(5,7,2,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++

  //walk- fat legs- water- selected
  farmbit_imgs[i] = GenIcon(s,s*1.5);
  ctx = farmbit_imgs[i].context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = green;
  ctx.fillRect(2,0,6,6);
  ctx.fillStyle = black;
  ctx.fillRect(3,1,4,6); //body
  ctx.fillRect(2,4,1,4); //left_arm
  ctx.fillRect(7,4,2,4); //right_arm
  ctx.fillRect(3,7,2,3); //left_leg
  ctx.fillRect(6,7,1,3); //right_leg
  ctx.clearRect(0,5,10,5); //clear
  i++
}

var food_img;
{
  var ctx;
  var s = 10;
  food_img = GenIcon(s,s*1.5);
  ctx = food_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = yellow;
  ctx.fillRect(3,4,1,6); //stalk left
  ctx.fillRect(4,6,2,6); //stalk middle
  ctx.fillRect(6,4,1,6); //stalk right
  ctx.fillRect(2,2,3,3); //bulb left
  ctx.fillRect(3,4,4,3); //bulb middle
  ctx.fillRect(5,2,3,3); //bulb right
}

var poop_img;
{
  var ctx;
  var s = 10;
  poop_img = GenIcon(s,s*1.5);
  ctx = poop_img.context;
  ctx.translate(0,s*0.5);
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
  poop_light_img = GenIcon(s,s*1.5);
  ctx = poop_light_img.context;
  ctx.translate(0,s*0.5);
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
  valuable_img = GenIcon(s,s*1.5);
  ctx = valuable_img.context;
  ctx.translate(0,s*0.5);
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
  land_img = GenIcon(s,s*1.5);
  ctx = land_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = "rgba(0,125,50)";
  ctx.fillRect(0,0,s,s);
}

var shore_img;
{
  var ctx;
  var s = 10;
  shore_img = GenIcon(s,s*1.5);
  ctx = shore_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = "rgba(150,150,255)";
  ctx.fillRect(0,0,s,s);
}

var livestock_img;
{
  var ctx;
  var s = 10;
  livestock_img = GenIcon(s,s*1.5);
  ctx = livestock_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = blue;
  ctx.fillRect(0,0,s,s);
}

var storage_img;
{
  var ctx;
  var s = 10;
  storage_img = GenIcon(s,s*1.5);
  ctx = storage_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = purple;
  ctx.fillRect(0,0,s,s);
}

var processor_img;
{
  var ctx;
  var s = 10;
  processor_img = GenIcon(s,s*1.5);
  ctx = processor_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = orange;
  ctx.fillRect(0,0,s,s);
}

var road_img;
{
  var ctx;
  var s = 10;
  road_img = GenIcon(s,s*1.5);
  ctx = road_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = gray;
  ctx.fillRect(0,0,s,s);
}

var lake_img;
{
  var ctx;
  var s = 10;
  lake_img = GenIcon(s,s*1.5);
  ctx = lake_img.context;
  ctx.translate(0,s*0.5);
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
  water_img = GenIcon(s,s*1.5);
  ctx = water_img.context;
  ctx.translate(0,s*0.5);
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
  rock_img = GenIcon(s,s*1.5);
  ctx = rock_img.context;
  ctx.translate(0,s*0.5);
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
  forest_img = GenIcon(s,s*1.5);
  ctx = forest_img.context;
  ctx.translate(0,s*0.5);
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
  home_img = GenIcon(s,s*1.5);
  ctx = home_img.context;
  ctx.translate(0,s*0.5);
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
  farm_img = GenIcon(s,s*1.5);
  ctx = farm_img.context;
  ctx.translate(0,s*0.5);
  ctx.fillStyle = brown;
  ctx.fillRect(0,0,s,s);
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
var tland_img = new Image();
tland_img.onload = function(){ land_img = tland_img; };
tland_img.src = "assets/land.png";
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
