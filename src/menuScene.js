var MenuScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(self.clicker) self.clicker.detach(); self.clicker = new Clicker({source:gg.canvas});
  }

  var continuable = 0;
  var tocredits = 0;
  var next = 0;
  var next_t = 0;

  self.killinput = function()
  {
    if(self.clicker) self.clicker.flush();
  }

  self.begin_btn;
  self.continue_btn;
  self.credits_btn;
  self.audio_toggle;
  self.fullscreen_toggle;

  self.ready = function()
  {
    self.resize();

    var w = 240*gg.stage.s_mod;
    var h = 50*gg.stage.s_mod;
    var x = 20*gg.stage.s_mod;
    var y = 220*gg.stage.s_mod;
    self.continue_btn = new ButtonBox(x,y,w,h,function(evt){ if(!continuable) return; next = 1; }); y += h+20*gg.stage.s_mod;
    self.begin_btn    = new ButtonBox(x,y,w,h,function(){ next = 1; }); y += h+20*gg.stage.s_mod;
    self.credits_btn  = new ButtonBox(x,y,w,h,function(){ tocredits = 1; next = 1; }); y += h+20*gg.stage.s_mod;

    var w = 30*gg.stage.s_mod;
    var h = 30*gg.stage.s_mod;
    var x = 100*gg.stage.s_mod;
    var y = gg.canvas.height-100*gg.stage.s_mod;

    self.audio_toggle      = new ToggleBox(x,y,w,h,AUDIO,function(o){ return; audio.pause(); AUDIO = o; if(!o && !audio.paused) audio.pause(); if(o && audio.paused) playHandlePromise(audio,1); }); x += 200*gg.stage.s_mod;
    self.fullscreen_toggle = new ToggleBox(x,y,w,h,0,function(o){ return; /*hijack me from realtime!*/ if(o) fullscreen(); else unfullscreen(); }); x += 200*gg.stage.s_mod;
  };

  self.tick = function()
  {
    if(next)
    {
      next_t += 0.01;
      if(next_t >= 1) { if(!tocredits) gg.game.nextScene(); else gg.game.setScene(4); next = 0; next_t = 0; tocredits = 0; return; /*avoid flush*/ }
    }
    else
    {
      if(
        //!self.clicker.filter(self.continue_btn) &&
        !self.clicker.filter(self.begin_btn) &&
        !self.clicker.filter(self.credits_btn) &&
        !self.clicker.filter(self.audio_toggle) &&
        !self.clicker.filter(self.fullscreen_toggle) &&
        false)
        ;
    }
    if(self.clicker) self.clicker.flush();
  };

  self.draw = function()
  {
    var ctx = gg.ctx;
    ctx.textAlign = "left";
    ctx.drawImage(menu_bg_img,0,0,gg.canvas.width,gg.canvas.height);
    //ctx.fillStyle = black;
    //ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
    //ctx.drawImage(poster_img,0,0,gg.canvas.width,gg.canvas.height);

    var w = 300*gg.stage.s_mod;
    var h = 150*gg.stage.s_mod;
    //ctx.drawImage(logo_img,30,30,w,h);

    var fs = gg.font_size*2;
    ctx.font = fs+"px "+gg.font;
    ctx.fillStyle = white;
    /*
    if(!continuable) ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillText("CONTINUE",self.continue_btn.x+15,self.continue_btn.y+self.continue_btn.h-10);
    if(self.continue_btn.hovering) ctx.fillRect(self.continue_btn.x+10,self.continue_btn.y+self.continue_btn.h,self.continue_btn.w-110,3);
    */
    ctx.fillStyle = white;
    ctx.fillText("NEW GAME",self.begin_btn.x+15,self.begin_btn.y+self.begin_btn.h-10);
    if(self.begin_btn.hovering) ctx.fillRect(self.begin_btn.x+10,self.begin_btn.y+self.begin_btn.h,self.begin_btn.w-105,3);
    /*
    code_txt.draw(canv);
    ctx.fillText("ENTER SAVE CODE:",code_txt.x+15,code_txt.y-20);
    if(!code_valid) ctx.globalAlpha = 0.1;
    ctx.drawImage(go_img,code_btn.x,code_btn.y,code_btn.w,code_btn.h);
    */
    ctx.fillText("CREDITS",self.credits_btn.x+15,self.credits_btn.y+self.credits_btn.h-10);
    if(self.credits_btn.hovering) ctx.fillRect(self.credits_btn.x+10,self.credits_btn.y+self.credits_btn.h,self.credits_btn.w-105,3);
    ctx.globalAlpha = 1;

    if(self.audio_toggle.on)      drawImageBB(  check_img,self.audio_toggle,ctx);
    else                          drawImageBB(uncheck_img,self.audio_toggle,ctx);
    if(self.fullscreen_toggle.on) drawImageBB(  check_img,self.fullscreen_toggle,ctx);
    else                          drawImageBB(uncheck_img,self.fullscreen_toggle,ctx);
    ctx.fillText("MUSIC FX",self.audio_toggle.x+self.audio_toggle.w+5*gg.stage.s_mod,self.audio_toggle.y+self.audio_toggle.h-5*gg.stage.s_mod);
    ctx.fillText("FULLSCREEN",self.fullscreen_toggle.x+self.fullscreen_toggle.w+5*gg.stage.s_mod,self.fullscreen_toggle.y+self.fullscreen_toggle.h-5*gg.stage.s_mod);

    if(next)
    {
      ctx.fillStyle = white;
      ctx.globalAlpha = next_t;
      ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
      ctx.globalAlpha = 1;
    }
  };

  self.cleanup = function()
  {
    if(self.clicker) self.clicker.detach(); self.clicker = null;
  };
};

