var ENUM;
ENUM = 0;
var BUY_TYPE_NULL      = ENUM; ENUM++;
var BUY_TYPE_HOME      = ENUM; ENUM++;
var BUY_TYPE_FARM      = ENUM; ENUM++;
var BUY_TYPE_LIVESTOCK = ENUM; ENUM++;
var BUY_TYPE_STORAGE   = ENUM; ENUM++;
var BUY_TYPE_PROCESSOR = ENUM; ENUM++;
var BUY_TYPE_ROAD      = ENUM; ENUM++;
var BUY_TYPE_DEMOLISH  = ENUM; ENUM++;
var BUY_TYPE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var INSPECTOR_CONTENT_NULL    = ENUM; ENUM++;
var INSPECTOR_CONTENT_FARMBIT = ENUM; ENUM++;
var INSPECTOR_CONTENT_ITEM    = ENUM; ENUM++;
var INSPECTOR_CONTENT_TILE    = ENUM; ENUM++;
var INSPECTOR_CONTENT_COUNT   = ENUM; ENUM++;

var playhead = function()
{
  var self = this;
  self.resize = function()
  {
    var btnw = 40*gg.stage.s_mod;
    var btnh = btnw;
    var btnpad = 10*gg.stage.s_mod;

    self.w = btnw*3+btnpad*2;
    self.h = btnh;
    self.x = gg.canvas.width/2-self.w/2;
    self.y = gg.b.tl_bound_tile.y-self.h-btnpad;

    var btnx = self.x;
    var btny = self.y;

    setBB(self.pause_btn, btnx,btny,btnw,btnh); btnx += btnw+btnpad;
    setBB(self.play_btn,  btnx,btny,btnw,btnh); btnx += btnw+btnpad;
    setBB(self.speed_btn, btnx,btny,btnw,btnh); btnx += btnw+btnpad;
  }

  self.pause_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 0; });
  self.play_btn  = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 1; DOUBLETIME = 0; });
  self.speed_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 1; DOUBLETIME = 1; });
  self.resize();

  self.pause_btn.active = 0;
  self.play_btn.active = 0;
  self.speed_btn.active = 0;

  self.filter = function(filter)
  {
    if(gg.b.spewing_road) return;
    if(gg.shop.selected_buy) return;
    var check = true;
    if(check && self.pause_btn.active) check = !filter.filter(self.pause_btn);
    if(check && self.play_btn.active)  check = !filter.filter(self.play_btn);
    if(check && self.speed_btn.active) check = !filter.filter(self.speed_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = black;
    gg.ctx.textAlign = "left";

    if(self.pause_btn.active) { strokeBB(self.pause_btn,gg.ctx); gg.ctx.fillText("||", self.pause_btn.x, self.pause_btn.y+20);  }
    if(self.play_btn.active)  { strokeBB(self.play_btn,gg.ctx);  gg.ctx.fillText(">", self.play_btn.x, self.play_btn.y+20);  }
    if(self.speed_btn.active) { strokeBB(self.speed_btn,gg.ctx); gg.ctx.fillText(">>",self.speed_btn.x,self.speed_btn.y+20); }
  }
}

var shop = function()
{
  var self = this;
  self.resize = function()
  {
    self.x = 0;
    self.y = 0;
    self.w = gg.b.tl_bound_tile.x;
    self.h = gg.canvas.height;

    var btn_pad = 10*gg.stage.s_mod;
    var btn_w = (self.w-btn_pad*3)/2;
    var btn_h = self.h/6;
    var btn_x = btn_pad;
    var btn_y = btn_pad;

    setBB(self.money_display, btn_x,btn_y,btn_w*2,gg.b.tl_bound_tile.y-btn_pad*2);
    btn_y = gg.b.tl_bound_tile.y+gg.b.tl_bound_tile.h;
    setBB(self.home_btn,      btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+btn_pad;
    setBB(self.farm_btn,      btn_x,btn_y,btn_w,btn_h); btn_x = btn_pad; btn_y += btn_h+btn_pad;
    setBB(self.livestock_btn, btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+btn_pad;
    setBB(self.storage_btn,   btn_x,btn_y,btn_w,btn_h); btn_x = btn_pad; btn_y += btn_h+btn_pad;
    setBB(self.processor_btn, btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+btn_pad;
    setBB(self.road_btn,      btn_x,btn_y,btn_w,btn_h); btn_x = btn_pad; btn_y += btn_h+btn_pad;
    setBB(self.demolish_btn,  btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+btn_pad;
    setBB(self.money_btn,     btn_x,btn_y,btn_w,btn_h); btn_x = btn_pad; btn_y += btn_h+btn_pad;
    setBB(self.abandon_btn,   btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+btn_pad;
    setBB(self.refund_btn,    btn_x,btn_y,btn_w,btn_h); btn_x = btn_pad; btn_y += btn_h+btn_pad;
  }

  self.money_display = new BB();
  self.home_btn      = new ButtonBox(0,0,0,0,function(){ if(gg.money < home_cost)      return; gg.money -= home_cost;      self.selected_buy = BUY_TYPE_HOME;      });
  self.farm_btn      = new ButtonBox(0,0,0,0,function(){ if(gg.money < farm_cost)      return; gg.money -= farm_cost;      self.selected_buy = BUY_TYPE_FARM;      });
  self.livestock_btn = new ButtonBox(0,0,0,0,function(){ if(gg.money < livestock_cost) return; gg.money -= livestock_cost; self.selected_buy = BUY_TYPE_LIVESTOCK; });
  self.storage_btn   = new ButtonBox(0,0,0,0,function(){ if(gg.money < storage_cost)   return; gg.money -= storage_cost;   self.selected_buy = BUY_TYPE_STORAGE;   });
  self.processor_btn = new ButtonBox(0,0,0,0,function(){ if(gg.money < processor_cost) return; gg.money -= processor_cost; self.selected_buy = BUY_TYPE_PROCESSOR; });
  self.road_btn      = new ButtonBox(0,0,0,0,function(){ if(gg.money < road_cost)      return; gg.money -= road_cost;      self.selected_buy = BUY_TYPE_ROAD;      });
  self.demolish_btn  = new ButtonBox(0,0,0,0,function(){ if(gg.money < demolish_cost)  return; gg.money -= demolish_cost;  self.selected_buy = BUY_TYPE_DEMOLISH;  });
  self.money_btn     = new ButtonBox(0,0,0,0,function(){ gg.money += free_money; });
  self.abandon_btn   = new ButtonBox(0,0,0,0,function(){ for(var i = 0; i < gg.farmbits.length; i++) gg.farmbits[i].abandon_job(); });
  self.refund_btn    = new ButtonBox(0,0,0,0,function(){
    switch(self.selected_buy)
    {
      case BUY_TYPE_HOME:      gg.money += home_cost; break;
      case BUY_TYPE_FARM:      gg.money += farm_cost; break;
      case BUY_TYPE_LIVESTOCK: gg.money += livestock_cost; break;
      case BUY_TYPE_STORAGE:   gg.money += storage_cost; break;
      case BUY_TYPE_PROCESSOR: gg.money += processor_cost; break;
      case BUY_TYPE_ROAD:      gg.money += road_cost; break;
      case BUY_TYPE_DEMOLISH:  gg.money += demolish_cost; break;
      default: break;
    }
    self.selected_buy = 0;
  });
  self.resize();

  self.selected_buy = 0;

  self.home_btn.active = 1;
  self.farm_btn.active = 0;
  self.livestock_btn.active = 0;
  self.storage_btn.active = 0;
  self.processor_btn.active = 0;
  self.road_btn.active = 0;
  self.demolish_btn.active = 0;
  self.money_btn.active = 1;
  self.abandon_btn.active = 0;
  self.refund_btn.active = 1;

  self.filter = function(filter)
  {
    if(gg.b.spewing_road) return;
    var check = true;
    if(!self.selected_buy)
    {
      if(check && self.home_btn.active)      check = !filter.filter(self.home_btn);
      if(check && self.farm_btn.active)      check = !filter.filter(self.farm_btn);
      if(check && self.livestock_btn.active) check = !filter.filter(self.livestock_btn);
      if(check && self.storage_btn.active)   check = !filter.filter(self.storage_btn);
      if(check && self.processor_btn.active) check = !filter.filter(self.processor_btn);
      if(check && self.road_btn.active)      check = !filter.filter(self.road_btn);
      if(check && self.demolish_btn.active)  check = !filter.filter(self.demolish_btn);
      if(check && self.money_btn.active)     check = !filter.filter(self.money_btn);
      if(check && self.abandon_btn.active)   check = !filter.filter(self.abandon_btn);
    }
    else
      if(check && self.refund_btn.active) check = !filter.filter(self.refund_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = gray;
    gg.ctx.textAlign = "left";

    if(!self.selected_buy)
    {
      if(self.home_btn.active)      { if(gg.money < home_cost)      gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.home_btn,gg.ctx); }
      if(self.farm_btn.active)      { if(gg.money < farm_cost)      gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.farm_btn,gg.ctx); }
      if(self.livestock_btn.active) { if(gg.money < livestock_cost) gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.livestock_btn,gg.ctx); }
      if(self.storage_btn.active)   { if(gg.money < storage_cost)   gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.storage_btn,gg.ctx); }
      if(self.processor_btn.active) { if(gg.money < processor_cost) gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.processor_btn,gg.ctx); }
      if(self.road_btn.active)      { if(gg.money < road_cost)      gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.road_btn,gg.ctx); }
      if(self.demolish_btn.active)  { if(gg.money < demolish_cost)  gg.ctx.fillStyle = gray; else gg.ctx.fillStyle = white; fillBB(self.demolish_btn,gg.ctx); }
    }

    gg.ctx.fillStyle = black;
    gg.ctx.fillText("$"+gg.money,10*gg.stage.s_mod,30*gg.stage.s_mod);

    if(!self.selected_buy)
    {
      if(self.home_btn.active)      { strokeBB(self.home_btn,gg.ctx);      gg.ctx.fillText("home",                   self.home_btn.x,      self.home_btn.y+20*gg.stage.s_mod);      gg.ctx.fillText("$"+home_cost,      self.home_btn.x,      self.home_btn.y+30*gg.stage.s_mod); }
      if(self.farm_btn.active)      { strokeBB(self.farm_btn,gg.ctx);      gg.ctx.fillText("farm",                   self.farm_btn.x,      self.farm_btn.y+20*gg.stage.s_mod);      gg.ctx.fillText("$"+farm_cost,      self.farm_btn.x,      self.farm_btn.y+30*gg.stage.s_mod); }
      if(self.livestock_btn.active) { strokeBB(self.livestock_btn,gg.ctx); gg.ctx.fillText("livestock",              self.livestock_btn.x, self.livestock_btn.y+20*gg.stage.s_mod); gg.ctx.fillText("$"+livestock_cost, self.livestock_btn.x, self.livestock_btn.y+30*gg.stage.s_mod); }
      if(self.storage_btn.active)   { strokeBB(self.storage_btn,gg.ctx);   gg.ctx.fillText("storage",                self.storage_btn.x,   self.storage_btn.y+20*gg.stage.s_mod);   gg.ctx.fillText("$"+storage_cost,   self.storage_btn.x,   self.storage_btn.y+30*gg.stage.s_mod); }
      if(self.processor_btn.active) { strokeBB(self.processor_btn,gg.ctx); gg.ctx.fillText("processor",              self.processor_btn.x, self.processor_btn.y+20*gg.stage.s_mod); gg.ctx.fillText("$"+processor_cost, self.processor_btn.x, self.processor_btn.y+30*gg.stage.s_mod); }
      if(self.road_btn.active)      { strokeBB(self.road_btn,gg.ctx);      gg.ctx.fillText("roadx"+roads_per_buy,    self.road_btn.x,      self.road_btn.y+20*gg.stage.s_mod);      gg.ctx.fillText("$"+road_cost,      self.road_btn.x,      self.road_btn.y+30*gg.stage.s_mod); }
      if(self.demolish_btn.active)  { strokeBB(self.demolish_btn,gg.ctx);  gg.ctx.fillText("demolish",               self.demolish_btn.x,  self.demolish_btn.y+20*gg.stage.s_mod);  gg.ctx.fillText("$"+demolish_cost,  self.demolish_btn.x,  self.demolish_btn.y+30*gg.stage.s_mod); }
      if(self.money_btn.active)     { strokeBB(self.money_btn,gg.ctx);     gg.ctx.fillText("money",                  self.money_btn.x,     self.money_btn.y+20*gg.stage.s_mod);     gg.ctx.fillText("+$"+free_money,    self.money_btn.x,     self.money_btn.y+30*gg.stage.s_mod); }
      if(self.abandon_btn.active)   { strokeBB(self.abandon_btn,gg.ctx);   gg.ctx.fillText("abandon",                self.abandon_btn.x,   self.abandon_btn.y+20*gg.stage.s_mod); }
    }
    else
      if(self.refund_btn.active) { strokeBB(self.refund_btn,gg.ctx); gg.ctx.fillText("refund", self.refund_btn.x, self.refund_btn.y+20*gg.stage.s_mod); }
  }
}

var inspector = function()
{
  var self = this;
  self.resize = function()
  {
    self.x = gg.b.br_bound_tile.x+gg.b.br_bound_tile.w;
    self.y = 0;
    self.w = gg.canvas.width-self.x;
    self.h = gg.canvas.height;
  }
  self.resize();

  self.detailed = 0;
  self.detailed_type = INSPECTOR_CONTENT_NULL;
  self.quick = 0;
  self.quick_type = INSPECTOR_CONTENT_NULL;

  var vspace = 20*gg.stage.s_mod;

  self.draw_tile = function(t)
  {
    var x = self.x+vspace;
    var y = vspace;
    gg.ctx.fillText("TILE",x,y);
    y += vspace;
    str = "Type: ";
    switch(t.type)
    {
      case TILE_TYPE_NULL:      str += "null";      break;
      case TILE_TYPE_LAND:      str += "land";      break;
      case TILE_TYPE_ROCK:      str += "rock";      break;
      case TILE_TYPE_WATER:     str += "water";     break;
      case TILE_TYPE_SHORE:     str += "shore";     break;
      case TILE_TYPE_FORREST:   str += "forrest";   break;
      case TILE_TYPE_HOME:      str += "home";      break;
      case TILE_TYPE_FARM:      str += "farm";      break;
      case TILE_TYPE_LIVESTOCK: str += "livestock"; break;
      case TILE_TYPE_STORAGE:   str += "storage";   break;
      case TILE_TYPE_PROCESSOR: str += "processor"; break;
      case TILE_TYPE_ROAD:      str += "road";      break;
      case TILE_TYPE_COUNT:     str += "count";     break;
    }
    gg.ctx.fillText(str+" ("+t.tx+","+t.ty+")",x,y);
    y += vspace;
    str = "State: ";
    switch(t.state)
    {
      case TILE_STATE_NULL:               str += "null";       break;
      case TILE_STATE_HOME_VACANT:        str += "vacant";     break;
      case TILE_STATE_HOME_OCCUPIED:      str += "occupied";   break;
      case TILE_STATE_FARM_UNPLANTED:     str += "unplanted";  break;
      case TILE_STATE_FARM_PLANTED:       str += "planted";    break;
      case TILE_STATE_FARM_GROWN:         str += "grown";      break;
      case TILE_STATE_LIVESTOCK_IDLE:     str += "idle";       break;
      case TILE_STATE_STORAGE_UNASSIGNED: str += "unassigned"; break;
      case TILE_STATE_STORAGE_FOOD:       str += "food";       break;
      case TILE_STATE_STORAGE_POOP:       str += "poop";       break;
      case TILE_STATE_STORAGE_VALUABLE:   str += "valuable";   break;
      case TILE_STATE_COUNT:              str += "null";       break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;
    switch(t.type)
    {
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_WATER:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FORREST:
        break;
      case TILE_TYPE_FARM:
      {
        gg.ctx.fillText("val:"+fdisp(t.val)+" ("+fdisp(t.val*100/farm_nutrition_req)+"%)",x,y);
        y += vspace;
      }
        break;
      case TILE_TYPE_LIVESTOCK:
        break;
      case TILE_TYPE_STORAGE:
      {
        gg.ctx.fillText("val:"+t.val,x,y);
        y += vspace;
        gg.ctx.fillText("withdraw_lock:"+t.withdraw_lock,x,y);
        y += vspace;
        gg.ctx.fillText("deposit_lock:"+t.deposit_lock,x,y);
        y += vspace;
      }
        break;
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_COUNT:
        break;
    }
    gg.ctx.fillText("t:"+t.state_t,x,y);
    y += vspace;
    gg.ctx.fillText("nutrition:"+fdisp(t.nutrition),x,y);
    y += vspace;
    gg.ctx.fillText("lock:"+t.lock,x,y);
    y += vspace;
    y += vspace;
    return y;
  }

  self.draw_item = function(it)
  {
    var x = self.x+vspace;
    var y = vspace;
    gg.ctx.fillText("ITEM",x,y);
    y += vspace;
    str = "Type: ";
    switch(it.type)
    {
      case ITEM_TYPE_NULL:     str += "null";     break;
      case ITEM_TYPE_WATER:    str += "water";    break;
      case ITEM_TYPE_FOOD:     str += "food";     break;
      case ITEM_TYPE_POOP:     str += "poop";     break;
      case ITEM_TYPE_VALUABLE: str += "valuable"; break;
      case ITEM_TYPE_COUNT:    str += "count";    break;
    }
    gg.ctx.fillText(str+" ("+it.tile.tx+","+it.tile.ty+")",x,y);
    y += vspace;
    gg.ctx.fillText("lock:"+it.lock,x,y);
    y += vspace;
    y += vspace;
    return y;
  }

  self.draw_farmbit = function(b)
  {
    var x = self.x+vspace;
    var y = vspace;
    gg.ctx.fillText("FARMBIT",x,y);
    y += vspace;
    str = "Job: ";
    switch(b.job_type)
    {
      case JOB_TYPE_NULL:      str += "null";      break;
      case JOB_TYPE_IDLE:      str += "idle";      break;
      case JOB_TYPE_WAIT:      str += "wait";      break;
      case JOB_TYPE_EAT:       str += "eat";       break;
      case JOB_TYPE_SLEEP:     str += "sleep";     break;
      case JOB_TYPE_PLAY:      str += "play";      break;
      case JOB_TYPE_PLANT:     str += "plant";     break;
      case JOB_TYPE_HARVEST:   str += "harvest";   break;
      case JOB_TYPE_FERTILIZE: str += "fertilize"; break;
      case JOB_TYPE_STORE:     str += "store";     break;
      case JOB_TYPE_PROCESS:   str += "process";   break;
      case JOB_TYPE_KICK:      str += "kick";      break;
      case JOB_TYPE_EXPORT:    str += "export";    break;
      case JOB_TYPE_COUNT:     str += "count";     break;
    }
    gg.ctx.fillText(str+" ("+b.tile.tx+","+b.tile.ty+")",x,y);
    y += vspace;
    str = "Job State: ";
    switch(b.job_state)
    {
      case JOB_STATE_NULL:        str += "null";   break;
      case JOB_STATE_GET:         str += "get";    break;
      case JOB_STATE_SEEK:        str += "seek";   break;
      case JOB_STATE_ACT:         str += "act";    break;
      case JOB_STATE_IDLE_CHILL:  str += "chill";  break;
      case JOB_STATE_IDLE_WANDER: str += "wander"; break;
      case JOB_STATE_COUNT:       str += "null";   break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;

    str = "fullness: "+fdisp(b.fullness)+" ";
    switch(b.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   str += "(CONTENT)";   break;
      case FARMBIT_STATE_MOTIVATED: str += "(MOTIVATED)"; break;
      case FARMBIT_STATE_DESPERATE: str += "(DESPERATE)"; break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;

    str = "energy: "+fdisp(b.energy)+" ";
    switch(b.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   str += "(CONTENT)";   break;
      case FARMBIT_STATE_MOTIVATED: str += "(MOTIVATED)"; break;
      case FARMBIT_STATE_DESPERATE: str += "(DESPERATE)"; break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;

    str = "joy: "+fdisp(b.joy)+" ";
    switch(b.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   str += "(CONTENT)";   break;
      case FARMBIT_STATE_MOTIVATED: str += "(MOTIVATED)"; break;
      case FARMBIT_STATE_DESPERATE: str += "(DESPERATE)"; break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;

    str = "fulfillment: "+fdisp(b.fulfillment)+" ";
    switch(b.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   str += "(CONTENT)";   break;
      case FARMBIT_STATE_MOTIVATED: str += "(MOTIVATED)"; break;
      case FARMBIT_STATE_DESPERATE: str += "(DESPERATE)"; break;
    }
    gg.ctx.fillText(str,x,y);
    y += vspace;

    gg.ctx.fillText("t:"+b.job_state_t,x,y);
    y += vspace;
    y += vspace;
    return y;
  }

  self.draw = function()
  {
    gg.ctx.fillStyle = black;

    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL: gg.ctx.fillText("(nothing selected)",10*gg.stage.s_mod,vspace); break;
      case INSPECTOR_CONTENT_TILE:    self.draw_tile(self.detailed); break;
      case INSPECTOR_CONTENT_ITEM:    self.draw_item(self.detailed); break;
      case INSPECTOR_CONTENT_FARMBIT: self.draw_farmbit(self.detailed); break;
    }

  }

}

var ticker = function()
{
  var self = this;
  self.resize = function()
  {
    self.x = gg.b.br_bound_tile.x+gg.b.br_bound_tile.w;
    self.y = 0;
    self.w = gg.canvas.width-self.x;
    self.h = gg.canvas.height;
  }
  self.resize();

  self.feed = [];
  self.feed_t = [];
  var feed_t_max = 500;
  self.nq = function(txt)
  {
    self.feed.push(txt);
    self.feed_t.push(0);
  }

  self.tick = function()
  {
    for(var i = 0; i < self.feed.length; i++)
    {
      self.feed_t[i]++;
      if(self.feed_t[i] > feed_t_max)
      {
        self.feed.splice(i,1);
        self.feed_t.splice(i,1);
        i--;
      }
    }
  }

  self.draw = function()
  {
    var pad = 20*gg.stage.s_mod;
    var y = self.y+self.h-pad;
    for(var i = 0; i < self.feed.length; i++)
    {
      var index = self.feed.length-1-i;
      var t = self.feed_t[index]/feed_t_max;
      var a = min(1,2-(2*t));
      var r = floor(max(0,1-t*5)*255);
      gg.ctx.fillStyle = "rgba("+r+",0,0,"+a+")";
      gg.ctx.fillText(self.feed[index],self.x+10*gg.stage.s_mod,self.y+10*gg.stage.s_mod+y);
      y -= pad;
    }
    gg.ctx.fillStyle = black;
  }
}

var tutorial = function()
{
  var self = this;
  self.resize = function()
  {
    self.x = 0;
    self.y = 0;
    self.w = gg.canvas.width;
    self.h = gg.canvas.height;
  }
  self.resize();

  self.takeover = 0;
  self.state = 0;
  self.state_t = 0;

  self.working_thread = -1;
  self.thread_state_funcs = [];
  self.thread_states = [];
  self.thread_state_ts = [];

  self.quest = 0;

  //queries
  self.time_passed = function(t) { return self.state_t >= t; }
  self.bits_exist = function(n) { return gg.farmbits.length >= n; }
  self.bits_hungry = function(n) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].fullness_state < FARMBIT_STATE_MOTIVATED) n--; return n <= 0; }
  self.bits_job = function(type,state) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].job_type == type && gg.farmbits[i].job_state == state) return 1; return 0; }
  self.tiles_exist = function(type,n) { return gg.b.tile_groups[type].length >= n; }
  self.items_exist = function(type,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.sale_items_exist = function(type,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type && gg.items[i].sale) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.purchased = function(type) { return gg.shop.selected_buy == type; }

  //transitions
  self.setquest = function(q){self.quest = "QUEST: "+q;}
  self.kq = function() { self.quest = 0; }
  self.dotakeover = function(){self.takeover = 1;}
  self.dokqtakeover = function(){self.kq();self.dotakeover();}
  self.newthread = function(funcs)
  {
    self.thread_state_funcs.push(funcs);
    self.thread_states.push(0);
    self.thread_state_ts.push(0);
  }

  //draws
  self.wash = function()
  {
    gg.ctx.globalAlpha = 0.5;
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(self.x,self.y,self.w,self.h);
    gg.ctx.globalAlpha = 1;
  }
  self.hilight = function(o)
  {
    switch(o.thing)
    {
      case 0:
        console.log(o);
        break;
      case THING_TYPE_TILE:
        var w = gg.b.w/gg.b.tw;
        var h = gg.b.h/gg.b.th;
        var ny = round(gg.b.y+gg.b.h-((o.ty+1)*h));
        var  x = round(gg.b.x+       ((o.tx  )*w));
        gg.b.draw_tile(o,x,ny,w,h);
        break;
      case THING_TYPE_ITEM:
        o.draw();
        break;
      case THING_TYPE_FARMBIT:
        o.draw();
        break;
    }
  }
  self.textat = function(text,x,y)
  {
    var w = gg.ctx.measureText(text).width;
    var h = 12*gg.stage.s_mod;
    var p = h*0.5;
    w += p*2;
    h += p*2;
    gg.ctx.fillStyle = white;
    gg.ctx.strokeStyle = black;
    if(gg.ctx.textAlign == "center") fillRRect(x-w/2,y-h+p,w,h,h*0.25,gg.ctx);
    else fillRRect(x-p,y-h+p,w,h,h*0.25,gg.ctx);
    gg.ctx.stroke();
    gg.ctx.fillStyle = black;
    gg.ctx.fillText(text,x,y);
  }
  self.ctc = function()
  {
    gg.ctx.textAlign = "center";
    self.textat("(click anywhere to continue)",gg.canvas.width/2,gg.canvas.height*3/4);
  }
  self.onscreentextat = function(text,x,y)
  {
    var w = gg.ctx.measureText(text).width;
    var h = 12*gg.stage.s_mod;
    var p = h*0.5;
    w += p*2;
    h += p*2;
    gg.ctx.fillStyle = white;
    gg.ctx.strokeStyle = black;
    if(y-h+p < 0) y = h-p;
    if(y+p > gg.canvas.height) y = gg.canvas.height-p;
    if(gg.ctx.textAlign == "center")
    {
      if(x-w/2 < 0) x = w/2;
      if(x+w/2 > gg.canvas.width) x = gg.canvas.width-w/2;
      fillRRect(x-w/2,y-h+p,w,h,h*0.25,gg.ctx);
    }
    else
    {
      if(x-p < 0) x = p;
      if(x-p+w > gg.canvas.width) x = gg.canvas.width-w+p;
      fillRRect(x-p,y-h+p,w,h,h*0.25,gg.ctx);
    }
    gg.ctx.stroke();
    gg.ctx.fillStyle = black;
    gg.ctx.fillText(text,x,y);
  }

  self.next_state = function()
  {
    self.takeover = 0;
    self.state++;
    self.state_t = 0;
    self.state_funcs[self.state*4+0]();
  }

  self.delay_next_state = function()
  {
    if(self.state_t > 30) self.next_state();
  }

  self.click = function(evt)
  {
    self.state_funcs[self.state*4+3](evt);
  }

  self.tick = function()
  {
    //thread
    if(self.working_thread > -1)
    {
      var i = self.working_thread;
      self.thread_state_ts[i]++;
      if(self.thread_state_funcs[self.thread_states[i]*4+1](self.thread_state_ts[i])) //tick
      {
        self.thread_states[i]++;
        if(self.thread_states[i]*4 > self.thread_state_funcs[i].length)
        {
          self.thread_state_funcs.splice(i,1);
          self.thread_states.splice(i,1);
          self.thread_state_ts.splice(i,1);
          self.working_thread = -1;
        }
        else
        {
          self.thread_state_ts[i] = 0;
          self.thread_state_funcs[self.thread_states[i]*4+0](self.thread_state_ts[i]); //transition
        }
      }
    }

    //main
    else
    {
      self.state_t++;
      if(self.state_funcs[self.state*4+1]()) self.next_state();

      //thread roots
      for(var i = 0; self.working_thread == -1 && i < self.thread_state_funcs.length/4; i++)
      {
        self.thread_state_ts[i]++;
        if(self.thread_state_funcs[i][0*4+1](self.thread_state_ts[i])) //tick
        {
          self.working_thread = i;
          self.thread_states[i]++;
          self.thread_state_ts[i] = 0;
          self.thread_state_funcs[self.thread_states[i]*4+0](self.thread_state_ts[i]); //transition
        }
      }

    }
  }

  self.draw = function()
  {
    self.state_funcs[self.state*4+2]();
    if(self.quest)
    {
      gg.ctx.textAlign = "left"; self.textat(self.quest,0,gg.canvas.height-12);
    }
  }

  self.state_funcs = [ //transition,tick,draw,click

    noop, //transition
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("Buy your first house.",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return self.purchased(BUY_TYPE_HOME); }, //tick
    function(){ gg.ctx.textAlign = "left"; self.textat("<- Click here to buy",gg.shop.home_btn.x+gg.shop.home_btn.w+20,gg.shop.home_btn.y+gg.shop.home_btn.h/2); }, //draw
    noop, //click

    noop, //transition
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ gg.ctx.textAlign = "center"; self.textat("Place it somewhere on the map",gg.canvas.width/2,gg.canvas.height/2); }, //draw
    noop, //click

    noop, //transition
    function(){ return self.bits_exist(1); }, //tick
    function(){ self.wash(); var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_HOME][0]); self.hilight(t); gg.ctx.textAlign = "center"; self.textat("Someone should move in soon!",t.x+t.w/2,t.y-t.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return self.bits_exist(1); }, //tick
    function(){ var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_HOME][0]); gg.ctx.textAlign = "center"; var dots = ""; if(self.state_t%10 > 6) dots = ".."; else if(self.state_t%10 > 3) dots = "."; self.textat("Waiting."+dots,t.x+t.w/2,t.y-t.h); }, //draw
    noop, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.onscreentextat(f.name+" moved into your town!",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.onscreentextat("It's your job to ensure their survival!",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.next_state, //click

    noop, //transition
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.onscreentextat(f.name+" will eventually need some food...",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.next_state, //click

    function(){ gg.shop.farm_btn.active = 1; }, //transition
    function(){ return self.purchased(BUY_TYPE_FARM); }, //tick
    function(){ var b = gg.shop.farm_btn; gg.ctx.textAlign = "left"; self.textat("<- Click here to buy a farm.",b.x+b.w+20,b.y+b.h/2); }, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center";self.textat("Before you place it on the map...",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.next_state, //click

    self.dotakeover, //transition
    function(){ return gg.b.nutrition_view; }, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("Press 'n' to toggle Nutrition View",gg.canvas.width/2,gg.canvas.height/2); }, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("The red represents the fertility of that tile.",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.next_state, //click

    noop, //transition
    function(){ return self.tiles_exist(TILE_TYPE_FARM,1); }, //tick
    function(){ gg.ctx.textAlign = "center"; self.textat("Place your farm somewhere with fertil soil",gg.canvas.width/2,gg.canvas.height/2); }, //draw
    noop, //click

    noop, //transition
    noop, //tick
    function(){ var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_FARM][0]); var f = gg.farmbits[0]; gg.ctx.textAlign = "center"; self.textat(f.name+" will automatically manage the farm.",t.x+t.w/2,t.y-t.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    function(){ return !gg.b.nutrition_view; }, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("(Press 'n' at any time to toggle Nutrition View)",gg.canvas.width/2,gg.canvas.height/2); }, //draw
    noop, //click

    function(){ self.setquest("Wait on your farm..."); }, //transition
    function(){ return self.items_exist(ITEM_TYPE_FOOD,1); }, //tick
    noop, //draw
    noop, //click

    noop, //transition
    function(){ return self.time_passed(40); }, //tick
    noop, //draw
    noop, //click

    self.dokqtakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var i = self.items_exist(ITEM_TYPE_FOOD,1); gg.ctx.textAlign = "center"; self.onscreentextat("Your farm has produced some food!",i.x+i.w/2,i.y-i.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var i = self.items_exist(ITEM_TYPE_FOOD,1); gg.ctx.textAlign = "center"; self.onscreentextat("Let's sell some.",i.x+i.w/2,i.y-i.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    function(){self.dotakeover(); gg.playhead.pause_btn.active = 1; gg.playhead.play_btn.active = 1;gg.playhead.speed_btn.active = 1; RESUME_SIM = 0;}, //transition
    ffunc, //tick
    function(){ self.wash(); var b = gg.playhead.play_btn; gg.ctx.textAlign = "center"; self.textat("the game is now paused-",b.x+b.w/2,b.y+b.h*2); self.ctc(); }, //draw
    self.next_state, //click

    noop,
    ffunc, //tick
    function(){ self.wash(); var b = gg.playhead.play_btn; gg.ctx.textAlign = "center"; self.textat("you can toggle game playback with this button",b.x+b.w/2,b.y+b.h*2); self.ctc(); }, //draw
    self.next_state, //click

    noop, //transition
    function(){ return self.sale_items_exist(ITEM_TYPE_FOOD,1); }, //tick
    function(){ var i = self.items_exist(ITEM_TYPE_FOOD,1); gg.ctx.textAlign = "center"; self.onscreentextat("Double click an object to mark it as \"for sale\".",i.x+i.w/2,i.y-i.h);}, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.textat(f.name+" will eventually export this for sale!",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return RESUME_SIM; }, //tick
    function(){ var b = gg.playhead.play_btn; gg.ctx.textAlign = "center"; self.textat("click to resume the game.",b.x+b.w/2,b.y+b.h*2); }, //draw
    noop, //click

    noop, //transition
    function(){ return self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.textat(f.name+" is exporting the extra food",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); var f = gg.farmbits[0]; self.hilight(f); gg.ctx.textAlign = "center"; self.textat("They'll be back soon with some money!",f.x+f.w/2,f.y-f.h); self.ctc(); }, //draw
    self.next_state, //click

    noop, //transition
    function(){ return !self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "left"; self.textat("You just made $50!",gg.shop.x+gg.shop.w/2,gg.shop.y+30); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "left"; self.textat("Save up for an additional farm.",gg.shop.x+gg.shop.w/2,gg.shop.y+30); self.ctc(); }, //draw
    self.next_state, //click

    function(){ self.setquest("save up for an additional farm");}, //transition
    function(){ return self.time_passed(1000); }, //tick
    noop, //draw
    noop, //click

    noop, //transition
    function() { return DOUBLETIME; }, //tick
    function() { self.wash(); var b = gg.playhead.speed_btn; gg.ctx.textAlign = "center"; self.textat("Click here if you want to speed up time",b.x+b.w/2,b.y+b.h*2); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return self.tiles_exist(TILE_TYPE_FARM,2); }, //tick
    noop, //draw
    noop, //click

    self.kq, //transition
    noop, //tick
    function(){ gg.ctx.textAlign = "center"; self.textat("Great Work!",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    noop, //tick
    function(){ gg.ctx.textAlign = "center"; self.textat("Your farms might be using up the nutrition in the soil.",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.delay_next_state, //click

    function(){ gg.shop.livestock_btn.active = 1; }, //transition
    noop, //tick
    function(){ var b = gg.shop.livestock_btn; gg.ctx.textAlign = "left"; self.textat("<- Next, save up for some livestock. They might be able to help with that!",b.x+b.w+20,b.y+b.h/2); self.ctc(); }, //draw
    self.next_state, //click

    function(){ self.setquest("save up for some livestock");}, //transition
    function(){ return self.items_exist(ITEM_TYPE_POOP,1); }, //tick
    noop, //draw
    noop, //click

    noop, //transition
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var i = self.items_exist(ITEM_TYPE_POOP,1); gg.ctx.textAlign = "center"; self.onscreentextat("You can use waste from livestock to reintroduce nutrition to the ground.",i.x+i.w/2,i.y-i.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){ self.wash(); var i = self.items_exist(ITEM_TYPE_POOP,1); gg.ctx.textAlign = "center"; self.onscreentextat("(your townmembers will do this automatically)",i.x+i.w/2,i.y-i.h); self.ctc(); }, //draw
    self.next_state, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("Buy more houses to grow your town!",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return self.bits_hungry(1); }, //tick
    noop, //draw
    noop, //click

    self.dotakeover, //transition
    ffunc, //tick
    function(){self.textat("you've got a hungry boy",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    ffunc, //tick
    noop, //draw
    noop, //click
  ];

  self.state_funcs[self.state*4+0]();
}

