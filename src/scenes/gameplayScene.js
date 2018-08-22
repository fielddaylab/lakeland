var gg = {};
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

    gg.cam = {wx:0,wy:0,ww:gg.canvas.width,wh:gg.canvas.height}
    if(hoverer) hoverer.detach();
    hoverer = new PersistentHoverer({source:gg.canvas});
  }
  //self.resize(stage); //executed in 'ready'

  var hoverer;

  self.ready = function()
  {
    self.resize(stage);
    gg.b = new board();
    gg.farmbits = [];
    for(var i = 0; i < 10; i++)
    {
      gg.farmbits[i] = new farmbit();
      gg.farmbits[i].wx = gg.b.wx+rand0()*gg.b.ww/2;
      gg.farmbits[i].wy = gg.b.wy+rand0()*gg.b.ww/2;
    }
  };

  self.tick = function()
  {
    gg.b.tick();
    screenSpace(gg.cam, gg.canv, gg.b);
    for(var i = 0; i < gg.farmbits.length; i++)
    {
      gg.farmbits[i].tick();
      screenSpace(gg.cam, gg.canv, gg.farmbits[i]);
    }
    hoverer.filter(gg.b);
    hoverer.flush();
  };

  self.draw = function()
  {
    gg.b.draw();
    for(var i = 0; i < gg.farmbits.length; i++)
      gg.farmbits[i].draw();
  };

  self.cleanup = function()
  {
  };

};

