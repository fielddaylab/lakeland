'use strict';
var ENUM;

ENUM = 0;
var THING_TYPE_NULL    = ENUM; ENUM++;
var THING_TYPE_TILE    = ENUM; ENUM++;
var THING_TYPE_ITEM    = ENUM; ENUM++;
var THING_TYPE_FARMBIT = ENUM; ENUM++;
var THING_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var TILE_TYPE_NULL      = ENUM; ENUM++;
var TILE_TYPE_LAND      = ENUM; ENUM++;
var TILE_TYPE_ROCK      = ENUM; ENUM++;
var TILE_TYPE_GRAVE     = ENUM; ENUM++;
var TILE_TYPE_SIGN      = ENUM; ENUM++;
var TILE_TYPE_LAKE      = ENUM; ENUM++;
var TILE_TYPE_SHORE     = ENUM; ENUM++;
var TILE_TYPE_FOREST    = ENUM; ENUM++;
var TILE_TYPE_HOME      = ENUM; ENUM++;
var TILE_TYPE_FARM      = ENUM; ENUM++;
var TILE_TYPE_LIVESTOCK = ENUM; ENUM++;
var TILE_TYPE_ROAD      = ENUM; ENUM++;
var TILE_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var TILE_STATE_NULL                = ENUM; ENUM++;
var TILE_STATE_HOME_VACANT         = ENUM; ENUM++;
var TILE_STATE_HOME_OCCUPIED       = ENUM; ENUM++;
var TILE_STATE_LAND_D0             = ENUM; ENUM++;
var TILE_STATE_LAND_D1             = ENUM; ENUM++;
var TILE_STATE_LAND_D2             = ENUM; ENUM++;
var TILE_STATE_FARM_UNPLANTED      = ENUM; ENUM++;
var TILE_STATE_FARM_PLANTED        = ENUM; ENUM++;
var TILE_STATE_FARM_GROWN          = ENUM; ENUM++;
var TILE_STATE_LIVESTOCK_EATING    = ENUM; ENUM++;
var TILE_STATE_LIVESTOCK_DIGESTING = ENUM; ENUM++;
var TILE_STATE_LIVESTOCK_MILKABLE  = ENUM; ENUM++;
var TILE_STATE_COUNT               = ENUM; ENUM++;

ENUM = 0;
var ITEM_TYPE_NULL       = ENUM; ENUM++;
var ITEM_TYPE_WATER      = ENUM; ENUM++;
var ITEM_TYPE_FOOD       = ENUM; ENUM++;
var ITEM_TYPE_POOP       = ENUM; ENUM++;
var ITEM_TYPE_FERTILIZER = ENUM; ENUM++;
var ITEM_TYPE_MILK       = ENUM; ENUM++;
var ITEM_TYPE_COUNT      = ENUM; ENUM++;

ENUM = 0;
var JOB_TYPE_NULL      = ENUM; ENUM++;
var JOB_TYPE_IDLE      = ENUM; ENUM++;
var JOB_TYPE_WAIT      = ENUM; ENUM++;
var JOB_TYPE_EAT       = ENUM; ENUM++;
var JOB_TYPE_SLEEP     = ENUM; ENUM++;
var JOB_TYPE_PLAY      = ENUM; ENUM++;
var JOB_TYPE_PLANT     = ENUM; ENUM++;
var JOB_TYPE_HARVEST   = ENUM; ENUM++;
var JOB_TYPE_FEED      = ENUM; ENUM++;
var JOB_TYPE_FERTILIZE = ENUM; ENUM++;
var JOB_TYPE_MILK      = ENUM; ENUM++;
var JOB_TYPE_EXPORT    = ENUM; ENUM++;
var JOB_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var JOB_STATE_NULL        = ENUM; ENUM++;
var JOB_STATE_GET         = ENUM; ENUM++;
var JOB_STATE_SEEK        = ENUM; ENUM++;
var JOB_STATE_ACT         = ENUM; ENUM++;
var JOB_STATE_COUNT       = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_STATE_NULL      = ENUM; ENUM++;
var FARMBIT_STATE_DIRE      = ENUM; ENUM++;
var FARMBIT_STATE_DESPERATE = ENUM; ENUM++;
var FARMBIT_STATE_MOTIVATED = ENUM; ENUM++;
var FARMBIT_STATE_CONTENT   = ENUM; ENUM++;
var FARMBIT_STATE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_NEED_NULL        = ENUM; ENUM++;
var FARMBIT_NEED_FULLNESS    = ENUM; ENUM++;
var FARMBIT_NEED_ENERGY      = ENUM; ENUM++;
var FARMBIT_NEED_JOY         = ENUM; ENUM++;
var FARMBIT_NEED_FULFILLMENT = ENUM; ENUM++;
var FARMBIT_NEED_COUNT       = ENUM; ENUM++;

ENUM = 0;
var DIRECTION_NULL  = ENUM; ENUM++;
var DIRECTION_R     = ENUM; ENUM++;
var DIRECTION_DR    = ENUM; ENUM++;
var DIRECTION_D     = ENUM; ENUM++;
var DIRECTION_DL    = ENUM; ENUM++;
var DIRECTION_L     = ENUM; ENUM++;
var DIRECTION_UL    = ENUM; ENUM++;
var DIRECTION_U     = ENUM; ENUM++;
var DIRECTION_UR    = ENUM; ENUM++;
var DIRECTION_COUNT = ENUM; ENUM++;

ENUM = 0;
var MARK_NULL  = ENUM; ENUM++;
var MARK_USE   = ENUM; ENUM++;
var MARK_SELL  = ENUM; ENUM++;
var MARK_FEED  = ENUM; ENUM++;
var MARK_COUNT = ENUM; ENUM++;

var buy_to_tile = function(buy)
{
  switch(buy)
  {
    case BUY_TYPE_HOME:      return TILE_TYPE_HOME;
    case BUY_TYPE_FARM:      return TILE_TYPE_FARM;
    case BUY_TYPE_LIVESTOCK: return TILE_TYPE_LIVESTOCK;
    case BUY_TYPE_SIGN:      return TILE_TYPE_SIGN;
    case BUY_TYPE_ROAD:      return TILE_TYPE_ROAD;
  }
  return TILE_TYPE_NULL;
}

var buy_to_item = function(buy)
{
  switch(buy)
  {
    case BUY_TYPE_FERTILIZER: return ITEM_TYPE_FERTILIZER;
    case BUY_TYPE_FOOD:       return ITEM_TYPE_FOOD;
  }
  return ITEM_TYPE_NULL;
}

var walkability_check = function(type,state)
{
  switch(type)
  {
    case TILE_TYPE_LAND:      return land_walkability;      break;
    case TILE_TYPE_ROCK:      return rock_walkability;      break;
    case TILE_TYPE_GRAVE:     return grave_walkability;     break;
    case TILE_TYPE_SIGN:      return sign_walkability;      break;
    case TILE_TYPE_LAKE:      return water_walkability;     break;
    case TILE_TYPE_SHORE:     return shore_walkability;     break;
    case TILE_TYPE_FOREST:    return forest_walkability;    break;
    case TILE_TYPE_HOME:      return home_walkability;      break;
    case TILE_TYPE_FARM:      return farm_walkability;      break;
    case TILE_TYPE_LIVESTOCK: return livestock_walkability; break;
    case TILE_TYPE_ROAD:      return road_walkability;      break;
  }
  return 1;
}


var buildability_check = function(building,over)
{
  switch(building)
  {
    case TILE_TYPE_LAND:
    case TILE_TYPE_ROCK:
    case TILE_TYPE_GRAVE:
    case TILE_TYPE_LAKE:
    case TILE_TYPE_SHORE:
    case TILE_TYPE_FOREST:
      return 1;
      break;
    case TILE_TYPE_HOME:
    case TILE_TYPE_FARM:
    case TILE_TYPE_LIVESTOCK:
      return over == TILE_TYPE_LAND;
      break;
    case TILE_TYPE_SIGN:
    {
      switch(over)
      {
        case TILE_TYPE_LAND:
        case TILE_TYPE_ROCK:
        case TILE_TYPE_SHORE:
          return 1;
          break;
        default:
          return 0;
          break;
      }
    }
    case TILE_TYPE_ROAD:
    {
      switch(over)
      {
        case TILE_TYPE_LAND:
        case TILE_TYPE_ROCK:
        case TILE_TYPE_LAKE:
        case TILE_TYPE_SHORE:
          return 1;
          break;
        default:
          return 0;
          break;
      }
    }
      break;
  }
}

var worth_for_item = function(item_type)
{
  switch(item_type)
  {
    case ITEM_TYPE_FOOD:     return item_worth_food;
    case ITEM_TYPE_POOP:     return item_worth_poop;
    case ITEM_TYPE_MILK:     return item_worth_milk;
    case ITEM_TYPE_FERTILIZER: console.log("BROKEN"); return 0;
    default: return 0;
  }
}

var need_met_for_above_job = function(need, job_type)
{
  //note- NO break'S! fallthrough means req for fulfillment that actually feeds still returns true!
  switch(need)
  {
    case FARMBIT_NEED_FULFILLMENT:
    {
      switch(job_type)
      {
        case JOB_TYPE_PLANT:
        case JOB_TYPE_HARVEST:
        case JOB_TYPE_FEED:
        case JOB_TYPE_FERTILIZE:
        case JOB_TYPE_MILK:
        case JOB_TYPE_EXPORT:
          return 1;
      }
    }
    case FARMBIT_NEED_JOY:
    {
      switch(job_type)
      {
        case JOB_TYPE_PLAY:
          return 1;
      }
    }
    case FARMBIT_NEED_ENERGY:
    {
      switch(job_type)
      {
        case JOB_TYPE_SLEEP:
          return 1;
      }
    }
    case FARMBIT_NEED_FULLNESS:
    {
      switch(job_type)
      {
        case JOB_TYPE_EAT:
        case JOB_TYPE_HARVEST:
        case JOB_TYPE_PLANT:
        case JOB_TYPE_FERTILIZE:
          return 1;
      }
    }
  }
  return 0;
}

var closest_edge_tile = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  var list = gg.b.tiles;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(!gg.b.tile_on_fudge_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_graveable_tile = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  var list = gg.b.tiles;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || !gg.b.tile_in_bounds(t)) continue;
    switch(t.type)
    {
      case  TILE_TYPE_LAND:
      case  TILE_TYPE_ROCK:
      case  TILE_TYPE_ROAD:
      case  TILE_TYPE_FOREST:
      case  TILE_TYPE_SHORE:
        break;
      case  TILE_TYPE_GRAVE:
      case  TILE_TYPE_SIGN:
      case  TILE_TYPE_LAKE:
      case  TILE_TYPE_HOME:
      case  TILE_TYPE_FARM:
      case  TILE_TYPE_LIVESTOCK:
        continue;
        break;
    }
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_tile_from_list = function(goal, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_nutrientsufficient_tile_from_list = function(goal, threshhold, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    var n = t.nutrition;
    if(t.fertilizer) n += t.fertilizer.state;
    if(t.lock || n < threshhold || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_milkable_tile_from_list = function(goal, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || t.state != TILE_STATE_LIVESTOCK_MILKABLE || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_nutrientdeficient_tile_from_list = function(goal, threshhold, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    var n = t.nutrition;
    if(t.fertilizer) n += t.fertilizer.state;
    if(t.lock || n >= threshhold || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_valdeficient_tile_from_list = function(goal, threshhold, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || t.val >= threshhold || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_state_tile_from_list = function(goal, state, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || t.state != state || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_item = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.lock || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_item_of_type = function(goal, type)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.lock || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_marked_item = function(goal,mark)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.lock || it.mark != mark || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_marked_item_of_type = function(goal,type,mark)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.lock || it.mark != mark || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_marked_state_item_of_type = function(goal, type, state, mark)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.state != state || it.lock || it.mark != mark || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}

var closest_free_farmbit_with_desire = function(goal, fullness, energy, joy, fulfillment)
{
  var best = 0;
  var b_rank = -1;
  var b_d = max_dist;
  var rank = -1;
  var d;
  var b;
  for(var i = 0; i < gg.farmbits.length; i++)
  {
    b = gg.farmbits[i];
    if(b.job_type != JOB_TYPE_IDLE) continue;

         if(fullness    && b.fullness_state    == FARMBIT_STATE_DESPERATE) rank = 8;
    else if(energy      && b.energy_state      == FARMBIT_STATE_DESPERATE) rank = 7;
    else if(joy         && b.joy_state         == FARMBIT_STATE_DESPERATE) rank = 6;
    else if(fulfillment && b.fulfillment_state == FARMBIT_STATE_DESPERATE) rank = 5;
    else if(fullness    && b.fullness_state    == FARMBIT_STATE_MOTIVATED) rank = 4;
    else if(energy      && b.energy_state      == FARMBIT_STATE_MOTIVATED) rank = 3;
    else if(joy         && b.joy_state         == FARMBIT_STATE_MOTIVATED) rank = 2;
    else if(fulfillment && b.fulfillment_state == FARMBIT_STATE_MOTIVATED) rank = 1;
    else                                                                   rank = -1;

         if(rank > b_rank) { b_d = max_dist; d = distsqr(goal.tx,goal.ty,b.tile.tx,b.tile.ty); }
    else if(rank < b_rank) {                 d = max_dist;                                     }
    else                   {                 d = distsqr(goal.tx,goal.ty,b.tile.tx,b.tile.ty); }

    if(d < b_d)
    {
      b_rank = rank;
      b_d = d;
      best = b;
    }
  }

  return best;
}

var farmbit_with_item = function(o)
{
  for(var i = 0; i < gg.farmbits.length; i++)
    if(gg.farmbits[i].item == o) return gg.farmbits[i];
  for(var i = 0; i < gg.farmbits.length; i++)
    if(gg.farmbits[i].job_object == o) return gg.farmbits[i];
  return 0;
}

var fullness_job_for_b = function(b)
{
  var t;
  var tp;
  var it;
  var itp;

  //eat item
  it = closest_unlocked_marked_item_of_type(b.tile,ITEM_TYPE_FOOD,MARK_USE);
  if(it)
  {
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_EAT;
    b.job_state = JOB_STATE_GET;
    return 1;
  }
  it = closest_unlocked_marked_item_of_type(b.tile,ITEM_TYPE_MILK,MARK_USE);
  if(it)
  {
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_EAT;
    b.job_state = JOB_STATE_GET;
    return 1;
  }

  //harvest
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_GROWN, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    b.go_idle();
    b.job_subject = t;
    b.lock_subject(b.job_subject);
    b.job_type = JOB_TYPE_HARVEST;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_marked_item_of_type(b.tile,ITEM_TYPE_WATER,MARK_USE);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_PLANT;
      b.job_state = JOB_STATE_GET;
      return 1;
    }
    else
    {
      tp = closest_unlocked_nutrientdeficient_tile_from_list(t, water_fouled_threshhold, gg.b.tile_groups[TILE_TYPE_LAKE]);
      if(tp)
      { //found lake
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_subject(b.job_subject);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
        return 1;
      }
    }
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_marked_item_of_type(t,ITEM_TYPE_POOP,MARK_USE);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
      return 1;
    }
  }

  return 0;
}

var energy_job_for_b = function(b)
{
  b.go_idle();
  b.job_type = JOB_TYPE_SLEEP;
  b.job_state = JOB_STATE_SEEK;
  return 1;
}

var joy_job_for_b = function(b)
{
  var t;
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, water_fouled_threshhold, gg.b.tile_groups[TILE_TYPE_LAKE]);
  if(t)
  {
    b.go_idle();
    b.job_subject = t;
    b.job_type = JOB_TYPE_PLAY;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }

  return 0;
}

var fulfillment_job_for_b = function(b)
{
  var t;
  var it;
  var tp;

  //feed
  t = closest_unlocked_valdeficient_tile_from_list(b.tile, livestock_feed_req, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
  if(t)
  {
    it = closest_unlocked_marked_item_of_type(t,ITEM_TYPE_FOOD,MARK_FEED);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FEED;
      b.job_state = JOB_STATE_GET;
      return 1;
    }
  }

  //harvest
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_GROWN, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    b.go_idle();
    b.job_subject = t;
    b.lock_subject(b.job_subject);
    b.job_type = JOB_TYPE_HARVEST;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_marked_item_of_type(b.tile,ITEM_TYPE_WATER,MARK_USE);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_PLANT;
      b.job_state = JOB_STATE_GET;
      return 1;
    }
    else
    {
      tp = closest_unlocked_nutrientdeficient_tile_from_list(t, water_fouled_threshhold, gg.b.tile_groups[TILE_TYPE_LAKE]);
      if(tp)
      { //found lake
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_subject(b.job_subject);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
        return 1;
      }
    }
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_marked_item_of_type(t,ITEM_TYPE_POOP,MARK_USE);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
      return 1;
    }
  }

  //milk
  t = closest_unlocked_milkable_tile_from_list(b.tile, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
  if(t)
  {
    b.go_idle();
    b.job_subject = t;
    b.lock_subject(b.job_subject);
    b.job_type = JOB_TYPE_MILK;
    b.job_state = JOB_STATE_SEEK;
    return 1;
  }

  //export
  it = closest_unlocked_marked_item(b.tile,MARK_SELL);
  if(it)
  { //found item
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_subject = closest_edge_tile(b.tile);
    b.job_type = JOB_TYPE_EXPORT;
    b.job_state = JOB_STATE_GET;
    if(it.type == ITEM_TYPE_FERTILIZER) console.log("BROKEN");
    return 1;
  }

  return 0;
}

var job_for_b = function(b)
{
  if(b.job_type != JOB_TYPE_IDLE) return; //already busy!

  if(b.fullness_state     == FARMBIT_STATE_DESPERATE && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_DESPERATE && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_DESPERATE && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_DESPERATE && fulfillment_job_for_b(b))  return;
  if(b.fullness_state     == FARMBIT_STATE_MOTIVATED && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_MOTIVATED && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_MOTIVATED && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_MOTIVATED && fulfillment_job_for_b(b))  return;
  return;
}

var b_for_job = function(job_type, job_subject, job_object)
{
  var b;
  var t;
  var it;
  switch(job_type)
  {
    case JOB_TYPE_NULL:
    case JOB_TYPE_IDLE:
    case JOB_TYPE_WAIT:
      console.log("FINISH");//figure out what to do
      break;
    case JOB_TYPE_EAT:
    {
      /*
      //priorities:
      closest low fullness farmbit
      */

      var best = closest_free_farmbit_with_desire(job_object.tile, 1, 0, 0, 0);
      if(best.fullness > fullness_content) return 0;
      if(best)
      {
        best.job_type = JOB_TYPE_EAT;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.lock_object(best.job_object);
        best.job_state = JOB_STATE_GET;
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_SLEEP:
    case JOB_TYPE_PLAY:
      console.log("FINISH"); //figure out what to do
      break;
    case JOB_TYPE_PLANT:
    case JOB_TYPE_HARVEST:
    {
      /*
      //priorities:
      closest low fullness bit
      closest low fulfillment bit
      */

      var best = closest_free_farmbit_with_desire(job_subject, 1, 0, 0, 1);
      if(best)
      {
        if(job_type == JOB_TYPE_PLANT && !job_object)
        { //get water
          job_object = closest_unlocked_marked_item_of_type(job_subject,ITEM_TYPE_WATER,MARK_USE);
          if(!job_object) job_object = closest_unlocked_nutrientdeficient_tile_from_list(job_subject, water_fouled_threshhold, gg.b.tile_groups[TILE_TYPE_LAKE]);
          if(!job_object) return 0;
        }

        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.lock_subject(best.job_subject);
        if(job_type == JOB_TYPE_PLANT)
        {
          best.job_state = JOB_STATE_GET;
          if(best.job_object.thing == THING_TYPE_ITEM) best.lock_object(best.job_object);
        }
        else if(job_type == JOB_TYPE_HARVEST)
        {
          best.job_state = JOB_STATE_SEEK;
        }
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FEED:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some livestock and some food and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_valdeficient_tile_from_list(job_object.tile, livestock_feed_req, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_marked_item_of_type(job_subject,ITEM_TYPE_FOOD,MARK_USE);
      if(!job_object) job_object = closest_unlocked_tile_from_list(job_subject, gg.b.tile_groups[TILE_TYPE_FOOD]);
      if(!job_object) return 0;

      var best = closest_free_farmbit_with_desire(job_object.tile, 0, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        if(best.job_object.thing == THING_TYPE_ITEM) best.lock_object(best.job_object);
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FERTILIZE:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_nutrientdeficient_tile_from_list(job_object.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_marked_item_of_type(job_subject,ITEM_TYPE_POOP,MARK_USE);
      if(!job_object) job_object = closest_unlocked_tile_from_list(job_subject, gg.b.tile_groups[TILE_TYPE_POOP]);
      if(!job_object) return 0;

      var best = closest_free_farmbit_with_desire(job_object.tile, 1, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        if(best.job_object.thing == THING_TYPE_ITEM) best.lock_object(best.job_object);
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    case JOB_TYPE_MILK:
    {
      if(!job_subject) job_subject = closest_unlocked_nutrientdeficient_tile_from_list(job_object.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
      if(!job_subject) return 0;

      var best = closest_free_farmbit_with_desire(job_subject, 0, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.lock_subject(best.job_subject);
        best.job_state = JOB_STATE_SEEK;
        return 1;
      }
    }
      break;
    case JOB_TYPE_EXPORT:
    {
      /*
      //priorities:
      closest low fulfillment bit
      */

      var best = closest_free_farmbit_with_desire(job_object.tile, 0, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_object = job_object;
        best.lock_object(best.job_object);
        best.job_subject = closest_edge_tile(job_object.tile);
        best.job_type = job_type;
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    default:
      break;
  }

  return 0;
}

var break_item = function(it)
{
  if(gg.inspector.detailed == it) gg.inspector.deselect();
  for(var i = 0; i < gg.items.length; i++)
    if(gg.items[i] == it) gg.items.splice(i,1);
}

var kick_item = function(it)
{
  var theta = rand()*twopi;
  var s = gg.b.walk_speed+rand()*gg.b.walk_speed;
  it.wvx = cos(theta)*s;
  it.wvy = sin(theta)*s;
  it.wvz = s/2;
}
var light_kick_item = function(it)
{
  var s = gg.b.walk_speed;
  it.wvz = s/2;
}

var tile = function()
{
  var self = this;
  self.thing = THING_TYPE_TILE;

  self.tile = self; //trick that allows all thing.tile to reference a tile
  self.shed = self; //<- set to tile corresponding to direction of flow in rainfall
  self.shed_d = 999;
  self.directions = [];
  self.directions_dirty = 1;
  self.fertilizer = 0;
  self.feed = 0;
  self.tx = 0;
  self.ty = 0;
  self.i = 0;
  self.og_type = TILE_TYPE_LAND;
  self.type = TILE_TYPE_LAND;
  self.owned = 0;
  self.shoreline = 0;
  self.state = TILE_STATE_LAND_D0+floor(bias0(bias0(bias0(rand())))*land_detail_levels*0.99);
  self.state_t = 0;
  self.fx_t = 0;
  self.val = 0;
  self.nutrition = 0;
  //self.known_nutrition = 0;
  //self.known_nutrition_d = 0;
  //self.known_nutrition_t = 0;
  self.marks = [];
  for(var i = 0; i < 4; i++) self.marks[i] = MARK_USE;
  self.lock = 0;
  self.wx = 0;
  self.wy = 0;
  //only calc'd/updated on 'screen_tile'
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
}

var board = function()
{
  var self = this;

  self.atlas;
  self.atlas_i = [];
  self.timer_atlas;
  self.timer_progressions = 50;
  self.timer_colors = 20;
  self.timer_atlas_i = function(progress,color) { return floor((self.timer_colors-1)*color)*self.timer_progressions+floor((self.timer_progressions-1)*progress); };
  self.nutrition_atlas;
  self.nutrition_atlas_i = [];

  self.up_ptt = [];
  self.up_pt = [];
  self.up_px = [];
  self.up_py = [];
  self.down_pti = [];
  self.down_pt = [];
  self.down_px = [];
  self.down_py = [];
  self.buy_ptt = [];
  self.buy_pn = [];
  self.buy_pt = [];
  self.sell_ptt = [];
  self.sell_pn = [];
  self.sell_pt = [];

  self.up_p = function(t,x,y)
  {
    self.up_ptt.push(t);
    self.up_pt.push(0);
    self.up_px.push(x);
    self.up_py.push(y);
  }
  self.down_p = function(i,x,y)
  {
    self.down_pti.push(i);
    self.down_pt.push(0);
    self.down_px.push(x);
    self.down_py.push(y);
  }
  self.buy_p = function(t,n)
  {
    self.buy_ptt.push(t);
    self.buy_pn.push(n);
    self.buy_pt.push(0);
  }
  self.sell_p = function(t,n)
  {
    self.sell_ptt.push(t);
    self.sell_pn.push(n);
    self.sell_pt.push(0);
  }

  self.resize = function()
  {
    self.min_draw_tw = floor(self.w/self.tw);
    self.min_draw_th = floor(self.h/self.th)+floor(self.h/self.th/4);
    var total_tw = self.min_draw_tw*2+1;
    var total_th = self.min_draw_th*2+1;

    //tile atlas
    {
      if(self.atlas) self.atlas.destroy();
      self.atlas = new atlas();
      self.atlas.init(total_tw*TILE_TYPE_COUNT,total_th);

      var x = 0;
      var y = 0;
      var ctx = self.atlas.context;
      var tx = 0;
      var ty = 0;
      var tw = 0;
      var th = 0;
      var next = function()
      {
        self.atlas.nextAtlas();
        x = 0;
        y = 0;
        ctx = self.atlas.context;
        tx = 0;
        ty = 0;
        tw = 0;
        th = 0;
      }
      for(var i = 0; i < TILE_TYPE_COUNT; i++)
      {
        if(i == TILE_TYPE_LAND || i == TILE_TYPE_LIVESTOCK) continue; //special
        ctx.fillStyle = self.tile_color(i);
        tx = x;
        ty = y;
        tw = self.min_draw_tw;
        th = self.min_draw_th;
        self.atlas_i[i] = self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(self.tile_img(i),tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(self.tile_img(i),tx,ty,tw,th);
        self.atlas.commitSprite();
        tx = x;
        ty += self.min_draw_th;
        tw = self.min_draw_tw;
        th = self.min_draw_th+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(self.tile_img(i),tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(self.tile_img(i),tx,ty,tw,th);
        self.atlas.commitSprite();
        x += total_tw;
      }
      next();

      for(var i = 0; i < tile_land_imgs.length; i++)
      {
        ctx.fillStyle = self.tile_color(TILE_TYPE_LAND);
        tx = x;
        ty = y;
        tw = self.min_draw_tw;
        th = self.min_draw_th;
        self.atlas_i[TILE_TYPE_COUNT+i] = self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(tile_land_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(tile_land_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx = x;
        ty += self.min_draw_th;
        tw = self.min_draw_tw;
        th = self.min_draw_th+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(tile_land_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(tile_land_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        x += total_tw;
        if(x >= self.atlas.w) next();
      }
      next();

      for(var i = 0; i < tile_livestock_imgs.length; i++)
      {
        ctx.fillStyle = self.tile_color(TILE_TYPE_LIVESTOCK);
        tx = x;
        ty = y;
        tw = self.min_draw_tw;
        th = self.min_draw_th;
        self.atlas_i[TILE_TYPE_COUNT+livestock_off(i)] = self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(tile_livestock_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
        ctx.drawImage(tile_livestock_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx = x;
        ty += self.min_draw_th;
        tw = self.min_draw_tw;
        th = self.min_draw_th+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(tile_livestock_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        tx += self.min_draw_tw;
        tw = self.min_draw_tw+1;
        self.atlas.getWholeSprite(tx,ty,tw,th);
        ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
        ctx.drawImage(tile_livestock_imgs[i],tx,ty,tw,th);
        self.atlas.commitSprite();
        x += total_tw;
        if(x >= self.atlas.w) next();
      }
      //next(); //because it commits next anyways

      self.atlas.commit();
    }

    //nutrition atlas
    {
      if(self.nutrition_atlas) self.nutrition_atlas.destroy();
      self.nutrition_atlas = new atlas();
      var nutrition_atlas_stack = 4;
      self.nutrition_atlas.init(total_tw*nutrition_overlay_frames*nutrition_atlas_stack,total_th*(ceil(nutrition_overlay_levels/nutrition_atlas_stack)+1));

      var x = 0;
      var y = 0;
      var ctx = self.nutrition_atlas.context;
      var tx = 0;
      var ty = 0;
      var tw = 0;
      var th = 0;
      var color = {r:0,g:0,b:0};
      var cwhite = color_str_to_obj("#FFFFFF")
      var cpink = color_str_to_obj(nutrition_color);
      var alpha = 0.5;
      for(var i = 0; i < nutrition_overlay_levels; i++)
      {
        color.r = lerp(cwhite.r,cpink.r,i/nutrition_overlay_levels);
        color.g = lerp(cwhite.g,cpink.g,i/nutrition_overlay_levels);
        color.b = lerp(cwhite.b,cpink.b,i/nutrition_overlay_levels);
        ctx.fillStyle = RGB2Hex(color);
        //ctx.fillStyle = nutrition_color;
        ctx.fillStyle = "#AF235C";
        alpha = i/nutrition_overlay_levels;
        for(var j = 0; j < nutrition_overlay_frames; j++)
        {
          //ctx.fillStyle = white;
          tx = x;
          ty = y;
          tw = self.min_draw_tw;
          th = self.min_draw_th;
          if(j == 0) self.nutrition_atlas_i[i] = self.nutrition_atlas.getWholeSprite(tx,ty,tw,th);
          else self.nutrition_atlas.getWholeSprite(tx,ty,tw,th)
          //ctx.fillStyle = red;
          ctx.globalAlpha = alpha;
          ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
          ctx.globalAlpha = 1;
          ctx.drawImage(nutrition_imgs[i*nutrition_overlay_frames+j],tx,ty,tw,th);
          self.nutrition_atlas.commitSprite();
          tx += self.min_draw_tw;
          tw = self.min_draw_tw+1;
          self.nutrition_atlas.getWholeSprite(tx,ty,tw,th);
          //ctx.fillStyle = orange;
          ctx.globalAlpha = alpha;
          ctx.fillRect(tx,ty+th-self.min_draw_tw,tw,self.min_draw_tw);
          ctx.globalAlpha = 1;
          ctx.drawImage(nutrition_imgs[i*nutrition_overlay_frames+j],tx,ty,tw,th);
          self.nutrition_atlas.commitSprite();
          tx = x;
          ty += self.min_draw_th;
          tw = self.min_draw_tw;
          th = self.min_draw_th+1;
          self.nutrition_atlas.getWholeSprite(tx,ty,tw,th);
          //ctx.fillStyle = yellow;
          ctx.globalAlpha = alpha;
          ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
          ctx.globalAlpha = 1;
          ctx.drawImage(nutrition_imgs[i*nutrition_overlay_frames+j],tx,ty,tw,th);
          self.nutrition_atlas.commitSprite();
          tx += self.min_draw_tw;
          tw = self.min_draw_tw+1;
          self.nutrition_atlas.getWholeSprite(tx,ty,tw,th);
          //ctx.fillStyle = green;
          ctx.globalAlpha = alpha;
          ctx.fillRect(tx,ty+th-(self.min_draw_tw+1),tw,(self.min_draw_tw+1));
          ctx.globalAlpha = 1;
          ctx.drawImage(nutrition_imgs[i*nutrition_overlay_frames+j],tx,ty,tw,th);
          self.nutrition_atlas.commitSprite();
          x += total_tw;
        }
        if(i % nutrition_atlas_stack == 0)
        {
          y += total_th;
          x = 0;
        }
      }

      self.nutrition_atlas.commit();
      /*
      for(var i = 0; i < nutrition_imgs.length; i++)
      {
        nutrition_imgs[i].width = 0;
        nutrition_imgs[i].height = 0;
        nutrition_imgs[i] = 0;
      }
      */
    }

    //timer atlas
    {
      if(self.timer_atlas) self.timer_atlas.destroy();
      self.timer_atlas = new atlas();
      var timer_s = floor(self.min_draw_tw*0.6);
      var timer_c = floor(timer_s/2);
      var timer_r = floor(timer_c*0.8);
      self.timer_atlas.init(timer_s*self.timer_progressions,timer_s*(self.timer_colors+1));
      ctx = self.timer_atlas.context;

      x = 0;
      y = 0;
      var nutrition = color_str_to_obj(nutrition_color);
      var black     = {r:0,g:0,b:0};
      var color     = {r:0,g:0,b:0};
      var ct = 0;
      var fillColor = "";
      ctx.strokeStyle = "#000000";;
      ctx.lineWidth = timer_r*0.1;
      for(var i = 0; i < self.timer_colors; i++)
      {
        ct = i/(self.timer_colors-1);
        color.r = lerp(black.r,nutrition.r,ct);
        color.g = lerp(black.g,nutrition.g,ct);
        color.b = lerp(black.b,nutrition.b,ct);
        fillColor = RGB2Hex(color);
        for(var j = 0; j < self.timer_progressions; j++)
        {
          self.timer_atlas.getWholeSprite(x,y,timer_s,timer_s);
          ctx.beginPath();
          ctx.arc(x+timer_c,y+timer_c,timer_r,0,twopi);
          ctx.fillStyle = white;
          ctx.fill();
          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.moveTo(x+timer_c,y+timer_c);
          ctx.lineTo(x+timer_c,y+timer_c-timer_r);
          ctx.arc(x+timer_c,y+timer_c,timer_r,0-halfpi,twopi*((j+1)/self.timer_progressions)-halfpi);
          ctx.lineTo(x+timer_c,y+timer_c);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x+timer_c,y+timer_c,timer_r,0,twopi);
          ctx.stroke();
          self.timer_atlas.commitSprite();
          x += timer_s;
        }
        y += timer_s;
        x = 0;
      }
      //non-colored timer
      for(var j = 0; j < self.timer_progressions; j++)
      {
        self.timer_atlas.getWholeSprite(x,y,timer_s,timer_s);
        ctx.beginPath();
        ctx.arc(x+timer_c,y+timer_c,timer_r,0,twopi);
        ctx.fillStyle = white;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#000000";;
        ctx.beginPath();
        ctx.moveTo(x+timer_c,y+timer_c);
        ctx.lineTo(x+timer_c,y+timer_c-timer_r);
        ctx.arc(x+timer_c,y+timer_c,timer_r,0-halfpi,twopi*((j+1)/self.timer_progressions)-halfpi);
        ctx.lineTo(x+timer_c,y+timer_c);
        ctx.fill();
        self.timer_atlas.commitSprite();
        x += timer_s;
      }

      self.timer_atlas.commit();
    }

  }

  self.tw = board_w;
  self.th = board_h;
  self.bounds_tx = floor(self.tw*3/8);
  self.bounds_ty = floor(self.th*3/8);
  self.bounds_tw = floor(self.tw*1/4);
  self.bounds_th = floor(self.th*1/4);
  self.bounds_n = 1;
  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;
  self.tww = self.ww/self.tw;
  self.twh = self.wh/self.th;

  self.null_tile = new tile();
  self.scratch_tile = new tile();
  self.tiles = [];
  self.og_types = []; //for serialization
  self.stamp_nutrition = []; //for serialization
  self.structure_deltas = []; //for serialization
  self.center_tile = 0;
  self.tile_groups = [];
  self.tiles_i = function(tx,ty)
  {
    return self.tw*ty+tx;
  }
  self.tiles_t = function(tx,ty)
  {
    var i = self.tiles_i(tx,ty);
    return self.tiles[i];
  }
  self.bounded_tiles_t = function(tx,ty)
  {
    if(tx <  self.bounds_tx)                return self.null_tile;
    if(ty <  self.bounds_ty)                return self.null_tile;
    if(tx >= self.bounds_tx+self.bounds_tw) return self.null_tile;
    if(ty >= self.bounds_ty+self.bounds_th) return self.null_tile;
    return self.tiles_t(tx,ty);
  }
  self.safe_tiles_t = function(tx,ty)
  {
    if(tx <  0)       return self.null_tile;
    if(ty <  0)       return self.null_tile;
    if(tx >= self.tw) return self.null_tile;
    if(ty >= self.th) return self.null_tile;
    return self.tiles_t(tx,ty);
  }
  self.tiles_wt = function(wx,wy)
  {
    var tx = clamp(0,self.tw-1,floor(mapVal(self.wx-self.ww/2, self.wx+self.ww/2, 0, self.tw, wx)));
    var ty = clamp(0,self.th-1,floor(mapVal(self.wy-self.wh/2, self.wy+self.wh/2, 0, self.th, wy)));
    return self.tiles_t(tx,ty);
  }
  self.bounded_tiles_wt = function(wx,wy)
  {
    var tx = clamp(0,self.tw-1,floor(mapVal(self.wx-self.ww/2, self.wx+self.ww/2, 0, self.tw, wx)));
    var ty = clamp(0,self.th-1,floor(mapVal(self.wy-self.wh/2, self.wy+self.wh/2, 0, self.th, wy)));
    return self.bounded_tiles_t(tx,ty);
  }
  self.tiles_tw = function(t,w)
  {
    w.wx = self.wx-self.ww/2+((t.tx+0.5)*self.ww/self.tw);
    w.wy = self.wy-self.wh/2+((t.ty+0.5)*self.wh/self.th);
  }

  self.world_tile = function(t)
  {
    t.wx = self.wx-self.ww/2+((t.tx+0.5)*self.tww);
    t.wy = self.wy-self.wh/2+((t.ty+0.5)*self.twh);
    return t;
  }
  self.screen_tile = function(t)
  {
    t.w = self.w/self.tw;
    t.h = self.h/self.th;
    t.y = round(self.y+self.h-(t.ty+1)*t.h);
    t.x = round(self.x+(t.tx*t.w));
    return t;
  }

  self.tile_in_bounds = function(t)
  {
    if(
      t.tx < self.bounds_tx ||
      t.ty < self.bounds_ty ||
      t.tx >= self.bounds_tx+self.bounds_tw ||
      t.ty >= self.bounds_ty+self.bounds_th ||
      0)
      return 0;
    return 1;
  }
  self.tile_on_fudge_bounds = function(t) //will technically get tic-tac-toe board pattern, but when paired with "closest", will return on-bounds
  {
    if(
      t.tx == self.bounds_tx ||
      t.ty == self.bounds_ty ||
      t.tx == self.bounds_tx+self.bounds_tw-1 ||
      t.ty == self.bounds_ty+self.bounds_th-1 ||
      0)
      return 1;
    return 0;
  }

  self.rain_t = 0;
  self.raining = 0;
  self.autorain = 0;
  self.nutrition_view = 0;
  self.spewing_road = 0;

  self.walk_speed = min(self.tww,self.twh)/road_walkability; //MUST BE < tile_w/max_walk_modifier
  self.walk_speed = self.walk_speed/5; //as long as its < self.walk_speed, we're good

  self.boundw = function(o)
  {
    if(o.wx < self.wx-self.ww/2+self.tww* self.bounds_tx)                 o.wx = self.wx-self.ww/2+self.tww* self.bounds_tx                +0.1;
    if(o.wx > self.wx-self.ww/2+self.tww*(self.bounds_tx+self.bounds_tw)) o.wx = self.wx-self.ww/2+self.tww*(self.bounds_tx+self.bounds_tw)-0.1;
    if(o.wy < self.wy-self.wh/2+self.twh* self.bounds_ty)                 o.wy = self.wy-self.wh/2+self.twh* self.bounds_ty                +0.1;
    if(o.wy > self.wy-self.wh/2+self.twh*(self.bounds_ty+self.bounds_th)) o.wy = self.wy-self.wh/2+self.twh*(self.bounds_ty+self.bounds_th)-0.1;
  }

  self.inc_bounds = function()
  {
    if(self.bounds_tx > 0)       self.bounds_tx--;
    if(self.bounds_tw < self.tw) self.bounds_tw++;
    if(self.bounds_tw < self.tw) self.bounds_tw++;
    if(self.bounds_ty > 0) self.bounds_ty--;
    if(self.bounds_th < self.th) self.bounds_th++;
    if(self.bounds_th < self.th) self.bounds_th++;
  }
  self.zoom_bounds = function(cam)
  {
    cam.ww = gg.canvas.width;
    cam.wh = gg.canvas.height;

    var tw = ceil(self.bounds_tw+self.bounds_tw/ 2);
    var th = ceil(self.bounds_th+self.bounds_th/8);
    var ww = self.ww*tw/self.tw;
    var wh = self.wh*th/self.th;

    if(ww/wh > cam.ww/cam.wh) //cam too short
      wh = ww*cam.wh/cam.ww;
    else //cam too thin
      ww = wh*cam.ww/cam.wh;

    if(cam.ww > ww)
    {
      cam.wh *= ww/cam.ww;
      cam.ww *= ww/cam.ww;
    }
    if(cam.wh > wh)
    {
      cam.ww *= wh/cam.wh;
      cam.wh *= wh/cam.wh;
    }
    cam.wx = self.wx-self.ww/2+(self.bounds_tx+self.bounds_tw/2)*self.tww;
    cam.wy = self.wy-self.wh/2+(self.bounds_ty+self.bounds_tw/2)*self.twh+(cam.wh-self.bounds_th*self.twh)/3;

    screenSpace(cam, gg.canvas, self);
    self.screen_bounds(cam);
  }
  self.screen_bounds = function(cam)
  {
    self.cloud_x = 0;
    self.cloud_y = 0;
    self.cloud_w = clouds_img.width;
    self.cloud_h = clouds_img.height;
    self.cloud_ix = 100;
    self.cloud_iy = 150;
    self.cloud_iw = 2550;
    self.cloud_ih = 2250;

    self.bounds_w = (self.bounds_tw/self.tw)*self.w;
    self.bounds_h = (self.bounds_th/self.th)*self.h;
    self.bounds_x = self.x+       (self.bounds_tx/self.tw)*self.w;
    self.bounds_y = self.y+self.h-(self.bounds_ty/self.th)*self.h-self.bounds_h;

    self.cbounds_w = ((self.bounds_tw+1)/self.tw)*self.w;
    self.cbounds_h = ((self.bounds_th+1)/self.th)*self.h;
    self.cbounds_x = self.x+       ((self.bounds_tx-0.5)/self.tw)*self.w;
    self.cbounds_y = self.y+self.h-((self.bounds_ty-0.5)/self.th)*self.h-self.cbounds_h;

    var wr = self.cbounds_w/self.cloud_iw;
    var hr = self.cbounds_h/self.cloud_ih;

    self.cloud_w *= wr;
    self.cloud_h *= hr;
    self.cloud_x = self.cbounds_x-self.cloud_ix*wr;
    self.cloud_y = self.cbounds_y-self.cloud_iy*hr;
    self.cloud_x = round(self.cloud_x);
    self.cloud_y = round(self.cloud_y);
    self.cloud_w = round(self.cloud_w);
    self.cloud_h = round(self.cloud_h);
    self.set_cam();
  }
  self.set_cam = function()
  {
    var rbwx = self.wx-self.ww/2+((self.bounds_tx+self.bounds_tw+8)/self.tw)*self.ww;
    var lbwx = self.wx-self.ww/2+((self.bounds_tx               -8)/self.tw)*self.ww;
    var bww = rbwx-lbwx;
    var tbwy = self.wy-self.wh/2+((self.bounds_ty+self.bounds_th+4)/self.th)*self.wh;
    var bbwy = self.wy-self.wh/2+((self.bounds_ty               -3)/self.th)*self.wh;
    var bwh = tbwy-bbwy;

    if(bww > gg.cam.ww)
    {
      if(gg.cam.wx+gg.cam.ww/2 > rbwx) gg.cam.wx = rbwx-gg.cam.ww/2;
      if(gg.cam.wx-gg.cam.ww/2 < lbwx) gg.cam.wx = lbwx+gg.cam.ww/2;
    }
    else
    {
      if(gg.cam.wx+gg.cam.ww/2 < rbwx) gg.cam.wx = rbwx-gg.cam.ww/2;
      if(gg.cam.wx-gg.cam.ww/2 > lbwx) gg.cam.wx = lbwx+gg.cam.ww/2;
    }

    if(bwh > gg.cam.wh)
    {
      if(gg.cam.wy+gg.cam.wh/2 > tbwy) gg.cam.wy = tbwy-gg.cam.wh/2;
      if(gg.cam.wy-gg.cam.wh/2 < bbwy) gg.cam.wy = bbwy+gg.cam.wh/2;
    }
    else
    {
      if(gg.cam.wy+gg.cam.wh/2 < tbwy) gg.cam.wy = tbwy-gg.cam.wh/2;
      if(gg.cam.wy-gg.cam.wh/2 > bbwy) gg.cam.wy = bbwy+gg.cam.wh/2;
    }
  }

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.visit_t = 0;

  self.hovering;
  self.hover_t;
  self.hover_t_placable;
  self.hover_x = 0;
  self.hover_y = 0;

  var direction_insert = function(index,directions,flow_d,list)
  {
    for(var i = 0; i < list.length; i++)
      if(flow_d[index] > flow_d[list[i]]) { list.splice(i,0,index); return; }
    list.push(index); //closest
  }
  var handle = function(cindex,directions,flow_v,flow_d,nindex,tax,list)
  {
    if(!flow_v[nindex])
    {
      var nt = gg.b.tiles[nindex];
      flow_v[nindex] = 1;
      flow_d[nindex] = flow_d[cindex]+(1/walkability_check(nt.type))*tax;
      direction_insert(nindex,directions,flow_d,list);
    }
  }
  var flow_v = [];
  var flow_d = [];
  self.calculate_directions = function(t)
  {
    var check = []; //holds INDEXES; closest at _end_ for quick pop
    for(var i = 0; i < t.directions.length; i++) { flow_v[i] = 0; flow_d[i] = max_dist; }
    var cindex;
    var ct;
    var cd;
    var diagonal_tax = 1.4;
    var signs = gg.b.tile_groups[TILE_TYPE_SIGN];
    var sign_tax;
    var sign_d;

    cindex = t.i;
    cd = t.directions[cindex];

    flow_v[cindex] = 1;
    flow_d[cindex] = 0;

    check.push(cindex);

    while(check.length)
    {
      cindex = check.pop();
      ct = gg.b.tiles[cindex];
      cd = t.directions[cindex];
      sign_tax = 1;
      for(var i = 0; i < signs.length; i++)
      {
        sign_d = lensqr(signs[i].tx-ct.tx,signs[i].ty-ct.ty);
        if(sign_d < 10) sign_tax += 5/sign_d;
      }
      if(ct.ty > 0)
      {
        if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw-1,diagonal_tax*sign_tax,check); //check bottom left
                              handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw,             1*sign_tax,check); //check bottom
        if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw+1,diagonal_tax*sign_tax,check); //check bottom right
      }
      if(ct.ty < self.th-1)
      {
        if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw-1,diagonal_tax*sign_tax,check); //check top left
                              handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw,             1*sign_tax,check); //check top
        if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw+1,diagonal_tax*sign_tax,check); //check top right
      }
      if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex-1,1*sign_tax,check); //check left
      if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex+1,1*sign_tax,check); //check right
    }

    for(var i = 0; i < t.directions.length; i++)
    {
      var ct = self.tiles[i];
      var lowest_d = max_dist;
      if(ct.ty > 0) //bottom
      {
        if(ct.tx > 0         && flow_d[i-self.tw-1] < lowest_d) { t.directions[i] = DIRECTION_DL; lowest_d = flow_d[i-self.tw-1]; } //bottom left
        if(                     flow_d[i-self.tw  ] < lowest_d) { t.directions[i] = DIRECTION_D;  lowest_d = flow_d[i-self.tw  ]; } //bottom
        if(ct.tx < self.tw-1 && flow_d[i-self.tw+1] < lowest_d) { t.directions[i] = DIRECTION_DR; lowest_d = flow_d[i-self.tw+1]; } //bottom right
      }
      if(ct.ty < self.th-1) //top
      {
        if(ct.tx > 0         && flow_d[i+self.tw-1] < lowest_d) { t.directions[i] = DIRECTION_UL; lowest_d = flow_d[i+self.tw-1]; } //top left
        if(                     flow_d[i+self.tw  ] < lowest_d) { t.directions[i] = DIRECTION_U;  lowest_d = flow_d[i+self.tw  ]; } //top
        if(ct.tx < self.tw-1 && flow_d[i+self.tw+1] < lowest_d) { t.directions[i] = DIRECTION_UR; lowest_d = flow_d[i+self.tw+1]; } //top right
      }
        if(ct.tx > 0         && flow_d[i-1        ] < lowest_d) { t.directions[i] = DIRECTION_L; lowest_d = flow_d[i-1        ]; } //left
        if(ct.tx < self.tw-1 && flow_d[i+1        ] < lowest_d) { t.directions[i] = DIRECTION_R; lowest_d = flow_d[i+1        ]; } //right
    }
    t.directions[t.i] = DIRECTION_NULL;
    t.directions_dirty = 0;
  }
  self.dirty_directions = function()
  {
    for(var i = 0; i < self.tiles.length; i++)
      self.tiles[i].directions_dirty = 1;
  }

  self.tile_img = function(type)
  {
    switch(type)
    {
      case TILE_TYPE_LAND:      return tile_land_img; break;
      case TILE_TYPE_LAKE:      return tile_lake_img; break;
      case TILE_TYPE_SHORE:     return tile_shore_img; break;
      case TILE_TYPE_LIVESTOCK: return tile_livestock_img; break;
      case TILE_TYPE_ROAD:      return tile_road_img; break;
      case TILE_TYPE_ROCK:      return tile_rock_img; break;
      case TILE_TYPE_GRAVE:     return tile_grave_img; break;
      case TILE_TYPE_SIGN:      return tile_sign_img; break;
      case TILE_TYPE_FOREST:    return tile_forest_img; break;
      case TILE_TYPE_HOME:      return tile_home_img; break;
      case TILE_TYPE_FARM:      return tile_farm_img; break;
    }
    return tile_land_img;
  }
  self.tile_color = function(type)
  {
    switch(type)
    {
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_HOME:      return "rgba(0,0,0,0)"; break;
      case TILE_TYPE_LAND:      return "#BBD86F"; break;
      case TILE_TYPE_LAKE:      return "#AAE9DA"; break;
      case TILE_TYPE_SHORE:     return "#FEF8D3"; break;
      case TILE_TYPE_ROCK:      return "#D4C0AB"; break;
      case TILE_TYPE_FOREST:    return "#A8D384"; break;
      case TILE_TYPE_FARM:      return "#D8C44B"; break;
    }
    return "rgba(0,0,0,0)";
  }
  self.tile_name = function(type)
  {
    switch(type)
    {
      case TILE_TYPE_NULL:      return loc[lang]["tile_Null"];   break;
      case TILE_TYPE_LAND:      return loc[lang]["tile_Land"];   break;
      case TILE_TYPE_ROCK:      return loc[lang]["tile_Rock"];   break;
      case TILE_TYPE_GRAVE:     return loc[lang]["tile_Grave"];  break;
      case TILE_TYPE_SIGN:      return loc[lang]["tile_Sign"];   break;
      case TILE_TYPE_LAKE:      return loc[lang]["tile_Lake"];   break;
      case TILE_TYPE_SHORE:     return loc[lang]["tile_Shore"];  break;
      case TILE_TYPE_FOREST:    return loc[lang]["tile_Forest"]; break;
      case TILE_TYPE_HOME:      return loc[lang]["tile_Home"];   break;
      case TILE_TYPE_FARM:      return loc[lang]["tile_Farm"];   break;
      case TILE_TYPE_LIVESTOCK: return loc[lang]["tile_Dairy"];  break;
      case TILE_TYPE_ROAD:      return loc[lang]["tile_Road"];   break;
      case TILE_TYPE_COUNT:     return loc[lang]["tile_Count"];  break;
    }
  }
  self.state_name = function(type)
  {
    switch(type)
    {
      case TILE_STATE_NULL:                return loc[lang]["tilestate_Null"];       break;
      case TILE_STATE_HOME_VACANT:         return loc[lang]["tilestate_Vacant"];     break;
      case TILE_STATE_HOME_OCCUPIED:       return loc[lang]["tilestate_Occupied"];   break;
      case TILE_STATE_FARM_UNPLANTED:      return loc[lang]["tilestate_Unplanted"];  break;
      case TILE_STATE_FARM_PLANTED:        return loc[lang]["tilestate_Planted"];    break;
      case TILE_STATE_FARM_GROWN:          return loc[lang]["tilestate_Grown"];      break;
      case TILE_STATE_LIVESTOCK_EATING:    return loc[lang]["tilestate_Digesting"];  break;
      case TILE_STATE_LIVESTOCK_DIGESTING: return loc[lang]["tilestate_Digesting"];  break;
      case TILE_STATE_LIVESTOCK_MILKABLE:  return loc[lang]["tilestate_Milkable"];   break;
      case TILE_STATE_COUNT:               return loc[lang]["tilestate_Null"];       break;
    }
  }
  self.item_img = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_WATER:      return tile_water_img;      break;
      case ITEM_TYPE_FOOD:       return tile_food_img;       break;
      case ITEM_TYPE_POOP:       return tile_poop_img;       break;
      case ITEM_TYPE_MILK:       return tile_milk_img;       break;
      case ITEM_TYPE_FERTILIZER: return tile_fertilizer_img; break;
    }
  }
  self.item_sell_img = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_WATER:      return tile_water_sell_img;      break;
      case ITEM_TYPE_FOOD:       return tile_food_sell_img;       break;
      case ITEM_TYPE_POOP:       return tile_poop_sell_img;       break;
      case ITEM_TYPE_MILK:       return tile_milk_sell_img;       break;
      case ITEM_TYPE_FERTILIZER: return tile_fertilizer_sell_img; break;
    }
  }
  self.item_feed_img = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_WATER:      return tile_water_feed_img;      break;
      case ITEM_TYPE_FOOD:       return tile_food_feed_img;       break;
      case ITEM_TYPE_POOP:       return tile_poop_feed_img;       break;
      case ITEM_TYPE_MILK:       return tile_milk_feed_img;       break;
      case ITEM_TYPE_FERTILIZER: return tile_fertilizer_feed_img; break;
    }
  }
  self.item_name = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_NULL:       return loc[lang]["item_Null"];       break;
      case ITEM_TYPE_WATER:      return loc[lang]["item_Water"];      break;
      case ITEM_TYPE_FOOD:       return loc[lang]["item_Corn"];       break;
      case ITEM_TYPE_POOP:       return loc[lang]["item_Manure"];     break;
      case ITEM_TYPE_MILK:       return loc[lang]["item_Milk"];       break;
      case ITEM_TYPE_FERTILIZER: return loc[lang]["item_Fertilizer"]; break;
      case ITEM_TYPE_COUNT:      return loc[lang]["item_Count"];      break;
    }
  }
  self.job_name = function(type)
  {
    switch(type)
    {
      case JOB_TYPE_NULL:      return loc[lang]["job_Null"];      break;
      case JOB_TYPE_IDLE:      return loc[lang]["job_Idle"];      break;
      case JOB_TYPE_WAIT:      return loc[lang]["job_Wait"];      break;
      case JOB_TYPE_EAT:       return loc[lang]["job_Eat"];       break;
      case JOB_TYPE_SLEEP:     return loc[lang]["job_Sleep"];     break;
      case JOB_TYPE_PLAY:      return loc[lang]["job_Play"];      break;
      case JOB_TYPE_PLANT:     return loc[lang]["job_Plant"];     break;
      case JOB_TYPE_HARVEST:   return loc[lang]["job_Harvest"];   break;
      case JOB_TYPE_FERTILIZE: return loc[lang]["job_Fertilize"]; break;
      case JOB_TYPE_MILK:      return loc[lang]["job_Milk"];      break;
      case JOB_TYPE_EXPORT:    return loc[lang]["job_Export"];    break;
      case JOB_TYPE_COUNT:     return loc[lang]["job_Count"];     break;
    }
  }
  self.job_state_name = function(state)
  {
    switch(state)
    {
      case JOB_STATE_NULL:        return loc[lang]["jobstate_Null"];   break;
      case JOB_STATE_GET:         return loc[lang]["jobstate_Get"];    break;
      case JOB_STATE_SEEK:        return loc[lang]["jobstate_Seek"];   break;
      case JOB_STATE_ACT:         return loc[lang]["jobstate_Act"];    break;
      case JOB_STATE_IDLE_CHILL:  return loc[lang]["jobstate_Chill"];  break;
      case JOB_STATE_IDLE_WANDER: return loc[lang]["jobstate_Wander"]; break;
      case JOB_STATE_COUNT:       return loc[lang]["jobstate_Null"];   break;
    }
  }

  self.flow = function(from, to) //"from"/"to" doesn't nec. imply direction: always from surplus to deficit
  {
    var d = from.nutrition-to.nutrition;
    var dd;
    if(
      (d < 0 && from.type == TILE_TYPE_LAKE) ||
      (d > 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //destination is water
      dd = d*watersnk_nutrition_flow_rate;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else if(
      (d > 0 && from.type == TILE_TYPE_LAKE) ||
      (d < 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //src is water
      dd = d*watersrc_nutrition_flow_rate;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else
    { //anything else
      dd = d*nutrition_flow_rate;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
  }

  self.ampflow = function(from, to, amp) //"from"/"to" doesn't nec. imply direction: always from surplus to deficit
  {
    var d = from.nutrition-to.nutrition;
    var dd;
    if(
      (d < 0 && from.type == TILE_TYPE_LAKE) ||
      (d > 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //destination is water
      dd = d*watersnk_nutrition_flow_rate*amp;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else if(
      (d > 0 && from.type == TILE_TYPE_LAKE) ||
      (d < 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //src is water
      dd = d*watersrc_nutrition_flow_rate*amp;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else
    { //anything else
      dd = d*nutrition_flow_rate*amp;
      d = floor(dd);
      if(rand() < dd-d) d++;
      from.nutrition -= d;
      to.nutrition   += d;
    }
  }

  self.rainflow = function(t)
  {
    var dd = t.nutrition*rain_nutrition_flow_rate;
    var d = floor(dd);
    if(rand < dd-d) d++;
    t.shed.nutrition += d;
    t.nutrition -= d;
  }

  self.init = function()
  {
    var atomic_push = function(n,ar)
    {
      var found = false;
      for(var j = 0; j < ar.length; j++) if(ar[j] == n) found = true;
      if(!found) ar.push(n);
    }

    var slow_flood_fill = function(fill)
    {
      var type;
      if(fill.length) type = fill[0].type;
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.safe_tiles_t(t.tx-1,t.ty  ); if(n.type == type) atomic_push(n,fill);
        n = self.safe_tiles_t(t.tx+1,t.ty  ); if(n.type == type) atomic_push(n,fill);
        n = self.safe_tiles_t(t.tx  ,t.ty-1); if(n.type == type) atomic_push(n,fill);
        n = self.safe_tiles_t(t.tx  ,t.ty+1); if(n.type == type) atomic_push(n,fill);
      }
      return fill;
    }

    var slow_flood_border = function(fill)
    {
      var border = [];
      var type;
      if(fill.length) type = fill[0].type;
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.safe_tiles_t(t.tx-1,t.ty  ); if(n.type != type && n.type != TILE_TYPE_NULL) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx+1,t.ty  ); if(n.type != type && n.type != TILE_TYPE_NULL) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx  ,t.ty-1); if(n.type != type && n.type != TILE_TYPE_NULL) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx  ,t.ty+1); if(n.type != type && n.type != TILE_TYPE_NULL) atomic_push(n,border);
      }
      return border;
    }

    var grow_fill = function(t,type,amt,constraint,invert_constraint)
    {
      var border = slow_flood_border(slow_flood_fill([t]));
      for(var j = 0; j < amt && border.length; j++)
      {
        var b_i = randIntBelow(border.length);
        var t = border[b_i];
        t.type = type;
        border.splice(b_i,1);

        var n;
        n = self.safe_tiles_t(t.tx-1,t.ty  ); if((!invert_constraint && n.type == constraint) || (invert_constraint && n.type != constraint && n.type != TILE_TYPE_NULL)) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx+1,t.ty  ); if((!invert_constraint && n.type == constraint) || (invert_constraint && n.type != constraint && n.type != TILE_TYPE_NULL)) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx  ,t.ty-1); if((!invert_constraint && n.type == constraint) || (invert_constraint && n.type != constraint && n.type != TILE_TYPE_NULL)) atomic_push(n,border);
        n = self.safe_tiles_t(t.tx  ,t.ty+1); if((!invert_constraint && n.type == constraint) || (invert_constraint && n.type != constraint && n.type != TILE_TYPE_NULL)) atomic_push(n,border);
      }
      return border;
    }

    var valid = 0;
    while(!valid)
    {
      valid = 1;
      console.log("alloc...");
      for(var ty = 0; ty < self.th; ty++)
      {
        for(var tx = 0; tx < self.tw; tx++)
        {
          var i = self.tiles_i(tx,ty);
          var t = new tile();
          t.tx = tx;
          t.ty = ty;
          self.world_tile(t);
          t.i = i;
          t.nutrition = rand();
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition = floor(t.nutrition*nutrition_max);
          self.tiles[i] = t;
        }
      }

      var to;
      var from;
      var dx;
      var dy;
      var d;
      console.log("direction...");
      for(var i = 0; i < self.tiles.length; i++)
      {
        to = self.tiles[i];
        for(var j = 0; j < self.tiles.length; j++)
        {
          from = self.tiles[j];
          to.directions[j] = DIRECTION_NULL;
          dx = to.tx-from.tx;
          dy = to.ty-from.ty;
          d = sqrt(dx*dx+dy*dy);
          if(d == 0) to.directions[j] = DIRECTION_NULL;
          else
          {
            var t = atan2(dy/d,dx/d);
            if(t < 0) t+=twopi;
                 if(t < twopi/16*1 ) to.directions[j] = DIRECTION_R;
            else if(t < twopi/16*3 ) to.directions[j] = DIRECTION_UR;
            else if(t < twopi/16*5 ) to.directions[j] = DIRECTION_U;
            else if(t < twopi/16*7 ) to.directions[j] = DIRECTION_UL;
            else if(t < twopi/16*9 ) to.directions[j] = DIRECTION_L;
            else if(t < twopi/16*11) to.directions[j] = DIRECTION_DL;
            else if(t < twopi/16*13) to.directions[j] = DIRECTION_D;
            else if(t < twopi/16*15) to.directions[j] = DIRECTION_DR;
            else if(t < twopi/16*17) to.directions[j] = DIRECTION_R;
          }
        }
      }

      console.log("fill...");
      //fill rocks
      for(var i = 0; i < n_rock_deposits; i++)
      {
        var src_tx = randIntBelow(self.tw);
        var src_ty = randIntBelow(self.th);
        var t = self.tiles_t(src_tx,src_ty);
        t.type = TILE_TYPE_ROCK;
        var rock_size = rock_size_min+randIntBelow(rock_size_max-rock_size_min);
        grow_fill(t,TILE_TYPE_ROCK,rock_size,TILE_TYPE_ROCK,1);
      }

      //fill lakes
      for(var i = 0; i < n_lakes; i++)
      {
        var src_tx = randIntBelow(self.tw);
        var src_ty = randIntBelow(self.th);
        var t = self.tiles_t(src_tx,src_ty);
        t.type = TILE_TYPE_LAKE;
        var lake_size = lake_size_min+randIntBelow(lake_size_max-lake_size_min);
        var lake_border = grow_fill(t,TILE_TYPE_LAKE,lake_size,TILE_TYPE_LAKE,1);
        for(var j = 0; j < lake_border.length; j++)
          lake_border[j].type = TILE_TYPE_SHORE;
      }

      //fill forests
      for(var i = 0; i < n_forests; i++)
      {
        var src_tx = randIntBelow(self.tw);
        var src_ty = randIntBelow(self.th);
        var t = self.tiles_t(src_tx,src_ty);
        while(t.type != TILE_TYPE_LAND)
        {
          src_tx = randIntBelow(self.tw);
          src_ty = randIntBelow(self.th);
          t = self.tiles_t(src_tx,src_ty);
        }
        t.type = TILE_TYPE_FOREST;
        var forest_size = forest_size_min+randIntBelow(forest_size_max-forest_size_min);
        var lake_border = grow_fill(t,TILE_TYPE_FOREST,lake_size,TILE_TYPE_LAND,0);
      }

      console.log("check...");
      var nlake = 0;
      var nland = 0;
      var ntiles = 0;
      for(var x = self.bounds_tx; x < self.bounds_tx+self.bounds_tw; x++)
      {
        for(var y = self.bounds_ty; y < self.bounds_ty+self.bounds_th; y++)
        {
          var t = self.tiles_t(x,y);
          switch(t.type)
          {
            case TILE_TYPE_LAKE: nlake++; break;
            case TILE_TYPE_LAND: nland++; break;
          }
          ntiles++;
        }
      }
      if(
        nlake/ntiles < 0.05 || nlake/ntiles > 0.5 ||
        nland/ntiles < 0.2
      )
        valid = 0;
    }
    self.center_tile = self.tiles_t(floor(self.tw/2),floor(self.th/2));

    //clear water
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      if(t.type == TILE_TYPE_LAKE || t.type == TILE_TYPE_SHORE) t.nutrition = 0;
    }

    //assign og
    for(var i = 0; i < self.tiles.length; i++)
      self.tiles[i].og_type = self.tiles[i].type;

    //group tiles
    for(var i = 0; i < TILE_TYPE_COUNT; i++)
      self.tile_groups[i] = [];
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      self.tile_groups[t.type].push(t);
    }

    /*
    //extra nutrition
    for(var i = 0; i < 50; i++)
    {
      var t = self.tiles[self.tiles_i(self.bounds_tx+randIntBelow(self.bounds_tw),self.bounds_ty+randIntBelow(self.bounds_th))];
      t.nutrition = rand();
      t.nutrition *= t.nutrition;
      t.nutrition *= t.nutrition;
      t.nutrition *= t.nutrition;
      t.nutrition *= t.nutrition;
      t.nutrition = floor(t.nutrition*nutrition_max);
    }
    */

/*
    //guarantee land nutrition
    {
      var n = 5;
      while(n)
      {
        var t = self.tile_groups[TILE_TYPE_LAND][randIntBelow(self.tile_groups[TILE_TYPE_LAND].length)];
        if(self.tile_in_bounds(t))
        {
          t.nutrition = nutrition_max;//max(floor(nutrition_motivated*(10+rand()*2)),t.nutrition);
          n--;
        }
      }
    }
*/

    //find sheds
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      if(t.type == TILE_TYPE_LAKE) continue;
      var closest_d = max_dist;
      var d;
      var tt;
      for(var ti = 0; ti < self.tiles.length; ti++)
      {
        var tt = self.tiles[ti];
        if(tt.type != TILE_TYPE_LAKE) continue;
        d = distsqr(t.tx,t.ty,tt.tx,tt.ty);
        if(d < closest_d)
        {
          closest_d = d;
          t.shed = tt;
          t.shed_d = floor(d);
        }
      }
      var xdir = 0;
      var ydir = 0;
      if(t.shed.tx < t.tx) xdir = -1;
      if(t.shed.tx > t.tx) xdir =  1;
      if(t.shed.ty < t.ty) ydir = -1;
      if(t.shed.ty > t.ty) ydir =  1;
      if(xdir == 0 && rand() < 0.8) xdir = randIntBelow(3)-1;
      if(ydir == 0 && rand() < 0.8) ydir = randIntBelow(3)-1;
      if(xdir ==  1 && t.tx == self.tw-1) xdir = 0;
      if(xdir == -1 && t.tx == 0)         xdir = 0;
      if(ydir ==  1 && t.ty == self.th-1) ydir = 0;
      if(ydir == -1 && t.ty == 0)         ydir = 0;
      t.shed = self.tiles[t.i+xdir+ydir*self.tw];
    }

    //presim flow
    {
      var n = self.tw*self.th;
      var nutrition_flow_rate_old = nutrition_flow_rate;
      var watersrc_nutrition_flow_rate_old = watersrc_nutrition_flow_rate;
      var watersnk_nutrition_flow_rate_old = watersnk_nutrition_flow_rate;
      nutrition_flow_rate          *= presim_nutrition_flow_rate_mul;
      watersrc_nutrition_flow_rate *= presim_nutrition_flow_rate_mul;
      watersnk_nutrition_flow_rate *= presim_nutrition_flow_rate_mul;
      for(var k = 0; k < 200; k++)
      {
        for(var i = 0; i < n; i++)
        {
          var t = self.tiles[i];
          var right = self.safe_tiles_t(t.tx+1,t.ty  );
          var top   = self.safe_tiles_t(t.tx  ,t.ty+1);
          if(right.type != TILE_TYPE_NULL) self.ampflow(t,right,4);
          if(top.type != TILE_TYPE_NULL) self.ampflow(t,top,4);
        }
      }
      nutrition_flow_rate = nutrition_flow_rate_old;
      watersrc_nutrition_flow_rate = watersrc_nutrition_flow_rate_old;
      watersnk_nutrition_flow_rate = watersnk_nutrition_flow_rate_old;
    }

    //set min nutrition
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      if(t.type != TILE_TYPE_LAKE && t.type != TILE_TYPE_SHORE)
        t.nutrition = max(t.nutrition,nutrition_content);
    }

    //shoreline
    for(var i = 0; i < self.tile_groups[TILE_TYPE_SHORE].length; i++)
    {
      var shore_d = 2;
      var t = self.tile_groups[TILE_TYPE_SHORE][i];
      var st;
      for(var xd = -shore_d; xd <= shore_d; xd++)
        for(var yd = -shore_d; yd <= shore_d; yd++)
        {
          st = self.tiles_t(clamp(0,self.tw-1,t.tx+xd),clamp(0,self.th-1,t.ty+yd));
          var d = xd*xd+yd*yd;
          if(d == 1 && st.type != TILE_TYPE_SHORE && st.type != TILE_TYPE_LAKE) { st.type = TILE_TYPE_LAND; st.og_type = TILE_TYPE_LAND; }
          if(st.type == TILE_TYPE_LAND) st.shoreline = 1;
        }
    }

    for(var i = 0; i < self.tiles.length; i++)
    {
      self.og_types[i] = self.tiles[i].og_type;
      self.stamp_nutrition[i] = self.tiles[i].nutrition;
    }

    self.inc_bounds();
    self.hovering = 0;
    self.scratch_item = new item();
    if(gg.continue_ls) self.load();
    else self.save();
  }

  self.save = function()
  {
    for(var i = 0; i < self.tiles.length; i++)
      self.stamp_nutrition[i] = self.tiles[i].nutrition;

    var ls = {};
    ls.money = gg.money;
    ls.n_farmbits = gg.farmbits.length;
    ls.og_types = self.og_types;
    ls.stamp_nutrition = self.stamp_nutrition;
    ls.structure_deltas = self.structure_deltas;

    window.localStorage.setItem('save', JSON.stringify(ls));
  }

  self.load = function()
  {
    var ls = JSON.parse(gg.continue_ls);//window.localStorage.getItem('save');
    gg.money = ls.money;
    self.og_types = ls.og_types;
    self.stamp_nutrition = ls.stamp_nutrition;
    self.structure_deltas = ls.structure_deltas;

    //set raw info
    for(var i = 0; i < self.tiles.length; i++)
    {
      self.tiles[i].og_type = self.og_types[i];
      self.tiles[i].type = self.og_types[i];
      self.tiles[i].nutrition = self.stamp_nutrition[i];
    }

    //shoreline
    for(var i = 0; i < self.tile_groups[TILE_TYPE_SHORE].length; i++)
    {
      var shore_d = 2;
      var t = self.tile_groups[TILE_TYPE_SHORE][i];
      var st;
      for(var xd = -shore_d; xd <= shore_d; xd++)
        for(var yd = -shore_d; yd <= shore_d; yd++)
        {
          st = self.tiles_t(clamp(0,self.tw-1,t.tx+xd),clamp(0,self.th-1,t.ty+yd));
          var d = xd*xd+yd*yd;
          if(st.type == TILE_TYPE_LAND) st.shoreline = 1;
        }
    }

    //apply deltas
    for(var i = 0; i < self.structure_deltas.length; i++)
    {
      var t = self.tiles_t(self.structure_deltas[i].tx,self.structure_deltas[i].ty);
      t.type = self.structure_deltas[i].type;
      t.state = TILE_STATE_NULL;
      t.val = 0;
      t.state_t = 0;
      switch(t.type)
      {
        case TILE_TYPE_HOME:
          t.state = TILE_STATE_HOME_VACANT;
          self.own_tiles(t,2);
          break;
        case TILE_TYPE_FARM:
          t.state = TILE_STATE_FARM_UNPLANTED;
          self.own_tiles(t,2);
          break;
        case TILE_TYPE_LIVESTOCK:
          t.state = TILE_STATE_LIVESTOCK_EATING;
          t.marks[0] = MARK_SELL;
          self.own_tiles(t,2);
          break;
      }
    }

    //move in bits
    for(var i = 0; i < ls.n_farmbits; i++)
    {
      if(gg.farmbits.length == gg.b.bounds_n) { gg.b.inc_bounds(); gg.b.bounds_n++; gg.b.resize(); }
      var t = gg.b.tiles_t(gg.b.bounds_tx+randIntBelow(gg.b.bounds_tw),gg.b.bounds_ty+randIntBelow(gg.b.bounds_th));
      var b = new farmbit();
      b.fullness = max_fullness;
      b.tile = t;
      gg.b.tiles_tw(t,b);
      gg.farmbits.push(b);
      my_logger.new_farmbit(b);
      job_for_b(b);
      b.home = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME]);
      if(b.home) b.home.state = TILE_STATE_HOME_OCCUPIED;
    }

    //group tiles
    for(var i = 0; i < TILE_TYPE_COUNT; i++)
      self.tile_groups[i] = [];
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      self.tile_groups[t.type].push(t);
    }

    self.center_tile = self.tiles_t(floor(self.tw/2),floor(self.th/2));

    //find sheds
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      if(t.type == TILE_TYPE_LAKE) continue;
      var closest_d = max_dist;
      var d;
      var tt;
      for(var ti = 0; ti < self.tiles.length; ti++)
      {
        var tt = self.tiles[ti];
        if(tt.type != TILE_TYPE_LAKE) continue;
        d = distsqr(t.tx,t.ty,tt.tx,tt.ty);
        if(d < closest_d)
        {
          closest_d = d;
          t.shed = tt;
          t.shed_d = floor(d);
        }
      }
      var xdir = 0;
      var ydir = 0;
      if(t.shed.tx < t.tx) xdir = -1;
      if(t.shed.tx > t.tx) xdir =  1;
      if(t.shed.ty < t.ty) ydir = -1;
      if(t.shed.ty > t.ty) ydir =  1;
      if(xdir == 0 && rand() < 0.8) xdir = randIntBelow(3)-1;
      if(ydir == 0 && rand() < 0.8) ydir = randIntBelow(3)-1;
      if(xdir ==  1 && t.tx == self.tw-1) xdir = 0;
      if(xdir == -1 && t.tx == 0)         xdir = 0;
      if(ydir ==  1 && t.ty == self.th-1) ydir = 0;
      if(ydir == -1 && t.ty == 0)         ydir = 0;
      t.shed = self.tiles[t.i+xdir+ydir*self.tw];
    }

    //gg.advisors.skip_all_tutorials(); //will be done when tutorials load
  }

  self.own_tiles = function(t, own_d)
  {
    for(var xd = -own_d; xd <= own_d; xd++)
      for(var yd = -own_d; yd <= own_d; yd++)
        self.tiles_t(clamp(0,self.tw-1,t.tx+xd),clamp(0,self.th-1,t.ty+yd)).owned = 1;
  }

  self.alterTile = function(t, type)
  {
    self.structure_deltas.push({tx:t.tx,ty:t.ty,type:type});
    for(var i = 0; i < self.tile_groups[t.type].length; i++)
      if(self.tile_groups[t.type][i] == t) self.tile_groups[t.type].splice(i,1);
    t.type = type;
    t.state = TILE_STATE_NULL;
    t.val = 0;
    t.state_t = 0;
    switch(type)
    {
      case TILE_TYPE_HOME:
        t.state = TILE_STATE_HOME_VACANT;
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          if(!gg.farmbits[i].home)
          {
            gg.farmbits[i].home = t;
            t.state = TILE_STATE_HOME_OCCUPIED;
            break;
          }
        }
        self.own_tiles(t,2);
        break;
      case TILE_TYPE_FARM:
        t.state = TILE_STATE_FARM_UNPLANTED;
        self.own_tiles(t,2);
        break;
      case TILE_TYPE_LIVESTOCK:
        t.state = TILE_STATE_LIVESTOCK_EATING;
        t.marks[0] = MARK_SELL;
        self.own_tiles(t,2);
        break;
      case TILE_TYPE_SIGN:
        //TODO
        break;
      case TILE_TYPE_LAND:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROAD:
        break;
    }
    self.tile_groups[type].push(t);
    self.dirty_directions();
  }

  self.placement_valid = function(tile,buy)
  {
    if(
      tile.tx < self.bounds_tx ||
      tile.tx >= self.bounds_tx+self.bounds_tw ||
      tile.ty < self.bounds_ty ||
      tile.ty >= self.bounds_ty+self.bounds_th ||
      0)
      return 0;
    switch(buy)
    {
      case BUY_TYPE_HOME:
        return tile.owned && tile.shoreline && buildability_check(TILE_TYPE_HOME,tile.type);
      case BUY_TYPE_FARM:
        return tile.owned && buildability_check(TILE_TYPE_FARM,tile.type);
      case BUY_TYPE_FERTILIZER:
        return tile.type == TILE_TYPE_FARM;
      case BUY_TYPE_FOOD:
        return 1;
      case BUY_TYPE_LIVESTOCK:
        return tile.owned && buildability_check(TILE_TYPE_LIVESTOCK,tile.type);
      case BUY_TYPE_SIGN:
        return buildability_check(TILE_TYPE_SIGN,tile.type);
      case BUY_TYPE_SKIMMER:
        return tile.type == TILE_TYPE_LAKE;
      case BUY_TYPE_ROAD:
        return (buildability_check(TILE_TYPE_ROAD,tile.type) || tile.type == TILE_TYPE_ROAD);
    }
    return 0;
  }

  self.hover = function(evt)
  {
    worldSpaceDoEvt(gg.cam, gg.canvas, evt);
    var old_hover_t = self.hover_t;
    self.hover_t = self.tiles_wt(evt.wx,evt.wy);
    self.hover_x = evt.doX;
    self.hover_y = evt.doY;
    if(self.hover_t && !self.tile_in_bounds(self.hover_t)) { self.unhover(evt); return; }
    if(self.hover_t != old_hover_t && gg.shop.selected_buy)
    {
      gg.inspector.select_tile(self.hover_t);
      self.hover_t_placable = self.placement_valid(self.hover_t,gg.shop.selected_buy);
    }

    var hovered;
    for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(!b.offscreen && ptWithinBB(b,evt.doX,evt.doY)) hovered = b; }
    if(hovered)
    {
      gg.inspector.quick = hovered;
      gg.inspector.quick_type = INSPECTOR_CONTENT_FARMBIT;
    }
    if(!hovered)
    {
      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(!it.offscreen && ptWithinBB(it,evt.doX,evt.doY)) hovered = it; }
      if(hovered)
      {
        gg.inspector.quick = hovered;
        gg.inspector.quick_type = INSPECTOR_CONTENT_ITEM;
      }
      else
      {
        gg.inspector.quick = self.hover_t;
        gg.inspector.quick_type = INSPECTOR_CONTENT_TILE;
      }
    }
    if(self.spewing_road && self.hover_t && buildability_check(TILE_TYPE_ROAD,self.hover_t.type))
    {
      self.alterTile(self.hover_t,TILE_TYPE_ROAD);
      self.spewing_road--;
      my_logger.build_road();
    }
  }
  self.unhover = function(evt)
  {
    self.hover_t = 0;
    self.hover_t_placable = 0;
    gg.inspector.tile_quick = 0;
    gg.inspector.quick_type = INSPECTOR_CONTENT_NULL;
  }

  self.drag_ignored = 0;
  self.drag_t = 0;
  self.drag_x = 0;
  self.drag_y = 0;
  self.last_evt = 0;
  self.dragStart = function(evt)
  {
    if(platform == PLATFORM_MOBILE) self.hover(evt);
    if(gg.ignore_single_board) self.drag_ignored = 1;
    self.last_evt = evt;

    self.drag_t = 0;
    self.drag_x = evt.doX;
    self.drag_y = evt.doY;
    self.cam_sx = gg.cam.wx;
    self.cam_sy = gg.cam.wy;
  }
  self.drag = function(evt)
  {
    if(gg.ignore_single_board) self.drag_ignored = 1;
    self.last_evt = evt;
    if(platform == PLATFORM_MOBILE && gg.shop.selected_buy)
    {
      self.hover(evt);
    }
    else if(self.drag_t > 10 || lensqr(self.drag_x-evt.doX,self.drag_y-evt.doY) > 10)
    {
      gg.cam.wx = self.cam_sx + (self.drag_x-evt.doX)/gg.canvas.width*gg.cam.ww;
      gg.cam.wy = self.cam_sy - (self.drag_y-evt.doY)/gg.canvas.height*gg.cam.wh;
      self.set_cam();
      my_logger.camera_move();
    }
  }
  self.dragFinish = function(evt)
  {
    if(gg.ignore_single_board) self.drag_ignored = 1;
    if(self.last_evt && self.last_evt.doX) { evt.doX = self.last_evt.doX; evt.doY = self.last_evt.doY; }

    if(((platform == PLATFORM_MOBILE && gg.shop.selected_buy) || (self.drag_t < 10 || (self.drag_t < 20 && lensqr(self.drag_x-self.last_evt.doX,self.drag_y-self.last_evt.doY) < 100))) && !gg.advisors.owns_ui && !self.drag_ignored) self.click(evt);
    self.drag_ignored = 0;
    if(platform == PLATFORM_MOBILE) self.unhover(evt);
  }

  self.click = function(evt) //gets called by dragfinish rather than straight filtered
  {
    if(gg.achievements.open) { gg.achievements.open = 0; return; }
    if(self.spewing_road) return;

    if(gg.shop.selected_buy)
    {
      if(self.hover_t)
      {
        my_logger.buy_item();
        if(self.placement_valid(self.hover_t,gg.shop.selected_buy))
        {
          switch(gg.shop.selected_buy)
          {

            case BUY_TYPE_HOME:
            {
              if(!gg.shop.confirm_buy()) return;
              self.alterTile(self.hover_t,TILE_TYPE_HOME);
              gg.inspector.select_tile(self.hover_t);
              self.hover_t_placable = 0;
              gg.aud_wrangler.play(house_aud);
              return;
            }
            break;

            case BUY_TYPE_FARM:
            {
              if(!gg.shop.confirm_buy()) return;
              self.alterTile(self.hover_t,TILE_TYPE_FARM);
              gg.inspector.select_tile(self.hover_t);
              b_for_job(JOB_TYPE_PLANT, self.hover_t, 0);
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_FERTILIZER:
            {
              if(!gg.shop.confirm_buy()) return;

              var it = self.hover_t.fertilizer;
              if(!it)
              {
                it = new item();
                it.type = ITEM_TYPE_FERTILIZER;
                it.lock = 1; //permalocked
                it.state = 0;
                it.tile = self.hover_t;
                gg.b.tiles_tw(it.tile,it);
                gg.items.push(it);
              }
              it.state += fertilizer_nutrition;
              self.hover_t.fertilizer = it;

              gg.inspector.select_tile(self.hover_t);
              self.hover_t_placable = 0;
              gg.aud_wrangler.play(fertilizer_aud);
              return;
            }
            break;

            case BUY_TYPE_FOOD:
            {
              if(!gg.shop.confirm_buy()) return;
              if(self.hover_t.type == TILE_TYPE_LIVESTOCK)
              {
                self.hover_t.val++;
                gg.inspector.select_tile(self.hover_t);
              }
              else
              {
                var it = new item();
                it.type = ITEM_TYPE_FOOD;
                it.tile = self.hover_t;
                gg.b.tiles_tw(it.tile,it);
                gg.items.push(it);
                b_for_job(JOB_TYPE_EAT, 0, it);
                gg.inspector.select_item(it);
              }

              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_LIVESTOCK:
            {
              if(!gg.shop.confirm_buy()) return;
              self.alterTile(self.hover_t,TILE_TYPE_LIVESTOCK);
              gg.inspector.select_tile(self.hover_t);
              self.hover_t_placable = 0;
              gg.aud_wrangler.play(dairy_aud);
              return;
            }
            break;

            case BUY_TYPE_SIGN:
            {
              if(!gg.shop.confirm_buy()) return;
              self.alterTile(self.hover_t,TILE_TYPE_SIGN);
              gg.inspector.select_tile(self.hover_t);
              self.hover_t_placable = 0;
              gg.aud_wrangler.play(sign_aud);
              return;
            }
            break;

            case BUY_TYPE_SKIMMER:
            {
              if(!gg.shop.confirm_buy()) return;
              self.hover_t.nutrition = 0;

              gg.inspector.select_tile(self.hover_t);
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_ROAD:
            {
              if(!gg.shop.confirm_buy()) return;
              if(self.hover_t.type != TILE_TYPE_ROAD)
              {
                self.alterTile(self.hover_t,TILE_TYPE_ROAD);
                gg.inspector.select_tile(self.hover_t);
                self.spewing_road = roads_per_buy-1;
              }
              else
                self.spewing_road = roads_per_buy;
              self.hover_t_placable = 0;
              gg.aud_wrangler.play(road_aud);
              return;
            }
            break;

          }
        }
        else gg.shop.error_loc_t = 1;
      }
    }
    else
    {
      var clicked;

      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(!it.offscreen && ptWithinBB(it,evt.doX,evt.doY)) clicked = it; }
      if(clicked)
      {
        if(gg.inspector.detailed == clicked) gg.inspector.select_tile(clicked.tile);
        else gg.inspector.select_item(clicked);
        return;
      }

      for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(!b.offscreen && ptWithinBB(b,evt.doX,evt.doY)) clicked = b; }
      if(clicked)
      {
        if(gg.inspector.detailed == clicked) gg.inspector.select_tile(clicked.tile);
        else gg.inspector.select_farmbit(clicked);
        return;
      }

      if(self.hover_t)
      {
        if(gg.inspector.detailed == self.hover_t) gg.inspector.deselect();
        else
        {
          gg.inspector.select_tile(self.hover_t);
          if(self.hover_t.directions_dirty) gg.b.calculate_directions(self.hover_t);
        }
      }
    }
  }

  self.idempotent_tick = function()
  {
    if(self.dragging) self.drag_t++;
  }

  self.save_t = 0;
  self.tick = function()
  {
    gg.tick_counter++;
    if(self.autorain)
    {
      self.rain_t++;
      if(self.rain_t > 5000) {self.raining = 1; }
      if(self.rain_t > 6000) { self.raining = 0; self.rain_t = 0;}
    }

    self.visit_t++;
    var n = 1000;
    if(self.visit_t > n)
    {
      self.visit_t -= n;

      if(gg.farmbits.length < gg.b.tile_groups[TILE_TYPE_HOME].length)
      {
        if(gg.farmbits.length) gg.advisors.another_member();
        if(gg.farmbits.length == self.bounds_n) { self.inc_bounds(); self.bounds_n++; self.resize(); }
        var t;
        t = self.tiles_t(self.bounds_tx+floor(self.bounds_tw/2),self.bounds_ty+floor(self.bounds_th/2));
        var h = closest_unlocked_state_tile_from_list(t, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME])
        if(h) t = h;
        else t = self.tiles_t(self.bounds_tx+randIntBelow(self.bounds_tw),self.bounds_ty+randIntBelow(self.bounds_th));
        var b = new farmbit();
        b.tile = t;
        gg.b.tiles_tw(t,b);
        gg.farmbits.push(b);
        my_logger.new_farmbit(b);
        job_for_b(b);
        b.home = h;
        if(h) b.home.state = TILE_STATE_HOME_OCCUPIED;
      }
    }

    //tiles
    var n = self.tw*self.th;
    for(var i = 0; i < n; i++)
    {
      var t = self.tiles[i];
      t.state_t++;
      switch(t.type)
      {
        case TILE_TYPE_HOME:
          break;
        case TILE_TYPE_FARM:
        {
          if(t.state == TILE_STATE_FARM_PLANTED)
          {
            var d = min(floor(t.nutrition*farm_nutrition_uptake_p),farm_nutrition_uptake_max);
            t.nutrition -= d;
            my_logger.update_farm_nutrition(t);
            d = max(d,farm_nutrition_uptake_min); //nutrition created out of thin air!
            t.val += d;
            t.fx_t++;
            var fx_tt = min(1,t.nutrition/(farm_nutrition_req/4));
            if(t.fx_t > clock_bounce_t+(1-fx_tt)*clock_bounce_t*4)
              t.fx_t = 0;
            if(t.val > farm_nutrition_req)
            {
              t.state = TILE_STATE_FARM_GROWN;
              t.val = 0;
              t.state_t = 0;
              b_for_job(JOB_TYPE_HARVEST, t, 0);
            }
          }
        }
          break;
        case TILE_TYPE_LIVESTOCK:
        {
          if(t.state == TILE_STATE_LIVESTOCK_EATING && t.val >= livestock_feed_req)
          {
            t.state = TILE_STATE_LIVESTOCK_DIGESTING;
            t.val -= livestock_feed_req;
            t.state_t = 0;

            //gen poop
            var it = new item();
            it.type = ITEM_TYPE_POOP;
            it.tile = t;
            it.mark = t.marks[1];
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);
            my_logger.increment_poop_produced(t);
            if(it.mark == MARK_SELL) b_for_job(JOB_TYPE_EXPORT, 0, it) ;
            else if(!(it.mark == MARK_USE && b_for_job(JOB_TYPE_FERTILIZE, 0, it))) ;
          }
          else if(t.state == TILE_STATE_LIVESTOCK_DIGESTING && t.state_t >= milkable_t)
          {
            t.state = TILE_STATE_LIVESTOCK_MILKABLE;
            if(!b_for_job(JOB_TYPE_MILK, t, 0))
              ; //do nothing- all atempts present in if
          }
        }
          break;
      }
      var right = self.safe_tiles_t(t.tx+1,t.ty  );
      var top   = self.safe_tiles_t(t.tx  ,t.ty+1);
      if(right.type != TILE_TYPE_NULL) self.flow(t,right);
      if(top.type != TILE_TYPE_NULL) self.flow(t,top);
      if(self.raining) self.rainflow(t);
    }

    //particles
    {
      for(var i = self.up_pt.length-1; i >= 0; i--)
      {
        self.up_pt[i]++;
        if(self.up_pt[i] > particle_t)
        {
          self.up_ptt.splice(i,1);
          self.up_pt.splice(i,1);
          self.up_px.splice(i,1);
          self.up_py.splice(i,1);
        }
      }
      for(var i = self.down_pt.length-1; i >= 0; i--)
      {
        self.down_pt[i]++;
        if(self.down_pt[i] > particle_t)
        {
          self.down_pti.splice(i,1);
          self.down_pt.splice(i,1);
          self.down_px.splice(i,1);
          self.down_py.splice(i,1);
        }
      }
      for(var i = self.buy_pt.length-1; i >= 0; i--)
      {
        self.buy_pt[i]++;
        if(self.buy_pt[i] > particle_t)
        {
          self.buy_ptt.splice(i,1);
          self.buy_pn.splice(i,1);
          self.buy_pt.splice(i,1);
        }
      }
      for(var i = self.sell_pt.length-1; i >= 0; i--)
      {
        self.sell_pt[i]++;
        if(self.sell_pt[i] > particle_t)
        {
          self.sell_ptt.splice(i,1);
          self.sell_pn.splice(i,1);
          self.sell_pt.splice(i,1);
        }
      }
      for(var i = 0; i < self.tile_groups[TILE_TYPE_FARM].length; i++)
      {
        var t = self.tile_groups[TILE_TYPE_FARM][i];
        if(t.state == TILE_STATE_FARM_PLANTED)
        {
               if(t.nutrition > nutrition_motivated) { if(rand() < 0.2)  self.up_p(t,rand(),rand()); }
          else if(t.nutrition > nutrition_desperate) { if(rand() < 0.1)  self.up_p(t,rand(),rand()); }
          else if(t.nutrition > 0)                   { if(rand() < 0.05) self.up_p(t,rand(),rand()); }
        }
      }
      for(var i = 0; i < gg.items.length; i++)
      {
        if(gg.items[i].type == ITEM_TYPE_FERTILIZER)
        {
          var i = gg.items[i];
          if(rand() < 0.2) self.down_p(i,rand(),rand());
        }
      }
    }

    self.save_t++;
    if(self.save_t > 5000) { self.save(); self.save_t = 0; }
  }

  self.draw_tile_og = function(t,x,y,w,h)
  {
    switch(t.og_type)
    {
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_HOME:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_FARM:
        console.log("BROKEN");
        break;
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAND:
        gg.ctx.drawImage(self.tile_img(t.og_type),x,y,w,h);
        break;
    }
  }

  self.draw_tile_ontop = function(t,x,y,w,h)
  {
    switch(t.type)
    {
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_HOME:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_FARM:
        var yd = psin(gg.t_mod_twelve_pi*10);
        var xd = bias0(1-yd)*self.min_draw_tw/10;
        yd *= self.min_draw_th/10;

        gg.ctx.drawImage(self.tile_img(t.type),x-xd/2,y-yd,w+xd,h+yd); //no break!
        break;
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAND:
        //already done
        break;
    }
  }

  self.draw_tile_overlay = function(t,x,y,w,h)
  {
    if(t.type == TILE_TYPE_FARM)
    {
      var r = w/4;
      var p;
      var yoff = 0;
      switch(t.state)
      {
        case TILE_STATE_FARM_UNPLANTED: gg.ctx.drawImage(tile_water_img,x-w/8,y-h/8,w/2,h/2); break;
        case TILE_STATE_FARM_GROWN:     gg.ctx.drawImage(tile_food_img, x-w/8,y-h/8,w/2,h/2); break;
        case TILE_STATE_FARM_PLANTED:
          if(t.fx_t < clock_bounce_t)
          {
            var fx_tt = min(1,t.nutrition/(farm_nutrition_req/4));
            yoff = tink(min(t.fx_t/clock_bounce_t,1))*-30*gg.stage.s_mod*(0.5+fx_tt/2);
          }
          self.timer_atlas.blitWholeSprite(self.timer_atlas_i(t.val/farm_nutrition_req,min(1,t.nutrition/nutrition_motivated)),x-w/4,y+yoff,gg.ctx);
          break;
      }
    }
    if(t.type == TILE_TYPE_LIVESTOCK)
    {
      switch(t.state)
      {
        case TILE_STATE_LIVESTOCK_EATING: gg.ctx.drawImage(tile_food_img, x-w/8,y-h/8,w/2,h/2); break;
        case TILE_STATE_LIVESTOCK_DIGESTING: self.timer_atlas.blitWholeSprite(self.timer_atlas_i(t.state_t/milkable_t,1+(1/(gg.b.timer_colors-1))),x-w/4,y,gg.ctx); break;
        case TILE_STATE_LIVESTOCK_MILKABLE: gg.ctx.drawImage(tile_milk_img, x-w/8,y-h/8,w/2,h/2); break;
      }
    }
    /*
    if(t.known_nutrition_t)
    {
      var as = 50*gg.stage.s_mod;
           if(t.known_nutrition_d < 0) gg.ctx.drawImage(down_img,x+w/2-as/2,y+h/2-t.known_nutrition_t-as/2,as,as);
      else if(t.known_nutrition_d > 0) gg.ctx.drawImage(up_img,x+w/2-as/2,y+h/2+t.known_nutrition_t-as/2,as,as);
    }
    */
  }

  self.draw_tile = function(t,x,y,w,h)
  {
    var over = h/4;
    y -= over;
    h += over;
    self.draw_tile_og(t,x,y,w,h);
    self.draw_tile_ontop(t,x,y,w,h);
    self.draw_tile_overlay(t,x,y,w,h);
  }

  self.draw_tile_og_fast = function(t,x,y,w,h)
  {
    if(!self.atlas) return self.draw_tile_og(t,x,y,w,h);

    var off = 0;
    if(w == self.min_draw_tw)
    {
             if(h == self.min_draw_th)     off = 0;
      else /*if(h == self.min_draw_th+1)*/ off = 2;
    }
    else /*if(w == self.min_draw_tw+1)*/
    {
             if(h == self.min_draw_th)     off = 1;
      else /*if(h == self.min_draw_th+1)*/ off = 3;
    }

    switch(t.og_type)
    {
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_HOME:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_FARM:
        console.log("BROKEN");
        break;
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_FOREST:
        self.atlas.blitWholeSprite(self.atlas_i[t.og_type]+off,x,y,gg.ctx);
        break;
      case TILE_TYPE_LAND:
      {
        var p = floor(clamp(0,0.99,1-(t.shed_d/100))*land_topo_levels);
        var d = clamp(0,land_detail_levels-1,t.state-TILE_STATE_LAND_D0);
        var f = floor((gg.t_mod_twelve_pi*10+t.tx*5+t.ty*12)/20)%land_frames;
        self.atlas.blitWholeSprite(self.atlas_i[TILE_TYPE_COUNT+land_off(p,d,f)]+off,x,y,gg.ctx);
      }
        break;
    }
  }

  self.draw_tile_ontop_fast = function(t,x,y,w,h,xd,yd)
  {
    if(!self.atlas) return self.draw_tile_ontop(t,x,y,w,h);

    switch(t.type)
    {
      case TILE_TYPE_LIVESTOCK:
        var off = 0;
        if(w == self.min_draw_tw)
        {
                 if(h == self.min_draw_th)     off = 0;
          else /*if(h == self.min_draw_th+1)*/ off = 2;
        }
        else /*if(w == self.min_draw_tw+1)*/
        {
                 if(h == self.min_draw_th)     off = 1;
          else /*if(h == self.min_draw_th+1)*/ off = 3;
        }
        self.atlas.drawWholeSprite(self.atlas_i[TILE_TYPE_COUNT+livestock_off(t.val)]+off,x-xd/2,y-yd,w+xd,h+yd,gg.ctx);
        break;
      case TILE_TYPE_ROAD:
      case TILE_TYPE_HOME:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_FARM:
        var off = 0;
        if(w == self.min_draw_tw)
        {
                 if(h == self.min_draw_th)     off = 0;
          else /*if(h == self.min_draw_th+1)*/ off = 2;
        }
        else /*if(w == self.min_draw_tw+1)*/
        {
                 if(h == self.min_draw_th)     off = 1;
          else /*if(h == self.min_draw_th+1)*/ off = 3;
        }
        self.atlas.drawWholeSprite(self.atlas_i[t.type]+off,x-xd/2,y-yd,w+xd,h+yd,gg.ctx);
        break;
      case TILE_TYPE_LAKE:
        var a;
        if(t.nutrition < water_fouled_threshhold)
          a = max(0,bias0(bias0(t.nutrition/water_fouled_threshhold))*0.8);
        else
          a = min(1,0.8+bias1(bias1((t.nutrition-water_fouled_threshhold)/(nutrition_max-water_fouled_threshhold)))*0.2);
        if(a > 0.05)
        {
          gg.ctx.globalAlpha = a;
          gg.ctx.drawImage(tile_bloom_img,x,y,w,h);
          gg.ctx.globalAlpha = 1;
        }
        break;
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAND:
        //already drawn!
        break;
    }
  }

  self.draw_tile_fast = function(t,x,y,w,h,xd,yd)
  {
    self.draw_tile_og_fast(t,x,y,w,h);
    self.draw_tile_ontop_fast(t,x,y,w,h,xd,yd);
    self.draw_tile_overlay(t,x,y,w,h);
  }

  self.draw_nutrition = function(t,x,y,w,h)
  {
    var frame = floor(gg.b.visit_t/10+x/3+y/7)%(nutrition_overlay_frames);
    gg.ctx.drawImage(nutrition_imgs[floor(t*nutrition_overlay_levels)*nutrition_overlay_frames+frame],x,y,w,h);
  }

  self.draw_nutrition_fast = function(t,x,y,w,h)
  {
    if(!self.nutrition_atlas) return self.draw_nutrition(t,x,y,w,h);

    var off = 0;
    if(w == self.min_draw_tw)
    {
             if(h == self.min_draw_th)     off = 0;
      else /*if(h == self.min_draw_th+1)*/ off = 2;
    }
    else /*if(w == self.min_draw_tw+1)*/
    {
             if(h == self.min_draw_th)     off = 1;
      else /*if(h == self.min_draw_th+1)*/ off = 3;
    }

    var frame = floor(gg.b.visit_t/10+x/3+y/7)%(nutrition_overlay_frames);
    self.nutrition_atlas.blitWholeSprite(self.nutrition_atlas_i[nutrition_overlay_ii(t)]+frame*4+off,x,y,gg.ctx);
  }

  self.draw = function()
  {
    var t;
    var w = self.w/self.tw;
    var h = self.h/self.th;
    var x;
    var y;
    var dy;
    var th;
    var dth;
    var tw;
    var nx;
    var ny;
    var i;
    var dhd = floor(h/4);
    var yd = psin(gg.t_mod_twelve_pi*10);
    var xd = bias0(1-yd)*self.min_draw_tw/10;
    yd *= self.min_draw_th/10;

    gg.ctx.imageSmoothingEnabled = 0;


    //rain log
    
    //og tiles
    i = 0;
    ny = floor(self.y);
    for(var ty = self.th-1; ty >= 0; ty--)
    {
      y = ny;
      ny = floor(self.y+self.h-ty*h);
      th = ny-y;
      dth = th+dhd;
      dy = y-dhd;
      //og
      nx = floor(self.x+(0*w));
      i = self.tiles_i(0,ty);
      for(var tx = 0; tx < self.tw; tx++)
      {
        x = nx;
        nx = floor(self.x+((tx+1)*w));
        tw = nx-x;
        if(x < -tw || x > gg.canvas.width) { i++; continue; }
        var t = self.tiles[i];
        self.draw_tile_og_fast(t,x,dy,tw,dth);
        i++;
      }
      //ontop
      nx = floor(self.x+(0*w));
      i = self.tiles_i(0,ty);
      for(var tx = 0; tx < self.tw; tx++)
      {
        x = nx;
        nx = floor(self.x+((tx+1)*w));
        tw = nx-x;
        if(x < -tw || x > gg.canvas.width) { i++; continue; }
        var t = self.tiles[i];
        self.draw_tile_ontop_fast(t,x,dy,tw,dth,xd,yd);
        i++;
      }
    }

    //nutrition
    if(self.nutrition_view)
    {
      i = 0;
      ny = floor(self.y);
      for(var ty = self.th-1; ty >= 0; ty--)
      {
        y = ny;
        ny = floor(self.y+self.h-ty*h);
        th = ny-y;
        dth = th+dhd;
        dy = y-dhd;
        //og
        nx = floor(self.x+(0*w));
        i = self.tiles_i(0,ty);
        for(var tx = 0; tx < self.tw; tx++)
        {
          x = nx;
          nx = floor(self.x+((tx+1)*w));
          tw = nx-x;
          if(x < -tw || x > gg.canvas.width) { i++; continue; }
          var t = self.tiles[i];
          a = bias1(min(t.nutrition/(nutrition_max/4),0.99));
          self.draw_nutrition_fast(a,x,dy,tw,dth);
          i++;
        }
      }

      //nutrition particles
      {
        gg.ctx.fillStyle = nutrition_color;
        var s = self.w/self.tw/10;
        var hs = s/2;
        for(var i = self.up_pt.length-1; i >= 0; i--)
        {
          gg.ctx.globalAlpha = 1-(self.up_pt[i]/particle_t);
          var t = self.up_ptt[i];
          self.screen_tile(t);
          gg.ctx.fillRect(t.x+self.up_px[i]*t.w-hs,t.y+self.up_py[i]*t.h-hs-(self.up_pt[i]/particle_t)*t.h,s,s);
        }
        for(var i = self.down_pt.length-1; i >= 0; i--)
        {
          gg.ctx.globalAlpha = 1-(self.down_pt[i]/particle_t);
          var it = self.down_pti[i];
          gg.ctx.fillRect(it.x+self.down_px[i]*it.w-hs,it.y+self.down_py[i]*it.h-hs+(self.down_pt[i]/particle_t)*it.h,s,s);
        }
      }

      gg.ctx.globalAlpha = 1;
    }

    //owned land
    {
      var t;
      switch(gg.shop.selected_buy)
      {
        case BUY_TYPE_HOME:
        case BUY_TYPE_FARM:
        case BUY_TYPE_LIVESTOCK:
        {
          var own_d = 2;
          var i = 0;
          var a;
          gg.ctx.fillStyle = blue;
          gg.ctx.globalAlpha = 0.25;
          ny = floor(self.y+self.h-(0*h));
          for(var ty = 0; ty < self.th; ty++)
          {
            y = ny;
            ny = floor(self.y+self.h-(ty+1)*h);
            th = y-ny;
            nx = floor(self.x+(0*w));
            if(ny < -th || ny > gg.canvas.height) { i += self.tw; continue; }
            for(var tx = 0; tx < self.tw; tx++)
            {
              x = nx;
              nx = floor(self.x+((tx+1)*w));
              tw = nx-x;
              if(x < -tw || x > gg.canvas.width) { i++; continue; }
              t = self.tiles[i];
              if(t.owned && (gg.shop.selected_buy != BUY_TYPE_HOME || t.shoreline))
                ;
              else
              {
                if(self.hover_t && self.hover_t_placable && abs(self.hover_t.tx-tx) <= own_d && abs(self.hover_t.ty-ty) <= own_d) gg.ctx.globalAlpha = 0.15;
                else gg.ctx.globalAlpha = 0.25;
                gg.ctx.fillRect(x,ny,tw,th);
              }
              i++;
            }
          }
        }
        break;
      }
      gg.ctx.globalAlpha = 1;
    }

    gg.ctx.imageSmoothingEnabled = 1;

    //cursor (+ sign ring if sign selected)
    {
      if(gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE && !gg.shop.selected_buy)
      {
        t = gg.inspector.detailed;
        gg.ctx.drawImage(icon_cursor_img,self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);

        if(t.type == TILE_TYPE_SIGN)
        {
          gg.ctx.strokeStyle = red;
          gg.ctx.lineWidth = 2;
          gg.ctx.beginPath();
          gg.ctx.arc(self.x+t.tx*w+w/2,self.y+self.h-(t.ty+1)*h+h/2,w*2,0,twopi);
          gg.ctx.stroke();
        }
      }
    }

    //people
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();

    //items
    for(var i = 0; i < gg.items.length; i++)
      gg.items[i].draw();

    //tile overlays (clocks)
    {
      i = 0;
      ny = floor(self.y);
      for(var ty = self.th-1; ty >= 0; ty--)
      {
        y = ny;
        ny = floor(self.y+self.h-ty*h);
        th = ny-y;
        dth = th+dhd;
        dy = y-dhd;
        //overlay
        nx = floor(self.x+(0*w));
        i = self.tiles_i(0,ty);
        for(var tx = 0; tx < self.tw; tx++)
        {
          x = nx;
          nx = floor(self.x+((tx+1)*w));
          tw = nx-x;
          if(x < -tw || x > gg.canvas.width) { i++; continue; }
          var t = self.tiles[i];
          self.draw_tile_overlay(t,x,dy,tw,dth);
          i++;
        }
      }
    }

    //buy preview
    {
      if(self.hover_t && gg.shop.selected_buy)
      {
        t = self.hover_t;
        var cursor = icon_cursor_img;
        if(self.hover_t_placable)
        {
          var o = self.scratch_tile;
          o.type = buy_to_tile(gg.shop.selected_buy);
          o.tx = t.tx;
          o.ty = t.ty;
          o.og_type = t.og_type;

          var w = self.w/self.tw;
          var h = self.h/self.th;
          var ny = round(self.y+self.h-((o.ty+1)*h));
          var  x = round(self.x+       ((o.tx  )*w));

          if(o.type != TILE_TYPE_NULL)
          {
            if(gg.shop.selected_buy == BUY_TYPE_SIGN)
            {
              gg.ctx.strokeStyle = red;
              gg.ctx.lineWidth = 2;
              gg.ctx.beginPath();
              gg.ctx.arc(x+w/2,ny+h/2,w*2,0,twopi);
              gg.ctx.stroke();
            }

            gg.ctx.globalAlpha = 0.5;
            self.draw_tile(o,x,ny,w,h);
            gg.ctx.globalAlpha = 1;
          }
          else
          {
            var it = self.scratch_item;
            it.type = buy_to_item(gg.shop.selected_buy);
            if(it.type != ITEM_TYPE_NULL)
            {
              it.tile = t;
              gg.b.tiles_tw(it.tile,it);
              screenSpace(gg.cam, gg.canvas, it);

              gg.ctx.globalAlpha = 0.5;
              it.draw();
              gg.ctx.globalAlpha = 1;
            }
          }

          var offy = 0;
          if(gg.shop.buy_cost(gg.shop.selected_buy) > gg.money) { gg.ctx.fillStyle = red; offy = tink(min(gg.shop.error_cost_t/50,1))*-50*gg.stage.s_mod; }
          else gg.ctx.fillStyle = gg.font_color;
          gg.ctx.font = gg.font_size+"px "+gg.font;
          gg.ctx.textAlign = "center";
          gg.ctx.fillText("$"+gg.shop.buy_cost(gg.shop.selected_buy),x+w/2,ny+h+gg.font_size+offy);
        }
        else
          cursor = icon_ncursor_img;
        //gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);
        gg.ctx.drawImage(cursor,self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);
      }
    }

    //rain
    {
      if(self.raining)
      {
        gg.lakenut_startlog = true;
        gg.ctx.fillStyle = blue;
        var s = 3*gg.stage.s_mod;
        var hs = s/2;
        if(gg.speed == SPEED_PAUSE || gg.advisors.owns_time)
        {
          var x = 0;
          var y = 0;
          for(var i = 0; i < 1000; i++)
          {
            x = Math.sin(i)*10000;
            x = (x-Math.floor(x))*self.w;
            y = Math.sin(i+1000)*10000;
            y = (y-Math.floor(y))*self.h;
            gg.ctx.fillRect(self.x+x-hs,self.y+y-hs,s,s*2);
          }
        }
        else
        {
          for(var i = 0; i < 1000; i++)
          {
            var x = rand()*self.w;
            var y = rand()*self.h;
            gg.ctx.fillRect(self.x+x-hs,self.y+y-hs,s,s*2);
          }
        }
      }
    }

    //clouds
    {
      /*
      gg.ctx.strokeStyle = red;
      gg.ctx.strokeRect(self.bounds_x,self.bounds_y,self.bounds_w,self.bounds_h);
      gg.ctx.strokeStyle = blue;
      gg.ctx.strokeRect(self.cbounds_x,self.cbounds_y,self.cbounds_w,self.cbounds_h);
      //*/
      gg.ctx.drawImage(clouds_img,self.cloud_x,self.cloud_y,self.cloud_w,self.cloud_h);
      gg.ctx.fillStyle = cloud_color;
      gg.ctx.globalAlpha = 0.8;
      if(self.cloud_x              > 0)                gg.ctx.fillRect(0,0,self.cloud_x,gg.canvas.height);
      if(self.cloud_x+self.cloud_w < gg.canvas.width)  gg.ctx.fillRect(self.cloud_x+self.cloud_w,           0,gg.canvas.width-self.cloud_x,gg.canvas.height);
      if(self.cloud_y              > 0)                gg.ctx.fillRect(self.cloud_x,                        0,self.cloud_w,self.cloud_y);
      if(self.cloud_y+self.cloud_h < gg.canvas.height) gg.ctx.fillRect(self.cloud_x,self.cloud_y+self.cloud_h,self.cloud_w,gg.canvas.height-(self.cloud_y+self.cloud_h));
      gg.ctx.flobalAlpha = 1;
    }

    //road?
    {
      if(gg.shop.selected_buy == BUY_TYPE_ROAD) self.spewing_road = 10;
      for(var i = 0; i < self.spewing_road; i++)
        gg.ctx.drawImage(self.tile_img(TILE_TYPE_ROAD),self.hover_x,self.hover_y-self.min_draw_th/4-i*self.min_draw_th/10,self.min_draw_tw,self.min_draw_th);
      if(gg.shop.selected_buy == BUY_TYPE_ROAD) self.spewing_road = 0;
    }

  }

}

var item = function()
{
  var self = this;
  self.thing = THING_TYPE_ITEM;

  self.wx = 0;
  self.wy = 0;
  self.ww = gg.b.tww*3/4;
  self.wh = gg.b.twh*3/4;
  self.wz = 0;
  self.wvx = 0;
  self.wvy = 0;
  self.wvz = 0;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.t = 0;

  self.tile;
  self.type = ITEM_TYPE_NULL;
  self.mark = MARK_USE;
  self.lock = 0;

  self.offscreen = 0;

  self.tick = function()
  {
    if(self.offscreen) return;
    self.t++;
    self.wvz -= 0.1;
    self.wx += self.wvx;
    self.wy += self.wvy;
    self.wz += self.wvz;
    gg.b.boundw(self);
    if(self.wz < 0) { self.wz = 0; self.wvz *= -1; }
    self.wvx *= 0.95;
    self.wvy *= 0.95
    self.wvz *= 0.95
    if(abs(self.wvx) < 0.01) self.wvx = 0;
    if(abs(self.wvy) < 0.01) self.wvy = 0;
    if(self.wz < 0.01 && abs(self.wvz) < 0.1) { self.wvz = 0; self.wz = 0; }

    var ot = self.tile;
    self.tile = gg.b.tiles_wt(self.wx,self.wy);
    switch(self.type)
    {
      case ITEM_TYPE_POOP: self.tile.nutrition += poop_nutrition_leak; break;
      case ITEM_TYPE_FERTILIZER:
        self.state -= fertilizer_nutrition_leak;
        self.tile.nutrition += fertilizer_nutrition_leak;
        if(gg.b.raining)
        {
          if(self.tile.shed == self.tile)
          {
            self.wvx += (self.tile.wx-self.wx)*0.001;
            self.wvy += (self.tile.wy-self.wy)*0.001;
          }
          else
          {
            self.wvx += (self.tile.shed.tx-self.tile.tx)*0.01;
            self.wvy += (self.tile.shed.ty-self.tile.ty)*0.01;
          }
        }
        if(ot != self.tile)
        {
          ot.fertilizer = 0;
          if(self.tile.fertilizer)
          {
            self.tile.fertilizer.state += self.state;
            break_item(self);
            return;
          }
          else
            self.tile.fertilizer = self;
        }
        if(self.state <= 0)
        {
          self.tile.fertilizer = 0;
          break_item(self);
          return;
        }
        break;
    }
  }

  self.draw = function()
  {
    if(self.offscreen) return;
    if(gg.inspector.detailed == self) gg.ctx.drawImage(icon_cursor_img,self.x,self.y,self.w,self.h);
    var y = self.y-self.h/4;
    var h = self.h+self.h/4;
    var img;
    switch(self.mark)
    {
      case MARK_USE:  img = gg.b.item_img(self.type); break;
      case MARK_SELL: img = gg.b.item_sell_img(self.type); break;
      case MARK_FEED: img = gg.b.item_feed_img(self.type); break;
    }
    if(self.type == ITEM_TYPE_FERTILIZER)
    {
      if(gg.b.nutrition_view) gg.ctx.drawImage(tile_fertilizer_nutrition_img,self.x,y,self.w,h);
      else
      {
        gg.ctx.globalAlpha = 0.5;
        gg.ctx.drawImage(img,self.x,y,self.w,h);
        gg.ctx.globalAlpha = 1;
      }
    }
    else gg.ctx.drawImage(img,self.x,y,self.w,h)
    if(self.mark == MARK_SELL)
    {
      gg.ctx.fillStyle = black;
      gg.ctx.font = gg.font_size+"px "+gg.font;
      gg.ctx.textAlign = "center";
      gg.ctx.fillText("+$"+worth_for_item(self.type),self.x+self.w/2,self.y+self.h+gg.font_size);
    }
  }
}

var farmbit = function()
{
  var self = this;
  self.thing = THING_TYPE_FARMBIT;

  self.wx = 0;
  self.wy = 0;
  self.ww = gg.b.tww*3/4;
  self.wh = gg.b.twh*3/4;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.name = farmbit_names[randIntBelow(farmbit_names.length)];
  self.color = randIntBelow(farmbit_colors);
  self.last_img = farmbit_imgs[self.color][FARMBIT_ANIM_IDLE][FARMBIT_ANIM_FRONT][0][FARMBIT_ANIM_RIGHT];
  self.home = 0;
  self.job_type = JOB_TYPE_IDLE;
  self.job_subject = 0;
  self.job_object = 0;
  self.job_state = JOB_STATE_ACT;
  self.job_state_t = 0;
  self.item = 0;
  self.locked_subject = 0;
  self.locked_object = 0;
  self.tile;

  self.lifetime = 0;
  self.fullness    = max_fullness;
  self.energy      = max_energy;
  self.joy         = max_joy;
  self.fulfillment = fulfillment_content;
  self.fullness_state    = FARMBIT_STATE_CONTENT;
  self.energy_state      = FARMBIT_STATE_CONTENT;
  self.joy_state         = FARMBIT_STATE_CONTENT;
  self.fulfillment_state = FARMBIT_STATE_CONTENT;

  self.emote_desperate_t = 0;

  self.emote_c = 0;
  self.emote_w = 0;
  self.emote_t = 0;
  self.emote_l = 500;

  self.emote = function(e)
  {
    
    if (e === my_logger.LOG_EMOTE_FULLNESS_DESPERATE_TXT) {
      self.emote_desperate_t = Date.now();
    }
    gg.ctx.font = gg.font_size+"px "+gg.font;
    self.emote_c = e;
    self.emote_w = gg.ctx.measureText(e).width;
    self.emote_t = 0;
    my_logger.emote(self,e);
  }

  self.anim_side = FARMBIT_ANIM_FRONT;
  self.anim_dir = FARMBIT_ANIM_RIGHT;
  self.anim_anim = FARMBIT_ANIM_IDLE;
  self.anim_frame = 0;
  self.anim_frame_l = farmbit_anim_lframes;
  self.anim_frame_t = randIntBelow(self.anim_frame_l[self.anim_anim]);

  self.walk_mod = function()
  {
    var mod = 1;
    if(self.item)
    {
      switch(self.item.type)
      {
        case ITEM_TYPE_WATER: mod *= water_carryability; break;
        case ITEM_TYPE_FOOD:  mod *= food_carryability;  break;
        case ITEM_TYPE_POOP:  mod *= poop_carryability;  break;
        case ITEM_TYPE_MILK:  mod *= milk_carryability;  break;
        case ITEM_TYPE_FERTILIZER: console.log("BROKEN"); break;
      }
    }
    if(self.tile) mod *= walkability_check(self.tile.type);
    return mod;
  }

  self.walk_toward_tile = function(t)
  {
    if(t.directions_dirty) gg.b.calculate_directions(t);
    var dx;
    var dy;
    switch(t.directions[self.tile.i])
    {
      case DIRECTION_NULL: dx =  0;   dy =  0;   return 0; break;
      case DIRECTION_R:    dx =  1;   dy =  0;   break;
      case DIRECTION_DR:   dx =  0.7; dy = -0.7; break;
      case DIRECTION_D:    dx =  0;   dy = -1;   break;
      case DIRECTION_DL:   dx = -0.7; dy = -0.7; break;
      case DIRECTION_L:    dx = -1;   dy =  0;   break;
      case DIRECTION_UL:   dx = -0.7; dy =  0.7; break;
      case DIRECTION_U:    dx =  0;   dy =  1;   break;
      case DIRECTION_UR:   dx =  0.7; dy =  0.7; break;
    }
    var mod = self.walk_mod();
    self.wx += dx*gg.b.walk_speed*mod;
    self.wy += dy*gg.b.walk_speed*mod;
    if(dy > 0) self.anim_side = FARMBIT_ANIM_BACK;
    else       self.anim_side = FARMBIT_ANIM_FRONT;
    if(dx < 0) self.anim_dir = FARMBIT_ANIM_LEFT;
    else       self.anim_dir = FARMBIT_ANIM_RIGHT;
    return 1;
  }

  self.walk_toward_item = function(it)
  {
    var t = it.tile;
    if(!self.walk_toward_tile(t))
    {
      var dx = it.wx-self.wx;
      var dy = it.wy-self.wy;
      var d = sqrt(dx*dx+dy*dy);
      var mod = self.walk_mod();
      var speed = gg.b.walk_speed*mod;
      if(speed < d)
      {
        dx = dx/d;
        dy = dy/d;
        self.wx += dx*speed;
        self.wy += dy*speed;
      }
      else
      {
        self.wx += dx;
        self.wy += dy;
      }
    }
  }

  self.calibrate_stats = function()
  {
    var old_fullness = self.fullness_state;
         if(self.fullness > fullness_content)   self.fullness_state = FARMBIT_STATE_CONTENT;
    else if(self.fullness > fullness_motivated) self.fullness_state = FARMBIT_STATE_MOTIVATED;
    else                                        self.fullness_state = FARMBIT_STATE_DESPERATE;

    var old_energy = self.energy_state;
         if(self.energy > energy_content)   self.energy_state = FARMBIT_STATE_CONTENT;
    else if(self.energy > energy_motivated) self.energy_state = FARMBIT_STATE_MOTIVATED;
    else                                    self.energy_state = FARMBIT_STATE_DESPERATE;

    var old_joy = self.joy_state;
         if(self.joy > joy_content)   self.joy_state = FARMBIT_STATE_CONTENT;
    else if(self.joy > joy_motivated) self.joy_state = FARMBIT_STATE_MOTIVATED;
    else                              self.joy_state = FARMBIT_STATE_DESPERATE;

         if(self.fulfillment > fulfillment_content)   self.fulfillment_state = FARMBIT_STATE_CONTENT;
    else if(self.fulfillment > fulfillment_motivated) self.fulfillment_state = FARMBIT_STATE_MOTIVATED;
    else                                              self.fulfillment_state = FARMBIT_STATE_DESPERATE;
  }

  self.die = function()
  {
    gg.aud_wrangler.play(death_aud);
    my_logger.farmbit_death(self);
    self.abandon_job(1);
    var t = self.tile;
    if(self.home) t = self.home;
    else
    {
      switch(t.type)
      {
        case  TILE_TYPE_LAND:
        case  TILE_TYPE_ROCK:
        case  TILE_TYPE_ROAD:
        case  TILE_TYPE_FOREST:
        case  TILE_TYPE_SHORE:
          break;
        case  TILE_TYPE_GRAVE:
        case  TILE_TYPE_SIGN:
        case  TILE_TYPE_LAKE:
        case  TILE_TYPE_HOME:
        case  TILE_TYPE_FARM:
        case  TILE_TYPE_LIVESTOCK:
          t = closest_graveable_tile(t);
          break;
      }
    }
    gg.advisors.another_death();
    gg.b.alterTile(t,TILE_TYPE_GRAVE);
    for(var i = 0; i < gg.farmbits.length; i++)
      if(gg.farmbits[i] == self) gg.farmbits.splice(i,1);
  }

  self.go_idle = function()
  {
    self.offscreen = 0;
    self.job_type = JOB_TYPE_IDLE;
    self.job_subject = 0;
    self.job_object = 0;
    self.job_state = JOB_STATE_ACT;
    self.job_state_t = 0;
  }

  self.lock_object = function(o)
  {
    self.locked_object = o;
    o.lock = 1;
  }
  self.lock_subject = function(o)
  {
    self.locked_subject = o;
    o.lock = 1;
  }

  self.unlock_object = function()
  {
    self.locked_object.lock = 0;
    self.locked_object = 0;
  }
  self.unlock_subject = function()
  {
    self.locked_subject.lock = 0;
    self.locked_subject = 0;
  }

  self.release_locks = function()
  {
    if(self.locked_object)   self.unlock_object();
    if(self.locked_subject)  self.unlock_subject();
  }

  self.abandon_job = function(reassign)
  {
    var job_type = self.job_type;
    var job_subject = self.job_subject;
    var job_object = self.job_object;
    var item = self.item;

    self.release_locks();
    if(self.item) { kick_item(self.item); self.item = 0; }
    self.go_idle();
    self.job_type = JOB_TYPE_WAIT;

    if(!reassign) return;
    switch(job_type)
    {
      case JOB_TYPE_PLANT:
      case JOB_TYPE_HARVEST:
      case JOB_TYPE_FEED:
      case JOB_TYPE_FERTILIZE:
      case JOB_TYPE_MILK:
        b_for_job(job_type, job_subject, job_object); break;
        break;
    }
  }

  self.tick = function()
  {
    self.anim_frame_t++;
    if(self.anim_frame_t > self.anim_frame_l[self.anim_anim])
    {
      self.anim_frame = (self.anim_frame+1)%farmbit_anim_nframes[self.anim_anim];
      self.anim_frame_t = 0;
    }

    if(self.emote_c)
    {
      self.emote_t++;
      if(self.emote_t > self.emote_l)
      {
        self.emote_c = 0;
        self.emote_w = 0;
        self.emote_t = 0;
      }
    }

    self.lifetime++;
    if(self.offscreen)
      ; //don't lose motivation! otherwise, every bit will come back dead
    else
    {
      self.fullness--;
      self.energy--;
      self.joy--;
      self.fulfillment--;
    }

    if(self.tile && self.tile.type == TILE_TYPE_LAKE)
    {
      if(self.tile.nutrition < water_fouled_threshhold)
        self.joy = min(max_joy,self.joy+swim_joy);
      else
      {
        self.emote("🤮");
        self.joy = max(0,self.joy-swim_joy);
      }
    }

    var dirty = false;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fullness < fullness_content)   { self.fullness_state = FARMBIT_STATE_MOTIVATED; self.emote("I'm hungry");   dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fullness < fullness_motivated) { self.fullness_state = FARMBIT_STATE_DESPERATE; self.emote("I NEED FOOD!"); dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_FULLNESS, self.job_type)) { self.abandon_job(1); } } break;
      case FARMBIT_STATE_DESPERATE: if(self.fullness < fullness_desperate) { self.fullness_state = FARMBIT_STATE_DIRE; self.die(); return; } break;
      default: break;
    }
    switch(self.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.energy < energy_content)   { self.energy_state = FARMBIT_STATE_MOTIVATED;       dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.energy < energy_motivated) { self.energy_state = FARMBIT_STATE_DESPERATE; self.emote("I need a nap!"); dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_ENERGY, self.job_type)) { self.abandon_job(1); } } break;
      default: break;
    }
    switch(self.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.joy < joy_content)   { self.joy_state = FARMBIT_STATE_MOTIVATED; self.emote("I want to play in the water"); dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.joy < joy_motivated) { self.joy_state = FARMBIT_STATE_DESPERATE; self.emote("I'M SO SAD"); dirty = 1;  if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_JOY, self.job_type)) { self.abandon_job(1); } } break;
      default: break;
    }
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fulfillment < fulfillment_content)   { self.fulfillment_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fulfillment < fulfillment_motivated) { self.fulfillment_state = FARMBIT_STATE_DESPERATE; dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_FULFILLMENT, self.job_type)) { self.abandon_job(1);} } break;
      default: break;
    }
    if(dirty && self.job_type == JOB_TYPE_IDLE) job_for_b(self);

    self.job_state_t++;
    switch(self.job_type)
    {
      case JOB_TYPE_NULL: console.log("BROKEN"); break;
      case JOB_TYPE_IDLE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            self.walk_toward_tile(self.job_subject);
            if(self.tile == self.job_subject || rand() < 0.01)
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_SEEK;
              self.job_state_t = 0;
              for(var i = 0; i < 100; i++)
              {
                var stx = gg.b.bounds_tx+randIntBelow(gg.b.bounds_tw);
                var sty = gg.b.bounds_ty+randIntBelow(gg.b.bounds_th);
                self.job_subject = gg.b.bounded_tiles_t(stx,sty);
                var good = 1;
                for(var j = 0; j < gg.b.tile_groups[TILE_TYPE_SIGN].length; j++)
                {
                  var st = gg.b.tile_groups[TILE_TYPE_SIGN][j];
                  if(abs(st.tx-self.job_subject.tx)+abs(st.ty-self.job_subject.ty) < 6) { good = 0; break; }
                }
                if(good) break;
              }
            }
            else
            {
              self.anim_side = FARMBIT_ANIM_FRONT;
              self.anim_dir = FARMBIT_ANIM_RIGHT;
            }
          }
            break;
        }
      }
        break;
      case JOB_TYPE_WAIT:
      {
        if(self.job_state_t > wait_t)
        {
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_EAT:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_item(o);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_ACT;
                self.job_state_t = 0;
              }
            }
            break;
          case JOB_STATE_ACT:
            my_logger.eat_food(self, self.item)
            break_item(self.item);
            self.item = 0;
            self.fullness = max_fullness;
            self.fullness_state = FARMBIT_STATE_CONTENT;
            self.emote("😋");
            self.go_idle();
            job_for_b(self);
            break;
        }
      }
        break;
      case JOB_TYPE_SLEEP:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            if(self.home && self.tile != self.home)
              self.walk_toward_tile(self.home);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
              self.emote("😴");
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.energy += sleep_energy;
            if(self.energy > max_energy)
            {
              self.energy = max_energy;
              self.energy_state = FARMBIT_STATE_CONTENT;
              self.go_idle();
              job_for_b(self);
            }
          }
            break;
        }
      }
        break;
      case JOB_TYPE_PLAY:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            if(self.tile.nutrition > water_fouled_threshhold)
            {
              var t = closest_unlocked_nutrientdeficient_tile_from_list(self.tile, water_fouled_threshhold, gg.b.tile_groups[TILE_TYPE_LAKE]);
              if(t)
              {
                self.job_subject = t;
                self.job_state = JOB_STATE_SEEK;
                self.job_state_t = 0;
              }
              else
                self.abandon_job(0);
            }
            self.joy += swim_joy;
            if(self.joy > max_joy)
            {
              self.joy = max_joy;
              self.joy_state = FARMBIT_STATE_CONTENT;
              self.emote("🙂");
              self.go_idle();
              job_for_b(self);
            }
          }
            break;
        }
      }
        break;
      case JOB_TYPE_PLANT:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var o = self.job_object;
            var t = self.job_object.tile;

            if(gg.b.raining)
            {
              self.job_state = JOB_STATE_SEEK;
              self.job_state_t = 0;
            }
            else
            {
              if(o.thing == THING_TYPE_ITEM)
              {
                if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                  self.walk_toward_item(o);
                else
                {
                  self.item = o;
                  self.job_state = JOB_STATE_SEEK;
                  self.job_state_t = 0;
                }
              }
              else if(self.job_object.thing == THING_TYPE_TILE)
              {
                if(self.tile != t.tile)
                  self.walk_toward_tile(t);
                else
                {
                  //pop water
                  var it = new item();
                  it.type = ITEM_TYPE_WATER;
                  it.tile = t;
                  gg.b.tiles_tw(it.tile,it);
                  light_kick_item(it);
                  gg.items.push(it);
                  self.lock_object(it);

                  self.job_object = it;
                  self.job_state = JOB_STATE_GET;
                  self.job_state_t = 0;
                }
              }
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.item)
            {
              self.item.wvx += (self.wx-self.item.wx)*0.01;
              self.item.wvy += (self.wy-self.item.wy)*0.01;
            }
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;

            if(self.item) break_item(self.item); //no item if it was raining
            self.item = 0;

            t.state = TILE_STATE_FARM_PLANTED;
            t.state_t = 0;
            t.fx_t = 0;
            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
          break;
      case JOB_TYPE_HARVEST:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;
            t.state = TILE_STATE_FARM_UNPLANTED;
            t.state_t = 0;

            gg.money += harvest_profit;
            if(harvest_profit) gg.b.sell_p(t.tile,"+$"+harvest_profit);
            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            self.go_idle();

            //gen food
            var it;
            for(var i = 0; i < 2; i++)
            {
              it = new item();
              it.type = ITEM_TYPE_FOOD;
              it.tile = t;
              it.mark = t.marks[i];
              gg.b.tiles_tw(it.tile,it);
              kick_item(it);
              gg.items.push(it);
              my_logger.increment_food_produced(t);
              if(it.mark == MARK_SELL) b_for_job(JOB_TYPE_EXPORT, 0, it);
              else if(!(it.mark == MARK_USE && b_for_job(JOB_TYPE_EAT, 0, it))) ;
              else if(!(it.mark == MARK_FEED && b_for_job(JOB_TYPE_FEED, 0, it))) ;
            }

            b_for_job(JOB_TYPE_PLANT, t, 0);
            if(self.job_type == JOB_TYPE_IDLE) job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_FEED:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_item(o);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_SEEK;
                self.job_state_t = 0;
              }
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            t.val++;

            self.fulfillment += feed_fulfillment;
            self.calibrate_stats();
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_FERTILIZE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var o = self.job_object;
            var t = self.job_object.tile;

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_item(o);
              else
              {
                self.item = o;
                self.job_state = JOB_STATE_SEEK;
                self.job_state_t = 0;
              }
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            //t.nutrition += farm_nutrition_req;

            var it = t.fertilizer;
            if(!it)
            {
              it = new item();
              it.type = ITEM_TYPE_FERTILIZER;
              it.lock = 1; //permalocked
              it.state = 0;
              it.tile = t;
              gg.b.tiles_tw(it.tile,it);
              gg.items.push(it);
            }
            it.state += fertilizer_nutrition;
            t.fertilizer = it;

            self.fulfillment += fertilize_fulfillment;
            self.calibrate_stats();
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_MILK:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;
            t.state = TILE_STATE_LIVESTOCK_EATING;
            t.state_t = 0;

            self.fulfillment += milking_fulfillment;
            self.calibrate_stats();
            self.go_idle();

            var it;
            it = new item();
            it.type = ITEM_TYPE_MILK;
            it.tile = t;
            it.mark = t.marks[0];
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);
            my_logger.increment_milk_produced(t);
            if(it.mark == MARK_SELL) b_for_job(JOB_TYPE_EXPORT, 0, it) ;
            else if(!(it.mark == MARK_USE && b_for_job(JOB_TYPE_EAT, 0, it))) ;

            if(self.job_type == JOB_TYPE_IDLE) job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_EXPORT:
      {
        switch(self.job_state)
        {
          case JOB_STATE_GET:
          {
            var it = self.job_object;
            var t = it.tile;
            if(self.tile != t || abs(it.wvz) > 0.01 || it.wz > 0.01)
              self.walk_toward_item(it);
            else
            {
              self.item = self.job_object;
              self.job_subject = closest_edge_tile(t);
              self.job_state = JOB_STATE_SEEK;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_SEEK:
          {
            var t = self.job_subject;
            self.item.wvx += (self.wx-self.item.wx)*0.01;
            self.item.wvy += (self.wy-self.item.wy)*0.01;
            if(self.tile != t)
              self.walk_toward_tile(t);
            else
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
              self.offscreen = 1;
              if(gg.inspector.detailed == self || gg.inspector.detailed == self.item)
                gg.inspector.deselect();
              self.item.offscreen = 1;
              my_logger.sale_start(self, self.item, worth_for_item(self.item.type));
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            if(self.job_state_t > export_t)
            {
              self.release_locks();
              var t = self.job_subject;

              gg.money += worth_for_item(self.item.type);
              gg.aud_wrangler.play(money_aud);
              gg.b.sell_p(t.tile,"+$"+worth_for_item(self.item.type));
              my_logger.sale_end(self, self.item, worth_for_item(self.item.type));

              break_item(self.item);
              self.item = 0;

              self.fulfillment += export_fulfillment;
              self.calibrate_stats();

              self.go_idle();
              job_for_b(self);
            }
          }
            break;
        }
      }
        break;
      default:
        return;
    }

    gg.b.boundw(self);
    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    if(gg.inspector.detailed == self) gg.ctx.drawImage(icon_cursor_img,self.x,self.y,self.w,self.h);
    gg.ctx.globalAlpha = 1;
    if(debug_jobs)
    {
      if(self.job_subject)
      {
        if(self.job_subject.thing == THING_TYPE_TILE)
        {
          gg.b.tiles_tw(self.job_subject,self.job_subject);
          screenSpacePt(gg.cam, gg.canvas, self.job_subject);
        }
        gg.ctx.strokeStyle = green;
        drawLine(self.x+self.w/2,self.y+self.h/2,self.job_subject.x,self.job_subject.y,gg.ctx);
      }

      if(self.job_object)
      {
        if(self.job_object.thing == THING_TYPE_TILE)
        {
          gg.b.tiles_tw(self.job_object,self.job_object);
          screenSpacePt(gg.cam, gg.canvas, self.job_object);
        }
        gg.ctx.strokeStyle = green;
        drawLine(self.x+self.w/2,self.y+self.h/2,self.job_object.x,self.job_object.y,gg.ctx);
      }
    }

    /*
    var w = self.w/4;
    var x = self.x;
    var y = self.y;
    var h = self.h;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.fullness,w,h*self.fullness);
    x += w;
    switch(self.energy_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.energy,w,h*self.energy);
    x += w;
    switch(self.joy_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.joy,w,h*self.joy);
    x += w;
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
    }
    gg.ctx.fillRect(x,y-h*self.fulfillment,w,h*self.fulfillment);
    x += w;
    */

    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = black;

    if(self.offscreen)
    {
      if(self.job_type == JOB_TYPE_EXPORT && self.job_state == JOB_STATE_ACT)
      {
        gg.ctx.drawImage(tile_out_img,self.x-self.w/4,self.y,self.w+self.w/4,self.h+self.h/2);
        gg.b.timer_atlas.blitWholeSprite(gg.b.timer_atlas_i(self.job_state_t/export_t,1+(1/(gg.b.timer_colors-1))),self.x-self.w/3,self.y-self.h/2,gg.ctx);
      }
      return;
    }

    var anim = self.anim_anim;
    if(self.tile.type == TILE_TYPE_LAKE)
    {
      if(anim != FARMBIT_ANIM_SWIM) my_logger.emote_swim(self);
      anim = FARMBIT_ANIM_SWIM;
    }
    else if(self.job_type == JOB_TYPE_IDLE && self.job_state == JOB_STATE_ACT)  anim = FARMBIT_ANIM_IDLE;
    //else if(self.job_type == JOB_TYPE_SLEEP && self.job_state == JOB_STATE_ACT)  anim = FARMBIT_ANIM_SLEEP;
    else if(self.job_state == JOB_STATE_GET || self.job_state == JOB_STATE_SEEK) anim = FARMBIT_ANIM_WALK;
    if(anim != self.anim_anim) self.anim_frame = 0;
    self.anim_anim = anim;

    if(self.job_state == JOB_STATE_ACT)
    {
      /*
      switch(self.job_type)
      {
        case JOB_TYPE_SLEEP: gg.ctx.fillText("ZZ",self.x+self.w/2,self.y-10); break;
        case JOB_TYPE_PLAY:  gg.ctx.fillText(":)",self.x+self.w/2,self.y-10); break;
      }
      */
    }
    self.last_img = farmbit_imgs[self.color][self.anim_anim][self.anim_side][self.anim_frame][self.anim_dir];
    gg.ctx.drawImage(self.last_img,self.x,self.y-self.h/4,self.w,self.h+self.h/4);

    /*
         if(self.fullness_state == FARMBIT_STATE_DESPERATE) gg.ctx.fillText("HUNGRY",self.x+self.w/2,self.y);
    else if(self.energy_state   == FARMBIT_STATE_DESPERATE) gg.ctx.fillText("SLEEPY",self.x+self.w/2,self.y);
    else if(self.joy_state      == FARMBIT_STATE_DESPERATE) gg.ctx.fillText("SAD",self.x+self.w/2,self.y);
    else if(self.fullness_state == FARMBIT_STATE_MOTIVATED) gg.ctx.fillText("hungry",self.x+self.w/2,self.y);
    else if(self.energy_state   == FARMBIT_STATE_MOTIVATED) gg.ctx.fillText("sleepy",self.x+self.w/2,self.y);
    else if(self.joy_state      == FARMBIT_STATE_MOTIVATED) gg.ctx.fillText("sad",self.x+self.w/2,self.y);
    */

    self.pad = gg.stage.s_mod*10;
    if(self.emote_c)
    {
      var t = self.emote_t/self.emote_l;
           if(t < 0.01) gg.ctx.globalAlpha = t*100;
      else if(t > 0.7)  gg.ctx.globalAlpha = clamp(0,1,1-((t-0.7)/0.3));
      else              gg.ctx.globalAlpha = 1;

      var y = self.y-(20-(30-bounceup(t)*30))*gg.stage.s_mod;
      if(self.emote_c.length > 2) //emoji length == 2
      {
        gg.ctx.font = gg.font_size+"px "+gg.font;
        gg.ctx.fillStyle = white;
        fillRRect(self.x+self.w/2-self.emote_w/2-self.pad,y-gg.font_size-self.pad,self.emote_w+self.pad*2,gg.font_size+self.pad*2,self.pad,gg.ctx);
      }
      else
      {
        gg.ctx.font = (gg.font_size*1.5)+"px "+gg.font;
      }
      gg.ctx.fillStyle = black;
      gg.ctx.fillText(self.emote_c,self.x+self.w/2,y);
    }
    gg.ctx.globalAlpha = 1;

  }
}

