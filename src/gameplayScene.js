var keycatch;
var GamePlayScene = function()
{
  var self = this;

  keycatch =
  {
    key:function(evt)
    {
      switch(evt.key)
      {
        case "q": QUADRUPLETIME = !QUADRUPLETIME; break;
        case "d": DOUBLETIME = !DOUBLETIME; break;
        case "p": RESUME_SIM = !RESUME_SIM; break;
        case "n": gg.b.nutrition_view = !gg.b.nutrition_view; break;
        case "r": gg.b.raining = !gg.b.raining; break;
        case "x": gg.b.tiles[0].lock = !gg.b.tiles[0].lock; break;
        case "a": debug_pathfinding = !debug_pathfinding; break;
        case "j": debug_jobs = !debug_jobs; break;
        case "u":
        {
          var s = gg.shop;
          s.home_btn.active = 1;
          s.farm_btn.active = 1;
          s.fertilizer_btn.active = 1;
          s.livestock_btn.active = 1;
          s.storage_btn.active = 1;
          s.processor_btn.active = 1;
          s.sign_btn.active = 1;
          s.skimmer_btn.active = 1;
          s.road_btn.active = 1;
          s.demolish_btn.active = 1;
          s.money_btn.active = 1;
          //s.abandon_btn.active = 1;
          s.refund_btn.active = 1;
          s.festival_btn.active = 1;

          gg.nutrition_toggle.toggle_btn.active = 1;
          gg.bar.pause_btn.active = 1;
          gg.bar.play_btn.active = 1;
          gg.bar.speed_btn.active = 1;

          gg.advisors.mayor_active = 1;
          gg.advisors.business_active = 1;
          gg.advisors.farmer_active = 1;

          break;
        }
        case "t": gg.advisors.end(); break;
        case "m":
        {
          if(gg.farmbits.length == gg.b.bounds_n) { gg.b.inc_bounds(); gg.b.bounds_n++; gg.b.resize(); }
          var t = gg.b.tiles_t(gg.b.bounds_tx+randIntBelow(gg.b.bounds_tw),gg.b.bounds_ty+randIntBelow(gg.b.bounds_th));
          var b = new farmbit();
          gg.ticker.nq(b.name+" decided to move in!");
          b.tile = t;
          gg.b.tiles_tw(t,b);
          gg.farmbits.push(b);
          job_for_b(b);
          b.home = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME]);
          if(b.home) b.home.state = TILE_STATE_HOME_OCCUPIED;
        }
          break;
        case "k":
        {
          if(gg.farmbits.length) gg.farmbits[0].die();
        }
          break;
      }
    }
  }

  self.resize = function()
  {
    if(gg.hoverer) gg.hoverer.detach(); gg.hoverer = new PersistentHoverer({source:gg.canvas});
    if(gg.clicker) gg.clicker.detach(); gg.clicker = new Clicker({source:gg.canvas});
    if(gg.dragger) gg.dragger.detach(); gg.dragger = new Dragger({source:gg.canvas});
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = new Keyer({source:gg.canvas});

    if(self.readied)
    {
      screenSpace(gg.cam, gg.canvas, gg.b);
      gg.b.zoom_bounds(gg.cam);
      gg.b.resize();
      gg.bar.resize();
      gg.nutrition_toggle.resize();
      gg.shop.resize();
      gg.inspector.resize();
      gg.ticker.resize();
      gg.advisors.resize();
    }

    gg.font = "LeagueSpartan";
    gg.font_size = 14*gg.stage.s_mod;
    gg.font_color = "#17315B";
    gg.backdrop_color = "#A0DEDB";
  }

  self.readied = 0;
  self.ready = function()
  {
    self.resize();

    gg.cam = {wx:0,wy:0,ww:gg.canvas.width,wh:gg.canvas.height};

    gg.b = new board();
    screenSpace(gg.cam, gg.canvas, gg.b);
    gg.b.zoom_bounds(gg.cam);
    gg.b.resize();
    gg.money = money_start_n;
    gg.hungry = 0;
    gg.food = 0;
    gg.items = [];
    gg.farmbits = [];
    for(var i = 0; i < farmbits_start_n; i++)
    {
      gg.farmbits[i] = new farmbit();
      gg.farmbits[i].wx = gg.b.wx+rand0()*gg.b.ww/2;
      gg.farmbits[i].wy = gg.b.wy+rand0()*gg.b.ww/2;
    }
    gg.jobs = [];
    gg.bar = new bar();
    gg.nutrition_toggle = new nutrition_toggle();
    gg.shop = new shop();
    gg.inspector = new inspector();
    gg.ticker = new ticker();
    gg.advisors = new advisors();
    self.readied = 1;
  };

  gg.t_mod_twelve_pi = 0;
  self.tick = function(times)
  {
    if(RESUME_SIM && !gg.advisors.takeover)
    {
    if(DOUBLETIME) times *= 4;
    if(QUADRUPLETIME*DOUBLETIME) times *= 4;
    gg.t_mod_twelve_pi += 0.01*times;
    if(gg.t_mod_twelve_pi > twelvepi) gg.t_mod_twelve_pi -= twelvepi;
    }

    gg.hoverer.filter(gg.b);

    var check = true;
    if(!gg.advisors.takeover)
    {
      if(check) check = !gg.bar.filter(gg.clicker);
      if(check) check = !gg.nutrition_toggle.filter(gg.clicker);
      if(check) check = !gg.shop.filter(gg.clicker);
      if(check) check = !gg.inspector.filter(gg.clicker);
      if(check) check = !gg.dragger.filter(gg.b);
    }
    gg.clicker.filter(gg.advisors);

    gg.keyer.filter(keycatch);

    screenSpace(gg.cam, gg.canvas, gg.b);
    gg.b.screen_bounds(gg.cam);
    if(RESUME_SIM)
    {
      while(times)
      {
        gg.hungry = 0;
        gg.food = 0;
        if(!gg.advisors.takeover)
        {
          gg.b.tick();
          for(var i = 0; i < gg.items.length; i++)
          {
            var o = gg.items[i];
            o.tick();
            if(o.type == ITEM_TYPE_FOOD && !o.sale) gg.food++;
            screenSpace(gg.cam, gg.canvas, o);
            o.y -= o.wz;
          }
          for(var i = 0; i < gg.farmbits.length; i++)
          {
            var f = gg.farmbits[i];
            f.tick();
            if(f.fullness_state != FARMBIT_STATE_CONTENT) gg.hungry++;

            screenSpace(gg.cam, gg.canvas, f);
          }
          gg.bar.tick();
          gg.nutrition_toggle.tick();
          gg.shop.tick();
          gg.ticker.tick();
        }
        times--;
      }
    }
    else //still screenspace to catch up to drag
    {
      for(var i = 0; i < gg.items.length; i++)
      {
        var o = gg.items[i];
        screenSpace(gg.cam, gg.canvas, o);
      }
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        var f = gg.farmbits[i];
        screenSpace(gg.cam, gg.canvas, f);
      }
    }
    gg.advisors.tick();

    gg.clicker.flush();
    gg.hoverer.flush();
    gg.dragger.flush();
    gg.keyer.flush();
  };

  self.draw = function()
  {
    //gg.ctx.fillStyle = white;
    //gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);

    gg.ctx.font = gg.font_size+"px "+gg.font;

    gg.ctx.font = (gg.font_size*1.5)+"px "+gg.font;
    gg.ctx.textAlign = "center";
    gg.b.draw();
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();
    gg.ctx.textAlign = "left";
    for(var i = 0; i < gg.items.length; i++)
      gg.items[i].draw();
    gg.bar.draw();
    gg.nutrition_toggle.draw();
    gg.shop.draw();
    gg.inspector.draw();
    gg.ticker.draw();

    /*
    var x = gg.canvas.width-100;
    var y = 520;
    h = 20;
    gg.ctx.fillText("d- speed time",    x,y); y += h;
    gg.ctx.fillText("p- pause",         x,y); y += h;
    gg.ctx.fillText("n- nutrition view",x,y); y += h;
    gg.ctx.fillText("r- rain",          x,y); y += h;
    gg.ctx.fillText("x- toggle export", x,y); y += h;
    gg.ctx.fillText("a- debug pathing", x,y); y += h;
    gg.ctx.fillText("j- debug jobs",    x,y); y += h;
    */

    gg.advisors.draw();
  };

  self.cleanup = function()
  {
    if(gg.hoverer) gg.hoverer.detach(); gg.hoverer = null;
    if(gg.clicker) gg.clicker.detach(); gg.clicker = null;
    if(gg.dragger) gg.dragger.detach(); gg.dragger = null;
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = null;
  };

};

