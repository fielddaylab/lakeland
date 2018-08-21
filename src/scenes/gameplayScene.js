var GamePlayScene = function(game, stage)
{
  var self = this;

  var canv;
  var canvas;
  var ctx;
  self.resize = function(s)
  {
    stage = s;
    canv = stage.canv;
    canvas = canv.canvas;
    ctx = canv.context;

    cam = {wx:0,wy:0,ww:canvas.width,wh:canvas.height}
  }
  self.resize(stage);

  var cam;
  var b;

  self.ready = function()
  {
    self.resize(stage);
    b = new board();
  };

  self.tick = function()
  {
    b.tick();
    screenSpace(cam, canv, b);
  };

  self.draw = function()
  {
    b.draw(ctx);
  };

  self.cleanup = function()
  {
  };

};

