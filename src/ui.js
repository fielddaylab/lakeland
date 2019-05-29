var ENUM;
ENUM = 0;
var BUY_TYPE_NULL       = ENUM; ENUM++;
var BUY_TYPE_HOME       = ENUM; ENUM++;
var BUY_TYPE_FARM       = ENUM; ENUM++;
var BUY_TYPE_FERTILIZER = ENUM; ENUM++;
var BUY_TYPE_LIVESTOCK  = ENUM; ENUM++;
var BUY_TYPE_STORAGE    = ENUM; ENUM++;
var BUY_TYPE_SIGN       = ENUM; ENUM++;
var BUY_TYPE_SKIMMER    = ENUM; ENUM++;
var BUY_TYPE_ROAD       = ENUM; ENUM++;
var BUY_TYPE_PROCESSOR  = ENUM; ENUM++;
var BUY_TYPE_DEMOLISH   = ENUM; ENUM++;
var BUY_TYPE_FESTIVAL   = ENUM; ENUM++;
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
var TEXT_TYPE_CONFIRM = ENUM; ENUM++;
var TEXT_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var ADVISOR_TYPE_NULL     = ENUM; ENUM++;
var ADVISOR_TYPE_MAYOR    = ENUM; ENUM++;
var ADVISOR_TYPE_BUSINESS = ENUM; ENUM++;
var ADVISOR_TYPE_FARMER   = ENUM; ENUM++;
var ADVISOR_TYPE_COUNT    = ENUM; ENUM++;

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
  if(on) gg.ctx.drawImage(coin_img,x+w-h,y-h/4,h,h*1.25);
  else   gg.ctx.drawImage(coin_img,x,    y-h/4,h,h*1.25);
}

var mark_pbar = function(x,y,w,h,t)
{
  gg.ctx.strokeStyle = red;
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

var bar = function()
{
  var self = this;
  self.btnh = 0;
  self.btnw = 0;
  self.drawery = 0;
  self.vignette_s = 0;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.btnh = gg.b.cbounds_y-self.pad*2;
    self.btnw = self.btnh;
    self.vignette_s = self.btnh*1.5;

    self.w = gg.canvas.width/2;
    self.h = (self.pad+self.btnh+self.pad)+self.pad+self.vignette_s+self.pad;
    self.x = gg.canvas.width/2-self.w/2;
    self.y = 0;

    self.drawery = self.y+self.btnh+self.pad*2;

    var btnx = gg.canvas.width/2-self.btnw/2-self.pad-self.btnw;
    var btny = self.y+self.pad;

    setBB(self.pause_btn, btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
    setBB(self.play_btn,  btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
    setBB(self.speed_btn, btnx,btny,self.btnw,self.btnh); btnx += self.btnw+self.pad;
  }

  self.pause_img = GenImg("assets/pause.png");
  self.play_img = GenImg("assets/play.png");
  self.speed_img = GenImg("assets/speed.png");

  self.pause_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = !RESUME_SIM; DOUBLETIME = 0; });
  self.play_btn  = new ButtonBox(0,0,0,0,function(){ if(!DOUBLETIME) RESUME_SIM = !RESUME_SIM; DOUBLETIME = 0; });
  self.speed_btn = new ButtonBox(0,0,0,0,function(){ RESUME_SIM = 1; DOUBLETIME = 1; });
  self.resize();

  self.pause_btn.active = 0;
  self.play_btn.active = 0;
  self.speed_btn.active = 0;

  self.drawer = 0;

  self.filter = function(filter)
  {
    var check = true;
    if(check && self.pause_btn.active) check = !filter.filter(self.pause_btn);
    if(check && self.play_btn.active)  check = !filter.filter(self.play_btn);
    if(check && self.speed_btn.active) check = !filter.filter(self.speed_btn);
    if(check)
    {
      if(!self.drawer) check = !filter.consumeif(self.x,self.y,self.w,self.drawery-self.y,self.click);
      else
      {
        var x = self.x+self.pad;
        var y = self.drawery+self.pad;
        for(var i = 0; check && i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];
          if(filter.check(x,y,self.vignette_s,self.vignette_s))
          {
            check = 0;
            gg.inspector.select_farmbit(f);
          }
          x += self.vignette_s+self.pad;
        }
        if(check) check = !filter.filter(self);
      }
    }
    return !check;
  }

  self.click = function()
  {
    self.drawer = !self.drawer;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    var fs = gg.font_size;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.textAlign = "left";

    if(self.drawer)
    {
      gg.ctx.fillStyle = white;
      fillRRect(self.x,self.drawery-self.pad,self.w,self.pad+self.pad+self.vignette_s+self.pad,self.pad,gg.ctx);
      var bigx = self.x;
      var x = self.x+self.pad;
      var y = self.drawery+self.pad;
      var r = self.vignette_s/2;
      for(var j = 0; j < 4; j++)
      {
        j = 3;
        var test = 0;
        y = self.drawery+self.pad;
        gg.ctx.fillStyle = black;
        bigx = self.x;
        /*
        switch(j)
        {
          case 0: bigx = self.x;            gg.ctx.fillText("HUNGRY",bigx,y); break;
          case 1: bigx = self.x+self.w/4;   gg.ctx.fillText("SLEEPY",bigx,y); break;
          case 2: bigx = self.x+self.w/2;   gg.ctx.fillText("SAD",bigx,y); break;
          case 3: bigx = self.x+self.w*3/4; gg.ctx.fillText("CONTENT",bigx,y); break;
        }
        */
        x = bigx+self.pad;
        for(var i = 0; i < gg.farmbits.length; i++)
        {
          var f = gg.farmbits[i];

          var pass = 1;
          switch(j)
          {
            case 0: if(f.fullness_state != FARMBIT_STATE_DESPERATE) pass = 0; break;
            case 1: if(f.energy_state   != FARMBIT_STATE_DESPERATE) pass = 0; break;
            case 2: if(f.joy_state      != FARMBIT_STATE_DESPERATE) pass = 0; break;
            case 3: if(f.fullness_state == FARMBIT_STATE_DESPERATE || f.energy_state == FARMBIT_STATE_DESPERATE || f.joy_state == FARMBIT_STATE_DESPERATE) pass = 0; break;
          }
          pass = 1;
          if(!pass) continue;

          gg.ctx.fillStyle = gg.backdrop_color;
          gg.ctx.beginPath();

          var str0 = "";
          var str1 = "";
          var stroke = gg.font_color;
          switch(f.job_type)
          {
            case JOB_TYPE_NULL:      str0 = "Nothing";     break;
            case JOB_TYPE_IDLE:      str0 = "Idle";        break;
            case JOB_TYPE_WAIT:      str0 = "Waiting";     break;
            case JOB_TYPE_EAT:       str0 = "Eating";      break;
            case JOB_TYPE_SLEEP:     str0 = "Sleeping";    break;
            case JOB_TYPE_PLAY:      str0 = "Playing";     break;
            case JOB_TYPE_PLANT:     str0 = "Planting";    break;
            case JOB_TYPE_HARVEST:   str0 = "Harvesting";  break;
            case JOB_TYPE_FEED:      str0 = "Feeding";     break;
            case JOB_TYPE_FERTILIZE: str0 = "Fertilizing"; break;
            case JOB_TYPE_MILK:      str0 = "Milking";     break;
            case JOB_TYPE_STORE:     str0 = "Storing";     break;
            case JOB_TYPE_PROCESS:   str0 = "Processing";  break;
            case JOB_TYPE_KICK:      str0 = "Kicking";     break;
            case JOB_TYPE_EXPORT:    str0 = "Exporting";   break;
            case JOB_TYPE_COUNT:     str0 = "BROKEN";      break;
          }

               if(f.fullness_state == FARMBIT_STATE_DESPERATE) { str1 = "HUNGRY"; stroke = red; }
          else if(f.energy_state   == FARMBIT_STATE_DESPERATE) { str1 = "SLEEPY"; stroke = red; }
          else if(f.joy_state      == FARMBIT_STATE_DESPERATE) { str1 = "SAD"; stroke = red; }
          else if(f.fullness_state == FARMBIT_STATE_MOTIVATED) str1 = "hungry";
          else if(f.energy_state   == FARMBIT_STATE_MOTIVATED) str1 = "sleepy";
          else if(f.joy_state      == FARMBIT_STATE_MOTIVATED) str1 = "sad";
          else                                                 str1 = "Content";
          gg.ctx.strokeStyle = stroke;

          gg.ctx.arc(x+r,y+r,r,0,twopi);
          gg.ctx.fill();
          gg.ctx.stroke();
          gg.ctx.fillStyle = black;
          gg.ctx.fillText(f.name,x,y+fs*3);
          gg.ctx.fillText(str0,x,y+fs*2);
          gg.ctx.fillText(str1,x,y+fs*1);

          x += r*2+self.pad;
          //y += r*2+self.pad;
        }
      }
    }

    gg.ctx.fillStyle = white;
    fillRRect(self.x,-self.pad,self.w,self.pad+self.btnh+self.pad*2,self.pad,gg.ctx);
    if(self.pause_btn.active) { if(RESUME_SIM)                 gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.pause_img,self.pause_btn,gg.ctx); }
    if(self.play_btn.active)  { if(!RESUME_SIM ||  DOUBLETIME) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.play_img, self.play_btn, gg.ctx); }
    if(self.speed_btn.active) { if(!RESUME_SIM || !DOUBLETIME) gg.ctx.globalAlpha = 0.5; else gg.ctx.globalAlpha = 1; drawImageBB(self.speed_img,self.speed_btn,gg.ctx); }
    gg.ctx.globalAlpha = 1;
    gg.ctx.fillStyle = gg.font_color;
    var x = self.x+self.pad;
    var y = self.y+self.pad+fs;
    var w = 150;

    //food
    var potential_rate = 0;
    var production_rate = 0;
    var edible_rate = 0;
    for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_FARM].length; i++)
    {
      var t = gg.b.tile_groups[TILE_TYPE_FARM][i];
      var t_rate = clamp(farm_nutrition_uptake_min,farm_nutrition_uptake_max,t.nutrition*farm_nutrition_uptake_p)/farm_nutrition_req;
      potential_rate += t_rate*2;
      if(t.state == TILE_STATE_FARM_PLANTED)
      {
        production_rate += t_rate*2;
        var mul = 2-(t.withdraw_lock+t.deposit_lock);
        if(mul) edible_rate += (t_rate)*mul;
      }
    }
    var permin = 60*60;
    potential_rate  *= permin;
    production_rate *= permin;
    edible_rate     *= permin;
    gg.ctx.fillText(fdisp(potential_rate) +" food/min (potential)",  x,y+fs*0);
    gg.ctx.fillText(fdisp(production_rate)+" food/min (production)", x,y+fs*1);
    gg.ctx.fillText(fdisp(edible_rate)    +" food/min (edible)",     x,y+fs*2);
    //gg.ctx.fillText(gg.food+" food", x,y);
    x += w;

    x = self.x+self.w-self.pad;
    //population
    x -= w;
    x -= w;
    gg.ctx.fillText(gg.farmbits.length+" farmers", x,y+fs*0);
    gg.ctx.fillText(fdisp(gg.farmbits.length*(1/(max_fullness-fullness_content))*permin)+" food/min", x,y+fs*1);
    //joy
    /*
    x -= w;
    if(gg.farmbits.length)
    {
      var sad = 0;
      for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].joy_state == FARMBIT_STATE_DESPERATE) sad++;
      gg.ctx.fillText(fdisp(sad/gg.farmbits.length)+"% sad", x,y);
    }
    else gg.ctx.fillText("0% sad", x,y);
    */

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

  self.tick = function()
  {

  }

  self.draw = function()
  {
    if(self.toggle_btn.active)
      draw_switch(self.toggle_btn.x,self.toggle_btn.y,self.toggle_btn.w,self.toggle_btn.h,gg.b.nutrition_view);
  }

}

var shop = function()
{
  var self = this;
  self.page_i = 0;
  self.open = 1;

  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;
    self.x = 0;
    self.y = 0;
    self.w = gg.b.cbounds_x-self.pad;
    self.h = gg.canvas.height;

    var btn_w = (self.w-self.pad*3)/2;
    var btn_h = self.h/8;
    var btn_x = self.pad;
    var btn_y = self.pad;

    self.font_size = self.pad*1.5;
    self.img_size = min(btn_w-self.pad*2,btn_h-self.pad*2-self.font_size*2);

    setBB(self.money_display, btn_x, btn_y, btn_w*2+self.pad, btn_h*3/4); btn_y += btn_h+self.pad;
    setBB(self.tab, self.x+self.w,btn_y,btn_w/2,btn_h/2);
    setBB(self.page, self.x+self.w,btn_y+btn_h,btn_w/2,btn_h/2);

    var biggest_y = 0;
    for(var i = 0; i < self.btns.length; i++)
    {
      btn_x = self.pad;
      btn_y = self.pad;
      btn_y += btn_h+self.pad;
      for(var j = 0; j < self.btns[i].length; j+=2)
      {
                                      setBB(self.btns[i][j],   btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
        if(j+1 < self.btns[i].length) setBB(self.btns[i][j+1], btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
      }
      if(btn_y > biggest_y) biggest_y = btn_y;
    }

    //others
    self.h = biggest_y-self.y;
    btn_y = biggest_y;
    setBB(self.money_btn,      btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
    setBB(self.abandon_btn,    btn_x,btn_y,btn_w,btn_h); btn_x = self.pad; btn_y += btn_h+self.pad;
    setBB(self.refund_btn,     btn_x,btn_y,btn_w,btn_h); btn_x += btn_w+self.pad;
  }

  self.money_img = GenImg("assets/money.png");

  self.buy_cost = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return home_cost; break;
      case BUY_TYPE_FARM:       return farm_cost; break;
      case BUY_TYPE_FERTILIZER: return fertilizer_cost; break;
      case BUY_TYPE_LIVESTOCK:  return livestock_cost; break;
      case BUY_TYPE_STORAGE:    return storage_cost; break;
      case BUY_TYPE_SIGN:       return sign_cost; break;
      case BUY_TYPE_SKIMMER:    return skimmer_cost; break;
      case BUY_TYPE_ROAD:       return road_cost; break;
      case BUY_TYPE_PROCESSOR:  return processor_cost; break;
      case BUY_TYPE_DEMOLISH:   return demolish_cost; break;
      case BUY_TYPE_FESTIVAL:   return festival_cost; break;
      default: return 0; break;
    }
  }

  self.buy_btn = function(buy)
  {
    switch(buy)
    {
      case BUY_TYPE_HOME:       return self.home_btn; break;
      case BUY_TYPE_FARM:       return self.farm_btn; break;
      case BUY_TYPE_FERTILIZER: return self.fertilizer_btn; break;
      case BUY_TYPE_LIVESTOCK:  return self.livestock_btn; break;
      case BUY_TYPE_STORAGE:    return self.storage_btn; break;
      case BUY_TYPE_SIGN:       return self.sign_btn; break;
      case BUY_TYPE_SKIMMER:    return self.skimmer_btn; break;
      case BUY_TYPE_ROAD:       return self.road_btn; break;
      case BUY_TYPE_PROCESSOR:  return self.processor_btn; break;
      case BUY_TYPE_DEMOLISH:   return self.demolish_btn; break;
      case BUY_TYPE_FESTIVAL:   return self.festival_btn; break;
      default: return 0; break;
    }
  }

  self.try_buy = function(buy)
  {
    var c = self.buy_cost(buy);
    if(gg.money < c) return;
    gg.money -= c;
    self.selected_buy = buy;
    var b = self.buy_btn(buy);
    self.refund_btn.x = b.x;
    self.refund_btn.y = b.y;
    self.refund_btn.w = b.w;
    self.refund_btn.h = b.h;
  }

  self.money_display = new BB();
  self.tab = new ButtonBox(0,0,0,0,function(){self.open = !self.open;});
  self.page = new ButtonBox(0,0,0,0,function(){self.page_i = (self.page_i+1)%2;});
  var b;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_HOME); });       self.home_btn       = b; b.img = home_img;       b.name = "Home";       b.cost = home_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_FARM); });       self.farm_btn       = b; b.img = farm_img;       b.name = "Farm";       b.cost = farm_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_FERTILIZER); }); self.fertilizer_btn = b; b.img = fertilizer_img; b.name = "Fertilizer"; b.cost = fertilizer_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_LIVESTOCK); });  self.livestock_btn  = b; b.img = livestock_img;  b.name = "Livestock";  b.cost = livestock_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_STORAGE); });    self.storage_btn    = b; b.img = storage_img;    b.name = "Storage";    b.cost = storage_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_SIGN); });       self.sign_btn       = b; b.img = sign_img;       b.name = "Sign";       b.cost = sign_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_SKIMMER); });    self.skimmer_btn    = b; b.img = skimmer_img;    b.name = "Skimmer";    b.cost = skimmer_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_ROAD); });       self.road_btn       = b; b.img = road_img;       b.name = "Road";       b.cost = road_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_PROCESSOR); });  self.processor_btn  = b; b.img = processor_img;  b.name = "Processor";  b.cost = processor_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_DEMOLISH); });   self.demolish_btn   = b; b.img = skull_img;      b.name = "Demolish";   b.cost = demolish_cost;
  b = new ButtonBox(0,0,0,0,function(){ self.try_buy(BUY_TYPE_FESTIVAL); });   self.festival_btn   = b; b.img = festival_img;   b.name = "Festival";   b.cost = festival_cost;

  b = new ButtonBox(0,0,0,0,function(){ gg.money += free_money; }); self.money_btn = b; b.img = coin_img; b.name = "Free"; b.cost = -free_money;
  b = new ButtonBox(0,0,0,0,function(){ for(var i = 0; i < gg.farmbits.length; i++) gg.farmbits[i].abandon_job(); }); self.abandon_btn = b;
  b = new ButtonBox(0,0,0,0,function(){ gg.money += self.buy_cost(self.selected_buy); self.selected_buy = 0; }); self.refund_btn = b; b.img = coin_img; b.name = "Refund"; b.cost = 0;

  self.btns = [
    [
      self.home_btn,
      self.farm_btn,
      self.livestock_btn,
      self.fertilizer_btn,
      //self.storage_btn,
      self.skimmer_btn,
      self.sign_btn,
      self.road_btn,
      //self.processor_btn,
      //self.demolish_btn,
    ],
    [
      self.festival_btn,
    ],
  ];
  if(debug) self.btns[0].push(self.money_btn);

  self.resize();

  self.selected_buy = 0;

  self.home_btn.active = 1;
  self.farm_btn.active = 0;
  self.fertilizer_btn.active = 0;
  self.livestock_btn.active = 0;
  self.storage_btn.active = 0;
  self.sign_btn.active = 0;
  self.skimmer_btn.active = 0;
  self.road_btn.active = 0;
  self.processor_btn.active = 0;
  self.demolish_btn.active = 0;
  self.money_btn.active = 0;
  self.abandon_btn.active = 0;
  self.refund_btn.active = 1;

  self.festival_btn.active = 0;

  self.filter = function(filter)
  {
    if(gg.b.spewing_road) return;
    var check = true;
    if(!self.selected_buy)
    {
      if(check) check = !filter.filter(self.tab);
      if(self.festival_btn.active) if(check) check = !filter.filter(self.page);
      if(self.open)
      {
        for(var i = 0; i < self.btns[self.page_i].length; i++)
        {
          if(check && self.btns[self.page_i][i].active) check = !filter.filter(self.btns[self.page_i][i]);
        }
      }
    }
    else
      if(check && self.refund_btn.active) check = !filter.filter(self.refund_btn);
    return !check;
  }

  self.tick = function()
  {
    if(self.open)
    {
      if(self.x < 1) self.x = lerp(self.x,0,0.15);
      else self.x = 0;
    }
    else
    {
      if(self.x > -self.w) self.x = lerp(self.x,-self.w,0.15);
      else self.x = -self.w;
    }
    self.tab.x = self.x+self.w;
    self.page.x = self.x+self.w;
  }

  self.draw_btn = function(bb,buying)
  {
    if(!bb.active) return;
    var old_x = bb.x;
    bb.x += self.x;
    if(gg.money < bb.cost || self.selected_buy) gg.ctx.globalAlpha = 0.5;
    if(buying) gg.ctx.globalAlpha = 1;
    gg.ctx.fillStyle = gg.backdrop_color;
    fillRBB(bb,self.pad,gg.ctx);
    gg.ctx.strokeStyle = gg.font_color;
    gg.ctx.fillStyle = gg.font_color;
    if(buying) gg.ctx.stroke();

    gg.ctx.fillText(bb.name,bb.x+bb.w/2, bb.y+bb.h-self.pad-self.font_size);
    gg.ctx.drawImage(bb.img,bb.x+bb.w/2-self.img_size/2,bb.y+self.pad-self.img_size/2,self.img_size,self.img_size*1.5);
    if(bb.cost)
    {
      if(!gg.money >= bb.cost) gg.ctx.fillStyle = red;
      if(bb.cost < 0) gg.ctx.fillText("+$"+(-bb.cost), bb.x+bb.w/2, bb.y+bb.h-self.pad);
      else         gg.ctx.fillText("$"+bb.cost, bb.x+bb.w/2, bb.y+bb.h-self.pad);
      gg.ctx.drawImage(self.money_img,bb.x+self.pad/2,bb.y+bb.h-self.pad*0.8-self.font_size,self.font_size,self.font_size);
    }
    gg.ctx.globalAlpha = 1;
    bb.x = old_x;
  }

  self.draw = function()
  {
    gg.ctx.font = gg.font_size+"px "+gg.font;
    gg.ctx.strokeStyle = black;

    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.tab.x-self.pad,self.tab.y,self.tab.w+self.pad,self.tab.h,self.pad,gg.ctx);
    if(self.festival_btn.active) fillRRect(self.page.x-self.pad,self.page.y,self.page.w+self.pad,self.page.h,self.pad,gg.ctx);
    fillRRect(self.x-self.pad,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);
    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    var fs = self.money_display.h*0.7;
    gg.ctx.font = fs+"px "+gg.font;
    if(self.open) gg.ctx.fillText("<",self.tab.x+self.tab.w/2,self.tab.y+self.tab.h);
    else          gg.ctx.fillText(">",self.tab.x+self.tab.w/2,self.tab.y+self.tab.h);
    if(self.festival_btn.active)
    {
      fs = self.money_display.h*0.3;
      gg.ctx.font = fs+"px "+gg.font;
      gg.ctx.fillText("Page",self.page.x+self.page.w/2,self.page.y+self.page.h*0.4);
      gg.ctx.fillText(self.page_i+1,self.page.x+self.page.w/2,self.page.y+self.page.h);
    }
    fs = self.money_display.h*0.7;
    gg.ctx.font = fs+"px "+gg.font;

    gg.ctx.textAlign = "left";

    gg.ctx.drawImage(self.money_img, self.money_display.x,self.money_display.y,self.money_display.h,self.money_display.h);
    gg.ctx.fillText("$"+gg.money,self.money_display.x+self.money_display.h,self.money_display.y+self.money_display.h*4/5);
    fs = self.money_display.h*0.2;
    gg.ctx.font = fs+"px "+gg.font;
    //gg.ctx.fillText(gg.farmbits.length+" farmers", self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*2);
    //gg.ctx.fillText(gg.hungry+" hungry",           self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*3);
    //gg.ctx.fillText(gg.food+" available food",     self.money_display.x+self.money_display.w*1.3,self.money_display.y+fs*4);
    gg.ctx.strokeStyle = gg.backdrop_color;
    var x = self.x+self.pad;
    var y = self.money_display.y+self.money_display.h+self.pad;
    gg.ctx.lineWidth = self.pad/2;
    drawLine(x,y,self.x+self.w-self.pad,y,gg.ctx);

    var fs = self.font_size;
    gg.ctx.font = fs+"px "+gg.font;
    gg.ctx.textAlign = "center";
    for(var i = 0; i < self.btns[self.page_i].length; i++)
      self.draw_btn(self.btns[self.page_i][i],0);

    //self.draw_btn(self.money_btn,   coin_img,        "Free Money", self.money_btn.active,   !self.selected_buy, -free_money, 1, 0);
    //self.draw_btn(self.abandon_btn, farmbit_imgs[0], "Abandon",    self.abandon_btn.active, (!self.selected_buy&&gg.inspector.detailed_type == INSPECTOR_CONTENT_FARMBIT), 0, 1, 0);
    if(self.selected_buy) { self.refund_btn.cost = self.buy_cost(self.selected_buy); self.draw_btn(self.refund_btn, 1); }

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

    self.vignette_x = self.x+self.pad*2;
    self.vignette_y = self.y+self.pad*2;
    self.vignette_w = self.w-self.pad*4;
    self.vignette_h = self.vignette_w;
  }
  self.resize();

  self.detailed = 0;
  self.detailed_type = INSPECTOR_CONTENT_NULL;
  self.known_nutrition = 0;
  self.nutrition_delta_t = 0;
  self.nutrition_delta_d = 0;
  self.quick = 0;
  self.quick_type = INSPECTOR_CONTENT_NULL;

  self.item_sell_y = 0;
  self.farm_autosell_y = 0;

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
    var y = self.vignette_y+self.vignette_h;

    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    self.img_vignette(gg.b.tile_img(t.og_type),1);
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
        self.img_vignette(bloom_img,1);
        gg.ctx.globalAlpha = 1;
      }
    }
    y += self.pad;

    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.textAlign = "center";

    //title
    gg.ctx.font = self.title_font_size+"px "+gg.font;
    y += self.title_font_size;
    gg.ctx.fillText(gg.b.tile_name(t.type),cx,y);
    y += self.pad;

    //subtitle
    switch(t.type)
    {
      case TILE_TYPE_HOME:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        y += self.subtitle_font_size;
        switch(t.state)
        {
          case TILE_STATE_HOME_VACANT:   gg.ctx.fillText("VACANT",cx,y); break;
          case TILE_STATE_HOME_OCCUPIED:
          {
            var b = 0;
            for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].home == t) b = gg.farmbits[i];
            if(b) gg.ctx.fillText("Owner: "+b.name,cx,y);
            else  gg.ctx.fillText("Owner: unknown",cx,y);
          }
          break;
        }
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
      case TILE_TYPE_FARM:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        y += self.subtitle_font_size;
        switch(t.state)
        {
          case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillText("Needs Water",cx,y);        break;
          case TILE_STATE_FARM_PLANTED:   gg.ctx.fillText("Growing",cx,y);            break;
          case TILE_STATE_FARM_GROWN:     gg.ctx.fillText("Ready for Harvest!",cx,y); break;
        }
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
      case TILE_TYPE_LIVESTOCK:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        y += self.subtitle_font_size;
        switch(t.state)
        {
          case TILE_STATE_LIVESTOCK_DIGESTING: gg.ctx.fillText("Digesting",cx,y);          break;
          case TILE_STATE_LIVESTOCK_MILKING:   gg.ctx.fillText("Producing Milk",cx,y);     break;
          case TILE_STATE_LIVESTOCK_MILKABLE:  gg.ctx.fillText("Ready For Milking!",cx,y); break;
        }
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_STORAGE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_COUNT:
      {
        gg.ctx.font = self.subtitle_font_size+"px "+gg.font;
        y += self.subtitle_font_size;
        gg.ctx.fillText(gg.b.tile_name(t.type),cx,y);
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
    }

    gg.ctx.font = self.font_size+"px "+gg.font;

    //production
    switch(t.type)
    {
      case TILE_TYPE_FARM:
      {
        y += self.font_size;
        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Produces:",self.x+self.pad,y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText("2 Corn",self.x+self.w-self.pad,y);
        gg.ctx.textAlign = "center";
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
      case TILE_TYPE_LIVESTOCK:
      {
        y += self.font_size;
        gg.ctx.textAlign = "left";
        gg.ctx.fillText("Produces:",self.x+self.pad,y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText("Milk,Poop",self.x+self.w-self.pad,y);
        gg.ctx.textAlign = "center";
        y += self.pad;
        self.line(y);
        y += self.pad;
      }
        break;
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_STORAGE:
      case TILE_TYPE_SIGN:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_COUNT:
      case TILE_TYPE_HOME:
        break;
    }

    //special
    switch(t.type)
    {
      case TILE_TYPE_FARM:
      {
        gg.ctx.textAlign = "left";
        y += self.font_size;
        gg.ctx.fillText("Export Options:",self.x+self.pad,y);
        y += self.pad;

        self.farm_autosell_y = y;

        var sw = self.w/2-self.pad*2;
        var sh = self.w/2;
        var sx = self.x+self.pad;
        var sy = self.farm_autosell_y;

        var tw = self.w/2-self.pad*4;
        var th = sh/4;
        var tx = sx+self.pad;
        var ty = sy+sh-th-self.pad;

        var iw = tw;
        var ih = iw*1.25;
        var ix = tx;
        var iy = sy;

        if(t.withdraw_lock) gg.ctx.fillStyle = "#CDE1A9";
        else                gg.ctx.fillStyle = "#BAEDE1";
        fillRRect(sx,sy,sw,sh,self.pad,gg.ctx);
        draw_money_switch(tx,ty,tw,th,t.withdraw_lock);
        gg.ctx.drawImage(food_img,ix,iy,iw,ih);
        if(t.withdraw_lock) { gg.ctx.fillStyle = black; gg.ctx.fillText("4 SALE",tx,ty); }

        sx = self.x+self.w/2+self.pad/2;
        tx = sx+self.pad;
        ix = tx;

        if(t.deposit_lock) gg.ctx.fillStyle = "#CDE1A9";
        else               gg.ctx.fillStyle = "#BAEDE1";
        fillRRect(sx,sy,sw,sh,self.pad,gg.ctx);
        draw_money_switch(tx,ty,tw,th,t.deposit_lock);
        gg.ctx.drawImage(food_img,ix,iy,iw,ih);
        if(t.deposit_lock) { gg.ctx.fillStyle = black; gg.ctx.fillText("4 SALE",tx,ty); }

        gg.ctx.fillStyle = gg.font_color;
        y += self.w/2;
        y += self.pad;

      }
        break;
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_HOME:
      case TILE_TYPE_LIVESTOCK:
      case TILE_TYPE_STORAGE:
        break;
    }

    //nutrition
    switch(t.type)
    {
      case TILE_TYPE_FARM:
      {
        var rg = t.val/farm_nutrition_req;
        if(t.state == TILE_STATE_FARM_UNPLANTED) rg = 0;
        if(t.state == TILE_STATE_FARM_GROWN)     rg = 1;

        gg.ctx.fillStyle = vlight_gray;
        fillRRect(self.x,y,self.w,self.y+self.h-y,self.pad,gg.ctx);
        y += self.font_size;
        gg.ctx.fillStyle = gg.font_color;

        gg.ctx.textAlign = "left";
        //y += self.font_size;
        //gg.ctx.fillText("Nutrition:",self.x+self.pad,y);
        //y += self.pad;

        y += self.font_size;
        gg.ctx.fillText("Growth:",self.x+self.pad,y);
        gg.ctx.textAlign = "right";
        gg.ctx.fillText(floor(rg*100)+"%",self.x+self.w-self.pad,y);
        y += self.pad;

        draw_custom_pbar(self.x+self.pad,y,self.w-self.pad*2,self.pad,"#B5D87A","#83AE43",rg);
        gg.ctx.fillStyle = gg.font_color;
        y += self.pad;
        y += self.pad;
      }
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
      case TILE_TYPE_SIGN:
      case TILE_TYPE_ROAD:
      case TILE_TYPE_COUNT:
      case TILE_TYPE_NULL:
      case TILE_TYPE_LAND:
      case TILE_TYPE_ROCK:
      case TILE_TYPE_GRAVE:
      case TILE_TYPE_SHORE:
      case TILE_TYPE_FOREST:
      case TILE_TYPE_LAKE:
      case TILE_TYPE_HOME:
      case TILE_TYPE_PROCESSOR:
      case TILE_TYPE_LIVESTOCK:
        break;
    }

    if(t.type == TILE_TYPE_FARM || t.fertilizer)
    {
      var x = self.x+self.pad;
      y += self.font_size;
      gg.ctx.textAlign = "left";
      gg.ctx.fillText("Applied Fertilizer:",self.x+self.pad,y);
      y += self.pad;
      if(t.fertilizer)
      {
        draw_custom_pbar(x,y,self.pad*3,self.pad,"#D2C8BB","#704617",(t.fertilizer.state%fertilizer_nutrition)/fertilizer_nutrition);
        x += self.pad*3;
        for(var j = 0; (j+1)*fertilizer_nutrition < t.fertilizer.state; j++)
        {
          draw_custom_pbar(x,y,self.pad*3,self.pad,"#D2C8BB","#704617",1);
          x += self.pad*3;
        }
        y += self.pad*2;
      }
      else
      {
        y += self.pad;
        if(!t.fertilizer) gg.ctx.fillText("[None]",self.x+self.pad,y);
        y += self.pad;
      }
    }

    if(self.known_nutrition > n) { self.nutrition_delta_d = -1; self.nutrition_delta_t = 10; }
    if(self.known_nutrition < n) { self.nutrition_delta_d =  1; self.nutrition_delta_t = 10; }
    if(self.nutrition_delta_t)
    {
      self.nutrition_delta_t--;
      var as = 50*gg.stage.s_mod;
      if(self.nutrition_delta_d < 0)
      {
        gg.ctx.fillStyle = red;
        gg.ctx.drawImage(down_img,x-as/2,y-self.nutrition_delta_t-as/2,as,as);
      }
      else if(self.nutrition_delta_d > 0)
      {
        gg.ctx.fillStyle = green;
        gg.ctx.drawImage(up_img,x-as/2,y+self.nutrition_delta_t-as/2,as,as);
      }
    }
    self.known_nutrition = n;

    y += self.font_size;
    gg.ctx.textAlign = "left";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.fillText("Nutrition:",self.x+self.pad,y);
    gg.ctx.textAlign = "right";
    gg.ctx.fillText(n+"%",self.x+self.w-self.pad,y);
    y += self.pad;

    draw_custom_pbar(self.x+self.pad, y, self.w-self.pad*2, self.pad, light_gray, t.nutrition > water_fouled_threshhold ? red : gg.backdrop_color, bias1(rn/100));
    if(t.type == TILE_TYPE_LAKE) mark_pbar(self.x+self.pad, y, self.w-self.pad*2, self.pad, bias1(water_fouled_threshhold/nutrition_max));
    gg.ctx.fillStyle = gg.font_color;
    y += self.pad;
    y += self.pad;

    return y;
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
      case TILE_TYPE_STORAGE:
      {
        y += self.pad+self.font_size;
        y += self.pad+self.font_size;
        y += self.pad+self.font_size;
      }
    }
    y += self.pad+self.font_size;

    return y;
  }

  self.filter_tile = function(clicker,t)
  {
    if(t.type == TILE_TYPE_FARM)
    {
      if(clicker.consumeif(self.x,         self.farm_autosell_y,self.w/2,self.w/2,function(){t.withdraw_lock = !t.withdraw_lock;})) return 1;
      if(clicker.consumeif(self.x+self.w/2,self.farm_autosell_y,self.w/2,self.w/2,function(){t.deposit_lock  = !t.deposit_lock; })) return 1;
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
    //bg
    gg.ctx.fillStyle = white;
    fillRRect(self.x,self.y,self.w+self.pad,self.h,self.pad,gg.ctx);

    self.img_vignette(gg.b.tile_img(it.tile.type),1);
    self.img_vignette(gg.b.item_img(it.type),1);

    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.font = self.font_size+"px "+gg.font;
    var x = self.x+self.w/2;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    gg.ctx.fillText(gg.b.item_name(it.type),x,y);
    y += self.pad;

    self.line(y);
    y += self.pad+self.font_size;

    gg.ctx.textAlign = "left";
    gg.ctx.fillStyle = gg.font_color;
    gg.ctx.fillText("For Sale:",self.x+self.pad,y);
    self.item_sell_y = y;
    draw_switch(self.x+self.w/2,self.item_sell_y,self.w/2-self.pad,self.w/6,it.sale);
    gg.ctx.fillStyle = gg.font_color;
    y += self.w/4+self.pad;
    return y;
  }

  self.tick_item = function(it)
  {
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    //gg.ctx.fillText(gg.b.item_name(it.type),x,y);
    y += self.pad;

    y += self.pad+self.font_size;

    if(it.sale)
    {
    //gg.ctx.fillText("Marked for Sale",x,y);
    y += self.pad+self.font_size;
    }

    return y;
  }

  self.filter_item = function(clicker,it)
  {
    if(clicker.consumeif(self.x+self.w/2,self.item_sell_y,self.w/2,self.w/4,function(){
      it.sale = !it.sale;
      if(it.lock)
      {
        var f = farmbit_with_item(it);
        if(f)
        {
               if(f.job_type == JOB_TYPE_EXPORT && !it.sale) f.abandon_job(0);
          else if(f.job_type != JOB_TYPE_EXPORT &&  it.sale) f.abandon_job(0);
        }
      }
      if(!it.lock && it.sale)
        b_for_job(JOB_TYPE_EXPORT, 0, it);
    })) return 1;

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
    gg.ctx.fillText("Energy:",x,y);
    y += self.pad+self.font_size;
    gg.ctx.fillText("Joy:",x,y);
    y += self.pad+self.font_size;
    /*
    gg.ctx.fillText("Fulfillment:",x,y);
    y += self.pad+self.font_size;
    */

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

    switch(b.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   gg.ctx.fillStyle = green;  break;
      case FARMBIT_STATE_MOTIVATED: gg.ctx.fillStyle = yellow; break;
      case FARMBIT_STATE_DESPERATE: gg.ctx.fillStyle = red;    break;
    }
    gg.ctx.fillText(floor(b.energy/max_energy*10)+"/10",x,y);
    y += self.pad+self.font_size;

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
    return;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    //gg.ctx.fillText(b.name,x,y);
    y += self.pad;

    y += self.pad+self.font_size;

    //gg.ctx.fillText("Status:",x,y);
    y += self.pad+self.font_size;

    //gg.ctx.fillText("Fullness:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Energy:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Joy:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Fulfillment:",x,y);
    y += self.pad+self.font_size;

    y += self.pad+self.font_size;

    return y;
  }

  self.filter_farmbit = function(clicker,b)
  {
    return 0;
    var y = self.vignette_y+self.vignette_h+self.pad+self.font_size;
    //gg.ctx.fillText(b.name,x,y);
    y += self.pad;

    y += self.pad+self.font_size;

    //gg.ctx.fillText("Status:",x,y);
    y += self.pad+self.font_size;

    //gg.ctx.fillText("Fullness:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Energy:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Joy:",x,y);
    y += self.pad+self.font_size;
    //gg.ctx.fillText("Fulfillment:",x,y);
    y += self.pad+self.font_size;

    y += self.pad+self.font_size;

    return 0;
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
    self.pad = 10*gg.stage.s_mod;
    self.x = gg.b.cbounds_x+gg.b.cbounds_w+self.pad;
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
    return;
    self.feed.push(txt);
    self.feed_t.push(0);
  }

  self.tick = function()
  {
    return;
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
    return;
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

var achievements = function()
{
  var self = this;
  self.open = 0;
  self.resize = function()
  {
    self.pad = 10*gg.stage.s_mod;

    self.w = gg.canvas.width/2;
    self.h = self.w;
    self.x = gg.canvas.width/2-self.w/2;
    self.y = gg.canvas.height/2-self.h/2;

    self.open_btn.w = 100;
    self.open_btn.h = 100;
    self.open_btn.x = self.pad;
    self.open_btn.y = gg.canvas.height-self.pad-self.open_btn.h;
  }
  self.open_btn = new ButtonBox(0,0,0,0,function(){ self.open = !self.open; });
  self.resize();

  self.triggers = [];
  self.nullt = {name:"null",local:0,global:0,trigger:ffunc};
  self.pushtrigger = function(name,offimg,onimg,fn)
  {
    self.triggers.push({name:name,offimg:offimg,onimg:onimg,global:0,local:0,trigger:fn});
  }

  self.notifs = [];
  self.notif_ts = [];

  self.pushtrigger("Exist",farmbit_imgs[0][0][0],farmbit_imgs[0][0][0],function(){return gg.farmbits.length;});
  self.pushtrigger("Group",farmbit_imgs[0][0][0],farmbit_imgs[0][0][0],function(){return gg.farmbits.length >= 3;});
  self.pushtrigger("Town",farmbit_imgs[0][0][0],farmbit_imgs[0][0][0],function(){return gg.farmbits.length >= 5;});
  self.pushtrigger("City",farmbit_imgs[0][0][0],farmbit_imgs[0][0][0],function(){return gg.farmbits.length >= 10;});

  self.pushtrigger("Farmer",farm_img,farm_img,function(){return gg.b.tile_groups[TILE_TYPE_FARM].length;});
  self.pushtrigger("Farmers",farm_img,farm_img,function(){return gg.b.tile_groups[TILE_TYPE_FARM].length >= 3;});
  self.pushtrigger("Farmtown",farm_img,farm_img,function(){return gg.b.tile_groups[TILE_TYPE_FARM].length >= 5;});
  self.pushtrigger("MegaFarm",farm_img,farm_img,function(){return gg.b.tile_groups[TILE_TYPE_FARM].length >= 10;});

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
  }

  self.tick = function()
  {
    var t;
    for(var i = 0; i < self.triggers.length; i++)
    {
      t = self.triggers[i];
      if(!t.local && t.trigger())
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
    gg.ctx.fillStyle = white;
    fillRBB(self.open_btn,self.pad,gg.ctx);
    gg.ctx.fillStyle = black;
    gg.ctx.textAlign = "left";
    gg.ctx.fillText("Achievements",self.open_btn.x,self.open_btn.y+self.open_btn.h);
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
          if(!t) t = self.nullt;
          if(t.local) gg.ctx.fillStyle = red;
          else        gg.ctx.fillStyle = gray;
          fillRRect(x,y,s,s,self.pad,gg.ctx);
          if(t.local && t.onimg) gg.ctx.drawImage(t.onimg,x,y,s,s);
          else if(t.offimg)      gg.ctx.drawImage(t.offimg,x,y,s,s);
          gg.ctx.fillStyle = black;
          gg.ctx.fillText(t.name,x+s/2,y+s);
          x += s+self.pad;
        }
        y += s+self.pad;
      }
    }
    for(var i = 0; i < self.notifs.length; i++)
    {
      gg.ctx.fillStyle = black;
      var offy = bounceup(self.notif_ts[i]/200)*50*gg.stage.s_mod;
      gg.ctx.fillText("Achievement!",gg.canvas.width/2,gg.canvas.height/2-gg.font_size-offy);
      gg.ctx.fillText(self.notifs[i].name,gg.canvas.width/2,gg.canvas.height/2-offy);
    }
  }

}

var advisors = function()
{
  var self = this;
  self.resize = function()
  {
    self.x = 0;
    self.y = 0;
    self.w = gg.canvas.width;
    self.h = gg.canvas.height;
    self.popup_w = 200*gg.stage.s_mod;
    self.font_size = gg.font_size;
    self.font = self.font_size+"px "+gg.font;
    self.title_font_size = self.font_size*1.5;
    self.title_font = self.title_font_size+"px "+gg.font;
  }
  self.resize();

  self.bgc = "#9DE7E5";
  self.fgc = "#1A355D";

  var ENUM = 0;
  var THREADF_TYPE_BEGIN = ENUM; ENUM++;
  var THREADF_TYPE_TICK  = ENUM; ENUM++;
  var THREADF_TYPE_DRAW  = ENUM; ENUM++;
  var THREADF_TYPE_CLICK = ENUM; ENUM++;
  var THREADF_TYPE_END   = ENUM; ENUM++;
  var THREADF_TYPE_COUNT = ENUM; ENUM++;

  self.mayor_active    = 0;
  self.business_active = 0;
  self.farmer_active   = 0;

  self.popup_h = 0;
  self.target_popup_h = 0;

  self.triggers = [];
  self.trigger_threads = [];

  self.mayor_history        = [];
  self.mayor_fmt_history    = [];
  self.mayor_records = [];
  self.mayor_fmt_records = [];
  self.business_history     = [];
  self.business_fmt_history = [];
  self.business_records = [];
  self.business_fmt_records = [];
  self.farmer_history       = [];
  self.farmer_fmt_history   = [];
  self.farmer_records = [];
  self.farmer_fmt_records = [];

  self.takeover = 0;
  self.advisor = ADVISOR_TYPE_NULL;
  self.thread = 0;
  self.thread_i = 0;
  self.thread_t = 0;

  self.preview = 0;
  self.preview_off_y = 0;

  //queries
  self.time_passed      = function(t) { return self.thread_t >= t; }
  self.bits_exist       = function(n) { return gg.farmbits.length >= n; }
  self.bits_hungry      = function(n) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].fullness_state < FARMBIT_STATE_MOTIVATED) n--; return n <= 0; }
  self.bits_job         = function(type,state) { for(var i = 0; i < gg.farmbits.length; i++) if(gg.farmbits[i].job_type == type && gg.farmbits[i].job_state == state) return 1; return 0; }
  self.tiles_exist      = function(type,n) { return gg.b.tile_groups[type].length >= n; }
  self.items_exist      = function(type,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.sale_items_exist = function(type,n) { for(var i = 0; i < gg.items.length; i++) if(gg.items[i].type == type && gg.items[i].sale) { n--; if(n <= 0) return gg.items[i]; } return n <= 0; }
  self.purchased        = function(type) { return gg.shop.selected_buy == type; }

  //transitions
  self.dotakeover = function(){self.takeover = 1;}

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
    var t = (self.thread_t%100)/100;
    gg.ctx.globalAlpha = min(1,self.thread_t/30);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    drawArrow(x-30*gg.stage.s_mod,y-29*gg.stage.s_mod,x,y,8*gg.stage.s_mod,gg.ctx);
    gg.ctx.globalAlpha = 1;
  }
  self.arrow = function(x,y)
  {
    var t = (self.thread_t%100)/100;
    gg.ctx.globalAlpha = min(1,self.thread_t/30);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    drawArrow(x+30*gg.stage.s_mod,y-29*gg.stage.s_mod,x,y,8*gg.stage.s_mod,gg.ctx);
    gg.ctx.globalAlpha = 1;
  }
  self.popup = function(type)
  {
    var p = self.font_size;
    var x = gg.canvas.width/2;
    var y = gg.canvas.height-p;
    var t = min(1,self.thread_t/100);
    y = y-(10-10*bounceup(t))*gg.stage.s_mod;
    var txt_fmt;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    txt_fmt = self.mayor_fmt_history[self.mayor_history.length-1];       break;
      case ADVISOR_TYPE_BUSINESS: txt_fmt = self.business_fmt_history[self.business_history.length-1]; break;
      case ADVISOR_TYPE_FARMER:   txt_fmt = self.farmer_fmt_history[self.farmer_history.length-1];     break;
    }
    var h = p+self.title_font_size+p+self.font_size*txt_fmt.length+p;
    if(type == TEXT_TYPE_DISMISS) h += self.font_size+p;
    if(type == TEXT_TYPE_CONFIRM) h += self.title_font_size+p;
    self.target_popup_h = h;
    var w = self.popup_w+p*2;
    x -= w/2;
    y -= h;

    gg.ctx.fillStyle = light_gray;
    gg.ctx.strokeStyle = gray;
    if(self.popup_h < 100) gg.ctx.globalAlpha = min(1,t*6);
    gg.ctx.textAlign = "left";

    //bubble
    gg.ctx.fillStyle = self.bgc;
    gg.ctx.strokeStyle = self.fgc;
    fillRRect(x-w/3,y+(self.target_popup_h-self.popup_h),w+w/3,self.popup_h,p,gg.ctx);
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
    drawLine(x-w/3+p,y+self.target_popup_h,x+w-p,y+self.target_popup_h,gg.ctx);

    var ty = y+p+self.title_font_size;
    gg.ctx.font = self.title_font;
    switch(self.advisor)
    {
      case ADVISOR_TYPE_MAYOR:    gg.ctx.fillText("Mayor Advisor:",    x+p, ty); break;
      case ADVISOR_TYPE_BUSINESS: gg.ctx.fillText("Business Advisor:", x+p, ty); break;
      case ADVISOR_TYPE_FARMER:   gg.ctx.fillText("Farm Advisor:",     x+p, ty); break;
    }

    ty += p+self.font_size;
    gg.ctx.font = self.font;
    for(var i = 0; i < txt_fmt.length; i++)
      gg.ctx.fillText(txt_fmt[i],x+p,ty+self.font_size*i);

    if(type == TEXT_TYPE_DISMISS)
    {
      ty += p+self.font_size*txt_fmt.length;
      gg.ctx.fillStyle = gray;
      gg.ctx.fillText("(click anywhere to continue)", x+p, ty);
    }
    if(type == TEXT_TYPE_CONFIRM)
    {
      ty += p+self.font_size*(txt_fmt.length-1);
      ty += self.title_font_size;
      gg.ctx.font = self.title_font;
      gg.ctx.fillText("CONFIRM", x+p, ty);
    }

    gg.ctx.globalAlpha = 1;
  }
  self.ctc = function()
  {
    var x = gg.canvas.width/2
    var y = gg.b.cbounds_y+gg.b.cbounds_h-gg.font_size*2;
    gg.ctx.fillStyle = black;
    gg.ctx.textAlign = "center";
    gg.ctx.fillText("(click anywhere to continue)",x,y);
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
    self.takeover = 0;
    self.thread_i += i;
    self.thread_t = 0;
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
  }

  self.end = function()
  {
    self.advisor = 0;
    self.takeover = 0;
    self.thread = 0;
    self.heap = 0;
    self.thread_i = 0;
    self.thread_t = 0;
    self.triggers = [];
    self.trigger_threads = [];
    keycatch.key({key:"u"});
  }

  self.pool_thread = function(trigger,thread)
  {
    self.triggers.push(trigger);
    self.trigger_threads.push(thread);
  }
  self.launch_thread = function(t)
  {
    self.thread = t;
    self.heap = {};
    self.thread_i = 0;
    self.thread_t = 0;
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
    return 1;
  }
  self.adv_thread = function()
  {
    self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_END]();
    self.takeover = 0;
    self.thread_i++;
    self.thread_t = 0;
    if(self.thread_i*THREADF_TYPE_COUNT >= self.thread.length)
    {
      self.thread = 0;
      self.heap = 0;
    }
    else
      self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_BEGIN]();
  }
  self.delay_adv_thread = function()
  {
    if(self.thread_t > 30) self.adv_thread();
  }
  self.confirm_adv_thread = function()
  {
    var p = self.font_size;
    gg.clicker.consumeif(gg.canvas.width/2-self.popup_w/2,gg.canvas.height-p*2-self.title_font_size,self.popup_w,self.title_font_size,self.adv_thread);
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
    if(self.thread) self.thread[self.thread_i*THREADF_TYPE_COUNT+THREADF_TYPE_CLICK](evt);
    else
    {
      //copied from draw!
      var h = gg.stage.s_mod*50;
      var w = h*1.5;
      var x = gg.canvas.width/2-w*2;
      var y = gg.canvas.height-h;
      var previewed = 0;
      if(self.mayor_active    && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_MAYOR)    { self.set_advisor(ADVISOR_TYPE_MAYOR);    self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.5;
      if(self.business_active && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_BUSINESS) { self.set_advisor(ADVISOR_TYPE_BUSINESS); self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.5;
      if(self.farmer_active   && doEvtWithin(evt,x,y,w,h)) { if(!self.preview || self.advisor != ADVISOR_TYPE_FARMER)   { self.set_advisor(ADVISOR_TYPE_FARMER);   self.preview = 1; self.preview_off_y = 0; previewed = 1; } else self.preview = 0; }
      x += w*1.5;
      if(!previewed) self.preview = 0;
    }
  }

  self.drag_start_y = 0;
  self.drag_cur_y = 0;
  self.shouldDrag = function(evt)
  {
    if(self.preview)
    {
      //copied from draw!
      x = gg.canvas.width/2;
      y = gg.canvas.height-p;
      y = y-(100*gg.stage.s_mod);
      h = p+self.title_font_size+p+self.font_size+p;
      h += self.font_size+p;
      h += 100*gg.stage.s_mod;
      w = self.popup_w+p*2;
      x -= w/2;
      y -= h;
      if(doEvtWithin(evt,x,y,w,h))
      {
        self.drag_start_y = evt.doY;
        self.drag_cur_y = self.drag_start_y;
        self.dragging = 1;
        return 1;
      }
    }

    self.dragging = 0;
    self.click(evt);
    return 0;
  }
  self.dragStart = function(evt)
  {
  }
  self.drag = function(evt)
  {
    self.drag_cur_y = evt.doY;
  }
  self.dragFinish = function(evt)
  {
    self.preview_off_y += self.drag_cur_y-self.drag_start_y;
    self.drag_start_y = self.drag_cur_y;
  }

  self.tick = function()
  {
    self.thread_t++;
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
      var h = gg.stage.s_mod*50;
      var w = h*1.5;
      var x = gg.canvas.width/2-w*2;
      var y = gg.canvas.height-h;
      var p = w/10;
      gg.ctx.textAlign = "left";
      gg.ctx.fillStyle = self.fgc;
      gg.ctx.fillText("ADVISORS",x,y-p);
      gg.ctx.textAlign = "center";
      gg.ctx.strokeStyle = self.fgc;
      gg.ctx.fillStyle = self.bgc;
      if(self.mayor_active)    { fillRRect(x,y,w,h*2,h/4,gg.ctx); gg.ctx.stroke(); gg.ctx.drawImage(mayor_img,x+w/2-h/2+p*2,y+p,h-p*4,h-p*4);    gg.ctx.fillStyle = self.fgc; gg.ctx.fillText("MAYOR",x+w/2,y+h-p); }
      gg.ctx.strokeStyle = self.fgc;
      gg.ctx.fillStyle = self.bgc;
      x += w*1.5;
      if(self.business_active) { fillRRect(x,y,w,h*2,h/4,gg.ctx); gg.ctx.stroke(); gg.ctx.drawImage(business_img,x+w/2-h/2+p*2,y+p,h-p*4,h-p*4); gg.ctx.fillStyle = self.fgc; gg.ctx.fillText("BUSINESS",x+w/2,y+h-p); }
      gg.ctx.strokeStyle = self.fgc;
      gg.ctx.fillStyle = self.bgc;
      x += w*1.5;
      if(self.farmer_active)   { fillRRect(x,y,w,h*2,h/4,gg.ctx); gg.ctx.stroke(); gg.ctx.drawImage(farmer_img,x+w/2-h/2+p*2,y+p,h-p*4,h-p*4);   gg.ctx.fillStyle = self.fgc; gg.ctx.fillText("FARMER",x+w/2,y+h-p); }
      x += w*1.5;
    }
    self.popup_h = lerp(self.popup_h,self.target_popup_h,0.5);

    if(self.preview)
    {
      var p = self.font_size;
      var x = gg.canvas.width/2;
      var y = gg.canvas.height-p;
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
      var h = p+self.title_font_size+p+self.font_size*txt_fmt.length+p;
      h += self.font_size+p;
      h += 100*gg.stage.s_mod;
      self.target_popup_h = h;
      var w = self.popup_w+p*2;
      x -= w/2;
      y -= h;

      gg.ctx.fillStyle = light_gray;
      gg.ctx.strokeStyle = gray;
      if(self.popup_h < 100) gg.ctx.globalAlpha = min(1,t*6);
      gg.ctx.textAlign = "left";

      //bubble
      gg.ctx.fillStyle = self.bgc;
      gg.ctx.strokeStyle = self.fgc;
      fillRRect(x-w/3,y+(self.target_popup_h-self.popup_h),w+w/3,self.popup_h,p,gg.ctx);
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
      drawLine(x-w/3+p,y+self.target_popup_h,x+w-p,y+self.target_popup_h,gg.ctx);

      var ty = y+p+self.title_font_size;
      gg.ctx.font = self.title_font;
      switch(self.advisor)
      {
        case ADVISOR_TYPE_MAYOR:    gg.ctx.fillText("Mayor Advisor:",    x+p, ty); break;
        case ADVISOR_TYPE_BUSINESS: gg.ctx.fillText("Business Advisor:", x+p, ty); break;
        case ADVISOR_TYPE_FARMER:   gg.ctx.fillText("Farm Advisor:",     x+p, ty); break;
      }

      ty += p+self.font_size;
      gg.ctx.font = self.font;
      for(var i = 0; i < txt_fmt.length; i++)
        gg.ctx.fillText(txt_fmt[i],x+p,ty+self.font_size*i);

      ty += p+self.font_size*txt_fmt.length;
      gg.ctx.fillStyle = gray;
      gg.ctx.fillText("(click anywhere to continue)", x+p, ty);

      gg.ctx.fillStyle = white;
      gg.ctx.fillRect(x,ty+p,w,100*gg.stage.s_mod);
      gg.ctx.rect(x,ty+p,w,100*gg.stage.s_mod);
      gg.ctx.save();
      gg.ctx.clip();
      ty += p+self.font_size;
      ty += self.preview_off_y+(self.drag_cur_y-self.drag_start_y);
      gg.ctx.fillStyle = self.fgc;
      for(var j = 0; j < fmt_records.length; j++)
      {
        txt_fmt = fmt_records[fmt_records.length-1-j];
        for(var i = 0; i < txt_fmt.length; i++)
          gg.ctx.fillText(txt_fmt[i],x+p,ty+self.font_size*i);
        ty += (p+self.font_size)*txt_fmt.length;
        if(ty > y+h+self.font_size) break;
      }
      gg.ctx.restore();

      gg.ctx.globalAlpha = 1;
    }
  }

  var tut_mayor_leave = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'mayor_leave'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("I have failed as your mayor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.mayor_active = 0;
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'mayor_leave'});
    },

  ];

  var tut_farmer_leave = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'farmer_leave'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("I have failed as your farm advisor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.farmer_active = 0;
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'farmer_leave'});
    },

  ];

  var tut_business_leave = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'business_leave'}); self.set_advisor(ADVISOR_TYPE_BUSINESS); self.push_blurb("Too many people have died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("I have failed as your business advisor."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("I can't stay here any longer- good luck."); self.push_record("I'm out! You've killed too many.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.mayor_active = 0;
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'business_leave'});
    },

  ];

  var tut_cycle_rain = [
    function(){ gg.b.raining = 1; }, //begin
    function(){ return self.time_passed(400); }, //tick
    noop, //draw
    ffunc, //click
    function(){ //end
      gg.b.raining = 0;
      self.pool_thread(function(){ return self.time_passed(4000); }, tut_cycle_rain);
    },
  ];

  var tut_rain = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'rain'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("Looks like it's about to rain!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    noop, //begin
    function(){ return self.time_passed(400); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ gg.b.raining = 1; }, //begin
    function(){ return self.time_passed(200); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.push_blurb("There it goes-"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Don't worry, it shouldn't last too long."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("It might shift around some nutrients,"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("But that's nothing some more manure can't fix!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    noop, //begin
    function(){ return self.time_passed(400); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ gg.b.raining = 0; }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.push_blurb("Told you it wouldn't last long!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Back to work, everybody!"); self.push_record("Rain will shift around fertilizer and nutrients in the soil- You'll have to add more fertilizer to get it back!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function(){ //end
      self.pool_thread(function(){ return self.time_passed(500); }, tut_cycle_rain);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'rain'});
    },
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
      self.dotakeover();
      self.push_blurb("Your farm has used up all the nutrition at its tile!");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      self.screen_tile(t)
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("This farm will grow very slowly"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      self.screen_tile(t)
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Maybe you can produce more fertilizer?"); self.push_record("When farm nutrients get low, they will produce crop very slowly. Add fertilizer to give them a boost.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      self.screen_tile(t)
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.adv_thread, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'low_nutrients'});
    }, //end
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
      self.dotakeover();
      self.push_blurb("Uh oh. Looks like there's an algae bloom starting!");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      self.screen_tile(t)
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Let's be careful to not make this worse!"); self.push_record("Your lake is so nutrient rich, it's causing an algae bloom! Yuck!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var t = self.heap.t;
      self.screen_tile(t)
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.adv_thread, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'bloom'});
    }, //end
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
      self.dotakeover();
      self.push_blurb("Ew- "+f.name+" is swimming in algae bloom.");
    },
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("This will make them sad."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Build signs to keep them away from the gross water!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("That way everyone stays happy and ready to work!"); self.push_record("You can use signs to keep your townspeople away from gross water.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    function(){
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'gross'});
    }, //end
  ];

  var tut_death = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Oh no! One of your townspeople have died!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("It's your responsibility to make sure there is enough food to go around"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Maybe you need more farms? Or more fertilizer?"); self.push_record("A townsperson has died of hunger. Make sure you're producing enough food!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'death'});
    },

  ];

  var tut_unattended_farm = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'unattended_farm'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.dotakeover(); self.push_blurb("One of your farms is ready for harvest."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.dotakeover(); self.push_blurb("A field unharvested is a field that isn't producing more food!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Consider finding more townspeople to increase your town's efficiency."); self.push_record("If your farms aren't being harvested, consider building more housing to encourage population growth!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'unattended_farm'});
    },
  ];

  var tut_unused_fertilizer = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'unused_fertilizer'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.dotakeover(); self.push_blurb("There's some unused poop laying around."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.dotakeover(); self.push_blurb("That will slowly leech nutrients into the soil-"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("See if you can free up some people to fertilize your farms, so those nutrients get put to good use!"); self.push_record("Unused fertilizer will leech nutrients into the surrounding soil, even if that soil isn't farmland!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'unused_fertilizer'});
    },
  ];

  var tut_flooded_fertilizer = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'flooded_fertilizer'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.dotakeover(); self.push_blurb("Oh no, it's raining and there's still fresh fertilizer on your farms!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.dotakeover(); self.push_blurb("The rain might wash that fertilizer away."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Sadly, there's not much you can do to prevent it..."); self.push_record("Rain pushes fertilizer off of your farms. It's an unfortunate waste of nutrients...");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'flooded_fertilizer'});
    },
  ];

  var tut_mass_sadness = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'mass_sadness'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Your townspeople are very sad!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.dotakeover(); self.push_blurb("I'm sure they'd like to play in the water,"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("but maybe your lakes are overrun with disgusting algae?"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Find a way to keep them happy!"); self.push_record("The people of Lakeland need to swim to maintain morale! If your lake is gross, they won't work."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'mass_sadness'});
    },
  ];

  var tut_long_travel = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'long_travel'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Some of your townspeople are taking a long time to deliver goods."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.dotakeover(); self.push_blurb("Consider building some roads to cut down on travel time!"); self.push_record("Roads make for MUCH faster transportation. It could be the difference that makes for an efficient farming pipeline!");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'long_travel'});
    },
  ];

  var tut_another_death = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Oh no, you've lost another one!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("A gravestone will remember them forever"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_death'});
    },
  ];

  var tut_another_member = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_member'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Someone else has moved in!"); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("Your town continues to grow!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_member'});
    },
  ];

  var tut_final_death = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'another_death'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Everyone in your town has died."); },//begin
    noop, //tick
    function() { //draw
      self.wash();
      self.popup(TEXT_TYPE_DIRECT);
    },
    self.delay_adv_thread, //click
    noop,

    function(){ self.push_blurb("This adventure has failed."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Better luck next time!"); self.push_record("You have no more townmembers! Your town has failed.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    function() { //end
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'another_death'});
    },
  ];

  var tut_fertilize = [
    function() { gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'fertilize'}); }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.dotakeover();  self.push_blurb("You can use waste from livestock to reintroduce nutrition to the ground."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.items_exist(ITEM_TYPE_POOP,1);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover();  self.push_blurb("(your townmembers will do this automatically)"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.items_exist(ITEM_TYPE_POOP,1);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.set_advisor(ADVISOR_TYPE_BUSINESS); self.dotakeover();  self.push_blurb("Buy more houses to grow your town!");self.push_record("Your townspeople will automatically use free poop to fertilize their farms. This is key to a profitable crop cycle!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    function() { //end
      keycatch.key({key:"u"});
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
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'fertilize'});
    },
  ];

  var tut_buy_livestock = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'buy_livestock'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.push_blurb("Great Work!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Your farms might be using up the nutrition in the soil."); }, //begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ gg.shop.livestock_btn.active = 1; self.push_blurb("Next, save up for some livestock. They might be able to help with that!"); self.push_record("Livestock create poop, which does wonders for soil nutrition.");}, //begin
    ffunc, //tick
    function(){ //draw
      var b = gg.shop.livestock_btn;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    self.adv_thread, //click
    function() { //end
      self.pool_thread(function(){ return self.items_exist(ITEM_TYPE_POOP,1); }, tut_fertilize);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'buy_livestock'});
    },
  ];

  var tut_timewarp = [
    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'timewarp'}); self.set_advisor(ADVISOR_TYPE_MAYOR); self.push_blurb("Click here if you want to speed up time"); self.push_record("You can use the time controls at the top of the screen to zoom through boring waiting periods."); },//begin
    function() { return DOUBLETIME; }, //tick
    function() { //draw
      self.wash();
      var b = gg.bar.speed_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    self.delay_adv_thread, //click
    function() { //end
      self.pool_thread(function(){ return self.tiles_exist(TILE_TYPE_FARM,2); }, tut_buy_livestock);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'timewarp'});
    },
  ];

  var tut_sell_food = [
    function() { gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'sell_food'}); }, //begin
    function(){ return self.time_passed(40); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.set_advisor(ADVISOR_TYPE_BUSINESS); self.dotakeover(); self.push_blurb("Hello!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("I'll be advising you on matters of business."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function() { self.heap.i = self.items_exist(ITEM_TYPE_FOOD,1); self.dotakeover(); self.push_blurb("Your farm has produced more food than is needed!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Let's sell the surplus."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){self.dotakeover(); gg.bar.pause_btn.active = 1; gg.bar.play_btn.active = 1; gg.bar.speed_btn.active = 1; RESUME_SIM = 0; self.push_blurb("First, we'll pause the game.");}, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var b = gg.bar.play_btn;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Next, click an item to select it."); },//begin
    function(){ RESUME_SIM = 0; return gg.inspector.detailed_type == INSPECTOR_CONTENT_ITEM; }, //tick
    function(){ //draw
      var i = self.heap.i;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(i.x+i.w,i.y+i.h/2);
    },
    ffunc, //click
    noop, //end

    function(){ self.push_blurb("Toggle the switch to mark it as \"for sale\"."); },//begin
    function(){ var i = self.heap.i; gg.inspector.select_item(i); return self.sale_items_exist(ITEM_TYPE_FOOD,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
      self.larrow(gg.inspector.x,gg.inspector.vignette_y+gg.inspector.vignette_h);
    },
    ffunc, //click
    noop, //end

    function(){ self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.dotakeover(); self.push_blurb(f.name+" will eventually export this for sale!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.push_blurb("click Play to resume the game."); },//begin
    function(){ return RESUME_SIM; }, //tick
    function(){ //draw
      var b = gg.bar.play_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w,b.y+b.h/2);
    },
    ffunc, //click
    noop, //end

    noop, //begin
    function(){ return self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); var f = self.heap.f; self.push_blurb(f.name+" is exporting the marked food"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("They'll be back soon with some money!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    noop, //end

    noop, //begin
    function(){ return !self.bits_job(JOB_TYPE_EXPORT,JOB_STATE_ACT); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); var f = self.heap.f; self.push_blurb(f.name+" has returned!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("You just made $"+item_worth_food+"!"); },//begin
    function(){ gg.shop.open = 1; }, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(gg.shop.x+gg.shop.w,gg.shop.y+40);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Save up for an additional farm."); self.push_record("Click on items and mark them as 'FOR SALE' to signal your townspeople to take those items to the market.");},//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(gg.shop.x+gg.shop.w,gg.shop.y+40);
    },
    self.adv_thread, //click
    function() { //end
      self.pool_thread(function(){ return self.time_passed(1000); }, tut_timewarp);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'sell_food'});
    },
  ];

  var tut_build_a_farm = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'build_a_farm'}); self.set_advisor(ADVISOR_TYPE_FARMER); self.dotakeover(); self.push_blurb("Hi!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("I'm your farm advisor."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.heap.f = gg.farmbits[0]; var f = self.heap.f; self.push_blurb(f.name+" will eventually need some food..."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    noop, //end

    function(){ gg.shop.farm_btn.active = 1; self.push_blurb("Buy a farm."); }, //begin
    function(){ gg.shop.open = 1; return self.purchased(BUY_TYPE_FARM); }, //tick
    function(){ //draw
      var b = gg.shop.farm_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(b.x+b.w+20,b.y+b.h/2);
    },
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Before you place it on the map..."); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ gg.nutrition_toggle.toggle_btn.active = 1; self.dotakeover(); self.push_blurb("Click to toggle nutrition view"); }, //begin
    function(){ gg.nutrition_toggle.filter(gg.clicker); return gg.b.nutrition_view; }, //tick
    function(){ //draw
      self.wash();
      var b = gg.nutrition_toggle.toggle_btn;
      self.popup(TEXT_TYPE_DIRECT);
      self.larrow(b.x,b.y+b.h/2);
      gg.nutrition_toggle.draw();
    },
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("The red represents the fertility of that soil."); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Place your farm on fertile grassland"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_FARM,1); }, //tick
    function(){ self.popup(TEXT_TYPE_DIRECT); }, //draw
    function(evt) //click
    {
      var b = gg.b;
      if(b.hover_t)
      {
        if(!b.placement_valid(b.hover_t,gg.shop.selected_buy))
          self.jmp(1);
        else if(b.hover_t.nutrition < nutrition_motivated)
          self.jmp(2);
        else
        {
          gg.b.click(evt);
          self.jmp(3);
        }
      }
    },
    noop, //end

    //can't build there
    function(){ self.dotakeover(); self.push_blurb("Can't build a farm there!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-1); }, //click
    noop, //end

    //find more fertile spot
    function(){ self.dotakeover(); self.push_blurb("Not very fertile!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-2); }, //click
    noop, //end

    function(){ self.heap.t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_FARM][0]); var f = self.heap.f; self.push_blurb(f.name+" will automatically manage the farm."); }, //begin
    ffunc, //tick
    function(){ //draw
      var t = self.heap.t;
      self.screen_tile(t)
      var f = self.heap.f;
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Click toggle at any time to disable nutrition view"); self.push_record("Buy farms to produce food for your people!"); self.push_record("Use the nutrition toggle to get a birds-eye-view of the landscape of nutrition.");},//begin
    function(){ return !gg.b.nutrition_view; }, //tick
    function(){ //draw
      self.wash();
      var b = gg.nutrition_toggle.toggle_btn;
      self.popup(TEXT_TYPE_DIRECT);
      gg.nutrition_toggle.draw();
      self.larrow(b.x,b.y+b.h/2);
    },
    ffunc, //click
    function() { //end
      self.pool_thread(function(){ return self.items_exist(ITEM_TYPE_FOOD,1); }, tut_sell_food);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'build_a_farm'});
    },
  ];

  var tut_build_a_house = [

    function(){ gtag('event', 'tutorial', {'event_category':'begin', 'event_label':'build_a_house'}); self.set_advisor(ADVISOR_TYPE_MAYOR); }, //begin
    function(){ return self.time_passed(100); }, //tick
    noop, //draw
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Hi!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("I'm the Mayor!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      self.popup(TEXT_TYPE_DISMISS);
    },
    self.adv_thread, //click
    noop, //end

    function(){ self.push_blurb("Buy your first house."); },//begin
    function(){ gg.shop.open = 1; return self.purchased(BUY_TYPE_HOME) || self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
      self.arrow(gg.shop.home_btn.x+gg.shop.home_btn.w+20,gg.shop.home_btn.y+gg.shop.home_btn.h/2);
    },
    ffunc, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("Place it somewhere on the map"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DIRECT);
    },
    function(evt)
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
      }
    }, //click
    noop, //end

    //can't build there
    function(){ self.dotakeover(); self.push_blurb("Can't build a house there!"); },//begin
    function(){ return self.tiles_exist(TILE_TYPE_HOME,1); }, //tick
    function(){ //draw
      self.popup(TEXT_TYPE_DISMISS);
    },
    function(){ self.jmp(-1); }, //click
    noop, //end

    function(){ self.push_blurb("Someone should move in soon!"); },//begin
    function(){ return self.bits_exist(1); }, //tick
    function(){
      self.wash();
      var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_HOME][0]);
      self.hilight(t);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(t.x+t.w,t.y+t.h/2);
    }, //draw
    self.delay_adv_thread, //click
    noop, //end

    function(){ if(gg.b.visit_t < 800) gg.b.visit_t = 800; self.push_blurb("Waiting..."); }, //begin
    function(){ return self.bits_exist(1); }, //tick
    function(){ //draw
      var t = gg.b.screen_tile(gg.b.tile_groups[TILE_TYPE_HOME][0]);
      self.popup(TEXT_TYPE_OBSERVE);
      self.arrow(t.x+t.w,t.y+t.h/2);
    },
    ffunc, //click
    noop, //end

    function(){ self.heap.f = gg.farmbits[0]; var f = self.heap.f; gg.inspector.select_farmbit(self.heap.f); gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT; self.dotakeover(); self.push_blurb(f.name+" moved into your town!"); }, //begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.delay_adv_thread, //click
    noop, //end

    function(){ self.dotakeover(); self.push_blurb("It's your job to ensure their survival!"); self.push_record("Build houses to get more townspeople!"); },//begin
    ffunc, //tick
    function(){ //draw
      self.wash();
      var f = self.heap.f;
      self.hilight(f);
      self.popup(TEXT_TYPE_DISMISS);
      self.arrow(f.x+f.w,f.y+f.h/2);
    },
    self.adv_thread, //click
    function() { //end
      self.pool_thread(function(){ return self.time_passed(100); }, tut_build_a_farm);
      gtag('event', 'tutorial', {'event_category':'end', 'event_label':'build_a_house'});
    },
  ];

  self.pool_thread(tfunc,tut_build_a_house);

}

