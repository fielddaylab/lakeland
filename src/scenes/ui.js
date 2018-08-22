var ENUM;
ENUM = 0;
var PALETTE_NULL  = ENUM; ENUM++;
var PALETTE_PROD  = ENUM; ENUM++;
var PALETTE_FARM  = ENUM; ENUM++;
var PALETTE_COUNT = ENUM; ENUM++;

var palette = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 100;
  self.h = 200;

  self.palette = PALETTE_PROD;

  var x = self.x;
  var y = self.y;
  var w = 40;
  var h = 40;
  x += 10;
  y += 10;
  self.prod_btn = new ButtonBox(x,y,w,h,function(){self.palette = PALETTE_PROD;});
  y += h;
  y += 10;
  self.farm_btn = new ButtonBox(x,y,w,h,function(){self.palette = PALETTE_FARM;});

  self.filter = function(filter)
  {
    var check = true;
    if(check) check = !filter.filter(self.prod_btn);
    if(check) check = !filter.filter(self.farm_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = black;
    strokeBox(self.prod_btn,gg.ctx); gg.ctx.fillText("examine",self.prod_btn.x,self.prod_btn.y+20);
    strokeBox(self.farm_btn,gg.ctx); gg.ctx.fillText("gen farm",self.farm_btn.x,self.farm_btn.y+20);
  }
}

var inspector = function()
{
  var self = this;
  self.x = 500;
  self.y = 0;
  self.w = 100;
  self.h = 200;

  self.tile = 0;

  self.draw = function()
  {
    var x = self.x;
    var y = self.y;
    var vspace = 20;
    gg.ctx.fillStyle = black;

    x += 10;
    y += vspace;
    if(!self.tile) { gg.ctx.fillText("(No tile selected)",x,y); return; }

    switch(self.tile.type)
    {
      case TILE_TYPE_NULL:  gg.ctx.fillText("Tile Type: null",x,y);  break;
      case TILE_TYPE_LAND:  gg.ctx.fillText("Tile Type: land",x,y);  break;
      case TILE_TYPE_WATER: gg.ctx.fillText("Tile Type: water",x,y); break;
      case TILE_TYPE_SHORE: gg.ctx.fillText("Tile Type: shore",x,y); break;
      case TILE_TYPE_FARM:  gg.ctx.fillText("Tile Type: farm",x,y);  break;
      case TILE_TYPE_COUNT: gg.ctx.fillText("Tile Type: count",x,y); break;
    }
    y += vspace;
    gg.ctx.fillText("x:"+self.tile.x,x,y);
    y += vspace;
    gg.ctx.fillText("y:"+self.tile.y,x,y);
    y += vspace;
    gg.ctx.fillText("p:"+fdisp(self.tile.phosphorus),x,y);
    y += vspace;
    switch(self.tile.state)
    {
      case TILE_STATE_NULL:           gg.ctx.fillText("Tile State: null",x,y);  break;
      case TILE_STATE_FARM_UNPLANTED: gg.ctx.fillText("Tile State: unplanted",x,y);  break;
      case TILE_STATE_FARM_PLANTED:   gg.ctx.fillText("Tile State: planted",x,y); break;
      case TILE_STATE_FARM_GROWN:     gg.ctx.fillText("Tile State: grown",x,y); break;
      case TILE_STATE_COUNT:          gg.ctx.fillText("Tile State: null",x,y);  break;
    }
    y += vspace;
    gg.ctx.fillText("t:"+self.tile.state_t,x,y);
  }
}

