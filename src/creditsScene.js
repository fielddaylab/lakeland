var keycatch;

var CreditsScene = function()
{
  var self = this;

  keycatch =
  {
    key:function(evt)
    {
      switch(evt.key)
      {
        case " ": gg.game.setScene(1); break;
      }
    }
  }

  self.credits_o = {
    spacing:30*gg.stage.s_mod,
    max_fade_t:20,
    max_roll_t:2000,
    t:0,
    fade_p:0,
    roll_p:0,
    lines:[
      "",
      "Lost at the Forever Mine",
      "",
      "",
      "",
      "A product of the University of Wisconsin",
      "Materials Research Science and Engineering Center IEG",
      "",
      "",
      "",
      "Produced By",
      "FIELD DAY",
      "",
      "",
      "",
      "",
      "",
      "Executive Producer",
      "",
      "Anne Lynn Gillian-Daniel",
      "",
      "",
      "",
      "Producer",
      "",
      "David Gagnon",
      "",
      "",
      "",
      "Education Fellows Director",
      "",
      "Jim Mathews",
      "",
      "",
      "",
      "Creative Director",
      "",
      "Sarah Gagnon",
      "",
      "",
      "",
      "Software Development",
      "",
      "Philip Dougherty",
      "",
      "",
      "",
      "Graphic Design and User Interface",
      "",
      "Eric Lang",
      "",
      "",
      "",
      "Art & Animation",
      "",
      "Reyna Groff",
      "",
      "Eric Lang",
      "",
      "Rodney Lambright II",
      "",
      "",
      "",
      "Content",
      "",
      "Anne Lynn Gillian-Daniel",
      "",
      "Matthew Stilwell",
      "",
      "David Gagnon",
      "",
      "",
      "",
      "Content Consultants:",
      "",
      "Wendy Crone",
      "",
      "Amanda Smith",
      "",
      "Eli Towle",
      "",
      "Benjamin Afflerbach",
      "",
      "Tesia Janicki",
      "",
      "Marc Brousseau",
      "",
      "Noah Edelstein",
      "",
      "Sarah Sprangers",
      "",
      "MRSEC faculty, graduate students, and staff",
      "",
      "",
      "",
      "Writing",
      "",
      "Sarah Gagnon",
      "",
      "Lindy Biller",
      "",
      "Eric Lang",
      "",
      "Philip Dougherty",
      "",
      "",
      "",
      "Original Music & Sound",
      "",
      "Cyril Peck",
      "",
      "",
      "",
      "Administration Support",
      "",
      "Angel Cartagena",
      "",
      "Adam Chase",
      "",
      "Ahna Holliday",
      "",
      "Becki Kohl",
      "",
      "Jim Lyne",
      "",
      "",
      "",
      "Testing and Design Feedback",
      "",
      "Joe Riederer and the students of Wisconsin Rapids Public School",
      "",
      "Olivia Dachel and the students of Merrill High School",
      "",
      "Jenny Karpelenia and the students of Bartels Middle School",
      "",
      "Marsella Aguilar and the students of Waterford Graded School District",
      "",
      "",
      "",
      "",
      "Funding Provided By",
      "",
      "NSF through the University of Wisconsin",
      "Materials Research Science and Engineering Center (DMR-1720415)",
      "",
      "Wisconsin Center for Education Research",
      "",
      "Wisconsin Department of Public Instruction",
      "",
    ],
  };

  self.resize = function()
  {
    if(gg.clicker) gg.clicker.detach(); gg.clicker = new Clicker({source:gg.canvas});
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = new Keyer({source:gg.canvas});

  }

  self.ready = function()
  {
    self.resize();
    self.credits_o.t = 0;
    self.credits_o.fade_p = 0;
    self.credits_o.roll_p = 0;
    self.credits_o.fade_p = 0;
  };

  self.tick = function(times)
  {
    self.credits_o.t += times;
    if(self.credits_o.t < self.credits_o.max_fade_t)
      self.credits_o.fade_p = self.credits_o.t/self.credits_o.max_fade_t;
    else if(self.credits_o.t < self.credits_o.max_fade_t+self.credits_o.max_roll_t)
      self.credits_o.roll_p = (self.credits_o.t-self.credits_o.max_fade_t)/self.credits_o.max_roll_t;
    else if(self.credits_o.t < self.credits_o.max_fade_t*2+self.credits_o.max_roll_t)
      self.credits_o.fade_p = 1-((self.credits_o.t-(self.credits_o.max_fade_t+self.credits_o.max_roll_t))/self.credits_o.max_fade_t);
    else
      gg.game.setScene(1);

    //if(gg.clicker) gg.clicker.filter();
    if(gg.keyer) gg.keyer.filter(keycatch);

    if(gg.clicker) gg.clicker.flush();
    if(gg.keyer) gg.keyer.flush();
  };

  self.draw = function()
  {
    gg.ctx.fillStyle = black;
    gg.ctx.fillRect(0,0,gg.canvas.width,gg.canvas.height);

    gg.ctx.font = "30px DisposableDroidBB";
    var bottom = gg.canvas.height;
    var top = 0-self.credits_o.spacing*self.credits_o.lines.length;
    var p = lerp(bottom,top,self.credits_o.roll_p);
    gg.ctx.fillStyle = white;
    gg.ctx.textAlign = "center";
    for(var i = 0; i < self.credits_o.lines.length; i++)
    {
      if(p > 10*gg.stage.s_mod && p < gg.canvas.height+self.credits_o.spacing)
      {
        if(p < 110*gg.stage.s_mod) gg.ctx.globalAlpha = (p-10*gg.stage.s_mod)/100*gg.stage.s_mod;
        gg.ctx.fillText(self.credits_o.lines[i],gg.canvas.width/2,p);
        gg.ctx.globalAlpha = 1;
      }
      p += self.credits_o.spacing;
    }

  };

  self.cleanup = function()
  {
    if(gg.clicker) gg.clicker.detach(); gg.clicker = null;
    if(gg.keyer)   gg.keyer.detach();   gg.keyer   = null;
  };

};

