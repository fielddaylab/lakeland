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
    if(keyer)   keyer.detach();   keyer   = new Keyer({source:gg.canvas});
  }
  //self.resize(stage); //executed in 'ready'

  var clicker;
  var hoverer;
  var keyer;
  var keycatch = {
    key:function(evt)
    {
      switch(evt.key)
      {
        case "d": DOUBLETIME = !DOUBLETIME; break;
        case "p": RESUME_SIM = !RESUME_SIM; break;
      }
    }
  }

  self.ready = function()
  {
    self.resize(stage);
    gg.b = new board();
    gg.items = [];
    gg.farmbits = [];
    for(var i = 0; i < farmbits_start_n; i++)
    {
      gg.farmbits[i] = new farmbit();
      gg.farmbits[i].wx = gg.b.wx+rand0()*gg.b.ww/2;
      gg.farmbits[i].wy = gg.b.wy+rand0()*gg.b.ww/2;
    }
    gg.jobs = [];
    gg.palette = new palette();
    gg.inspector = new inspector();
  };

  self.tick = function()
  {
    hoverer.filter(gg.b);
    //gg.palette.filter(hoverer);

    var check = true;
    if(check) check = !clicker.filter(gg.b);
    if(check) check = !gg.palette.filter(clicker);

    keyer.filter(keycatch);

    hoverer.flush();
    clicker.flush();
    keyer.flush();

    gg.b.tick();
    screenSpace(gg.cam, gg.canv, gg.b);
    if(RESUME_SIM)
    {
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
    }
  };

  self.draw = function()
  {
    gg.b.draw();
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();
    for(var i = 0; i < gg.items.length; i++)
      gg.items[i].draw();
    gg.palette.draw();
    gg.inspector.draw();
  };

  self.cleanup = function()
  {
  };

};

