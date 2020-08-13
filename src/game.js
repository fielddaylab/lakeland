var gg = {};
var ENUM;

var AUDIO = 1;

var Game = function (init) {
  var self = this;
  gg.game = self;
  gg.font = "LeagueSpartan";
  gg.font_color = "#17315B";
  gg.backdrop_color = "#A0DEDB";
  gg.tick_counter = 0;

  // for logging

  gg.lake_nutes = []
  gg.lakenut_tick = 0;
  gg.avfood_tick = 0;
  gg.mrate_tick = 0;
  gg.sadf_tick = 0;
  gg.israining = false;
  
  self.dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
  var sargs = { width: init.width, height: init.height, container: init.container, dpr: self.dpr, smoothing: 1 }
  gg.stage = new Stage(sargs);
  gg.font_size = 14 * gg.stage.s_mod;
  gg.canvas = gg.stage.canvas;
  gg.ctx = gg.stage.context;

  self.scenes = [new LoadingScene(), new MenuScene(), new IntroScene(), new GamePlayScene(), new CreditsScene()];
  var scene_i = 0;

  self.resize_requested = 0;
  self.resize_args = 0;

  self.reset_clicked = false;
  self.request_resize = function (args) {
    self.resize_requested = 10;
    self.resize_args = args;
  }
  self.resize = function (args) {
    if (args.width == gg.stage.width && args.height == gg.stage.height) return;
    document.getElementById(gg.stage.container).removeChild(gg.stage.canvas);
    gg.stage.canvas.width = 0;
    gg.stage.canvas.height = 0;
    if (args.stage) gg.stage = args.stage;
    else //must have width+height in args
    {
      var sargs = { width: args.width, height: args.height, container: gg.stage.container, dpr: self.dpr, smoothing: 1 }
      gg.stage = new Stage(sargs);
      gg.font_size = 14 * gg.stage.s_mod;
    }
    gg.canvas = gg.stage.canvas;
    gg.ctx = gg.stage.context;
    self.scenes[scene_i].resize();
  }

  var prev_t;
  self.begin = function () {
    console.log("self.begin");
    self.scenes[scene_i].ready();

    prev_t = performance.now();
    tick(prev_t);
  };

  var tick = function (cur_t) {
    requestAnimationFrame(tick);
    if (self.resize_requested) {
      self.resize_requested--;
      if (!self.resize_requested) {
        self.resize(self.resize_args);
        self.resize_args = 0;
      }
    }

    if (cur_t - prev_t > 30) self.scenes[scene_i].tick(2);
    else if (cur_t - prev_t < 8) return;
    else self.scenes[scene_i].tick(1);
    self.scenes[scene_i].draw();
    prev_t = cur_t;
  };

  self.nextScene = function () {
    self.setScene(scene_i + 1);
  };

  self.setScene = function (i) {
    self.scenes[scene_i].cleanup();
    scene_i = i;
    self.scenes[scene_i].ready();
  }

  self.getScene = function () {
    return scene_i;
  }

};

