var CreditsScene = function()
{
  var self = this;

  self.keycatch =
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
      "Lakeland",
      "",
      "",
      "",
      "Executive Producer",
      "",
      "Victor M. Zavala",
      "",
      "",
      "",
      "Producer",
      "",
      "David Gagnon",
      "",
      "",
      "",
      "Game Design",
      "",
      "Philip Dougherty",
      "",
      "",
      "",
      "Creative Direction",
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
      "Education Fellows Director",
      "",
      "Jim Mathews",
      "",
      "",
      "",
      "User Interface",
      "",
      "Eric Lang",
      "",
      "",
      "",
      "Art & Animation",
      "",
      "Eric Lang",
      "",
      "",
      "",
      "Subject Expertise",
      "",
      "Victor M. Zavala",
      "",
      "Rebecca Larson",
      "",
      "",
      "",
      "Writing",
      "",
      "Lindy Biller",
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
      "Playtesting and Evaluation Coordination",
      "",
      "Jim Mathews",
      "",
      "Jennifer Scianna",
      "",
      "",
      "",
      "Data Analytics",
      "",
      "John Mcclosky",
      "",
      "Luke Swanson",
      "",
      "Jen Scianna",
      "",
      "Erik Harpstead",
      "",
      "Stefan Slater",
      "",
      "Philip Dougherty",
      "",
      "David Gagnon",
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
      "Farming and Phosphorus Educator Fellows",
      "",
      "Amy Workman",
      "",
      "Anthony Schnell",
      "",
      "Benjamin Stern",
      "",
      "Craig Corcoran",
      "",
      "Heather Messer",
      "",
      "Meghan Sawdy",
      "",
      "Olivia Dachel",
      "",
      "Robert Turner",
      "",
      "Zeth Engel",
      "",
      "",
      "",
      "Testing and Design Feedback",
      "",
      "Students of Reedsburg Area High School",
      "",
      "Students of Lodi High School",
      "",
      "Students of Fox Valley Lutheran High School",
      "",
      "Students of Guilford High School",
      "",
      "Students of Clark Street Community School",
      "",
      "Students of Vincent High School",
      "",
      "Students of Merrill High School",
      "",
      "Students of Omro High School",
      "",
      "Students of DeForest High School",
      "",
      "",
      "",
      "WCATY Coding Camp at UW Madison",
      "",
      "Jayvyn G.",
      "",
      "Henry T.",
      "",
      "Nethra G.",
      "",
      "Zane Y.",
      "",
      "Sidney M.",
      "",
      "Brennan R.",
      "",
      "Lucy W.",
      "",
      "",
      "",
      "MSCR STEM Camp at UW Madison",
      "",
      "Gabe W.",
      "",
      "Ava E.",
      "",
      "",
      "",
      "Cambridge School District Summer School",
      "",
      "Jacob S.",
      "",
      "",
      "",
      "Special Thanks",
      "",
      "Travis Targen",
      "",
      "Students and Staff of the Scalable Systems Laboratory",
      "",
      "",
      "",
      "Funding Provided By",
      "",
      "United States Dairy Association Innovations at the Nexus of Food, Energy, and Water (USDA INFEWS). Principal Investigator: Victor Zavala Tejeda",
      "",
      "",
      "",
      "Additional Funding Provided By",
      "",
      "Wisconsin Department of Public Instruction",
      "",
      "Wisconsin Center for Education Research",
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
    if(gg.keyer) gg.keyer.filter(self.keycatch);

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

