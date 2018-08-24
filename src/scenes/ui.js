var ENUM;
ENUM = 0;
var PALETTE_NULL    = ENUM; ENUM++;
var PALETTE_PROD    = ENUM; ENUM++;
var PALETTE_FARM    = ENUM; ENUM++;
var PALETTE_STORAGE = ENUM; ENUM++;
var PALETTE_COUNT   = ENUM; ENUM++;

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
  self.prod_btn    = new ButtonBox(x,y,w,h,function(){self.palette = PALETTE_PROD;});    y += h+10;
  self.farm_btn    = new ButtonBox(x,y,w,h,function(){self.palette = PALETTE_FARM;});    y += h+10;
  self.storage_btn = new ButtonBox(x,y,w,h,function(){self.palette = PALETTE_STORAGE;}); y += h+10;

  self.filter = function(filter)
  {
    var check = true;
    if(check) check = !filter.filter(self.prod_btn);
    if(check) check = !filter.filter(self.farm_btn);
    if(check) check = !filter.filter(self.storage_btn);
    return !check;
  }

  self.tick = function()
  {

  }

  self.draw = function()
  {
    gg.ctx.strokeStyle = black;
    gg.ctx.fillStyle = gray;
    switch(self.palette)
    {
      case PALETTE_PROD:    fillBox(self.prod_btn,gg.ctx);    break;
      case PALETTE_FARM:    fillBox(self.farm_btn,gg.ctx);    break;
      case PALETTE_STORAGE: fillBox(self.storage_btn,gg.ctx); break;
    }
    gg.ctx.fillStyle = black;
    strokeBox(self.prod_btn,gg.ctx);    gg.ctx.fillText("examine",self.prod_btn.x,   self.prod_btn.y+20);
    strokeBox(self.farm_btn,gg.ctx);    gg.ctx.fillText("farm",   self.farm_btn.x,   self.farm_btn.y+20);
    strokeBox(self.storage_btn,gg.ctx); gg.ctx.fillText("storage",self.storage_btn.x,self.storage_btn.y+20);
  }
}

var inspector = function()
{
  var self = this;
  self.w = 100;
  self.h = 200;
  self.x = gg.canv.width-self.w-10;
  self.y = 0;

  self.tile_detailed = 0;
  self.tile_quick = 0;

  self.draw = function()
  {
    var x = self.x;
    var y = self.y;
    var vspace = 20;
    gg.ctx.fillStyle = black;

    x += 10;
    y += vspace;
    for(var i = 0; i < 2; i++)
    {
      var t;
      var str;
      if(i == 0) t = self.tile_detailed;
      if(i == 1) t = self.tile_quick;
      if(t)
      {
        str = "Type: ";
        switch(t.type)
        {
          case TILE_TYPE_NULL:  str += "null";  break;
          case TILE_TYPE_LAND:  str += "land";  break;
          case TILE_TYPE_WATER: str += "water"; break;
          case TILE_TYPE_SHORE: str += "shore"; break;
          case TILE_TYPE_FARM:  str += "farm";  break;
          case TILE_TYPE_COUNT: str += "count"; break;
        }
        gg.ctx.fillText(str+" ("+t.tx+","+t.ty+")",x,y);
        y += vspace;
        str = "State: ";
        switch(t.state)
        {
          case TILE_STATE_NULL:           str += "null";      break;
          case TILE_STATE_FARM_UNPLANTED: str += "unplanted"; break;
          case TILE_STATE_FARM_PLANTED:   str += "planted";   break;
          case TILE_STATE_FARM_GROWN:     str += "grown";     break;
          case TILE_STATE_COUNT:          str += "null";      break;
        }
        gg.ctx.fillText(str,x,y);
        y += vspace;
        gg.ctx.fillText("t:"+t.state_t,x,y);
        y += vspace;
        gg.ctx.fillText("phosphorus:"+fdisp(t.phosphorus),x,y);
        y += vspace;
        y += vspace;
      }
      else
      {
        gg.ctx.fillText("(No tile selected)",x,y);
        y += vspace;
      }
    }
  }
}

