var PersistentHoverer = function(init)
{
  var self = this;
  self.source = init.source;

  var evts = [];
  var ENUM = 0;
  var EVT_TYPE_AMBIGUOUS = ENUM; ENUM++;
  var EVT_TYPE_UNHOVER   = ENUM; ENUM++;
  var evt_types = [];
  var evt_options = {capture:true,once:false,passive:false};
  self.attach = function() //will get auto-called on creation
  {
    if(platform == PLATFORM_PC)
    {
      self.source.addEventListener('mousemove', hover, evt_options);
      window.addEventListener('mousemove', detectOut, evt_options);
    }
    else if(platform == PLATFORM_MOBILE)
      ; //no hover on mobile, dummy
  }
  self.detach = function()
  {
    if(platform == PLATFORM_PC)
    {
      self.source.removeEventListener('mousemove', hover, evt_options);
      window.removeEventListener('mousemove', detectOut, evt_options);
    }
    else if(platform == PLATFORM_MOBILE)
      ; //no hover on mobile, dummy
    self.source = 0;
  }

  function hover(evt)
  {
    var r = self.source.getBoundingClientRect();

    doSetPosOnEvent(evt);
    evts.push(evt);
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
      evt_types.push(EVT_TYPE_UNHOVER);
    else
      evt_types.push(EVT_TYPE_AMBIGUOUS);
    evt.preventDefault();
  }
  function detectOut(evt)
  {
    var r = self.source.getBoundingClientRect();
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
    {
      doSetPosOnEvent(evt);
      evts.push(evt);
      evt_types.push(EVT_TYPE_UNHOVER);
    }
    evt.preventDefault();
  }

  self.filter = function(hoverable)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      switch(evt_types[i])
      {
        case EVT_TYPE_UNHOVER:
        {
          if(hoverable.hovering)
          {
            if((hoverable.shouldHover && !hoverable.shouldHover(evt)) || (!hoverable.shouldHover && !doEvtWithinBB(evt,hoverable)))
            {
              hoverable.hovering = false;
              hoverable.unhover(evt);
            }
          }
        }
        break;
        case EVT_TYPE_AMBIGUOUS:
        {
          if(hoverable.hovering)
          {
            if((hoverable.shouldHover && !hoverable.shouldHover(evt)) || (!hoverable.shouldHover && !doEvtWithinBB(evt,hoverable)))
            {
              hoverable.hovering = false;
              hoverable.unhover(evt);
            }
          }

          if((hoverable.shouldHover && hoverable.shouldHover(evt)) || (!hoverable.shouldHover && doEvtWithinBB(evt,hoverable)))
          {
            hoverable.hovering = true;
            hoverable.hover(evt);
            hit = true;
          }
        }
        break;
      }
    }
    return hit;
  }
  self.flush = function()
  {
    evts = [];
    evt_types = [];
  }

  self.attach();
}

