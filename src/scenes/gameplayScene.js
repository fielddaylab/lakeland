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

  self.ready = function()
  {
    self.resize(stage);
    b = new board();
  };

  self.tick = function()
  {
    b.tick();
    screenSpace(gg.cam, gg.canv, b);
    hoverer.filter(b);
    hoverer.flush();
  };

  self.draw = function()
  {
    b.draw();
  };

  self.cleanup = function()
  {
  };

};

