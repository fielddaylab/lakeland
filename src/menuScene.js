var MenuScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(self.clicker) self.clicker.detach(); self.clicker = new Clicker({source:gg.canvas});
  }
  self.resize();

  self.killinput = function()
  {
    if(self.clicker) self.clicker.flush();
  }

  self.begin_btn;
  self.ready = function()
  {
    self.begin_btn = new ButtonBox(100,100,100,100,function(){ gg.game.nextScene(); });
  };

  self.tick = function()
  {
    self.clicker.filter(self.begin_btn);
    if(self.clicker) self.clicker.flush();
  };

  self.draw = function()
  {
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
    gg.ctx.fillStyle = black;
    fillBB(self.begin_btn,gg.ctx);
  };

  self.cleanup = function()
  {
    if(self.clicker) self.clicker.detach(); self.clicker = null;
  };
};

