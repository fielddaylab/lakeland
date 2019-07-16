var Logger = function(init){
  self = this;
  self.mySlog = new slog("USDA",1);

  //Constants
  self.GAMESTATE_LOG_INTERVAL = 10*60;
  self.NUTRITION_DIFFERENCE = 2;

  ENUM = 0;
  self.LOG_CATEGORY_GAMESTATE          = ENUM; ENUM++;
  self.LOG_CATEGORY_STARTGAME          = ENUM; ENUM++;
  self.LOG_CATEGORY_CHECKPOINT         = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTTILE         = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTFARMBIT      = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTITEM         = ENUM; ENUM++;
  self.LOG_CATEGORY_SELECTBUY          = ENUM; ENUM++;
  self.LOG_CATEGORY_TILEUSESELECT      = ENUM; ENUM++;
  self.LOG_CATEGORY_ITEMUSESELECT      = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLENUTRITION    = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLESHOP         = ENUM; ENUM++;
  self.LOG_CATEGORY_TOGGLEACHIEVEMENTS = ENUM; ENUM++;
  self.LOG_CATEGORY_SKIPTUTORIAL       = ENUM; ENUM++;
  self.LOG_CATEGORY_SPEED              = ENUM; ENUM++;
  self.LOG_CATEGORY_PLACEITEM          = ENUM; ENUM++;
  self.LOG_CATEGORY_CANCEL_BUY         = ENUM; ENUM++;
  self.LOG_CATEGORY_ACHIEVEMENT        = ENUM; ENUM++;
  self.LOG_CATEGORY_FARMBITDEATH       = ENUM; ENUM++;
  self.LOG_CATEGORY_BLURB              = ENUM; ENUM++;
  self.LOG_CATEGORY_CLICK              = ENUM; ENUM++;
  self.LOG_CATEGORY_RAINSTOPPED        = ENUM; ENUM++;
  self.LOG_CATEGORY_ENDGAME            = ENUM; ENUM++;
  self.LOG_CATEGORY_COUNT              = ENUM; ENUM++;

  ENUM = 0;
  self.LOG_EMOTE_NULL                  = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_MOTIVATED    = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_DESPERATE    = ENUM; ENUM++;
  self.LOG_EMOTE_ENERGY_DESPERATE      = ENUM; ENUM++;
  self.LOG_EMOTE_JOY_MOTIVATED         = ENUM; ENUM++;
  self.LOG_EMOTE_JOY_DESPERATE         = ENUM; ENUM++;
  self.LOG_EMOTE_COUNT                 = ENUM; ENUM++;
  self.LOG_EMOTE_FULLNESS_MOTIVATED_TXT    = "I'm hungry";
  self.LOG_EMOTE_FULLNESS_DESPERATE_TXT    = "I NEED FOOD";
  self.LOG_EMOTE_ENERGY_DESPERATE_TXT      = "I need a nap!";
  self.LOG_EMOTE_JOY_MOTIVATED_TXT         = "I want to play in the water";
  self.LOG_EMOTE_JOY_DESPERATE_TXT         = "I'M SO SAD";
   


  //Local variables, Getters and Setters
  self.buy_hovers = [];
  self.buy_hover = function(t){
    self.buy_hovers.push(self.tile_data_short(t));
  }
  self.reset_buy_hovers = function(){
    self.buy_hovers = [];
  }
  //TODO ask about potentially only adjusting nutritions if it is a difference of two or more
  self.prev_nutritions = null;
  self.set_prev_nutritions = function(nutritions){
    self.prev_nutritions = nutritions;
  }
  self.get_prev_nutritions = function(){
    return self.prev_nutritions;
  }
  self.update_nutritions = function(){
    new_nutritions = self.nutrition_array();
    delta_nutrition = self.arraysSubtract(self.prev_nutritions,new_nutritions);
    changed_tiles = gg.b.tiles.filter(function(x,index){return Math.abs(delta_nutrition[index]) >= self.NUTRITION_DIFFERENCE});
    self.set_prev_nutritions(self.prev_nutritions.map(function(x,index){
      if (Math.abs(delta_nutrition[index]) >= self.NUTRITION_DIFFERENCE) {
        return new_nutritions[index]
      } else {
        return x
      }
    }));
    return changed_tiles.map(function(t){return self.tile_data_short(t)});
  }

  self.click_history = [] //matrix of x,y,time columns
  self.add_click = function(X,Y) {
      self.click_history.push([X,Y,Date.now()])
  }
  self.flush_click_history = function(now){
    ret = self.click_history.map(function(x){
      x[2] -= now;
      return x;
    });
    self.click_history = [];
    return ret;
  }

  self.camera_history = [] //matrix of tx,ty,auto,time columns

  self.camera_move = function(t=null){
    var auto = true;
    if(!t){
      t = gg.b.tiles_wt(gg.cam.wx, gg.cam.wy);
      auto = false;
    }
    if(!self.arraysEqual([t.tx,t.ty],self.prev_center_txty)){
      self.set_prev_center_txty(t.tx,t.ty);
      self.camera_history.push([t.tx,t.ty,auto,Date.now()]);
    }
  }
  self.flush_camera_history = function(now){
    ret = self.camera_history.map(function(x){
      x[3] -= now;
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
    if(emote_id) self.emote_history.push(self.farmbit_data_short(f).concat([emote_id,Date.now()]))
  }
  self.flush_emote_history = function(now){
    ret = self.emote_history.map(function(x){
      x[length(x)-1] -= now;
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

  self.num_achievements = 0;
  self.increment_num_achievements = function(){
    self.num_achievements++;
  }
  self.get_num_achievements = function(){
    return self.num_achievements;
  }

  self.time = 0;
  self.last_gamestate_log_time = 0;
  self.update_time = function(time){
    self.time += time;
    if(Math.floor((self.time-self.last_gamestate_log_time) / self.GAMESTATE_LOG_INTERVAL)){
      self.last_gamestate_log_time = self.time;
      if(self.farmbit_array().length) self.gamestate_log();
    }
  }



  //Logging
  self.gamestate_log = function(){
    self.send_log(self.gamestate(), self.LOG_CATEGORY_GAMESTATE);
  }
  self.startgame = function(){
    self.set_prev_center_txty(gg.b.center_tile.tx,gg.b.center_tile.ty);
    self.prev_nutritions = self.nutrition_array();
    tile_states = gg.b.tiles.map(function(x) {return x.state});
    tile_nutritions = self.nutrition_array();
    log_data = {
      tile_states: tile_states,
      tile_nutritions: tile_nutritions
    };
    self.send_log(log_data, self.LOG_CATEGORY_STARTGAME);
  }
  self.endgame = function(){
    log_data = self.gamestate();
    self.send_log(log_data, self.LOG_CATEGORY_ENDGAME);
  }
  self.gtag = function(arguments){
    if(arguments[0] === 'event'){
     var log_data = arguments[2];
      log_data.event_type = arguments[1];
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

  self.tile_use_select = function(t){
   var log_data = self.tile_data(t);
    self.send_log(log_data, self.LOG_CATEGORY_TILEUSESELECT);
  }
  self.item_use_select = function(it){
   var log_data = self.item_data_short(it);
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
  self.speed = function(speed){
   var log_data = {
      cur_speed: gg.speed,
      clicked_speed: speed,
      during_tutorial: gg.advisors.owns_time
    };
    self.send_log(log_data, self.LOG_CATEGORY_SPEED);
  }

  self.place_item = function(){
   var log_data = {
      buy: gg.shop.selected_buy,
      tile: self.tile_data_short(gg.b.hover_t),
      success: gg.b.placement_valid(gg.b.hover_t,gg.shop.selected_buy),
      buy_hovers: self.buy_hovers
    };
    self.reset_buy_hovers();
    self.send_log(log_data, self.LOG_CATEGORY_PLACEITEM);
  }
  self.cancel_buy = function(buy){
   var log_data = {
      selected_buy: buy,
      cost: gg.shop.buy_cost(buy),
      curr_money: gg.money,
      buy_hovers: self.buy_hovers
    };
    self.reset_buy_hovers();
    self.send_log(log_data, self.LOG_CATEGORY_CANCEL_BUY)
  }

  self.achievement = function(trigger){
   var log_data = {
      name: trigger.name
    };
    self.send_log(log_data, self.LOG_CATEGORY_ACHIEVEMENT);
    self.increment_num_achievements();
  }

  self.farmbit_death = function(f){
   var log_data = {
      farmbit: self.farmbit_data_short(f),
      grave: self.tile_data_short(f.home)
    }
    self.send_log(log_data, self.LOG_CATEGORY_FARMBITDEATH)
  }

  self.blurb = function(txt){
    if(self.log_blurbs){
     var log_data = {
//        blurb: txt,
//        advisor: gg.advisors.advisor
      }
      self.send_log(log_data, self.LOG_CATEGORY_BLURB);
    }
  }
  self.record = function(txt){
  //  var log_data = {
  //     record: txt,
  //     advisor: gg.advisors.advisor
  //   }
  //   self.send_log(log_data, self.LOG_CATEGORY_RECORD);
  }

  self.raining = function(){
    if(!gg.b.raining && self.was_raining){
      self.prev_nutritions = self.nutrition_array();
     var log_data = {
        nutrition: self.prev_nutritions
      };
      self.send_log(log_data, self.LOG_CATEGORY_RAINSTOPPED);
    }
    self.update_raining();
  }

  //Log Sender:
  self.send_log = function(log_data,category){
    var formatted_log_data = {
      level: 1, //TODO: make this not 1
      event: "CUSTOM",
      event_custom: category,
      event_data_complex: JSON.stringify(log_data)
    };
    // self.mySlog.log(formatted_log_data);
    log_data.category = category;
    console.log(log_data);
  }

  //Helpers:
  self.gamestate = function(){
    var now = Date.now();
    var gamestate = {
      farmbits: self.farmbit_array(),
      items: self.item_array(),
      tile_nutritions: self.update_nutritions(),
      tile_marks: self.tile_mark_array(),
      tile_vals: self.tile_val_array(),
      money_per_min: Math.floor(gg.advisors.money_rate*60*60),
      people_supported: gg.advisors.people_supported,
      money: gg.money,
      speed: gg.speed,
      raining: gg.b.raining,
      curr_selection_type: gg.inspector.detailed_type,
      curr_selection_data: self.detailed_data(gg.inspector.detailed),
      camera_center: self.prev_center_txty,
      click_history: self.flush_click_history(now),
      timestamp: now,
      num_achievements: self.get_num_achievements(),
      num_checkpoints_completed: self.get_num_checkpoints_completed(),
      gametime: self.time,
      camera_history: self.flush_camera_history(now),
      emote_history: self.flush_emote_history(now)
    };
    return gamestate;
  }
  self.tile_data = function(t){
    return {
      tile: self.tile_data_short(t),
      marks: t.marks,
    };
  }
  self.item_data = function(it){
    return {
      item: self.item_data_short(it),
      marks: it.marks,
    };
  }
  self.farmbit_data = function(f){
    return {
      farmbit: self.farmbit_data_short(f),
      name: f.name,
    };
  }
  self.buy_data = function(buy){
    return {
      name: gg.shop.buy_btn(buy).name,
      cost: gg.shop.buy_cost(buy),
      curr_money: gg.money,
      success: gg.money >= gg.shop.buy_cost(buy)
    };
  }
  self.tile_data_short = function(t){
    return [t.tx, t.ty, t.type, Math.floor(t.nutrition/nutrition_percent)];
  }
  self.farmbit_data_short = function(f){
    return [f.tile.tx,f.tile.ty,f.job_state,Math.floor(f.fullness/max_fullness*10),Math.floor(f.joy/max_joy*10)];
  }
  self.item_data_short = function(it){
    return [it.tile.tx,it.tile.ty,it.thing,it.mark];
  }

  self.farmbit_array = function(){
    return gg.farmbits.map(self.farmbit_data_short);
  }

  self.item_array = function(){
    return gg.items.map(self.item_data_short);
  }
  self.nutrition_array = function(){
    return gg.b.tiles.map(function(x) {return Math.floor(x.nutrition/nutrition_percent)});
  }
  self.tile_mark_array = function(){
    var interesting_tiles = gg.b.tiles.filter(function(x){
      return !self.arraysEqual(x.marks, [1,1,1,1])
    });
    return interesting_tiles.map(function(x) {
      return [x.tile.tx, x.tile.ty,x.tile.type].concat(x.marks);
    });
  }
  self.tile_val_array = function(){
    var interesting_tiles = gg.b.tiles.filter(function(x){
      return x.val
    });
    return interesting_tiles.map(function(x) {
      return [x.tile.tx, x.tile.ty,x.tile.type].concat(Math.floor(x.val/1000));
    });
  }

  self.detailed_data = function(){
    switch(gg.inspector.detailed_type){
      case INSPECTOR_CONTENT_NULL:      break;
      case INSPECTOR_CONTENT_TILE:      return self.tile_data_short(gg.inspector.detailed);
      case INSPECTOR_CONTENT_ITEM:      return self.item_data_short(gg.inspector.detailed);
      case INSPECTOR_CONTENT_FARMBIT:   return self.farmbit_data_short(gg.inspector.detailed);
    }
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

}

var my_logger = new Logger();
// window.addEventListener("beforeunload", my_logger.endgame());