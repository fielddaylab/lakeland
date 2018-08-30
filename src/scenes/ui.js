var ENUM;
ENUM = 0;
var PALETTE_NULL      = ENUM; ENUM++;
var PALETTE_PROD      = ENUM; ENUM++;
var PALETTE_FARM      = ENUM; ENUM++;
var PALETTE_LIVESTOCK = ENUM; ENUM++;
var PALETTE_STORAGE   = ENUM; ENUM++;
var PALETTE_COUNT     = ENUM; ENUM++;

ENUM = 0;
var INSPECTOR_CONTENT_NULL    = ENUM; ENUM++;
var INSPECTOR_CONTENT_FARMBIT = ENUM; ENUM++;
var INSPECTOR_CONTENT_ITEM  = ENUM; ENUM++;
var INSPECTOR_CONTENT_TILE    = ENUM; ENUM++;
var INSPECTOR_CONTENT_COUNT   = ENUM; ENUM++;

var palette = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 100;
  self.h = 200;

  self.palette = PALETTE_PROD;

  var x = self.x;
  var y = self.y;
  var w = 40;
  var h = 40;
  x += 10;
  y += 10;
  self.prod_btn      = new ButtonBox(x,y,w,h,function(){ self.palette = PALETTE_PROD;      }); y += h+10;
  self.farm_btn      = new ButtonBox(x,y,w,h,function(){ self.palette = PALETTE_FARM;      }); y += h+10;
  self.livestock_btn = new ButtonBox(x,y,w,h,function(){ self.palette = PALETTE_LIVESTOCK; }); y += h+10;
  self.storage_btn   = new ButtonBox(x,y,w,h,function(){ self.palette = PALETTE_STORAGE;   }); y += h+10;

  self.filter = function(filter)
  {
    var check = true;
    if(check) check = !filter.filter(self.prod_btn);
    if(check) check = !filter.filter(self.farm_btn);
    if(check) check = !filter.filter(self.livestock_btn);
    if(check) check = !filter.filter(self.storage_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = gray;
    switch(self.palette)
    {
      case PALETTE_PROD:      fillBox(self.prod_btn,gg.ctx);      break;
      case PALETTE_FARM:      fillBox(self.farm_btn,gg.ctx);      break;
      case PALETTE_LIVESTOCK: fillBox(self.livestock_btn,gg.ctx); break;
      case PALETTE_STORAGE:   fillBox(self.storage_btn,gg.ctx);   break;
    }
    gg.ctx.fillStyle = black;
    strokeBox(self.prod_btn,gg.ctx);      gg.ctx.fillText("examine",   self.prod_btn.x,      self.prod_btn.y+20);
    strokeBox(self.farm_btn,gg.ctx);      gg.ctx.fillText("farm",      self.farm_btn.x,      self.farm_btn.y+20);
    strokeBox(self.livestock_btn,gg.ctx); gg.ctx.fillText("livestock", self.livestock_btn.x, self.livestock_btn.y+20);
    strokeBox(self.storage_btn,gg.ctx);   gg.ctx.fillText("storage",   self.storage_btn.x,   self.storage_btn.y+20);
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
      case TILE_TYPE_NULL:      str += "null";  break;
      case TILE_TYPE_LAND:      str += "land";  break;
      case TILE_TYPE_WATER:     str += "water"; break;
      case TILE_TYPE_SHORE:     str += "shore"; break;
      case TILE_TYPE_FARM:      str += "farm";  break;
      case TILE_TYPE_LIVESTOCK: str += "livestock";  break;
      case TILE_TYPE_STORAGE:   str += "storage";  break;
      case TILE_TYPE_COUNT:     str += "count"; break;
    }
    gg.ctx.fillText(str+" ("+t.tx+","+t.ty+")",x,y);
    y += vspace;
    str = "State: ";
    switch(t.state)
    {
      case TILE_STATE_NULL:               str += "null";       break;
      case TILE_STATE_FARM_UNPLANTED:     str += "unplanted";  break;
      case TILE_STATE_FARM_PLANTED:       str += "planted";    break;
      case TILE_STATE_FARM_GROWN:         str += "grown";      break;
      case TILE_STATE_LIVESTOCK_IDLE:     str += "unplanted";  break;
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
      case TILE_TYPE_WATER:
      case TILE_TYPE_SHORE:
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
      case TILE_TYPE_COUNT:
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

