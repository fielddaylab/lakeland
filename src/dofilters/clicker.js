var Clicker = function(init)
{
  var default_init =
  {
    source:document.createElement('div')
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  var evts = [];
  self.attach = function() //will get auto-called at creation
  {
    if(platform == "PC")          self.source.addEventListener('mousedown', click, false);
    else if(platform == "MOBILE") self.source.addEventListener('touchstart', click, false);
  }
  self.detach = function()
  {
    if(platform == "PC")          self.source.removeEventListener('mousedown', click);
    else if(platform == "MOBILE") self.source.removeEventListener('touchstart', click);
  }

  function click(evt)
  {
    doSetPosOnEvent(evt);
    evts.push(evt);
  }
  self.filter = function(clickable)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      if((clickable.shouldClick && clickable.shouldClick(evt)) || (!clickable.shouldClick && doEvtWithinBB(evt, clickable)))
      {
        clickable.click(evt);
        hit = true;
      }
    }
    return hit;
  }
  self.flush = function()
  {
    evts = [];
  }

  self.attach();
}

//example clickable- just needs x,y,w,h and click callback
var Clickable = function(args)
{
  var self = this;

  self.x = args.x ? args.x : 0;
  self.y = args.y ? args.y : 0;
  self.w = args.w ? args.w : 0;
  self.h = args.h ? args.h : 0;
  self.shouldClick = args.shouldClick ? args.shouldClick : function(evt) //optional
  {
    return doEvtWithinBB(evt, self);
  }
  self.click = args.click ? args.click : function(){};

  //nice for debugging purposes
  self.draw = function(canv)
  {
    canv.context.strokeStyle = "#00FF00";
    canv.context.strokeRect(self.x,self.y,self.w,self.h);
  }
}

