var ENUM;
ENUM = 0;
var BUY_TYPE_NULL       = ENUM; ENUM++;
var BUY_TYPE_HOME       = ENUM; ENUM++;
var BUY_TYPE_FOOD       = ENUM; ENUM++;
var BUY_TYPE_FARM       = ENUM; ENUM++;
var BUY_TYPE_FERTILIZER = ENUM; ENUM++;
var BUY_TYPE_LIVESTOCK  = ENUM; ENUM++;
var BUY_TYPE_SKIMMER    = ENUM; ENUM++;
var BUY_TYPE_SIGN       = ENUM; ENUM++;
var BUY_TYPE_ROAD       = ENUM; ENUM++;
var BUY_TYPE_COUNT      = ENUM; ENUM++;

ENUM = 0;
var INSPECTOR_CONTENT_NULL    = ENUM; ENUM++;
var INSPECTOR_CONTENT_FARMBIT = ENUM; ENUM++;
var INSPECTOR_CONTENT_ITEM    = ENUM; ENUM++;
var INSPECTOR_CONTENT_TILE    = ENUM; ENUM++;
var INSPECTOR_CONTENT_COUNT   = ENUM; ENUM++;

ENUM = 0;
var TEXT_TYPE_NULL    = ENUM; ENUM++;
var TEXT_TYPE_OBSERVE = ENUM; ENUM++;
var TEXT_TYPE_DISMISS = ENUM; ENUM++;
var TEXT_TYPE_DIRECT  = ENUM; ENUM++;
var TEXT_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var ADVISOR_TYPE_NULL     = ENUM; ENUM++;
var ADVISOR_TYPE_MAYOR    = ENUM; ENUM++;
var ADVISOR_TYPE_BUSINESS = ENUM; ENUM++;
var ADVISOR_TYPE_FARMER   = ENUM; ENUM++;
var ADVISOR_TYPE_COUNT    = ENUM; ENUM++;

var bias_nutrition = function(t)
{
  t = 1-t;
  t *= t;
  t *= t;
  t *= t;
  return 1-t;
}

var draw_switch = function(x,y,w,h,on)
{
  gg.ctx.strokeStyle = gg.font_color;
  gg.ctx.fillStyle = gg.backdrop_color;
  fillRRect(x,y+h/4,w,h/2,h/4,gg.ctx);
  gg.ctx.stroke();
  if(on) { x = x+w/2; gg.ctx.fillStyle = green; }
  else gg.ctx.fillStyle = red;
  fillRRect(x,y,w/2,h,h/4,gg.ctx);
  gg.ctx.stroke();
}

var draw_money_switch = function(x,y,w,h,on)
{
  if(on) gg.ctx.fillStyle = "#91B15D";
  else   gg.ctx.fillStyle = light_gray;
  fillRRect(x,y+h/4,w,h/2,h/4,gg.ctx);
  if(on) gg.ctx.drawImage(icon_money_img,x+w-h,y-h/4,h,h*1.25);
  else   gg.ctx.drawImage(icon_money_img,x,    y-h/4,h,h*1.25);
}

var mark_pbar = function(x,y,w,h,t)
{
  gg.ctx.strokeStyle = nutrition_color;
  var r = h/2;
  var tx = x+r+(w-r*2)*t;
       if(t >= 1) tx = x+2;
  else if(t <= 0) tx = x;
  drawLine(tx,y-r,tx,y+h+r,gg.ctx)
}

var draw_pbar = function(x,y,w,h,t)
{
  draw_custom_pbar(x,y,w,h,light_gray,gg.backdrop_color,t);
}

var draw_custom_pbar = function(x,y,w,h,bg,fg,t)
{
  var r = h/2;
  if(t >= 1)
  {
    gg.ctx.fillStyle = fg;
    fillRRect(x,y,w,h,r,gg.ctx);
    return;
  }
  gg.ctx.fillStyle = bg;
  fillRRect(x,y,w,h,r,gg.ctx);
  if(t <= 0) return;
  gg.ctx.fillStyle = fg;

  var tx = x+r+(w-r*2)*t;

  gg.ctx.beginPath();
  gg.ctx.moveTo(tx,y+h);
  gg.ctx.lineTo(x+r,y+h);
  gg.ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  gg.ctx.quadraticCurveTo(x,y,x+r,y);
  gg.ctx.lineTo(tx,y);
  gg.ctx.closePath();
  gg.ctx.fill();
}

var unlock_ui = function()
{
  gg.shop.unlock_all();
  gg.bar.unlock_all();
  gg.nutrition_toggle.toggle_btn.active = 1;
  gg.advisors.unlock_all();
}

var bar = function()
{
  var self = this;
  self.btnh = 0;
  self.btnw = 0;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.btnh = self.pad*3;
    self.btnw = self.btnh;

    self.w = self.btnw*4+self.pad*5;
    self.h = self.btnh+self.pad*2;
    self.x = gg.canvas.width/2-self.w/2;
    self.y = 0;

    var btnx = self.x+self.pad;
    var btny = self.y+self.pad;

    setBB(self.pause_btn, btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
    setBB(self.play_btn,  btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
    setBB(self.fast_btn,  btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
    setBB(self.vfast_btn, btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
  }

  self.pause_btn = new ButtonBox(0,0,0,0,function(){ if(gg.speed == SPEED_PAUSE) gg.speed = SPEED_PLAY;  else gg.speed = SPEED_PAUSE; });
  self.play_btn  = new ButtonBox(0,0,0,0,function(){ if(gg.speed == SPEED_PLAY)  gg.speed = SPEED_PAUSE; else gg.speed = SPEED_PLAY;  });
  self.fast_btn  = new ButtonBox(0,0,0,0,function(){ if(gg.speed == SPEED_FAST)  gg.speed = SPEED_PLAY;  else gg.speed = SPEED_FAST;  });
  self.vfast_btn = new ButtonBox(0,0,0,0,function(){ if(gg.speed == SPEED_VFAST) gg.speed = SPEED_PLAY;  else gg.speed = SPEED_VFAST; });
  self.resize();

  self.pause_btn.active = 0;
  self.play_btn.active = 0;
  self.fast_btn.active = 0;
  self.vfast_btn.active = 0;

  self.unlock_all = function()
  {
    self.pause_btn.active = 1;
    self.play_btn.active = 1;
    self.fast_btn.active = 1;
    self.vfast_btn.active = 1;
  }

  self.filter = function(filter)
  {
    var check = true;
    if(check && self.pause_btn.active) check = !filter.filter(self.pause_btn);
    if(check && self.play_btn.active)  check = !filter.filter(self.play_btn);
    if(check && self.fast_btn.active)  check = !filter.filter(self.fast_btn);
    if(check && self.vfast_btn.active) check = !filter.filter(self.vfast_btn);
    return !check;
  }

  self.click = function()
  {
  }

  self.draw = function()
  {
    if(!self.play_btn.active) return;
    var fs = gg.font_size;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.textAlign = "left";
    gg.ctx.globalAlpha = 1;

    gg.ctx.fillStyle = white;
    fillRRect(self.x,-self.pad,self.w,self.pad+self.h,self.pad,gg.ctx);
    if(self.pause_btn.active) { if(gg.speed != SPEED_PAUSE) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(pause_img,self.pause_btn,gg.ctx); }
    if(self.play_btn.active)  { if(gg.speed != SPEED_PLAY)  gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(play_img, self.play_btn, gg.ctx); }
    if(self.fast_btn.active)  { if(gg.speed != SPEED_FAST)  gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(fast_img, self.fast_btn,gg.ctx); }
    if(self.vfast_btn.active) { if(gg.speed != SPEED_VFAST) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(fast_img, self.vfast_btn,gg.ctx); }
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
    self.x = gg.canvas.width-self.w-self.pad;
    self.y = self.pad;

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

  self.draw = function()
  {
    gg.ctx.lineWidth = 2;
    if(self.toggle_btn.active)
      draw_switch(self.toggle_btn.x,self.toggle_btn.y,self.toggle_btn.w,self.toggle_btn.h,gg.b.nutrition_view);
  }

}

var shop = function()
{
  var self = this;

  self.transition_t = 10;

  self.open = 1;
  self.open_t = 0;
  self.keep_open = function()
  {
    self.open = 1;
    self.open_t = 0;
  }

  self.selected_buy = 0;
  self.selected_t = 0;
  self.deselect = function()
  {
    self.selected_buy = 0;
    self.selected_t = 0;
  }

  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;
    self.x = 0;
    self.w = gg.b.cbounds_x-self.pad;
    var btn_s = (self.w-self.pad*3)/2;
    self.h = self.pad+btn_s/2+self.pad+(btn_s+self.pad)*ceil(self.btns.length/2);
    self.y = gg.canvas.height-self.h-btn_s-self.pad*2;

    var btn_x = self.pad;
    var btn_y = self.y+self.pad;

    self.font_size = self.pad*1.5;
    self.img_size = min(btn_s-self.pad*2,btn_s-self.pad*2-self.font_size*2);

    setBB(self.money_btn, btn_x,btn_y,btn_s*2,btn_s/2);
    setBB(self.money_display, btn_x, btn_y, btn_s*2+self.pad, btn_s/2);
    setBB(self.tab, self.x+self.w-self.pad,self.y,btn_s/2+self.pad,btn_s/2);

    btn_x = self.pad;
    btn_y += btn_s/2+self.pad;
    setBB(self.cancel_btn, btn_x,btn_y,btn_s,btn_s);
    for(var i = 0; i < self.btns.length; i+=2)
    {
                                 setBB(self.btns[i],   btn_x,btn_y,btn_s,btn_s); btn_x += btn_s+self.pad;
      if(i+1 < self.btns.length) setBB(self.btns[i+1], btn_x,btn_y,btn_s,btn_s); btn_x = self.pad; btn_y += btn_s+self.pad;
    }

  }

  self.buy_btn = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return self.home_btn; break;
      case BUY_TYPE_FOOD:       return self.food_btn; break;
      case BUY_TYPE_FARM:       return self.farm_btn; break;
      case BUY_TYPE_FERTILIZER: return self.fertilizer_btn; break;
      case BUY_TYPE_LIVESTOCK:  return self.livestock_btn; break;
      case BUY_TYPE_SKIMMER:    return self.skimmer_btn; break;
      case BUY_TYPE_SIGN:       return self.sign_btn; break;
      case BUY_TYPE_ROAD:       return self.road_btn; break;
      default: return self.cancel_btn; break;
    }
  }
  self.buy_name = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return "Home"; break;
      case BUY_TYPE_FOOD:       return "Food"; break;
      case BUY_TYPE_FARM:       return "Farm"; break;
      case BUY_TYPE_FERTILIZER: return "Fertilizer"; break;
      case BUY_TYPE_LIVESTOCK:  return "Dairy"; break;
      case BUY_TYPE_SKIMMER:    return "Skim Lake"; break;
      case BUY_TYPE_SIGN:       return "Sign"; break;
      case BUY_TYPE_ROAD:       return "Road x10"; break;
      default: return "BROKEN"; break;
    }
  }
  self.buy_description = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return "A Home"; break;
      case BUY_TYPE_FOOD:       return "A Food"; break;
      case BUY_TYPE_FARM:       return "A Farm"; break;
      case BUY_TYPE_FERTILIZER: return "A Fertilizer"; break;
      case BUY_TYPE_LIVESTOCK:  return "A Dairy"; break;
      case BUY_TYPE_SKIMMER:    return "A Skim Lake"; break;
      case BUY_TYPE_SIGN:       return "A Sign"; break;
      case BUY_TYPE_ROAD:       return "A Road x10"; break;
      default: return "BROKEN"; break;
    }
  }
  self.buy_img = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return tile_home_img; break;
      case BUY_TYPE_FOOD:       return tile_food_img; break;
      case BUY_TYPE_FARM:       return tile_farm_img; break;
      case BUY_TYPE_FERTILIZER: return tile_fertilizer_img; break;
      case BUY_TYPE_LIVESTOCK:  return tile_livestock_img; break;
      case BUY_TYPE_SKIMMER:    return tile_bloom_img; break;
      case BUY_TYPE_SIGN:       return tile_sign_img; break;
      case BUY_TYPE_ROAD:       return tile_road_img; break;
      default: return tile_land_img; break;
    }
  }
  self.buy_cost = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return home_cost; break;
      case BUY_TYPE_FOOD:       return food_cost; break;
      case BUY_TYPE_FARM:       return farm_cost; break;
      case BUY_TYPE_FERTILIZER: return fertilizer_cost; break;
      case BUY_TYPE_LIVESTOCK:  return livestock_cost; break;
      case BUY_TYPE_SKIMMER:    return skimmer_cost; break;
      case BUY_TYPE_SIGN:       return sign_cost; break;
      case BUY_TYPE_ROAD:       return road_cost; break;
      default: return 0; break;
    }
  }


  self.unlock_all = function()
  {
    for(var i = 0; i < self.btns.length; i++)
      self.btns[i].active = 1;
  }

  self.select = function(buy)
  {
    self.selected_buy = buy;
    self.selected_t = 0;
  }

  self.confirm_buy = function()
  {
    var c = self.buy_cost(self.selected_buy);
    if(gg.money < c) return 0;
    gg.money -= c;
    self.deselect();
    return 1;
  }

  self.money_display = new BB();
  self.tab = new ButtonBox(0,0,0,0,function(){self.open = !self.open; self.open_t = 0;});
  var b;
  self.btns = [];
  for(var i = BUY_TYPE_NULL+1; i < BUY_TYPE_COUNT; i++)
  {
    b = new ButtonBox(0,0,0,0,(function(i){return function(){ self.select(i); }})(i));
    b.buy = i;
    b.name = self.buy_name(i);
    b.description = self.buy_description(i);
    b.img = self.buy_img(i);
    b.cost = self.buy_cost(i);
    b.active = 0;

    switch(i)
    {
      case BUY_TYPE_HOME:       self.home_btn = b; break;
      case BUY_TYPE_FOOD:       self.food_btn = b; break;
      case BUY_TYPE_FARM:       self.farm_btn = b; break;
      case BUY_TYPE_FERTILIZER: self.fertilizer_btn = b; break;
      case BUY_TYPE_LIVESTOCK:  self.livestock_btn = b; break;
      case BUY_TYPE_SKIMMER:    self.skimmer_btn = b; break;
      case BUY_TYPE_SIGN:       self.sign_btn = b; break;
      case BUY_TYPE_ROAD:       self.road_btn = b; break;
    }
    self.btns.push(b);
  }
  self.home_btn.active = 1;

  b = new ButtonBox(0,0,0,0,function(){ gg.money += free_money; });
  {
    self.money_btn = b;
    b.buy = BUY_TYPE_NULL;
    b.name = "Free";
    b.description = "A Free";
    b.img = tile_money_img;
    b.cost = -free_money;
    b.active = 0;
  }
  b = new ButtonBox(0,0,0,0,function(){ self.deselect(); });
  {
    self.cancel_btn = b;
    b.buy = BUY_TYPE_NULL;
    b.name = "Cancel";
    b.description = "A Cancel";
    b.img = tile_money_img;
    b.cost = 0;
    b.active = 1;
  }

  self.resize();

  self.filter = function(filter)
  {
    if(gg.b.spewing_road) return;
    var check = true;
    if(!self.selected_buy)
    {
      if(check) check = !filter.filter(self.tab);
      if(self.open)
      {
        for(var i = 0; i < self.btns.length; i++)
        {
          if(check && self.btns[i].active) check = !filter.filter(self.btns[i]);
        }
        if(check && self.money_btn.active) check = !filter.filter(self.money_btn);
      }
    }
    else
      if(check && self.cancel_btn.active) check = !filter.filter(self.cancel_btn);
    return !check;
  }

  self.tick = function()
  {
    self.open_t++;
    self.selected_t++;
    if(self.selected_buy) self.keep_open();
    if(self.open)
    {
      if(self.x < 1) self.x = lerp(self.x,0,0.15);
      else self.x = 0;
      if(self.open_t > 1000) { self.open = 0; self.open_t = 0; }
    }
    else
    {
      if(self.x > -self.w) self.x = lerp(self.x,-self.w,0.15);
      else self.x = -self.w;
    }
    self.tab.x = self.x+self.w-self.pad;
    self.money_display.x = self.x+self.pad;
  }

  self.draw_btn = function(bb,offx)
  {
    if(!bb.active) return;
    var old_x = bb.x;
    bb.x += self.x+offx;
    gg.ctx.fillStyle = gg.backdrop_color;
    fillRBB(bb,self.pad,gg.ctx);
    gg.ctx.fillStyle = gg.font_color;

    gg.ctx.fillText(bb.name,bb.x+bb.w/2, bb.y+bb.h-self.pad-self.font_size);
    gg.ctx.drawImage(bb.img,bb.x+bb.w/2-self.img_size/2,bb.y+self.pad-self.img_size/2,self.img_size,self.img_size*1.5);
    if(bb.cost)
    {
      if(gg.money < bb.cost) gg.ctx.fillStyle = red;
      if(bb.cost < 0) gg.ctx.fillText("+$"+(-bb.cost), bb.x+bb.w/2, bb.y+bb.h-self.pad);
      else            gg.ctx.fillText( "$"+  bb.cost , bb.x+bb.w/2, bb.y+bb.h-self.pad);
      gg.ctx.drawImage(icon_money_img,bb.x+self.pad/2,bb.y+bb.h-self.pad*0.8-self.font_size,self.font_size,self.font_size);
    }
    bb.x = old_x;
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    gg.ctx.strokeStyle = black;
    gg.ctx.globalAlpha = 1;

    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x-self.pad,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    //tab
    if(!self.selected_buy)
    {
      fillRRect(self.tab.x-self.pad,self.tab.y,self.tab.w+self.pad,self.tab.h,self.pad,gg.ctx);
      gg.ctx.textAlign = "center";
      gg.ctx.fillStyle = gg.font_color;
      if(self.open)
      {
        var fs = self.money_display.h*0.7;
        gg.ctx.font = fs+"px "+gg.font;
        gg.ctx.fillText("<",self.tab.x+self.tab.w/2,self.tab.y+self.tab.h*3/4);
      }
      else
      {
        var s = self.tab.w/2;
        gg.ctx.drawImage(icon_money_img,self.tab.x+(self.tab.w+self.pad-s)/2,self.tab.y+self.pad/2,s,s);
        var fs = self.money_display.h*0.3;
        gg.ctx.font = fs+"px "+gg.font;
        gg.ctx.fillText("Buy",self.tab.x+(self.tab.w+self.pad)/2,self.tab.y+self.tab.h*5/6);
      }
    }

    //money
    fs = self.money_display.h*0.7;
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.textAlign = "left";
    gg.ctx.drawImage(icon_money_img, self.money_display.x,self.money_display.y,self.money_display.h,self.money_display.h);
    gg.ctx.fillText("$"+gg.money,self.money_display.x+self.money_display.h,self.money_display.y+self.money_display.h*4/5);

    //stats?
    fs = self.money_display.h*0.2;
    gg.ctx.font = fs+"px "+gg.font;
    //gg.ctx.fillText(gg.farmbits.length+" farmers", self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*2);
    //gg.ctx.fillText(gg.hungry+" hungry",           self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*3);
    //gg.ctx.fillText(gg.food+" available food",     self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*4);

    //store
    var store_offx = 0;
    var description_offx = 0;
         if( self.selected_buy && self.selected_t < self.transition_t) { store_offx =  -  self.selected_t/self.transition_t *self.w; description_offx = (-1+self.selected_t/self.transition_t)*self.w; }
    else if(!self.selected_buy && self.selected_t < self.transition_t) { store_offx = (-1+self.selected_t/self.transition_t)*self.w; description_offx =  -  self.selected_t/self.transition_t *self.w; }
    if(!self.selected_buy || self.selected_t < self.transition_t)
    {
      var fs = self.font_size;
      gg.ctx.font = fs+"px "+gg.font;
      gg.ctx.textAlign = "center";
      for(var i = 0; i < self.btns.length; i++)
        self.draw_btn(self.btns[i],store_offx);
    }

    //description
    if(self.selected_buy || self.selected_t < self.transition_t)
    {
      var fs = self.font_size;
      gg.ctx.font = fs+"px "+gg.font;
      gg.ctx.textAlign = "center";
      self.draw_btn(self.cancel_btn, description_offx);
      gg.ctx.textAlign = "left";
      var x = self.x+description_offx+self.pad;
      var y = self.cancel_btn.y+self.cancel_btn.h+fs*2;
      gg.ctx.fillText(self.buy_name(self.selected_buy), x, y); y += fs;
      gg.ctx.fillText(self.buy_description(self.selected_buy), x, y); y += fs;
      if(gg.money < self.buy_cost(self.selected_buy)) gg.ctx.fillStyle = red;
      gg.ctx.fillText("$"+self.buy_cost(self.selected_buy), x, y); y += fs;
    }

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
    self.title_font_size = self.pad*2;
    self.subtitle_font_size = self.pad*1;
    self.x = gg.b.cbounds_x+gg.b.cbounds_w+self.pad*2;
    self.w = gg.canvas.width-self.x;
    self.y = self.pad+gg.stage.s_mod*50;
    self.h = gg.canvas.height-self.y-self.pad;

    var y = self.y;
    y += self.pad*2;

    self.vignette_x = self.x+self.pad*2;
    self.vignette_y = y;
    self.vignette_w = self.w-self.pad*4;
    self.vignette_h = self.vignette_w;

    y += self.vignette_h;
    y += self.pad;

    y += self.title_font_size;
    self.title_y = y;
    y += self.pad;

    y += self.subtitle_font_size;
    self.subtitle_y = y;
    y += self.pad;

    self.title_line_y = y;
    y += self.pad;

    var start_y = y;
    self.tile_ui = [];
    self.item_ui = [];
    var u;

    {
      u = {};
      self.tile_ui[TILE_TYPE_LAND]   = u;
      self.tile_ui[TILE_TYPE_SHORE]  = u;
      self.tile_ui[TILE_TYPE_ROCK]   = u;
      self.tile_ui[TILE_TYPE_FOREST] = u;
      self.tile_ui[TILE_TYPE_LAKE]   = u;
      self.tile_ui[TILE_TYPE_HOME]   = u;
      self.tile_ui[TILE_TYPE_SIGN]   = u;
      self.tile_ui[TILE_TYPE_ROAD]   = u;
      self.tile_ui[TILE_TYPE_GRAVE]  = u;
      y = start_y;

      y += self.font_size;
      u.nutrition_y = y;
      y += self.pad;
      u.nutrition_bar_y = y;
      y += self.pad;
      y += self.pad;

      y += self.font_size;
      u.fertilizer_y = y;
      y += self.pad;
      u.fertilizer_bar_y = y;
      y += self.pad;
      y += self.pad;
    }

    {
      u = {};
      self.tile_ui[TILE_TYPE_FARM] = u;
      y = start_y;

      y += self.font_size;
      u.produce_y = y;
      y += self.pad;

      u.produce_line_y = y;
      y += self.pad;

      y += self.font_size;
      u.export_y = y;
      y += self.pad;

      u.autosell_w = (self.w-self.pad*2)/4
      u.autosell_0_x = self.x+self.pad+u.autosell_w;
      u.autosell_1_x = u.autosell_0_x+u.autosell_w;
      u.autosell_2_x = u.autosell_1_x+u.autosell_w;
      u.autosell_3_x = u.autosell_2_x+u.autosell_w;

      u.autosell_h = self.pad*3;
      u.autosell_0_y = y;
      y += u.autosell_h;
      y += self.pad;
      u.autosell_1_y = y;
      y += u.autosell_h;
      y += self.pad;

      u.nutrition_border_y = y;
      y += self.pad;

      y += self.font_size;
      u.growth_y = y;
      y += self.pad;
      u.growth_bar_y = y;
      y += self.pad;
      y += self.pad;

      y += self.font_size;
      u.fertilizer_y = y;
      y += self.pad;
      u.fertilizer_bar_y = y;
      y += self.pad;
      y += self.pad;

      y += self.font_size;
      u.nutrition_y = y;
      y += self.pad;
      u.nutrition_bar_y = y;
      y += self.pad;
      y += self.pad;
    }

    {
      u = {};
      self.tile_ui[TILE_TYPE_LIVESTOCK] = u;
      y = start_y;

      y += self.font_size;
      u.produce_y = y;
      y += self.pad;

      u.produce_line_y = y;
      y += self.pad;

      y += self.font_size;
      u.export_y = y;
      y += self.pad;

      u.autosell_w = (self.w-self.pad*2)/3
      u.autosell_0_x = self.x+self.pad+(self.w-self.pad*2)/4;
      u.autosell_1_x = u.autosell_0_x+u.autosell_w;
      u.autosell_2_x = u.autosell_1_x+u.autosell_w;

      u.autosell_h = self.pad*3;
      u.autosell_0_y = y;
      y += u.autosell_h;
      y += self.pad;
      u.autosell_1_y = y;
      y += u.autosell_h;
      y += self.pad;

      y += self.font_size;
      u.nutrition_y = y;
      y += self.pad;
      u.nutrition_bar_y = y;
      y += self.pad;
      y += self.pad;

      y += self.font_size;
      u.fertilizer_y = y;
      y += self.pad;
      u.fertilizer_bar_y = y;
      y += self.pad;
      y += self.pad;

      y += self.font_size;
      u.feed_y = y;
      y += self.pad;
      u.feed_bar_y = y;
      y += self.pad;
      y += self.pad;
    }

    {
      u = {};
      self.item_ui[ITEM_TYPE_FOOD] = u;
      y = start_y;

      u.switch_w = (self.w-self.pad*2)/4
      u.switch_0_x = self.x+self.pad+u.switch_w;
      u.switch_1_x = u.switch_0_x+u.switch_w;
      u.switch_2_x = u.switch_1_x+u.switch_w;
      u.switch_3_x = u.switch_2_x+u.switch_w;

      y += self.font_size;
      u.switch_y = y;
      y += self.pad;
      u.switch_y = y;
      u.switch_h = self.pad*3;
      y += u.switch_h;
      y += self.pad;
    }

    {
      u = {};
      self.item_ui[ITEM_TYPE_WATER]    = u;
      self.item_ui[ITEM_TYPE_POOP]     = u;
      self.item_ui[ITEM_TYPE_MILK]     = u;
      y = start_y;

      u.switch_w = (self.w-self.pad*2)/3
      u.switch_0_x = self.x+self.pad+(self.w-self.pad*2)/4;
      u.switch_1_x = u.switch_0_x+u.switch_w;
      u.switch_2_x = u.switch_1_x+u.switch_w;

      y += self.font_size;
      u.switch_y = y;
      y += self.pad;
      u.switch_y = y;
      u.switch_h = self.pad*3;
      y += u.switch_h;
      y += self.pad;
    }

  }
  self.resize();

  self.detailed = 0;
  self.detailed_type = INSPECTOR_CONTENT_NULL;
  self.known_nutrition = 0;
  self.nutrition_delta_t = 0;
  self.nutrition_delta_d = 0;
  self.quick = 0;
  self.quick_type = INSPECTOR_CONTENT_NULL;

  self.line = function(y)
  {
    gg.ctx.strokeStyle = gg.backdrop_color;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(self.x,y,self.x+self.w,y,gg.ctx);
  }

  self.img_vignette = function(img,s)
  {
    if(s) gg.ctx.drawImage(img,self.vignette_x,self.vignette_y-self.vignette_h/4,self.vignette_w,self.vignette_h*5/4);
    else  gg.ctx.drawImage(img,self.vignette_x,self.vignette_y,self.vignette_w,self.vignette_h);
  }
  self.border_vignette = function()
  {
    gg.ctx.lineWidth = self.pad/2;
    strokeRRect(self.vignette_x,self.vignette_y,self.vignette_w,self.vignette_h,self.pad,gg.ctx);
  }

  self.deselect = function()
  {
    self.detailed = 0;
    self.detailed_type = INSPECTOR_CONTENT_NULL;
  }
  self.select_tile = function(t)
  {
    self.detailed = t;
    self.detailed_type = INSPECTOR_CONTENT_TILE;
    self.known_nutrition = floor(t.nutrition/nutrition_percent);
  }

  self.draw_tile = function(t)
  {
    var rn = t.nutrition/nutrition_percent;
    var n = floor(rn);
    var cx = self.x+self.w/2;

    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    self.img_vignette(gg.b.tile_img(t.og_type),1);
    if(t.type == TILE_TYPE_LIVESTOCK)
    {
      switch(t.val)
      {
        case 0:  self.img_vignette(tile_livestock_imgs[0],1); break;
        case 1:  self.img_vignette(tile_livestock_imgs[1],1); break;
        case 2:  self.img_vignette(tile_livestock_imgs[2],1); break;
        default: self.img_vignette(tile_livestock_imgs[3],1); break;
      }
    }
    else
    self.img_vignette(gg.b.tile_img(t.type),1);

    if(t.type == TILE_TYPE_LAKE)
    {
      var a = 0;
      if(t.nutrition < water_fouled_threshhold)
        a = max(0,bias0(bias0(t.nutrition/water_fouled_threshhold))*0.8);
      else
        a = min(1,0.8+bias1(bias1((t.nutrition-water_fouled_threshhold)/(nutrition_max-water_fouled_threshhold)))*0.2);
      if(a > 0.05)
      {
        gg.ctx.globalAlpha = a;
        self.img_vignette(tile_bloom_img,1);
        gg.ctx.globalAlpha = 1;
      }
    }
    if(t.type == TILE_TYPE_FARM)
    {
      gg.ctx.globalAlpha = 0.2;
      gg.ctx.fillStyle = nutrition_color;
      var vp = 0.8;
      var vy = self.vignette_y+self.vignette_h*vp;
      var x = self.vignette_x;
      var w = self.vignette_w*0.1;
      var p;
      //nutrition
      p = min(1,(t.nutrition/(nutrition_max/4)));
      gg.ctx.fillRect(x,vy,w,self.vignette_h*(1-vp)*p);
      //growth;
      p = t.val/farm_nutrition_req;
      gg.ctx.fillRect(x,vy-(vp*self.vignette_h*p),w,vp*self.vignette_h*p);
      //delineator
      gg.ctx.strokeStyle = black;
      drawLine(x,vy,x+w,vy,gg.ctx);
      //poop
      if(t.fertilizer)
      {
      gg.ctx.fillStyle = brown;
      p = t.fertilizer.state/fertilizer_nutrition;
      gg.ctx.fillRect(x,vy-(vp*self.vignette_h*p*0.2),w,vp*self.vignette_h*p*0.2);
      }
      gg.ctx.globalAlpha = 1;
    }

    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.textAlign = "center";

    //title
    gg.ctx.font = self.title_font_size+"px "+gg.font;
    gg.ctx.fillText(gg.b.tile_name(t.type),cx,self.title_y);

    var u = self.tile_ui[t.type];

    //subtitle
    switch(t.type)
    {
      case TILE_TYPE_HOME:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        switch(t.state)
        {
          case TILE_STATE_HOME_VACANT:   gg.ctx.fillText("VACANT",cx,self.subtitle_y); break;
          case TILE_STATE_HOME_OCCUPIED:
          {
            var b = 0;
            for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].home == t) b = gg.farmbits[i];
            if(b) gg.ctx.fillText("Owner: "+b.name,cx,self.subtitle_y);
            else  gg.ctx.fillText("Owner: unknown",cx,self.subtitle_y);
          }
          break;
        }
        self.line(self.title_line_y);
      }
        break;
      case TILE_TYPE_FARM:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        switch(t.state)
        {
          case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillText("Needs Water",cx,self.subtitle_y);        break;
          case TILE_STATE_FARM_PLANTED:   gg.ctx.fillText("Growing",cx,self.subtitle_y);            break;
          case TILE_STATE_FARM_GROWN:     gg.ctx.fillText("Ready for Harvest!",cx,self.subtitle_y); break;
        }
        self.line(self.title_line_y);
      }
        break;
      case TILE_TYPE_LIVESTOCK:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        switch(t.state)
        {
          case TILE_STATE_LIVESTOCK_DIGESTING: gg.ctx.fillText("Digesting",cx,self.subtitle_y);          break;
          case TILE_STATE_LIVESTOCK_MILKABLE:  gg.ctx.fillText("Ready For Milking!",cx,self.subtitle_y); break;
        }
        self.line(self.title_line_y);
      }
        break;
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_COUNT:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        gg.ctx.fillText(gg.b.tile_name(t.type),cx,self.subtitle_y);
        self.line(self.title_line_y);
      }
        break;
    }

    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.pad;
    var w = self.w-self.pad*2;

    //production
    switch(t.type)
    {
      case TILE_TYPE_FARM:
      {
        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Produces:",self.x+self.pad,u.produce_y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText("2 Corn",self.x+self.w-self.pad,u.produce_y);
        gg.ctx.textAlign = "center";
        self.line(u.produce_line_y);

        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Default Output:",self.x+self.pad,u.export_y);

        var on = "#BAEDE1";
        var off = "#F2F2F2";
        var x;
        var y;
        var h = u.autosell_h;
        var img_s = h/2;
        gg.ctx.lineWidth = 1;
        gg.ctx.font = (self.font_size*0.75)+"px "+gg.font;
        gg.ctx.textAlign = "center";

        y = u.autosell_0_y;
        gg.ctx.drawImage(tile_food_img,self.x+self.pad,y,h,h);
        x = u.autosell_0_x;
        if(t.marks[0] == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_farmbit_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_1_x;
        if(t.marks[0] == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,0,0,0,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_2_x;
        if(t.marks[0] == MARK_FEED) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_cow_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);

        gg.ctx.fillStyle = black;
        x = u.autosell_0_x;
        gg.ctx.fillText("eat", x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_1_x;
        gg.ctx.fillText("sell",x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_2_x;
        gg.ctx.fillText("feed",x+u.autosell_w/2,y+self.font_size+self.pad);

        y = u.autosell_1_y;
        gg.ctx.drawImage(tile_food_img,self.x+self.pad,y,h,h);
        x = u.autosell_0_x;
        if(t.marks[1] == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_farmbit_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_1_x;
        if(t.marks[1] == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,0,0,0,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_2_x;
        if(t.marks[1] == MARK_FEED) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.autosell_w,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_cow_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);

        gg.ctx.fillStyle = black;
        x = u.autosell_0_x;
        gg.ctx.fillText("eat", x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_1_x;
        gg.ctx.fillText("sell",x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_2_x;
        gg.ctx.fillText("feed",x+u.autosell_w/2,y+self.font_size+self.pad);

        gg.ctx.font = self.font_size+"px "+gg.font;
        x = self.x+self.pad;

        var rg = t.val/farm_nutrition_req;
        if(t.state == TILE_STATE_FARM_UNPLANTED) rg = 0;
        if(t.state == TILE_STATE_FARM_GROWN)     rg = 1;

        gg.ctx.fillStyle = vlight_gray;
        fillRRect(self.x,u.nutrition_border_y,self.w,self.y+self.h-u.nutrition_border_y,self.pad,gg.ctx);
        gg.ctx.fillStyle = gg.font_color;

        gg.ctx.textAlign = "left";

        gg.ctx.fillText("Growth:",x,u.growth_y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText(floor(rg*100)+"%",self.x+self.w-self.pad,u.growth_y);

        draw_custom_pbar(x,u.growth_bar_y,self.w-self.pad*2,self.pad,"#B5D87A","#83AE43",rg);
        gg.ctx.fillStyle = gg.font_color;

        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Applied Fertilizer:",x,u.fertilizer_y);
        if(!t.fertilizer) gg.ctx.fillText("[None]",x,u.fertilizer_bar_y+self.pad);
      }
        break;
      case TILE_TYPE_LIVESTOCK:
      {
        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Produces:",self.x+self.pad,u.produce_y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText("Milk,Manure",self.x+self.w-self.pad,u.produce_y);
        gg.ctx.textAlign = "center";
        self.line(u.produce_line_y);

        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Default Output:",self.x+self.pad,u.export_y);

        var on = "#BAEDE1";
        var off = "#F2F2F2";
        var x;
        var y;
        var h = u.autosell_h;
        var img_s = h/2;
        gg.ctx.lineWidth = 1;
        gg.ctx.font = (self.font_size*0.75)+"px "+gg.font;
        gg.ctx.textAlign = "center";

        y = u.autosell_0_y;
        gg.ctx.drawImage(icon_milk_img,self.x+self.pad,y,h,h);
        x = u.autosell_0_x;
        if(t.marks[0] == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,w*3/8,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_farmbit_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_1_x;
        if(t.marks[0] == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,w*3/8,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_2_x;

        gg.ctx.fillStyle = black;
        x = u.autosell_0_x;
        gg.ctx.fillText("eat", x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_1_x;
        gg.ctx.fillText("sell",x+u.autosell_w/2,y+self.font_size+self.pad);


        y = u.autosell_1_y;
        gg.ctx.drawImage(icon_poop_img,self.x+self.pad,y,h,h);
        x = u.autosell_0_x;
        if(t.marks[1] == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,w*3/8,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(tile_farm_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_1_x;
        if(t.marks[1] == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,w*3/8,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.autosell_w/2-img_s/2,y,img_s,img_s);
        x = u.autosell_2_x;

        gg.ctx.fillStyle = black;
        x = u.autosell_0_x;
        gg.ctx.fillText("fertilize", x+u.autosell_w/2,y+self.font_size+self.pad);
        x = u.autosell_1_x;
        gg.ctx.fillText("sell",x+u.autosell_w/2,y+self.font_size+self.pad);

        x = self.x+self.pad;
        gg.ctx.font = self.font_size+"px "+gg.font;
        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Feed:",x,u.feed_y);
        if(t.val)
        {
          for(var i = 0; i < t.val; i++)
          {
            draw_custom_pbar(x,u.feed_bar_y,self.pad*3,self.pad,"#D2C8BB","#704617",1);
            x += self.pad*3;
          }
        }

      }
        break;
    }

    x = self.x+self.pad;
    if(self.known_nutrition > n) { self.nutrition_delta_d = -1; self.nutrition_delta_t = 10; }
    if(self.known_nutrition < n) { self.nutrition_delta_d =  1; self.nutrition_delta_t = 10; }
    if(self.nutrition_delta_t)
    {
      self.nutrition_delta_t--;
      var as = 50*gg.stage.s_mod;
      if(self.nutrition_delta_d < 0)
      {
        gg.ctx.fillStyle = red;
        gg.ctx.drawImage(down_img,x-as/2,u.nutrition_y-self.nutrition_delta_t-as/2,as,as);
      }
      else if(self.nutrition_delta_d > 0)
      {
        gg.ctx.fillStyle = green;
        gg.ctx.drawImage(up_img,x-as/2,u.nutrition_y+self.nutrition_delta_t-as/2,as,as);
      }
    }
    self.known_nutrition = n;

    gg.ctx.textAlign = "left";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.fillText("Nutrition:",x,u.nutrition_y);
    gg.ctx.textAlign = "right";
    gg.ctx.fillText(n+"%",self.x+self.w-self.pad,u.nutrition_y);

    draw_custom_pbar(x, u.nutrition_bar_y, w, self.pad, light_gray, t.nutrition > water_fouled_threshhold ? nutrition_color : gg.backdrop_color, bias_nutrition(rn/100));
    if(t.type == TILE_TYPE_LAKE) mark_pbar(self.x+self.pad, u.nutrition_bar_y, w, self.pad, bias_nutrition(water_fouled_threshhold/nutrition_max));
    gg.ctx.fillStyle = gg.font_color;

    if(t.fertilizer)
    {
      gg.ctx.textAlign = "left";
      gg.ctx.fillText("Applied Fertilizer:",x,u.fertilizer_y);
      if(t.fertilizer)
      {
        draw_custom_pbar(x,u.fertilizer_bar_y,self.pad*3,self.pad,"#D2C8BB","#704617",(t.fertilizer.state%fertilizer_nutrition)/fertilizer_nutrition);
        x += self.pad*3;
        for(var j = 0; (j+1)*fertilizer_nutrition < t.fertilizer.state; j++)
        {
          draw_custom_pbar(x,u.fertilizer_bar_y,self.pad*3,self.pad,"#D2C8BB","#704617",1);
          x += self.pad*3;
        }
      }
    }
  }

  self.tick_tile = function(t)
  {
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    y += self.pad;

    y += self.pad+self.font_size;
    switch(t.type)
    {
      case TILE_TYPE_FARM:
      {
        y += self.pad+self.font_size;
        x = self.x;
        y += self.pad+self.font_size;
        y = sy;
        x = self.x+self.w-self.pad;
        y += self.pad+self.font_size;
        x = self.x+self.w/2;
      }
        break;
    }
    y += self.pad+self.font_size;

    return y;
  }

  self.filter_tile = function(clicker,t)
  {
    var u = self.tile_ui[t.type];
    if(t.type == TILE_TYPE_FARM)
    {
      if(clicker.consumeif(self.x,u.autosell_0_y,self.w,u.autosell_h,function(evt){
             if(between(evt.doX,u.autosell_0_x,u.autosell_1_x)) t.marks[0] = MARK_USE;
        else if(between(evt.doX,u.autosell_1_x,u.autosell_2_x)) t.marks[0] = MARK_SELL;
        else if(between(evt.doX,u.autosell_2_x,u.autosell_3_x)) t.marks[0] = MARK_FEED;
        else { t.marks[0]++; if(t.marks[0] == MARK_COUNT) t.marks[0] = MARK_USE; }
      })) return 1;
      if(clicker.consumeif(self.x,u.autosell_1_y,self.w,u.autosell_h,function(evt){
             if(between(evt.doX,u.autosell_0_x,u.autosell_1_x)) t.marks[1] = MARK_USE;
        else if(between(evt.doX,u.autosell_1_x,u.autosell_2_x)) t.marks[1] = MARK_SELL;
        else if(between(evt.doX,u.autosell_2_x,u.autosell_3_x)) t.marks[1] = MARK_FEED;
        else { t.marks[1]++; if(t.marks[1] == MARK_COUNT) t.marks[1] = MARK_USE; }
      })) return 1;
    }
    if(t.type == TILE_TYPE_LIVESTOCK)
    {
      if(clicker.consumeif(self.x,u.autosell_0_y,self.w,u.autosell_h,function(evt){
             if(between(evt.doX,u.autosell_0_x,u.autosell_1_x)) t.marks[0] = MARK_USE;
        else if(between(evt.doX,u.autosell_1_x,u.autosell_2_x)) t.marks[0] = MARK_SELL;
        else { t.marks[0]++; if(t.marks[0] == MARK_FEED) t.marks[0] = MARK_USE; }
      })) return 1;
      if(clicker.consumeif(self.x,u.autosell_1_y,self.w,u.autosell_h,function(evt){
             if(between(evt.doX,u.autosell_0_x,u.autosell_1_x)) t.marks[1] = MARK_USE;
        else if(between(evt.doX,u.autosell_1_x,u.autosell_2_x)) t.marks[1] = MARK_SELL;
        else { t.marks[1]++; if(t.marks[1] == MARK_FEED) t.marks[1] = MARK_USE; }
      })) return 1;
    }

    return 0;
  }

  self.select_item = function(it)
  {
    if(it.type == ITEM_TYPE_FERTILIZER)
    {
      self.select_tile(it.tile);
      return;
    }
    self.detailed = it;
    self.detailed_type = INSPECTOR_CONTENT_ITEM;
  }

  self.draw_item = function(it)
  {
    var cx = self.x+self.w/2;

    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    self.img_vignette(gg.b.tile_img(it.tile.og_type),1);
    self.img_vignette(gg.b.item_img(it.type),1);

    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;

    gg.ctx.font = self.font_size+"px "+gg.font;
    gg.ctx.fillText(gg.b.item_name(it.type),cx,self.title_y);
    gg.ctx.textAlign = "left";

    self.line(self.title_line_y);

    var u = self.item_ui[it.type];
    if(u)
    {
      var on = "#BAEDE1";
      var off = "#F2F2F2";
      var x;
      var y;
      var w = self.w-self.pad*2;
      var h = u.switch_h;
      var img_s = h/2;
      gg.ctx.lineWidth = 1;
      gg.ctx.font = (self.font_size*0.75)+"px "+gg.font;
      gg.ctx.textAlign = "center";

      y = u.switch_y;
      gg.ctx.drawImage(gg.b.item_img(it.type),self.x+self.pad,y,h,h);
      x = u.switch_0_x;

      if(it.type == ITEM_TYPE_FOOD)
      {
        if(it.mark == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.switch_w,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_farmbit_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);
        x = u.switch_1_x;
        if(it.mark == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.switch_w,h,0,0,0,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);
        x = u.switch_2_x;
        if(it.mark == MARK_FEED) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.switch_w,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_cow_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);

        gg.ctx.fillStyle = black;
        x = u.switch_0_x;
        gg.ctx.fillText("eat", x+u.switch_w/2,y+self.font_size+self.pad);
        x = u.switch_1_x;
        gg.ctx.fillText("sell",x+u.switch_w/2,y+self.font_size+self.pad);
        x = u.switch_2_x;
        gg.ctx.fillText("feed",x+u.switch_w/2,y+self.font_size+self.pad);
      }
      else
      {
        if(it.mark == MARK_USE) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,u.switch_w,h,1,0,0,1,self.pad,gg.ctx);
        gg.ctx.stroke();
        switch(it.type)
        {
          case ITEM_TYPE_WATER:
            gg.ctx.drawImage(tile_farm_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);
            break;
          case ITEM_TYPE_MILK:
            gg.ctx.drawImage(badge_farmbit_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);
            break;
          case ITEM_TYPE_POOP:
            gg.ctx.drawImage(tile_farm_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);
            break;
          case ITEM_TYPE_FOOD:
            console.log("BROKEN");
            break;
          case ITEM_TYPE_FERTILIZER:
            console.log("BROKEN");
            break;
        }
        x = u.switch_1_x;
        if(it.mark == MARK_SELL) gg.ctx.fillStyle = on; else gg.ctx.fillStyle = off;
        fillSelectiveRRect(x,y,w*3/8,h,0,1,1,0,self.pad,gg.ctx);
        gg.ctx.stroke();
        gg.ctx.drawImage(badge_money_img,x+u.switch_w/2-img_s/2,y,img_s,img_s);

        gg.ctx.fillStyle = black;
        x = u.switch_0_x;
        switch(it.type)
        {
          case ITEM_TYPE_WATER:
            gg.ctx.fillText("irrigate", x+u.switch_w/2,y+self.font_size+self.pad);
            break;
          case ITEM_TYPE_MILK:
            gg.ctx.fillText("eat", x+u.switch_w/2,y+self.font_size+self.pad);
            break;
          case ITEM_TYPE_POOP:
            gg.ctx.fillText("fertilize", x+u.switch_w/2,y+self.font_size+self.pad);
            break;
          case ITEM_TYPE_FOOD:
            console.log("BROKEN");
            break;
          case ITEM_TYPE_FERTILIZER:
            console.log("BROKEN");
            break;
        }
        x = u.switch_1_x;
        gg.ctx.fillText("sell",x+u.switch_w/2,y+self.font_size+self.pad);

        gg.ctx.font = self.font_size+"px "+gg.font;
      }


    }
  }

  self.tick_item = function(it)
  {
  }

  self.filter_item = function(clicker,it)
  {
    var u = self.item_ui[it.type];
    if(!u) return 0;
    var clicked = 0;

    if(it.type == ITEM_TYPE_FOOD)
      clicker.consumeif(self.x,u.switch_y,self.w,u.switch_h,function(evt){
        clicked = 1;
             if(between(evt.doX,u.switch_0_x,u.switch_1_x)) it.mark = MARK_USE;
        else if(between(evt.doX,u.switch_1_x,u.switch_2_x)) it.mark = MARK_SELL;
        else if(between(evt.doX,u.switch_2_x,u.switch_3_x)) it.mark = MARK_FEED;
        else { it.mark++; if(it.mark == MARK_COUNT) it.mark = MARK_USE; }
      });
    else
      clicker.consumeif(self.x,u.switch_y,self.w,u.switch_h,function(evt){
        clicked = 1;
             if(between(evt.doX,u.switch_0_x,u.switch_1_x)) it.mark = MARK_USE;
        else if(between(evt.doX,u.switch_1_x,u.switch_2_x)) it.mark = MARK_SELL;
        else { it.mark++; if(it.mark == MARK_FEED) it.mark = MARK_USE; }
      });

    if(clicked)
    {
      if(it.lock)
      {
        var f = farmbit_with_item(it);
        if(f)
        {
               if((f.job_type == JOB_TYPE_EAT || f.job_type == JOB_TYPE_PLANT || f.job_type == JOB_TYPE_FERTILIZE)
                                                && it.mark != MARK_USE) f.abandon_job(0);
          else if(f.job_type == JOB_TYPE_EXPORT && it.mark != MARK_SELL) f.abandon_job(0);
          else if(f.job_type == JOB_TYPE_FEED   && it.mark != MARK_FEED) f.abandon_job(0);
        }
      }
      if(!it.lock)
      {
        if(it.mark == MARK_USE)
        {
          switch(it.type)
          {
            case ITEM_TYPE_WATER:      b_for_job(JOB_TYPE_PLANT, 0, it);     break;
            case ITEM_TYPE_FOOD:       b_for_job(JOB_TYPE_EAT, 0, it);       break;
            case ITEM_TYPE_POOP:       b_for_job(JOB_TYPE_FERTILIZE, 0, it); break;
            case ITEM_TYPE_FERTILIZER: console.log("BROKEN");                break;
            case ITEM_TYPE_MILK:       b_for_job(JOB_TYPE_EAT, 0, it);       break;
          }
        }
        else if(it.mark == MARK_SELL) b_for_job(JOB_TYPE_EXPORT, 0, it);
        else if(it.mark == MARK_FEED) b_for_job(JOB_TYPE_FEED, 0, it);
      }
      return 1;
    }

    return 0;
  }

  self.select_farmbit = function(f)
  {
    self.detailed = f;
    self.detailed_type = INSPECTOR_CONTENT_FARMBIT;
  }

  self.draw_farmbit = function(b)
  {
    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    self.img_vignette(gg.b.tile_img(b.tile.og_type),1);
    self.img_vignette(b.last_img,1);

    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    gg.ctx.fillText(b.name,x,y);
    y += self.pad;

    self.line(y);
    y += self.pad+self.font_size;

    str = "Status: "+gg.b.job_name(b.job_type);
    gg.ctx.fillText(str,x,y);
    y += self.pad+self.font_size;

    var sy = y;
    x = self.x+self.pad;
    gg.ctx.textAlign = "left";

    gg.ctx.fillText("Fullness:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Energy:",x,y);
    //y += self.pad+self.font_size;
    gg.ctx.fillText("Joy:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Fulfillment:",x,y);
    //y += self.pad+self.font_size;

    y = sy;
    x = self.x+self.w-self.pad;
    gg.ctx.textAlign = "right";

    switch(b.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.fullness/max_fullness*10)+"/10",x,y);
    y += self.pad+self.font_size;

/*
    switch(b.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.energy/max_energy*10)+"/10",x,y);
    y += self.pad+self.font_size;
*/

    switch(b.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.joy/max_joy*10)+"/10",x,y);
    y += self.pad+self.font_size;

/*
    switch(b.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.fulfillment*10)+"/10",x,y);
    y += self.pad+self.font_size;
*/

    y += self.pad+self.font_size;

    return y;
  }

  self.tick_farmbit = function(b)
  {
  }

  self.filter_farmbit = function(clicker,b)
  {
  }

  self.filter = function(clicker)
  {
    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL:  break;
      case INSPECTOR_CONTENT_TILE:    if(self.filter_tile(   clicker,self.detailed)) return 1; break;
      case INSPECTOR_CONTENT_ITEM:    if(self.filter_item(   clicker,self.detailed)) return 1; break;
      case INSPECTOR_CONTENT_FARMBIT: if(self.filter_farmbit(clicker,self.detailed)) return 1; break;
    }
    return 0;
  }

  self.tick = function()
  {
    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL:  break;
      case INSPECTOR_CONTENT_TILE:    self.tick_tile(self.detailed); break;
      case INSPECTOR_CONTENT_ITEM:    self.tick_item(self.detailed); break;
      case INSPECTOR_CONTENT_FARMBIT: self.tick_farmbit(self.detailed); break;
    }
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    gg.ctx.fillStyle = black;

    switch(self.detailed_type)
    {
      case INSPECTOR_CONTENT_NULL: /*gg.ctx.fillText("(nothing selected)",self.x+self.pad,self.y+self.pad);*/ break;
      case INSPECTOR_CONTENT_TILE:    self.draw_tile(self.detailed); break;
      case INSPECTOR_CONTENT_ITEM:    self.draw_item(self.detailed); break;
      case INSPECTOR_CONTENT_FARMBIT: self.draw_farmbit(self.detailed); break;
    }
    gg.ctx.textAlign = "left";

  }
}

var achievements = function()
{
  var self = this;
  self.open = 0;
  self.open_t = 0;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.w = gg.canvas.width/2;
    self.h = self.w;
    self.x = gg.canvas.width/2-self.w/2;
    self.y = gg.canvas.height/2-self.h/2;

    self.open_btn.w = 50*gg.stage.s_mod;
    self.open_btn.h = 50*gg.stage.s_mod;
    self.open_btn.x = self.pad;
    self.open_btn.y = self.pad;
  }
  self.open_btn = new ButtonBox(0,0,0,0,function(){ if(!gg.advisors.thread) self.open = !self.open; self.open_t = 0; });
  self.resize();

  self.triggers = [];
  self.nullt = {name:"null",local:0,global:0,trigger:ffunc};
  self.pushtrigger = function(name,description,offimg,onimg,fn,dep)
  {
    var t = {name:name,description:description,offimg:offimg,onimg:onimg,global:0,local:0,trigger:fn,dep:dep};
    self.triggers.push(t);
    return t;
  }

  self.notifs = [];
  self.notif_ts = [];

  var t;
  t = self.pushtrigger("Exist", "Get a visitor.",    farmbit_img, farmbit_img, function(){ return gg.farmbits.length;       },0);
  t = self.pushtrigger("Group", "3 Workers",         farmbit_img, farmbit_img, function(){ return gg.farmbits.length >= 3;  },t);
  t = self.pushtrigger("Town",  "A small community", farmbit_img, farmbit_img, function(){ return gg.farmbits.length >= 5;  },t);
  t = self.pushtrigger("City",  "10 Townmembers",    farmbit_img, farmbit_img, function(){ return gg.farmbits.length >= 10; },t);

  t = self.pushtrigger("Farmer",   "Own a farm!",      tile_farm_img, tile_farm_img, function(){ return gg.b.tile_groups[TILE_TYPE_FARM].length;       },0);
  t = self.pushtrigger("Farmers",  "Get three farms",  tile_farm_img, tile_farm_img, function(){ return gg.b.tile_groups[TILE_TYPE_FARM].length >= 3;  },t);
  t = self.pushtrigger("Farmtown", "5 Farms!",         tile_farm_img, tile_farm_img, function(){ return gg.b.tile_groups[TILE_TYPE_FARM].length >= 5;  },t);
  t = self.pushtrigger("MegaFarm", "10 Farm Industry", tile_farm_img, tile_farm_img, function(){ return gg.b.tile_groups[TILE_TYPE_FARM].length >= 10; },t);

  t = self.pushtrigger("Paycheck",    "$500",   icon_money_img, icon_money_img, function(){ return gg.money > 500;   },0);
  t = self.pushtrigger("Thousandair", "$1000",  icon_money_img, icon_money_img, function(){ return gg.money > 1000;  },t);
  t = self.pushtrigger("Stability",   "$5000",  icon_money_img, icon_money_img, function(){ return gg.money > 5000;  },t);
  t = self.pushtrigger("Riches",      "$10000", icon_money_img, icon_money_img, function(){ return gg.money > 10000; },t);

  var n_bloomed = function(n)
  {
    var found = 0;
    for(var x = self.bounds_tx; x < self.bounds_tx+self.bounds_tw; x++)
    {
      for(var y = self.bounds_ty; y < self.bounds_ty+self.bounds_th; y++)
      {
        var t = self.tiles_t(x,y);
        if(t.type == TILE_TYPE_LAKE && t.nutrition > water_fouled_threshhold) { found++; if(found > n) return 1; }
      }
    }
    return 0;
  }
  t = self.pushtrigger("Bloom","Algae destroys one tile",       tile_bloom_img,tile_bloom_img,function(){ return n_bloomed(1); },0);
  t = self.pushtrigger("BigBloom","Algae spreads to 3 tiles",   tile_bloom_img,tile_bloom_img,function(){ return n_bloomed(3); },t);
  t = self.pushtrigger("HugeBloom","You have an algae problem", tile_bloom_img,tile_bloom_img,function(){ return n_bloomed(10); },t);
  t = self.pushtrigger("MassiveBloom","A whole lake destroyed", tile_bloom_img,tile_bloom_img,function(){ return n_bloomed(30); },t);

  self.filter = function(filter)
  {
    var check = true;
    if(check) check = !filter.filter(self.open_btn);
    if(!self.open) return;
    if(check) check = !filter.filter(self);
    return !check;
  }

  self.click = function()
  {
    self.open = 0;
    self.open_t = 0;
  }

  self.tick = function()
  {
    if(gg.advisors.thread == gg.advisors.first_thread) return;
    var t;
    for(var i = 0; i < self.triggers.length; i++)
    {
      t = self.triggers[i];
      if(!t.local && (!t.dep || t.dep.local) && t.trigger())
      {
        t.local = 1;
        t.global = 1;
        self.notifs.push(t);
        self.notif_ts.push(0);
      }
    }
    for(var i = 0; i < self.notif_ts.length; i++)
    {
      self.notif_ts[i]++;
      if(self.notif_ts[i] > 200)
      {
        self.notifs.splice(i,1);
        self.notif_ts.splice(i,1);
        i--;
      }
    }
  }

  self.draw = function()
  {
    if(gg.advisors.thread) return;
    gg.ctx.drawImage(button_achievement_img,self.open_btn.x,self.open_btn.y,self.open_btn.w,self.open_btn.h);
    gg.ctx.textAlign = "center";
    if(self.open)
    {
      gg.ctx.fillStyle = white;
      fillRBB(self,self.pad,gg.ctx);
      var rows = 5;
      var cols = 5;
      var s = ((self.w-self.pad)/5)-self.pad;
      var x = self.x+self.pad;
      var y = self.y+self.pad;
      gg.ctx.fillStyle = gray;
      var t = self.nullt;
      var fs = gg.font_size;
      gg.ctx.font = fs+"px "+gg.font;
      for(var i = 0; i < rows; i++)
      {
        x = self.x+self.pad;
        for(var j = 0; j < cols; j++)
        {
          t = self.triggers[i*cols+j];
          if(!t) continue
          if(t.local) gg.ctx.fillStyle = red;
          else        { gg.ctx.fillStyle = gray; gg.ctx.globalAlpha = 0.5; }
          fillRRect(x,y,s,s,self.pad,gg.ctx);
          if(t.local && t.onimg) gg.ctx.drawImage(t.onimg,x,y,s,s);
          else if(t.offimg)      gg.ctx.drawImage(t.offimg,x,y,s,s);
          gg.ctx.fillStyle = black;
          gg.ctx.fillText(t.name,x+s/2,y+s);
          x += s+self.pad;
          gg.ctx.globalAlpha = 1;
        }
        y += s+self.pad;
      }
    }
    gg.ctx.font = fs+"px "+gg.font;
    for(var i = 0; i < self.notifs.length; i++)
    {
      var offy = bounceup(self.notif_ts[i]/200)*50*gg.stage.s_mod;
      var w = 150*gg.stage.s_mod;
      var h = gg.font_size*8;
      var x = gg.canvas.width/2-w/2;
      var y = gg.canvas.height/2-h/2;
      var pad = gg.font_size;
      y -= offy;
      gg.ctx.lineWidth = self.pad/2;
      gg.ctx.font = gg.font_size+"px "+gg.font_size;
      gg.ctx.strokeStyle = "#18315B";
      gg.ctx.fillStyle = "#6EBCA9";
      fillRRect(x,y,w,h,pad,gg.ctx);
      gg.ctx.stroke();
      gg.ctx.fillStyle = "#9CE6D4";
      fillSelectiveRRect(x,y+h*3/5,w,h*2/5,0,0,1,1,pad,gg.ctx);
      gg.ctx.stroke();
      gg.ctx.fillStyle = white;
      gg.ctx.fillText("Achievement",gg.canvas.width/2,y+h*1/3);
      gg.ctx.fillText("unlocked!",  gg.canvas.width/2,y+h*1/3+gg.font_size);
      gg.ctx.fillStyle = "#18315B";
      gg.ctx.fillText(self.notifs[i].name,       gg.canvas.width/2,y+h*4/5);
      gg.ctx.fillText(self.notifs[i].description,gg.canvas.width/2,y+h*4/5+gg.font_size);
      var imgs = w/4;
      gg.ctx.drawImage(self.notifs[i].onimg,gg.canvas.width/2-imgs/2,y-imgs/2,imgs,imgs);
    }
  }

}

var advisors = function()
{
  var self = this;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.x = 0;
    self.y = 0;
    self.w = gg.canvas.width;
    self.h = gg.canvas.height;
    self.popup_w = 200*gg.stage.s_mod;
    self.font_size = gg.font_size;
    self.font = self.font_size+"px "+gg.font;
    self.title_font_size = self.font_size*1.5;
    self.title_font = self.title_font_size+"px "+gg.font;

    setBB(self.skip_btn, self.pad, gg.canvas.height-self.pad-50, 200, 50);
  }
  self.skip_btn = new ButtonBox(0,0,0,0,function(){ self.skip_tutorial(); });
  self.skip_btn.active = 0;

  self.resize();

  self.bgc = "#9DE7E5";
  self.fgc = "#1A355D";

  var ENUM = 0;
  var THREADF_TYPE_BEGIN  = ENUM; ENUM++;
  var THREADF_TYPE_TICK   = ENUM; ENUM++;
  var THREADF_TYPE_DRAW   = ENUM; ENUM++;
  var THREADF_TYPE_QCLICK = ENUM; ENUM++;
  var THREADF_TYPE_CLICK  = ENUM; ENUM++;
  var THREADF_TYPE_END    = ENUM; ENUM++;
  var THREADF_TYPE_SSIM   = ENUM; ENUM++;
  var THREADF_TYPE_COUNT  = ENUM; ENUM++;

  self.mayor_active    = 0;
  self.business_active = 0;
  self.farmer_active   = 0;

  self.popup_h = 0;
  self.target_popup_h = 0;

  self.triggers = [];
  self.trigger_threads = [];

  self.mayor_history        = [];
  self.mayor_fmt_history    = [];
  self.mayor_records        = [];
  self.mayor_fmt_records    = [];
  self.business_history     = [];
  self.business_fmt_history = [];
  self.business_records     = [];
  self.business_fmt_records = [];
  self.farmer_history       = [];
  self.farmer_fmt_history   = [];
  self.farmer_records       = [];
  self.farmer_fmt_records   = [];

  self.owns_ui = 0;
  self.owns_time = 0;
  self.advisor = ADVISOR_TYPE_NULL;
  self.thread = 0;
  self.thread_i = 0;
  self.thread_t = 0;
  self.stable_thread_t = 0;

  self.preview = 0;
  self.preview_off_y = 0;

  self.people_supported = 0;
  self.livestock_supported = 0;
  self.money_rate = 0;

  //queries
  self.time_passed        = function(t) { return self.thread_t >= t; }
  self.bits_exist         = function(n) { return gg.farmbits.length >= n; }
  self.bits_hungry        = function(n) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].fullness_state < FARMBIT_STATE_MOTIVATED) n--; return n <= 0; }
  self.bits_job           = function(type,state) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].job_type == type && gg.farmbits[i].job_state == state) return 1; return 0; }
  self.tiles_exist        = function(type,n) { return gg.b.tile_groups[type].length >= n; }
  self.items_exist        = function(type,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.marked_items_exist = function(type,mark,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type && gg.items[i].mark == mark) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.purchased          = function(type) { return gg.shop.selected_buy == type; }

  self.unlock_all = function()
  {
    self.mayor_active = 1;
    self.business_active = 1;
    self.farmer_active = 1;
  }

  self.skip_tutorial = function()
  {
    //self.skip_btn.active = 0;
    var t;

    //finish cur thread
    if(self.thread)
    {
      t = self.thread;
      t[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_END]();
      for(var j = (self.thread_i+1)*THREADF_TYPE_COUNT; j < t.length; j+=THREADF_TYPE_COUNT)
      {
        if(t[j+THREADF_TYPE_SSIM]())
        {
          t[j+THREADF_TYPE_BEGIN]();
          t[j+THREADF_TYPE_END]();
        }
      }
    }
    self.owns_ui = 0;
    self.owns_time = 0;
    self.thread = 0;
    self.thread_i = 0;
    self.thread_t = 0;
    self.stable_thread_t = 0;
    self.heap = {};

    gg.achievements.open = 0;
    self.preview = 0;

    /*
    //keep running through remaining skippable threads
    for(var i = 0; i < self.trigger_threads.length; i++)
    {
      t = self.trigger_threads[i];
      if(
        t == tut_build_a_house ||
        t == tut_buy_food ||
        t == tut_build_a_farm ||
        t == tut_timewarp ||
        t == tut_sell_food ||
        t == tut_buy_fertilizer ||
        t == tut_buy_livestock ||
        t == tut_livestock ||
        t == tut_poop ||
        0
        )
      {
        self.triggers.splice(i,1);
        self.trigger_threads.splice(i,1);
        for(var j = 0; j < t.length; j+=THREADF_TYPE_COUNT)
        {
          if(t[j+THREADF_TYPE_SSIM]())
          {
            t[j+THREADF_TYPE_BEGIN]();
            t[j+THREADF_TYPE_END]();
          }
        }
        i--;
      }

      self.owns_ui = 0;
      self.owns_time = 0;
      self.thread = 0;
      self.thread_i = 0;
      self.thread_t = 0;
      self.stable_thread_t = 0;
      self.heap = {};
    }
    unlock_ui();
    */

    gg.speed = SPEED_PLAY;
  }

  self.skip_all_tutorials = function()
  {
    //self.skip_btn.active = 0;
    var t;

    //finish cur thread
    if(self.thread)
    {
      t = self.thread;
      t[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_END]();
      for(var j = (self.thread_i+1)*THREADF_TYPE_COUNT; j < t.length; j+=THREADF_TYPE_COUNT)
      {
        if(t[j+THREADF_TYPE_SSIM]())
        {
          t[j+THREADF_TYPE_BEGIN]();
          t[j+THREADF_TYPE_END]();
        }
      }
    }
    self.owns_ui = 0;
    self.owns_time = 0;
    self.thread = 0;
    self.thread_i = 0;
    self.thread_t = 0;
    self.stable_thread_t = 0;
    self.heap = {};

    gg.achievements.open = 0;
    self.preview = 0;

    //keep running through remaining skippable threads
    for(var i = 0; i < self.trigger_threads.length; i++)
    {
      t = self.trigger_threads[i];
      if(
        t == tut_build_a_house ||
        t == tut_buy_food ||
        t == tut_build_a_farm ||
        t == tut_timewarp ||
        t == tut_sell_food ||
        t == tut_buy_fertilizer ||
        t == tut_buy_livestock ||
        t == tut_livestock ||
        t == tut_poop ||
        0
        )
      {
        self.triggers.splice(i,1);
        self.trigger_threads.splice(i,1);
        for(var j = 0; j < t.length; j+=THREADF_TYPE_COUNT)
        {
          if(t[j+THREADF_TYPE_SSIM]())
          {
            t[j+THREADF_TYPE_BEGIN]();
            t[j+THREADF_TYPE_END]();
          }
        }
        i--;
      }

      self.owns_ui = 0;
      self.owns_time = 0;
      self.thread = 0;
      self.thread_i = 0;
      self.thread_t = 0;
      self.stable_thread_t = 0;
      self.heap = {};
    }
    unlock_ui();

    gg.speed = SPEED_PLAY;
  }

  //transitions
  self.takeover_ui   = function(){ self.owns_ui   = 1; }
  self.takeover_time = function(){ self.owns_time = 1; }

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
  self.larrow = function(x,y)
  {
    var t = (self.stable_thread_t%100)/100;
    gg.ctx.globalAlpha = min(1,self.stable_thread_t/30);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    drawArrow(x-30*gg.stage.s_mod,y-29*gg.stage.s_mod,x,y,8*gg.stage.s_mod,gg.ctx);
    gg.ctx.globalAlpha = 1;
  }
  self.arrow = function(x,y)
  {
    var t = (self.stable_thread_t%100)/100;
    gg.ctx.globalAlpha = min(1,self.stable_thread_t/30);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    drawArrow(x+30*gg.stage.s_mod,y-29*gg.stage.s_mod,x,y,8*gg.stage.s_mod,gg.ctx);
    gg.ctx.globalAlpha = 1;
  }
  self.camtotile = function(t)
  {
    gg.cam.wx = lerp(gg.cam.wx,t.wx,0.05);
    gg.cam.wy = lerp(gg.cam.wy,t.wy,0.05);
    gg.b.set_cam();
  }
  self.popup = function(type)
  {
    self.pad = self.font_size;
    var x = gg.canvas.width/2;
    var y = gg.canvas.height-self.pad;
    var t = min(1,self.stable_thread_t/100);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    var txt_fmt;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    txt_fmt = self.mayor_fmt_history[self.mayor_history.length-1];       break;
      case ADVISOR_TYPE_BUSINESS: txt_fmt = self.business_fmt_history[self.business_history.length-1]; break;
      case ADVISOR_TYPE_FARMER:   txt_fmt = self.farmer_fmt_history[self.farmer_history.length-1];     break;
    }
    var h = self.pad+self.title_font_size+self.pad+self.font_size*txt_fmt.length+self.pad;
    if(type == TEXT_TYPE_DISMISS) h += self.font_size+self.pad;
    self.target_popup_h = h;
    var w = self.popup_w+self.pad*2;
    x -= w/2;
    y -= h;

    gg.ctx.fillStyle = light_gray;
    gg.ctx.strokeStyle = gray;
    gg.ctx.lineWidth = self.pad/2;
    if(self.popup_h < 100) gg.ctx.globalAlpha = min(1,t*6);
    gg.ctx.textAlign = "left";

    //bubble
    gg.ctx.fillStyle = self.bgc;
    gg.ctx.strokeStyle = self.fgc;
    fillRRect(x-w/3,y+(self.target_popup_h-self.popup_h),w+w/3,self.popup_h,self.pad,gg.ctx);
    gg.ctx.stroke();
    gg.ctx.fillStyle = self.fgc;

    var aimg = 0;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    aimg = advisor_mayor_img;    break;
      case ADVISOR_TYPE_BUSINESS: aimg = advisor_business_img; break;
      case ADVISOR_TYPE_FARMER:   aimg = advisor_farmer_img;   break;
    }
    gg.ctx.drawImage(aimg, x-w/4, y+self.target_popup_h-w/2, w/4, w/2);
    drawLine(x-w/3+self.pad,y+self.target_popup_h,x+w-self.pad,y+self.target_popup_h,gg.ctx);

    var ty = y+self.pad+self.title_font_size;
    gg.ctx.font = self.title_font;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    gg.ctx.fillText("Mayor Advisor:",    x+self.pad, ty); break;
      case ADVISOR_TYPE_BUSINESS: gg.ctx.fillText("Business Advisor:", x+self.pad, ty); break;
      case ADVISOR_TYPE_FARMER:   gg.ctx.fillText("Farm Advisor:",     x+self.pad, ty); break;
    }

    ty += self.pad+self.font_size;
    gg.ctx.font = self.font;
    for(var i = 0; i < txt_fmt.length; i++)
      gg.ctx.fillText(txt_fmt[i],x+self.pad,ty+self.font_size*i);

    if(type == TEXT_TYPE_DISMISS)
    {
      ty += self.pad+self.font_size*txt_fmt.length;
      gg.ctx.fillStyle = gray;
      gg.ctx.drawImage(button_next_img, x+self.pad,ty-self.font_size-self.pad/2, w/4, w/9);
      //gg.ctx.fillText("(click to continue)", x+self.pad, ty);
    }

    gg.ctx.globalAlpha = 1;
  }
  self.ctc = function()
  {
    var x = gg.canvas.width/2
    var y = gg.b.cbounds_y+gg.b.cbounds_h-gg.font_size*2;
    gg.ctx.fillStyle = black;
    gg.ctx.textAlign = "center";
    gg.ctx.fillText("(click to continue)",x,y);
  }
  self.set_advisor = function(a)
  {
    self.advisor = a;
    switch(a)
    {
      case ADVISOR_TYPE_MAYOR:    self.mayor_active = 1; break;
      case ADVISOR_TYPE_BUSINESS: self.business_active = 1; break;
      case ADVISOR_TYPE_FARMER:   self.farmer_active = 1; break;
    }
  }

  self.push_blurb = function(txt)
  {
    var fmt = textToLines(self.font, self.popup_w, txt, gg.ctx);
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    self.mayor_history.push(txt);    self.mayor_fmt_history.push(fmt);    break;
      case ADVISOR_TYPE_BUSINESS: self.business_history.push(txt); self.business_fmt_history.push(fmt); break;
      case ADVISOR_TYPE_FARMER:   self.farmer_history.push(txt);   self.farmer_fmt_history.push(fmt);   break;
    }
  }

  self.push_record = function(txt)
  {
    var fmt = textToLines(self.font, self.popup_w, txt, gg.ctx);
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    self.mayor_records.push(txt);    self.mayor_fmt_records.push(fmt);    break;
      case ADVISOR_TYPE_BUSINESS: self.business_records.push(txt); self.business_fmt_records.push(fmt); break;
      case ADVISOR_TYPE_FARMER:   self.farmer_records.push(txt);   self.farmer_fmt_records.push(fmt);   break;
    }
  }

  self.jmp = function(i)
  {
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_END]();
    self.owns_ui = 0;
    self.owns_time = 0;
    self.thread_i += i;
    self.thread_t = 0;
    self.stable_thread_t = 0;
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
  }

  self.pool_thread = function(trigger,thread)
  {
    self.triggers.push(trigger);
    self.trigger_threads.push(thread);
  }
  self.launch_thread = function(t)
  {
    gg.achievements.open = 0;
    self.thread = t;
    self.heap = {};
    self.thread_i = 0;
    self.thread_t = 0;
    self.stable_thread_t = 0;
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
    return 1;
  }
  self.adv_thread = function()
  {
    gg.achievements.open = 0;
    if(gg.speed > SPEED_PLAY) gg.speed = SPEED_PLAY;
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_END]();
    self.owns_ui = 0;
    self.owns_time = 0;
    self.thread_i++;
    self.thread_t = 0;
    self.stable_thread_t = 0;
    if(self.thread_i*THREADF_TYPE_COUNT >= self.thread.length)
    {
      self.thread = 0;
      self.heap = {};
    }
    else
      self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
    return 1;
  }
  self.delay_adv_thread = function()
  {
    if(self.stable_thread_t > 30) return self.adv_thread();
    return 0;
  }
  self.confirm_delay_adv_thread = function()
  {
    if(self.stable_thread_t > 30) return self.confirm_adv_thread();
    return 0;
  }
  self.confirm_adv_thread = function()
  {
    self.pad = self.font_size;
    var x = gg.canvas.width/2;
    var y = gg.canvas.height-self.pad;
    var txt_fmt;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    txt_fmt = self.mayor_fmt_history[self.mayor_history.length-1];       break;
      case ADVISOR_TYPE_BUSINESS: txt_fmt = self.business_fmt_history[self.business_history.length-1]; break;
      case ADVISOR_TYPE_FARMER:   txt_fmt = self.farmer_fmt_history[self.farmer_history.length-1];     break;
    }
    var h = self.pad+self.title_font_size+self.pad+self.font_size*txt_fmt.length+self.pad;
    h += self.font_size+self.pad;
    var w = self.popup_w+self.pad*2;
    x -= w/2;
    y -= h;
    if(doEvtWithin(self.last_evt,x,y,w,h)) return self.adv_thread();
    return 0;
  }

  self.evt_within_popup = function(evt)
  {
    self.pad = self.font_size;
    var x = gg.canvas.width/2;
    var y = gg.canvas.height-self.pad;
    var txt_fmt;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    txt_fmt = self.mayor_fmt_history[self.mayor_history.length-1];       break;
      case ADVISOR_TYPE_BUSINESS: txt_fmt = self.business_fmt_history[self.business_history.length-1]; break;
      case ADVISOR_TYPE_FARMER:   txt_fmt = self.farmer_fmt_history[self.farmer_history.length-1];     break;
    }
    var h = self.pad+self.title_font_size+self.pad+self.font_size*txt_fmt.length+self.pad;
    h += self.font_size+self.pad;
    var w = self.popup_w+self.pad*2;
    x -= w/2;
    y -= h;
    return doEvtWithin(evt,x,y,w,h);
  }

  self.another_member = function()
  {
    if(self.thread == tut_another_member) return;
    for(var i = 0; i < self.trigger_threads.length; i++)
      if(self.trigger_threads[i] == tut_another_member) return;
    self.pool_thread(function(){ return 1; }, tut_another_member);
  }
  self.another_death = function()
  {
    if(!gg.farmbits.length) { self.pool_thread(function(){ return 1; }, tut_final_death); return; }

    if(self.thread == tut_another_death) return;
    for(var i = 0; i < self.trigger_threads.length; i++)
      if(self.trigger_threads[i] == tut_another_death) return;

    if(!self.a_death) self.pool_thread(function(){ return 1; }, tut_death);
    else              self.pool_thread(function(){ return 1; }, tut_another_death);
    self.a_death = 1;
  }

  self.click = function(evt)
  {
    if(self.thread)
    {
      if(self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_CLICK](evt)) gg.ignore_single_board = 1;
    }
    else if(0)
    {
      //copied from draw!
      var h = gg.stage.s_mod*80;
      var w = h*1.5;
      var x = gg.canvas.width/2-w*(1.1+.55);
      var y = gg.canvas.height-h;

      var previewed = 0;
      if(self.mayor_active    && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_MAYOR)    { self.set_advisor(ADVISOR_TYPE_MAYOR);    self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.1;
      if(self.business_active && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_BUSINESS) { self.set_advisor(ADVISOR_TYPE_BUSINESS); self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.1;
      if(self.farmer_active   && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_FARMER)   { self.set_advisor(ADVISOR_TYPE_FARMER);   self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.1;
      if(!previewed) self.preview = 0;
    }

    if(self.skip_btn.active && doEvtWithin(evt,self.skip_btn.x,self.skip_btn.y,self.skip_btn.w,self.skip_btn.h)) self.skip_btn.click(evt);
  }

  self.drag_t = 0;
  self.dragging_preview = 0;
  self.drag_preview_start_y = 0;
  self.drag_preview_cur_y = 0;
  self.last_evt = 0;
  self.drag_start_x = 0;
  self.drag_start_y = 0;
  self.dragStart = function(evt)
  {
    self.last_evt = evt;

    self.drag_t = 0;
    self.dragging_preview = 0;
    self.drag_start_x = evt.doX;
    self.drag_start_y = evt.doY;

    if(self.thread)
    {
      if(self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_QCLICK](evt)) { self.drag_t = 50; gg.ignore_single_board = 1; }
    }

    if(self.preview)
    {
      //copied from draw!
      var x = gg.canvas.width/2;
      var y = gg.canvas.height-self.pad;
      y = y-(100*gg.stage.s_mod);
      var h = self.pad+self.title_font_size+self.pad+self.font_size+self.pad;
      h += self.font_size+self.pad;
      h += 100*gg.stage.s_mod;
      var w = self.popup_w+self.pad*2;
      x -= w/2;
      y -= h;
      if(doEvtWithin(evt,x,y,w,h))
      {
        self.drag_preview_start_y = evt.doY;
        self.drag_preview_cur_y = self.drag_preview_start_y;
        self.dragging_preview = 1;
      }
    }
  }
  self.drag = function(evt)
  {
    self.last_evt = evt;

    if(self.dragging_preview)
    {
      self.drag_preview_cur_y = evt.doY;
    }
  }
  self.dragFinish = function(evt)
  {
    if(self.last_evt && self.last_evt.doX) { evt.doX = self.last_evt.doX; evt.doY = self.last_evt.doY; }
    self.last_evt = evt;

    if(self.dragging_preview)
    {
      self.preview_off_y += self.drag_preview_cur_y-self.drag_preview_start_y;
      self.drag_preview_start_y = self.drag_preview_cur_y;
    }

    if(self.drag_t < 10 || (self.drag_t < 20 && lensqr(self.drag_start_x-self.last_evt.doX,self.drag_start_y-self.last_evt.doY) < 100)) self.click(evt);

    self.drag_t = 0;
    self.dragging_preview = 0;
  }

  self.tick = function(times)
  {
    self.drag_t++;

    //calculate stats
    {
      //food (# corn per tick)
      var potential_rate = 0;
      var production_rate = 0;
      var edible_rate = 0;
      var sell_rate = 0;
      var feed_rate = 0;
      for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++)
      {
        var t = gg.b.tile_groups[TILE_TYPE_FARM][i];
        var t_rate = clamp(farm_nutrition_uptake_min,farm_nutrition_uptake_max,t.nutrition*farm_nutrition_uptake_p)/farm_nutrition_req; //food per tick
        potential_rate += t_rate*2;
        if(t.state == TILE_STATE_FARM_PLANTED)
        {
          production_rate += t_rate*2;
          for(var j = 0; j < 2; j++)
          {
            switch(t.marks[j])
            {
              case MARK_USE:  edible_rate += t_rate; break;
              case MARK_SELL: sell_rate   += t_rate; break;
              case MARK_FEED: feed_rate   += t_rate; break;
            }
          }
        }
      }
      var ticks_before_hungry = max_fullness-fullness_content
      self.people_supported = edible_rate*ticks_before_hungry;
      self.livestock_supported = feed_rate*ticks_before_hungry/3;
      self.money_rate = sell_rate*item_worth_food;
    }

    self.thread_t += times;
    self.stable_thread_t++;
    if(!self.thread)
    {
      for(var i = 0; i < self.triggers.length; i++)
      {
        if(self.triggers[i]())
        {
          gg.achievements.open = 0;
          self.preview = 0;
          var thread = self.trigger_threads[i];
          self.triggers.splice(i,1);
          self.trigger_threads.splice(i,1);
          self.launch_thread(thread);
          break;
        }
      }
    }
    else
      if(self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_TICK]()) self.adv_thread();
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    if(!self.preview) self.target_popup_h = 0; //gets set in thread draw
    if(self.thread)
      self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_DRAW]();
    else
    {
      var h = gg.stage.s_mod*80;
      var w = h*1.5;
      var x = gg.canvas.width/2-w*(1.1+.55);
      var y = gg.canvas.height-h;
      var fs = gg.font_size;
      gg.ctx.fillStyle = self.fgc;
      gg.ctx.textAlign = "center";
      if(self.mayor_active)
      {
        gg.ctx.drawImage(advisor_panel_mayor_img,x,y,w,h*1.05);
        gg.ctx.fillText(gg.farmbits.length+" townspeople",x+w/2,y+fs*3+self.pad/2);
        if(gg.farmbits.length)
        {
          var sad = 0;
          for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].joy_state == FARMBIT_STATE_DESPERATE) sad++;
          gg.ctx.fillText(fdisp(sad/gg.farmbits.length)+"% sad",x+w/2,y+fs*4+self.pad);
        }
        else gg.ctx.fillText("0% sad",x+w/2,y+fs*4+self.pad);
      }
      x += w*1.1;
      if(self.business_active)
      {
        gg.ctx.drawImage(advisor_panel_business_img,x,y,w,h*1.05);
        var permin = 60*60;
        gg.ctx.fillText(floor(self.money_rate*permin)+" $/min",x+w/2,y+fs*3+self.pad/2);
      }
      x += w*1.1;
      if(self.farmer_active)
      {
        gg.ctx.drawImage(advisor_panel_farmer_img,x,y,w,h*1.05);
        gg.ctx.fillText("Farms support",x+w/2,y+fs*3+self.pad/2);
        gg.ctx.fillText(fdisp(self.people_supported, 1)+" people",x+w/2,y+fs*4+self.pad);
        //gg.ctx.fillText(fdisp(self.livestock_supported, 1)+" livestock",x+w/2,y+fs*4+self.pad);
        //gg.ctx.fillText("sustainable",x+w/2,y+fs*4+self.pad/2+fs);
        //gg.ctx.fillText(fdisp(potential_rate) +" food/min (potential)",  x,y+fs*5);
        //gg.ctx.fillText(fdisp(production_rate)+" food/min (production)", x,y+fs*6);
        //gg.ctx.fillText(fdisp(edible_rate)    +" food/min (edible)",     x,y+fs*7);
        //gg.ctx.fillText(gg.food+" food", x,y);
      }
      x += w*1.1;
    }
    self.popup_h = lerp(self.popup_h,self.target_popup_h,0.5);

    if(self.preview)
    {
      self.pad = self.font_size;
      var x = gg.canvas.width/2;
      var y = gg.canvas.height-self.pad;
      var t = min(1,self.thread_t/100);
      y = y-(10-10*bounceup(t)+100)*gg.stage.s_mod;
      var txt_fmt;
      var fmt_history;
      var fmt_records;
      switch(self.advisor)
      {
        case ADVISOR_TYPE_MAYOR:    fmt_records = self.mayor_fmt_records;    fmt_history = self.mayor_fmt_history;   break;
        case ADVISOR_TYPE_BUSINESS: fmt_records = self.business_fmt_records; fmt_history = self.business_fmt_history; break;
        case ADVISOR_TYPE_FARMER:   fmt_records = self.farmer_fmt_records;   fmt_history = self.farmer_fmt_history;  break;
      }
      txt_fmt = fmt_history[fmt_history.length-1];
      var h = self.pad+self.title_font_size+self.pad+self.font_size*txt_fmt.length+self.pad;
      h += self.font_size+self.pad;
      h += 100*gg.stage.s_mod;
      self.target_popup_h = h;
      var w = self.popup_w+self.pad*2;
      x -= w/2;
      y -= h;

      gg.ctx.fillStyle = light_gray;
      gg.ctx.strokeStyle = gray;
      gg.ctx.lineWidth = self.pad/2;
      if(self.popup_h < 100) gg.ctx.globalAlpha = min(1,t*6);
      gg.ctx.textAlign = "left";

      //bubble
      gg.ctx.fillStyle = self.bgc;
      gg.ctx.strokeStyle = self.fgc;
      fillRRect(x-w/3,y+(self.target_popup_h-self.popup_h),w+w/3,self.popup_h,self.pad,gg.ctx);
      //gg.ctx.stroke(); //moved below
      gg.ctx.fillStyle = self.fgc;

      var aimg = 0;
      switch(self.advisor)
      {
        case ADVISOR_TYPE_MAYOR:    aimg = advisor_mayor_img;    break;
        case ADVISOR_TYPE_BUSINESS: aimg = advisor_business_img; break;
        case ADVISOR_TYPE_FARMER:   aimg = advisor_farmer_img;   break;
      }
      gg.ctx.drawImage(aimg, x-w/4, y+self.target_popup_h-w/2, w/4, w/2);
      drawLine(x-w/3+self.pad,y+self.target_popup_h,x+w-self.pad,y+self.target_popup_h,gg.ctx);

      var ty = y+self.pad+self.title_font_size;
      gg.ctx.font = self.title_font;
      switch(self.advisor)
      {
        case ADVISOR_TYPE_MAYOR:    gg.ctx.fillText("Mayor Advisor:",    x+self.pad, ty); break;
        case ADVISOR_TYPE_BUSINESS: gg.ctx.fillText("Business Advisor:", x+self.pad, ty); break;
        case ADVISOR_TYPE_FARMER:   gg.ctx.fillText("Farm Advisor:",     x+self.pad, ty); break;
      }

      ty += self.pad+self.font_size;
      gg.ctx.font = self.font;
      for(var i = 0; i < txt_fmt.length; i++)
        gg.ctx.fillText(txt_fmt[i],x+self.pad,ty+self.font_size*i);

      ty += self.pad+self.font_size*txt_fmt.length;
      gg.ctx.drawImage(button_next_img, x+self.pad,ty-self.font_size-self.pad/2, w/4, w/9);

      gg.ctx.fillStyle = white;
      gg.ctx.fillRect(x,ty+self.pad,w,100*gg.stage.s_mod);
      gg.ctx.rect(x,ty+self.pad,w,100*gg.stage.s_mod);
      gg.ctx.save();
      gg.ctx.clip();
      ty += self.pad+self.font_size;
      ty += self.preview_off_y+(self.drag_preview_cur_y-self.drag_preview_start_y);
      gg.ctx.fillStyle = self.fgc;
      for(var j = 0; j < fmt_records.length; j++)
      {
        txt_fmt = fmt_records[fmt_records.length-1-j];
        for(var i = 0; i < txt_fmt.length; i++)
          gg.ctx.fillText(txt_fmt[i],x+self.pad,ty+self.font_size*i);
        ty += (self.pad+self.font_size)*txt_fmt.length;
        if(ty > y+h+self.font_size) break;
      }
      gg.ctx.restore();
      strokeRRect(x-w/3,y+(self.target_popup_h-self.popup_h),w+w/3,self.popup_h,self.pad,gg.ctx); //copied from fillrrect above

      gg.ctx.globalAlpha = 1;
    }
    if(self.skip_btn.active && self.thread)
    {
      gg.ctx.textAlign = "left";
      gg.ctx.fillStyle = black;
      gg.ctx.fillText("(skip tutorial)",self.skip_btn.x,self.skip_btn.y+self.skip_btn.h);
      //gg.ctx.fillRect(self.skip_btn.x,self.skip_btn.y,self.skip_btn.w,self.skip_btn.h);
    }
  }

  var tut_mayor_leave = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'mayor_leave'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I have failed as your mayor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.mayor_active = 0;
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'mayor_leave'});
    },
    tfunc, //shouldsim

  ];

  var tut_farmer_leave = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'farmer_leave'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("I have failed as your farm advisor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.farmer_active = 0;
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'farmer_leave'});
    },
    tfunc, //shouldsim

  ];

  var tut_business_leave = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'business_leave'}); self.set_advisor(ADVISOR_TYPE_BUSINESS); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("I have failed as your business advisor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.mayor_active = 0;
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'business_leave'});
    },
    tfunc, //shouldsim

  ];

  var tut_rain = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'rain'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("Looks like it's about to rain!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    noop, //begin
    function(){ return self.time_passed(400); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.b.raining = 1; }, //begin
    function(){ return self.time_passed(800); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("There it goes-"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Don't worry, it shouldn't last too long."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("It might shift around some nutrients,"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("But that's nothing some more manure can't fix!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    noop, //begin
    function(){ return self.time_passed(400); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.b.raining = 0; }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Told you it wouldn't last long!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Back to work, everybody!"); self.push_record("Rain will shift around fertilizer and nutrients in the soil- You'll have to add more fertilizer to get it back!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function(){ //end
      gg.b.rain_t = 0;
      gg.b.autorain = 1;
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'rain'});
    },
    tfunc, //shouldsim

  ];

  var tut_low_nutrients = [

    function(){ //begin
      gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'low_nutrients'});
      self.set_advisor(ADVISOR_TYPE_FARMER);
      for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++)
      {
        var t = gg.b.tile_groups[TILE_TYPE_FARM][i];
        if(t.nutrition < nutrition_desperate) { self.heap.t = t; break; }
      }
      self.takeover_ui(); self.takeover_time();
      self.push_blurb("Your farm has used up all the nutrition at its tile!");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("This farm will grow very slowly"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Maybe you can produce more fertilizer?"); self.push_record("When farm nutrients get low, they will produce crop very slowly. Add fertilizer to give them a boost.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'low_nutrients'});
    }, //end
    tfunc, //shouldsim

  ];

  var tut_bloom = [

    function(){ //begin
      gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'bloom'});
      self.set_advisor(ADVISOR_TYPE_MAYOR);
      for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_LAKE].length; i++)
      {
        var t = gg.b.tile_groups[TILE_TYPE_LAKE][i];
        if(gg.b.tile_in_bounds(t) && t.nutrition > water_fouled_threshhold) { self.heap.t = t; break; }
      }
      self.takeover_ui(); self.takeover_time();
      self.push_blurb("Uh oh. Looks like there's an algae bloom starting!");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Let's be careful to not make this worse!"); self.push_record("Your lake is so nutrient rich, it's causing an algae bloom! Yuck!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'bloom'});
    }, //end
    tfunc, //shouldsim

  ];

  var tut_delay_gross_again = [

    noop, //begin
    tfunc, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    function(){
      self.pool_thread(function(){
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];
          if(f.tile.type == TILE_TYPE_LAKE && f.tile.nutrition > water_fouled_threshhold) return 1;
        }
        return 0;
      }, tut_gross_again);
    }, //end
    tfunc, //shouldsim

  ];

  var tut_gross_again = [

    function(){ //begin
      gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'gross'});
      self.set_advisor(ADVISOR_TYPE_MAYOR);
      var f;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        f = gg.farmbits[i];
        if(f.tile.type == TILE_TYPE_LAKE && f.tile.nutrition > water_fouled_threshhold) { self.heap.f = f; break; }
      }
      self.takeover_ui(); self.takeover_time();
      self.push_blurb("Ew- now "+f.name+" is swimming in algae bloom.");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("This will make them sad."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); gg.shop.sign_btn.active = 1; self.push_blurb("Build signs to keep them away from the gross water!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); gg.shop.skimmer_btn.active = 1; self.push_blurb("Or, if you can afford it, clean the lake!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("That way everyone stays happy and ready to work!"); self.push_record("You can use signs to keep your townspeople away from gross water.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //qclick
    ffunc, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'gross'});
      self.pool_thread(function(){ return self.time_passed(3000); }, tut_delay_gross_again);
    }, //end
    tfunc, //shouldsim

  ];

  var tut_gross = [

    function(){ //begin
      gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'gross'});
      self.set_advisor(ADVISOR_TYPE_MAYOR);
      var f;
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        f = gg.farmbits[i];
        if(f.tile.type == TILE_TYPE_LAKE && f.tile.nutrition > water_fouled_threshhold) { self.heap.f = f; break; }
      }
      self.takeover_ui(); self.takeover_time();
      self.push_blurb("Ew- "+f.name+" is swimming in algae bloom.");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("This will make them sad."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); gg.shop.sign_btn.active = 1; self.push_blurb("Build signs to keep them away from the gross water!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("That way everyone stays happy and ready to work!"); self.push_record("You can use signs to keep your townspeople away from gross water.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'gross'});
      self.pool_thread(function(){ return self.time_passed(3000); }, tut_delay_gross_again);
    }, //end
    tfunc, //shouldsim

  ];

  var tut_death = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Oh no! One of your townspeople have died!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("It's your responsibility to make sure there is enough edible food to go around"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Maybe you need more farms? Or more fertilizer?"); self.push_record("A townsperson has died of hunger. Make sure you're producing enough food!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'death'});
    },
    tfunc, //shouldsim

  ];

  var tut_unattended_farm = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'unattended_farm'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.takeover_ui(); self.takeover_time(); self.push_blurb("One of your farms is ready for harvest."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("A field unharvested is a field that isn't producing more food!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Consider finding more townspeople to increase your town's efficiency."); self.push_record("If your farms aren't being harvested, consider building more housing to encourage population growth!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'unattended_farm'});
    },
    tfunc, //shouldsim

  ];

  var tut_unused_fertilizer = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'unused_fertilizer'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.takeover_ui(); self.takeover_time(); self.push_blurb("There's some unused manure laying around."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("That will slowly leech nutrients into the soil-"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("See if you can free up some people to fertilize your farms, so those nutrients get put to good use!"); self.push_record("Unused fertilizer will leech nutrients into the surrounding soil, even if that soil isn't farmland!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'unused_fertilizer'});
    },
    tfunc, //shouldsim

  ];

  var tut_flooded_fertilizer = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'flooded_fertilizer'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.takeover_ui(); self.takeover_time(); self.push_blurb("Oh no, it's raining and there's still fresh fertilizer on your farms!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("The rain might wash that fertilizer away."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Sadly, there's not much you can do to prevent it..."); self.push_record("Rain pushes fertilizer off of your farms. It's an unfortunate waste of nutrients...");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'flooded_fertilizer'});
    },
    tfunc, //shouldsim

  ];

  var tut_mass_sadness = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'mass_sadness'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.takeover_ui(); self.takeover_time(); self.push_blurb("Your townspeople are very sad!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("I'm sure they'd like to play in the water,"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("but maybe your lakes are overrun with disgusting algae?"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Find a way to keep them happy!"); self.push_record("The people of Lakeland need to swim to maintain morale! If your lake is gross, they won't work."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'mass_sadness'});
    },
    tfunc, //shouldsim

  ];

  var tut_long_travel = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'long_travel'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.takeover_ui(); self.takeover_time(); self.push_blurb("Some of your townspeople are taking a long time to deliver goods."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); gg.shop.road_btn.active = 1; self.push_blurb("Consider building some roads to cut down on travel time!"); self.push_record("Roads make for MUCH faster transportation. It could be the difference that makes for an efficient farming pipeline!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'long_travel'});
    },
    tfunc, //shouldsim

  ];

  var tut_another_death = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Oh no, you've lost another one!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("A gravestone will remember them forever"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_death'});
    },
    tfunc, //shouldsim

  ];

  var tut_another_member = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_member'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Someone else has moved in!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("Your town continues to grow!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_member'});
    },
    tfunc, //shouldsim

  ];

  var tut_final_death = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Everyone in your town has died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop,
    tfunc, //shouldsim

    function(){ self.push_blurb("This adventure has failed."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Better luck next time!"); self.push_record("You have no more townmembers! Your town has failed.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_death'});
    },
    tfunc, //shouldsim

  ];

  var tut_poop = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'poop'}); self.takeover_ui(); self.takeover_time(); self.push_blurb("You can use manure from livestock to reintroduce nutrition to the ground."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.items_exist(ITEM_TYPE_POOP,1);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("(your townmembers will do this automatically)"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.items_exist(ITEM_TYPE_POOP,1);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Consider manure an added perk- it will save money on importing fertilizer for your farms!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.items_exist(ITEM_TYPE_POOP,1);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.set_advisor(ADVISOR_TYPE_BUSINESS); self.takeover_ui(); self.takeover_time(); self.push_blurb("Buy more houses to grow your town!");self.push_record("Your townspeople will automatically use free manure to fertilize their farms. This is key to a profitable crop cycle!"); self.skip_btn.active = 0; }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.time_passed(1000); }, tut_rain);
      self.pool_thread(function(){
        for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++)
        {
          var t = gg.b.tile_groups[TILE_TYPE_FARM][i];
          if(t.nutrition < nutrition_desperate) return 1;
        }
        return 0;
      }, tut_low_nutrients);
      self.pool_thread(function(){
        for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_LAKE].length; i++)
        {
          var t = gg.b.tile_groups[TILE_TYPE_LAKE][i];
          if(gg.b.tile_in_bounds(t) && t.nutrition > water_fouled_threshhold) return 1;
        }
        return 0;
      }, tut_bloom);
      self.pool_thread(function(){
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];
          if(f.tile.type == TILE_TYPE_LAKE && f.tile.nutrition > water_fouled_threshhold) return 1;
        }
        return 0;
      }, tut_gross);
      self.pool_thread(function(){
        for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++)
          if(gg.b.tile_groups[TILE_TYPE_FARM][i].state == TILE_STATE_FARM_GROWN && gg.b.tile_groups[TILE_TYPE_FARM][i].state_t > 500) return 1;
        return 0;
      }, tut_unattended_farm);
      self.pool_thread(function(){
        for(var i = 0; i < gg.items.length; i++)
          if(gg.items[i].type == ITEM_TYPE_POOP && gg.items[i].t > 1000) return 1;
        return 0;
      }, tut_unused_fertilizer);
      self.pool_thread(function(){
        if(!gg.b.raining) return;
        for(var i = 0; i < gg.items.length; i++)
          if(gg.items[i].type == ITEM_TYPE_FERTILIZER) return 1;
        return 0;
      }, tut_flooded_fertilizer);
      self.pool_thread(function(){
        if(gg.farmbits.length < 4) return 0;
        var sad = 0;
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];
          if(f.joy_state == FARMBIT_STATE_DESPERATE) sad++;
        }
        if(sad/gg.farmbits.length > 0.9) return 1;
        return 0;
      }, tut_mass_sadness);
      self.pool_thread(function(){
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];
          if(f.job_state == JOB_STATE_GET && f.job_state_t > 500)
            return 1;
        }
        return 0;
      }, tut_long_travel);
      self.pool_thread(function(){
        return gg.b.tile_groups[TILE_TYPE_GRAVE].length > 10;
      }, tut_mayor_leave);
      self.pool_thread(function(){
        return gg.b.tile_groups[TILE_TYPE_GRAVE].length > 10;
      }, tut_farmer_leave);
      self.pool_thread(function(){
        return gg.b.tile_groups[TILE_TYPE_GRAVE].length > 10;
      }, tut_business_leave);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'poop'});
    },
    tfunc, //shouldsim

  ];

  var tut_livestock = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'livestock'}); self.set_advisor(ADVISOR_TYPE_BUSINESS); self.push_blurb("Good work!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("A Dairy farm can produce milk, which will sell for a great price!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("But you'll have to feed your livestock if you want any output"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Select some food, and toggle its switch to use it for \"feed\"."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Three feed should be enough to produce some milk!"); self.push_record("Feed your livestock to produce Milk."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.items_exist(ITEM_TYPE_POOP,1); }, tut_poop);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'livestock'});
    },
    tfunc, //shouldsim

  ];

  var tut_buy_livestock = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'buy_livestock'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("You seem to have corn production figured out."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Why not expand into the world of Dairy?"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.shop.livestock_btn.active = 1; self.push_blurb("Next, save up for some livestock."); self.push_record("Invest in livestock to start a dairy industry!");}, //begin
    ffunc, //tick
    function(){ //draw
      var b = gg.shop.livestock_btn;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.tiles_exist(TILE_TYPE_LIVESTOCK,1); }, tut_livestock);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'buy_livestock'});
    },
    tfunc, //shouldsim

  ];

  var tut_buy_fertilizer = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'buy_fertilizer'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.takeover_ui(); self.takeover_time(); self.push_blurb("Your farms are using up the nutrition in the soil."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.nutrition_toggle.toggle_btn.active = 1; self.takeover_ui(); self.takeover_time(); self.push_blurb("Click to toggle nutrition view"); }, //begin
    function(){ return gg.b.nutrition_view; }, //tick
    function(){ //draw
      self.wash();
      var b = gg.nutrition_toggle.toggle_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.larrow(b.x,b.y+b.h/2);
      gg.nutrition_toggle.draw();
    },
    function(evt) //qclick
    {
      var nt = gg.nutrition_toggle;
      if(doEvtWithin(evt,nt.x,nt.y,nt.w,nt.h)) gg.nutrition_toggle.toggle_btn.click(evt);
    },
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("The red represents the fertility of that soil."); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.shop.fertilizer_btn.active = 1; gg.money += fertilizer_cost; self.push_blurb("Buy some fertilizer to bump up your farm's soil nutrition!"); }, //begin
    function(){ gg.shop.keep_open(); return self.purchased(BUY_TYPE_FERTILIZER); }, //tick
    function(){ //draw
      var b = gg.shop.fertilizer_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Place the fertilizer on your farm"); },//begin
    function(){ return self.items_exist(ITEM_TYPE_FERTILIZER,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
    },
    noop, //qclick
    function(evt) //click
    {
      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else
        {
          gg.b.click(evt);
          self.jmp(2);
        }
        return 1;
      }
    },
    noop, //end
    tfunc, //shouldsim

    //can't build there
    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Can't place fertilizer there!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-1); return 1; }, //qclick
    ffunc, //click
    noop, //end
    ffunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("That should make your farm grow faster!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("See if you can save up enough money to buy another farm."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.tiles_exist(TILE_TYPE_FARM,2); }, tut_buy_livestock);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'buy_fertilizer'});
    },
    tfunc, //shouldsim

  ];

  var tut_sell_food = [

    function() { gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'sell_food'}); }, //begin
    function(){ return self.time_passed(40); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.set_advisor(ADVISOR_TYPE_BUSINESS); self.takeover_ui(); self.takeover_time(); self.push_blurb("Hello!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("I'll be advising you on matters of business."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function() { self.heap.i = self.items_exist(ITEM_TYPE_FOOD,1); self.takeover_ui(); self.takeover_time(); self.push_blurb("Your farm has produced more food than is needed!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Let's sell the surplus."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_time(); self.push_blurb("First, let's pause the game.");}, //begin
    function(){ return (gg.speed == SPEED_PAUSE); }, //tick
    function(){ //draw
      self.wash();
      var b = gg.bar.pause_btn;
      self.popup(TEXT_TYPE_DIRECT);
      gg.bar.draw();
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Next, click an item to select it."); },//begin
    function(){ gg.speed = SPEED_PAUSE; return gg.inspector.detailed_type == INSPECTOR_CONTENT_ITEM; }, //tick
    function(){ //draw
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Toggle the switch to mark it as \"for sale\"."); },//begin
    function(){ gg.speed = SPEED_PAUSE; var i = self.heap.i; gg.inspector.select_item(i); return self.marked_items_exist(ITEM_TYPE_FOOD,MARK_SELL,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
      var u = gg.inspector.tile_ui[TILE_TYPE_FARM];
      self.larrow(gg.inspector.x,u.autosell_0_y);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.takeover_ui(); self.takeover_time(); self.push_blurb((f ? f.name : 0)+" will eventually export this for sale!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("click Play to resume the game."); },//begin
    function(){ return gg.speed > SPEED_PAUSE; }, //tick
    function(){ //draw
      var b = gg.bar.play_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    noop, //begin
    function(){ return self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); var f = self.heap.f; self.push_blurb((f ? f.name : 0)+" is exporting the marked food"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("They'll be back soon with some money!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    noop, //begin
    function(){ return !self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); var f = self.heap.f; self.push_blurb((f ? f.name : 0)+" has returned!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("You just made $"+item_worth_food+"!");  self.push_record("Click on items and mark them as 'FOR SALE' to signal your townspeople to take those items to the market."); },//begin
    function(){ gg.shop.keep_open(); }, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(gg.shop.x+gg.shop.w,gg.shop.y+40);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++) { var t = gg.b.tile_groups[TILE_TYPE_FARM][i]; if(t && t.nutrition < nutrition_motivated) return 1; } return 0; }, tut_buy_fertilizer);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'sell_food'});
    },
    tfunc, //shouldsim

  ];

  var tut_timewarp = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'timewarp'}); self.set_advisor(ADVISOR_TYPE_MAYOR); gg.bar.unlock_all(); self.push_blurb("Click here to speed up time"); self.push_record("You can use the time controls at the top of the screen to zoom through boring waiting periods."); },//begin
    function() { return gg.speed > SPEED_PLAY; }, //tick
    function() { //draw
      self.wash();
      var b = gg.bar.fast_btn;
      self.popup(TEXT_TYPE_DIRECT);
      gg.bar.draw();
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    function() { //end
      gg.speed = SPEED_FAST;
      self.pool_thread(function(){ return self.items_exist(ITEM_TYPE_FOOD,1); }, tut_sell_food);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'timewarp'});
    },
    tfunc, //shouldsim

  ];

  var tut_build_a_farm = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'build_a_farm'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.takeover_ui(); self.takeover_time(); self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.push_blurb((f ? f.name : 0)+" ate the food you imported!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Your people are fed for now, but you can't afford to keep importing food."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("We need a sustainable strategy to feed our townmembers."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.money += farm_cost; gg.shop.farm_btn.active = 1; self.push_blurb("Let's buy a farm."); }, //begin
    function(){ gg.shop.keep_open(); return self.purchased(BUY_TYPE_FARM); }, //tick
    function(){ //draw
      var b = gg.shop.farm_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Place it somewhere near your home."); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_FARM,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
    },
    noop, //qclick
    function(evt) //click
    {
      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else
        {
          gg.b.click(evt);
          self.jmp(2);
        }
        return 1;
      }
    },
    noop, //end
    tfunc, //shouldsim

    //can't build there
    function(){ self.takeover_ui(); self.takeover_time(); self.push_blurb("Can't build a farm there!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-1); return 1; }, //qclick
    ffunc, //click
    noop, //end
    ffunc, //shouldsim

    function(){ self.heap.t = gg.b.tile_groups[TILE_TYPE_FARM][0]; if(self.heap.t) { self.heap.t.nutrition = max(self.heap.t.nutrition, nutrition_content*4); } self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.push_blurb((f ? f.name : 0)+" will automatically manage the farm."); self.push_record("Buy farms to produce food for your people!"); }, //begin
    ffunc, //tick
    function(){ //draw
      var t = self.heap.t;
      gg.b.screen_tile(t);
      self.camtotile(t);
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.time_passed(1000); }, tut_timewarp);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'build_a_farm'});
    },
    tfunc, //shouldsim

  ];

  var tut_buy_food = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'buy_food'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.takeover_ui(); self.push_blurb("Hi!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.push_blurb("I'm your farm advisor."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.push_blurb((f ? f.name : 0)+" will eventually need some food..."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.money += food_cost; gg.shop.food_btn.active = 1; self.push_blurb("Buy some food from the shop."); }, //begin
    function(){ gg.shop.keep_open(); return self.purchased(BUY_TYPE_FOOD); }, //tick
    function(){ //draw
      var b = gg.shop.food_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); self.push_blurb("Place it anywhere on the map."); },//begin
    function(){ self.camtotile(gg.b.center_tile); return self.items_exist(ITEM_TYPE_FOOD,1); }, //tick
    function(){ self.popup(TEXT_TYPE_DIRECT); }, //draw
    noop, //qclick
    function(evt) //click
    {
      if(self.evt_within_popup(evt)) return 1;

      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else
        {
          gg.b.click(evt);
          self.jmp(2);
        }
        return 1;
      }
    },
    noop, //end
    tfunc, //shouldsim

    //can't build there
    function(){ self.takeover_ui(); self.push_blurb("Can't place food there!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-1); return 1; }, //qclick
    ffunc, //click
    noop, //end
    ffunc, //shouldsim

    function(){ //begin
      self.heap.f = gg.farmbits[0];
      var f = self.heap.f;
      self.push_blurb((f ? f.name : 0)+" will automatically eat it when hungry.");
      self.push_record("Buy food to quickly feed your people.");
      if(f && f.fullness > fullness_content+max_fullness/50)
        f.fullness = floor(fullness_content+max_fullness/50);
    },
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return !self.items_exist(ITEM_TYPE_FOOD,1); }, tut_build_a_farm);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'buy_food'});
    },
    tfunc, //shouldsim

  ];

  var tut_extra_life = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'extra_life'}); self.set_advisor(ADVISOR_TYPE_MAYOR); }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Uh oh."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Looks like your town hasn't done so well..."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I think we can scrounge up enough investment to give you one more shot-"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.money += home_cost; self.push_blurb("Let's buy another house."); },//begin
    function(){ gg.shop.keep_open(); return self.purchased(BUY_TYPE_HOME) || self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(gg.shop.home_btn.x+gg.shop.home_btn.w+20,gg.shop.home_btn.y+gg.shop.home_btn.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); for(var i = 0; i < gg.b.tiles.length; i++) gg.b.tiles[i].owned = 1; self.push_blurb("Let's make this count!"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
    },
    noop, //qclick
    function(evt) //click
    {
      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else
        {
          for(var i = 0; i < gg.b.tiles.length; i++) gg.b.tiles[i].owned = 0;
          b.hover_t.owned = 1;
          gg.b.click(evt);
          self.jmp(2);
        }
        return 1;
      }
    },
    noop, //end
    function(){ /*auto build a home here*/ self.push_blurb("Let's make this count!"); return false; }, //shouldsim

    //can't build there
    function(){ self.push_blurb("Can't build a house there!"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(evt){ if(self.evt_within_popup(evt)) { self.jmp(-1); return 1; } return 0; }, //qclick
    ffunc, //click
    noop, //end
    ffunc, //shouldsim

    function(){ self.push_blurb("Someone should move in soon!"); },//begin
    function(){ return self.bits_exist(1); }, //tick
    function(){
      self.wash();
      var t = gg.b.tile_groups[TILE_TYPE_HOME][0];
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.hilight(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    }, //draw
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ if(gg.b.visit_t < 800) gg.b.visit_t = 800; self.push_blurb("Waiting..."); }, //begin
    function(){ return self.bits_exist(1); }, //tick
    function(){ //draw
      var t = gg.b.tile_groups[TILE_TYPE_HOME][0];
      gg.b.screen_tile(t);
      self.popup(TEXT_TYPE_OBSERVE);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){  //begin
      self.heap.f = gg.farmbits[0];
      var f = self.heap.f;
      if(f) gg.inspector.select_farmbit(f);
      self.push_blurb((f ? f.name : 0)+" moved into your town!");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Good luck!"); self.push_record("Build houses to get more townspeople!"); self.skip_btn.active = 1; },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'extra_life'});
      //remove other death notifs
      for(var i = 0; i < self.trigger_threads.length; i++)
      {
             if(self.trigger_threads[i] == tut_another_death) {           self.triggers.splice(i,1); self.trigger_threads.splice(i,1); i--; }
        else if(self.trigger_threads[i] == tut_death) { self.a_death = 0; self.triggers.splice(i,1); self.trigger_threads.splice(i,1); i--; }
      }
    },
    tfunc, //shouldsim

  ];

  var tut_build_a_house = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'build_a_house'}); self.set_advisor(ADVISOR_TYPE_MAYOR); }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("Oh, hi there!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("I'm the Mayor!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ gg.money += home_cost; self.push_blurb("Why dontcha buy your first house?"); },//begin
    function(){ gg.shop.keep_open(); return self.purchased(BUY_TYPE_HOME) || self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(gg.shop.home_btn.x+gg.shop.home_btn.w+20,gg.shop.home_btn.y+gg.shop.home_btn.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.takeover_ui(); for(var i = 0; i < gg.b.tiles.length; i++) gg.b.tiles[i].owned = 1; self.push_blurb("Place it somewhere near a lake- people love lakes!"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
    },
    noop, //qclick
    function(evt) //click
    {
      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else
        {
          for(var i = 0; i < gg.b.tiles.length; i++) gg.b.tiles[i].owned = 0;
          b.hover_t.owned = 1;
          gg.b.click(evt);
          self.jmp(2);
        }
        return 1;
      }
    },
    noop, //end
    function(){ /*auto build a home here*/ self.push_blurb("Place it somewhere near a lake- people love lakes!"); return false; }, //shouldsim

    //can't build there
    function(){ self.push_blurb("Can't build a house there!"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(evt){ if(self.evt_within_popup(evt)) { self.jmp(-1); return 1; } return 0; }, //qclick
    ffunc, //click
    noop, //end
    ffunc, //shouldsim

    function(){ self.push_blurb("Someone should move in soon!"); },//begin
    function(){ return self.bits_exist(1); }, //tick
    function(){
      self.wash();
      var t = gg.b.tile_groups[TILE_TYPE_HOME][0];
      gg.b.screen_tile(t);
      self.camtotile(t);
      self.hilight(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    }, //draw
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ if(gg.b.visit_t < 800) gg.b.visit_t = 800; self.push_blurb("Waiting..."); }, //begin
    function(){ return self.bits_exist(1); }, //tick
    function(){ //draw
      var t = gg.b.tile_groups[TILE_TYPE_HOME][0];
      gg.b.screen_tile(t);
      self.popup(TEXT_TYPE_OBSERVE);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    ffunc, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){  //begin
      self.heap.f = gg.farmbits[0];
      var f = self.heap.f;
      if(f) gg.inspector.select_farmbit(f);
      self.push_blurb((f ? f.name : 0)+" moved into your town!");
      self.pool_thread(function(){ return gg.farmbits.length == 0 && gg.money < 1000 && !self.tiles_exist(TILE_TYPE_HOME,1); }, tut_extra_life);
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_delay_adv_thread, //qclick
    ffunc, //click
    noop, //end
    tfunc, //shouldsim

    function(){ self.push_blurb("It's your job to ensure their survival!"); self.push_record("Build houses to get more townspeople!"); self.skip_btn.active = 1; },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.camtotile(f.tile);
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.confirm_adv_thread, //qclick
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.time_passed(1000); }, tut_buy_food);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'build_a_house'});
    },
    tfunc, //shouldsim

  ];

  self.first_thread = tut_build_a_house;
  self.pool_thread(tfunc,self.first_thread);

}

