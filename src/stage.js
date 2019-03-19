var Stage = function(init)
{
  var self = this;

  self.width  = init.width;
  self.height = init.height;
  self.container = init.container;
  self.dpr = init.dpr;
  if(!self.dpr) self.dpr = window.devicePixelRatio;
  if(!self.dpr) self.dpr = 1;
  self.canvas = document.createElement('canvas');
  self.canvas.width  = floor(self.width *self.dpr);
  self.canvas.height = floor(self.height*self.dpr);
  self.canvas.style.width = self.width+"px";
  self.canvas.style.height = self.height+"px";
  self.s_mod = (self.canvas.width < self.canvas.height ? self.canvas.width : self.canvas.height)/660;
  self.context = self.canvas.getContext('2d');//,{alpha:false});
  self.context.imageSmoothingEnabled = init.smoothing;

  document.getElementById(self.container).appendChild(self.canvas);
};

