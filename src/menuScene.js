var MenuScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(self.clicker) self.clicker.detach(); self.clicker = new Clicker({source:gg.canvas});

    var w = 0;
    var h = 0;
    var x = 0;
    var y = 0;

    w = 240*gg.stage.s_mod;
    h = 50*gg.stage.s_mod;
    x = 60*gg.stage.s_mod;
    y = 220*gg.stage.s_mod;
    if(self.continue_btn){ self.continue_btn.x = x; self.continue_btn.y = y; self.continue_btn.w = w; self.continue_btn.h = h; } y += h+20*gg.stage.s_mod;
    if(self.begin_btn)   { self.begin_btn.x = x;    self.begin_btn.y = y;    self.begin_btn.w = w;    self.begin_btn.h = h;    } y += h+20*gg.stage.s_mod;
    if(self.credits_btn) { self.credits_btn.x = x;  self.credits_btn.y = y;  self.credits_btn.w = w;  self.credits_btn.h = h;  } y += h+20*gg.stage.s_mod;

    w = 30*gg.stage.s_mod;
    h = 30*gg.stage.s_mod;
    x = 60*gg.stage.s_mod;
    y = gg.canvas.height-100*gg.stage.s_mod;
    if(self.audio_toggle)     { self.audio_toggle.x = x;      self.audio_toggle.y = y;      self.audio_toggle.w = w;      self.audio_toggle.h = h;      } x += 250*gg.stage.s_mod;
    if(self.fullscreen_toggle){ self.fullscreen_toggle.x = x; self.fullscreen_toggle.y = y; self.fullscreen_toggle.w = w; self.fullscreen_toggle.h = h; } x += 250*gg.stage.s_mod;
    if(self.language_toggle)  { self.language_toggle.x = x;   self.language_toggle.y = y;   self.language_toggle.w = w;   self.language_toggle.h = h;   } x += 250*gg.stage.s_mod;
  }

  gg.continue_ls = 0;
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
  self.language_toggle;

  self.ready = function()
  {
    if(AUDIO && !gg.aud_wrangler.music_shouldbeplaying) gg.aud_wrangler.play_music();
    gg.continue_ls = window.localStorage.getItem('save');
    self.continue_btn = new ButtonBox(0,0,0,0,function(evt){ if(!gg.continue_ls) return; next = 1; });
    self.begin_btn    = new ButtonBox(0,0,0,0,function(){ gg.continue_ls = 0; next = 1; });
    self.credits_btn  = new ButtonBox(0,0,0,0,function(){ tocredits = 1; next = 1; });
    self.audio_toggle      = new ToggleBox(0,0,0,0,AUDIO,function(o){ AUDIO = o; if(AUDIO) gg.aud_wrangler.play_music(); else gg.aud_wrangler.stop_music(); });
    self.fullscreen_toggle = new ToggleBox(0,0,0,0,0,function(o){ /*hijack me from realtime!*/ if(o) fullscreen(); else unfullscreen(); });
    self.language_toggle = new ToggleBox(0,0,0,0,0,function(o){ if(o) lang = "es"; else lang = "en"; });
    self.resize();
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
        !self.clicker.filter(self.continue_btn) &&
        !self.clicker.filter(self.begin_btn) &&
        !self.clicker.filter(self.credits_btn) &&
        !self.clicker.filter(self.audio_toggle) &&
        !self.clicker.filter(self.fullscreen_toggle) &&
        !self.clicker.filter(self.language_toggle) &&
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
    if(!gg.continue_ls) ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillText("CONTINUE",self.continue_btn.x+15,self.continue_btn.y+self.continue_btn.h-10);
    if(self.continue_btn.hovering) ctx.fillRect(self.continue_btn.x+10,self.continue_btn.y+self.continue_btn.h,self.continue_btn.w-110,3);
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
                                  drawImageBB(uncheck_img,self.language_toggle,ctx);
    fs = gg.font_size;
    ctx.font = fs+"px "+gg.font;
    if(self.language_toggle.on)   ctx.fillText("ES",self.language_toggle.x+5*gg.stage.s_mod,self.language_toggle.y+self.language_toggle.h-10*gg.stage.s_mod);
    else                          ctx.fillText("EN",self.language_toggle.x+5*gg.stage.s_mod,self.language_toggle.y+self.language_toggle.h-10*gg.stage.s_mod);
    fs = gg.font_size*2;
    ctx.font = fs+"px "+gg.font;
    ctx.fillText("MUSIC FX",self.audio_toggle.x+self.audio_toggle.w+5*gg.stage.s_mod,self.audio_toggle.y+self.audio_toggle.h-5*gg.stage.s_mod);
    ctx.fillText("FULLSCREEN",self.fullscreen_toggle.x+self.fullscreen_toggle.w+5*gg.stage.s_mod,self.fullscreen_toggle.y+self.fullscreen_toggle.h-5*gg.stage.s_mod);
    ctx.fillText(" LANGUAGE",self.language_toggle.x+self.language_toggle.w+5*gg.stage.s_mod,self.language_toggle.y+self.language_toggle.h-5*gg.stage.s_mod);

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
    if(AUDIO && gg.aud_wrangler.music_shouldbeplaying) gg.aud_wrangler.stop_music();
    gg.aud_wrangler.deregister_music();
  };
};

