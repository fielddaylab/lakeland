var LoadingScene = function()
{
  var self = this;

  self.resize = function()
  {
  }

  var pad;
  var barw;

  var loading_percent_loaded;
  var ticks_since_loading_ready;
  var percent_loaded;
  var chase_percent_loaded;
  var lerp_percent_loaded;
  var lerp_chase_percent_loaded;
  var ticks_since_ready;
  var post_load_countdown;

  var n_loading_imgs_loaded;
  var loading_img_srcs;
  var loading_imgs;
  var n_imgs_loaded;
  var img_srcs;
  var imgs;
  var n_fonts_loaded;
  var font_srcs;
  var font_loaded;
  var font_wrongdata;
  var font_canv;
  var font_canv_s;
  gg.aud_wrangler;

  var loadingImageLoaded = function()
  {
    n_loading_imgs_loaded++;
  };
  var imageLoaded = function()
  {
    n_imgs_loaded++;
  };
  var fontLoaded = function()
  {
    n_fonts_loaded++;
  };

  var tryfont = function()
  {
    font_canv.context.fillStyle = "#FFFFFF";
    font_canv.context.fillRect(0,0,font_canv_s,font_canv_s);
    font_canv.context.fillStyle = "#000000";
    font_canv.context.fillText("a",12,22);
  }

  self.ready = function()
  {
    self.resize();
    pad = 20;
    barw = (gg.canvas.width-(2*pad));

    loading_percent_loaded = 0;
    ticks_since_loading_ready = 0;
    percent_loaded = 0;
    chase_percent_loaded = 0;
    lerp_percent_loaded = 0;
    lerp_chase_percent_loaded = 0;
    ticks_since_ready = 0;
    post_load_countdown = 1;

    n_loading_imgs_loaded = 0;
    loading_img_srcs = [];
    loading_imgs = [];
    n_imgs_loaded = 0;
    img_srcs = [];
    imgs = [];
    n_fonts_loaded = 0;
    font_srcs = [];
    font_loaded = [];
    audio_srcs = [];

    //put asset paths in loading_img_srcs (for assets used on loading screen itself)
    //loading_img_srcs.push("assets/loading_img.png");
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      loading_imgs[i] = new Image();
      loading_imgs[i].onload = loadingImageLoaded;
      loading_imgs[i].src = loading_img_srcs[i];
    }
    loadingImageLoaded(); //call once to prevent 0/0 != 100% bug

    //put asset paths in img_srcs
    //img_srcs.push("assets/img.jpg");
    for(var i = 0; i < img_srcs.length; i++)
    {
      imgs[i] = new Image();
      imgs[i].onload = imageLoaded;
      imgs[i].src = img_srcs[i];
    }
    imageLoaded(); //call once to prevent 0/0 != 100% bug

    //put font paths in font_srcs
    //font_srcs.push("FontName"); //NEEDS DEFINITION IN index.html CSS!!
    font_canv_s = 25;
    font_canv = GenIcon(font_canv_s,font_canv_s);
    // uncomment below for preview
    //font_canv.style.position="absolute";
    //font_canv.style.left="-"+font_canv_s+"px";
    //document.getElementById("content").appendChild(font_canv);
    font_canv.context.font = "20px THISFONTDOESNTEXIST";
    tryfont();
    font_wrongdata = font_canv.context.getImageData(0,0,font_canv_s,font_canv_s);
    for(var i = 0; i < font_srcs.length; i++)
    {
      font_loaded[i] = 0;
    }
    fontLoaded(); //call once to prevent 0/0 != 100% bug

    //put asset paths in audio_srcs
    //audio_srcs.push("assets/audio.mp3");
    gg.aud_wrangler = new AudWrangler();
    for(var i = 0; i < audio_srcs.length; i++)
      gg.aud_wrangler.register(audio_srcs[i]);
  };

  self.tick = function()
  {
    //font main-thread loaded test
    for(var i = 0; i < font_srcs.length; i++)
    {
      var font_data;
      if(!font_loaded[i])
      {
        font_canv.context.font = "20px "+font_srcs[i];
        tryfont();
        font_data = font_canv.context.getImageData(0,0,font_canv_s,font_canv_s);
        var j;
        for(j = 0; font_data.data[j] == font_wrongdata.data[j] && j < font_data.data.length; j++) ;
        if(j < font_wrongdata.data.length)
        {
          fontLoaded();
          ctx.font = "20px "+font_srcs[i];
          ctx.fillText(".",0,0);
          font_loaded[i] = 1;
        }
      }
    }

    //note- assets used on loading screen itself NOT included in wait
    loading_percent_loaded = n_loading_imgs_loaded/(loading_img_srcs.length+1);
    if(loading_percent_loaded >= 1.0) ticks_since_loading_ready++;
    percent_loaded = (n_imgs_loaded+n_fonts_loaded+(gg.aud_wrangler.auds_loaded+1))/((img_srcs.length+1)+(font_srcs.length+1)+(audio_srcs.length+1));
    if(chase_percent_loaded <= percent_loaded) chase_percent_loaded += 0.01;
    lerp_percent_loaded = lerp(lerp_percent_loaded,percent_loaded,0.1);
    lerp_chase_percent_loaded = lerp(lerp_chase_percent_loaded,chase_percent_loaded,0.1);
    if(percent_loaded >= 1.0) ticks_since_ready++;
    if(ticks_since_ready >= post_load_countdown)
    {
      if(ticks_since_loading_ready > 1) gg.game.nextScene(); //set 1 = # ticks in preloading sequence
      //gg.game.nextScene();
    }
  };

  self.draw = function()
  {
    var ctx = gg.ctx;
    if(chase_percent_loaded < 1)
    {
      ctx.fillStyle = "#888888";
      ctx.strokeStyle = "#888888";
      ctx.fillRect(pad,gg.canvas.height/2,chase_percent_loaded*barw,1);
      ctx.strokeRect(pad-1,(gg.canvas.height/2)-1,barw+2,3);
    }

    if(loading_percent_loaded >= 1)
    {
      //do any special drawing here- use 'ticks_since_loading_ready' as t for preloading sequence
    }

/*
    var x = 10;
    var y = 30;
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      ctx.fillText(loading_img_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_loading_imgs_loaded,x,y);
    y += 20;
    for(var i = 0; i < img_srcs.length; i++)
    {
      ctx.fillText(img_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_imgs_loaded,x,y);
    y += 20;
    for(var i = 0; i < font_srcs.length; i++)
    {
      ctx.fillText(font_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_fonts_loaded,x,y);
    y += 20;
    for(var i = 0; i < audio_srcs.length; i++)
    {
      ctx.fillText(audio_srcs[i],x,y);
      y += 20;
    }
    ctx.fillText(n_audios_loaded,x,y);
    y += 20;
*/
  };

  self.cleanup = function()
  {
    imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
    loading_imgs = [];//just used them to cache assets in browser; let garbage collector handle 'em.
  };
};

