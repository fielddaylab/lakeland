var IntroScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = new Keyer({source:gg.canvas});
  }
  self.resize();

  self.ready = function()
  {

  };

  var t = 0;
  var txt_len = 100;
  var txts = [
    "Hey this is a test",
    "That's pretty cool",
    "hooray",
  ];

  self.tick = function()
  {
    t++;
    if(t > txts.length*txt_len) gg.game.nextScene();
    else gg.keyer.filterkey(function(evt){ if(evt.keyCode == 32) gg.game.nextScene(); });
    gg.keyer.flush();
  };

  self.draw = function()
  {
    gg.ctx.font = "30px LeagueSpartan";
    gg.ctx.globalAlpha = 1;
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
    gg.ctx.fillStyle = black;
    var i = floor(t/txt_len);
    gg.ctx.textAlign = "center";
    gg.ctx.fillStyle = black;
    var p = (t-(i*txt_len))/txt_len;
         if(p < 0.1) gg.ctx.globalAlpha = p*10;
    else if(p > 0.9) gg.ctx.globalAlpha = 1-((p-0.9)*10);
    gg.ctx.fillText(txts[i],gg.canvas.width/2,gg.canvas.height/2);
  };

  self.cleanup = function()
  {

  };
};

