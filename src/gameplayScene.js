var keycatch;
var debug = 0;

var ENUM;

ENUM = 0;
var SPEED_NULL  = ENUM; ENUM++;
var SPEED_PAUSE = ENUM; ENUM++;
var SPEED_PLAY  = ENUM; ENUM++;
var SPEED_FAST  = ENUM; ENUM++;
var SPEED_VFAST = ENUM; ENUM++;
var SPEED_COUNT = ENUM; ENUM++;

var GamePlayScene = function()
{
  var self = this;

  keycatch =
  {
    secretprogress:0,
    key_down:function(evt)
    {
      keycatch.last_key = evt.keyCode;
      if(!debug)
      {
        var secret = "spyparty";
        if(secret[keycatch.secretprogress] == String.fromCharCode(evt.keyCode).toLowerCase()) keycatch.secretprogress++;
        else                                                                                  keycatch.secretprogress = 0;
        if(keycatch.secretprogress == secret.length) { debug = 1; gg.shop.btns.push(gg.shop.money_btn); gg.shop.resize(); gg.b.own_tiles(gg.b.tiles_t(floor(gg.b.bounds_tx+gg.b.bounds_tw/2),floor(gg.b.bounds_ty+gg.b.bounds_th/2)), 2); }
      }
    },
    key:function(evt)
    {
      if(!debug) return;
      switch(evt.key)
      {
        case "n": gg.b.nutrition_view = !gg.b.nutrition_view; break;
        case "r": gg.b.raining = !gg.b.raining; break;
        case "x": gg.b.tiles[0].lock = !gg.b.tiles[0].lock; break;
        case "a": debug_pathfinding = !debug_pathfinding; break;
        case "j": debug_jobs = !debug_jobs; break;
        case "u": gg.unlock_ui(); break;
        case "t": gg.advisors.skip_tutorial(); break;
        case "m":
        {
          if(gg.farmbits.length == gg.b.bounds_n) { gg.b.inc_bounds(); gg.b.bounds_n++; gg.b.resize(); }
          var t = gg.b.tiles_t(gg.b.bounds_tx+randIntBelow(gg.b.bounds_tw),gg.b.bounds_ty+randIntBelow(gg.b.bounds_th));
          var b = new farmbit();
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
      gg.achievements.resize();
      gg.advisors.resize();
    }

    gg.font = "LeagueSpartan";
    gg.font_size = 14*gg.stage.s_mod;
    gg.font_color = "#17315B";
    gg.backdrop_color = "#A0DEDB";
  }

  self.killinput = function()
  {
    if(gg.hoverer) gg.hoverer.flush();
    if(gg.clicker) gg.clicker.flush();
    if(gg.dragger) gg.dragger.flush();
    if(gg.keyer)   gg.keyer.flush();
  }

  self.readied = 0;
  self.ready = function()
  {
    self.resize();

    gg.cam = {wx:0,wy:0,ww:gg.canvas.width,wh:gg.canvas.height};

    gg.b = new board();
    gg.b.init();
    gg.ignore_single_board = 0; //flag to ignore a single input
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
    gg.achievements = new achievements();
    gg.advisors = new advisors();
    self.readied = 1;
  };

  gg.t_mod_twelve_pi = 0;
  gg.speed = SPEED_PLAY;
  self.tick = function(times)
  {
    switch(gg.speed)
    {
      case SPEED_PAUSE: times *= 0;  break;
      case SPEED_PLAY:  times *= 1;  break;
      case SPEED_FAST:  times *= 4;  break;
      case SPEED_VFAST: times *= 16; break;
    }
    var game_times = times;
    if(gg.advisors.owns_time) times *= 0;
    gg.t_mod_twelve_pi += 0.01*times;
    if(gg.t_mod_twelve_pi > twelvepi) gg.t_mod_twelve_pi -= twelvepi;

    gg.hoverer.filter(gg.b);

    var check = true;
    if(!gg.advisors.owns_ui)
    {
      if(check) check = !gg.achievements.filter(gg.clicker);
      if(check) check = !gg.bar.filter(gg.clicker);
      if(check) check = !gg.nutrition_toggle.filter(gg.clicker);
      if(check) check = !gg.shop.filter(gg.clicker);
      if(check) check = !gg.inspector.filter(gg.clicker);
    }
    gg.dragger.filter(gg.advisors);
    if(check) check = !gg.dragger.filter(gg.b);
    gg.ignore_single_board = 0;

    gg.keyer.filter(keycatch);

    screenSpace(gg.cam, gg.canvas, gg.b);
    gg.b.screen_bounds(gg.cam);
    gg.b.idempotent_tick();
    while(times)
    {
      gg.hungry = 0;
      gg.food = 0;
      gg.b.tick();
      for(var i = 0; i < gg.items.length; i++)
      {
        var o = gg.items[i];
        o.tick();
        if(o.type == ITEM_TYPE_FOOD && (o.mark == MARK_USE)) gg.food++;
      }
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        var f = gg.farmbits[i];
        f.tick();
        if(f.fullness_state != FARMBIT_STATE_CONTENT) gg.hungry++;
      }
      times--;
    }
    gg.shop.tick();

    //screen space
    {
      for(var i = 0; i < gg.items.length; i++)
      {
        var o = gg.items[i];
        screenSpace(gg.cam, gg.canvas, o);
        o.y -= o.wz;
      }
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        var f = gg.farmbits[i];
        screenSpace(gg.cam, gg.canvas, f);
      }
    }
    gg.achievements.tick();
    gg.advisors.tick(game_times);

    gg.clicker.flush();
    gg.hoverer.flush();
    gg.dragger.flush();
    gg.keyer.flush();
  };

  self.draw = function()
  {
    //gg.ctx.fillStyle = red;
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
    gg.achievements.draw();
  };

  self.cleanup = function()
  {
    if(gg.hoverer) gg.hoverer.detach(); gg.hoverer = null;
    if(gg.clicker) gg.clicker.detach(); gg.clicker = null;
    if(gg.dragger) gg.dragger.detach(); gg.dragger = null;
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = null;
  };

};

