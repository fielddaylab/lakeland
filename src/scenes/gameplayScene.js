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
  var b;
  var farmbits;

  self.ready = function()
  {
    self.resize(stage);
    b = new board();
    farmbits = [];
    for(var i = 0; i < 10; i++)
    {
      farmbits[i] = new farmbit();
      farmbits[i].wx = b.wx+rand0()*b.ww/2;
      farmbits[i].wy = b.wy+rand0()*b.ww/2;
    }
  };

  self.tick = function()
  {
    b.tick();
    screenSpace(gg.cam, gg.canv, b);
    for(var i = 0; i < farmbits.length; i++)
    {
      farmbits[i].tick();
      screenSpace(gg.cam, gg.canv, farmbits[i]);
    }
    hoverer.filter(b);
    hoverer.flush();
  };

  self.draw = function()
  {
    b.draw();
    for(var i = 0; i < farmbits.length; i++)
      farmbits[i].draw();
  };

  self.cleanup = function()
  {
  };

};

