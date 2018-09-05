var gg = {};
RESUME_SIM = 1;
var GamePlayScene = function(game, stage)
{
  var self = this;

  self.resize = function(s)
  {
    stage = s;
    gg.stage = stage;
    gg.canv = gg.stage.canv;
    gg.canvas = gg.canv.canvas;
    gg.ctx = gg.canv.context;

    gg.cam = {wx:0,wy:0,ww:gg.canv.width,wh:gg.canv.height}
    gg.ui_cam = {wx:gg.canv.width/2,wy:gg.canv.height/2,ww:gg.canv.width,wh:gg.canv.height}
    if(clicker) clicker.detach(); clicker = new Clicker({source:gg.canvas});
    if(hoverer) hoverer.detach(); hoverer = new PersistentHoverer({source:gg.canvas});
    if(dragger) dragger.detach(); dragger = new Dragger({source:gg.canvas});
    if(keyer)   keyer.detach();   keyer   = new Keyer({source:gg.canvas});
  }
  //self.resize(stage); //executed in 'ready'

  var clicker;
  var hoverer;
  var dragger;
  var keyer;
  var keycatch = {
    key:function(evt)
    {
      switch(evt.key)
      {
        case "d": DOUBLETIME = !DOUBLETIME; break;
        case "p": RESUME_SIM = !RESUME_SIM; break;
        case "n": gg.b.nutrition_view = !gg.b.nutrition_view; break;
        case "r": gg.b.raining = !gg.b.raining; break;
        case "a": debug_pathfinding = !debug_pathfinding; break;
        case "j": debug_jobs = !debug_jobs; break;
      }
    }
  }

  self.ready = function()
  {
    self.resize(stage);
    gg.b = new board();
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
    gg.shop = new shop();
    gg.hand = new hand();
    gg.inspector = new inspector();
  };

  self.tick = function()
  {
    hoverer.filter(gg.b);
    gg.hand.filter_hover(hoverer);

    var check = true;
    if(check) check = !gg.hand.filter_drag(dragger);
    if(check) check = !clicker.filter(gg.b);
    if(check) check = !gg.shop.filter(clicker);

    keyer.filter(keycatch);

    clicker.flush();
    hoverer.flush();
    dragger.flush();
    keyer.flush();

    if(RESUME_SIM)
    {
      gg.b.tick();
      screenSpace(gg.cam, gg.canv, gg.b);
      for(var i = 0; i < gg.items.length; i++)
      {
        var o = gg.items[i];
        o.tick();
        screenSpace(gg.cam, gg.canv, o);
        o.y -= o.wz;
      }
      for(var i = 0; i < gg.farmbits.length; i++)
      {
        var f = gg.farmbits[i];
        f.tick();
        screenSpace(gg.cam, gg.canv, f);
      }
      gg.shop.tick();
      gg.hand.tick();
    }
  };

  self.draw = function()
  {
    gg.b.draw();
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();
    for(var i = 0; i < gg.items.length; i++)
      gg.items[i].draw();
    gg.shop.draw();
    gg.hand.draw();
    gg.inspector.draw();

    var x = 10;
    var y = 450;
    h = 25;
    gg.ctx.fillText("d- speed time",    x,y); y += h;
    gg.ctx.fillText("p- pause",         x,y); y += h;
    gg.ctx.fillText("n- nutrition view",x,y); y += h;
    gg.ctx.fillText("r- rain",          x,y); y += h;
    gg.ctx.fillText("a- debug pathing", x,y); y += h;
    gg.ctx.fillText("j- debug jobs",    x,y); y += h;
  };

  self.cleanup = function()
  {
  };

};

