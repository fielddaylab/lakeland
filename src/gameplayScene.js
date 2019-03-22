var GamePlayScene = function()
{
  var self = this;

  var hoverer;
  var clicker;
  var dragger;
  var keyer;

  var keycatch =
  {
    key:function(evt)
    {
      switch(evt.key)
      {
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
          s.livestock_btn.active = 1;
          s.storage_btn.active = 1;
          s.processor_btn.active = 1;
          s.road_btn.active = 1;
          s.demolish_btn.active = 1;
          s.money_btn.active = 1;
          s.abandon_btn.active = 1;
          s.refund_btn.active = 1;
          break;
        }
      }
    }
  }

  self.resize = function()
  {
    if(hoverer) hoverer.detach(); hoverer = new PersistentHoverer({source:gg.canvas});
    if(clicker) clicker.detach(); clicker = new Clicker({source:gg.canvas});
    if(dragger) dragger.detach(); dragger = new Dragger({source:gg.canvas});
    if(keyer)   keyer.detach();   keyer   = new Keyer({source:gg.canvas});

    if(self.readied)
    {
      gg.b.resize();
      gg.b.zoom_bounds(gg.cam);
      gg.playhead.resize();
      gg.nutrition_toggle.resize();
      gg.shop.resize();
      gg.inspector.resize();
      gg.ticker.resize();
      gg.tutorial.resize();
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
    gg.b.zoom_bounds(gg.cam);
    gg.money = money_start_n;
    gg.items = [];
    gg.farmbits = [];
    for(var i = 0; i < farmbits_start_n; i++)
    {
      gg.farmbits[i] = new farmbit();
      gg.farmbits[i].wx = gg.b.wx+rand0()*gg.b.ww/2;
      gg.farmbits[i].wy = gg.b.wy+rand0()*gg.b.ww/2;
    }
    gg.jobs = [];
    gg.playhead = new playhead();
    gg.nutrition_toggle = new nutrition_toggle();
    gg.shop = new shop();
    gg.inspector = new inspector();
    gg.ticker = new ticker();
    gg.tutorial = new tutorial();
    self.readied = 1;
  };

  var t_mod_twelve_pi = 0;
  self.tick = function(times)
  {
    t_mod_twelve_pi += 0.01*times;
    if(t_mod_twelve_pi > twelvepi) t_mod_twelve_pi -= twelvepi;
    if(DOUBLETIME) times = 4;

    hoverer.filter(gg.b);

    var check = true;
    if(!gg.tutorial.takeover)
    {
      if(check) check = !gg.playhead.filter(clicker);
      if(check) check = !gg.nutrition_toggle.filter(clicker);
      if(check) check = !gg.shop.filter(clicker);
      if(check) check = !clicker.filter(gg.b);
    }
    clicker.filter(gg.tutorial);

    keyer.filter(keycatch);

    clicker.flush();
    hoverer.flush();
    dragger.flush();
    keyer.flush();

    if(RESUME_SIM)
    {
      while(times)
      {
        if(!gg.tutorial.takeover)
        {
          gg.b.tick();
          screenSpace(gg.cam, gg.canvas, gg.b);
          for(var i = 0; i < gg.items.length; i++)
          {
            var o = gg.items[i];
            o.tick();
            screenSpace(gg.cam, gg.canvas, o);
            o.y -= o.wz;
          }
          for(var i = 0; i < gg.farmbits.length; i++)
          {
            var f = gg.farmbits[i];
            f.tick();
            screenSpace(gg.cam, gg.canvas, f);
          }
          gg.playhead.tick();
          gg.nutrition_toggle.tick();
          gg.shop.tick();
          gg.ticker.tick();
        }
        times--;
      }
    }
    gg.tutorial.tick();
  };

  self.draw = function()
  {
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);

    gg.ctx.font = gg.font_size+"px "+gg.font;

    gg.ctx.font = (gg.font_size*1.5)+"px "+gg.font;
    gg.ctx.textAlign = "center";
    gg.b.draw();
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();
    gg.ctx.textAlign = "left";
    for(var i = 0; i < gg.items.length; i++)
      gg.items[i].draw();
    gg.playhead.draw();
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

    gg.tutorial.draw();
  };

  self.cleanup = function()
  {
    if(hoverer) hoverer.detach(); hoverer = null;
    if(clicker) clicker.detach(); clicker = null;
    if(dragger) dragger.detach(); dragger = null;
    if(keyer)   keyer.detach();   keyer   = null;
  };

};

