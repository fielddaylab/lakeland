var cow_aud;
var dairy_aud;
var death_aud;
var fertilizer_aud;
var house_aud;
var lake_aud;
var money_aud;
var road_aud;
var sign_aud;

var LoadingScene = function()
{
  var self = this;

  self.resize = function()
  {
    if(self.keyer) self.keyer.detach(); self.keyer = new Keyer({source:gg.canvas});
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
    loading_img_srcs.push("assets/logo_collaborator.png");
    loading_img_srcs.push("assets/logo_fd.png");
    for(var i = 0; i < loading_img_srcs.length; i++)
    {
      loading_imgs[i] = new Image();
      loading_imgs[i].onload = loadingImageLoaded;
      loading_imgs[i].src = loading_img_srcs[i];
    }
    loadingImageLoaded(); //call once to prevent 0/0 != 100% bug

    //put asset paths in img_srcs
    //img_srcs.push("assets/img.jpg");
    for(var c = 0; c < farmbit_colors; c++)
    {
      for(var a = 0; a < FARMBIT_ANIM_COUNT; a++)
      {
        var name = farmbit_anim_names[a];
        for(var s = 0; s < 2; s++)
        {
          var side = s ? "back" : "front";
          for(var f = 0; f < farmbit_anim_nframes[a]; f++)
            img_srcs.push("assets/farmbit_"+c+"_"+name+"_"+side+"_"+f+".png");
        }
      }
    }
    img_srcs.push("assets/menu_bg.jpg");
    img_srcs.push("assets/checkbutton.png");
    img_srcs.push("assets/checkbutton_on.png");
    img_srcs.push("assets/icon_money.png");
    img_srcs.push("assets/icon_cursor.png");
    img_srcs.push("assets/icon_fertilizer.png");
    img_srcs.push("assets/icon_fertilizer_nutrition.png");
    img_srcs.push("assets/icon_food.png");
    img_srcs.push("assets/icon_food_sell.png");
    img_srcs.push("assets/icon_food_feed.png");
    img_srcs.push("assets/icon_milk.png");
    img_srcs.push("assets/icon_milk_sell.png");
    img_srcs.push("assets/icon_poop.png");
    img_srcs.push("assets/icon_poop_sell.png");
    img_srcs.push("assets/tile_bloom.png");
    img_srcs.push("assets/tile_fertilizer.png");
    img_srcs.push("assets/tile_fertilizer_nutrition.png");
    img_srcs.push("assets/tile_food.png");
    img_srcs.push("assets/tile_food_sell.png");
    img_srcs.push("assets/tile_food_feed.png");
    img_srcs.push("assets/tile_milk.png");
    img_srcs.push("assets/tile_milk_sell.png");
    img_srcs.push("assets/tile_poop.png");
    img_srcs.push("assets/tile_poop_sell.png");
    img_srcs.push("assets/tile_water.png");
    img_srcs.push("assets/tile_farm.png");
    img_srcs.push("assets/tile_forest.png");
    img_srcs.push("assets/tile_land_t0_d0_f0.png");
    img_srcs.push("assets/tile_grave.png");
    img_srcs.push("assets/tile_home.png");
    img_srcs.push("assets/tile_lake.png");
    img_srcs.push("assets/tile_livestock_0.png");
    img_srcs.push("assets/tile_money.png");
    img_srcs.push("assets/tile_out.png");
    img_srcs.push("assets/tile_road.png");
    img_srcs.push("assets/tile_rock.png");
    img_srcs.push("assets/tile_shore.png");
    img_srcs.push("assets/tile_sign.png");
    img_srcs.push("assets/tile_skull.png");
    img_srcs.push("assets/vignette_land.png");
    img_srcs.push("assets/vignette_lake.png");
    img_srcs.push("assets/vignette_forest.png");
    img_srcs.push("assets/vignette_rock.png");
    img_srcs.push("assets/vignette_farm.png");
    img_srcs.push("assets/vignette_livestock.png");
    img_srcs.push("assets/vignette_overlay_corn.png");
    img_srcs.push("assets/vignette_overlay_corn_nutrition.png");
    img_srcs.push("assets/vignette_overlay_cob.png");
    img_srcs.push("assets/vignette_overlay_cob_nutrition.png");
    img_srcs.push("assets/advisor_mayor.png");
    img_srcs.push("assets/advisor_business.png");
    img_srcs.push("assets/advisor_farmer.png");
    img_srcs.push("assets/advisor_panel_mayor.png");
    img_srcs.push("assets/advisor_panel_business.png");
    img_srcs.push("assets/advisor_panel_farmer.png");
    img_srcs.push("assets/badge_cow.png");
    img_srcs.push("assets/badge_farmbit.png");
    img_srcs.push("assets/badge_money.png");
    img_srcs.push("assets/button_achievement.png");
    img_srcs.push("assets/button_close.png");
    img_srcs.push("assets/button_next.png");
    img_srcs.push("assets/skip_tutorial.png");
    img_srcs.push("assets/clouds.png");
    img_srcs.push("assets/cow.png");
    img_srcs.push("assets/farmbit.png");
    img_srcs.push("assets/play.png");
    img_srcs.push("assets/pause.png");
    img_srcs.push("assets/fast.png");
    img_srcs.push("assets/nutrition_on.png");
    img_srcs.push("assets/nutrition_off.png");
    for(var i = 0; i < 4; i++) img_srcs.push("assets/achievement_pop_"+i+".png");
    for(var i = 0; i < 4; i++) img_srcs.push("assets/achievement_farm_"+i+".png");
    for(var i = 0; i < 4; i++) img_srcs.push("assets/achievement_money_"+i+".png");
    for(var i = 0; i < 4; i++) img_srcs.push("assets/achievement_bloom_"+i+".png");
    for(var i = 0; i < img_srcs.length; i++)
    {
      imgs[i] = new Image();
      imgs[i].onload = imageLoaded;
      imgs[i].src = img_srcs[i];
    }
    imageLoaded(); //call once to prevent 0/0 != 100% bug

    //put font paths in font_srcs
    font_srcs.push("LeagueSpartan"); //NEEDS DEFINITION IN index.html CSS!!
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

    gg.aud_wrangler = new AudWrangler();
    //must declare variables globally. yikes.
    cow_aud        = gg.aud_wrangler.register("assets/audio/cow.mp3");
    dairy_aud      = gg.aud_wrangler.register("assets/audio/dairy.wav");
    death_aud      = gg.aud_wrangler.register("assets/audio/death.wav");
    fertilizer_aud = gg.aud_wrangler.register("assets/audio/fertilizer.wav");
    house_aud      = gg.aud_wrangler.register("assets/audio/house.mp3");
    lake_aud       = gg.aud_wrangler.register("assets/audio/lake.wav");
    money_aud      = gg.aud_wrangler.register("assets/audio/money.mp3");
    road_aud       = gg.aud_wrangler.register("assets/audio/road.mp3");
    sign_aud       = gg.aud_wrangler.register("assets/audio/sign.mp3");
    music_aud      = gg.aud_wrangler.register_music("assets/audio/menu_music.mp3");
  };

  self.tick = function()
  {
    self.keyer.filterkey(function(evt){ if(evt.keyCode == 32) gg.game.nextScene(); });
    if(self.keyer) self.keyer.flush();

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
      if(ticks_since_loading_ready > 550) gg.game.nextScene(); //set 1 = # ticks in preloading sequence
      //gg.game.nextScene();
    }
  };

  self.draw = function()
  {
    var ctx = gg.ctx;
    ctx.clearRect(0,0,gg.canvas.width,gg.canvas.height);

    if(chase_percent_loaded < 1)
    {
      ctx.fillStyle = "#888888";
      ctx.strokeStyle = "#888888";
      ctx.fillRect(pad,gg.canvas.height-pad,chase_percent_loaded*barw,1);
      ctx.strokeRect(pad-1,gg.canvas.height-pad-1,barw+2,3);
    }

    if(loading_percent_loaded >= 1)
    {
      //do any special drawing here- use 'ticks_since_loading_ready' as t for preloading sequence
      if(ticks_since_loading_ready < 50)
      {
        ctx.globalAlpha = ticks_since_loading_ready/50;
        drawImageHeightCentered(loading_imgs[0],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 200)
      {
        drawImageHeightCentered(loading_imgs[0],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 250)
      {
        ctx.globalAlpha = 1-((ticks_since_loading_ready-200)/50);
        drawImageHeightCentered(loading_imgs[0],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 300)
      {
        ctx.globalAlpha = (ticks_since_loading_ready-250)/50;
        drawImageHeightCentered(loading_imgs[1],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 450)
      {
        drawImageHeightCentered(loading_imgs[1],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 500)
      {
        ctx.globalAlpha = 1-((ticks_since_loading_ready-450)/50);
        drawImageHeightCentered(loading_imgs[1],gg.canvas.width/2,gg.canvas.height/2,200,ctx);
      }
      else if(ticks_since_loading_ready < 550)
      {
        ctx.globalAlpha = (ticks_since_loading_ready-500)/50;
        ctx.fillStyle = black;
        ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
      }
      else
      {
        ctx.fillStyle = black;
        ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);
      }
      ctx.globalAlpha = 1;
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
    if(self.keyer) self.keyer.detach(); self.keyer = null;
  };
};

