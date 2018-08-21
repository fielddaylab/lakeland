var board = function()
{
  var self = this;

  self.grid_w = 100;
  self.grid_h = 100;

  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.tick = function()
  {

  }

  self.draw = function(ctx)
  {
    ctx.fillRect(self.x,self.y,self.w,self.h);
  }
}

