function BB(x,y,w,h)
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;
}

function TextBox(x,y,w,h,txt,callback)
//register to keyer, dragger, blurer
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.txt = txt;

  self.focused = false;
  self.highlit = false;
  self.down = false;

  self.key = function(evt)
  {
  }
  self.key_letter = function(k)
  {
    if(self.focused)
    {
      if(self.highlit) self.txt = ""+k;
      else             self.txt = self.txt+k;
      self.highlit = false;
      callback(self.txt);
    }
  }
  self.key_down = function(evt)
  {
    if(evt.keyCode == 13) //enter
    {
      if(self.focused)
        self.blur();
    }
    if(evt.keyCode == 8) //delete
    {
      if(self.highlit)
      {
        self.txt = "";
        self.highlit = false;
        callback(self.number);
      }
      else if(self.focused)
      {
        self.txt = self.txt.substring(0,self.txt.length-1);
        callback(self.txt);
      }
    }
  }
  self.key_up = function(evt)
  {
  }

  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.focused = true;
    self.down = true;
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    self.down = ptWithinBB(self, evt.doX, evt.doY);
  }
  self.dragFinish = function()
  {
    if(self.down) self.highlit = !self.highlit;
    self.down = false;
  }

  self.blur = function()
  {
    self.focused = false;
    self.highlit = false;
    callback(self.txt);
  }
  self.focus = function()
  {
    self.focused = true;
    self.highlit = true;
  }
  self.set = function(n)
  {
    self.txt = n;
    callback(self.txt);
  }

  self.draw = function(canv)
  {
    if(self.highlit)
    {
      canv.context.fillStyle = "#8899FF";
      canv.context.fillRect(self.x,self.y,self.w,self.h);
    }
         if(self.down)    canv.context.strokeStyle = "#00F400";
    else if(self.focused) canv.context.strokeStyle = "#F40000";
    else                  canv.context.strokeStyle = "#0000F4";
    canv.context.strokeRect(self.x,self.y,self.w,self.h);
    canv.context.fillStyle = "#000000";
    if(self.txt.length < 5)
      canv.context.fillText(self.txt,self.x+4,self.y+self.h*3/4,self.w-4);
    else
      canv.context.fillText(self.txt.substring(0,5)+"...",self.x+4,self.y+self.h*3/4,self.w-4);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") n:"+self.txt+" f:"+self.focused+" h:"+self.highlit+" d:"+self.down+" "+"");
  }
}

function DomTextBox(x,y,w,h,canv,txt,callback)
//register to clicker, blurer
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;
  self.canv = canv;

  self.bg_color = "rgba(255,255,255,0.1)";

  self.txt = txt;
  self.box = document.createElement('input');
  self.box.type = "text";
  self.box.style.position = "absolute";
  self.box.style.width = self.w+"px";
  self.box.style.height = self.h+"px";
  self.box_on = 0; //0 = canv, 1 = DOM

  self.size = function()
  {
    self.box.style.width = self.w+"px";
    self.box.style.height = self.h+"px";
  }

  self.box.onchange = function()
  {
    self.blur();
  }

  self.click = function()
  {
    self.focus();
  }

  self.blur = function()
  {
    if(!self.box_on) return;
    self.box_on = 0;
    self.txt = self.box.value;
    self.box.parentElement.removeChild(self.box);
    callback(self.txt);
  }
  self.focus = function()
  {
    self.box_on = 1;
    self.box.style.top = self.y;
    self.box.style.left = self.x;
    self.canv.canvas.parentElement.appendChild(self.box);
    self.box.focus();
  }
  self.quiet_set = function(n)
  {
    self.txt = n;
    self.box.value = self.txt;
  }
  self.set = function(n)
  {
    self.quiet_set(n);
    callback(self.txt);
  }

  self.draw = function(canv)
  {
    canv.context.fillStyle = self.bg_color;
    canv.context.fillRect(self.x,self.y,self.w,self.h);
    canv.context.strokeStyle = black;
    canv.context.strokeRect(self.x,self.y,self.w,self.h);
    canv.context.fillStyle = white;
    if(self.box_on)
    {
      //
    }
    else
    {
      var n = 24;
      if(self.txt.length < n) canv.context.fillText(self.txt,self.x+4,self.y+self.h*3/4,self.w-4);
      else                    canv.context.fillText(self.txt.substring(0,n)+"...",self.x+4,self.y+self.h*3/4,self.w-4);
    }
  }
}


function NumberBox(x,y,w,h,val,delta,callback)
//register to keyer, dragger, blurer
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.number = val;

  self.value = ""+val;
  self.focused = false;
  self.highlit = false;
  self.down = false;

  self.delta = delta;

  var validateNum = function(n)
  {
    if(!isNaN(parseFloat(n)) && isFinite(n)) return parseFloat(n);
    else return self.number;
  }

  self.key = function(evt)
  {
  }
  self.key_letter = function(k)
  {
    if(self.focused)
    {
      if(self.value == "0") self.value = "";
      if(self.highlit) self.value = ""+k;
      else             self.value = self.value+k;
      self.number = validateNum(self.value);
      self.highlit = false;
      callback(self.number);
    }
  }
  self.key_down = function(evt)
  {
    if(evt.keyCode == 13) //enter
    {
      if(self.focused)
        self.blur();
    }
    if(evt.keyCode == 8) //delete
    {
      if(self.highlit)
      {
        self.number = 0;
        self.value = "0";
        self.highlit = false;
        callback(self.number);
      }
      else if(self.focused)
      {
        self.value = self.value.substring(0,self.value.length-1);
        self.number = validateNum(self.value);
        callback(self.number);
      }
    }
  }
  self.key_up = function(evt)
  {
  }

  //nice in smooth dragging
  self.offX = 0;
  self.offY = 0;
  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.focused = true;
    self.down = true;

    self.offX = evt.doX-self.x;
    self.offY = evt.doY-self.y;
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    self.deltaX = ((evt.doX-self.x)-self.offX);
    self.deltaY = ((evt.doY-self.y)-self.offY);
    self.offX = evt.doX - self.x;
    self.offY = evt.doY - self.y;
    self.number = validateNum(self.number + -self.deltaY*self.delta);
    self.value = ""+self.number;

    self.down = ptWithinBB(self, evt.doX, evt.doY);
    callback(self.number);
  }
  self.dragFinish = function()
  {
    if(self.down) self.highlit = !self.highlit;
    self.down = false;
  }

  self.blur = function()
  {
    self.focused = false;
    self.highlit = false;
    self.value = ""+self.number;
    callback(self.number);
  }
  self.focus = function()
  {
    self.focused = true;
    self.highlit = true;
  }
  self.set = function(n)
  {
    self.number = validateNum(n);
    self.value = ""+self.number;
    callback(self.number);
  }

  self.draw = function(canv)
  {
    if(self.highlit)
    {
      canv.context.fillStyle = "#8899FF";
      canv.context.fillRect(self.x,self.y,self.w,self.h);
    }
         if(self.down)    canv.context.strokeStyle = "#00F400";
    else if(self.focused) canv.context.strokeStyle = "#F40000";
    else                  canv.context.strokeStyle = "#0000F4";
    canv.context.strokeRect(self.x,self.y,self.w,self.h);
    canv.context.fillStyle = "#000000";
    if(self.value.length < 5)
      canv.context.fillText(self.value,self.x+4,self.y+self.h*3/4,self.w-4);
    else
      canv.context.fillText(self.value.substring(0,5)+"...",self.x+4,self.y+self.h*3/4,self.w-4);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") n:"+self.number+" v:"+self.value+" f:"+self.focused+" h:"+self.highlit+" d:"+self.down+" "+"");
  }
}

function ButtonBox(x,y,w,h,callback)
//register to presser *or* clicker
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.down = false;

  self.press = function(evt)
  {
    evt.hit_ui = true;
    self.down = true;
  }
  self.unpress = function(evt)
  {
    evt.hit_ui = true;
    self.down = false;
  }

  self.click = function(evt)
  {
    evt.hit_ui = true;
    self.hit();
  }

  self.hit = function()
  {
    callback(self.down);
  }

  self.draw = function(canv)
  {
    if(self.down) canv.context.strokeStyle = "#00F400";
    else          canv.context.strokeStyle = "#000000";

    canv.context.fillStyle = "#00F400";

    canv.context.fillRect(self.x,self.y,self.w,self.h);
    canv.context.strokeRect(self.x+0.5,self.y+0.5,self.w,self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") d:"+self.down+" "+"");
  }
}

function ToggleBox(x,y,w,h,val,callback)
//register to presser *or* clicker
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.on = val;
  self.down = false;

  self.press = function(evt)
  {
    evt.hit_ui = true;
    self.down = true;
  }
  self.unpress = function(evt)
  {
    evt.hit_ui = true;
    self.down = false;
    self.toggle();
  }

  self.click = function(evt)
  {
    evt.hit_ui = true;
    self.toggle();
  }

  self.toggle = function()
  {
    self.on = !self.on;
    callback(self.on);
  }
  self.set = function(n)
  {
    self.on = n;
    callback(self.on);
  }

  self.draw = function(canv)
  {
    if(self.down) canv.context.strokeStyle = "#00F400";
    else          canv.context.strokeStyle = "#000000";

    if(self.on) canv.context.fillStyle = "#00F400";
    else        canv.context.fillStyle = "#FFFFFF";

    canv.context.fillRect(self.x,self.y,self.w,self.h);
    canv.context.strokeRect(self.x+0.5,self.y+0.5,self.w,self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") o:"+self.on+" d:"+self.down+" "+"");
  }
}

function MultiToggleBox(x,y,w,h,val,nval,callback)
//register to presser *or* clicker
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.on = val;
  self.non = nval;
  self.down = false;

  self.press = function(evt)
  {
    evt.hit_ui = true;
    self.down = true;
  }
  self.unpress = function(evt)
  {
    evt.hit_ui = true;
    self.down = false;
    self.toggle();
  }

  self.click = function(evt)
  {
    evt.hit_ui = true;
    self.toggle();
  }

  self.toggle = function()
  {
    self.on = (self.on+1)%self.non;
    callback(self.on);
  }
  self.set = function(n)
  {
    self.on = n;
    callback(self.on);
  }

  self.draw = function(canv)
  {
    if(self.down) canv.context.strokeStyle = "#00F400";
    else          canv.context.strokeStyle = "#000000";

    if(self.on) canv.context.fillStyle = "#00F400";
    else        canv.context.fillStyle = "#FFFFFF";

    canv.context.fillRect(self.x,self.y,self.w,self.h);
    canv.context.strokeRect(self.x+0.5,self.y+0.5,self.w,self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") o:"+self.on+" d:"+self.down+" "+"");
  }
}

function SliderBox(x,y,w,h,min_val,max_val,val,callback)
//register to dragger
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.slit_x = Math.round(self.x + self.w/20);
  self.slit_w = Math.round(self.w - self.w/10);

  self.min_val = min_val;
  self.max_val = max_val;
  self.val = val;

  self.dragging = false;
  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.drag(evt);
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    if(evt.doX < self.slit_x) evt.doX = self.slit_x;
    if(evt.doX > self.slit_x+self.maxPixel()) evt.doX = self.slit_x+self.maxPixel();
    self.val = self.valAtPixel(evt.doX-self.slit_x);
    callback(self.val);
  }
  self.dragFinish = function(evt)
  {
  }
  self.set = function(n)
  {
    self.val = n;
    callback(self.val);
  }

  self.maxPixel = function()
  {
    return self.slit_w;
  }
  self.valAtPixel = function(p)
  {
    var r = self.min_val+(self.max_val-self.min_val)*(p/self.slit_w);
    if(r < self.min_val) r = self.min_val;
    if(r > self.max_val) r = self.max_val;
    return r;
  }
  self.pixelAtVal = function(v)
  {
    var r = ((v-self.min_val)/(self.max_val-self.min_val))*self.slit_w;
    if(r < 0) r = 0;
    if(r > self.w) r = self.w-1;
    return r;
  }

  self.draw = function(canv)
  {
    canv.context.fillStyle = "#333333";
    canv.context.fillRect(self.slit_x,self.y+self.h/3,self.slit_w,self.h/3);
    canv.context.fillStyle = "#000000";
    var switch_x = self.slit_x+(((self.val-self.min_val)/(self.max_val-self.min_val))*self.slit_w);
    canv.context.strokeRect(switch_x-(self.w/20)+0.5,self.y+0.5,(self.w/10),self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") min:"+self.min_val+" max:"+self.max_val+" v:"+self.val+" "+"");
  }
}

function SmoothSliderBox(x,y,w,h,min_val,max_val,val,callback)
//register to dragger, ticker
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.slit_x = self.x + self.w/20;
  self.slit_w = self.w - self.w/10;

  self.min_val = min_val;
  self.max_val = max_val;
  self.desired_val = val;
  self.val = val;

  self.dragging = false;
  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.dragging = true;
    self.drag(evt);
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    if(evt.doX < self.slit_x) evt.doX = self.slit_x;
    if(evt.doX > self.slit_x+self.maxPixel()) evt.doX = self.slit_x+self.maxPixel();
    self.desired_val = self.valAtPixel(evt.doX-self.slit_x);
  }
  self.dragFinish = function()
  {
    self.dragging = false;
  }
  self.set = function(n)
  {
    self.desired_val = n;
  }

  self.maxPixel = function()
  {
    return self.slit_w;
  }
  self.valAtPixel = function(p)
  {
    var r = self.min_val+(self.max_val-self.min_val)*(p/self.slit_w);
    if(r < self.min_val) r = self.min_val;
    if(r > self.max_val) r = self.max_val;
    return r;
  }
  self.pixelAtVal = function(v)
  {
    var r = ((v-self.min_val)/(self.max_val-self.min_val))*self.slit_w;
    if(r < 0) r = 0;
    if(r > self.w) r = self.w-1;
    return r;
  }

  self.tick = function()
  {
    if(self.val == self.desired_val) return;
    if(Math.abs(self.val-self.desired_val) < 0.001)
      self.val = self.desired_val;
    else
      self.val = self.val+(self.desired_val-self.val)/3;
    callback(self.val);
  }

  self.draw = function(canv)
  {
    canv.context.fillStyle = "#333333";
    canv.context.fillRect(self.slit_x,self.y+self.h/3,self.slit_w,self.h/3);
    canv.context.fillStyle = "#000000";
    var switch_x = self.slit_x+(((self.val-self.min_val)/(self.max_val-self.min_val))*self.slit_w);
    canv.context.strokeRect(switch_x-(self.w/20)+0.5,self.y+0.5,(self.w/10),self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") min:"+self.min_val+" max:"+self.max_val+" v:"+self.val+" "+"");
  }
}

function SmoothSliderSqrtBox(x,y,w,h,min_val,max_val,val,callback)
//register to dragger, ticker
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.slit_x = self.x + self.w/20;
  self.slit_w = self.w - self.w/10;

  self.min_val = min_val;
  self.max_val = max_val;
  self.desired_val = val;
  self.val = val;

  self.dragging = false;
  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.dragging = true;
    self.drag(evt);
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    if(evt.doX < self.slit_x) evt.doX = self.slit_x;
    if(evt.doX > self.slit_x+self.maxPixel()) evt.doX = self.slit_x+self.maxPixel();
    self.desired_val = self.valAtPixel(evt.doX-self.slit_x);
  }
  self.dragFinish = function()
  {
    self.dragging = false;
  }
  self.set = function(n)
  {
    self.desired_val = n;
  }

  self.maxPixel = function()
  {
    return self.slit_w;
  }
  self.valAtPixel = function(p)
  {
    var t = (p/self.slit_w)*(p/self.slit_w);
    var r = self.min_val+(self.max_val-self.min_val)*t;
    if(r < self.min_val) r = self.min_val;
    if(r > self.max_val) r = self.max_val;
    return r;
  }
  self.pixelAtVal = function(v)
  {
    var t = (v-self.min_val)/(self.max_val-self.min_val);
    var r = Math.sqrt(t)*self.slit_w;
    if(r < 0) r = 0;
    if(r > self.w) r = self.w-1;
    return r;
  }

  self.tick = function()
  {
    if(self.val == self.desired_val) return;
    if(Math.abs(self.val-self.desired_val) < 0.001)
      self.val = self.desired_val;
    else
      self.val = self.val+(self.desired_val-self.val)/3;
    callback(self.val);
  }

  self.draw = function(canv)
  {
    canv.context.fillStyle = "#333333";
    canv.context.fillRect(self.slit_x,self.y+self.h/3,self.slit_w,self.h/3);
    canv.context.fillStyle = "#000000";
    var t = (self.val-self.min_val)/(self.max_val-self.min_val);
    t = Math.sqrt(t);
    var switch_x = self.slit_x+(t*self.slit_w);
    canv.context.strokeRect(switch_x-(self.w/20)+0.5,self.y+0.5,(self.w/10),self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") min:"+self.min_val+" max:"+self.max_val+" v:"+self.val+" "+"");
  }
}

function BinBox(x,y,w,h,drag_start_callback,drag_callback,drag_finish_callback,pull_callback,release_callback)
//register to dragger & presser
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.pressed = false;
  self.dragging = false;

  self.genable = true;

  self.press = function(evt)
  {
    evt.hit_ui = true;
    self.pressed = true;
    if(self.dragging && self.genable)
    {
      self.genable = false;
      pull_callback(evt);
      drag_start_callback(evt);
    }
  }
  self.unpress = function(evt)
  {
    evt.hit_ui = true;
    self.pressed = false;
    if(ptWithinBox(self, evt.doX, evt.doY))
      release_callback();
  }

  //holds drag position in queue and forwards events
  self.dragStart = function(evt)
  {
    evt.hit_ui = true;
    self.dragging = true;
    if(self.pressed && self.genable)
    {
      self.genable = false;
      pull_callback(evt);
      drag_start_callback(evt);
    }
  }
  self.drag = function(evt)
  {
    evt.hit_ui = true;
    drag_callback(evt);
  }
  self.dragFinish = function()
  {
    self.dragging = false;
    drag_finish_callback();
    self.genable = true;
  }

  self.draw = function(canv)
  {
    if(self.pressing) canv.context.strokeStyle = "#00F400";
    else              canv.context.strokeStyle = "#000000";

    canv.context.fillStyle = "#00F400";

    canv.context.fillRect(self.x,self.y,self.w,self.h);
    canv.context.strokeRect(self.x+0.5,self.y+0.5,self.w,self.h);
  }

  self.print = function()
  {
    console.log("("+self.x+","+self.y+","+self.w+","+self.h+") p:"+self.pressing+" "+"");
  }
}

var placer = function(asset, x,y,w,h, canv)
{
  var self = this;

  self.asset = asset;
  self.stroke = false;
  self.cur_dragging = false;
  self.cur_resizing = false;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;
  self.canv = canv;
  self.offX = 0;
  self.offY = 0;
  self.deltaX = 0;
  self.deltaY = 0;

  self.draw = function(ctx)
  {
    ctx.fillStyle = "#000000";
    ctx.strokeRect(self.x,self.y,self.w,self.h);
    ctx.fillText("DEBUG_PLACER",self.x,self.y+self.h);
    //ctx.fillText(self.text,self.x,self.y+self.h);
    /*
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.drawImage(self.asset, self.x,self.y,self.w,self.h);
    if(self.stroke) ctx.strokeRect(self.x,self.y,self.w,self.h);
    ctx.restore();
    */
  }

  function len(x,y)
  {
    return math.sqrt((x*x)+(y*y));
  }
  self.dragStart = function(evt)
  {
    self.cur_dragging = false;
    self.cur_resizing = false;

    self.offX = evt.doX-(self.x+(self.w/2));
    self.offY = evt.doY-(self.y+(self.h/2));

    if(self.offX > 0.4*self.w && self.offY > 0.4*self.h)
      self.cur_resizing = true
    else
      self.cur_dragging = true;
  };
  self.drag = function(evt)
  {
    self.deltaX = (evt.doX-(self.x+(self.w/2)))-self.offX;
    self.deltaY = (evt.doY-(self.y+(self.h/2)))-self.offY;

    if(self.cur_dragging)
    {
      self.x += self.deltaX;
      self.y += self.deltaY;
    }
    else if(self.cur_resizing)
    {
      self.w += self.deltaX;
      self.h += self.deltaY;
    }

    self.offX = evt.doX-(self.x+(self.w/2));
    self.offY = evt.doY-(self.y+(self.h/2));

    self._dirty = true;
  };
  self.dragFinish = function()
  {
    self.cur_dragging = false;
    self.cur_resizing = false;
  };

  self.click = function(evt)
  {
    console.log("XXX.w="+self.w+";\nXXX.h="+self.h+";\nXXX.x="+self.x+";\nXXX.y="+self.y+";");
    //console.log("p("+invp(self.x,self.canv.width)+"),p("+invp(self.y,self.canv.height)+"),p("+invp(self.w,self.canv.width)+"),p("+invp(self.h,self.canv.height)+")");

    self.stroke = !self.stroke;
  }
}

function HSVPicker(x,y,w,h,callback)
{
  var self = this;
  self.x = x;
  self.y = y;
  self.w = w;
  self.h = h;

  self.palette_x = 0;
  self.palette_y = 0;
  self.palette_w = 0;
  self.palette_h = 0;
  self.palette_coord_x = 0;
  self.palette_coord_y = 0;

  self.saturation_x = 0;
  self.saturation_y = 0;
  self.saturation_w = 0;
  self.saturation_h = 0;
  self.saturation_coord_x = 0.5;

  self.alpha_x = 0;
  self.alpha_y = 0;
  self.alpha_w = 0;
  self.alpha_h = 0;
  self.alpha_coord_x = 1;

  self.color = {r:0,g:0,b:0,h:0,s:0,v:0,a:0};
  self.color.s = self.saturation_coord_x;
  self.color.a = self.alpha_coord_x;
  self.tmp_color = {r:0,g:0,b:0,h:0,s:0,v:0,a:0};

  self.palette = GenIcon(360,256);
  self.update_palette = function()
  {
    self.tmp_color.s = self.color.s;
    for(var i = 0; i < 360; i++)
    {
      self.tmp_color.h = i;
      for(var j = 0; j < 255; j++)
      {
        self.tmp_color.v = j/255;
        HSV2RGB(self.tmp_color,self.tmp_color);
        self.palette.context.fillStyle = "rgba("+floor(self.tmp_color.r*255)+","+floor(self.tmp_color.g*255)+","+floor(self.tmp_color.b*255)+",1)";
        self.palette.context.fillRect(i,j,1,1);
      }
    }
  }
  self.update_palette();

  self.target_color = function()
  {
    self.palette_coord_x = self.color.h/360;
    self.palette_coord_y = self.color.v;
    self.saturation_coord_x = self.color.s;
    self.alpha_coord_x = self.color.a;
    self.update_palette();
  }

  self.size = function()
  {
    var p = self.w/100;
    var s_height = 10;

    self.palette_x = self.x+p;
    self.palette_y = self.y+p;
    self.palette_w = self.w-p*2;
    self.palette_h = self.h-p*3-s_height*2;

    self.saturation_x = self.x+p;
    self.saturation_y = self.y+self.h-p*2-s_height*2;
    self.saturation_w = self.w-p*2;
    self.saturation_h = s_height;

    self.alpha_x = self.x+p;
    self.alpha_y = self.y+self.h-p-s_height;
    self.alpha_w = self.w-p*2;
    self.alpha_h = s_height;
  }
  self.size();

  self.pick = function()
  {
    self.color.h = self.palette_coord_x*360;
    self.color.s = self.saturation_coord_x;
    self.color.v = self.palette_coord_y;
    self.color.a = self.alpha_coord_x;
    HSV2RGB(self.color,self.color);
    callback(self.color);
  }

  self.dragging_palette = 0;
  self.dragging_saturation = 0;
  self.dragging_alpha = 0;
  self.dragStart = function(evt)
  {
    self.dragging_palette = 0;
    self.dragging_saturation = 0;
    self.dragging_alpha = 0;
    if(ptWithin(self.palette_x,self.palette_y,self.palette_w,self.palette_h,evt.doX,evt.doY))
      self.dragging_palette = 1;
    else if(ptWithin(self.saturation_x,self.saturation_y,self.saturation_w,self.saturation_h,evt.doX,evt.doY))
      self.dragging_saturation = 1;
    else if(ptWithin(self.alpha_x,self.alpha_y,self.alpha_w,self.alpha_h,evt.doX,evt.doY))
      self.dragging_alpha = 1;
    else
    {
      self.dragging = 0;
      return 0;
    }
    self.drag(evt);
    return 1;
  }
  self.drag = function(evt)
  {
    if(self.dragging_palette)
    {
      self.palette_coord_x = clamp(0,1,invlerp(self.palette_x,self.palette_x+self.palette_w,evt.doX));
      self.palette_coord_y = clamp(0,1,invlerp(self.palette_y,self.palette_y+self.palette_h,evt.doY));
      self.pick();
    }
    else if(self.dragging_saturation)
    {
      self.saturation_coord_x = clamp(0,1,invlerp(self.saturation_x,self.saturation_x+self.saturation_w,evt.doX));
      self.pick();
    }
    else if(self.dragging_alpha)
    {
      self.alpha_coord_x = clamp(0,1,invlerp(self.alpha_x,self.alpha_x+self.alpha_w,evt.doX));
      self.pick();
    }
  }
  self.dragFinish = function(evt)
  {
    self.dragging_palette = 0;
    if(self.dragging_saturation) self.update_palette();
    self.dragging_saturation = 0;
    self.dragging_alpha = 0;
  }

  self.tick = function()
  {

  }

  self.draw = function(ctx)
  {
    var x;
    var y;
    ctx.strokeStyle = green;
    ctx.strokeRect(self.x,self.y,self.w,self.h);
    ctx.strokeRect(self.palette_x,self.palette_y,self.palette_w,self.palette_h);
    ctx.strokeRect(self.saturation_x,self.saturation_y,self.saturation_w,self.saturation_h);
    ctx.strokeRect(self.alpha_x,self.alpha_y,self.alpha_w,self.alpha_h);

    ctx.globalAlpha = self.color.a;
    ctx.drawImage(self.palette,self.palette_x,self.palette_y,self.palette_w,self.palette_h);
    ctx.globalAlpha = 1;

    ctx.fillStyle = black;
    ctx.lineWidth = 2;

    switch(randIntBelow(4))
    {
      case 0: ctx.fillStyle = green; break;
      case 1: ctx.fillStyle = red;   break;
      case 2: ctx.fillStyle = black; break;
      case 3: ctx.fillStyle = white; break;
    }
    x = self.palette_x+self.palette_w*self.palette_coord_x;
    y = self.palette_y+self.palette_h*self.palette_coord_y;
    ctx.fillRect(x-1,y-1,2,2);
    ctx.fillStyle = black;

    ctx.strokeStyle = white;
    ctx.lineWidth = 1;

    ctx.fillRect(self.saturation_x,self.saturation_y,self.saturation_w,self.saturation_h);
    x = self.saturation_x+self.saturation_w*self.saturation_coord_x;
    y = self.saturation_y+self.saturation_h/2;
    ctx.strokeRect(x-1,y-1,2,2);

    ctx.fillRect(self.alpha_x,self.alpha_y,self.alpha_w,self.alpha_h);
    x = self.alpha_x+self.alpha_w*self.alpha_coord_x;
    y = self.alpha_y+self.alpha_h/2;
    ctx.strokeRect(x-1,y-1,2,2);
  }
}

var TouchViewer = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.positions = [];
  self.position_i = 0;
  self.max_positions = 200;
  for(var i = 0; i < self.max_positions; i++)
  {
    self.positions[i*3+0] = 0;//evt.doX;
    self.positions[i*3+1] = 0;//evt.doY;
    self.positions[i*3+2] = 0;//m;
  }

  self.nq = function(evt,m)
  {
    self.positions[self.position_i*3+0] = evt.doX;
    self.positions[self.position_i*3+1] = evt.doY;
    self.positions[self.position_i*3+2] = m;
    self.position_i++;
    if(self.position_i > self.max_positions) self.position_i = 0;
  }

  self.last_evt = {doX:0,doY:0};
  self.dragStart = function(evt)
  {
    self.nq(evt,0);
    self.last_evt = evt;
  }
  self.drag = function(evt)
  {
    self.nq(evt,1);
    self.last_evt = evt;
  }
  self.dragFinish = function()
  {
    self.nq(self.last_evt,2);
  }

  self.tick = function()
  {
    var ind = self.position_i-1;
    if(ind == -1) ind = self.max_positions-1;
    if(self.positions[ind*3+2] != 3)
      self.nq(self.last_evt,3);
  }

  self.draw = function(ctx)
  {
    for(var i = 0; i < self.max_positions; i++)
    {
      var ind = (self.position_i+i)%self.max_positions;
      var x = self.positions[ind*3+0];
      var y = self.positions[ind*3+1];
      var m = self.positions[ind*3+2];
      switch(m)
      {
        case 0: ctx.fillStyle = red; break;
        case 1: ctx.fillStyle = green; break;
        case 2: ctx.fillStyle = blue; break;
        case 3: ctx.fillStyle = black; break;
      }
      var s = (self.max_positions-i)/4;
      if(m == 3) s /= 2;
      ctx.fillRect(x-s/2,y-s/2,s,s);
    }
  }
}

