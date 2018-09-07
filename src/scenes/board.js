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
var TILE_TYPE_WATER     = ENUM; ENUM++;
var TILE_TYPE_SHORE     = ENUM; ENUM++;
var TILE_TYPE_FORREST   = ENUM; ENUM++;
var TILE_TYPE_HOME      = ENUM; ENUM++;
var TILE_TYPE_FARM      = ENUM; ENUM++;
var TILE_TYPE_LIVESTOCK = ENUM; ENUM++;
var TILE_TYPE_STORAGE   = ENUM; ENUM++;
var TILE_TYPE_ROAD      = ENUM; ENUM++;
var TILE_TYPE_EXPORT    = ENUM; ENUM++;
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
var TILE_STATE_COUNT              = ENUM; ENUM++;

ENUM = 0;
var ITEM_TYPE_NULL  = ENUM; ENUM++;
var ITEM_TYPE_WATER = ENUM; ENUM++;
var ITEM_TYPE_FOOD  = ENUM; ENUM++;
var ITEM_TYPE_POOP  = ENUM; ENUM++;
var ITEM_TYPE_COUNT = ENUM; ENUM++;

ENUM = 0;
var ITEM_STATE_NULL  = ENUM; ENUM++;
var ITEM_STATE_COUNT = ENUM; ENUM++;

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

var walkability_check = function(type)
{
  switch(type)
  {
    case TILE_TYPE_LAND:      return land_walkability;      break;
    case TILE_TYPE_ROCK:      return rock_walkability;      break;
    case TILE_TYPE_WATER:     return water_walkability;     break;
    case TILE_TYPE_SHORE:     return shore_walkability;     break;
    case TILE_TYPE_FORREST:   return forrest_walkability;   break;
    case TILE_TYPE_HOME:      return home_walkability;      break;
    case TILE_TYPE_FARM:      return farm_walkability;      break;
    case TILE_TYPE_LIVESTOCK: return livestock_walkability; break;
    case TILE_TYPE_STORAGE:   return storage_walkability;   break;
    case TILE_TYPE_ROAD:      return road_walkability;      break;
    case TILE_TYPE_EXPORT:    return export_walkability;    break;
  }
  return 1;
}

var buildability_check = function(building,over)
{
  switch(building)
  {
    case TILE_TYPE_LAND:
    case TILE_TYPE_ROCK:
    case TILE_TYPE_WATER:
    case TILE_TYPE_SHORE:
    case TILE_TYPE_FORREST:
      return 1;
      break;
    case TILE_TYPE_HOME:
    case TILE_TYPE_FARM:
    case TILE_TYPE_LIVESTOCK:
    case TILE_TYPE_STORAGE:
      return over == TILE_TYPE_LAND;
      break;
    case TILE_TYPE_ROAD:
    {
      switch(over)
      {
        case TILE_TYPE_LAND:
        case TILE_TYPE_ROCK:
        case TILE_TYPE_WATER:
        case TILE_TYPE_SHORE:
          return 1;
          break;
        default:
          return 0;
          break;
      }
    }
      break;
    case TILE_TYPE_EXPORT:
      return 0;
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
    case ITEM_TYPE_FOOD: return TILE_STATE_STORAGE_FOOD;
    case ITEM_TYPE_POOP: return TILE_STATE_STORAGE_POOP;
    default: return TILE_STATE_STORAGE_UNASSIGNED;
  }
}

var worth_for_item = function(item_type)
{
  switch(item_type)
  {
    case ITEM_TYPE_FOOD: return item_worth_food;
    case ITEM_TYPE_POOP: return item_worth_poop;
    default: return 0;
  }
}

var closest_unlocked_tile_from_list = function(goal, list)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < list.length; i++)
  {
    var t = list[i];
    if(t.lock) continue;
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
    if(t.lock || t.nutrition >= threshhold) continue;
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
    if(t.lock || t.val >= threshhold) continue;
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
    if(t.lock || t.state != state) continue;
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
    if(t.lock || t.state != state || t.val-t.withdraw_lock <= 0) continue;
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
    if(t.lock || t.state != state || t.val+t.deposit_lock >= storage_max) continue;
    d = distsqr(goal.tx,goal.ty,t.tx,t.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = t;
    }
  }
  return closest;
}
var closest_unlocked_object = function(goal)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.lock) continue;
    d = distsqr(goal.tx,goal.ty,it.tile.tx,it.tile.ty);
    if(d < closest_d)
    {
      closest_d = d;
      closest = it;
    }
  }
  return closest;
}
var closest_unlocked_object_of_type = function(goal, type)
{
  var closest_d = max_dist;
  var d;
  var closest = 0;
  for(var i = 0; i < gg.items.length; i++)
  {
    var it = gg.items[i];
    if(it.type != type || it.lock) continue;
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
  var best;
  var b_rank = -1;
  var b_d = max_dist;
  var rank = -1;
  var d;
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
}

var fullness_job_for_b = function(b)
{
  var t;
  var tp;
  var it;
  var itp;

  //eat item
  it = closest_unlocked_object_of_type(b.tile,ITEM_TYPE_FOOD);
  if(it)
  {
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_EAT;
    b.job_state = JOB_STATE_GET;
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
    return 1;
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_object_of_type(t,ITEM_TYPE_POOP);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
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
        b.lock_subject(b.job_subject);
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FERTILIZE;
        b.job_state = JOB_STATE_GET;
        return 1;
      }
    }
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_object_of_type(b.tile,ITEM_TYPE_WATER);
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
      tp = closest_unlocked_tile_from_list(t, gg.b.tile_groups[TILE_TYPE_WATER]);
      if(tp)
      { //found storage
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_subject(b.job_subject);
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
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
    return 1;
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
  t = closest_unlocked_tile_from_list(b.tile, gg.b.tile_groups[TILE_TYPE_WATER]);
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

  //feed
  t = closest_unlocked_valdeficient_tile_from_list(b.tile, livestock_feed_threshhold, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
  if(t)
  {
    it = closest_unlocked_object_of_type(t,ITEM_TYPE_FOOD);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FEED;
      b.job_state = JOB_STATE_GET;
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
        b.lock_subject(b.job_subject);
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FEED;
        b.job_state = JOB_STATE_GET;
        return 1;
      }
    }
  }

  //fertilize
  t = closest_unlocked_nutrientdeficient_tile_from_list(b.tile, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_object_of_type(t,ITEM_TYPE_POOP);
    if(it)
    { //found item
      b.go_idle();
      b.job_subject = t;
      b.job_object = it;
      b.lock_subject(b.job_subject);
      b.lock_object(b.job_object);
      b.job_type = JOB_TYPE_FERTILIZE;
      b.job_state = JOB_STATE_GET;
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
        b.lock_subject(b.job_subject);
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_FERTILIZE;
        b.job_state = JOB_STATE_GET;
        return 1;
      }
    }
  }

  //plant
  t = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_FARM_UNPLANTED, gg.b.tile_groups[TILE_TYPE_FARM]);
  if(t)
  {
    it = closest_unlocked_object_of_type(b.tile,ITEM_TYPE_WATER);
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
      tp = closest_unlocked_tile_from_list(t, gg.b.tile_groups[TILE_TYPE_WATER]);
      if(tp)
      { //found storage
        b.go_idle();
        b.job_subject = t;
        b.job_object = tp;
        b.lock_subject(b.job_subject);
        b.lock_withdraw(b.job_object);
        b.job_type = JOB_TYPE_PLANT;
        b.job_state = JOB_STATE_GET;
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
    return 1;
  }


  //store
  it = closest_unlocked_object(b.tile);
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
      return 1;
    }
  }

  //export
  it = closest_unlocked_object(b.tile);
  if(it)
  { //found item
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_subject = gg.b.tiles[0];
    b.job_type = JOB_TYPE_EXPORT;
    b.job_state = JOB_STATE_GET;
    return 1;
  }

  //kick
  it = closest_unlocked_object(b.tile);
  if(it)
  { //found item
    b.go_idle();
    b.job_object = it;
    b.lock_object(b.job_object);
    b.job_type = JOB_TYPE_KICK;
    b.job_state = JOB_STATE_GET;
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
        { //get water (we "know" it exists)
          job_object = closest_unlocked_object_of_type(job_subject,ITEM_TYPE_WATER);
          if(!job_object) job_object = closest_unlocked_tile_from_list(job_subject, gg.b.tile_groups[TILE_TYPE_WATER]);
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
          best.job_state = JOB_STATE_SEEK;
        best.job_state_t = 0;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FEED:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_valdeficient_tile_from_list(job_object.tile, livestock_feed_threshhold, gg.b.tile_groups[TILE_TYPE_LIVESTOCK]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_object_of_type(job_subject,ITEM_TYPE_FOOD);
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
        best.lock_subject(best.job_subject);
        best.job_state = JOB_STATE_GET;
        return 1;
      }
    }
      break;
    case JOB_TYPE_FERTILIZE:
    {
      if(!job_subject && !job_object) return; //not going to waste time "looking to find some bit and some farm and some fertilizer and get 'em goin"

      if(!job_subject) job_subject = closest_unlocked_nutrientdeficient_tile_from_list(job_object, farm_nutrition_fertilize_threshhold, gg.b.tile_groups[TILE_TYPE_FARM]);
      if(!job_subject) return 0;

      if(!job_object) job_object = closest_unlocked_object_of_type(job_subject,ITEM_TYPE_POOP);
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
        best.lock_subject(best.job_subject);
        best.job_state = JOB_STATE_GET;
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
        best.job_subject.state = storage_for_item(b.job_object.type);
        return 1;
      }
    }
      break;
    case JOB_TYPE_KICK:
    {
      console.log("FINISH");//figure out
    }
      break;
    default:
      break;
  }
}

var break_item = function(it)
{
  for(var i = 0; i < gg.items.length; i++)
    if(gg.items[i] == it) gg.items.splice(i,1);
}

var kick_item = function(it)
{
  var theta = rand()*twopi;
  var s = 2+rand()*3;
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
}

var board = function()
{
  var self = this;

  self.tw = board_w;
  self.th = board_h;
  self.tiles = [];
  self.tile_groups = [];
  self.tiles_i = function(tx,ty)
  {
    if(tx <  0)       tx += self.tw;
    if(ty <  0)       ty += self.th;
    if(tx >= self.tw) tx -= self.tw;
    if(ty >= self.th) ty -= self.th;
    return self.tw*ty+tx;
  }
  self.tiles_t = function(tx,ty)
  {
    var i = self.tiles_i(tx,ty);
    return self.tiles[i];
  }
  self.tiles_wt = function(wx,wy)
  {
    var tx = floor(clampMapVal(self.wx-self.ww/2, self.wx+self.ww/2+1, 0, self.tw, wx));
    var ty = floor(clampMapVal(self.wy-self.wh/2, self.wy+self.wh/2+1, 0, self.th, wy));
    return self.tiles_t(tx,ty);
  }
  self.tiles_tw = function(t,w)
  {
    w.wx = self.wx-self.ww/2+((t.tx+0.5)*self.ww/self.tw);
    w.wy = self.wy-self.wh/2+((t.ty+0.5)*self.wh/self.th);
  }

  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;
  self.raining = 0;
  self.nutrition_view = 0;
  self.spewing_road = 0;

  self.wrapw = function(o)
  {
    if(o.wx < self.wx-self.ww/2) o.wx = self.wx+self.ww/2;
    if(o.wx > self.wx+self.ww/2) o.wx = self.wx-self.ww/2;
    if(o.wy < self.wy-self.wh/2) o.wy = self.wy+self.wh/2;
    if(o.wy > self.wy+self.wh/2) o.wy = self.wy-self.wh/2;
  }

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.hovering;
  self.hover_t;

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
    cd.x = 0;
    cd.y = 0;

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

  self.init = function()
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
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type == t.type) atomic_push(n,fill);
      }
      return fill;
    }

    var slow_flood_border = function(fill)
    {
      var border = [];
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,border);
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
      var rock_tiles = slow_flood_fill([t]);
      var rock_border = slow_flood_border(rock_tiles);

      for(var j = 0; j < rock_size; j++)
      {
        var b_i = randIntBelow(rock_border.length);
        var t = rock_border[b_i];
        t.type = TILE_TYPE_ROCK;
        rock_tiles.push(t);
        rock_border.splice(b_i,1);

        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,rock_border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,rock_border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,rock_border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,rock_border);
      }
    }

    //fill lakes
    for(var i = 0; i < n_lakes; i++)
    {
      var src_tx = randIntBelow(self.tw);
      var src_ty = randIntBelow(self.th);
      var t = self.tiles_t(src_tx,src_ty);
      t.type = TILE_TYPE_WATER;
      var lake_size = lake_size_min+randIntBelow(lake_size_max-lake_size_min);
      var lake_tiles = slow_flood_fill([t]);
      var lake_border = slow_flood_border(lake_tiles);

      for(var j = 0; j < lake_size; j++)
      {
        var b_i = randIntBelow(lake_border.length);
        var t = lake_border[b_i];
        t.type = TILE_TYPE_WATER;
        lake_tiles.push(t);
        lake_border.splice(b_i,1);

        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,lake_border);
      }
      for(var j = 0; j < lake_border.length; j++)
        lake_border[j].type = TILE_TYPE_SHORE;
    }

    //fill forrests
    for(var i = 0; i < n_forrests; i++)
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
      t.type = TILE_TYPE_FORREST;
      var forrest_size = forrest_size_min+randIntBelow(forrest_size_max-forrest_size_min);
      var forrest_tiles = slow_flood_fill([t]);
      var forrest_border = slow_flood_border(forrest_tiles);

      for(var j = 0; forrest_border.length && j < forrest_size; j++)
      {
        var b_i = randIntBelow(forrest_border.length);
        var t = forrest_border[b_i];
        t.type = TILE_TYPE_FORREST;
        forrest_tiles.push(t);
        forrest_border.splice(b_i,1);

        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type == TILE_TYPE_LAND) atomic_push(n,forrest_border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type == TILE_TYPE_LAND) atomic_push(n,forrest_border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type == TILE_TYPE_LAND) atomic_push(n,forrest_border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type == TILE_TYPE_LAND) atomic_push(n,forrest_border);
      }
    }

    self.tiles[0].type = TILE_TYPE_EXPORT;

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
      if(t.type == TILE_TYPE_WATER) continue;
      var closest_d = max_dist;
      var d;
      var tt;
      for(var ti = 0; ti < self.tiles.length; ti++)
      {
        var tt = self.tiles[ti];
        if(tt.type != TILE_TYPE_WATER) continue;
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

    type = TILE_TYPE_WATER;
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

    type = TILE_TYPE_FORREST;
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

    type = TILE_TYPE_EXPORT;
    self.tile_colors[type] = [];
    for(var i = 0; i <= 255; i++)
    {
      p = i/255;
      r = 255;
      g = 255;
      b = 255;
      self.tile_colors[type][i] = cyan;
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
      case TILE_TYPE_WATER:
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
      case TILE_TYPE_ROAD:
        break;
      case TILE_TYPE_EXPORT:
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
        case TILE_STATE_STORAGE_FOOD: item_type = ITEM_TYPE_FOOD; break;
        case TILE_STATE_STORAGE_POOP: item_type = ITEM_TYPE_POOP; break;
      }
      for(var i = 0; i < t.val; i++)
      {
        var it = new item();
        it.type = item_type;
        it.tile = t;
        gg.b.tiles_tw(it.tile,it);
        kick_item(it);
        gg.items.push(it);
      }
    }
  }

  self.flow = function(from, to) //"from"/"to" doesn't nec. imply direction: always from surplus to deficit
  {
    var d = clamp(-1,1,from.nutrition-to.nutrition);
    if(
      (d < 0 && from.type == TILE_TYPE_WATER) ||
      (d > 0 && to.type   == TILE_TYPE_WATER)
    )
    { //destination is water
      d *= nutrition_flow_rate;
      from.nutrition -= d;
      to.nutrition   += d;
    }
    else
    { //destination is anything else
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
    worldSpaceDoEvt(gg.cam, gg.canv, evt);
    self.hover_t = self.tiles_wt(evt.wx,evt.wy);

    var hovered;
    for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) hovered = b; }
    if(hovered)
    {
      gg.inspector.quick = hovered;
      gg.inspector.quick_type = INSPECTOR_CONTENT_FARMBIT;
    }
    if(!hovered)
    {
      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(ptWithinBox(it,evt.doX,evt.doY)) hovered = it; }
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
    gg.inspector.tile_quick = 0;
    gg.inspector.quick_type = INSPECTOR_CONTENT_NULL;
  }

  self.click = function(evt)
  {
    if(self.spewing_road) return;
    var clicked;
    for(var i = 0; i < gg.farmbits.length; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) clicked = b; }
    if(clicked)
    {
      gg.inspector.detailed = clicked;
      gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT;
    }
    if(!clicked)
    {
      for(var i = 0; i < gg.items.length; i++) { var it = gg.items[i]; if(ptWithinBox(it,evt.doX,evt.doY)) clicked = it; }
      if(clicked)
      {
        gg.inspector.detailed = clicked;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_ITEM;
      }
      else
      {
        gg.inspector.detailed = self.hover_t;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_TILE;
        if(self.hover_t.directions_dirty) gg.b.calculate_directions(self.hover_t);
      }
    }
    if(!self.hover_t) return;
  }

  self.tick = function()
  {
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
            it.tile = t;
            gg.b.tiles_tw(it.tile,it);
            kick_item(it);
            gg.items.push(it);

            if(!b_for_job(JOB_TYPE_FERTILIZE, 0, it)) b_for_job(JOB_TYPE_STORE, 0, it);
          }
        }
          break;
      }
      var right = self.tiles_t(t.tx+1,t.ty  );
      var top   = self.tiles_t(t.tx  ,t.ty+1);
      self.flow(t,right);
      self.flow(t,top);
      if(self.raining) self.rainflow(t);
    }

    if(gg.hand.released_card)
    {
      var c = gg.hand.released_card;
      gg.hand.released_card = 0;
      var evt = gg.hand.released_evt;
      gg.hand.released_evt = 0;

      if(!self.hover_t) return;

      if(c.type == CARD_TYPE_BIT)
      {
        var b = new farmbit();
        b.tile = self.hover_t;
        gg.b.tiles_tw(self.hover_t,b);
        gg.farmbits.push(b);
        job_for_b(b);
        gg.hand.destroy(c);
        b.home = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME]);
        return;
      }

      if(c.type == CARD_TYPE_HOME && buildability_check(TILE_TYPE_HOME,self.hover_t.type))
      {
        self.alterTile(self.hover_t,TILE_TYPE_HOME);
        gg.hand.destroy(c);
        return;
      }

      if(c.type == CARD_TYPE_FARM && buildability_check(TILE_TYPE_FARM,self.hover_t.type))
      {
        self.alterTile(self.hover_t,TILE_TYPE_FARM);
        b_for_job(JOB_TYPE_PLANT, self.hover_t, 0);
        gg.hand.destroy(c);
        return;
      }

      if(c.type == CARD_TYPE_LIVESTOCK && buildability_check(TILE_TYPE_LIVESTOCK,self.hover_t.type))
      {
        self.alterTile(self.hover_t,TILE_TYPE_LIVESTOCK);
        gg.hand.destroy(c);
        return;
      }

      if(c.type == CARD_TYPE_STORAGE && buildability_check(TILE_TYPE_STORAGE,self.hover_t.type))
      {
        self.alterTile(self.hover_t,TILE_TYPE_STORAGE);
        gg.hand.destroy(c);
        return;
      }

      if(c.type == CARD_TYPE_ROAD && buildability_check(TILE_TYPE_ROAD,self.hover_t.type))
      {
        self.alterTile(self.hover_t,TILE_TYPE_ROAD);
        gg.hand.destroy(c);
        self.spewing_road = roads_per_card-1;
        return;
      }

      if(c.type == CARD_TYPE_ROAD && self.hover_t.type == TILE_TYPE_ROAD)
      {
        gg.hand.destroy(c);
        self.spewing_road = roads_per_card;
        return;
      }

      if(c.type == CARD_TYPE_DEMOLISH && demolishability_check(self.hover_t.type))
      {
        self.abandon_tile(self.hover_t);
        self.alterTile(self.hover_t,self.hover_t.og_type);
        gg.hand.destroy(c);
        return;
      }
    }
  }

  self.draw = function()
  {
    var w = self.w/self.tw;
    var h = self.h/self.th;
    var i = 0;
    if(self.nutrition_view)
    { //nutrition view
      for(var ty = 0; ty < self.th; ty++)
      {
        for(var tx = 0; tx < self.tw; tx++)
        {
          var t = self.tiles[i];
          gg.ctx.fillStyle = self.tile_color(TILE_TYPE_NULL, t.nutrition);
          gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
          i++;
        }
      }
    }
    else
    { //normal view
      for(var ty = 0; ty < self.th; ty++)
      {
        for(var tx = 0; tx < self.tw; tx++)
        {
          var t = self.tiles[i];
          switch(t.type)
          {
            case TILE_TYPE_LAND:
            case TILE_TYPE_WATER:
            case TILE_TYPE_SHORE:
            case TILE_TYPE_LIVESTOCK:
            case TILE_TYPE_STORAGE:
            case TILE_TYPE_ROAD:
            case TILE_TYPE_EXPORT:
              gg.ctx.fillStyle = self.tile_color(t.type, t.nutrition);
              gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
              break;
            case TILE_TYPE_ROCK:
              gg.ctx.drawImage(rock_img,self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
              break;
            case TILE_TYPE_FORREST:
              gg.ctx.drawImage(forrest_img,self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
              break;
            case TILE_TYPE_HOME:
              gg.ctx.drawImage(home_img,self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
              break;
            case TILE_TYPE_FARM:
            {
              switch(t.state)
              {
                case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillStyle = brown; break;
                case TILE_STATE_FARM_PLANTED:   gg.ctx.fillStyle = "rgba(255,"+floor(t.val/farm_nutrition_req*255)+",0,1)"; break;
                case TILE_STATE_FARM_GROWN:     gg.ctx.fillStyle = green; break;
              }
              gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
            }
              break;
          }
          i++;
        }
      }
    }

    var t;
    if(gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE) { t = gg.inspector.detailed; gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
    if(gg.inspector.quick_type    == INSPECTOR_CONTENT_TILE) { t = gg.inspector.quick;    gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }

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
  }
}

var item = function()
{
  var self = this;
  self.thing = THING_TYPE_ITEM;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;
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
  self.lock = 0;

  self.tick = function()
  {
    self.wvz -= 0.1;
    self.wx += self.wvx;
    self.wy += self.wvy;
    self.wz += self.wvz;
    gg.b.wrapw(self);
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
    switch(self.type)
    {
      case ITEM_TYPE_WATER: drawImageBox(water_img,self,gg.ctx); break;
      case ITEM_TYPE_FOOD:  drawImageBox(food_img,self,gg.ctx); break;
      case ITEM_TYPE_POOP:  drawImageBox(poop_img,self,gg.ctx); break;
    }
  }
}

var farmbit = function()
{
  var self = this;
  self.thing = THING_TYPE_FARMBIT;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.walk_speed = 1; //MUST BE < tile_w/max_walk_modifier
  self.move_dir_x = 0.;
  self.move_dir_y = 0.;

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
        case ITEM_TYPE_FOOD: mod *= food_carryability; break;
        case ITEM_TYPE_POOP: mod *= poop_carryability; break;
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
    var mod = self.walk_mod();
    self.wx += dx*self.walk_speed*mod;
    self.wy += dy*self.walk_speed*mod;
  }

  self.walk_toward_item = function(it)
  {
    var t = it.tile;
    self.walk_toward_tile(t);
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
    self.abandon_job();
    for(var i = 0; i < gg.farmbits.length; i++)
      if(gg.farmbits[i] == self) gg.farmbits.splice(i,1);
  }

  self.go_idle = function()
  {
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
        b_for_job(job_type, job_subject, job_object); break;
        break;
    }
  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%2;
      self.frame_t = 0;
    }

    self.fullness    *= fullness_depletion_rate;
    self.energy      *= energy_depletion_rate;
    self.joy         *= joy_depletion_rate;
    self.fulfillment *= fulfillment_depletion_rate;

    var dirty = false;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fullness < fullness_content)   { self.fullness_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fullness < fullness_motivated) { self.fullness_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      case FARMBIT_STATE_DESPERATE: if(self.fullness < fullness_desperate) { self.fullness_state = FARMBIT_STATE_DIRE; self.die(); return; } break;
      default: break;
    }
    switch(self.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.energy < energy_content)   { self.energy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.energy < energy_motivated) { self.energy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.joy < joy_content)   { self.joy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.joy < joy_motivated) { self.joy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fulfillment < fulfillment_content)   { self.fulfillment_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fulfillment < fulfillment_motivated) { self.fulfillment_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
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
            self.wx += self.move_dir_x*self.walk_speed*mod;
            self.wy += self.move_dir_y*self.walk_speed*mod;
            gg.b.wrapw(self);
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
                self.walk_toward_tile(t);
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
            self.joy += 0.02;
            if(self.joy > 1)
            {
              self.joy = 1;
              self.joy_state = FARMBIT_STATE_CONTENT;
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

            if(o.thing == THING_TYPE_ITEM)
            {
              if(self.tile != t || abs(o.wvz) > 0.01 || o.wz > 0.01)
                self.walk_toward_tile(t);
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
                self.walk_toward_tile(t);
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
                self.walk_toward_tile(t);
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
            self.go_idle();
            job_for_b(self);
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

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    if(self.job_subject)
    {
      if(self.job_subject.thing == THING_TYPE_TILE)
      {
        gg.b.tiles_tw(self.job_subject,self.job_subject);
        screenSpacePt(gg.cam, gg.canv, self.job_subject);
      }
      if(debug_jobs)
      {
        gg.ctx.strokeStyle = green;
        drawLine(self.x+self.w/2,self.y+self.h/2,self.job_subject.x,self.job_subject.y,gg.ctx);
      }
    }
    if(self.job_object)
    {
      if(self.job_object.thing == THING_TYPE_TILE)
      {
        gg.b.tiles_tw(self.job_object,self.job_object);
        screenSpacePt(gg.cam, gg.canv, self.job_object);
      }
      if(debug_jobs)
      {
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
    if(self.tile.type == TILE_TYPE_WATER || self.tile.type == TILE_TYPE_SHORE) off += 4;
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
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+off],self.x,self.y,self.w,self.h);
        break;
      case JOB_STATE_GET:
      case JOB_STATE_SEEK:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y,self.w,self.h);
        break;
    }
  }
}

