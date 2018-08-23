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
var JOB_STATE_NULL  = ENUM; ENUM++;
var JOB_STATE_COUNT = ENUM; ENUM++;

var fullness_task_for_b = function(b)
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
      d = distsqr(t.tx,t.ty,b.tile.tx,b.tile.ty);
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

  b.job_type = job_type;
  b.job = job;
  closest.lock = 1;
}

var energy_task_for_b = function(b)
{
  b.job_type = JOB_TYPE_SLEEP;
}

var joy_task_for_b = function(b)
{
  b.job_type = JOB_TYPE_PLAY;
  //find water
}

var task_for_b = function(b)
{
  if(b.task != TASK_TYPE_IDLE) return; //already busy!

  if(b.fullness < fullness_motivated && fullness_task_for_b(b)) return;
  if(b.energy   < energy_motivated   && energy_task_for_b(b))   return;
  if(b.joy      < joy_motivated      && joy_task_for_b(b))      return;
  if(b.purpose  < purpose_motivated  && purpose_task_for_b(b))  return;
  if(b.fullness < fullness_content   && fullness_task_for_b(b)) return;
  if(b.energy   < energy_content     && energy_task_for_b(b))   return;
  if(b.joy      < joy_content        && joy_task_for_b(b))      return;
  if(b.purpose  < purpose_content    && purpose_task_for_b(b))  return;
  return;
}

var b_for_task = function()
{

}

var findbitforjob = function(j)
{
  var closest = 0;
  var closest_dsqr = 999999;
  for(var i = 0; i < gg.farmbits.length; i++)
  {
    var b = gg.farmbits[i];
    if(b.job) continue;
    switch(j.type)
    {
      case JOB_TYPE_PLANT:
      case JOB_TYPE_HARVEST:
        if(b.fullness > fullness_motivation_threshhold) continue;
        break;
      case JOB_TYPE_GET:
        if(j.object.type == OBJECT_TYPE_FOOD && b.fullness > fullness_motivation_threshhold) continue;
        break;
    }
    var t = j.dtile();
    var dsqr = distsqr(t.x,t.y,b.tile.x,b.tile.y);
    if(!closest || dsqr < closest_dsqr)
    {
      closest = b;
      closest_dsqr = dsqr;
    }
  }
  return closest;
}
var findjobforbit = function(b)
{
  for(var i = 0; i < gg.jobs.length; i++)
  {
    var j = gg.jobs[i];
    if(!j.claimaint)
    {
      switch(j.type)
      {
        case JOB_TYPE_PLANT:
        case JOB_TYPE_HARVEST:
          if(b.fullness > fullness_motivation_threshhold) continue;
          break;
        case JOB_TYPE_GET:
          if(j.object.type == OBJECT_TYPE_FOOD && b.fullness > fullness_motivation_threshhold) continue;
          break;
      }
      return j;
    }
  }
  return 0;
}
var enqueuejob = function(j)
{
  gg.jobs.push(j);
  var b = findbitforjob(j);
  if(b) assignjob(b,j);
}
var dequeuejob = function(b)
{
  var j = findjobforbit(b);
  if(j) assignjob(b,j);
}
var enqueuetakejob = function(b,j)
{
  gg.jobs.push(j);
  assignjob(b,j);
}
var assignjob = function(b,j)
{
  b.job = j;
  j.claimaint = b;
  b.state = FARMBIT_STATE_JOB;
  b.state_t = 0;
}
var completejob = function(j)
{
  for(var i = 0; i < gg.jobs.length; i++)
    if(gg.jobs[i] == j) gg.jobs.splice(i,1);
}
var breakobject = function(o)
{
  for(var i = 0; i < gg.objects.length; i++)
    if(gg.objects[i] == o) gg.objects.splice(i,1);
}
var callforjobs = function()
{
  for(var i = 0; i < gg.jobs.length; i++)
  {
    var j = gg.jobs[i];
    if(!j.claimant)
    {
      var b = findbitforjob(j);
      if(b) assignjob(b,j);
    }
  }
}
var calltowork = function()
{
  for(var i = 0; i < gg.farmbits.length; i++)
  {
    var b = gg.farmbits[i];
    b.nudge();
  }
}

var tile = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;
  self.type = TILE_TYPE_LAND;
  self.phosphorus = 0;
  self.state = TILE_STATE_NULL;
  self.state_t = 0;
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
    w.wx = self.wx-self.ww/2+((t.x+0.5)*self.ww/self.tw);
    w.wy = self.wy-self.wh/2+((t.y+0.5)*self.wh/self.th);
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
    gg.inspector.tile_quick = self.hover_t;
  }
  self.unhover = function(evt)
  {
    self.hover_t = 0;
    gg.inspector.tile_quick = self.hover_t;
  }

  self.click = function(evt)
  {
    gg.inspector.tile_detailed = self.hover_t;
    if(!self.hover_t) return;

    if(gg.palette.palette == PALETTE_FARM && self.hover_t.type != TILE_TYPE_FARM)
    {
      self.hover_t.type = TILE_TYPE_FARM;
      self.hover_t.state = TILE_STATE_FARM_UNPLANTED;
      self.hover_t.state_t = 0;
      var j = new job();
      j.tile = self.hover_t;
      j.type = JOB_TYPE_PLANT;
      enqueuejob(j);
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
            var j = new job();
            j.tile = t;
            j.type = JOB_TYPE_HARVEST;
            enqueuejob(j);
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
             if(t.type == TILE_TYPE_LAND)  gg.ctx.fillStyle = "rgba(255,"+(255-floor(t.phosphorus*255))+",255,1)";
        else if(t.type == TILE_TYPE_WATER) gg.ctx.fillStyle = "rgba("+floor(t.phosphorus*255)+",255,255,1)";
        else if(t.type == TILE_TYPE_SHORE) gg.ctx.fillStyle = "rgba("+floor((t.phosphorus/2+0.5)*255)+",255,255,1)";
        else if(t.type == TILE_TYPE_FARM)
        {
          switch(t.state)
          {
            case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillStyle = "rgba(255,255,"+floor((t.phosphorus/2+0.5)*255)+",1)"; break;
            case TILE_STATE_FARM_PLANTED:   gg.ctx.fillStyle = "rgba(255,"+floor(t.state_t/farm_grow_t*255)+","+floor(t.phosphorus*255)+",1)"; break;
            case TILE_STATE_FARM_GROWN:     gg.ctx.fillStyle = "rgba(255,255,"+floor(t.phosphorus*255)+",1)"; break;
          }
        }
        gg.ctx.fillRect(self.x+tx*w,self.y+self.h-(ty+1)*h,w,h);
        i++;
      }
    }
    var t;
    t = self.hover_t;               if(t) gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);
    t = gg.inspector.tile_detailed; if(t) gg.ctx.strokeRect(self.x+t.tx*w,self.y+self.h-(t.ty+1)*h,w,h);
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

  self.state = FARMBIT_STATE_IDLE;
  self.state_t = 0;
  self.walk_speed = 1; //MUST BE < tile_w
  self.move_dir_x = 0.;
  self.move_dir_y = 0.;
  self.job = 0;
  self.object = 0;

  self.fullness = 1;
  self.joy = 1;
  self.energy = 1;

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
  }

  self.nudge = function()
  {

  }

  self.tick = function()
  {
    self.frame_t++;
    if(self.frame_t > self.frame_l)
    {
      self.frame_i = (self.frame_i+1)%2;
      self.frame_t = 0;
    }

    var pre_fullness = self.fullness;
    self.fullness *= 0.99;
    var pre_energy = self.energy;
    self.energy *= 0.99;
    var pre_joy = self.joy;
    self.joy *= 0.99;
    if(!self.job)
    {
           if(pre_fullness > fullness_motivation_threshhold && self.fullness < fullness_motivation_threshhold) findjobforbit(self);
      else if(pre_energy   > energy_motivation_threshhold   && self.energy   < energy_motivation_threshhold) findjobforbit(self);
      else if(pre_joy      > joy_motivation_threshhold      && self.joy      < joy_motivation_threshhold) findjobforbit(self);
    }

    self.state_t++;
    switch(self.state)
    {
      case FARMBIT_STATE_IDLE:
      {
        if(rand() < 0.01)
        {
          self.state = FARMBIT_STATE_WANDER;
          self.state_t = 0;
          var theta = rand()*twopi;
          self.move_dir_x = cos(theta);
          self.move_dir_y = sin(theta);
        }
      }
      break;
      case FARMBIT_STATE_WANDER:
      {
        if(rand() < 0.01)
        {
          self.state = FARMBIT_STATE_IDLE;
          self.state_t = 0;
        }
        self.wx += self.move_dir_x*self.walk_speed;
        self.wy += self.move_dir_y*self.walk_speed;
        gg.b.wrapw(self);
      }
      break;
      case FARMBIT_STATE_JOB:
      {
        var t = self.job.dtile();;
        if(self.tile != t)
        {
          self.move_dir_x = t.x-self.tile.x;
          self.move_dir_y = t.y-self.tile.y;
          var l = sqrt(self.move_dir_x*self.move_dir_x+self.move_dir_y*self.move_dir_y);
          self.move_dir_x /= l;
          self.move_dir_y /= l;

          self.wx += self.move_dir_x*self.walk_speed;
          self.wy += self.move_dir_y*self.walk_speed;
        }
        else //self.tile == t
        {
          switch(self.job.type)
          {
            case JOB_TYPE_PLANT:
            {
              t.state = TILE_STATE_FARM_PLANTED;
              t.state_t = 0;
              completejob(self.job);
              self.job = 0;
              self.state = FARMBIT_STATE_IDLE;
              self.state_t = 0;
              var j = findjobforbit(self);
              if(j) assignjob(self,j);
            }
              break;
            case JOB_TYPE_HARVEST:
            {
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

              //finish job
              t.state = TILE_STATE_FARM_UNPLANTED;
              t.state_t = 0;
              completejob(self.job);

              //reset self
              self.job = 0;
              self.state = FARMBIT_STATE_IDLE;
              self.state_t = 0;

              //create new jobs (order important!)
              var j;
                //pickup food
              j = new job();
              j.object = o;
              j.type = JOB_TYPE_GET;
              enqueuejob(j);
                //replant farm
              j = new job();
              j.tile = self.tile;
              j.type = JOB_TYPE_PLANT;
              enqueuejob(j);

              if(!self.job) dequeuejob(self);
            }
              break;
            case JOB_TYPE_GET:
            {
              if(abs(self.job.object.wvz) > 0.01 || self.job.object.wz > 0.01) break; //can't get until landed
              //finish job
              t.state = TILE_STATE_FARM_UNPLANTED;
              t.state_t = 0;
              self.object = self.job.object;
              completejob(self.job);

              //reset self
              self.job = 0;
              self.state = FARMBIT_STATE_IDLE;
              self.state_t = 0;

              //handle object
              if(self.object.type == OBJECT_TYPE_FOOD && self.fullness < fullness_motivation_threshhold)
              { //eat
                breakobject(self.object);
                self.object = 0;
                self.fullness = 1;
                dequeuejob(self);
              }
              else
              { //deliver
                j = new job();
                j.object = self.object;
                j.type = JOB_TYPE_DELIVER;
                enqueuetakejob(j)
              }
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
    switch(self.state)
    {
      case FARMBIT_STATE_IDLE:   gg.ctx.drawImage(farmbit_imgs[self.frame_i  +off],self.x,self.y,self.w,self.h); break;
      case FARMBIT_STATE_WANDER: gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y,self.w,self.h); break;
      case FARMBIT_STATE_JOB:    gg.ctx.drawImage(farmbit_imgs[self.frame_i+2+off],self.x,self.y,self.w,self.h); break;
    }
  }
}

