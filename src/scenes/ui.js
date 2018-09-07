var ENUM;
ENUM = 0;
var CARD_TYPE_NULL      = ENUM; ENUM++;
var CARD_TYPE_BIT       = ENUM; ENUM++;
var CARD_TYPE_HOME      = ENUM; ENUM++;
var CARD_TYPE_FARM      = ENUM; ENUM++;
var CARD_TYPE_LIVESTOCK = ENUM; ENUM++;
var CARD_TYPE_STORAGE   = ENUM; ENUM++;
var CARD_TYPE_ROAD      = ENUM; ENUM++;
var CARD_TYPE_DEMOLISH  = ENUM; ENUM++;
var CARD_TYPE_COUNT     = ENUM; ENUM++;

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
  self.bit_btn       = new ButtonBox(x,y,w,h,function(){ if(gg.money < farmbit_cost || gg.farmbits.length >= gg.b.tile_groups[TILE_TYPE_HOME].length) return; gg.money -= farmbit_cost; var c = gg.hand.add(CARD_TYPE_BIT); gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.home_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < home_cost)      return; gg.money -= home_cost;      var c = gg.hand.add(CARD_TYPE_HOME);      gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.farm_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < farm_cost)      return; gg.money -= farm_cost;      var c = gg.hand.add(CARD_TYPE_FARM);      gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.livestock_btn = new ButtonBox(x,y,w,h,function(){ if(gg.money < livestock_cost) return; gg.money -= livestock_cost; var c = gg.hand.add(CARD_TYPE_LIVESTOCK); gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.storage_btn   = new ButtonBox(x,y,w,h,function(){ if(gg.money < storage_cost)   return; gg.money -= storage_cost;   var c = gg.hand.add(CARD_TYPE_STORAGE);   gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.road_btn      = new ButtonBox(x,y,w,h,function(){ if(gg.money < road_cost)      return; gg.money -= road_cost;      var c = gg.hand.add(CARD_TYPE_ROAD);      gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.demolish_btn  = new ButtonBox(x,y,w,h,function(){ if(gg.money < demolish_cost)  return; gg.money -= demolish_cost;  var c = gg.hand.add(CARD_TYPE_DEMOLISH);  gg.hand.selected_card = c; gg.hand.selected_card_drag_t = min_card_drag_t; c.dragging = 1; }); y += h+10;
  self.money_btn     = new ButtonBox(x,y,w,h,function(){ gg.money += free_money; }); y += h+10;
  self.abandon_btn   = new ButtonBox(x,y,w,h,function(){ for(var i = 0; i < gg.farmbits.length; i++) gg.farmbits[i].abandon_job(); }); y += h+10;

  self.filter = function(filter)
  {
    if(gg.b.spewing_road) return;
    var check = true;
    if(check) check = !filter.filter(self.bit_btn);
    if(check) check = !filter.filter(self.home_btn);
    if(check) check = !filter.filter(self.farm_btn);
    if(check) check = !filter.filter(self.livestock_btn);
    if(check) check = !filter.filter(self.storage_btn);
    if(check) check = !filter.filter(self.road_btn);
    if(check) check = !filter.filter(self.demolish_btn);
    if(check) check = !filter.filter(self.money_btn);
    if(check) check = !filter.filter(self.abandon_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = gray;

    if(gg.money < farmbit_cost || gg.farmbits.length >= gg.b.tile_groups[TILE_TYPE_HOME].length) fillBox(self.bit_btn,gg.ctx);
    if(gg.money < home_cost)      fillBox(self.home_btn,gg.ctx);
    if(gg.money < farm_cost)      fillBox(self.farm_btn,gg.ctx);
    if(gg.money < livestock_cost) fillBox(self.livestock_btn,gg.ctx);
    if(gg.money < storage_cost)   fillBox(self.storage_btn,gg.ctx);
    if(gg.money < road_cost)      fillBox(self.road_btn,gg.ctx);
    if(gg.money < demolish_cost)  fillBox(self.demolish_btn,gg.ctx);

    gg.ctx.fillStyle = black;
    gg.ctx.fillText("$"+gg.money,10,30);

    strokeBox(self.bit_btn,gg.ctx);       gg.ctx.fillText("bit",                    self.bit_btn.x,       self.bit_btn.y+20);       gg.ctx.fillText("$"+farmbit_cost,   self.bit_btn.x,       self.bit_btn.y+30);
    gg.ctx.fillText(gg.farmbits.length+"/"+gg.b.tile_groups[TILE_TYPE_HOME].length, self.bit_btn.x,       self.bit_btn.y+self.bit_btn.h);
    strokeBox(self.home_btn,gg.ctx);      gg.ctx.fillText("home",                   self.home_btn.x,      self.home_btn.y+20);      gg.ctx.fillText("$"+home_cost,      self.home_btn.x,      self.home_btn.y+30);
    strokeBox(self.farm_btn,gg.ctx);      gg.ctx.fillText("farm",                   self.farm_btn.x,      self.farm_btn.y+20);      gg.ctx.fillText("$"+farm_cost,      self.farm_btn.x,      self.farm_btn.y+30);
    strokeBox(self.livestock_btn,gg.ctx); gg.ctx.fillText("livestock",              self.livestock_btn.x, self.livestock_btn.y+20); gg.ctx.fillText("$"+livestock_cost, self.livestock_btn.x, self.livestock_btn.y+30);
    strokeBox(self.storage_btn,gg.ctx);   gg.ctx.fillText("storage",                self.storage_btn.x,   self.storage_btn.y+20);   gg.ctx.fillText("$"+storage_cost,   self.storage_btn.x,   self.storage_btn.y+30);
    strokeBox(self.road_btn,gg.ctx);      gg.ctx.fillText("roadx"+roads_per_card,   self.road_btn.x,      self.road_btn.y+20);      gg.ctx.fillText("$"+road_cost,      self.road_btn.x,      self.road_btn.y+30);
    strokeBox(self.demolish_btn,gg.ctx);  gg.ctx.fillText("demolish",               self.demolish_btn.x,  self.demolish_btn.y+20);  gg.ctx.fillText("$"+demolish_cost,  self.demolish_btn.x,  self.demolish_btn.y+30);
    strokeBox(self.money_btn,gg.ctx);     gg.ctx.fillText("money",                  self.money_btn.x,     self.money_btn.y+20);     gg.ctx.fillText("+$"+free_money,    self.money_btn.x,     self.money_btn.y+30);
    strokeBox(self.abandon_btn,gg.ctx);   gg.ctx.fillText("abandon",                self.abandon_btn.x,   self.abandon_btn.y+20);
  }
}

var card = function()
{
  var self = this;

  self.ww = 100;
  self.wh = 200;
  self.wx = 0;
  self.wy = 0;

  self.wxv = 0;
  self.wyv = 0;

  self.type = CARD_TYPE_NULL;

  self.w = 0;
  self.h = 0;
  self.x = 0;
  self.y = 0;

  self.hover = function(evt)
  {
    if(gg.hand.hovered_card && gg.hand.hovered_card.wy < self.wy) return;
    gg.hand.hovered_card = self;
  }
  self.unhover = function()
  {
    if(gg.hand.hovered_card == self) gg.hand.hovered_card = 0;
  }

  self.dragStart = function(evt)
  {
    if(gg.hand.hovered_card != self) return 0;
    if(gg.b.spewing_road) return;
    gg.hand.selected_card = self;
    gg.hand.selected_card_drag_t = 0;
    gg.hand.im_hit = 1;
  }
  self.drag = function(evt)
  {
    if(gg.hand.selected_card != self) return;
    else gg.hand.dragging_evt = evt;
  }
  self.dragFinish = function(evt)
  {
    if(gg.hand.selected_card != self) return;
    else if(gg.hand.selected_card_drag_t < min_card_drag_t)
    {
      gg.hand.selected_card = 0;
      gg.hand.selected_card_drag_t = 0;
      gg.hand.dragging_evt = 0;
    }
    else
    {
      gg.hand.released_card = gg.hand.selected_card;
      gg.hand.released_evt = gg.hand.dragging_evt;
      gg.hand.selected_card = 0;
      gg.hand.selected_card_drag_t = 0;
      gg.hand.dragging_evt = 0;
    }
  }

  self.tick = function()
  {
  }

  self.draw = function()
  {
    gg.ctx.fillStyle = white;
    fillBox(self,gg.ctx);
    gg.ctx.fillStyle = black;
    gg.ctx.strokeStyle = black;
    if(gg.hand.hovered_card == self) gg.ctx.strokeStyle = blue;
    if(gg.hand.selected_card == self)
    {
      var playable = false;
      if(gg.b.hover_t)
      {
        switch(self.type)
        {
          case CARD_TYPE_BIT:       playable = 1; break;
          case CARD_TYPE_HOME:      playable = buildability_check(TILE_TYPE_HOME,      gg.b.hover_t.type); break;
          case CARD_TYPE_FARM:      playable = buildability_check(TILE_TYPE_FARM,      gg.b.hover_t.type); break;
          case CARD_TYPE_LIVESTOCK: playable = buildability_check(TILE_TYPE_LIVESTOCK, gg.b.hover_t.type); break;
          case CARD_TYPE_STORAGE:   playable = buildability_check(TILE_TYPE_STORAGE,   gg.b.hover_t.type); break;
          case CARD_TYPE_ROAD:      playable =(buildability_check(TILE_TYPE_ROAD,      gg.b.hover_t.type) || gg.b.hover_t.type == TILE_TYPE_ROAD); break;
          case CARD_TYPE_DEMOLISH:  playable = demolishability_check(gg.b.hover_t.type); break;
        }
      }
      if(playable) gg.ctx.strokeStyle = green;
      else gg.ctx.strokeStyle = red;
    }
    strokeBox(self,gg.ctx);
    switch(self.type)
    {
      case CARD_TYPE_BIT:       gg.ctx.fillText("Bit",       self.x+10,self.y+20); break;
      case CARD_TYPE_HOME:      gg.ctx.fillText("Home",      self.x+10,self.y+20); break;
      case CARD_TYPE_FARM:      gg.ctx.fillText("Farm",      self.x+10,self.y+20); break;
      case CARD_TYPE_LIVESTOCK: gg.ctx.fillText("Livestock", self.x+10,self.y+20); break;
      case CARD_TYPE_STORAGE:   gg.ctx.fillText("Storage",   self.x+10,self.y+20); break;
      case CARD_TYPE_ROAD:      gg.ctx.fillText("Road",      self.x+10,self.y+20); break;
      case CARD_TYPE_DEMOLISH:  gg.ctx.fillText("Demolish",  self.x+10,self.y+20); break;
    }
    /*
    gg.ctx.strokeStyle = green;
    var x = self.x+self.w/2;
    var y = self.y+self.h/2;
    drawArrow(x,y,x+(self.wxv*10),y-(self.wyv*10),10,gg.ctx);
    */
  }
}

var hand = function()
{
  var self = this;

  self.w = gg.canv.width;
  self.h = gg.canv.height;
  self.x = 0;
  self.y = 0;

  self.hovered_card = 0;
  self.selected_card = 0;
  self.selected_card_drag_t = 0;
  self.dragging_evt = 0;
  self.released_card = 0;
  self.released_evt = 0;

  self.cards = [];

  self.sortish = function() //1 pass bubble sort
  {
    for(var i = 0; i < self.cards.length-1; i++)
    {
      if(self.cards[i].wy < self.cards[i+1].wy)
      {
        var t = self.cards[i];
        self.cards[i] = self.cards[i+1];
        self.cards[i+1] = t;
      }
    }
  }

  self.add = function(type)
  {
    var c = new card();
    c.type = type;
    c.wx = 0;
    c.wy = 0;
    c.wxv = 10;
    c.wyv = 100;
    self.cards.push(c);
    return c;
  }

  self.destroy = function(c)
  {
    for(var i = 0; i < self.cards.length; i++)
      if(self.cards[i] == c) self.cards.splice(i,1);
  }

  self.filter_hover = function(hoverer)
  {
    for(var i = 0; i < self.cards.length; i++)
      hoverer.filter(self.cards[i]);
  }
  self.filter_drag = function(dragger)
  {
    self.im_hit = 0; //wow bogus signalling of cards
    for(var i = 0; i < self.cards.length; i++)
      dragger.filter(self.cards[i]);
    var im_hit = self.im_hit;
    self.im_hit = 0;
    return im_hit;
  }

  self.tick = function()
  {
    if(self.selected_card) self.selected_card_drag_t++;
    self.sortish();
    for(var i = 0; i < self.cards.length; i++)
    {
      var c = self.cards[i];
      c.wxv += (gg.canv.width/2-c.wx)*0.001;
           if(self.selected_card == c) c.wyv += (50-c.wy)*0.05;
      else if(self.hovered_card  == c) c.wyv += (30-c.wy)*0.01;
      else                             c.wyv += (20-c.wy)*0.005;
    }
    for(var i = 0; i < self.cards.length; i++)
    {
      var c = self.cards[i];
      for(var j = i+1; j < self.cards.length; j++)
      {
        var c2 = self.cards[j];
        var dx = (c2.wx-c.wx);
        var dy = (c2.wy-c.wy);
        var d2 = dx*dx+dy*dy
        var d = sqrt(d2);
        dx /= d;
        dy /= d;
        dx *= (1/d2)*1000;
        dy *= (1/d2)*1000;
        c.wxv -= dx;
        c.wyv -= dy;
        c2.wxv += dx;
        c2.wyv += dy;
      }
    }
    for(var i = 0; i < self.cards.length; i++)
    {
      var c = self.cards[i];
      c.wxv *= 0.95;
      c.wyv *= 0.95;
      c.wxv = mind(c.wxv,10);
      c.wyv = mind(c.wyv,10);
      c.wx += c.wxv;
      c.wy += c.wyv;
      screenSpace(gg.ui_cam, gg.canv, c);
      c.tick();
    }
  }

  self.draw = function()
  {
    for(var i = 0; i < self.cards.length; i++)
      self.cards[i].draw();
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

  self.print_item = function(it, x, y)
  {
    gg.ctx.fillText("ITEM",x,y);
    y += vspace;
    str = "Type: ";
    switch(it.type)
    {
      case ITEM_TYPE_NULL:  str += "null";  break;
      case ITEM_TYPE_FOOD:  str += "food";  break;
      case ITEM_TYPE_POOP:  str += "poop";  break;
      case ITEM_TYPE_COUNT: str += "count"; break;
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
      case JOB_TYPE_KICK:      str += "kick";      break;
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

