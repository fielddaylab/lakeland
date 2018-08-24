var ENUM;

ENUM = 0;
var TILE_TYPE_NULL    = ENUM; ENUM++;
var TILE_TYPE_LAND    = ENUM; ENUM++;
var TILE_TYPE_WATER   = ENUM; ENUM++;
var TILE_TYPE_SHORE   = ENUM; ENUM++;
var TILE_TYPE_FARM    = ENUM; ENUM++;
var TILE_TYPE_STORAGE = ENUM; ENUM++;
var TILE_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var TILE_STATE_NULL           = ENUM; ENUM++;
var TILE_STATE_FARM_UNPLANTED = ENUM; ENUM++;
var TILE_STATE_FARM_PLANTED   = ENUM; ENUM++;
var TILE_STATE_FARM_GROWN     = ENUM; ENUM++;
var TILE_STATE_STORAGE_EMPTY  = ENUM; ENUM++;
var TILE_STATE_STORAGE_FOOD   = ENUM; ENUM++;
var TILE_STATE_COUNT          = ENUM; ENUM++;

ENUM = 0;
var OBJECT_TYPE_NULL  = ENUM; ENUM++;
var OBJECT_TYPE_FOOD  = ENUM; ENUM++;
var OBJECT_TYPE_COUNT = ENUM; ENUM++;

ENUM = 0;
var OBJECT_STATE_NULL  = ENUM; ENUM++;
var OBJECT_STATE_COUNT = ENUM; ENUM++;

ENUM = 0;
var JOB_TYPE_NULL    = ENUM; ENUM++;
var JOB_TYPE_IDLE    = ENUM; ENUM++;
var JOB_TYPE_WAIT    = ENUM; ENUM++;
var JOB_TYPE_SLEEP   = ENUM; ENUM++;
var JOB_TYPE_PLAY    = ENUM; ENUM++;
var JOB_TYPE_PLANT   = ENUM; ENUM++;
var JOB_TYPE_HARVEST = ENUM; ENUM++;
var JOB_TYPE_GET     = ENUM; ENUM++;
var JOB_TYPE_DELIVER = ENUM; ENUM++;
var JOB_TYPE_COUNT   = ENUM; ENUM++;

ENUM = 0;
var JOB_STATE_NULL        = ENUM; ENUM++;
var JOB_STATE_SEEK        = ENUM; ENUM++;
var JOB_STATE_ACT         = ENUM; ENUM++;
var JOB_STATE_IDLE_CHILL  = ENUM; ENUM++;
var JOB_STATE_IDLE_WANDER = ENUM; ENUM++;
var JOB_STATE_COUNT       = ENUM; ENUM++;

ENUM = 0;
var FARMBIT_STATE_NULL      = ENUM; ENUM++;
var FARMBIT_STATE_DESPERATE = ENUM; ENUM++;
var FARMBIT_STATE_MOTIVATED = ENUM; ENUM++;
var FARMBIT_STATE_CONTENT   = ENUM; ENUM++;
var FARMBIT_STATE_COUNT     = ENUM; ENUM++;

var fullness_job_for_b = function(b)
{
  var n;
  var job;
  var job_type = JOB_TYPE_NULL;
  var job_d = 9999;
  var d;

  var o;
  n = gg.objects.length;
  for(var i = 0; i < n; i++)
  {
    o = gg.objects[i];
    if(o.type == OBJECT_TYPE_FOOD && !o.lock)
    {
      d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job = o;
        job_type = JOB_TYPE_GET;
        job_d = d;
      }
    }
  }

  if(job_type == JOB_TYPE_NULL)
  {
    var t;
    n = gg.b.tiles.length;
    for(var i = 0; i < n; i++)
    {
      t = gg.b.tiles[i];
      if(t.type == TILE_TYPE_FARM)
      {
        switch(job_type)
        {
          case JOB_TYPE_NULL:
            //break; //DON'T BREAK!
          case JOB_TYPE_PLANT:
            if(t.state == TILE_STATE_FARM_UNPLANTED && !t.lock)
            {
              if(job_type != JOB_TYPE_PLANT)
              {
                job_type = JOB_TYPE_PLANT;
                job_d = 9999;
              }
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job = t;
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_HARVEST:
            if(t.state == TILE_STATE_FARM_GROWN && !t.lock)
            {
              if(job_type != JOB_TYPE_HARVEST)
              {
                job_type = JOB_TYPE_HARVEST;
                job_d = 9999;
              }
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job = t;
                job_d = d;
              }
            }
            break;
        }
      }
    }
  }

  if(job)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_state = JOB_STATE_SEEK;
    b.job = job;
    b.job.lock = 1;
    return 1;
  }
  return 0;
}

var energy_job_for_b = function(b)
{
  b.go_idle();
  b.job_type = JOB_TYPE_SLEEP;
  b.job_state = JOB_STATE_SEEK;
  return 1;
}

var joy_job_for_b = function(b)
{
  var d;
  var job_d = 9999;
  var job;
  var t;
  n = gg.b.tiles.length;
  for(var i = 0; i < n; i++)
  {
    t = gg.b.tiles[i];
    if(t.type == TILE_TYPE_WATER && !t.lock)
    {
      d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job = t;
        job_d = d;
      }
    }
  }
  if(job)
  {
    b.go_idle();
    b.job_type = JOB_TYPE_PLAY;
    b.job_state = JOB_STATE_SEEK;
    b.job = job;
    return 1;
  }
  return 0;
}

var fulfillment_job_for_b = function(b)
{
  var n;
  var job;
  var job_type = JOB_TYPE_NULL;
  var job_d = 9999;
  var d;

  var o;
  n = gg.objects.length;
  for(var i = 0; i < n; i++)
  {
    o = gg.objects[i];
    if(!o.lock)
    {
      d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
      if(d < job_d)
      {
        job = o;
        job_type = JOB_TYPE_GET;
        job_d = d;
      }
    }
  }

  if(job_type == JOB_TYPE_NULL)
  {
    var t;
    n = gg.b.tiles.length;
    for(var i = 0; i < n; i++)
    {
      t = gg.b.tiles[i];
      if(t.type == TILE_TYPE_FARM)
      {
        switch(job_type)
        {
          case JOB_TYPE_NULL:
            //break; //DON'T BREAK!
          case JOB_TYPE_PLANT:
            if(t.state == TILE_STATE_FARM_UNPLANTED && !t.lock)
            {
              if(job_type != JOB_TYPE_PLANT)
              {
                job_type = JOB_TYPE_PLANT;
                job_d = 9999;
              }
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job = t;
                job_d = d;
              }
            }
            //break; //DON'T BREAK!
          case JOB_TYPE_HARVEST:
            if(t.state == TILE_STATE_FARM_GROWN && !t.lock)
            {
              if(job_type != JOB_TYPE_HARVEST)
              {
                job_type = JOB_TYPE_HARVEST;
                job_d = 9999;
              }
              d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
              if(d < job_d)
              {
                job = t;
                job_d = d;
              }
            }
            break;
        }
      }
    }
  }

  if(job)
  {
    b.go_idle();
    b.job_type = job_type;
    b.job_state = JOB_STATE_SEEK;
    b.job = job;
    b.job.lock = 1;
    return 1;
  }
  return 0;
}

var job_for_b = function(b)
{
  if(b.job_type != JOB_TYPE_IDLE) return; //already busy!

  if(b.fullness_state     == FARMBIT_STATE_DESPERATE && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_DESPERATE && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_DESPERATE && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_DESPERATE && fulfillment_job_for_b(b))  return;
  if(b.fullness_state     == FARMBIT_STATE_MOTIVATED && fullness_job_for_b(b))     return;
  if(b.energy_state       == FARMBIT_STATE_MOTIVATED && energy_job_for_b(b))       return;
  if(b.joy_state          == FARMBIT_STATE_MOTIVATED && joy_job_for_b(b))          return;
  if(b.fulfillment_state  == FARMBIT_STATE_MOTIVATED && fulfillment_job_for_b(b))  return;
  return;
}

var b_for_job = function(job, job_type)
{
  var n = gg.farmbits.length;
  if(!n) return;
  var b;
  switch(job_type)
  {
    case JOB_TYPE_PLANT:
    case JOB_TYPE_HARVEST:
    {
      var t = job;
      var best;
      var b_rank = -1;
      var b_d = 9999;
      var rank = -1;
      var d;
      for(var i = 0; i < n; i++)
      {
        b = gg.farmbits[i];
        if(b.job_type != JOB_TYPE_IDLE) continue;
        rank = -1;
             if(b.fullness_state    == FARMBIT_STATE_DESPERATE && b_rank <= 4) rank = 4;
        else if(b.fulfillment_state == FARMBIT_STATE_DESPERATE && b_rank <= 3) rank = 3;
        else if(b.fullness_state    == FARMBIT_STATE_MOTIVATED && b_rank <= 2) rank = 2;
        else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED && b_rank <= 1) rank = 1;
        if(rank > b_rank)
        {
          d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
          b_rank = rank;
          b_d = d;
          best = b;
        }
        else if(rank == b_rank)
        {
          d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
          if(d < b_d)
          {
            b_rank = rank;
            b_d = d;
            best = b;
          }
        }
      }
      if(best)
      {
        best.job = job;
        best.job.lock = 1;
        best.job_type = job_type;
        best.job_state = JOB_STATE_SEEK;
        best.job_state_t = 0;
      }
    }
      break;
    case JOB_TYPE_GET:
    {
      var o = job;
      switch(o.type)
      {
        case OBJECT_TYPE_FOOD:
        {
          var best;
          var b_rank = -1;
          var b_d = 9999;
          var rank = -1;
          var d;
          for(var i = 0; i < n; i++)
          {
            b = gg.farmbits[i];
            if(b.job_type != JOB_TYPE_IDLE) continue;
            rank = -1;
                 if(b.fullness_state    == FARMBIT_STATE_DESPERATE && b_rank <= 4) rank = 4;
            else if(b.fulfillment_state == FARMBIT_STATE_DESPERATE && b_rank <= 3) rank = 3;
            else if(b.fullness_state    == FARMBIT_STATE_MOTIVATED && b_rank <= 2) rank = 2;
            else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED && b_rank <= 1) rank = 1;
            if(rank > b_rank)
            {
              d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
              b_rank = rank;
              b_d = d;
              best = b;
            }
            else if(rank == b_rank)
            {
              d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
              if(d < b_d)
              {
                b_rank = rank;
                b_d = d;
                best = b;
              }
            }
          }
          if(best)
          {
            best.job = job;
            best.job.lock = 1;
            best.job_type = job_type;
            best.job_state = JOB_STATE_SEEK;
            best.job_state_t = 0;
          }
        }
          break;
        default:
        {
          var best;
          var b_rank = -1;
          var b_d = 9999;
          var rank = -1;
          var d;
          for(var i = 0; i < n; i++)
          {
            b = gg.farmbits[i];
            if(b.job_type != JOB_TYPE_IDLE) continue;
            rank = -1;
                 if(b.fulfillment_state == FARMBIT_STATE_DESPERATE && b_rank <= 2) rank = 2;
            else if(b.fulfillment_state == FARMBIT_STATE_MOTIVATED && b_rank <= 1) rank = 1;
            if(rank > b_rank)
            {
              d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
              b_rank = rank;
              b_d = d;
              best = b;
            }
            else if(rank == b_rank)
            {
              d = distsqr(o.tile.tx,o.tile.ty,b.tile.tx,b.tile.ty);
              if(d < b_d)
              {
                b_rank = rank;
                b_d = d;
                best = b;
              }
            }
          }
          if(best)
          {
            best.job = job;
            best.job.lock = 1;
            best.job_type = job_type;
            best.job_state = JOB_STATE_SEEK;
            best.job_state_t = 0;
          }
        }
          break;
      }
    }
      break;
    default:
      break;
  }
}

var break_object = function(o)
{
  for(var i = 0; i < gg.objects.length; i++)
    if(gg.objects[i] == o) gg.objects.splice(i,1);
}

var tile = function()
{
  var self = this;

  self.tx = 0;
  self.ty = 0;
  self.type = TILE_TYPE_LAND;
  self.state = TILE_STATE_NULL;
  self.state_t = 0;
  self.val = 0;
  self.phosphorus = 0;
  self.withdraw_locks = 0;
  self.deposit_locks = 0;
  self.lock = 0;
}

var board = function()
{
  var self = this;

  self.tw = board_w;
  self.th = board_h;
  self.tiles = [];
  self.tiles_i = function(tx,ty)
  {
    if(tx <  0)       tx += self.tw;
    if(ty <  0)       ty += self.th;
    if(tx >= self.tw) tx -= self.tw;
    if(ty >= self.th) ty -= self.th;
    return self.tw*ty+tx;
  }
  self.tiles_t = function(tx,ty)
  {
    return self.tiles[self.tiles_i(tx,ty)];
  }
  self.tiles_wt = function(wx,wy)
  {
    var tx = floor(clampMapVal(self.wx-self.ww/2, self.wx+self.ww/2+1, 0, self.tw, wx));
    var ty = floor(clampMapVal(self.wy-self.wh/2, self.wy+self.wh/2+1, 0, self.th, wy));
    return self.tiles_t(tx,ty);
  }
  self.tiles_tw = function(t,w)
  {
    w.wx = self.wx-self.ww/2+((t.tx+0.5)*self.ww/self.tw);
    w.wy = self.wy-self.wh/2+((t.ty+0.5)*self.wh/self.th);
  }
  self.shuffle_i = [];

  self.wx = 0;
  self.wy = 0;
  self.ww = 660;
  self.wh = 660;

  self.wrapw = function(o)
  {
    if(o.wx < self.wx-self.ww/2) o.wx = self.wx+self.ww/2;
    if(o.wx > self.wx+self.ww/2) o.wx = self.wx-self.ww/2;
    if(o.wy < self.wy-self.wh/2) o.wy = self.wy+self.wh/2;
    if(o.wy > self.wy+self.wh/2) o.wy = self.wy-self.wh/2;
  }

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.hovering;
  self.hover_t;

  self.init = function()
  {
    for(var ty = 0; ty < self.th; ty++)
      for(var tx = 0; tx < self.tw; tx++)
      {
        var i = self.tiles_i(tx,ty);
        var t = new tile();
        t.tx = tx;
        t.ty = ty;
        t.phosphorus = rand();
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        t.phosphorus *= t.phosphorus;
        self.tiles[i] = t;
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
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type == t.type) atomic_push(n,fill);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type == t.type) atomic_push(n,fill);
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
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,border);
      }
      return border;
    }

    var n_lakes = 4;
    for(var i = 0; i < n_lakes; i++)
    {
      var src_tx = randIntBelow(self.tw);
      var src_ty = randIntBelow(self.th);
      var t = self.tiles_t(src_tx,src_ty);
      t.type = TILE_TYPE_WATER;
      var lake_size = 200+randIntBelow(400);
      var lake_tiles = slow_flood_fill([t]);
      var lake_border = slow_flood_border(lake_tiles);

      for(var j = 0; j < lake_size; j++)
      {
        var b_i = randIntBelow(lake_border.length);
        var t = lake_border[b_i];
        t.type = TILE_TYPE_WATER;
        lake_tiles.push(t);
        lake_border.splice(b_i,1);

        var n;
        n = self.tiles_t(t.tx-1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx+1,t.ty  ); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty-1); if(n.type != t.type) atomic_push(n,lake_border);
        n = self.tiles_t(t.tx  ,t.ty+1); if(n.type != t.type) atomic_push(n,lake_border);
      }
      for(var j = 0; j < lake_border.length; j++)
        lake_border[j].type = TILE_TYPE_SHORE;
    }

    var n = self.tw*self.th;
    for(var i = 0; i < n; i++) self.shuffle_i[i] = i;

    self.hovering = 0;
  }
  self.init();

  self.shuffle = function()
  {
    var n = self.tw*self.th;
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
    self.hover_t = self.tiles_wt(evt.wx,evt.wy);

    var n;
    var hovered;
    n = gg.farmbits.length;
    for(var i = 0; i < n; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) hovered = b; }
    if(hovered)
    {
      gg.inspector.quick = hovered;
      gg.inspector.quick_type = INSPECTOR_CONTENT_FARMBIT;
    }
    if(!hovered)
    {
      n = gg.objects.length;
      for(var i = 0; i < n; i++) { var o = gg.objects[i]; if(ptWithinBox(o,evt.doX,evt.doY)) hovered = o; }
      if(hovered)
      {
        gg.inspector.quick = hovered;
        gg.inspector.quick_type = INSPECTOR_CONTENT_OBJECT;
      }
      else
      {
        gg.inspector.quick = self.hover_t;
        gg.inspector.quick_type = INSPECTOR_CONTENT_TILE;
      }
    }
  }
  self.unhover = function(evt)
  {
    self.hover_t = 0;
    gg.inspector.tile_quick = 0;
    gg.inspector.quick_type = INSPECTOR_CONTENT_NULL;
  }

  self.click = function(evt)
  {
    if(gg.palette.palette == PALETTE_PROD)
    {
      var n;
      var clicked;
      n = gg.farmbits.length;
      for(var i = 0; i < n; i++) { var b = gg.farmbits[i]; if(ptWithinBox(b,evt.doX,evt.doY)) clicked = b; }
      if(clicked)
      {
        gg.inspector.detailed = clicked;
        gg.inspector.detailed_type = INSPECTOR_CONTENT_FARMBIT;
      }
      if(!clicked)
      {
        n = gg.objects.length;
        for(var i = 0; i < n; i++) { var o = gg.objects[i]; if(ptWithinBox(o,evt.doX,evt.doY)) clicked = o; }
        if(clicked)
        {
          gg.inspector.detailed = clicked;
          gg.inspector.detailed_type = INSPECTOR_CONTENT_OBJECT;
        }
        else
        {
          gg.inspector.detailed = self.hover_t;
          gg.inspector.detailed_type = INSPECTOR_CONTENT_TILE;
        }
      }
      if(!self.hover_t) return;
    }

    if(gg.palette.palette == PALETTE_FARM && self.hover_t.type != TILE_TYPE_FARM)
    {
      self.hover_t.type = TILE_TYPE_FARM;
      self.hover_t.state = TILE_STATE_FARM_UNPLANTED;
      self.hover_t.state_t = 0;
      b_for_job(self.hover_t, JOB_TYPE_PLANT);
    }
    if(gg.palette.palette == PALETTE_STORAGE && self.hover_t.type != TILE_TYPE_STORAGE)
    {
      self.hover_t.type = TILE_TYPE_STORAGE;
      self.hover_t.state = TILE_STATE_STORAGE_EMPTY;
      self.hover_t.state_t = 0;
    }
  }

  self.tick = function()
  {
    var n = self.tw*self.th;
    for(var i = 0; i < n; i++)
    {
      var t = self.tiles[i];
      t.state_t++;
      switch(t.type)
      {
        case TILE_TYPE_FARM:
          if(t.state == TILE_STATE_FARM_PLANTED && t.state_t > farm_grow_t)
          {
            t.state = TILE_STATE_FARM_GROWN;
            t.state_t = 0;
            b_for_job(t,JOB_TYPE_HARVEST);
          }
        break;
      }
      var right = self.tiles_t(t.tx+1,t.ty  );
      var top   = self.tiles_t(t.tx  ,t.ty+1);
      self.flow(t,right);
      self.flow(t,top);
    }
  }

  self.draw = function()
  {
    var w = self.w/self.tw;
    var h = self.h/self.th;
    var i = 0;
    for(var ty = 0; ty < self.th; ty++)
    {
      for(var tx = 0; tx < self.tw; tx++)
      {
        var t = self.tiles[i];
        switch(t.type)
        {
          case TILE_TYPE_LAND:  gg.ctx.fillStyle = "rgba(255,"+(255-floor(t.phosphorus*255))+",255,1)"; break;
          case TILE_TYPE_WATER: gg.ctx.fillStyle = "rgba("+floor(t.phosphorus*255)+",255,255,1)"; break;
          case TILE_TYPE_SHORE: gg.ctx.fillStyle = "rgba("+floor((t.phosphorus/2+0.5)*255)+",255,255,1)"; break;
          case TILE_TYPE_FARM:
          {
            switch(t.state)
            {
              case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillStyle = brown; break;
              case TILE_STATE_FARM_PLANTED:   gg.ctx.fillStyle = "rgba(255,"+floor(t.state_t/farm_grow_t*255)+",0,1)"; break;
              case TILE_STATE_FARM_GROWN:     gg.ctx.fillStyle = green; break;
            }
          }
            break;
          case TILE_TYPE_STORAGE: gg.ctx.fillStyle = purple; break;
        }
        gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
        i++;
      }
    }
    var t;
    if(gg.inspector.detailed_type == INSPECTOR_CONTENT_TILE) { t = gg.inspector.detailed; gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
    if(gg.inspector.quick_type    == INSPECTOR_CONTENT_TILE) { t = gg.inspector.quick;    gg.ctx.strokeStyle = green; gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h); }
  }
}

var object = function()
{
  var self = this;

  self.wx = 0;
  self.wy = 0;
  self.ww = 20;
  self.wh = 20;
  self.wz = 0;
  self.wvx = 0;
  self.wvy = 0;
  self.wvz = 0;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.tile;
  self.type = OBJECT_TYPE_NULL;
  self.state = OBJECT_STATE_NULL;
  self.lock = 0;

  self.tick = function()
  {
    self.wvz -= 0.1;
    self.wx += self.wvx;
    self.wy += self.wvy;
    self.wz += self.wvz;
    gg.b.wrapw(self);
    if(self.wz < 0) { self.wz = 0; self.wvz *= -1; }
    self.wvx *= 0.95;
    self.wvy *= 0.95
    self.wvz *= 0.95
    if(abs(self.wvx) < 0.01) self.wvx = 0;
    if(abs(self.wvy) < 0.01) self.wvy = 0;
    if(self.wz < 0.01 && abs(self.wvz) < 0.1) { self.wvz = 0; self.wz = 0; }

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    gg.ctx.fillStyle = black;
    fillBox(self,gg.ctx);
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

  self.walk_speed = 1; //MUST BE < tile_w
  self.move_dir_x = 0.;
  self.move_dir_y = 0.;

  self.job_type = JOB_TYPE_IDLE;
  self.job = 0;
  self.object = 0;
  self.job_state = JOB_STATE_IDLE_CHILL;
  self.job_state_t = 0;
  self.tile;

  self.fullness    = 1;
  self.energy      = 1;
  self.joy         = 1;
  self.fulfillment = 1;
  self.fullness_state    = FARMBIT_STATE_CONTENT;
  self.energy_state      = FARMBIT_STATE_CONTENT;
  self.joy_state         = FARMBIT_STATE_CONTENT;
  self.fulfillment_state = FARMBIT_STATE_CONTENT;

  self.frame_i = 0;
  self.frame_l = 10;
  self.frame_t = randIntBelow(self.frame_l);

  if(!farmbit_imgs.length)
  {
    var ctx;
    var s = 10;
    var i = 0;
    //idle
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //shrug
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //walk- fat arms
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    i++

    //walk- fat legs
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //idle- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //shrug- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat arms- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat legs- water
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //idle- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //shrug- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //walk- fat arms- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    i++

    //walk- fat legs- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    i++

    //idle- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //shrug- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,3,1,4); //left_arm //shoulder shrugged
    ctx.fillRect(7,3,1,4); //right_arm //shoulder shrugged
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat arms- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(1,4,2,4); //left_arm
    ctx.fillRect(7,4,1,4); //right_arm
    ctx.fillRect(3,7,1,3); //left_leg
    ctx.fillRect(5,7,2,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++

    //walk- fat legs- water- selected
    farmbit_imgs[i] = GenIcon(s,s);
    ctx = farmbit_imgs[i].context;
    ctx.fillStyle = green;
    ctx.fillRect(2,0,6,6);
    ctx.fillStyle = black;
    ctx.fillRect(3,1,4,6); //body
    ctx.fillRect(2,4,1,4); //left_arm
    ctx.fillRect(7,4,2,4); //right_arm
    ctx.fillRect(3,7,2,3); //left_leg
    ctx.fillRect(6,7,1,3); //right_leg
    ctx.clearRect(0,5,10,5); //clear
    i++
  }

  self.walk_toward_tile = function(t)
  {
    self.move_dir_x = t.tx-self.tile.tx;
    self.move_dir_y = t.ty-self.tile.ty;
    var l = sqrt(self.move_dir_x*self.move_dir_x+self.move_dir_y*self.move_dir_y);
    if(l != 0)
    {
      self.move_dir_x /= l;
      self.move_dir_y /= l;
    }

    self.wx += self.move_dir_x*self.walk_speed;
    self.wy += self.move_dir_y*self.walk_speed;
  }

  self.walk_toward_object = function(o)
  {
    var t = o.tile;
    self.walk_toward_tile(t);
  }

  self.go_idle = function()
  {
    self.job = 0;
    self.job_type = JOB_TYPE_IDLE;
    self.job_state = JOB_STATE_IDLE_CHILL;
    self.job_state_t = 0;
  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%2;
      self.frame_t = 0;
    }

    self.fullness    *= 0.999;
    self.energy      *= 0.999;
    self.joy         *= 0.999;
    self.fulfillment *= 0.999;

    var dirty = false;
    switch(self.fullness_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fullness < fullness_content)   { self.fullness_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fullness < fullness_motivated) { self.fullness_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.energy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.energy < energy_content)   { self.energy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.energy < energy_motivated) { self.energy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.joy_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.joy < joy_content)   { self.joy_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.joy < joy_motivated) { self.joy_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    switch(self.fulfillment_state)
    {
      case FARMBIT_STATE_CONTENT:   if(self.fulfillment < fulfillment_content)   { self.fulfillment_state = FARMBIT_STATE_MOTIVATED; dirty = 1; } break;
      case FARMBIT_STATE_MOTIVATED: if(self.fulfillment < fulfillment_motivated) { self.fulfillment_state = FARMBIT_STATE_DESPERATE; dirty = 1; } break;
      default: break;
    }
    if(dirty && self.job_type == JOB_TYPE_IDLE) job_for_b(self)

    self.job_state_t++;
    switch(self.job_type)
    {
      case JOB_TYPE_IDLE:
      {
        switch(self.job_state)
        {
          case JOB_STATE_IDLE_CHILL:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_IDLE_WANDER;
              self.job_state_t = 0;
              var theta = rand()*twopi;
              self.move_dir_x = cos(theta);
              self.move_dir_y = sin(theta);
            }
          }
            break;
          case JOB_STATE_IDLE_WANDER:
          {
            if(rand() < 0.01)
            {
              self.job_state = JOB_STATE_IDLE_CHILL;
              self.job_state_t = 0;
            }
            self.wx += self.move_dir_x*self.walk_speed;
            self.wy += self.move_dir_y*self.walk_speed;
            gg.b.wrapw(self);
          }
        }
      }
        break;
      case JOB_TYPE_WAIT:
      {
        if(self.job_state_t > 10)
        {
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_SLEEP:
      {
        self.job_state = JOB_STATE_ACT;
        self.energy += 0.01;
        if(self.energy > 1)
        {
          self.energy = 1;
          self.energy_state = FARMBIT_STATE_CONTENT;
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_PLAY:
      {
        var t = self.job;
        if(self.tile != t)
        {
          self.job_state = JOB_STATE_SEEK;
          self.walk_toward_tile(t);
        }
        else
        {
          self.job_state = JOB_STATE_ACT;
          self.joy += 0.02;
          if(self.joy > 1)
          {
            self.joy = 1;
            self.joy_state = FARMBIT_STATE_CONTENT;
            self.go_idle();
            job_for_b(self);
          }
        }
      }
        break;
      case JOB_TYPE_PLANT:
      {
        var t = self.job;
        if(self.tile != t)
        {
          self.job_state = JOB_STATE_SEEK;
          self.walk_toward_tile(t);
        }
        else
        {
          self.job_state = JOB_STATE_ACT;
          self.job.state = TILE_STATE_FARM_PLANTED;
          self.job.state_t = 0;
          self.job.lock = 0;
          self.fulfillment += 0.2;
          self.go_idle();
          job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_HARVEST:
      {
        var t = self.job;
        if(self.tile != t)
        {
          self.job_state = JOB_STATE_SEEK;
          self.walk_toward_tile(t);
        }
        else //self.tile == t
        {
          self.job_state = JOB_STATE_ACT;
          t.state = TILE_STATE_FARM_UNPLANTED;
          t.state_t = 0;
          t.lock = 0;

          //gen food
          var o = new object();
          o.type = OBJECT_TYPE_FOOD;
          o.tile = t;
          gg.b.tiles_tw(o.tile,o);
          var theta = rand()*twopi;
          var s = 2+rand()*5;
          o.wvx = cos(theta)*s;
          o.wvy = sin(theta)*s;
          o.wvz = s/2;
          gg.objects.push(o);

          self.fulfillment += 0.2;
          self.go_idle();
          b_for_job(o,JOB_TYPE_GET);
          b_for_job(t,JOB_TYPE_PLANT);
          if(self.job_type == JOB_TYPE_IDLE) job_for_b(self);
        }
      }
        break;
      case JOB_TYPE_GET:
      {
        var o = self.job;
        if(self.tile != o.tile || abs(o.wvz) > 0.01 || o.wz > 0.01)
        {
          self.job_state = JOB_STATE_SEEK;
          self.walk_toward_object(o);
        }
        else //self.tile == o.tile && object "still"
        {
          switch(o.type)
          {
            case OBJECT_TYPE_FOOD:
            {
              var consume = 0;
                   if(self.fullness_state    == FARMBIT_STATE_DESPERATE) consume = 1;
              else if(self.fulfillment_state == FARMBIT_STATE_DESPERATE) consume = 0;
              else if(self.fullness_state    == FARMBIT_STATE_MOTIVATED) consume = 1;
              else if(self.fulfillment_state == FARMBIT_STATE_MOTIVATED) consume = 0;
              if(consume)
              {
                self.job_state = JOB_STATE_ACT;
                break_object(o);
                self.fullness = 1;
                self.fullness_state = FARMBIT_STATE_CONTENT;
                self.go_idle();
                job_for_b(self);
              }
              else
              {
                var t;
                var job;
                var job_d = 9999;
                var d;
                var n = gg.b.tiles.length;
                for(var i = 0; i < n; i++)
                {
                  t = gg.b.tiles[i];
                  if(t.type == TILE_TYPE_STORAGE &&
                    (t.state == TILE_STATE_STORAGE_EMPTY || t.state == TILE_STATE_STORAGE_FOOD) &&
                    t.val+t.deposit_locks < storage_food_max)
                  {
                    d = distsqr(t.tx,t.ty,self.tile.tx,self.tile.ty);
                    if(d < job_d)
                    {
                      job = t;
                      job_d = d;
                    }
                  }
                }
                if(job)
                {
                  self.job = job;
                  self.job.deposit_locks++;
                  self.object = o;
                  self.job_type = JOB_TYPE_DELIVER;
                  self.job_state = JOB_STATE_SEEK;
                  self.job_state_t = 1;
                }
                else
                {
                  o.lock = 0;
                  var theta = rand()*twopi;
                  var s = 2+rand()*5;
                  o.wvx = cos(theta)*s;
                  o.wvy = sin(theta)*s;
                  o.wvz = s/2;
                  self.go_idle();
                  job_for_b(self);
                }
              }
            }
              break;
          }
        }
      }
        break;
      case JOB_TYPE_DELIVER:
      {
        var t = self.job;
        if(self.tile != t)
        {
          self.job_state = JOB_STATE_SEEK;
          self.object.wvx += (self.wx-self.object.wx)*0.01;
          self.object.wvy += (self.wy-self.object.wy)*0.01;
          self.walk_toward_tile(t);
        }
        else //self.tile == t
        {
          switch(t.type)
          {
            case TILE_TYPE_STORAGE:
            {
              break_object(self.object);
              t.state = TILE_STATE_STORAGE_FOOD;
              t.deposit_locks--;
              t.val++;
              self.object = 0;
              self.fulfillment = 1;
              self.fulfillment_state = FARMBIT_STATE_CONTENT;
              self.go_idle();
              job_for_b(self);
            }
              break;
          }
        }
      }
      break;
      default:
        return;
    }

    self.tile = gg.b.tiles_wt(self.wx,self.wy);
  }

  self.draw = function()
  {
    var off = 0;
    if(self.tile.type == TILE_TYPE_WATER || self.tile.type == TILE_TYPE_SHORE) off += 4;
         if(gg.inspector.detailed_type == INSPECTOR_CONTENT_FARMBIT && gg.inspector.detailed == self) off += 8;
    else if(gg.inspector.quick_type    == INSPECTOR_CONTENT_FARMBIT && gg.inspector.quick    == self) off += 8;
    switch(self.job_state)
    {
      case JOB_STATE_ACT:
        gg.ctx.fillStyle = black;
        switch(self.job_type)
        {
          case JOB_TYPE_SLEEP: gg.ctx.fillText("ZZ",self.x,self.y-10); break;
          case JOB_TYPE_PLAY:  gg.ctx.fillText(":)",self.x,self.y-10); break;
        }
        //break; //don't break!
      case JOB_STATE_IDLE_CHILL:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i  +off],self.x,self.y,self.w,self.h);
        break;
      case JOB_STATE_SEEK:
      case JOB_STATE_IDLE_WANDER:
        gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y,self.w,self.h);
        break;
    }
  }
}

