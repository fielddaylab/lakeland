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

var cursor_img;
{
  var ctx;
  var s = 100;
  var l = s/4;
  cursor_img = GenIcon(s,s);
  ctx = cursor_img.context;

  ctx.lineWidth = s/5;
  ctx.strokeStyle = green;

  ctx.beginPath();

  ctx.moveTo(0,l);
  ctx.lineTo(0,0);
  ctx.lineTo(l,0);

  ctx.moveTo(s-l,0);
  ctx.lineTo(s,0);
  ctx.lineTo(s,l);

  ctx.moveTo(s,s-l);
  ctx.lineTo(s,s);
  ctx.lineTo(s-l,s);

  ctx.moveTo(l,s);
  ctx.lineTo(0,s);
  ctx.lineTo(0,s-l);

  ctx.stroke();
}

var ncursor_img;
{
  var ctx;
  var s = 100;
  var l = s/4;
  ncursor_img = GenIcon(s,s);
  ctx = ncursor_img.context;

  ctx.lineWidth = s/5;
  ctx.strokeStyle = red;

  ctx.beginPath();

  ctx.moveTo(0,l);
  ctx.lineTo(0,0);
  ctx.lineTo(l,0);

  ctx.moveTo(s-l,0);
  ctx.lineTo(s,0);
  ctx.lineTo(s,l);

  ctx.moveTo(s,s-l);
  ctx.lineTo(s,s);
  ctx.lineTo(s-l,s);

  ctx.moveTo(l,s);
  ctx.lineTo(0,s);
  ctx.lineTo(0,s-l);

  ctx.stroke();
}

//var farmbit_imgs = [];

var land_img = GenImg("assets/grass_t"+0+"_d"+0+"_f"+0+".png");
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

var food_img = GenImg("assets/food.png");
var poop_img = GenImg("assets/poop.png");
var land_img = GenImg("assets/land.png");
var shore_img = GenImg("assets/shore.png");
var livestock_img = GenImg("assets/livestock.png");
var storage_img = GenImg("assets/storage.png");
var processor_img = GenImg("assets/storage.png");
var road_img = GenImg("assets/road.png");
var sign_img = GenImg("assets/sign.png");
var lake_img = GenImg("assets/lake.png");
var water_img = GenImg("assets/water.png");
var rock_img = GenImg("assets/rock.png");
var forest_img = GenImg("assets/forest.png");
var home_img = GenImg("assets/home.png");
var farm_img = GenImg("assets/farm.png");
var grave_img = GenImg("assets/grave.png");
var milk_img = GenImg("assets/milk.png");
var fertilizer_img = GenImg("assets/fertilizer.png");

var mayor_img = GenImg("assets/mayor.png");
var business_img = GenImg("assets/business.png");
var farmer_img = GenImg("assets/farmer.png");

var advisor_mayor_img = GenImg("assets/advisor_mayor.png");
var advisor_business_img = GenImg("assets/advisor_business.png");
var advisor_farmer_img = GenImg("assets/advisor_farmer.png");

var clouds_img = GenImg("assets/clouds.png");
var bloom_img = GenImg("assets/bloom.png");
var skull_img = GenImg("assets/skull.png");
var coin_img = GenImg("assets/coin.png");
var cow_img = GenImg("assets/cow.png");

