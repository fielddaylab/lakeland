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

var land_img;
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
      land_img.src = "assets/tile_land_t"+t+"_d"+d+"_f"+f+".png";
    }
  }
}

var livestock_img;
var livestock_imgs = [];
for(var i = 0; i < 4; i++)
{
  livestock_img = new Image();
  livestock_img.onload = (function(img,i){return function(){ livestock_imgs[i] = img; };})(livestock_img,i);
  livestock_img.src = "assets/tile_livestock_"+i+".png";
}

var ENUM;

ENUM = 0;
var FARMBIT_ANIM_FRONT = ENUM; ENUM++;
var FARMBIT_ANIM_BACK  = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_ANIM_WALK  = ENUM; ENUM++;
var FARMBIT_ANIM_SWIM  = ENUM; ENUM++;
var FARMBIT_ANIM_COUNT = ENUM; ENUM++;

var farmbit_anim_names = [];
farmbit_anim_names[FARMBIT_ANIM_WALK] = "walk";
farmbit_anim_names[FARMBIT_ANIM_SWIM] = "swim";

var farmbit_anim_nframes = [];
farmbit_anim_nframes[FARMBIT_ANIM_WALK] = 2;
farmbit_anim_nframes[FARMBIT_ANIM_SWIM] = 2;

var farmbit_imgs = [];
for(var c = 0; c < 5; c++)
{
  for(var a = 0; a < FARMBIT_ANIM_COUNT; a++)
  {
    farmbit_imgs[a] = [];
    var name = farmbit_anim_names[a];
    for(var s = 0; s < 2; s++)
    {
      var side = s ? "back" : "front";
      farmbit_imgs[a][s] = [];
      for(var f = 0; f < farmbit_anim_nframes[a]; f++)
        farmbit_imgs[a][s][f] = GenImg("assets/farmbit_"+c+"_"+name+"_"+side+"_"+f+".png");
    }
  }
}

var icon_cursor_img = GenImg("assets/icon_cursor.png");
var icon_fertilizer_img = GenImg("assets/icon_fertilizer.png");
var icon_food_img = GenImg("assets/icon_food.png");
var icon_food_sell_img = GenImg("assets/icon_food_sell.png");
var icon_milk_img = GenImg("assets/icon_milk.png");
var icon_milk_sell_img = GenImg("assets/icon_milk_sell.png");
var icon_money_img = GenImg("assets/icon_money.png");
var icon_poop_img = GenImg("assets/icon_poop.png");

var tile_bloom_img = GenImg("assets/tile_bloom.png");
var tile_farm_img = GenImg("assets/tile_farm.png");
var tile_food_img = GenImg("assets/tile_food.png");
var tile_forest_img = GenImg("assets/tile_forest.png");
var tile_land_img = GenImg("assets/tile_land_t0_d0_f0.png");
var tile_grave_img = GenImg("assets/tile_grave.png");
var tile_home_img = GenImg("assets/tile_home.png");
var tile_lake_img = GenImg("assets/tile_lake.png");
var tile_livestock_img = GenImg("assets/tile_livestock_0.png");
var tile_money_img = GenImg("assets/tile_money.png");
var tile_out_img = GenImg("assets/tile_out.png");
var tile_road_img = GenImg("assets/tile_road.png");
var tile_rock_img = GenImg("assets/tile_rock.png");
var tile_shore_img = GenImg("assets/tile_shore.png");
var tile_sign_img = GenImg("assets/tile_sign.png");
var tile_skull_img = GenImg("assets/tile_skull.png");
var tile_water_img = GenImg("assets/tile_water.png");

var advisor_mayor_img = GenImg("assets/advisor_mayor.png");
var advisor_business_img = GenImg("assets/advisor_business.png");
var advisor_farmer_img = GenImg("assets/advisor_farmer.png");

var advisor_panel_mayor_img = GenImg("assets/advisor_panel_mayor.png");
var advisor_panel_business_img = GenImg("assets/advisor_panel_business.png");
var advisor_panel_farmer_img = GenImg("assets/advisor_panel_farmer.png");

var badge_cow_img = GenImg("assets/badge_cow.png");
var badge_farmbit = GenImg("assets/badge_farmbit.png");
var badge_money_img = GenImg("assets/badge_money.png");

var button_achievement_img = GenImg("assets/button_achievement.png");
var button_close_img = GenImg("assets/button_close.png");
var button_next_img = GenImg("assets/button_next.png");

var clouds_img = GenImg("assets/clouds.png");
var cow_img = GenImg("assets/cow.png");
var farmbit_img = GenImg("assets/farmbit.png");

var play_img = GenImg("assets/play.png");
var pause_img = GenImg("assets/pause.png");
var fast_img = GenImg("assets/fast.png");

