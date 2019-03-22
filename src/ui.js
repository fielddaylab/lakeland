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

  self.pause_img = GenImg("assets/pause.png");
  self.play_img = GenImg("assets/play.png");
  self.speed_img = GenImg("assets/speed.png");

  self.pause_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 0; });
  self.play_btn  = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 1; DOUBLETIME = 0; });
  self.speed_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 1; DOUBLETIME = 1; });
  self.resize();

  self.pause_btn.active = 0;
  self.play_btn.active = 0;
  self.speed_btn.active = 0;

  self.filter = function(filter)
  {
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
    if(self.pause_btn.active) { if(RESUME_SIM)                 gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.pause_img,self.pause_btn,gg.ctx); }
    if(self.play_btn.active)  { if(!RESUME_SIM ||  DOUBLETIME) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.play_img, self.play_btn,gg.ctx); }
    if(self.speed_btn.active) { if(!RESUME_SIM || !DOUBLETIME) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.speed_img,self.speed_btn,gg.ctx); }
    gg.ctx.globalAlpha = 1;
  }
}

var nutrition_toggle = function()
{
  var self = this;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.w = 40*gg.stage.s_mod;
    self.h = self.w;
    self.x = gg.b.br_bound_tile.x+gg.b.br_bound_tile.w-self.w-self.pad;
    self.y = gg.b.br_bound_tile.y+gg.b.br_bound_tile.h-self.h-self.pad;

    setBB(self.toggle_btn, self.x,self.y,self.w,self.h);
  }

  self.toggle_btn = new ButtonBox(0,0,0,0,function(){ gg.b.nutrition_view = !gg.b.nutrition_view; });
  self.resize();

  self.toggle_btn.active = 0;

  self.filter = function(filter)
  {
    var check = true;
    if(check && self.toggle_btn.active) check = !filter.filter(self.toggle_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = gg.font_color;
    gg.ctx.fillStyle = gg.backdrop_color;

    if(self.toggle_btn.active)
    {
      fillRRect(self.toggle_btn.x,self.toggle_btn.y+self.toggle_btn.h/4,self.toggle_btn.w,self.toggle_btn.h/2,self.pad,gg.ctx);
      gg.ctx.stroke();
      var x = self.x;
      gg.ctx.fillStyle = red;
      if(gg.b.nutrition_view) { x = self.toggle_btn.x+self.toggle_btn.w/2; gg.ctx.fillStyle = green; }
      fillRRect(x,self.toggle_btn.y,self.toggle_btn.w/2,self.toggle_btn.h,self.pad,gg.ctx);
      gg.ctx.stroke();
    }
  }
}

var shop = function()
{
  var self = this;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;
    self.x = 0;
    self.y = 0;
    self.w = gg.b.tl_bound_tile.x-self.pad;
    self.h = gg.canvas.height;

    var btn_w = (self.w-self.pad*3)/2;
    var btn_h = self.h/8;
    var btn_x = self.pad;
    var btn_y = self.pad;

    self.font_size = self.pad*1.5;
    self.img_size = min(btn_w-self.pad*2,btn_h-self.pad*2-self.font_size*2);

    setBB(self.money_display, btn_x,btn_y,btn_w*2+self.pad,gg.b.tl_bound_tile.y-self.pad*2);
    btn_y = gg.b.tl_bound_tile.y+gg.b.tl_bound_tile.h;
    setBB(self.home_btn,      btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.farm_btn,      btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
    setBB(self.livestock_btn, btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.storage_btn,   btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
    setBB(self.processor_btn, btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.road_btn,      btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
    setBB(self.demolish_btn,  btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.money_btn,     btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
    setBB(self.abandon_btn,   btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.refund_btn,    btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
  }

  self.money_img = GenImg("assets/money.png");

  self.buy_cost = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:      return home_cost; break;
      case BUY_TYPE_FARM:      return farm_cost; break;
      case BUY_TYPE_LIVESTOCK: return livestock_cost; break;
      case BUY_TYPE_STORAGE:   return storage_cost; break;
      case BUY_TYPE_PROCESSOR: return processor_cost; break;
      case BUY_TYPE_ROAD:      return road_cost; break;
      case BUY_TYPE_DEMOLISH:  return demolish_cost; break;
      default: return 0; break;
    }
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
  self.refund_btn    = new ButtonBox(0,0,0,0,function(){ gg.money += self.buy_cost(self.selected_buy); self.selected_buy = 0; });
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

  self.draw_btn = function(bb,img,txt,active,tactive,cost,afford,buying)
  {
    if(!active) return;
    if(!afford || !tactive) gg.ctx.globalAlpha = 0.5;
    if(buying) gg.ctx.globalAlpha = 1;
    gg.ctx.fillStyle = gg.backdrop_color;
    fillRBB(bb,self.pad,gg.ctx);
    gg.ctx.strokeStyle = gg.font_color;
    gg.ctx.fillStyle = gg.font_color;
    if(buying) gg.ctx.stroke();

    gg.ctx.fillText(txt,      bb.x+bb.w/2, bb.y+bb.h-self.pad-self.font_size);
    gg.ctx.drawImage(img,bb.x+bb.w/2-self.img_size/2,bb.y+self.pad-self.img_size/2,self.img_size,self.img_size*1.5);
    if(cost)
    {
      if(!afford) gg.ctx.fillStyle = red;
      if(cost < 0) gg.ctx.fillText("+$"+(-cost), bb.x+bb.w/2, bb.y+bb.h-self.pad);
      else         gg.ctx.fillText("$"+cost, bb.x+bb.w/2, bb.y+bb.h-self.pad);
      gg.ctx.drawImage(self.money_img,bb.x+self.pad/2,bb.y+bb.h-self.pad*0.8-self.font_size,self.font_size,self.font_size);
    }
    gg.ctx.globalAlpha = 1;
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = gray;
    gg.ctx.textAlign = "left";

    gg.ctx.drawImage(self.money_img, self.money_display.x,self.money_display.y,self.money_display.h,self.money_display.h);
    gg.ctx.fillStyle = gg.font_color;
    var fs = self.money_display.h*0.7;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.fillText("$"+gg.money,self.money_display.x+self.money_display.h,self.money_display.y+self.money_display.h*4/5);
    gg.ctx.strokeStyle = gg.backdrop_color;
    var x = self.x+self.pad;
    var y = self.money_display.y+self.money_display.h+self.pad;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(x,y,self.x+self.w-self.pad,y,gg.ctx);

    var fs = self.font_size;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.textAlign = "center";
    self.draw_btn(self.home_btn,      home_img,      "Home",      self.home_btn.active,      !self.selected_buy, home_cost,      gg.money >= home_cost,      0);
    self.draw_btn(self.farm_btn,      farm_img,      "Farm",      self.farm_btn.active,      !self.selected_buy, farm_cost,      gg.money >= farm_cost,      0);
    self.draw_btn(self.livestock_btn, livestock_img, "Livestock", self.livestock_btn.active, !self.selected_buy, livestock_cost, gg.money >= livestock_cost, 0);
    self.draw_btn(self.storage_btn,   storage_img,   "Storage",   self.storage_btn.active,   !self.selected_buy, storage_cost,   gg.money >= storage_cost,   0);
    self.draw_btn(self.processor_btn, processor_img, "Processor", self.processor_btn.active, !self.selected_buy, processor_cost, gg.money >= processor_cost, 0);
    self.draw_btn(self.road_btn,      road_img,      "Road",      self.road_btn.active,      !self.selected_buy, road_cost,      gg.money >= road_cost,      0);
    self.draw_btn(self.demolish_btn,  skull_img,     "Demolish",  self.demolish_btn.active,  !self.selected_buy, demolish_cost,  gg.money >= demolish_cost,  0);

    self.draw_btn(self.money_btn,   coin_img,        "Free Money", self.money_btn.active,   !self.selected_buy, -free_money, 1, 0);
    self.draw_btn(self.abandon_btn, farmbit_imgs[0], "Abandon",    self.abandon_btn.active, !self.selected_buy, 0, 1, 0);
    self.draw_btn(self.refund_btn,  coin_img,        "Refund",     self.refund_btn.active,  self.selected_buy,  -self.buy_cost(self.selected_buy), 1, 0);

    gg.ctx.textAlign = "left";
  }
}

var inspector = function()
{
  var self = this;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;
    self.font_size = self.pad*1.5;
    self.x = gg.b.br_bound_tile.x+gg.b.br_bound_tile.w+self.pad;
    self.y = 0;
    self.w = gg.canvas.width-self.x;
    self.h = gg.canvas.height;

    self.vignette_x = self.x+self.pad*2;
    self.vignette_y = self.y+self.pad*2;
    self.vignette_w = self.w-self.pad*4;
    self.vignette_h = self.vignette_w;
  }
  self.resize();

  self.detailed = 0;
  self.detailed_type = INSPECTOR_CONTENT_NULL;
  self.quick = 0;
  self.quick_type = INSPECTOR_CONTENT_NULL;

  self.img_vignette = function(img,s)
  {
    if(s) gg.ctx.drawImage(img,self.vignette_x,self.vignette_y-self.vignette_h/2,self.vignette_w,self.vignette_h*3/2);
    else  gg.ctx.drawImage(img,self.vignette_x,self.vignette_y,self.vignette_w,self.vignette_h);
  }
  self.border_vignette = function()
  {
    gg.ctx.lineWidth = self.pad/2;
    strokeRRect(self.vignette_x,self.vignette_y,self.vignette_w,self.vignette_h,self.pad,gg.ctx);
  }

  self.draw_tile = function(t)
  {
    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    gg.ctx.fillText(gg.b.tile_name(t.type),x,y);
    y += self.pad;

    gg.ctx.strokeStyle = gg.backdrop_color;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(self.x+self.pad,y,self.x+self.w-self.pad,y,gg.ctx);

    y += self.pad+self.font_size;
    switch(t.type)
    {
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
        break;
      case TILE_TYPE_HOME:
      {
        switch(t.state)
        {
          case TILE_STATE_HOME_VACANT:   gg.ctx.fillText("VACANT",x,y); break;
          case TILE_STATE_HOME_OCCUPIED:
          {
            var l = gg.farmbits;
            var b = 0;
            for(var i = 0; i < l.length; l++) if(l[i].home == t) b = l[i];
            gg.ctx.fillText("Owner: "+b.name,x,y);
          }
          break;
        }
      }
      case TILE_TYPE_FARM:
      {
        switch(t.state)
        {
          case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillText("Needs Water",x,y); break;
          case TILE_STATE_FARM_PLANTED: gg.ctx.fillText("Growth: "+floor(t.val*100/farm_nutrition_req)+"%",x,y); break;
          case TILE_STATE_FARM_GROWN: gg.ctx.fillText("Ready for Harvest!",x,y); break;
        }
        y += self.pad+self.font_size;
      }
        break;
      case TILE_TYPE_LIVESTOCK:
        break;
      case TILE_TYPE_STORAGE:
      {
        gg.ctx.fillText("val: "+t.val,x,y);
        y += self.pad+self.font_size;
        gg.ctx.fillText("withdraw_lock: "+t.withdraw_lock,x,y);
        y += self.pad+self.font_size;
        gg.ctx.fillText("deposit_lock: "+t.deposit_lock,x,y);
        y += self.pad+self.font_size;
      }
        break;
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_COUNT:
        break;
    }
    gg.ctx.fillText("Nutrition: "+floor(clamp(0,1,t.nutrition)*100)+"%",x,y);
    y += self.pad+self.font_size;
    self.img_vignette(gg.b.tile_img(t.og_type),1);
    self.img_vignette(gg.b.tile_img(t.type),1);
    self.border_vignette();

    return y;
  }

  self.draw_item = function(it)
  {
    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    gg.ctx.fillText(gg.b.item_name(it.type),x,y);
    y += self.pad;

    gg.ctx.strokeStyle = gg.backdrop_color;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(self.x+self.pad,y,self.x+self.w-self.pad,y,gg.ctx);

    if(it.sale)
    {
    gg.ctx.fillText("Marked for Sale",x,y);
    y += self.pad+self.font_size;
    }

    self.img_vignette(gg.b.tile_img(it.tile.type),1);
    self.img_vignette(gg.b.item_img(it.type),1);
    self.border_vignette();
    return y;
  }

  self.draw_farmbit = function(b)
  {
    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    gg.ctx.fillText(b.name,x,y);
    y += self.pad;

    gg.ctx.strokeStyle = gg.backdrop_color;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(self.x+self.pad,y,self.x+self.w-self.pad,y,gg.ctx);

    y += self.pad+self.font_size;
    str = "Status: "+gg.b.job_name(b.job_type);
    gg.ctx.fillText(str,x,y);
    y += self.pad+self.font_size;

    var sy = y;
    x = self.x;
    gg.ctx.textAlign = "left";

    gg.ctx.fillText("Fullness:",x,y);
    y += self.pad+self.font_size;
    gg.ctx.fillText("Energy:",x,y);
    y += self.pad+self.font_size;
    gg.ctx.fillText("Joy:",x,y);
    y += self.pad+self.font_size;
    gg.ctx.fillText("Fulfillment:",x,y);
    y += self.pad+self.font_size;

    y = sy;
    x = self.x+self.w-self.pad;
    gg.ctx.textAlign = "right";

    switch(b.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.fullness*10)+"/10",x,y);
    y += self.pad+self.font_size;

    switch(b.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.energy*10)+"/10",x,y);
    y += self.pad+self.font_size;

    switch(b.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.joy*10)+"/10",x,y);
    y += self.pad+self.font_size;

    switch(b.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.fulfillment*10)+"/10",x,y);
    y += self.pad+self.font_size;

    y += self.pad+self.font_size;

    self.img_vignette(b.last_img,1);
    self.border_vignette();
    return y;
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    gg.ctx.fillStyle = black;

    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL: gg.ctx.fillText("(nothing selected)",self.x+self.pad,self.y+self.pad); break;
      case INSPECTOR_CONTENT_TILE:    self.draw_tile(self.detailed); break;
      case INSPECTOR_CONTENT_ITEM:    self.draw_item(self.detailed); break;
      case INSPECTOR_CONTENT_FARMBIT: self.draw_farmbit(self.detailed); break;
    }
    gg.ctx.textAlign = "left";

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
    gg.ctx.font = gg.font_size+"px "+gg.font;
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
    gg.ctx.font = gg.font_size+"px "+gg.font;
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

    function(){ if(gg.b.visit_t < 800) gg.b.visit_t = 800; }, //transition
    function(){ return self.bits_exist(1); }, //tick
    function(){ var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_HOME][0]); gg.ctx.textAlign = "center"; var dots = ""; if(self.state_t%10 > 6) dots = ".."; else if(self.state_t%10 > 3) dots = "."; self.textat("Waiting."+dots,t.x+t.w/2,t.y-t.h); }, //draw
    noop, //click

    function(){ var f = gg.farmbits[0]; gg.inspector.detailed = f; gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT; self.dotakeover(); }, //transition
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

    function(){ gg.nutrition_toggle.toggle_btn.active = 1; }, //transition
    function(){ return gg.b.nutrition_view; }, //tick
    function(){ self.wash(); var b = gg.nutrition_toggle.toggle_btn; gg.ctx.textAlign = "center"; self.textat("Click to toggle nutrition view",b.x+b.w/2,b.y-b.h); }, //draw
    noop, //click

    self.dotakeover, //transition
    noop, //tick
    function(){ self.wash(); gg.ctx.textAlign = "center"; self.textat("The red represents the fertility of that soil.",gg.canvas.width/2,gg.canvas.height/2); self.ctc(); }, //draw
    self.next_state, //click

    noop, //transition
    function(){ return self.tiles_exist(TILE_TYPE_FARM,1); }, //tick
    function(){ gg.ctx.textAlign = "center"; self.textat("Place your farm on fertile grassland",gg.canvas.width/2,gg.canvas.height/2); }, //draw
    noop, //click

    noop, //transition
    noop, //tick
    function(){ var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_FARM][0]); var f = gg.farmbits[0]; gg.ctx.textAlign = "center"; self.textat(f.name+" will automatically manage the farm.",t.x+t.w/2,t.y-t.h); self.ctc(); }, //draw
    self.delay_next_state, //click

    noop, //transition
    function(){ return !gg.b.nutrition_view; }, //tick
    function(){ self.wash(); var b = gg.nutrition_toggle.toggle_btn; gg.ctx.textAlign = "center"; self.textat("(Click at anytime to toggle nutrition view)",b.x+b.w/2,b.y-b.h); }, //draw
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

