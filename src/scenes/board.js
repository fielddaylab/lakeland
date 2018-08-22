var ENUM = 0;
var GRID_TYPE_NULL  = ENUM; ENUM++;
var GRID_TYPE_LAND  = ENUM; ENUM++;
var GRID_TYPE_WATER = ENUM; ENUM++;
var GRID_TYPE_COUNT = ENUM; ENUM++;

var tile = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;
  self.type = GRID_TYPE_LAND;
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
  self.grid_t = function(x,y)
  {
    return self.grid[self.grid_i(x,y)];
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
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        self.grid[i] = t;
      }

    var atomic_push = function(n,ar)
    {
      var found = false;
      for(var j = 0; j < ar.length; j++) if(ar[j] == n) found = true;
      if(!found) ar.push(n);
    }

    var slow_flood_fill = function(fill)
    {
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.grid_t(t.x-1,t.y  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.grid_t(t.x+1,t.y  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.grid_t(t.x  ,t.y-1); if(n.type == t.type) atomic_push(n,fill);
        n = self.grid_t(t.x  ,t.y+1); if(n.type == t.type) atomic_push(n,fill);
      }
      return fill;
    }

    var slow_flood_border = function(fill)
    {
      var border = [];
      for(var i = 0; i < fill.length; i++)
      {
        var t = fill[i];
        var n;
        n = self.grid_t(t.x-1,t.y  ); if(n.type != t.type) atomic_push(n,border);
        n = self.grid_t(t.x+1,t.y  ); if(n.type != t.type) atomic_push(n,border);
        n = self.grid_t(t.x  ,t.y-1); if(n.type != t.type) atomic_push(n,border);
        n = self.grid_t(t.x  ,t.y+1); if(n.type != t.type) atomic_push(n,border);
      }
      return border;
    }

    var n_lakes = 2;
    for(var i = 0; i < n_lakes; i++)
    {
      var src_x = randIntBelow(self.grid_w);
      var src_y = randIntBelow(self.grid_h);
      var t = self.grid_t(src_x,src_y);
      t.type = GRID_TYPE_WATER;
      var lake_size = 10;
      var lake_tiles = slow_flood_fill([t]);
      var lake_border = slow_flood_border(lake_tiles);

      for(var j = 0; j < lake_size; j++)
      {
        var b_i = randIntBelow(lake_border.length);
        var t = lake_border[b_i];
        t.type = GRID_TYPE_WATER;
        lake_tiles.push(t);
        lake_border.splice(b_i,1);

        var n;
        n = self.grid_t(t.x-1,t.y  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.grid_t(t.x+1,t.y  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.grid_t(t.x  ,t.y-1); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.grid_t(t.x  ,t.y+1); if(n.type != t.type) atomic_push(n,lake_border);
      }
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
    return;
    var n = self.grid_w*self.grid_h;
    for(var i = 0; i < n; i++)
    {
      var t = self.grid[i];
      var right = self.grid_t(t.x+1,t.y  );
      var top   = self.grid_t(t.x  ,t.y+1);
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
        var t = self.grid_t(x,y);
             if(t.type == GRID_TYPE_LAND)  gg.ctx.fillStyle = "rgba("+(255-floor(t.phosphorus*255))+",255,255,1)";
        else if(t.type == GRID_TYPE_WATER) gg.ctx.fillStyle = "rgba(255,"+(255-floor(t.phosphorus*255))+",255,1)";
        gg.ctx.fillRect(self.x+x*tw,self.y+self.h-(y+1)*th,tw,th);
      }
    if(self.hovering)
    {
      gg.ctx.strokeRect(self.x+self.hover_x*tw,self.y+self.h-(self.hover_y+1)*th,tw,th);
    }
  }
}

var farmbit_imgs = [];
var farmbit = function()
{
  var self = this;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.frame_i = 0;
  self.frame_l = 10;
  self.frame_t = randIntBelow(self.frame_l);

  if(!farmbit_imgs.length)
  {
    var ctx;
    farmbit_imgs[0] = GenIcon(10,10);
    ctx = farmbit_imgs[0].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg

    farmbit_imgs[1] = GenIcon(10,10);
    ctx = farmbit_imgs[1].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%farmbit_imgs.length;
      self.frame_t = 0;
    }
  }

  self.draw = function()
  {
    gg.ctx.drawImage(farmbit_imgs[self.frame_i],self.x,self.y,self.w,self.h);
  }
}

