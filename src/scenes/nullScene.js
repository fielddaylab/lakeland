var NullScene = function(game, stage)
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
  }
  self.resize(stage);

  self.ready = function()
  {

  };

  self.tick = function()
  {

  };

  self.draw = function()
  {

  };

  self.cleanup = function()
  {

  };
};
