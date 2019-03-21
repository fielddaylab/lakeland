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
var TILE_TYPE_LAKE     = ENUM; ENUM++;
var TILE_TYPE_SHORE     = ENUM; ENUM++;
var TILE_TYPE_FOREST   = ENUM; ENUM++;
var TILE_TYPE_HOME      = ENUM; ENUM++;
var TILE_TYPE_FARM      = ENUM; ENUM++;
var TILE_TYPE_LIVESTOCK = ENUM; ENUM++;
var TILE_TYPE_STORAGE   = ENUM; ENUM++;
var TILE_TYPE_PROCESSOR = ENUM; ENUM++;
var TILE_TYPE_ROAD      = ENUM; ENUM++;
var TILE_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var TILE_STATE_NULL               = ENUM; ENUM++;
var TILE_STATE_HOME_VACANT        = ENUM; ENUM++;
var TILE_STATE_HOME_OCCUPIED      = ENUM; ENUM++;
var TILE_STATE_FARM_UNPLANTED     = ENUM; ENUM++;
var TILE_STATE_FARM_PLANTED       = ENUM; ENUM++;
var TILE_STATE_FARM_GROWN         = ENUM; ENUM++;
var TILE_STATE_LIVESTOCK_IDLE     = ENUM; ENUM++;
var TILE_STATE_STORAGE_UNASSIGNED = ENUM; ENUM++;
var TILE_STATE_STORAGE_FOOD       = ENUM; ENUM++;
var TILE_STATE_STORAGE_POOP       = ENUM; ENUM++;
var TILE_STATE_STORAGE_VALUABLE   = ENUM; ENUM++;
var TILE_STATE_COUNT              = ENUM; ENUM++;

ENUM = 0;
var ITEM_TYPE_NULL     = ENUM; ENUM++;
var ITEM_TYPE_WATER    = ENUM; ENUM++;
var ITEM_TYPE_FOOD     = ENUM; ENUM++;
var ITEM_TYPE_POOP     = ENUM; ENUM++;
var ITEM_TYPE_VALUABLE = ENUM; ENUM++;
var ITEM_TYPE_COUNT    = ENUM; ENUM++;

ENUM = 0;
var ITEM_STATE_NULL        = ENUM; ENUM++;
var ITEM_STATE_POOP_RAW    = ENUM; ENUM++;
var ITEM_STATE_POOP_LIGHT  = ENUM; ENUM++;
var ITEM_STATE_POOP_POTENT = ENUM; ENUM++;
var ITEM_STATE_COUNT       = ENUM; ENUM++;

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
var JOB_TYPE_STORE     = ENUM; ENUM++;
var JOB_TYPE_PROCESS   = ENUM; ENUM++;
var JOB_TYPE_KICK      = ENUM; ENUM++;
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

var walkability_check = function(type,state)
{
  switch(type)
  {
    case TILE_TYPE_LAND:      return land_walkability;      break;
    case TILE_TYPE_ROCK:      return rock_walkability;      break;
    case TILE_TYPE_LAKE:     return water_walkability;     break;
    case TILE_TYPE_SHORE:     return shore_walkability;     break;
    case TILE_TYPE_FOREST:   return forest_walkability;   break;
    case TILE_TYPE_HOME:      return home_walkability;      break;
    case TILE_TYPE_FARM:      return farm_walkability;      break;
    case TILE_TYPE_LIVESTOCK: return livestock_walkability; break;
    case TILE_TYPE_STORAGE:   return storage_walkability;   break;
    case TILE_TYPE_PROCESSOR: return processor_walkability; break;
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
    case TILE_TYPE_LAKE:
    case TILE_TYPE_SHORE:
    case TILE_TYPE_FOREST:
      return 1;
      break;
    case TILE_TYPE_HOME:
    case TILE_TYPE_FARM:
    case TILE_TYPE_LIVESTOCK:
    case TILE_TYPE_STORAGE:
    case TILE_TYPE_PROCESSOR:
      return over == TILE_TYPE_LAND;
      break;
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

var demolishability_check = function(over)
{
  switch(over)
  {
    case TILE_TYPE_HOME:
    case TILE_TYPE_FARM:
    case TILE_TYPE_LIVESTOCK:
    case TILE_TYPE_STORAGE:
    case TILE_TYPE_PROCESSOR:
    case TILE_TYPE_ROAD:
      return 1;
      break;
  }
  return 0;
}

var storage_for_item = function(item_type)
{
  switch(item_type)
  {
    case ITEM_TYPE_FOOD:     return TILE_STATE_STORAGE_FOOD;
    case ITEM_TYPE_POOP:     return TILE_STATE_STORAGE_POOP;
    case ITEM_TYPE_VALUABLE: return TILE_STATE_STORAGE_VALUABLE;
    default: return TILE_STATE_STORAGE_UNASSIGNED;
  }
}

var worth_for_item = function(item_type)
{
  switch(item_type)
  {
    case ITEM_TYPE_FOOD:     return item_worth_food;
    case ITEM_TYPE_POOP:     return item_worth_poop;
    case ITEM_TYPE_VALUABLE: return item_worth_valuable;
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
        case JOB_TYPE_PROCESS:
        case JOB_TYPE_FERTILIZE:
        case JOB_TYPE_STORE:
        case JOB_TYPE_KICK:
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
    if(t.lock || t.nutrition < threshhold || !gg.b.tile_in_bounds(t)) continue;
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
    if(t.lock || t.nutrition >= threshhold || !gg.b.tile_in_bounds(t)) continue;
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
var closest_unlocked_available_state_tile_from_list = function(goal, state, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || t.state != state || t.val-t.withdraw_lock <= 0 || !gg.b.tile_in_bounds(t)) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_free_state_tile_from_list = function(goal, state, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock || t.state != state || t.val+t.deposit_lock >= storage_max || !gg.b.tile_in_bounds(t)) continue;
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
var closest_unlocked_state_item_of_type = function(goal, type, state)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.state != state || it.lock || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_sale_item = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.lock || !it.sale || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_nosale_item = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.lock || it.sale || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_nosale_item_of_type = function(goal, type)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.lock || it.sale || !gg.b.tile_in_bounds(it.tile)) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_nosale_state_item_of_type = function(goal, type, state)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.state != state || it.lock || it.sale || !gg.b.tile_in_bounds(it.tile)) continue;
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
  it = closest_unlocked_nosale_item_of_type(b.tile,ITEM_TYPE_FOOD);
  if(it)
  {
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_EAT;
    b.job_state = JOB_STATE_GET;
    gg.ticker.nq(b.name+" is going to get some food.");
    return 1;
  }

  //eat storage
  t = closest_unlocked_available_state_tile_from_list(b.tile, TILE_STATE_STORAGE_FOOD, gg.b.tile_groups[TILE_TYPE_STORAGE]);
  if(t)
  {
    b.go_idle();
    b.job_object = t;
    b.lock_withdraw(b.job_object);
    b.job_type = JOB_TYPE_EAT;
    b.job_state = JOB_STATE_GET;
    gg.ticker.nq(b.name+" is going to get some food from storage.");
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
    gg.ticker.nq(b.name+" is going to harvest a farm.");
    return 1;
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_nosale_item_of_type(b.tile,ITEM_TYPE_WATER);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_PLANT;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to plant a farm.");
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
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
        gg.ticker.nq(b.name+" is going to plant a farm with lake water.");
        return 1;
      }
    }
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_nosale_item_of_type(t,ITEM_TYPE_POOP);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to fertilize a farm.");
      return 1;
    }
    else
    {
      tp = closest_unlocked_available_state_tile_from_list(t, TILE_STATE_STORAGE_POOP, gg.b.tile_groups[TILE_TYPE_STORAGE]);
      if(tp)
      { //found storage
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FERTILIZE;
        b.job_state = JOB_STATE_GET;
        gg.ticker.nq(b.name+" is going to fertilize a farm.");
        return 1;
      }
    }
  }

  return 0;
}

var energy_job_for_b = function(b)
{
  b.go_idle();
  b.job_type = JOB_TYPE_SLEEP;
  b.job_state = JOB_STATE_SEEK;
  gg.ticker.nq(b.name+" is going to take a nap.");
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
    gg.ticker.nq(b.name+" is going to play in the lake.");
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
  t = closest_unlocked_valdeficient_tile_from_list(b.tile, livestock_feed_threshhold, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
  if(t)
  {
    it = closest_unlocked_nosale_item_of_type(t,ITEM_TYPE_FOOD);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FEED;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to feed some livestock.");
      return 1;
    }
    else
    {
      tp = closest_unlocked_available_state_tile_from_list(t, TILE_STATE_STORAGE_FOOD, gg.b.tile_groups[TILE_TYPE_STORAGE]);
      if(tp)
      { //found storage
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FEED;
        b.job_state = JOB_STATE_GET;
        gg.ticker.nq(b.name+" is going to feed some livestock.");
        return 1;
      }
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
    gg.ticker.nq(b.name+" is going to harvest a farm.");
    return 1;
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_nosale_item_of_type(b.tile,ITEM_TYPE_WATER);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_PLANT;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to plant a farm.");
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
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
        gg.ticker.nq(b.name+" is going to plant a farm.");
        return 1;
      }
    }
  }

  //process
  it = closest_unlocked_nosale_state_item_of_type(b.tile,ITEM_TYPE_POOP,ITEM_STATE_POOP_RAW);
  if(it)
  { //found item
    t = closest_unlocked_tile_from_list(it.tile, gg.b.tile_groups[TILE_TYPE_PROCESSOR]);
    if(t)
    {
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_PROCESS;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to process some poop.");
      return 1;
    }
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_nosale_item_of_type(t,ITEM_TYPE_POOP);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
      gg.ticker.nq(b.name+" is going to fertilize a farm.");
      return 1;
    }
    else
    {
      tp = closest_unlocked_available_state_tile_from_list(t, TILE_STATE_STORAGE_POOP, gg.b.tile_groups[TILE_TYPE_STORAGE]);
      if(tp)
      { //found storage
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FERTILIZE;
        b.job_state = JOB_STATE_GET;
        gg.ticker.nq(b.name+" is going to fertilize a farm.");
        return 1;
      }
    }
  }

  //store
  it = closest_unlocked_nosale_item(b.tile);
  if(it)
  { //found item
    var search_type = storage_for_item(it.type);
    t = closest_unlocked_free_state_tile_from_list(it.tile, search_type, gg.b.tile_groups[TILE_TYPE_STORAGE]);
    if(!t) t = closest_unlocked_free_state_tile_from_list(it.tile, TILE_STATE_STORAGE_UNASSIGNED, gg.b.tile_groups[TILE_TYPE_STORAGE]);
    if(t)
    {
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_deposit(b.job_subject);
      b.lock_object(b.job_object);
      b.job_subject.state = search_type;
      b.job_type = JOB_TYPE_STORE;
      b.job_state = JOB_STATE_GET;
      if(it.type == ITEM_TYPE_FOOD)     gg.ticker.nq(b.name+" is going to store some food for later.");
      if(it.type == ITEM_TYPE_POOP)     gg.ticker.nq(b.name+" is going to store some poop for later.");
      if(it.type == ITEM_TYPE_VALUABLE) gg.ticker.nq(b.name+" is going to store some valuables for later.");
      return 1;
    }
  }

  //export
  it = closest_unlocked_sale_item(b.tile);
  if(it && !gg.b.tiles[0].lock && it.sale)
  { //found item
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_subject = closest_edge_tile(b.tile);
    b.job_type = JOB_TYPE_EXPORT;
    b.job_state = JOB_STATE_GET;
    if(it.type == ITEM_TYPE_FOOD)     gg.ticker.nq(b.name+" is going to export some food- safe travels!");
    if(it.type == ITEM_TYPE_POOP)     gg.ticker.nq(b.name+" is going to export some poop- safe travels!");
    if(it.type == ITEM_TYPE_VALUABLE) gg.ticker.nq(b.name+" is going to export some valuables- safe travels!");
    return 1;
  }

  //kick
  it = closest_unlocked_item(b.tile);
  if(it)
  { //found item
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_KICK;
    b.job_state = JOB_STATE_GET;
    if(it.type == ITEM_TYPE_FOOD)     gg.ticker.nq(b.name+" is going to kick around some food.");
    if(it.type == ITEM_TYPE_POOP)     gg.ticker.nq(b.name+" is going to kick around some poop.");
    if(it.type == ITEM_TYPE_VALUABLE) gg.ticker.nq(b.name+" is going to kick around some valuables.");
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
      if(best)
      {
        best.job_type = JOB_TYPE_EAT;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.lock_object(best.job_object);
        best.job_state = JOB_STATE_GET;
        best.job_state_t = 0;
        gg.ticker.nq(best.name+" is going to eat some food.");
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
          job_object = closest_unlocked_nosale_item_of_type(job_subject,ITEM_TYPE_WATER);
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
          gg.ticker.nq(best.name+" is going to plant a farm.");
        }
        else if(job_type == JOB_TYPE_HARVEST)
        {
          best.job_state = JOB_STATE_SEEK;
          gg.ticker.nq(best.name+" is going to harvest a farm.");
        }
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FEED:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some livestock and some food and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_valdeficient_tile_from_list(job_object.tile, livestock_feed_threshhold, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_nosale_item_of_type(job_subject,ITEM_TYPE_FOOD);
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
        if(best.job_object.thing == THING_TYPE_TILE) best.lock_withdraw(best.job_object);
        best.job_state = JOB_STATE_GET;
        gg.ticker.nq(best.name+" is going to feed some livestock.");
        return 1;
      }
    }
      break;
    case JOB_TYPE_FERTILIZE:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_nutrientdeficient_tile_from_list(job_object, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_nosale_item_of_type(job_subject,ITEM_TYPE_POOP);
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
        if(best.job_object.thing == THING_TYPE_TILE) best.lock_withdraw(best.job_object);
        best.job_state = JOB_STATE_GET;
        gg.ticker.nq(best.name+" is going to fertilize a farm.");
        return 1;
      }
    }
      break;
    case JOB_TYPE_STORE:
    {
      /*
      //priorities:
      closest low fulfillment bit
      */

      if(!job_subject)
      {
        var search_type = storage_for_item(job_object.type);
        job_subject = closest_unlocked_free_state_tile_from_list(job_object, search_type, gg.b.tile_groups[TILE_TYPE_STORAGE]);
        if(!job_subject) job_subject = closest_unlocked_free_state_tile_from_list(job_object, TILE_STATE_STORAGE_UNASSIGNED, gg.b.tile_groups[TILE_TYPE_STORAGE]);
      }
      if(!job_subject) return 0;

      var best = closest_free_farmbit_with_desire(job_object.tile, 1, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.job_state = JOB_STATE_GET;
        best.lock_object(best.job_object);
        best.lock_deposit(best.job_subject);
        best.job_subject.state = storage_for_item(best.job_object.type);
        if(job_object.type == ITEM_TYPE_FOOD)     gg.ticker.nq(best.name+" is going to store some food for later.");
        if(job_object.type == ITEM_TYPE_POOP)     gg.ticker.nq(best.name+" is going to store some poop for later.");
        if(job_object.type == ITEM_TYPE_VALUABLE) gg.ticker.nq(best.name+" is going to store some valuables for later.");
        return 1;
      }
    }
      break;
    case JOB_TYPE_PROCESS:
    {
      /*
      //priorities:
      closest low fulfillment bit
      */

      if(!job_subject) job_subject = closest_unlocked_tile_from_list(job_object, gg.b.tile_groups[TILE_TYPE_PROCESSOR]);
      if(!job_subject) return 0;

      var best = closest_free_farmbit_with_desire(job_object.tile, 1, 0, 0, 1);
      if(best)
      {
        best.go_idle();
        best.job_type = job_type;
        best.job_subject = job_subject;
        best.job_object = job_object;
        best.job_state = JOB_STATE_GET;
        best.lock_object(best.job_object);
        gg.ticker.nq(best.name+" is going to process some poop.");
        return 1;
      }
    }
      break;
    case JOB_TYPE_KICK:
    {
      console.log("FINISH");//figure out
    }
      break;
    case JOB_TYPE_EXPORT:
    {
      console.log("FINISH");//figure out
    }
      break;
    default:
      break;
  }

  return 0;
}

var break_item = function(it)
{
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

var tile = function()
{
  var self = this;
  self.thing = THING_TYPE_TILE;

  self.tile = self; //trick that allows all thing.tile to reference a tile
  self.shed = self; //<- set to tile corresponding to direction of flow in rainfall
  self.directions = [];
  self.directions_dirty = 1;
  self.tx = 0;
  self.ty = 0;
  self.i = 0;
  self.og_type = TILE_TYPE_LAND;
  self.type = TILE_TYPE_LAND;
  self.state = TILE_STATE_NULL;
  self.state_t = 0;
  self.val = 0;
  self.nutrition = 0;
  self.withdraw_lock = 0;
  self.deposit_lock = 0;
  self.lock = 0;
  //only calc'd/updated on 'screen_tile'
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
}

var board = function()
{
  var self = this;

  self.resize = function()
  {

  }
  self.resize();

  self.tw = board_w;
  self.th = board_h;
  self.bounds_tx = floor(self.tw*3/8);
  self.bounds_ty = floor(self.th*3/8);
  self.bounds_tw = floor(self.tw*1/4);
  self.bounds_th = floor(self.th*1/4);
  //self.bounds_tw = 1;
  //self.bounds_th = 1;
  self.bounds_n = 1;
  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;
  self.tww = self.ww/self.tw;
  self.twh = self.wh/self.th;

  self.null_tile = new tile();
  self.tl_bound_tile = self.null_tile; //gets set w/ zoom_tile
  self.br_bound_tile = self.null_tile; //gets set w/ zoom_tile
  self.tiles = [];
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

  self.raining = 0;
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
    if(self.bounds_tx > 0 && self.bounds_tw%2) self.bounds_tx--;
    if(self.bounds_tw < self.tw) self.bounds_tw++;
    if(self.bounds_ty > 0 && self.bounds_th%2) self.bounds_ty--;
    if(self.bounds_th < self.th) self.bounds_th++;
    self.tl_bound_tile = self.tiles[self.tiles_i(self.bounds_tx,self.bounds_ty+self.bounds_th-1)];
    self.br_bound_tile = self.tiles[self.tiles_i(self.bounds_tx+self.bounds_tw-1,self.bounds_ty)];
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

    screenSpace(gg.cam, gg.canvas, self);
    self.screen_tile(self.tl_bound_tile);
    self.screen_tile(self.br_bound_tile);

    self.cloud_x = 0;
    self.cloud_y = 0;
    self.cloud_w = clouds_img.width;
    self.cloud_h = clouds_img.height;
    self.cloud_ix = 367;
    self.cloud_iy = 104;
    self.cloud_iw = 1360;
    self.cloud_ih = 1200;

    self.bounds_w = (self.bounds_tw/self.tw)*self.w;
    self.bounds_h = (self.bounds_th/self.th)*self.h;
    self.bounds_x = self.x+       (self.bounds_tx/self.tw)*self.w;
    self.bounds_y = self.y+self.h-(self.bounds_ty/self.th)*self.h-self.bounds_h;

    var wr = self.bounds_w/self.cloud_iw;
    var hr = self.bounds_h/self.cloud_ih;

    self.cloud_w *= wr;
    self.cloud_h *= hr;
    self.cloud_x = self.bounds_x-self.cloud_ix*wr;
    self.cloud_y = self.bounds_y-self.cloud_iy*hr;
    self.cloud_x = round(self.cloud_x);
    self.cloud_y = round(self.cloud_y);
    self.cloud_w = round(self.cloud_w);
    self.cloud_h = round(self.cloud_h);
  }

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.visit_t = 0;

  self.hovering;
  self.hover_t;
  self.hover_t_placable;

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
      if(ct.ty > 0)
      {
        if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw-1,diagonal_tax,check); //check bottom left
                              handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw,             1,check); //check bottom
        if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex-self.tw+1,diagonal_tax,check); //check bottom right
      }
      if(ct.ty < self.th-1)
      {
        if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw-1,diagonal_tax,check); //check top left
                              handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw,             1,check); //check top
        if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex+self.tw+1,diagonal_tax,check); //check top right
      }
      if(ct.tx > 0)         handle(cindex,t.directions,flow_v,flow_d,cindex-1,1,check); //check left
      if(ct.tx < self.tw-1) handle(cindex,t.directions,flow_v,flow_d,cindex+1,1,check); //check right
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

  self.tile_colors = [];
  self.tile_color = function(type, nutrition)
  {
    return self.tile_colors[type][floor(min(nutrition*255,255))];
  }
  self.tile_img = function(type)
  {
    switch(type)
    {
      case TILE_TYPE_LAND:      return land_img; break;
      case TILE_TYPE_LAKE:      return lake_img; break;
      case TILE_TYPE_SHORE:     return shore_img; break;
      case TILE_TYPE_LIVESTOCK: return livestock_img; break;
      case TILE_TYPE_STORAGE:   return storage_img; break;
      case TILE_TYPE_PROCESSOR: return processor_img; break;
      case TILE_TYPE_ROAD:      return road_img; break;
      case TILE_TYPE_ROCK:      return rock_img; break;
      case TILE_TYPE_FOREST:    return forest_img; break;
      case TILE_TYPE_HOME:      return home_img; break;
      case TILE_TYPE_FARM:      return farm_img; break;
    }
    return land_img;
  }
  self.tile_name = function(type)
  {
    switch(type)
    {
      case TILE_TYPE_NULL:      return "Null";      break;
      case TILE_TYPE_LAND:      return "Land";      break;
      case TILE_TYPE_ROCK:      return "Rock";      break;
      case TILE_TYPE_LAKE:      return "Lake";      break;
      case TILE_TYPE_SHORE:     return "Shore";     break;
      case TILE_TYPE_FOREST:    return "Forest";    break;
      case TILE_TYPE_HOME:      return "Home";      break;
      case TILE_TYPE_FARM:      return "Farm";      break;
      case TILE_TYPE_LIVESTOCK: return "Livestock"; break;
      case TILE_TYPE_STORAGE:   return "Storage";   break;
      case TILE_TYPE_PROCESSOR: return "Processor"; break;
      case TILE_TYPE_ROAD:      return "Road";      break;
      case TILE_TYPE_COUNT:     return "Count";     break;
    }
  }
  self.state_name = function(type)
  {
    switch(type)
    {
      case TILE_STATE_NULL:               return "null";       break;
      case TILE_STATE_HOME_VACANT:        return "vacant";     break;
      case TILE_STATE_HOME_OCCUPIED:      return "occupied";   break;
      case TILE_STATE_FARM_UNPLANTED:     return "unplanted";  break;
      case TILE_STATE_FARM_PLANTED:       return "planted";    break;
      case TILE_STATE_FARM_GROWN:         return "grown";      break;
      case TILE_STATE_LIVESTOCK_IDLE:     return "idle";       break;
      case TILE_STATE_STORAGE_UNASSIGNED: return "unassigned"; break;
      case TILE_STATE_STORAGE_FOOD:       return "food";       break;
      case TILE_STATE_STORAGE_POOP:       return "poop";       break;
      case TILE_STATE_STORAGE_VALUABLE:   return "valuable";   break;
      case TILE_STATE_COUNT:              return "null";       break;
    }
  }
  self.item_img = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_WATER:    return water_img;    break;
      case ITEM_TYPE_FOOD:     return food_img;     break;
      case ITEM_TYPE_POOP:     return poop_img;     break;
      case ITEM_TYPE_VALUABLE: return valuable_img; break;
    }
  }
  self.item_name = function(type)
  {
    switch(type)
    {
      case ITEM_TYPE_NULL:     return "Null";     break;
      case ITEM_TYPE_WATER:    return "Water";    break;
      case ITEM_TYPE_FOOD:     return "Food";     break;
      case ITEM_TYPE_POOP:     return "Poop";     break;
      case ITEM_TYPE_VALUABLE: return "Valuable"; break;
      case ITEM_TYPE_COUNT:    return "Count";    break;
    }
  }

  self.init = function()
  {
    var valid = false;
    while(!valid)
    {
      for(var ty = 0; ty < self.th; ty++)
        for(var tx = 0; tx < self.tw; tx++)
        {
          var i = self.tiles_i(tx,ty);
          var t = new tile();
          t.tx = tx;
          t.ty = ty;
          t.i = i;
          t.nutrition = rand();
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          t.nutrition *= t.nutrition;
          self.tiles[i] = t;
        }

      var to;
      var from;
      var dx;
      var dy;
      var d;
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
            var t = atan2(dy/d,dx/d)
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

      var atomic_push = function(n,ar)
      {
        var found = false;
        for(var j = 0; j < ar.length; j++) if(ar[j] == n) found = true;
        if(!found) ar.push(n);
      }

      var slow_flood_fill = function(fill)
      {
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
        for(var j = 0; j < amt; j++)
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

      for(var x = self.bounds_tx; x < self.bounds_tx+self.bounds_tw; x++)
      {
        for(var y = self.bounds_ty; y < self.bounds_ty+self.bounds_th; y++)
        {
          var t = self.tiles_t(x,y);
          if(t.type == TILE_TYPE_LAKE) valid = 1;
        }
      }
    }

    //assign og
    for(var i = 0; i < TILE_TYPE_COUNT; i++)
      self.tiles[i].og_type = self.tiles[i].type;

    //group tiles
    for(var i = 0; i < TILE_TYPE_COUNT; i++)
      self.tile_groups[i] = [];
    for(var i = 0; i < self.tiles.length; i++)
    {
      var t = self.tiles[i];
      self.tile_groups[t.type].push(t);
    }

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

    self.inc_bounds();

    var type;
    var p;
    var r;
    var g;
    var b;

    type = TILE_TYPE_NULL;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = (255-i);
      b = 255;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_LAND;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = i;
      g = floor((255-i)/2);
      b = 50;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_ROCK;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 100;
      g = 100;
      b = 100;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_LAKE;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 0;
      g = floor(p*150);
      b = 255-floor(p*150);
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_SHORE;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 150;
      g = 150+floor(p*75);
      b = 255-floor(p*75);
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_FOREST;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 0;
      g = 100;
      b = 50;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_HOME;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 0;
      b = 0;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_FARM;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = "rgba("+r+","+g+","+b+",1)";
    }

    type = TILE_TYPE_LIVESTOCK;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = blue;
    }

    type = TILE_TYPE_STORAGE;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = purple;
    }

    type = TILE_TYPE_PROCESSOR;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = orange;
    }

    type = TILE_TYPE_ROAD;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = gray;
    }

    self.hovering = 0;
  }
  self.init();

  self.alterTile = function(t, type)
  {
    for(var i = 0; i < self.tile_groups[t.type].length; i++)
      if(self.tile_groups[t.type][i] == t) self.tile_groups[t.type].splice(i,1);
    t.type = type;
    t.state = TILE_STATE_NULL;
    t.val = 0;
    t.state_t = 0;
    switch(type)
    {
      case TILE_TYPE_LAND:
        break;
      case TILE_TYPE_LAKE:
        break;
      case TILE_TYPE_SHORE:
        break;
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
        break;
      case TILE_TYPE_FARM:
        t.state = TILE_STATE_FARM_UNPLANTED;
        break;
      case TILE_TYPE_LIVESTOCK:
        t.state = TILE_STATE_LIVESTOCK_IDLE;
        t.val = 1; //fullness
        break;
      case TILE_TYPE_STORAGE:
        t.state = TILE_STATE_STORAGE_UNASSIGNED;
        break;
      case TILE_TYPE_PROCESSOR:
        break;
      case TILE_TYPE_ROAD:
        break;
    }
    self.tile_groups[type].push(t);
    self.dirty_directions();
  }

  self.abandon_tile = function(t)
  {
    for(var i = 0; i < gg.farmbits.length; i++)
    {
      var f = gg.farmbits[i];
      if(
        f.job_subject     == t ||
        f.job_object      == t ||
        f.locked_subject  == t ||
        f.locked_object   == t ||
        f.locked_withdraw == t ||
        f.locked_deposit  == t)
      {
        f.abandon_job(0);
      }
    }
    if(t.type == TILE_TYPE_HOME)
    {
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        var f = gg.farmbits[i];
        if(f.home == t) f.home = 0;
      }
    }
    if(t.type == TILE_TYPE_STORAGE && t.val > 0)
    {
      var item_type;
      switch(t.state)
      {
        case TILE_STATE_STORAGE_FOOD:     item_type = ITEM_TYPE_FOOD; break;
        case TILE_STATE_STORAGE_POOP:     item_type = ITEM_TYPE_POOP; break;
        case TILE_STATE_STORAGE_VALUABLE: item_type = ITEM_TYPE_VALUABLE; break;
      }
      for(var i = 0; i < t.val; i++)
      {
        var it = new item();
        it.type = item_type;
        if(item_type == ITEM_TYPE_POOP)
          it.state = ITEM_STATE_POOP_RAW;
        it.tile = t;
        gg.b.tiles_tw(it.tile,it);
        kick_item(it);
        gg.items.push(it);
      }
    }
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
        return buildability_check(TILE_TYPE_HOME,tile.type);
      case BUY_TYPE_FARM:
        return buildability_check(TILE_TYPE_FARM,tile.type);
      case BUY_TYPE_LIVESTOCK:
        return buildability_check(TILE_TYPE_LIVESTOCK,tile.type);
      case BUY_TYPE_STORAGE:
        return buildability_check(TILE_TYPE_STORAGE,tile.type);
      case BUY_TYPE_PROCESSOR:
        return buildability_check(TILE_TYPE_PROCESSOR,tile.type);
      case BUY_TYPE_ROAD:
        return (buildability_check(TILE_TYPE_ROAD,tile.type) || tile.type == TILE_TYPE_ROAD);
      case BUY_TYPE_DEMOLISH:
        return demolishability_check(tile.type);
    }
    return 0;
  }

  self.flow = function(from, to) //"from"/"to" doesn't nec. imply direction: always from surplus to deficit
  {
    var d = clamp(-1,1,from.nutrition-to.nutrition);
    if(
      (d < 0 && from.type == TILE_TYPE_LAKE) ||
      (d > 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //destination is water
      d *= nutrition_flow_rate;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else if(
      (d > 0 && from.type == TILE_TYPE_LAKE) ||
      (d < 0 && to.type   == TILE_TYPE_LAKE)
    )
    { //src is water
      d *= d*d;
      d *= nutrition_flow_rate*nutrition_flow_rate;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else
    { //anything else
      d *= d*d;
      d *= nutrition_flow_rate;
      from.nutrition -= d;
      to.nutrition   += d;
    }
  }

  self.rainflow = function(t)
  {
    t.shed.nutrition += t.nutrition*0.01;
    t.nutrition *= 0.99;
  }

  self.hover = function(evt)
  {
    worldSpaceDoEvt(gg.cam, gg.canvas, evt);
    var old_hover_t = self.hover_t;
    self.hover_t = self.tiles_wt(evt.wx,evt.wy);
    if(self.hover_t && !self.tile_in_bounds(self.hover_t)) { self.unhover(evt); return; }
    if(self.hover_t != old_hover_t && gg.shop.selected_buy)
      self.hover_t_placable = self.placement_valid(self.hover_t,gg.shop.selected_buy);

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
    }
  }
  self.unhover = function(evt)
  {
    self.hover_t = 0;
    self.hover_t_placable = 0;
    gg.inspector.tile_quick = 0;
    gg.inspector.quick_type = INSPECTOR_CONTENT_NULL;
  }

  self.click = function(evt)
  {
    if(self.spewing_road) return;

    if(gg.shop.selected_buy)
    {
      if(self.hover_t)
      {
        if(self.placement_valid(self.hover_t,gg.shop.selected_buy))
        {
          switch(gg.shop.selected_buy)
          {

            case BUY_TYPE_HOME:
            {
              self.alterTile(self.hover_t,TILE_TYPE_HOME);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_FARM:
            {
              self.alterTile(self.hover_t,TILE_TYPE_FARM);
              b_for_job(JOB_TYPE_PLANT, self.hover_t, 0);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_LIVESTOCK:
            {
              self.alterTile(self.hover_t,TILE_TYPE_LIVESTOCK);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_STORAGE:
            {
              self.alterTile(self.hover_t,TILE_TYPE_STORAGE);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_PROCESSOR:
            {
              self.alterTile(self.hover_t,TILE_TYPE_PROCESSOR);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_ROAD:
            {
              if(self.hover_t.type != TILE_TYPE_ROAD)
              {
                self.alterTile(self.hover_t,TILE_TYPE_ROAD);
                self.spewing_road = roads_per_buy-1;
              }
              else
                self.spewing_road = roads_per_buy;
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;

            case BUY_TYPE_DEMOLISH:
            {
              self.abandon_tile(self.hover_t);
              self.alterTile(self.hover_t,self.hover_t.og_type);
              gg.shop.selected_buy = 0;
              self.hover_t_placable = 0;
              return;
            }
            break;
          }
        }
      }
    }
    else
    {
      var clicked;

      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(!it.offscreen && ptWithinBB(it,evt.doX,evt.doY)) clicked = it; }
      if(clicked)
      {
        if(gg.inspector.detailed == clicked)
        {
          clicked.sale = !clicked.sale;
          if(clicked.lock)
          {
            var f = farmbit_with_item(clicked);
            if(f)
            {
                   if(f.job_type == JOB_TYPE_EXPORT && !clicked.sale) f.abandon_job(0);
              else if(f.job_type != JOB_TYPE_EXPORT &&  clicked.sale) f.abandon_job(0);
            }
          }
        }
        gg.inspector.detailed = clicked;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_ITEM;
        return;
      }

      for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(!b.offscreen && ptWithinBB(b,evt.doX,evt.doY)) clicked = b; }
      if(clicked)
      {
        gg.inspector.detailed = clicked;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT;
        return;
      }

      gg.inspector.detailed = self.hover_t;
      gg.inspector.detailed_type = INSPECTOR_CONTENT_TILE;
      if(self.hover_t.directions_dirty) gg.b.calculate_directions(self.hover_t);
    }
  }

  self.tick = function()
  {
    self.visit_t++;
    var n = 1000;
    if(self.visit_t > n)
    {
      self.visit_t -= n;

      if(gg.farmbits.length < gg.b.tile_groups[TILE_TYPE_HOME].length)
      {
        if(gg.farmbits.length == self.bounds_n) { self.inc_bounds(); self.zoom_bounds(gg.cam); self.bounds_n++; }
        var t = self.tiles_t(self.bounds_tx+randIntBelow(self.bounds_tw),self.bounds_ty+randIntBelow(self.bounds_th));
        var b = new farmbit();
        gg.ticker.nq(b.name+" decided to move in!");
        b.tile = t;
        gg.b.tiles_tw(t,b);
        gg.farmbits.push(b);
        job_for_b(b);
        b.home = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME]);
      }
      else
        gg.ticker.nq("There are no houses available!");
    }

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
            var d = min(t.nutrition*farm_nutrition_uptake_p,farm_nutrition_uptake_max);
            t.nutrition -= d;
            d = max(d,farm_nutrition_uptake_min); //nutrition created out of thin air!
            t.val += d;
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
          t.val *= livestock_fullness_depletion_rate;
          if(t.state == TILE_STATE_LIVESTOCK_IDLE && t.state_t > livestock_poop_t)
          {
            t.state = TILE_STATE_LIVESTOCK_IDLE;
            t.state_t = 0;

            //gen poop
            var it = new item();
            it.type = ITEM_TYPE_POOP;
            it.state = ITEM_STATE_POOP_RAW;
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            if(
              !b_for_job(JOB_TYPE_FERTILIZE, 0, it) &&
              !b_for_job(JOB_TYPE_PROCESS, 0, it) &&
              !b_for_job(JOB_TYPE_STORE, 0, it)
              )
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
  }

  self.draw_tile = function(t,x,y,w,h)
  {
    var over = h/2;
    y -= over;
    h += over;
    //gg.ctx.fillStyle = self.tile_color(t.type, t.nutrition);
    //gg.ctx.fillRect(x,y,w,h);
    switch(t.type)
    {
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_STORAGE:
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_HOME:
      case TILE_TYPE_FARM:
        gg.ctx.drawImage(self.tile_img(t.og_type),x,y,w,h); //no break!
      case TILE_TYPE_LAND:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_FOREST:
        gg.ctx.drawImage(self.tile_img(t.type),x,y,w,h);
        break;
    }
    if(t.type == TILE_TYPE_FARM)
    {
      gg.ctx.globalAlpha = 0.5;
      switch(t.state)
      {
        case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillStyle = brown; break;
        case TILE_STATE_FARM_PLANTED:   gg.ctx.fillStyle = "rgba(255,"+floor(t.val/farm_nutrition_req*255)+",0,1)"; break;
        case TILE_STATE_FARM_GROWN:     gg.ctx.fillStyle = green; break;
      }
      gg.ctx.fillRect(x,y,w,h);
      gg.ctx.globalAlpha = 1;
    }
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    var t;
    var w = self.w/self.tw;
    var h = self.h/self.th;
    var x;
    var y;
    var th;
    var tw;
    var nx;
    var ny;
    gg.ctx.imageSmoothingEnabled = 0;
    if(self.nutrition_view)
    { //nutrition view
      var i = 0;
      ny = round(self.y+self.h-(0*h));
      for(var ty = 0; ty < self.th; ty++)
      {
        y = ny;
        ny = round(self.y+self.h-(ty+1)*h);
        th = y-ny;
        nx = round(self.x+(0*w));
        for(var tx = 0; tx < self.tw; tx++)
        {
          x = nx;
          nx = round(self.x+((tx+1)*w));
          tw = nx-x;
          t = self.tiles[i];
          gg.ctx.fillStyle = self.tile_color(TILE_TYPE_NULL, t.nutrition);
          gg.ctx.fillRect(x,ny,tw,th);
          i++;
        }
      }
    }
    else
    { //normal view
      var i = 0;
      ny = round(self.y);
      for(var ty = self.th-1; ty >= 0; ty--)
      {
        y = ny;
        ny = round(self.y+self.h-ty*h);
        th = ny-y;
        nx = round(self.x+(0*w));
        i = self.tiles_i(0,ty);
        for(var tx = 0; tx < self.tw; tx++)
        {
          x = nx;
          nx = round(self.x+((tx+1)*w));
          tw = nx-x;
          var t = self.tiles[i];
          self.draw_tile(t,x,y,tw,th);
          gg.ctx.fillStyle = black;
          //if(t.tx == self.bounds_tx) gg.ctx.fillText("btx",x+w/2,ny+h/2);
          //if(t.ty == self.bounds_ty) gg.ctx.fillText("bty",x+w/2,ny+h/2);
          i++;
        }
      }
    }
    gg.ctx.imageSmoothingEnabled = 1;

    var t;
    if(gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE) { t = gg.inspector.detailed; gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
    if(gg.inspector.quick_type    == INSPECTOR_CONTENT_TILE) { t = gg.inspector.quick;    gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
    if(self.hover_t && gg.shop.selected_buy)
    {
      t = self.hover_t;
      if(self.hover_t_placable)
        gg.ctx.strokeStyle = green;
      else
        gg.ctx.strokeStyle = red;
      gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);
    }

    if(debug_pathfinding && gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE)
    {
      gg.ctx.strokeStyle = green;
      var l = 10;
      var g = 1;
      var d = gg.inspector.detailed;
      var i = 0;
      for(var ty = 0; ty < self.th; ty++)
      {
        for(var tx = 0; tx < self.tw; tx++)
        {
          var t = d.directions[i];
          var x = self.x+tx*w+w/2;
          var y = self.y+self.h-(ty*h)-h/2;
          var dx;
          var dy;
          switch(d.directions[i])
          {
            case DIRECTION_NULL: dx =  0;   dy =  0;   break;
            case DIRECTION_R:    dx =  1;   dy =  0;   break;
            case DIRECTION_DR:   dx =  0.7; dy = -0.7; break;
            case DIRECTION_D:    dx =  0;   dy = -1;   break;
            case DIRECTION_DL:   dx = -0.7; dy = -0.7; break;
            case DIRECTION_L:    dx = -1;   dy =  0;   break;
            case DIRECTION_UL:   dx = -0.7; dy =  0.7; break;
            case DIRECTION_U:    dx =  0;   dy =  1;   break;
            case DIRECTION_UR:   dx =  0.7; dy =  0.7; break;
          }
          //drawArrow(x,y,x+dx*l,y-dy*l,g,gg.ctx);
          drawLine(x,y,x+dx*l,y-dy*l,gg.ctx);
          i++;
        }
      }
    }

    if(self.raining)
    {
      gg.ctx.fillStyle = blue;
      for(var i = 0; i < 1000; i++)
      {
        var x = rand()*self.w;
        var y = rand()*self.h;
        gg.ctx.fillRect(self.x+x-1,self.y+y-1,2,2);
      }
    }

    {
      //gg.ctx.strokeStyle = red;
      //gg.ctx.strokeRect(self.bounds_x,self.bounds_y,self.bounds_w,self.bounds_h);
      gg.ctx.drawImage(clouds_img,self.cloud_x,self.cloud_y,self.cloud_w,self.cloud_h);
      gg.ctx.fillStyle = "rgba(255,255,255,0.9)";
      if(self.cloud_x              > 0)                gg.ctx.fillRect(0,0,self.cloud_x,gg.canvas.height);
      if(self.cloud_x+self.cloud_w < gg.canvas.width)  gg.ctx.fillRect(self.cloud_x+self.cloud_w,           0,gg.canvas.width-self.cloud_x,gg.canvas.height);
      if(self.cloud_y              > 0)                gg.ctx.fillRect(self.cloud_x,                        0,self.cloud_w,self.cloud_y);
      if(self.cloud_y+self.cloud_h < gg.canvas.height) gg.ctx.fillRect(self.cloud_x,self.cloud_y+self.cloud_h,self.cloud_w,gg.canvas.height-(self.cloud_y+self.cloud_h));
    }
  }
}

var item = function()
{
  var self = this;
  self.thing = THING_TYPE_ITEM;

  self.wx = 0;
  self.wy = 0;
  self.ww = gg.b.tww;
  self.wh = gg.b.twh;
  self.wz = 0;
  self.wvx = 0;
  self.wvy = 0;
  self.wvz = 0;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.tile;
  self.type = ITEM_TYPE_NULL;
  self.state = ITEM_STATE_NULL;
  self.sale = 0;
  self.lock = 0;

  self.offscreen = 0;

  self.tick = function()
  {
    if(self.offscreen) return;
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

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
    if(self.type == ITEM_TYPE_POOP)
      self.tile.nutrition += poop_nutrition_leak;
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    if(self.offscreen) return;
    var y = self.y-self.h/2;
    var h = self.h+self.h/2;
    switch(self.type)
    {
      case ITEM_TYPE_WATER:gg.ctx.drawImage(water_img,self.x,y,self.w,h); break;
      case ITEM_TYPE_FOOD: gg.ctx.drawImage(food_img,self.x,y,self.w,h); break;
      case ITEM_TYPE_POOP:
             if(self.state == ITEM_STATE_POOP_RAW)   gg.ctx.drawImage(poop_img,      self.x,y,self.w,h);
        else if(self.state == ITEM_STATE_POOP_LIGHT) gg.ctx.drawImage(poop_light_img,self.x,y,self.w,h);
        break;
      case ITEM_TYPE_VALUABLE: gg.ctx.drawImage(valuable_img,self.x,y,self.w,h); break;
    }
    if(self.sale)
    {
      gg.ctx.strokeStyle = green;
      strokeBB(self,gg.ctx);
    }
  }
}

var farmbit_names = [
"peter",
"paul",
"mary",
];
var farmbit = function()
{
  var self = this;
  self.thing = THING_TYPE_FARMBIT;

  self.wx = 0;
  self.wy = 0;
  self.ww = gg.b.tww;
  self.wh = gg.b.twh;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.move_dir_x = 0.;
  self.move_dir_y = 0.;

  self.name = farmbit_names[randIntBelow(farmbit_names.length)];
  self.home = 0;
  self.job_type = JOB_TYPE_IDLE;
  self.job_subject = 0;
  self.job_object = 0;
  self.job_state = JOB_STATE_ACT;
  self.job_state_t = 0;
  self.item = 0;
  self.locked_subject = 0;
  self.locked_object = 0;
  self.locked_withdraw = 0;
  self.locked_deposit = 0;
  self.tile;

  self.fullness    = 1;
  self.energy      = 1;
  self.joy         = 1;
  self.fulfillment = 1;
  self.fullness_state    = FARMBIT_STATE_CONTENT;
  self.energy_state      = FARMBIT_STATE_CONTENT;
  self.joy_state         = FARMBIT_STATE_CONTENT;
  self.fulfillment_state = FARMBIT_STATE_CONTENT;

  self.frame_i = 0;
  self.frame_l = 10;
  self.frame_t = randIntBelow(self.frame_l);

  self.walk_mod = function()
  {
    var mod = 1;
    if(self.item)
    {
      switch(self.item.type)
      {
        case ITEM_TYPE_WATER:    mod *= water_carryability; break;
        case ITEM_TYPE_FOOD:     mod *= food_carryability; break;
        case ITEM_TYPE_POOP:
        {
          switch(self.item.state)
          {
            case ITEM_STATE_POOP_RAW:    mod *= poop_raw_carryability;    break;
            case ITEM_STATE_POOP_LIGHT:  mod *= poop_light_carryability;  break;
            case ITEM_STATE_POOP_POTENT: mod *= poop_potent_carryability; break;
          }
        }
          break;
        case ITEM_TYPE_VALUABLE: mod *= valuable_carryability; break;
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
         if(self.fullness > fullness_content)   self.fullness_state = FARMBIT_STATE_CONTENT;
    else if(self.fullness > fullness_motivated) self.fullness_state = FARMBIT_STATE_MOTIVATED;
    else                                        self.fullness_state = FARMBIT_STATE_DESPERATE;

         if(self.energy > energy_content)   self.energy_state = FARMBIT_STATE_CONTENT;
    else if(self.energy > energy_motivated) self.energy_state = FARMBIT_STATE_MOTIVATED;
    else                                    self.energy_state = FARMBIT_STATE_DESPERATE;

         if(self.joy > joy_content)   self.joy_state = FARMBIT_STATE_CONTENT;
    else if(self.joy > joy_motivated) self.joy_state = FARMBIT_STATE_MOTIVATED;
    else                              self.joy_state = FARMBIT_STATE_DESPERATE;

         if(self.fulfillment > fulfillment_content)   self.fulfillment_state = FARMBIT_STATE_CONTENT;
    else if(self.fulfillment > fulfillment_motivated) self.fulfillment_state = FARMBIT_STATE_MOTIVATED;
    else                                              self.fulfillment_state = FARMBIT_STATE_DESPERATE;
  }

  self.die = function()
  {
    self.abandon_job(1);
    for(var i = 0; i < gg.farmbits.length; i++)
      if(gg.farmbits[i] == self) gg.farmbits.splice(i,1);
    gg.ticker.nq(self.name+" DIED!");
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
  self.lock_withdraw = function(o)
  {
    self.locked_withdraw = o;
    o.withdraw_lock++;
  }
  self.lock_deposit = function(o)
  {
    self.locked_deposit = o;
    o.deposit_lock++;
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
  self.unlock_withdraw = function()
  {
    self.locked_withdraw.withdraw_lock--;
    self.locked_withdraw = 0;
  }
  self.unlock_deposit = function()
  {
    self.locked_deposit.deposit_lock--;
    self.locked_deposit = 0;
  }

  self.release_locks = function()
  {
    if(self.locked_object)   self.unlock_object();
    if(self.locked_subject)  self.unlock_subject();
    if(self.locked_withdraw) self.unlock_withdraw();
    if(self.locked_deposit)  self.unlock_deposit();
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
      case JOB_TYPE_STORE:
      case JOB_TYPE_PROCESS:
        b_for_job(job_type, job_subject, job_object); break;
        break;
    }
    gg.ticker.nq(self.name+" abandonded their job!");
  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%2;
      self.frame_t = 0;
    }

    if(self.offscreen)
      ; //don't lose motivation! otherwise, every bit will come back dead
    else
    {
      self.fullness    *= fullness_depletion_rate;
      self.energy      *= energy_depletion_rate;
      self.joy         *= joy_depletion_rate;
      self.fulfillment *= fulfillment_depletion_rate;
    }

    if(self.tile && self.tile.type == TILE_TYPE_LAKE)
    {
      if(self.tile.nutrition < water_fouled_threshhold)
        self.joy = min(1,self.joy+swim_joy);
      else
        self.joy = max(0,self.joy-swim_joy);
    }

    var dirty = false;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fullness < fullness_content)   { self.fullness_state = FARMBIT_STATE_MOTIVATED; gg.ticker.nq(self.name+" is hungry.");      dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fullness < fullness_motivated) { self.fullness_state = FARMBIT_STATE_DESPERATE; gg.ticker.nq(self.name+" is VERY hungry!"); dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_FULLNESS, self.job_type)) { self.abandon_job(1); } } break;
      case FARMBIT_STATE_DESPERATE: if(self.fullness < fullness_desperate) { self.fullness_state = FARMBIT_STATE_DIRE; self.die(); return; } break;
      default: break;
    }
    switch(self.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.energy < energy_content)   { self.energy_state = FARMBIT_STATE_MOTIVATED; gg.ticker.nq(self.name+" is sleepy.");      dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.energy < energy_motivated) { self.energy_state = FARMBIT_STATE_DESPERATE; gg.ticker.nq(self.name+" is VERY sleepy!"); dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_ENERGY, self.job_type)) { self.abandon_job(1); } } break;
      default: break;
    }
    switch(self.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.joy < joy_content)   { self.joy_state = FARMBIT_STATE_MOTIVATED; gg.ticker.nq(self.name+" is depressed.");      dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.joy < joy_motivated) { self.joy_state = FARMBIT_STATE_DESPERATE; gg.ticker.nq(self.name+" is VERY depressed!"); dirty = 1;  if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_JOY, self.job_type)) { self.abandon_job(1); } } break;
      default: break;
    }
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fulfillment < fulfillment_content)   { self.fulfillment_state = FARMBIT_STATE_MOTIVATED; gg.ticker.nq(self.name+" is bored.");      dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fulfillment < fulfillment_motivated) { self.fulfillment_state = FARMBIT_STATE_DESPERATE; gg.ticker.nq(self.name+" is VERY bored!"); dirty = 1; if(self.job_type != JOB_TYPE_IDLE && !need_met_for_above_job(FARMBIT_NEED_FULFILLMENT, self.job_type)) { self.abandon_job(1);} } break;
      default: break;
    }
    if(dirty && self.job_type == JOB_TYPE_IDLE) job_for_b(self);

    self.job_state_t++;
    switch(self.job_type)
    {
      case JOB_TYPE_NULL:
        console.log("GAH!"); //shouldn't get here
        break;
      case JOB_TYPE_IDLE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_SEEK:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
            var mod = self.walk_mod();
            self.wx += self.move_dir_x*gg.b.walk_speed*mod;
            self.wy += self.move_dir_y*gg.b.walk_speed*mod;
          }
            break;
          case JOB_STATE_ACT:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_SEEK;
              self.job_state_t = 0;
              var theta = rand()*twopi;
              self.move_dir_x = cos(theta);
              self.move_dir_y = sin(theta);
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
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                self.unlock_withdraw();
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_FOOD;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                self.lock_object(it);

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
                self.job_state_t = 0;
              }
            }
            break;
          case JOB_STATE_ACT:
            break_item(self.item);
            self.item = 0;
            self.fullness = 1;
            self.fullness_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            gg.ticker.nq(self.name+" ate some food.");
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
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.energy += 0.01;
            if(self.energy > 1)
            {
              self.energy = 1;
              self.energy_state = FARMBIT_STATE_CONTENT;
              self.go_idle();
              gg.ticker.nq(self.name+" took a nap.");
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
            if(self.joy > 1)
            {
              self.joy = 1;
              self.joy_state = FARMBIT_STATE_CONTENT;
              self.go_idle();
              gg.ticker.nq(self.name+" played in the lake.");
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
                kick_item(it);
                gg.items.push(it);
                self.lock_object(it);

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
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

            t.state = TILE_STATE_FARM_PLANTED;
            t.state_t = 0;
            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            self.go_idle();
            gg.ticker.nq(self.name+" planted a farm.");
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
            self.fulfillment += harvest_fulfillment;
            self.calibrate_stats();
            gg.ticker.nq(self.name+" harvested a farm.");
            self.go_idle();

            //gen food
            var it;
            for(var i = 0; i < 2; i++)
            {
              it = new item();
              it.type = ITEM_TYPE_FOOD;
              it.tile = t;
              gg.b.tiles_tw(it.tile,it);
              kick_item(it);
              gg.items.push(it);
              if(!b_for_job(JOB_TYPE_EAT, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it);
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
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                self.unlock_withdraw();
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_FOOD;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                self.lock_object(it);

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
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

            t.val += livestock_food_val;

            self.fulfillment += feed_fulfillment;
            self.calibrate_stats();
            gg.ticker.nq(self.name+" fed some livestock");
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
            else if(self.job_object.thing == THING_TYPE_TILE)
            {
              if(self.tile != t)
                self.walk_toward_tile(t);
              else
              {
                self.unlock_withdraw();
                t.val--;
                if(t.val == 0 && t.deposit_lock == 0) t.state = TILE_STATE_STORAGE_UNASSIGNED;

                //pop item out of storage
                var it = new item();
                it.type = ITEM_TYPE_POOP;
                it.state = ITEM_STATE_POOP_RAW;
                it.tile = t;
                gg.b.tiles_tw(it.tile,it);
                kick_item(it);
                gg.items.push(it);
                self.lock_object(it);

                self.job_object = it;
                self.job_state = JOB_STATE_GET;
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

            t.nutrition += farm_nutrition_req;

            self.fulfillment += fertilize_fulfillment;
            self.calibrate_stats();
            gg.ticker.nq(self.name+" fertilized a farm.");
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_STORE:
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
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;

            //deposit lock already released
            t.val++;

            break_item(self.item);
            self.item = 0;

            self.fulfillment += store_fulfillment;
            self.calibrate_stats();
            gg.ticker.nq(self.name+" stored some stuff.");
            self.go_idle();
            job_for_b(self);
          }
            break;
        }
      }
        break;
      case JOB_TYPE_PROCESS:
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
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var t = self.job_subject;

            break_item(self.item);
            self.item = 0;

            self.fulfillment += process_fulfillment;
            self.calibrate_stats();
            gg.ticker.nq(self.name+" processed some poop.");
            self.go_idle();

            var it;

            //gen valuables
            it = new item();
            it.type = ITEM_TYPE_VALUABLE;
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            if(
              !(it.sale && b_for_job(JOB_TYPE_EXPORT, 0, it)) &&
              !b_for_job(JOB_TYPE_STORE, 0, it)
            )
              ; //do nothing

            //gen poop
            it = new item();
            it.type = ITEM_TYPE_POOP;
            it.state = ITEM_STATE_POOP_LIGHT;
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            if(
              !b_for_job(JOB_TYPE_FERTILIZE, 0, it) &&
              !b_for_job(JOB_TYPE_STORE, 0, it)
            )
              ; //do nothing


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
              self.item.offscreen = 1;
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

              break_item(self.item);
              self.item = 0;

              self.fulfillment += store_fulfillment;
              self.calibrate_stats();

              gg.ticker.nq(self.name+" exported some stuff.");
              self.go_idle();
              job_for_b(self);
            }
          }
            break;
        }
      }
        break;
      case JOB_TYPE_KICK:
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
              self.job_state = JOB_STATE_ACT;
              self.job_state_t = 0;
            }
          }
            break;
          case JOB_STATE_ACT:
          {
            self.release_locks();
            var it = self.item;
            self.item = 0;
            kick_item(it);

            self.fulfillment += kick_fulfillment;
            self.calibrate_stats();

            gg.ticker.nq(self.name+" kicked something.");
            self.go_idle();
            switch(it.type)
            {
              case ITEM_TYPE_FOOD: if(!b_for_job(JOB_TYPE_EAT,       0, it)) b_for_job(JOB_TYPE_STORE, 0, it); break;
              case ITEM_TYPE_POOP: if(!b_for_job(JOB_TYPE_FERTILIZE, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it); break;
            }
            job_for_b(self);
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
    gg.ctx.font = gg.font_size+"px "+gg.font;
    if(self.offscreen) return;
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

    var off = 0;
    if(self.tile.type == TILE_TYPE_LAKE || self.tile.type == TILE_TYPE_SHORE) off += 4;
         if(gg.inspector.detailed_type == INSPECTOR_CONTENT_FARMBIT && gg.inspector.detailed == self) off += 8;
    else if(gg.inspector.quick_type    == INSPECTOR_CONTENT_FARMBIT && gg.inspector.quick    == self) off += 8;
    switch(self.job_state)
    {
      case JOB_STATE_ACT:
        gg.ctx.fillStyle = black;
        switch(self.job_type)
        {
          case JOB_TYPE_SLEEP: gg.ctx.fillText("ZZ",self.x,self.y-10); break;
          case JOB_TYPE_PLAY:  gg.ctx.fillText(":)",self.x,self.y-10); break;
        }
        //break; //don't break!
      case JOB_STATE_ACT:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+off],self.x,self.y-self.h/2,self.w,self.h+self.h/2);
        break;
      case JOB_STATE_GET:
      case JOB_STATE_SEEK:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y-self.h/2,self.w,self.h+self.h/2);
        break;
    }
  }
}

