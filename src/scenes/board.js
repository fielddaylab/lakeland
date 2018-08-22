var tile = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;
  self.phosphorus = 0;
}

var board = function()
{
  var self = this;

  self.grid_w = 100;
  self.grid_h = 100;
  self.grid = [];
  self.grid_i = function(x,y)
  {
    if(x <  0)           x += self.grid_w;
    if(y <  0)           y += self.grid_h;
    if(x >= self.grid_w) x -= self.grid_w;
    if(y >= self.grid_h) y -= self.grid_h;
    return self.grid_w*y+x;
  }
  self.shuffle_i = [];

  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.hovering;
  self.hover_x;
  self.hover_y;

  self.init = function()
  {
    for(var y = 0; y < self.grid_h; y++)
      for(var x = 0; x < self.grid_w; x++)
      {
        var i = self.grid_i(x,y);
        var t = new tile();
        t.x = x;
        t.y = y;
        t.phosphorus = rand();
        self.grid[i] = t;
      }
    var n = self.grid_w*self.grid_h;
    for(var i = 0; i < n; i++) self.shuffle_i[i] = i;

    self.hovering = 0;
  }
  self.init();

  self.shuffle = function()
  {
    var n = self.grid_w*self.grid_h;
    for(var i = 0; i < n; i++)
    {
      var val = self.shuffle_i[i];
      var swap = randIntBelow(n-i);
      self.shuffle_i[i] = self.shuffle_i[swap];
      self.shuffle_i[swap] = val;
    }
  }

  self.flow = function(from, to)
  {
    var d = from.phosphorus-to.phosphorus;
    from.phosphorus -= d*0.001;
    to.phosphorus   += d*0.001;
  }

  self.hover = function(evt)
  {
    worldSpaceDoEvt(gg.cam, gg.canv, evt);
    self.hover_x = floor(mapVal(self.wx-self.ww/2, self.wx+self.ww/2, 0, self.grid_w, evt.wx));
    self.hover_y = floor(mapVal(self.wy-self.wh/2, self.wy+self.wh/2, 0, self.grid_h, evt.wy));
  }
  self.unhover = function(evt)
  {
  }

  self.tick = function()
  {
    var n = self.grid_w*self.grid_h;
    for(var i = 0; i < n; i++)
    {
      var t = self.grid[i];
      var right = self.grid[self.grid_i(t.x+1,t.y  )];
      var top   = self.grid[self.grid_i(t.x  ,t.y+1)];
      self.flow(t,right);
      self.flow(t,top);
    }
  }

  self.draw = function()
  {
    var tw = self.w/self.grid_w;
    var th = self.h/self.grid_h;
    for(var y = 0; y < self.grid_h; y++)
      for(var x = 0; x < self.grid_w; x++)
      {
        var i = self.grid_i(x,y);
        var t = self.grid[i];
        gg.ctx.fillStyle = "rgba("+floor(t.phosphorus*255)+",255,255,1)";
        gg.ctx.fillRect(self.x+x*tw,self.y+self.h-(y+1)*th,tw,th);
      }
    if(self.hovering)
    {
      gg.ctx.strokeRect(self.x+self.hover_x*tw,self.y+self.h-(self.hover_y+1)*th,tw,th);
    }
  }
}

