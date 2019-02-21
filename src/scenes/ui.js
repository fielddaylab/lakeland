var ENUM;
ENUM = 0;
var BUY_TYPE_NULL      = ENUM; ENUM++;
var BUY_TYPE_BIT       = ENUM; ENUM++;
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

var shop = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 100;
  self.h = 200;

  var x = self.x;
  var y = self.y+30;
  var w = 40;
  var h = 40;
  x += 10;
  y += 10;
  self.bit_btn       = new ButtonBox(x,y,w,h,function(){ if(gg.money < farmbit_cost || gg.farmbits.length >= gg.b.tile_groups[TILE_TYPE_HOME].length) return; gg.money -= farmbit_cost; self.selected_buy = BUY_TYPE_BIT; }); y += h+10;
  self.home_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < home_cost)      return; gg.money -= home_cost;      self.selected_buy = BUY_TYPE_HOME;      }); y += h+10;
  self.farm_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < farm_cost)      return; gg.money -= farm_cost;      self.selected_buy = BUY_TYPE_FARM;      }); y += h+10;
  self.livestock_btn = new ButtonBox(x,y,w,h,function(){ if(gg.money < livestock_cost) return; gg.money -= livestock_cost; self.selected_buy = BUY_TYPE_LIVESTOCK; }); y += h+10;
  self.storage_btn   = new ButtonBox(x,y,w,h,function(){ if(gg.money < storage_cost)   return; gg.money -= storage_cost;   self.selected_buy = BUY_TYPE_STORAGE;   }); y += h+10;
  self.processor_btn = new ButtonBox(x,y,w,h,function(){ if(gg.money < processor_cost) return; gg.money -= processor_cost; self.selected_buy = BUY_TYPE_PROCESSOR; }); y += h+10;
  self.road_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < road_cost)      return; gg.money -= road_cost;      self.selected_buy = BUY_TYPE_ROAD;      }); y += h+10;
  self.demolish_btn  = new ButtonBox(x,y,w,h,function(){ if(gg.money < demolish_cost)  return; gg.money -= demolish_cost;  self.selected_buy = BUY_TYPE_DEMOLISH;  }); y += h+10;
  self.money_btn     = new ButtonBox(x,y,w,h,function(){ gg.money += free_money; }); y += h+10;
  self.abandon_btn   = new ButtonBox(x,y,w,h,function(){ for(var i = 0; i < gg.farmbits.length; i++) gg.farmbits[i].abandon_job(); }); y += h+10;
  self.refund_btn   = new ButtonBox(x,y,w,h,function(){
    switch(self.selected_buy)
    {
      case BUY_TYPE_BIT:       gg.money += farmbit_cost; break;
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
  }); y += h+10;

  self.selected_buy = 0;

  self.bit_btn.active = 1;
  self.home_btn.active = 1;
  self.farm_btn.active = 1;
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
      if(check && self.bit_btn.active)       check = !filter.filter(self.bit_btn);
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

    if(!self.selected_buy)
    {
      if(self.bit_btn.active       && gg.money < farmbit_cost || gg.farmbits.length >= gg.b.tile_groups[TILE_TYPE_HOME].length) fillBox(self.bit_btn,gg.ctx);
      if(self.home_btn.active      && gg.money < home_cost)      fillBox(self.home_btn,gg.ctx);
      if(self.farm_btn.active      && gg.money < farm_cost)      fillBox(self.farm_btn,gg.ctx);
      if(self.livestock_btn.active && gg.money < livestock_cost) fillBox(self.livestock_btn,gg.ctx);
      if(self.storage_btn.active   && gg.money < storage_cost)   fillBox(self.storage_btn,gg.ctx);
      if(self.processor_btn.active && gg.money < processor_cost) fillBox(self.processor_btn,gg.ctx);
      if(self.road_btn.active      && gg.money < road_cost)      fillBox(self.road_btn,gg.ctx);
      if(self.demolish_btn.active  && gg.money < demolish_cost)  fillBox(self.demolish_btn,gg.ctx);
    }

    gg.ctx.fillStyle = black;
    gg.ctx.fillText("$"+gg.money,10,30);

    if(!self.selected_buy)
    {
      if(self.bit_btn.active)       { strokeBox(self.bit_btn,gg.ctx);       gg.ctx.fillText("bit",                    self.bit_btn.x,       self.bit_btn.y+20);       gg.ctx.fillText("$"+farmbit_cost,   self.bit_btn.x,       self.bit_btn.y+30); }
      gg.ctx.fillText(gg.farmbits.length+"/"+gg.b.tile_groups[TILE_TYPE_HOME].length, self.bit_btn.x,       self.bit_btn.y+self.bit_btn.h);
      if(self.home_btn.active)      { strokeBox(self.home_btn,gg.ctx);      gg.ctx.fillText("home",                   self.home_btn.x,      self.home_btn.y+20);      gg.ctx.fillText("$"+home_cost,      self.home_btn.x,      self.home_btn.y+30); }
      if(self.farm_btn.active)      { strokeBox(self.farm_btn,gg.ctx);      gg.ctx.fillText("farm",                   self.farm_btn.x,      self.farm_btn.y+20);      gg.ctx.fillText("$"+farm_cost,      self.farm_btn.x,      self.farm_btn.y+30); }
      if(self.livestock_btn.active) { strokeBox(self.livestock_btn,gg.ctx); gg.ctx.fillText("livestock",              self.livestock_btn.x, self.livestock_btn.y+20); gg.ctx.fillText("$"+livestock_cost, self.livestock_btn.x, self.livestock_btn.y+30); }
      if(self.storage_btn.active)   { strokeBox(self.storage_btn,gg.ctx);   gg.ctx.fillText("storage",                self.storage_btn.x,   self.storage_btn.y+20);   gg.ctx.fillText("$"+storage_cost,   self.storage_btn.x,   self.storage_btn.y+30); }
      if(self.processor_btn.active) { strokeBox(self.processor_btn,gg.ctx); gg.ctx.fillText("processor",              self.processor_btn.x, self.processor_btn.y+20); gg.ctx.fillText("$"+processor_cost, self.processor_btn.x, self.processor_btn.y+30); }
      if(self.road_btn.active)      { strokeBox(self.road_btn,gg.ctx);      gg.ctx.fillText("roadx"+roads_per_buy,    self.road_btn.x,      self.road_btn.y+20);      gg.ctx.fillText("$"+road_cost,      self.road_btn.x,      self.road_btn.y+30); }
      if(self.demolish_btn.active)  { strokeBox(self.demolish_btn,gg.ctx);  gg.ctx.fillText("demolish",               self.demolish_btn.x,  self.demolish_btn.y+20);  gg.ctx.fillText("$"+demolish_cost,  self.demolish_btn.x,  self.demolish_btn.y+30); }
      if(self.money_btn.active)     { strokeBox(self.money_btn,gg.ctx);     gg.ctx.fillText("money",                  self.money_btn.x,     self.money_btn.y+20);     gg.ctx.fillText("+$"+free_money,    self.money_btn.x,     self.money_btn.y+30); }
      if(self.abandon_btn.active)   { strokeBox(self.abandon_btn,gg.ctx);   gg.ctx.fillText("abandon",                self.abandon_btn.x,   self.abandon_btn.y+20); }
    }
    else
      if(self.refund_btn.active) { strokeBox(self.refund_btn,gg.ctx); gg.ctx.fillText("refund", self.refund_btn.x, self.refund_btn.y+20); }
  }
}

var inspector = function()
{
  var self = this;
  self.w = 100;
  self.h = 200;
  self.x = gg.canv.width-self.w-10;
  self.y = 0;

  self.detailed = 0;
  self.detailed_type = INSPECTOR_CONTENT_NULL;
  self.quick = 0;
  self.quick_type = INSPECTOR_CONTENT_NULL;

  var vspace = 20;

  self.print_tile = function(t, x, y)
  {
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
      case TILE_TYPE_EXPORT:    str += "export";    break;
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
      case TILE_TYPE_EXPORT:
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

  self.print_item = function(it, x, y)
  {
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

  self.print_farmbit = function(b, x, y)
  {
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
    var x = self.x;
    var y = self.y;
    gg.ctx.fillStyle = black;

    x += 10;
    y += vspace;
    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL: gg.ctx.fillText("(nothing selected)",x,y); y += vspace; break;
      case INSPECTOR_CONTENT_TILE:    y += self.print_tile(self.detailed,x,y); break;
      case INSPECTOR_CONTENT_ITEM:  y += self.print_item(self.detailed,x,y); break;
      case INSPECTOR_CONTENT_FARMBIT: y += self.print_farmbit(self.detailed,x,y); break;
    }
    switch(self.quick_type)
    {
      case INSPECTOR_CONTENT_NULL: gg.ctx.fillText("(nothing hovered)",x,y); y += vspace; break;
      case INSPECTOR_CONTENT_TILE:    y += self.print_tile(self.quick,x,y); break;
      case INSPECTOR_CONTENT_ITEM:  y += self.print_item(self.quick,x,y); break;
      case INSPECTOR_CONTENT_FARMBIT: y += self.print_farmbit(self.quick,x,y); break;
    }
  }
}

var ticker = function()
{
  var self = this;
  self.x = 100;
  self.y = 0;
  self.w = 0;
  self.h = 0;

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
    var y = 0;
    for(var i = 0; i < self.feed.length; i++)
    {
      var index = self.feed.length-1-i;
      var t = self.feed_t[index]/feed_t_max;
      var a = min(1,2-(2*t));
      var r = floor(max(0,1-t*5)*255);
      gg.ctx.fillStyle = "rgba("+r+",0,0,"+a+")";
      gg.ctx.fillText(self.feed[index],self.x+10,self.y+10+y);
      y += 20;
    }
    gg.ctx.fillStyle = black;
  }
}

var tutorial = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = gg.canv.width;
  self.h = gg.canv.height;

  self.state = 0;
  self.state_t++;

  self.state_ticks = [
    function(){
    }
  ];

  self.state_draws = [
    function(){
    }
  ];

  self.tick = function()
  {
    self.state_t++;
    self.state_ticks[self.state]();
  }

  self.draw = function()
  {
    self.state_draws[self.state]();
  }

}

