var NullScene = function(game, stage)
{
  var self = this;

  var canvas;
  var ctx;
  self.resize = function(s)
  {
    stage = s;
    canvas = stage.canvas;
    ctx = stage.context;
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
