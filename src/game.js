var gg = {};
var ENUM;

var Game = function(init)
{
  var self = this;
  gg.game = self;

  self.dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
  var sargs = {width:init.width,height:init.height,container:init.container,dpr:self.dpr,smoothing:1}
  gg.stage = new Stage(sargs);
  gg.canvas = gg.stage.canvas;
  gg.ctx = gg.stage.context;

  var scenes = [new LoadingScene(), new IntroScene(), new GamePlayScene()];
  var scene_i = 0;

  self.resize_requested = 0;
  self.resize_args = 0;
  self.request_resize = function(args)
  {
    self.resize_requested = 10;
    self.resize_args = args;
  }
  self.resize = function(args)
  {
    if(args.width == gg.stage.width && args.height == gg.stage.height) return;
    document.getElementById(gg.stage.container).removeChild(gg.stage.canvas);
    gg.stage.canvas.width = 0;
    gg.stage.canvas.height = 0;
    if(args.stage) gg.stage = args.stage;
    else //must have width+height in args
    {
      var sargs = {width:args.width,height:args.height,container:gg.stage.container,dpr:self.dpr,smoothing:1}
      gg.stage = new Stage(sargs);
    }
    gg.canvas = gg.stage.canvas;
    gg.ctx = gg.stage.context;
    scenes[scene_i].resize();
  }

  var prev_t;
  self.begin = function()
  {
    //scenes[scene_i].ready(); //hack for this game that readys every scene at once!

    for(var i = 0; i < scenes.length; i++)
      scenes[i].ready();

    prev_t = performance.now();
    tick(prev_t);
  };

  var tick = function(cur_t)
  {
    requestAnimationFrame(tick);

    if(self.resize_requested)
    {
      self.resize_requested--;
      if(!self.resize_requested)
      {
        self.resize(self.resize_args);
        self.resize_args = 0;
      }
    }

    if(cur_t-prev_t > 30) scenes[scene_i].tick(2);
    else if(cur_t-prev_t < 8) return;
    else scenes[scene_i].tick(1);
    scenes[scene_i].draw();
    prev_t = cur_t;
  };

  self.nextScene = function()
  {
    self.setScene(scene_i+1);
  };

  self.setScene = function(i)
  {
    scenes[scene_i].cleanup();
    scene_i = i;
    //scenes[scene_i].ready(); //hack for this game that readys every scene at once!
  }

};

