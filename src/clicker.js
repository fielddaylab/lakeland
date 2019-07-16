var Clicker = function(init)
{
  var self = this;
  self.source = init.source;

  var evts = [];
  var evt_options = {capture:true,once:false,passive:false};
  self.attach = function() //will get auto-called at creation
  {
    if(platform == PLATFORM_PC)          self.source.addEventListener('mousedown', click, evt_options);
    else if(platform == PLATFORM_MOBILE) self.source.addEventListener('touchstart', click, evt_options);
  }
  self.detach = function()
  {
    if(platform == PLATFORM_PC)          self.source.removeEventListener('mousedown', click, evt_options);
    else if(platform == PLATFORM_MOBILE) self.source.removeEventListener('touchstart', click, evt_options);
    self.source = 0;
  }

  function click(evt)
  {
    doSetPosOnEvent(evt);
    my_logger.add_click(evt.doX,evt.doY);
    evts.push(evt);
    evt.preventDefault();
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
  self.consume = function(click)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      click(evt);
      hit = true;
    }
    return hit;
  }
  self.consumeif = function(x,y,w,h,click)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      if(doEvtWithin(evt, x,y,w,h))
      {
        click(evt);
        hit = true;
      }
    }
    return hit;
  }
  self.check = function(x,y,w,h)
  {
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      if(doEvtWithin(evt, x,y,w,h)) return 1;
    }
    return 0;
  }
  self.flush = function()
  {
    evts = [];
  }

  self.attach();
}

