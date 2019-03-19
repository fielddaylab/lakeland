var Dragger = function(init)
{
  var self = this;
  self.source = init.source;

  var evts = [];
  var ENUM = 0;
  var EVT_TYPE_DOWN = ENUM; ENUM++;
  var EVT_TYPE_MOVE = ENUM; ENUM++;
  var EVT_TYPE_UP   = ENUM; ENUM++;
  var evt_types = [];
  var evt_options = {capture:true,once:false,passive:false};
  self.attach = function() //will get auto-called on create
  {
    if(platform == PLATFORM_PC)
    {
      self.source.addEventListener('mousedown', begin, evt_options);
      self.source.addEventListener('mousemove', drag,  evt_options);
      self.source.addEventListener('mouseup',   end,   evt_options);
      window.addEventListener('mousemove', detectOut, evt_options);
    }
    else if(platform == PLATFORM_MOBILE)
    {
      self.source.addEventListener('touchstart', begin, evt_options);
      self.source.addEventListener('touchmove',  drag,  evt_options);
      self.source.addEventListener('touchend',   end,   evt_options);
      window.addEventListener('touchmove', detectOut, evt_options);
    }
  }
  self.detach = function()
  {
    if(platform == PLATFORM_PC)
    {
      self.source.removeEventListener('mousedown', begin, evt_options);
      self.source.removeEventListener('mousemove', drag, evt_options);
      self.source.removeEventListener('mouseup',   end, evt_options);
      window.removeEventListener('mousemove', detectOut, evt_options);
    }
    else if(platform == PLATFORM_MOBILE)
    {
      self.source.removeEventListener('touchstart', begin, evt_options);
      self.source.removeEventListener('touchmove',  drag, evt_options);
      self.source.removeEventListener('touchend',   end, evt_options);
      window.removeEventListener('touchmove', detectOut, evt_options);
    }
    self.source = 0;
  }

  function begin(evt)
  {
    doSetPosOnEvent(evt);
    evts.push(evt);
    evt_types.push(EVT_TYPE_DOWN);
    evt.preventDefault();
  }
  function drag(evt)
  {
    var r = self.source.getBoundingClientRect();
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
    {
      end(evt);
      return;
    }

    doSetPosOnEvent(evt);
    evts.push(evt);
    evt_types.push(EVT_TYPE_MOVE);
    evt.preventDefault();
  }
  function end(evt)
  {
    doSetPosOnEvent(evt);
    evts.push(evt);
    evt_types.push(EVT_TYPE_UP);
    evt.preventDefault();
  }
  function detectOut(evt)
  {
    var r = self.source.getBoundingClientRect();
    if(evt.clientX < r.left || evt.clientY < r.top || evt.clientX > r.right || evt.clientY > r.bottom)
      end(evt);
  }
  self.force_end = function()
  {
    end({});
  }
  self.filter = function(draggable)
  {
    var hit = false;
    var evt;
    for(var i = 0; i < evts.length; i++)
    {
      evt = evts[i];
      switch(evt_types[i])
      {
        case EVT_TYPE_DOWN:
        {
          if(!draggable.dragging)
          {
            if((draggable.shouldDrag && draggable.shouldDrag(evt)) || (!draggable.shouldDrag && doEvtWithinBB(evt, draggable)))
            {
              draggable.dragging = true;
              draggable.dragStart(evt);
              hit = true;
            }
          }
        }
        break;
        case EVT_TYPE_MOVE:
        {
          if(draggable.dragging)
          {
            draggable.drag(evt);
            hit = true;
          }
        }
        break;
        case EVT_TYPE_UP:
        {
          if(draggable.dragging)
          {
            draggable.dragFinish(evt);
            hit = true;
          }
          draggable.dragging = false;
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

