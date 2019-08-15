window.Logger = function(init){
  self = this;
  self.mySlog = new slog("LAKELAND",6);
  //var pako = require('pako');
  //Constants
  self.NUTRITION_DIFFERENCE = 2;
  self.HISTORY_FLUSH_LENGTH = 50;

  ENUM = 0;
  self.LOG_CATEGORY_GAMESTATE           = ENUM; ENUM++;
  self.LOG_CATEGORY_STARTGAME           = ENUM; ENUM++;
  self.LOG_CATEGORY_CHECKPOINT          = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTTILE          = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTFARMBIT       = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTITEM          = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTBUY           = ENUM; ENUM++;
  self.LOG_CATEGORY_BUY                 = ENUM; ENUM++;
  self.LOG_CATEGORY_CANCELBUY           = ENUM; ENUM++;
  self.LOG_CATEGORY_ROADBUILDS          = ENUM; ENUM++;
  self.LOG_CATEGORY_TILEUSESELECT       = ENUM; ENUM++;
  self.LOG_CATEGORY_ITEMUSESELECT       = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLENUTRITION     = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLESHOP          = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLEACHIEVEMENTS  = ENUM; ENUM++;
  self.LOG_CATEGORY_SKIPTUTORIAL        = ENUM; ENUM++;
  self.LOG_CATEGORY_SPEED               = ENUM; ENUM++;
  self.LOG_CATEGORY_ACHIEVEMENT         = ENUM; ENUM++;
  self.LOG_CATEGORY_FARMBITDEATH        = ENUM; ENUM++;
  self.LOG_CATEGORY_BLURB               = ENUM; ENUM++;
  self.LOG_CATEGORY_CLICK               = ENUM; ENUM++;
  self.LOG_CATEGORY_RAINSTOPPED         = ENUM; ENUM++;
  self.LOG_CATEGORY_HISTORY             = ENUM; ENUM++;
  self.LOG_CATEGORY_ENDGAME             = ENUM; ENUM++;
  self.LOG_CATEGORY_COUNT               = ENUM; ENUM++;
 
  ENUM = 0; 
  self.LOG_EMOTE_NULL                   = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_MOTIVATED     = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_MOTIVATED_TXT = "I'm hungry";
  self.LOG_EMOTE_FULLNESS_DESPERATE     = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_DESPERATE_TXT = "I NEED FOOD";
  self.LOG_EMOTE_ENERGY_DESPERATE       = ENUM; ENUM++;
  self.LOG_EMOTE_ENERGY_DESPERATE_TXT   = "I need a nap!";
  self.LOG_EMOTE_JOY_MOTIVATED          = ENUM; ENUM++;
  self.LOG_EMOTE_JOY_MOTIVATED_TXT      = "I want to play in the water";
  self.LOG_EMOTE_JOY_DESPERATE          = ENUM; ENUM++;
  self.LOG_EMOTE_JOY_DESPERATE_TXT      = "I'M SO SAD";
  self.LOG_EMOTE_PUKE                   = ENUM; ENUM++;
  self.LOG_EMOTE_PUKE_TXT               = "🤮";
  self.LOG_EMOTE_YUM                    = ENUM; ENUM++;
  self.LOG_EMOTE_YUM_TXT                = "😋";
  self.LOG_EMOTE_TIRED                  = ENUM; ENUM++;
  self.LOG_EMOTE_TIRED_TXT              = "😴";
  self.LOG_EMOTE_HAPPY                  = ENUM; ENUM++;
  self.LOG_EMOTE_HAPPY_TXT              = "🙂";
  self.LOG_EMOTE_SWIM                   = ENUM; ENUM++;
  self.LOG_EMOTE_SWIM_TXT               = "SWIM";
  self.LOG_EMOTE_SALE                   = ENUM; ENUM++;
  self.LOG_EMOTE_SALE_TXT               = "SALE";
  self.LOG_EMOTE_COUNT                  = ENUM; ENUM++;
   


  //Local variables, Getters and Setters
  self.buy_hovers = [];
  self.buy_hover = function(t){
    self.buy_hovers.push(self.tile_data_short(t).concat([Date.now()]));
  }

  self.flush_buy_hovers = function(now){
    ret = self.buy_hovers.map(function(x){
      x[x.length-1] -= now;
      return x;
    });
    self.buy_hovers = [];
    return ret;
  }

  self.road_hovers = [];
  self.road_hover = function(){
    self.road_hovers.push(self.tile_data_short(gg.b.hover_t).concat([Date.now()]));
  }

  self.flush_road_hovers = function(now){
    ret = self.road_hovers.map(function(x){
      x[x.length-1] -= now;
      return x;
    });
    self.road_hovers = [];
    return ret;
  }

  self.blurb_history = [];
  self.blurb = function(txt){
    if(self.log_blurbs) self.blurb_history.push(Date.now());
  }

  self.flush_blurb_history = function(now){
    ret = self.blurb_history.map(function(x){
      x -= now;
      return x;
    });
    self.blurb_history = [];
    return ret;
  }
  //TODO ask about potentially only adjusting nutritions if it is a difference of two or more
  // self.prev_nutritions = null;
  // self.set_prev_nutritions = function(nutritions){
  //   self.prev_nutritions = nutritions;
  // }
  // self.get_prev_nutritions = function(){
  //   return self.prev_nutritions;
  // }
  // self.update_nutritions = function(){
  //   new_nutritions = self.nutrition_array();
  //   delta_nutrition = self.arraysSubtract(self.prev_nutritions,new_nutritions);
  //   changed_tiles = gg.b.tiles.filter(function(x,index){return Math.abs(delta_nutrition[index]) >= self.NUTRITION_DIFFERENCE});
  //   self.set_prev_nutritions(self.prev_nutritions.map(function(x,index){
  //     if (Math.abs(delta_nutrition[index]) >= self.NUTRITION_DIFFERENCE) {
  //       return new_nutritions[index]
  //     } else {
  //       return x
  //     }
  //   }));
  //   return changed_tiles.map(function(t){return self.tile_data_short(t)});
  // }

  self.click_history = [] //matrix of x,y,time columns
  self.add_click = function(X,Y) {
      self.click_history.push([X,Y,Date.now()])
  }
  self.flush_click_history = function(now){
    ret = self.click_history.map(function(x){
      x[x.length-1] -= now;
      return x;
    });
    self.click_history = [];
    return ret;
  }

  self.camera_history = [] //matrix of tx,ty,auto,time columns

  self.camera_move = function(t){
    var auto = true;
    if(!t){
      t = gg.b.tiles_wt(gg.cam.wx, gg.cam.wy);
      auto = false;
    }
    if(!self.arraysEqual([t.tx,t.ty],self.prev_center_txty)){
      self.set_prev_center_txty(t.tx,t.ty);
      self.camera_history.push([t.tx,t.ty,auto,Date.now()]);
      self.history();
    }
  }
  self.flush_camera_history = function(now){
    ret = self.camera_history.map(function(x){
      x[x.length-1] -= now;
      return x;
    });
    self.camera_history = [];
    return ret;
  }

  self.emote_history = [] //matrix of x,y,time columns
  self.emote = function(f, emote) {
    var emote_id = self.LOG_EMOTE_NULL;  //0
    if(emote      === self.LOG_EMOTE_FULLNESS_MOTIVATED_TXT) emote_id = self.LOG_EMOTE_FULLNESS_MOTIVATED;
    else if(emote === self.LOG_EMOTE_FULLNESS_DESPERATE_TXT) emote_id = self.LOG_EMOTE_FULLNESS_DESPERATE;
    else if(emote === self.LOG_EMOTE_ENERGY_DESPERATE_TXT  ) emote_id = self.LOG_EMOTE_ENERGY_DESPERATE;
    else if(emote === self.LOG_EMOTE_JOY_MOTIVATED_TXT     ) emote_id = self.LOG_EMOTE_JOY_MOTIVATED;
    else if(emote === self.LOG_EMOTE_JOY_DESPERATE_TXT     ) emote_id = self.LOG_EMOTE_JOY_DESPERATE;
    else if(emote === self.LOG_EMOTE_PUKE_TXT              ) emote_id = self.LOG_EMOTE_PUKE;
    else if(emote === self.LOG_EMOTE_YUM_TXT              ) emote_id = self.LOG_EMOTE_YUM;
    else if(emote === self.LOG_EMOTE_TIRED_TXT              ) emote_id = self.LOG_EMOTE_TIRED;
    else if(emote === self.LOG_EMOTE_HAPPY_TXT              ) emote_id = self.LOG_EMOTE_HAPPY;
    else if(emote === self.LOG_EMOTE_SWIM_TXT              ) emote_id = self.LOG_EMOTE_SWIM;
    else if(emote === self.LOG_EMOTE_SALE_TXT              ) emote_id = self.LOG_EMOTE_SALE;

    self.emote_history.push(self.farmbit_data_short(f).concat([emote_id,Date.now()]));
    self.history();
  }
  self.emote_swim = function(f){
    self.emote(f,self.LOG_EMOTE_SWIM_TXT);
  }
  self.emote_sale = function(f){
    self.emote(f,self.LOG_EMOTE_SALE_TXT);
  }
  self.flush_emote_history = function(now){
    ret = self.emote_history.map(function(x){
      x[x.length-1] -= now;
      return x;
    });
    self.emote_history = [];
    return ret;
  }

  self.was_raining = 0;
  self.update_raining = function(){
    self.was_raining = gg.b.raining;
  }

  self.prev_center_txty = null;
  self.set_prev_center_txty = function(tx,ty){
    self.prev_center_txty = [tx,ty];
  }

  self.log_blurbs = true;
  self.toggle_blurbs = function(){
    self.log_blurbs = !self.log_blurbs;
  }

  self.num_checkpoints_completed = 0;
  self.increment_num_checkpoints_completed = function(){
    self.num_checkpoints_completed++;
  }
  self.get_num_checkpoints_completed = function(){
    return self.num_checkpoints_completed;
  }

  self.achievements = null;
  self.update_achievements = function(trigger){
    for (var i = 0; i < gg.achievements.triggers.length;  i++)
      if(trigger.name === gg.achievements.triggers[i].name) {
        self.achievements[i] = 1; return;
      }
  }

  self.time = 0;
  self.update_time = function(time){
    self.time += time;
    self.raining();
    self.check_speed();
  }

  self.prev_speed = 2;
  self.check_speed = function(){
    if(gg.speed != self.prev_speed){
      self.speed();
      self.prev_speed = gg.speed;
      self.manual_speed_bool = 0;
    }
  }
  self.manual_speed_bool = 0;
  self.manual_speed = function(){
    self.manual_speed_bool = 1;
  }

  self.prev_item_use = 0;
  self.set_prev_item_use = function(it){
    self.prev_item_use = it.mark;
  }

  self.num_food_produced = 0;
  self.num_poop_produced = 0;
  self.num_milk_produced = 0;
  self.increment_food_produced = function(){
    self.num_food_produced++;
  }
  self.increment_poop_produced = function(){
    self.num_poop_produced++;
  }
  self.increment_milk_produced = function(){
    self.num_milk_produced++;
  }
  
  

  //Logging
  self.gamestate = function(){
    var now = Date.now();
    var gamestate = {
      tiles: self.uint8_tile_array().join(), //pako.gzip(   self.uint8_tile_array()).join(),
      farmbits: self.uint8_farmbit_array().join(), //pako.gzip(self.uint8_farmbit_array()).join(),
      items: self.uint8_item_array().join(), //pako.gzip(   self.uint8_item_array()).join(),
      money: gg.money,
      speed: gg.speed,
      achievements: self.achievements,
      num_checkpoints_completed: self.get_num_checkpoints_completed(),
      raining: gg.b.raining,
      curr_selection_type: gg.inspector.detailed_type,
      curr_selection_data: self.detailed_data(),
      camera_center: self.prev_center_txty,
      gametime: self.time,
      timestamp: now,
      num_food_produced: self.num_food_produced,
      num_poop_produced: self.num_poop_produced,
      num_milk_produced: self.num_milk_produced,
    };
    self.send_log(gamestate, self.LOG_CATEGORY_GAMESTATE);
  }
  self.startgame = function(){
    self.set_prev_center_txty(gg.b.center_tile.tx,gg.b.center_tile.ty);
    self.achievements = Array(gg.achievements.triggers.length).fill(0);
//  self.prev_nutritions = self.nutrition_array();
    tile_states = gg.b.tiles.map(function(x) {return x.state});
    tile_nutritions = self.nutrition_array();
    log_data = {
      tile_states: tile_states,
      tile_nutritions: tile_nutritions
    };
    window.onbeforeunload = function(){
      my_logger.endgame();
    }
    self.send_log(log_data, self.LOG_CATEGORY_STARTGAME);
  }

  self.gtag = function(arguments){ // checkpoint
    if(arguments[0] === 'event'){
     var now = Date.now();
     var log_data = arguments[2];
      log_data.event_type = arguments[1];
      log_data.blurb_history = self.flush_blurb_history(now);
      log_data.client_time = now;
      self.send_log(log_data, self.LOG_CATEGORY_CHECKPOINT);
      self.increment_num_checkpoints_completed();
    }
  }

  self.select_tile = function(t){
    if(gg.shop.selected_buy){ self.buy_hover(t); }
    else 
    {
      var log_data = self.tile_data(t);
      self.send_log(log_data, self.LOG_CATEGORY_SELECTTILE);
    }
  }
  self.select_farmbit = function(f){
    var log_data = self.farmbit_data(f);
    self.send_log(log_data, self.LOG_CATEGORY_SELECTFARMBIT);
  }
  self.select_item = function(it){
    var log_data = self.item_data(it);
    self.send_log(log_data, self.LOG_CATEGORY_SELECTITEM)
  }
  self.select_buy = function(buy){
    var log_data = self.buy_data(buy);
    self.send_log(log_data, self.LOG_CATEGORY_SELECTBUY);
  }
  self.buy_item = function(){
    var now = Date.now();
    var log_data = {
       client_time: now,
       buy: gg.shop.selected_buy,
       tile: self.tile_data_short(gg.b.hover_t),
       success: gg.b.placement_valid(gg.b.hover_t,gg.shop.selected_buy),
       buy_hovers: self.flush_buy_hovers(now)
     };
     if (log_data.success && gg.shop.selected_buy != BUY_TYPE_ROAD) self.gamestate();
     self.send_log(log_data, self.LOG_CATEGORY_BUY);
   }
   self.cancel_buy = function(buy){
    var now = Date.now();
    var log_data = {
       client_time: now,
       selected_buy: buy,
       cost: gg.shop.buy_cost(buy),
       curr_money: gg.money,
       buy_hovers: self.flush_buy_hovers(now)
     };
     self.send_log(log_data, self.LOG_CATEGORY_CANCELBUY)
   }
  self.build_road = function(){
    self.road_hover();
    if (!gg.b.spewing_road) {
      var now = Date.now();
      var log_data = {
         client_time: now,
         road_builds: self.flush_road_hovers(now)
       };
       self.send_log(log_data, self.LOG_CATEGORY_ROADBUILDS);
       self.gamestate();
    }
  }

  self.tile_use_select = function(t){
   var log_data = self.tile_data(t);
    self.send_log(log_data, self.LOG_CATEGORY_TILEUSESELECT);
  }
  self.item_use_select = function(it){
    var log_data = self.item_data_short(it);
    log_data.prev_mark =   self.prev_item_use;
    self.prev_item_use = 0;
    self.send_log(log_data, self.LOG_CATEGORY_ITEMUSESELECT)
  }

  self.toggle_nutrition = function(){
    var log_data = {
      to_state: gg.b.nutrition_view,
      tile_nutritions: self.nutrition_array()
    };
    self.send_log(log_data, self.LOG_CATEGORY_TOGGLENUTRITION)
  }
  self.toggle_shop = function(){
   var log_data = {
      shop_open: gg.shop.open
    };
    self.send_log(log_data, self.LOG_CATEGORY_TOGGLESHOP);
  }
  self.toggle_achievements = function(){
   var log_data = {
      achievements_open: gg.achievements.open
    };
    self.send_log(log_data, self.LOG_CATEGORY_TOGGLEACHIEVEMENTS);
  }
  self.skip_tutorial = function(){
   var log_data = {};
    self.send_log(log_data, self.LOG_CATEGORY_SKIPTUTORIAL);
  }
  self.speed = function(){
   var log_data = {
      cur_speed: gg.speed,
      prev_speed: self.prev_speed,
      manual: self.manual_speed_bool
    };
    self.send_log(log_data, self.LOG_CATEGORY_SPEED);
  }

  self.achievement = function(trigger){
    var log_data = {};
    for (var i = 0; i < gg.achievements.triggers.length;  i++)
    {
      if(trigger.name === gg.achievements.triggers[i].name) {
        log_data = {
          achievement: i
        };
        break;
      }
    }
    self.send_log(log_data, self.LOG_CATEGORY_ACHIEVEMENT);
    self.update_achievements(trigger);
  }

  self.farmbit_death = function(f){
   var log_data = {
      farmbit: self.farmbit_data_short(f),
      grave: self.tile_data_short(f.home)
    }
    self.send_log(log_data, self.LOG_CATEGORY_FARMBITDEATH)
  }

//   self.blurb = function(txt){
//     if(self.log_blurbs){
//      var log_data = {
// //        blurb: txt,
// //        advisor: gg.advisors.advisor
//       }
//       self.send_log(log_data, self.LOG_CATEGORY_BLURB);
//     }
//   }
  self.record = function(txt){
  //  var log_data = {
  //     record: txt,
  //     advisor: gg.advisors.advisor
  //   }
  //   self.send_log(log_data, self.LOG_CATEGORY_RECORD);
  }

  self.raining = function(){
    if(!gg.b.raining && self.was_raining){
      //self.prev_nutritions = self.nutrition_array();
     var log_data = {
      //  nutrition: self.prev_nutritions
      };
      self.send_log(log_data, self.LOG_CATEGORY_RAINSTOPPED);
    }
    self.update_raining();
  }

  self.history = function(force){
    if (self.camera_history.length > self.HISTORY_FLUSH_LENGTH || self.emote_history.length > self.HISTORY_FLUSH_LENGTH || force){
      var now = Date.now();
      var log_data = {
        client_time: now,
        camera_history: self.flush_camera_history(now),
        emote_history: self.flush_emote_history(now)
      };
      self.send_log(log_data, self.LOG_CATEGORY_HISTORY)
    }
  }
  self.endgame = function(){
    // log_data = self.old_gamestate();
    self.history(true);
    self.gamestate();
    self.send_log({}, self.LOG_CATEGORY_ENDGAME);
  }

  //Log Sender:
  self.send_log = function(log_data,category){
    var formatted_log_data = {
      level: 1, //TODO: make this not 1
      event: "CUSTOM",
      event_custom: category,
      event_data_complex: JSON.stringify(log_data)
    };
    self.mySlog.log(formatted_log_data);
    log_data.category = category;
    console.log(log_data);
  }

  Helpers:
  // self.old_gamestate = function(){
  //   var now = Date.now();
  //   var gamestate = {
  //     farmbits: self.farmbit_array(),
  //     items: self.item_array(),
  //     tile_nutritions: self.update_nutritions(),
  //     tile_marks: self.tile_mark_array(),
  //     tile_vals: self.tile_val_array(),
  //     money_per_min: Math.floor(gg.advisors.money_rate*60*60),
  //     people_supported: gg.advisors.people_supported,
  //     money: gg.money,
  //     speed: gg.speed,
  //     raining: gg.b.raining,
  //     curr_selection_type: gg.inspector.detailed_type,
  //     curr_selection_data: self.detailed_data(),
  //     camera_center: self.prev_center_txty,
  //     click_history: self.flush_click_history(now),
  //     timestamp: now,
  //     num_achievements: self.get_num_achievements(), -- deprecated
  //     num_checkpoints_completed: self.get_num_checkpoints_completed(),
  //     gametime: self.time,
  //     camera_history: self.flush_camera_history(now),
  //     emote_history: self.flush_emote_history(now)
  //   };
  //   return gamestate;
  // }
  self.tile_data = function(t){
    return {
      tile: self.tile_data_short(t),
      marks: t.marks,
    };
  }
  self.item_data = function(it){
    return {
      item: self.item_data_short(it)
    };
  }
  self.farmbit_data = function(f){
    return {
      farmbit: self.farmbit_data_short(f),
     };
  }
  self.buy_data = function(buy){
    return {
      buy: buy,
      cost: gg.shop.buy_cost(buy),
      curr_money: gg.money,
      success: gg.money >= gg.shop.buy_cost(buy)
    };
  }
  // self.tile_data_short = function(t){
  //   return [t.tx, t.ty, t.type, Math.floor(t.nutrition/nutrition_percent)];
  // }
  // self.farmbit_data_short = function(f){
  //   return [f.tile.tx,f.tile.ty,f.job_state,f.job_type,
  //     Math.floor(f.fullness/max_fullness*10),
  //     Math.floor(f.energy/max_energy*10),
  //     Math.floor(f.joy/max_joy*10),
  //     Math.floor(f.fulfillment/max_fulfillment*10)
  //   ];
  // }
  self.tile_data_short = function(t){
    var ret = Array.from(self.uint8_tile_array([t]));
    ret.push(t.tx);
    ret.push(t.ty);
    return ret;
  }
  self.farmbit_data_short = function(f){
    return Array.from(self.uint8_farmbit_array([f]));
  }
  self.item_data_short = function(it){
    return Array.from(self.uint8_item_array([it]));
  }
  self.uint8_tile_array = function(ts){
    if (ts === undefined) ts = gg.b.tiles;
    var VARS_PER_ENTRY = 4;
    var uint8arr = new Uint8Array(ts.length*VARS_PER_ENTRY);
    for (var i = 0; i < ts.length; i++){
      var j = 0;
      uint8arr[VARS_PER_ENTRY*i+j] = ts[i].val/nutrition_max*255;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = ts[i].nutrition/nutrition_max*255;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = ts[i].og_type;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = ts[i].type;j++;
    }
    return uint8arr;
  }
  self.uint8_farmbit_array = function(fs){
    if (fs === undefined) fs = gg.farmbits;
    var VARS_PER_ENTRY = 9;
    var uint8arr = new Uint8Array(fs.length*VARS_PER_ENTRY);
    for (var i = 0; i < fs.length; i++){
      var j = 0;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].tile.tx;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].tile.ty;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = self.farmbit_name_index(fs[i].name); j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].job_state;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].job_type;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].fullness/max_fullness*255;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].energy/max_energy*255;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].joy/max_joy*255;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = fs[i].fulfillment/max_fulfillment*255;j++;
    }
    return uint8arr;
  }
  self.uint8_item_array = function(its){
    if (its === undefined) its = gg.items;
    var VARS_PER_ENTRY = 4;
    var uint8arr = new Uint8Array(its.length*VARS_PER_ENTRY);
    for (var i = 0; i < its.length; i++){
      var j = 0;
      uint8arr[VARS_PER_ENTRY*i+j] = its[i].tile.tx;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = its[i].tile.ty;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = its[i].type;j++;
      uint8arr[VARS_PER_ENTRY*i+j] = its[i].mark;j++;
    }
    return uint8arr;
  }
  // self.item_data_short = function(it){
  //   return [it.tile.tx,it.tile.ty,it.thing,it.mark];
  // }

  // self.farmbit_array = function(){
  //   return gg.farmbits.map(self.farmbit_data_short);
  // }

  // self.item_array = function(){
  //   return gg.items.map(self.item_data_short);
  // }
  self.nutrition_array = function(){
    return gg.b.tiles.map(function(x) {return Math.floor(x.nutrition/nutrition_max*255)});
  }
  // self.tile_mark_array = function(){
  //   var interesting_tiles = gg.b.tiles.filter(function(x){
  //     return !self.arraysEqual(x.marks, [1,1,1,1])
  //   });
  //   return interesting_tiles.map(function(x) {
  //     return [x.tile.tx, x.tile.ty,x.tile.type].concat(x.marks);
  //   });
  // }
  // self.tile_val_array = function(){
  //   var interesting_tiles = gg.b.tiles.filter(function(x){
  //     return x.val
  //   });
  //   return interesting_tiles.map(function(x) {
  //     return [x.tile.tx, x.tile.ty,x.tile.type].concat(Math.floor(x.val/1000));
  //   });
  // }

  self.detailed_data = function(){
    switch(gg.inspector.detailed_type){
      case INSPECTOR_CONTENT_NULL:      break;
      case INSPECTOR_CONTENT_TILE:      return self.tile_data_short(gg.inspector.detailed);
      case INSPECTOR_CONTENT_ITEM:      return self.item_data_short(gg.inspector.detailed);
      case INSPECTOR_CONTENT_FARMBIT:   return self.farmbit_data_short(gg.inspector.detailed);
    }
  }

  self.farmbit_name_index = function(name){
    return farmbit_names.findIndex(element => element === name);
  }

  //Utils:
  self.arraysEqual = function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  self.arraysSubtract = function(a,b) {
    return a.map(function(item, index) {
      // In this case item correspond to currentValue of array a, 
      // using index to get value from array b
      return item - b[index];
    })
  }

  // self.abbreviate_tile = function(t){
  //   return {
  //     val: t.val,
  //     nutrition: t.nutrition,
  //     // tx: t.tx,
  //     // ty: t.ty,
  //     og_type: t.og_type,
  //     type: t.type
  //   };
  // }
  // self.abbreviate_tile_array = function(t){
  //   return new Uint8Array([t.val/nutrition_max*255, t.nutrition/nutrition_max*255, t.og_type, t.type]);
  // }
  // self.abbreviate_tiles = function(){
  //   return {
  //     val: new Uint8Array(gg.b.tiles.map(t => t.val/nutrition_max*255)),
  //     nutrition: new Uint8Array(gg.b.tiles.map(t => t.nutrition/nutrition_max*255)),
  //     og_type: new Uint8Array(gg.b.tiles.map(t => t.og_type)),
  //     type: new Uint8Array(gg.b.tiles.map(t => t.type))
  //   }
  // }
  // self.abbreviate_tiles_2 = function(){
  //   tiles = gg.b.tiles.map(t => [t.val/nutrition_max*255, t.nutrition/nutrition_max*255, t.og_type, t.type]);
  //   flattened_tiles = [].concat.apply([],tiles);
  //   uint8 = new Uint8Array(flattened_tiles);
  //   deflated = pako.deflate(uint8);
  //   return deflated;
  // }
  

  // self.compress_uint8object = function(obj){
  //   var keys = Object.keys(obj);
  //   ret = {};
  //   for (const key of keys) {
  //     ret[key] = pako.deflate(obj[key]);
  //   }
  //   return ret;
  // }
  // self.stringify_uint8object = function(obj){
  //   var keys = Object.keys(obj);
  //   ret = {};
  //   for (const key of keys) {
  //     ret[key] = obj[key].join();
  //   }
  //   return ret;
  // }
  // self.shrink_gamestate_array = function(abbreviated_array){
  //   return self.stringify_uint8object(self.compress_uint8object(abbreviated_array))
  // }
  // self.deflate_and_tostr = function(uint8arr){
  //   return pako.deflate(uint8arr).join()
  // }
  // self.deflate = function(input){
  //   return pako.deflate(input);
  // }
  // self.inflate = function(input){
  //   return pako.inflate(input);
  // }
  // self.pako_speed_tests = function(){
  //   console.time("get tile array")
  //   arr = self.uint8_tile_array()
  //   console.timeEnd("get tile array")

  //   console.time("gzip")
  //   pako.gzip(arr)
  //   console.timeEnd("gzip")

    // console.time("deflate")
    // pako.deflate(arr)
    // console.timeEnd("deflate")

    // console.time("deflateRaw")
    // pako.deflateRaw(arr)
    // console.timeEnd("deflateRaw")

//  }

  

}

window.my_logger = new window.Logger();
