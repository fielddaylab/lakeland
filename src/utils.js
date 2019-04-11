//maps attributes found in defaults from init onto obj, falling back to defaults value if not present in init
var doMapInitDefaults = function(obj, init, defaults)
{
  var attribs = Object.keys(defaults);
  for(var i = 0; i < attribs.length; i++)
  {
    var k = attribs[i];
    obj[k] = init.hasOwnProperty(k) ? init[k] : defaults[k];
  }
}

//sets doX and doY as x/y offset into the object listening for the event
function doSetPosOnEvent(evt)
{
  if(evt.offsetX != undefined)
  {
    evt.doX = evt.offsetX*gg.stage.dpr;
    evt.doY = evt.offsetY*gg.stage.dpr;
  }
  else if(evt.touches != undefined && evt.touches[0] != undefined)
  {
    //unfortunately, seems necessary...
    var t = evt.touches[0].target;

    var bb = t.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = bb.top +  scrollTop - clientTop;
    var left = bb.left + scrollLeft - clientLeft;

    evt.doX = (evt.touches[0].pageX-left)*gg.stage.dpr;
    evt.doY = (evt.touches[0].pageY-top)*gg.stage.dpr;

  }
  else if(evt.layerX != undefined && evt.originalTarget != undefined)
  {
    evt.doX = (evt.layerX-evt.originalTarget.offsetLeft)*gg.stage.dpr;
    evt.doY = (evt.layerY-evt.originalTarget.offsetTop)*gg.stage.dpr;
  }
  else //give up because javascript is terrible
  {
    evt.doX = 0;
    evt.doY = 0;
  }
}

function doEvtWithinBB(evt, bb)
{
  return (evt.doX >= bb.x && evt.doX <= bb.x+bb.w && evt.doY >= bb.y && evt.doY <= bb.y+bb.h);
}
function doEvtWithin(evt, x,y,w,h)
{
  return (evt.doX >= x && evt.doX <= x+w && evt.doY >= y && evt.doY <= y+h);
}

function jsonFromURL()
{
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part){ var item = part.split("="); result[item[0]] = decodeURIComponent(item[1]); });
  return result;
}

function clone(o)
{
  if(typeof o === 'object') return cloneInto(o,{});
  return o;
}

function cloneInto(src,dst)
{
  var attribs = Object.keys(src);
  for(var i = 0; i < attribs.length; i++)
  {
    var k = attribs[i];
    dst[k] = src[k];
  }
  return dst;
}

function deepCloneInto(src,dst) //NOT IMPLEMENTED! REALLY JUST EXISTS AS CONTRAST TO CLONEINTO TO DESCRIBE LIMITATIONS
{
  var attribs = Object.keys(src);
  for(var i = 0; i < attribs.length; i++)
  {
    var k = attribs[i];
    dst[k] = src[k];
  }
  return dst;
}

//colors
var black   = "#000000";
var white   = "#FFFFFF";
var red     = "#FF0000";
var green   = "#00FF00";
var blue    = "#0000FF";
var cyan    = "#00FFFF";
var magenta = "#FF00FF";
var yellow  = "#FFFF00";

var brown   = "#6D4227";
var purple  = "#7856CB";
var orange  = "#EE682C";
var gray    = "#888888";
var dark_gray  = "#444444";
var light_gray = "#CCCCCC";

var dark_red    = "#880000";
var light_red   = "#FFAAAA";
var dark_green  = "#008800";
var light_green = "#AAFFAA";
var dark_blue   = "#000088";
var light_blue  = "#AAAAFF";

function nthIndex(needle, n, hay)
{
  var l = hay.length;
  var index = -1;
  for(var i = 0; i < n && index++ < l; i++)
  {
      index = hay.indexOf(needle, index);
      if(index < 0) break;
  }
  return index;
}

//math (raw)
function mapVal(from_min, from_max, to_min, to_max, v) { return ((v-from_min)/(from_max-from_min))*(to_max-to_min)+to_min; }
function clampMapVal(from_min, from_max, to_min, to_max, v) { return clamp(to_min,to_max,((v-from_min)/(from_max-from_min))*(to_max-to_min)+to_min); }
function clamp(a,b,v) { if(v < a) return a; if(v > b) return b; return v; }
function eq(a,b,e) { return (a < b+e && a > b-e); }
function dir(v) { if(v > 0) return 1; else if(v < 0) return -1; else return 0; }
function lerp(s,e,t) { return s+((e-s)*t); }
function invlerp(s,e,v) { return (v-s)/(e-s); }
function easein(x)  { return x*x; } //only valid from 0-1
function easeout(x) { x = 1-x; return 1-(x*x); } //only valid from 0-1
function smooth(x) { return 3*x*x - 2*x*x*x; } //only valid from 0-1!
function smoothn(n,x) //not at all done...
{
  switch(n)
  {
    case 0: return x;
  }
  return smooth(x); //lol
}
function clerp(s,e,t)
{
  while(s < 0) s += Math.PI*2;
  while(e < 0) e += Math.PI*2;

       if(e > s && e-s > s-(e-Math.PI*2)) e -= Math.PI*2;
  else if(s > e && s-e > (e+Math.PI*2)-s) e += Math.PI*2;

  return lerp(s,e,t)%(Math.PI*2);
}
function cdist(a,b)
{
  while(a < 0) a += Math.PI*2;
  while(b < 0) b += Math.PI*2;
  var dist = Math.abs(a-b);
  if(dist > Math.PI) dist = Math.PI*2-dist;

  return dist;
}
function distsqr(ax,ay,bx,by)
{
  var x = bx-ax;
  var y = by-ay;
  return x*x+y*y;
}
function dist(ax,ay,bx,by)
{
  var x = bx-ax;
  var y = by-ay;
  return Math.sqrt(x*x+y*y);
}
function randIntBelow(n) { return Math.floor(rand()*n); }
function randIntBelowBias0(n) { return Math.floor(bias0(rand())*n); }
function randIntBelowBias1(n) { return Math.floor(bias1(rand())*n); }
function randBool() { return randIntBelow(2); }
function rand0() { return (rand()*2)-1; }
var randR = function(s,e) { return lerp(s,e,rand()); }
var bias0 = function(v) { return v*v; };
var bias1 = function(v) { v = 1-v; return 1-(v*v); };
var SeededRand = function(s)
{
  var self = this;
  self.seed = s;
  self.next = function()
  {
  var x = Math.sin(self.seed++) * 10000;
  return x - Math.floor(x);
  }
}
var srand = new SeededRand(0);
//var rand = srand.next;
var rand = Math.random;
function rand0() { return (rand()*2)-1; }
var randR = function(s,e) { return lerp(s,e,rand()); }
var round = Math.round;
var floor = Math.floor;
var ceil = Math.ceil;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var maxd = function(d,v) { if(v < 0) return -max(d,-v); else return max(d,v); }
var mind = function(d,v) { if(v < 0) return -min(d,-v); else return min(d,v); }
var pow = Math.pow;
var sqr = function(v) { return v*v; }
var sqrt = Math.sqrt;
var sin = Math.sin;
var asin = Math.asin;
var psin = function(t) { return (Math.sin(t)+1)/2; }
var cos = Math.cos;
var acos = Math.acos;
var pcos = function(t) { return (Math.cos(t)+1)/2; }
var tan = Math.tan;
var atan = Math.atan;
var atan2 = Math.atan2;
var pi = Math.PI;
var twopi = 2*pi;
var halfpi = pi/2;
var quarterpi = pi/4;
var eighthpi = pi/8;
var twelvepi = 12*pi;

function noop(){}
function ffunc(){return false;}
function tfunc(){return true;}


var bounceup_data = [];
{
  var n = 100;
  var p = 0;
  var vel = 0;
  var pull = 0.3;
  var damp = 0.8;
  for(var i = 0; i < n; i++)
  {
    p += vel;
    vel += (1-p)*pull;
    vel *= damp;
    bounceup_data[i] = p;
  }
  bounceup_data[n] = bounceup_data[n-1];
}
var bounceup = function(t)
{
  t *= bounceup_data.length-2; //knowing that final data is duplicate
  var root = floor(t);
  var d = t-root;
  return lerp(bounceup_data[root],bounceup_data[root+1],d);
}

var fdisp = function(f,n) //formats float for display (from 8.124512 to 8.12)
{
  if(n == undefined) n = 2;
  n = Math.pow(10,n);
  return Math.round(f*n)/n;
}

function mapPt(from,to,pt)
{
  pt.x = ((pt.x-from.x)/from.w)*to.w+to.x;
  pt.y = ((pt.y-from.y)/from.h)*to.h+to.y;
  return pt;
}
function mapRect(from,to,rect)
{
  rect.x = ((rect.x-from.x)/from.w)*to.w+to.x;
  rect.y = ((rect.y-from.y)/from.h)*to.h+to.y;
  rect.w = (rect.w/from.w)*to.w;
  rect.h = (rect.h/from.h)*to.h;
  return rect;
}

//collide (raw)
var ptWithin = function(x,y,w,h,ptx,pty) { return (ptx >= x && ptx <= x+w && pty >= y && pty <= y+h); }
var ptNear = function(x,y,r,ptx,pty) { var dx = ptx-x; var dy = pty-y; return (dx*dx+dy*dy) < r*r; }
var rectCollide = function(ax,ay,aw,ah,bx,by,bw,bh) { return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah; }

var setBB = function(bb, x,y,w,h)
{
  bb.x = x;
  bb.y = y;
  bb.w = w;
  bb.h = h;
}

var ptWithinBB = function(bb,ptx,pty)
{
  return (ptx >= bb.x && ptx <= bb.x+bb.w && pty >= bb.y && pty <= bb.y+bb.h);
}
var worldPtWithin = function(wx, wy, ww, wh, ptx, pty)
{
  return (ptx >= wx-(ww/2) && ptx <= wx+(ww/2) && pty >= wy-(wh/2) && pty <= wy+(wh/2));
}
var worldPtWithinBB = function(bb, ptx, pty)
{
  return (ptx >= bb.wx-(bb.ww/2) && ptx <= bb.wx+(bb.ww/2) && pty >= bb.wy-(bb.wh/2) && pty <= bb.wy+(bb.wh/2));
}

//conversions
var decToHex = function(dec, dig)
{
  var r = "";
  dig--;
  var mod = Math.pow(16,dig);

  var index = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
  for(; dig >= 0; dig--)
  {
    var v = Math.floor(dec/mod);
    r += index[v];
    dec -= Math.pow(16,dig)*v;
    mod /= 16;
  }

  return r;
}

//rgb: {[0,1],[0,1],[0,1]}
//hsv: {[0,360],[0,1],[0,1]}
var RGB2HSV = function(rgb, hsv)
{
  var cmax = Math.max(rgb.r,rgb.g,rgb.b);
  var cmin = Math.min(rgb.r,rgb.g,rgb.b);
  var d = cmax-cmin;
  hsv.v = (cmax+cmin)/2;
  if(hsv.v < 0.5) hsv.s = (cmax-cmin)/(cmax+cmin);
  else            hsv.s = (cmax-cmin)/(2-cmax-cmin);

  if(cmax == rgb.r) hsv.h = (rgb.g-rgb.b)/(cmax-cmin);
  if(cmax == rgb.g) hsv.h = 2 + (rgb.b-rgb.r)/(cmax-cmin);
  if(cmax == rgb.b) hsv.h = 4 + (rgb.r-rgb.g)/(cmax-cmin);
  if(isNaN(hsv.h)) hsv.h = 0;

  hsv.h *= 60;

  if(hsv.h < 0) hsv.h += 360;
}

var HSV2RGBHelperConvertTMPValToFinal = function(tmp_1, tmp_2, val)
{
  if(val*6 < 1) return tmp_2 + (tmp_1-tmp_2)*6*val;
  else if(val*2 < 1) return tmp_1;
  else if(val*3 < 2) return tmp_2 + (tmp_1-tmp_2)*(0.666-val)*6;
  else return tmp_2;
}
var HSV2RGB = function(hsv, rgb)
{
  var tmp_1;
  var tmp_2;
  var tmp_3;

  if(hsv.v < 0.5) tmp_1 = hsv.v * (1+hsv.s);
  else            tmp_1 = hsv.v + hsv.s - (hsv.v*hsv.s);

  tmp_2 = (2*hsv.v)-tmp_1;
  tmp_3 = hsv.h/360;

  rgb.r = tmp_3 + 0.333; while(rgb.r > 1) rgb.r -= 1; while(rgb.r < 0) rgb.r += 1;
  rgb.g = tmp_3;         while(rgb.g > 1) rgb.g -= 1; while(rgb.g < 0) rgb.g += 1;
  rgb.b = tmp_3 - 0.333; while(rgb.b > 1) rgb.b -= 1; while(rgb.b < 0) rgb.b += 1;

  rgb.r = HSV2RGBHelperConvertTMPValToFinal(tmp_1, tmp_2, rgb.r);
  rgb.g = HSV2RGBHelperConvertTMPValToFinal(tmp_1, tmp_2, rgb.g);
  rgb.b = HSV2RGBHelperConvertTMPValToFinal(tmp_1, tmp_2, rgb.b);
}

var RGB2Hex = function(rgb)
{
  return "#"+dec2Hex(Math.floor(rgb.r*255))+dec2Hex(Math.floor(rgb.g*255))+dec2Hex(Math.floor(rgb.b*255));
}
var dec2Hex = function(n)
{
  return n.toString(16);
}

var color_str_to_obj = function(str)
{
  var obj = {r:0,g:0,b:0,h:0,s:0,v:0,a:1};
  if(str[0] == "#")
  {
    obj.r = parseInt(""+str[1]+str[2],16)/255;
    obj.g = parseInt(""+str[3]+str[4],16)/255;
    obj.b = parseInt(""+str[5]+str[6],16)/255;
    obj.a = 1;
    RGB2HSV(obj,obj);
  }
  else if(str[0] == "r")
  {
    var i = 5;
    var j = str.indexOf(",",i);
    obj.r = parseInt(str.substr(i,j-i))/255;
    i = j+1;
    j = str.indexOf(",",i);
    obj.g = parseInt(str.substr(i,j-i))/255;
    i = j+1;
    j = str.indexOf(",",i);
    obj.b = parseInt(str.substr(i,j-i))/255;
    i = j+1;
    j = str.indexOf(")",i);
    obj.a = parseFloat(str.substr(i,j-i));
    RGB2HSV(obj,obj);
  }
  return obj;
}

var cartToPolar = function(cart,polar)
{
  polar.len = Math.sqrt((cart.x*cart.x)+(cart.y*cart.y));
  polar.dir = Math.atan2(cart.y,cart.x);
}
var polarToCart = function(polar,cart)
{
  cart.x = Math.cos(polar.dir)*polar.len;
  cart.y = Math.sin(polar.dir)*polar.len;
}

//camera
var screenSpaceXpt = function(cam, canvas, wx) { return (((( wx)-cam.wx)+(cam.ww/2))/cam.ww)*canvas.width;  } //only operates on points!
var screenSpaceYpt = function(cam, canvas, wy) { return ((((-wy)+cam.wy)+(cam.wh/2))/cam.wh)*canvas.height; } //only operates on points!
var screenSpaceX = function(cam, canvas, ww, wx) { return (((( wx-ww/2)-cam.wx)+(cam.ww/2))/cam.ww)*canvas.width;  }
var screenSpaceY = function(cam, canvas, wh, wy) { return ((((-wy-wh/2)+cam.wy)+(cam.wh/2))/cam.wh)*canvas.height; }
var screenSpaceW = function(cam, canvas, ww) { return (ww/cam.ww)*canvas.width;  }
var screenSpaceH = function(cam, canvas, wh) { return (wh/cam.wh)*canvas.height; }
var screenSpacePt = function(cam, canvas, pt) //only operates on points!
{
  pt.x = (((( pt.wx)-cam.wx)+(cam.ww/2))/cam.ww)*canvas.width;
  pt.y = ((((-pt.wy)+cam.wy)+(cam.wh/2))/cam.wh)*canvas.height;
}
var screenSpaceCoords  = function(cam, canvas, bb) //same as screenSpace, but only updates coords
{
  bb.x = (((( bb.wx-bb.ww/2)-cam.wx)+(cam.ww/2))/cam.ww)*canvas.width;
  bb.y = ((((-bb.wy-bb.wh/2)+cam.wy)+(cam.wh/2))/cam.wh)*canvas.height;
}
var screenSpace  = function(cam, canvas, bb)
{
  //assumng xywh counterparts in world space (wx,wy,ww,wh,etc...)
  //where wx,wy is *center* of bb and cam
  //so cam.wx = 0; cam.ww = 1; would be a cam centered at the origin with visible range from -0.5 to 0.5
  //output xywh assume x,y is top left (ready to be 'blit' via canvas api)
  bb.w = (bb.ww/cam.ww)*canvas.width;
  bb.h = (bb.wh/cam.wh)*canvas.height;
  bb.x = (((( bb.wx-bb.ww/2)-cam.wx)+(cam.ww/2))/cam.ww)*canvas.width;
  bb.y = ((((-bb.wy-bb.wh/2)+cam.wy)+(cam.wh/2))/cam.wh)*canvas.height;
}
var worldSpaceXpt = function(cam, canvas, x) { return ((x/canvas.width) -0.5)* cam.ww + cam.wx; }
var worldSpaceYpt = function(cam, canvas, y) { return ((y/canvas.height)-0.5)*-cam.wh + cam.wy; }
var worldSpaceX = function(cam, canvas, ww, x) { return ((x/canvas.width) -0.5)* cam.ww + cam.wx + ww/2; }
var worldSpaceY = function(cam, canvas, wh, y) { return ((y/canvas.height)-0.5)*-cam.wh + cam.wy - wh/2; }
var worldSpaceW = function(cam, canvas, w) { return (w/canvas.width)*cam.ww; }
var worldSpaceH = function(cam, canvas, h) { return (h/canvas.height)*cam.wh; }
var worldSpacePt = function(cam, canvas, pt) //opposite of screenspace, pt
{
  pt.wx = ((pt.x/canvas.width) -0.5)* cam.ww + cam.wx;
  pt.wy = ((pt.y/canvas.height)-0.5)*-cam.wh + cam.wy;
}
var worldSpaceDoEvt = function(cam, canvas, evt) //opposite of screenspace, doEvt (same as pt, but accesses do[XY])
{
  evt.wx = ((evt.doX/canvas.width) -0.5)* cam.ww + cam.wx;
  evt.wy = ((evt.doY/canvas.height)-0.5)*-cam.wh + cam.wy;
}
var worldSpaceCoords = function(cam, canvas, bb) //opposite of screenspace, doesn't alter w/h (to preserve fp precision)
{
  bb.wx = (((bb.x/canvas.width) -0.5)* cam.ww + cam.wx)+bb.ww/2;
  bb.wy = (((bb.y/canvas.height)-0.5)*-cam.wh + cam.wy)-bb.wh/2;
}
var worldSpace = function(cam, canvas, bb) //opposite of screenspace
{
  bb.ww = (bb.w/canvas.width)*cam.ww;
  bb.wh = (bb.h/canvas.height)*cam.wh;
  bb.wx = (((bb.x/canvas.width) -0.5)* cam.ww + cam.wx)+bb.ww/2;
  bb.wy = (((bb.y/canvas.height)-0.5)*-cam.wh + cam.wy)-bb.wh/2;
}

function lensqr(x,y)
{
  return x*x+y*y;
}
function len(x,y)
{
  return Math.sqrt(x*x+y*y);
}

function vlensqr(v)
{
  return v.x*v.x+v.y*v.y;
}
function vlen(v)
{
  return Math.sqrt(v.x*v.x+v.y*v.y);
}
function vnorm(v)
{
  var lensqr = vlensqr(v);
  var len;
  if(lensqr > 0.00001)
  {
    len = sqrt(lensqr);
    v.x /= len;
    v.y /= len;
  }
}
function vmul(d,v)
{
  v.x *= d;
  v.y *= d;
}
function vdiv(d,v)
{
  v.x /= d;
  v.y /= d;
}
function tldistsqr(a,b)
{
  var x = b.x-a.x;
  var y = b.y-a.y;
  return x*x+y*y;
}
function tldist(a,b)
{
  var x = b.x-a.x;
  var y = b.y-a.y;
  return Math.sqrt(x*x+y*y);
}
function odistsqr(a,b)
{
  var x = (b.x+b.w/2)-(a.x+a.w/2);
  var y = (b.y+b.h/2)-(a.y+a.h/2);
  return x*x+y*y;
}
function odist(a,b)
{
  var x = (b.x+b.w/2)-(a.x+a.w/2);
  var y = (b.y+b.h/2)-(a.y+a.h/2);
  return Math.sqrt(x*x+y*y);
}
function wdistsqr(a,b)
{
  var x = b.wx-a.wx;
  var y = b.wy-a.wy;
  return x*x+y*y;
}
function wdist(a,b)
{
  var x = b.wx-a.wx;
  var y = b.wy-a.wy;
  return Math.sqrt(x*x+y*y);
}

var GenIcon = function(w,h)
{
  var icon = document.createElement('canvas');
  icon.width = w || 10;
  icon.height = h || 10;
  icon.context = icon.getContext('2d');

  return icon;
}

var GenImg = function(src)
{
  var img = new Image();
  img.src = src;
  return img;
}

var GenAudio = function(src)
{
  var aud = new Audio();
  aud.src = src;
  aud.load();
  return aud;
}

var AudWrangler = function()
{
  var self = this;

  self.ctx;

  self.aud_src = [];
  self.aud_data = [];
  self.aud_buffer = [];
  self.auds_loaded = 0;

  self.music_src = 0;
  self.music_data = 0;
  self.music_buffer = 0;
  self.music_track = 0;
  self.music_shouldbeplaying = 0;

  self.held = 0;
  self.initd = 0;

  self.hold = function()
  {
    if(self.initd) return; //doesn't matter
    if(self.held) return; //already done
    self.held = 1;
    self.unregisterevt();
  }
  self.unhold = function()
  {
    if(self.initd) return; //doesn't matter
    if(!self.held) return; //already done
    self.held = 0;
    self.registerevt();
  }

  var evtpkg = {capture:true,once:false,passive:false};
  self.registerevt = function()
  {
         if(platform == PLATFORM_PC)     document.getElementById("stage_container").addEventListener('click',    self.init, evtpkg);
    else if(platform == PLATFORM_MOBILE) document.getElementById("stage_container").addEventListener('touchend', self.init, evtpkg);
  }

  self.unregisterevt = function()
  {
         if(platform == PLATFORM_PC)     document.getElementById("stage_container").removeEventListener('click',    self.init, evtpkg);
    else if(platform == PLATFORM_MOBILE) document.getElementById("stage_container").removeEventListener('touchend', self.init, evtpkg);
  }

  self.init = function() //must be called by click on ios!
  {
    if(!self.ctx)
    {
      if(window.AudioContext) self.ctx = new AudioContext();
      else if(window.webkitAudioContext) self.ctx = new webkitAudioContext();
    }
    var all_ready = 1;
    for(var i = 0; i < self.aud_src.length; i++)
    {
      if(self.aud_data[i] && !self.aud_buffer[i])
      {
        (function(i){self.ctx.decodeAudioData(self.aud_data[i], function(b){ self.aud_buffer[i] = b; },
        function(e){ console.log("Error with decoding audio data" + e.err); });
        })(i);
        self.aud_data[i] = 0;
      }
      if(!self.aud_buffer[i]) all_ready = 0;
    }
    if(self.music_data && !self.music_buffer)
    {
      self.ctx.decodeAudioData(self.music_data, function(b){ self.music_buffer = b; if(self.music_shouldbeplaying) self.play_music(); },
      function(e){ console.log("Error with decoding music data" + e.err); });
      self.music_data = 0;
      if(!self.music_buffer) all_ready = 0;
    }
    if(all_ready)
    {
      self.unregisterevt();
      self.initd = 1;
    }
  }

  self.register = function(src)
  {
    var i = self.aud_src.length;

    self.aud_src[i] = src;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      xhr.onload = 0;
      self.aud_data[i] = xhr.response;
      if(self.ctx)
      {
        self.ctx.decodeAudioData(self.aud_data[i], function(b){ self.aud_buffer[i] = b; self.auds_loaded++; },
        function(e){ console.log("Error with decoding audio data" + e.err); });
        self.aud_data[i] = 0;
      }
    };
    xhr.send();

    return i;
  }

  self.play = function(i)
  {
    if(self.ctx && self.ctx.state === 'suspended') self.ctx.resume();
    if(self.ctx && self.aud_buffer[i])
    {
      var track;
      track = self.ctx.createBufferSource();
      track.buffer = self.aud_buffer[i];
      track.connect(self.ctx.destination);
      track.start(0);
    }
  }

  self.register_music = function(src)
  {
    self.music_src = src;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
      xhr.onload = 0;
      self.music_data = xhr.response;
      if(self.ctx)
      {
        self.ctx.decodeAudioData(self.music_data, function(b){ self.music_buffer = b; if(self.music_shouldbeplaying) self.play_music(); },
        function(e){ console.log("Error with decoding music data" + e.err); });
        self.music_data = 0;
      }
    };
    xhr.send();

    return i;
  }
  self.play_music = function()
  {
    self.music_shouldbeplaying = 1;
    if(self.ctx && self.ctx.state === 'suspended') self.ctx.resume();
    if(self.ctx && self.music_buffer)
    {
      self.music_track = self.ctx.createBufferSource();
      self.music_track.buffer = self.music_buffer;
      self.music_track.connect(self.ctx.destination);
      self.music_track.loop = true;
      self.music_track.start(0);
    }
  }
  self.stop_music = function()
  {
    self.music_shouldbeplaying = 0;
    if(self.music_track) self.music_track.stop();
    self.music_track = 0;
  }

  self.registerevt();
}

var ClipWrangler = function()
{
  var self = this;
  self.ctx;
  self.enabled = 1;

  var flip_clips = [];
  var flip_bb_x = 0;
  var flip_bb_y = 0;
  var flip_bb_w = 0;
  var flip_bb_h = 0;
  self.n_flip_clips = 0;

  var flop_clips = [];
  var flop_bb_x = 0;
  var flop_bb_y = 0;
  var flop_bb_w = 0;
  var flop_bb_h = 0;
  self.n_flop_clips = 0;

  self.bb_x = 0;
  self.bb_y = 0;
  self.bb_w = 0;
  self.bb_h = 0;

  var flip_flop = 0;

  for(var i = 0; i < 100; i++)
  {
    flip_clips[i+0] = 0;
    flip_clips[i+1] = 0;
    flip_clips[i+2] = 0;
    flip_clips[i+3] = 0;
  }
  for(var i = 0; i < 100; i++)
  {
    flop_clips[i+0] = 0;
    flop_clips[i+1] = 0;
    flop_clips[i+2] = 0;
    flop_clips[i+3] = 0;
  }

  var index;

  self.hijack_clip_bb = function(offx,offy,maxx,maxy,clip,ctx)
  {
    //if(floor(offx) != offx || floor(offy) != offy)
      //console.log(offx,offy);
    ctx.save();
    ctx.beginPath();
    if(self.n_flip_clips+self.n_flop_clips)
    {
      var x = self.bb_x+offx;
      var y = self.bb_y+offy;
      var w = self.bb_w+1;
      var h = self.bb_h+1;
      if(x < 0) { w += x; x = 0; }
      if(y < 0) { h += y; y = 0; }
      if(x+w > maxx) w -= x+w-maxx;
      if(y+h > maxy) h -= y+h-maxy;
      ctx.rect(x,y,w,h);
      if(clip) ctx.clip();
    }
  }
  if(noclip) self.hijack_clip_bb = noop;

  self.hijack_clip = function(offx,offy,maxx,maxy,clip,ctx)
  {
    //if(floor(offx) != offx || floor(offy) != offy)
      //console.log(offx,offy);
    ctx.save();
    ctx.beginPath();
    var x;
    var y;
    var w;
    var h;
    for(var i = 0; i < self.n_flip_clips; i++)
    {
      index = i*4;
      x = flip_clips[index+0]+offx;
      y = flip_clips[index+1]+offy;
      w = flip_clips[index+2];
      h = flip_clips[index+3];
      if(x < 0) { w += x; x = 0; }
      if(y < 0) { h += y; y = 0; }
      if(x+w > maxx) w -= x+w-maxx;
      if(y+h > maxy) h -= y+h-maxy;
      ctx.rect(x,y,w,h);
    }
    for(var i = 0; i < self.n_flop_clips; i++)
    {
      index = i*4;
      x = flop_clips[index+0]+offx;
      y = flop_clips[index+1]+offy;
      w = flop_clips[index+2];
      h = flop_clips[index+3];
      if(x < 0) { w += x; x = 0; }
      if(y < 0) { h += y; y = 0; }
      if(x+w > maxx) w -= x+w-maxx;
      if(y+h > maxy) h -= y+h-maxy;
      ctx.rect(x,y,w,h);
    }
    if(clip) ctx.clip();
  }
  if(noclip) self.hijack_clip = noop;

  self.hijack_unclip = function(ctx)
  {
    ctx.restore();
  }
  if(noclip) self.hijack_unclip = noop;

  self.clip_bb = function()
  {
    if(!self.enabled) return;
    self.ctx.save();
    self.ctx.beginPath();
    if(self.n_flip_clips+self.n_flop_clips)
    self.ctx.rect(self.bb_x, self.bb_y, self.bb_w, self.bb_h);
    self.ctx.clip();
  }
  if(noclip) self.clip_bb = noop;

  self.clip = function()
  {
    if(!self.enabled) return;
    self.ctx.save();
    self.ctx.beginPath();
    for(var i = 0; i < self.n_flip_clips; i++)
    {
      index = i*4;
      self.ctx.rect(flip_clips[index+0],flip_clips[index+1],flip_clips[index+2],flip_clips[index+3]);
    }
    for(var i = 0; i < self.n_flop_clips; i++)
    {
      index = i*4;
      self.ctx.rect(flop_clips[index+0],flop_clips[index+1],flop_clips[index+2],flop_clips[index+3]);
    }
    self.ctx.clip();
  }
  if(noclip) self.clip = noop;

  self.unclip = function()
  {
    if(!self.enabled) return;
    self.hijack_unclip(self.ctx);
  }
  if(noclip) self.unclip = noop;

  self.debug = function()
  {
    self.ctx.save();
    if(flip_flop)
    {
      console.log(self.n_flip_clips);
      self.ctx.lineWidth = 2;
      self.ctx.strokeStyle = "#FF0000";
      for(var i = 0; i < self.n_flop_clips; i++)
      {
        index = i*4;
        self.ctx.strokeRect(flop_clips[index+0],flop_clips[index+1],flop_clips[index+2],flop_clips[index+3]);
      }
      self.ctx.lineWidth = 0.5;
      self.ctx.strokeStyle = "#00FF00";
      for(var i = 0; i < self.n_flip_clips; i++)
      {
        index = i*4;
        self.ctx.strokeRect(flip_clips[index+0],flip_clips[index+1],flip_clips[index+2],flip_clips[index+3]);
      }
    }
    else
    {
      console.log(self.n_flop_clips);
      self.ctx.lineWidth = 2;
      self.ctx.strokeStyle = "#FF0000";
      for(var i = 0; i < self.n_flip_clips; i++)
      {
        index = i*4;
        self.ctx.strokeRect(flip_clips[index+0],flip_clips[index+1],flip_clips[index+2],flip_clips[index+3]);
      }
      self.ctx.lineWidth = 0.5;
      self.ctx.strokeStyle = "#00FF00";
      for(var i = 0; i < self.n_flop_clips; i++)
      {
        index = i*4;
        self.ctx.strokeRect(flop_clips[index+0],flop_clips[index+1],flop_clips[index+2],flop_clips[index+3]);
      }
    }
    if(self.n_flip_clips+self.n_flop_clips)
    self.ctx.strokeRect(self.bb_x,self.bb_y,self.bb_w,self.bb_h);
    else
    self.ctx.strokeRect(10,10,10,10);
    self.ctx.restore();
  }
  if(noclip) self.debug = noop;

  self.register = function(x,y,w,h)
  {
    //if(floor(x) != x || floor(y) != y || floor(w) != w || floor(h) != h)
      //console.log(x,y,w,h);
    if(flip_flop)
    {
      if(!self.n_flip_clips)
      {
        flip_bb_x = x;
        flip_bb_y = y;
        flip_bb_w = w;
        flip_bb_h = h;
      }
      else
      {
        flip_bb_w += flip_bb_x;
        flip_bb_h += flip_bb_y;
        flip_bb_x = min(x,flip_bb_x);
        flip_bb_y = min(y,flip_bb_y);
        flip_bb_w = max(x+w,flip_bb_w)-flip_bb_x;
        flip_bb_h = max(y+h,flip_bb_h)-flip_bb_y;
      }

      index = self.n_flip_clips*4;
      flip_clips[index+0] = x;
      flip_clips[index+1] = y;
      flip_clips[index+2] = w;
      flip_clips[index+3] = h;
      self.n_flip_clips++;
    }
    else
    {
      if(!self.n_flop_clips)
      {
        flop_bb_x = x;
        flop_bb_y = y;
        flop_bb_w = w;
        flop_bb_h = h;
      }
      else
      {
        flop_bb_w += flop_bb_x;
        flop_bb_h += flop_bb_y;
        flop_bb_x = min(x,flop_bb_x);
        flop_bb_y = min(y,flop_bb_y);
        flop_bb_w = max(x+w,flop_bb_w)-flop_bb_x;
        flop_bb_h = max(y+h,flop_bb_h)-flop_bb_y;
      }

      index = self.n_flop_clips*4;
      flop_clips[index+0] = x;
      flop_clips[index+1] = y;
      flop_clips[index+2] = w;
      flop_clips[index+3] = h;
      self.n_flop_clips++;
    }
  }
  if(noclip) self.register = noop;

  self.safe_register = function(x,y,w,h)
  {
    var nx = floor(x);
    var ny = floor(y);
    w = ceil(w+nx-x);
    h = ceil(h+ny-y);
    if(x < 0) { w += x; x = 0; }
    if(y < 0) { h += y; y = 0; }
    self.register(x,y,w,h);
  }
  if(noclip) self.safe_register = noop;

  self.get_bb = function()
  {
    if(!self.n_flop_clips)
    {
      self.bb_x = flip_bb_x;
      self.bb_y = flip_bb_y;
      self.bb_w = flip_bb_w;
      self.bb_h = flip_bb_h;
    }
    else if(!self.n_flip_clips)
    {
      self.bb_x = flop_bb_x;
      self.bb_y = flop_bb_y;
      self.bb_w = flop_bb_w;
      self.bb_h = flop_bb_h;
    }
    else
    {
      self.bb_x = min(flip_bb_x,flop_bb_x);
      self.bb_y = min(flip_bb_y,flop_bb_y);
      self.bb_w = max(flip_bb_x+flip_bb_w,flop_bb_x+flop_bb_w)-self.bb_x;
      self.bb_h = max(flip_bb_y+flip_bb_h,flop_bb_y+flop_bb_h)-self.bb_y;
    }
  }
  if(noclip) self.get_bb = noop;

  self.flip = function()
  {
    if(flip_flop)
      self.n_flop_clips = 0;
    else
      self.n_flip_clips = 0;
    flip_flop = !flip_flop;
  }
  if(noclip) self.flip = noop;

}

function drawArrow(sx,sy,ex,ey,w,ctx)
{
  var dx = ex-sx;
  var dy = ey-sy;
  var dd = Math.sqrt(dx*dx+dy*dy);
  var ox = (-dy/dd)*w;
  var oy = (dx/dd)*w;
  ctx.beginPath();
  ctx.moveTo(sx,sy);
  ctx.lineTo(ex,ey);
  ctx.moveTo(sx+(dx/dd*(dd-w))+ox,sy+(dy/dd*(dd-w))+oy);
  ctx.lineTo(ex,ey);
  ctx.lineTo(sx+(dx/dd*(dd-w))-ox,sy+(dy/dd*(dd-w))-oy);
  ctx.closePath();
  ctx.stroke();
}

function drawAroundDecimal(x,y,val,prepend,append,ctx)
{
  var macro = floor(val);
  var vstring = val+"";
  var micro = vstring.substring(vstring.indexOf(".")+1);
  ctx.textAlign = "right";
  ctx.fillText(prepend+macro+".",x,y);
  ctx.textAlign = "left";
  ctx.fillText(micro+append,x,y);
}

var space = function(minv,maxv,obv,nobs,obi)
{
  var w = maxv-minv;
  var pad = (w-(nobs*obv))/(nobs+1);
  return minv+pad+(obv+pad)*obi;
}

var textToLines = function(font, width, text, ctx)
{
  var lines = [];
  var found = 0;
  var searched = 0;
  var tentative_search = 0;

  ctx.save();
  ctx.font = font;

  while(found < text.length)
  {
    searched = text.indexOf(" ",found);
    if(searched == -1) searched = text.length;
    tentative_search = text.indexOf(" ",searched+1);
    if(tentative_search == -1) tentative_search = text.length;
    while(ctx.measureText(text.substring(found,tentative_search)).width < width && searched != text.length)
    {
      searched = tentative_search;
      tentative_search = text.indexOf(" ",searched+1);
      if(tentative_search == -1) tentative_search = text.length;
    }
    if(text.substring(searched, searched+1) == " ") searched++;
    lines.push(text.substring(found,searched));
    found = searched;
  }

  ctx.restore();
  return lines;
}

var drawOutlineText = function(txt,x,y,b,color,ctx)
{
  ctx.fillStyle = color;
  ctx.fillText(txt,x-b,y-b);
  ctx.fillText(txt,x+b,y-b);
  ctx.fillText(txt,x-b,y+b);
  ctx.fillText(txt,x+b,y+b);
  ctx.fillText(txt,x-b,y  );
  ctx.fillText(txt,x+b,y  );
  ctx.fillText(txt,x  ,y+b);
  ctx.fillText(txt,x  ,y-b);
}

var drawFullOutlineText = function(txt,x,y,b,co,ci,r,ctx)
{
  if(r) { x = round(x); y = round(y); }
  if(co)
  {
    ctx.fillStyle = co;
    var n = 16;
    for(var i = 0; i < n; i++)
      ctx.fillText(txt,x-b*cos(i/n*twopi),y-b*sin(i/n*twopi));
  }

  if(ci)
  {
    ctx.fillStyle = ci;
    ctx.fillText(txt,x,y);
  }
}

var drawLine = function(ax,ay,bx,by,ctx)
{
  ctx.beginPath();
  ctx.moveTo(ax,ay);
  ctx.lineTo(bx,by);
  ctx.stroke();
}

var drawGrid = function(center_x, center_y, unit_x, unit_y, w, h, ctx)
{
  var t;
  var x;
  var y;

  t = center_x;
  x = lerp(0,w,t);
  while(t < 1)
  {
    drawLine(x,0,x,h,ctx);
    x += unit_x;
    t = invlerp(0,w,x);
  }
  t = center_x;
  x = lerp(0,w,t);
  while(t > 0)
  {
    drawLine(x,0,x,h,ctx);
    x -= unit_x;
    t = invlerp(0,w,x);
  }

  t = center_y;
  y = lerp(0,h);
  while(t < 1)
  {
    drawLine(0,y,w,y,ctx);
    y += unit_y;
    t = invlerp(0,h);
  }
  t = center_y;
  y = lerp(0,h);
  while(t > 0)
  {
    drawLine(0,y,w,y,ctx);
    y -= unit_y;
    t = invlerp(0,h);
  }
}

var textVCenterOff = function(txt,font,off,canvas)
{
  var w = canvas.width;
  var h = canvas.height;
  canvas.context.fillStyle = white;
  canvas.context.fillRect(0,0,w,h);
  canvas.context.font = font;
  canvas.context.fillStyle = black;
  canvas.context.textAlign = "center";
  var y = floor(h*off);
  canvas.context.fillText(txt,w/2,y);
  var data = canvas.context.getImageData(0,0,w,h);
  var early_y = h-1;
  var late_y = 0;
  data = data.data;
  for(var i = 0;       i < w*h*4; i++) if(data[i] != 255) { early_y = floor(i/(4*w)); break; }
  for(var i = w*h*4-1; i >= 0;    i--) if(data[i] != 255) { late_y  = floor(i/(4*w)); break; }
  var h = late_y-early_y;
  return y-(late_y-h/2);
}


//vector
var addvec = function(a,b,r)
{
  r.x = a.x+b.x;
  r.y = a.y+b.y;
}
var subvec = function(a,b,r)
{
  r.x = a.x-b.x;
  r.y = a.y-b.y;
}
var mulvec = function(a,m,r)
{
  r.x = a.x*m;
  r.y = a.y*m;
}
var lensqrvec = function(a)
{
  return (a.x*a.x)+(a.y*a.y);
}
var lenvec = function(a)
{
  return sqrt((a.x*a.x)+(a.y*a.y));
}
var normvec = function(a,r)
{
  var l = sqrt((a.x*a.x)+(a.y*a.y));
  r.x = a.x/l;
  r.y = a.y/l;
}
var safenormvec = function(a,m,r)
{
  var l = sqrt((a.x*a.x)+(a.y*a.y));
  if(l != 0)
  {
    r.x = a.x/l;
    r.y = a.y/l;
  }
  else
  {
    r.x = m;
    r.y = 0;
  }
}
var avevec = function(a,b,r)
{
  r.x = (a.x+b.x)/2.;
  r.y = (a.y+b.y)/2.;
}

var atlas = function()
{
  var self = this;

  //used to (naively!) keep track of where new sprites go
  self.x = 0;
  self.y = 0;
  self.row_h = 0;
  //dimensions of whole atlas
  self.w = 0;
  self.h = 0;
  //target of current sprite
  self.ex = 0;
  self.ey = 0;

  self.imgs = [];
  self.pimgs = [];
  self.context = 0;
  self.n_sprites = 0;
  self.sprite_meta = []; //n,x,y,w,h,inx,iny,inw,inh
  self.sprite_meta_n = 9;

  self.debug = urlp.debug;
  self.debug = 0;

  self.init = function(w,h)
  {
    self.w = w;
    self.h = h;
    self.nextAtlas();
  }
  self.img_onload = function()
  {
    for(var i = 0; i < self.pimgs.length; i++)
    {
      var pimg = self.pimgs[i];
      if(pimg && pimg.naturalWidth != 0)
      {
        var img = self.imgs[i];
        pimg.onload = 0;
        //HACK TO APPEASE APPLE BUG
        img.width = 0; img.height = 0;
        if(self.context == img.context) self.context = 0;
        img = 0;
        self.imgs[i] = pimg;
        self.pimgs[i] = 0;
      }
    }
  }
  self.commit = function()
  {
    for(var i = 0; i < self.imgs.length; i++)
    {
      var img = self.imgs[i];
      if(img.tagName == "CANVAS" && !self.pimgs[i])
        self.commiti(i);
    }
  }
  self.commiti = function(i)
  {
    self.pimgs[i] = new Image();
    self.pimgs[i].onload = self.img_onload;
    self.pimgs[i].src = self.imgs[i].toDataURL("image/png");
  }
  self.nextAtlas = function()
  {
    if(self.imgs.length) self.commiti(self.imgs.length-1);
    var i = self.imgs.length;
    self.imgs[i] = GenIcon(self.w,self.h);
    self.x = 0;
    self.y = 0;
    self.row_h = 0;
    self.context = self.imgs[i].context;
    self.context.fillStyle = "#00FF00";
    if(self.debug) self.context.fillRect(0,0,self.w,self.h);
  }
  self.destroy = function()
  {
    for(var i = 0; i < self.pimgs.length; i++)
    {
      var pimg = self.pimgs[i];
      if(pimg)
      {
        pimg.onload = 0;
        self.pimgs[i] = 0;
      }
    }
    for(var i = 0; i < self.imgs.length; i++)
    {
      var img = self.imgs[i];
      if(img.tagName == "CANVAS")
      {
        img.width = 0;
        img.height = 0;
        self.imgs[i] = 0;
      }
    }
    self.context = 0;
  }

  self.sprite_w = function(i)
  {
    return self.sprite_meta[self.sprite_meta_n*i+3];
  }
  self.sprite_h = function(i)
  {
    return self.sprite_meta[self.sprite_meta_n*i+4];
  }

  self.editSprite = function(i)
  {
    var index = self.sprite_meta_n*i;
    self.ex += self.sprite_meta[index+1]-self.sprite_meta[index+5];
    self.ey += self.sprite_meta[index+2]-self.sprite_meta[index+6];
    self.context.save();
    self.context.beginPath();
    self.context.rect(self.sprite_meta[index+1],self.sprite_meta[index+2],self.sprite_meta[index+7],self.sprite_meta[index+8]);
    self.context.clip();
    //self.context.translate(self.sprite_meta[index+1]-self.sprite_meta[index+5],self.sprite_meta[index+2]-self.sprite_meta[index+6]);
  }
  self.commitSprite = function()
  {
    self.ex = 0;
    self.ey = 0;
    self.context.restore();
    //self.context.resetTransform();
  }
  self.getWholeSprite = function(x,y,w,h)
  {
    var i = self.n_sprites;
    self.n_sprites++;
    var index = self.sprite_meta_n*i;
    self.sprite_meta[index+0] = self.imgs.length-1;
    self.sprite_meta[index+1] = x;
    self.sprite_meta[index+2] = y;
    self.sprite_meta[index+3] = w;
    self.sprite_meta[index+4] = h;
    self.sprite_meta[index+5] = 0;
    self.sprite_meta[index+6] = 0;
    self.sprite_meta[index+7] = w;
    self.sprite_meta[index+8] = h;
    self.context.clearRect(x,y,w,h);
    if(self.debug) self.context.strokeRect(x,y,w,h);
    self.editSprite(i);
    return i;
  }
  self.getPartSprite = function(x,y,w,h,inx,iny,inw,inh)
  {
    var i = self.n_sprites;
    self.n_sprites++;
    var index = self.sprite_meta_n*i;
    self.sprite_meta[index+0] = self.imgs.length-1;
    self.sprite_meta[index+1] = x;
    self.sprite_meta[index+2] = y;
    self.sprite_meta[index+3] = w;
    self.sprite_meta[index+4] = h;
    self.sprite_meta[index+5] = inx;
    self.sprite_meta[index+6] = iny;
    self.sprite_meta[index+7] = inw;
    self.sprite_meta[index+8] = inh;
    self.context.clearRect(x,y,inw,inh);
    if(self.debug) self.context.strokeRect(x,y,inw,inh);
    self.editSprite(i);
    return i;
  }
  self.collideWholeSprite = function(x,y,w,h)
  {
    var index = 0;
    if(x+w > self.w) return 1;
    for(var i = 0; i < self.n_sprites; i++)
    {
      index = self.sprite_meta_n*i;
      if(self.sprite_meta[index+0] != self.imgs.length-1) continue;
      var sx = self.sprite_meta[index+1];
      var sy = self.sprite_meta[index+2];
      var sw = self.sprite_meta[index+7];
      var sh = self.sprite_meta[index+8];
      if(sx < x+w && x < sx+sw && sy < y+h && y < sy+sh) return 1;
    }
    return 0;
  }
  self.nextRow = function()
  {
    self.x = 0;
    self.y += self.row_h;
    self.row_h = 0;
  }
  self.nextWholeSprite = function(w,h)
  {
    w = ceil(w);
    h = ceil(h);
    if(self.x+w > self.w) self.nextRow();
    if(self.y+h > self.h) self.nextAtlas();
    if(h > self.row_h) self.row_h = h;
    var i = self.getWholeSprite(self.x,self.y,w,h);
    self.x += w;
    return i;
  }
  self.nextPartSprite = function(w,h,inx,iny,inw,inh)
  {
    w = ceil(w);
    h = ceil(h);
    inx = floor(inx);
    iny = floor(iny);
    inw = ceil(inw);
    inh = ceil(inh);
    if(self.x+inw > self.w) self.nextRow();
    if(self.y+inh > self.h) self.nextAtlas();
    if(inh > self.row_h) self.row_h = inh;
    var i = self.getPartSprite(self.x,self.y,w,h,inx,iny,inw,inh);
    self.x += inw;
    return i;
  }
  self.fitWholeSprite = function(w,h)
  {
    w = ceil(w);
    h = ceil(h);

    var sx;
    var sy;
    var sw;
    var sh;

    var x;
    var y;

    var best_i = -1;
    var best_y = 99999999;
    var best_x = 99999999;
    var best_mode = 0;

    var index = 0;
    for(var i = 0; i < self.n_sprites; i++)
    {
      index = self.sprite_meta_n*i;
      if(self.sprite_meta[index+0] != self.imgs.length-1) continue;
      sx = self.sprite_meta[index+1];
      sy = self.sprite_meta[index+2];
      sw = self.sprite_meta[index+7];
      sh = self.sprite_meta[index+8];
      x = sx+sw;
      y = sy;
      if((y < best_y || (y == best_y && x < best_x)) && !self.collideWholeSprite(x,y,w,h))
      {
        best_i = i;
        best_y = y;
        best_x = x;
        best_mode = 0;
      }
      x = sx;
      y = sy+sh;
      if((y < best_y || (y == best_y && x < best_x)) && !self.collideWholeSprite(x,y,w,h))
      {
        best_i = i;
        best_y = y;
        best_x = x;
        best_mode = 1;
      }
    }

    if(best_i > -1)
    {
      index = self.sprite_meta_n*best_i;
      sx = self.sprite_meta[index+1];
      sy = self.sprite_meta[index+2];
      sw = self.sprite_meta[index+7];
      sh = self.sprite_meta[index+8];
      switch(best_mode)
      {
        case 0:
          x = sx+sw;
          y = sy;
          break;
        case 1:
          x = sx;
          y = sy+sh;
          break;
      }

      if(y+h > self.y+self.row_h)
      {
        if(x == 0) //new row
        {
          self.nextRow();
          self.x = w;
          self.row_h = h;
        }
        else //extend current row
          self.row_h = y+h-self.y;
      }
      if(y+h > self.y && x+w > self.x) self.x = x+w;
      if(y+h > self.h) { self.nextAtlas(); x = 0; y = 0; }
      return self.getWholeSprite(x,y,w,h);
    }

    return self.nextWholeSprite(w,h);
  }
  self.fitPartSprite = function(w,h,inx,iny,inw,inh)
  {
    w = ceil(w);
    h = ceil(h);
    inx = floor(inx);
    iny = floor(iny);
    inw = ceil(inw);
    inh = ceil(inh);

    var sx;
    var sy;
    var sw;
    var sh;

    var x;
    var y;

    var best_i = -1;
    var best_y = 99999999;
    var best_mode = 0;

    var index = 0;
    for(var i = 0; i < self.n_sprites; i++)
    {
      index = self.sprite_meta_n*i;
      if(self.sprite_meta[index+0] != self.imgs.length-1) continue;
      sx = self.sprite_meta[index+1];
      sy = self.sprite_meta[index+2];
      sw = self.sprite_meta[index+7];
      sh = self.sprite_meta[index+8];
      x = sx+sw;
      y = sy;
      if(y < best_y && !self.collideWholeSprite(x,y,inw,inh))
      {
        best_i = i;
        best_y = y;
        best_mode = 0;
      }
      x = sx;
      y = sy+sh;
      if(y < best_y && !self.collideWholeSprite(x,y,inw,inh))
      {
        best_i = i;
        best_y = y;
        best_mode = 1;
      }
    }

    if(best_i > -1)
    {
      index = self.sprite_meta_n*best_i;
      sx = self.sprite_meta[index+1];
      sy = self.sprite_meta[index+2];
      sw = self.sprite_meta[index+7];
      sh = self.sprite_meta[index+8];
      switch(best_mode)
      {
        case 0:
          x = sx+sw;
          y = sy;
          break;
        case 1:
          x = sx;
          y = sy+sh;
          break;
      }

      if(y+inh > self.y+self.row_h)
      {
        if(x == 0) //new row
        {
          self.nextRow();
          self.x = inw;
          self.row_h = inh;
        }
        else //extend current row
          self.row_h = y+inh-self.y;
      }
      if(y+inh > self.y && x+inw > self.x) self.x = x+inw;
      if(y+inh > self.h) { self.nextAtlas(); x = 0; y = 0; }
      return self.getPartSprite(x,y,w,h,inx,iny,inw,inh);
    }

    return self.nextPartSprite(w,h,inx,iny,inw,inh);
  }

  self.drawWholeSprite = function(i,x,y,w,h,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],self.sprite_meta[index+3],self.sprite_meta[index+4],x,y,w,h);
  }
  self.drawPartSprite = function(i,x,y,w,h,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var ws = self.sprite_meta[index+3]/w;
    var hs = self.sprite_meta[index+4]/h;
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],self.sprite_meta[index+7],self.sprite_meta[index+8],x+self.sprite_meta[index+5]*ws,y+self.sprite_meta[index+6]*hs,self.sprite_meta[index+7]*ws,self.sprite_meta[index+8]*hs);
  }

  self.blitWholeSprite = function(i,x,y,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var w = self.sprite_meta[index+3];
    var h = self.sprite_meta[index+4];
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],w,h,x,y,w,h);
  }
  self.blitPartSprite = function(i,x,y,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var inw = self.sprite_meta[index+7];
    var inh = self.sprite_meta[index+8];
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],inw,inh,x+self.sprite_meta[index+5],y+self.sprite_meta[index+6],inw,inh);
  }
  self.blitWholeSpriteCentered = function(i,x,y,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var w = self.sprite_meta[index+3];
    var h = self.sprite_meta[index+4];
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],w,h,floor(x-w/2),floor(y-h/2),w,h);
  }
  self.blitWholeSpriteCenteredOnBoard = function(i,x,y,bw,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var w = self.sprite_meta[index+3];
    var h = self.sprite_meta[index+4];
    x = floor(x-w/2);
    y = floor(y-h/2);
    if(x+w > bw) x -= (x+w)-bw;
    if(x < 0) x = 0;
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],w,h,x,y,w,h);
  }
  self.blitPartSpriteCentered = function(i,x,y,ctx)
  {
    var index = self.sprite_meta_n*i;
    var n = self.sprite_meta[index+0];
    if(!n) n = 0;
    var inw = self.sprite_meta[index+7];
    var inh = self.sprite_meta[index+8];
    var w = self.sprite_meta[index+3];
    var h = self.sprite_meta[index+4];
    ctx.drawImage(self.imgs[n],self.sprite_meta[index+1],self.sprite_meta[index+2],inw,inh,floor(x-w/2+self.sprite_meta[index+5]),floor(y-h/2+self.sprite_meta[index+6]),inw,inh);
  }
}

var bounce = function(target,v,vel,pull,drag,safe)
{
  var self = this;

  self.target = 0;
  self.v = 0;
  self.vel = 0;
  self.pull = 0.1;
  self.drag = 0.1;
  self.safe = 0.1;

  if(target) self.target = target;
  if(v)      self.v = v;
  if(vel)    self.vel = vel;
  if(pull)   self.pull = pull;
  if(drag)   self.drag = drag;
  if(safe)   self.safe = safe;

  self.tick = function()
  {
    if(abs(self.vel) < self.safe && abs(self.v-self.target) < self.safe)
      self.v = lerp(self.v,self.target,0.1);
    else
    {
      self.vel = (self.vel+(self.target-self.v)*self.pull)*(1-self.drag);
      self.v += self.vel;
    }
  }
}
var bounce2 = function(targetx,targety,vx,vy,velx,vely,pull,drag)
{
  var self = this;

  self.targetx = 0;
  self.targety = 0;
  self.vx = 0;
  self.vy = 0;
  self.velx = 0;
  self.vely = 0;
  self.pull = 0.1;
  self.drag = 0.1;

  if(targetx) self.targetx = targetx;
  if(targety) self.targety = targety;
  if(vx)      self.vx = vx;
  if(vy)      self.vy = vy;
  if(velx)    self.velx = velx;
  if(vely)    self.vely = vely;
  if(pull)    self.pull = pull;
  if(drag)    self.drag = drag;

  self.tick = function()
  {
    self.velx = (self.velx+(self.targetx-self.vx)*self.pull)*(1-self.drag);
    self.vx += self.velx;
    self.vely = (self.vely+(self.targety-self.vy)*self.pull)*(1-self.drag);
    self.vy += self.vely;
  }
}

function drawCanvMaskedImage(image,x,y,w,h,canvas,ctx)
{
  var srcx = 0;
  var srcy = 0;
  var srcw = image.width;
  var srch = image.height;
  var p;
  if(x < 0)
  {
    p = (-x/w)*srcw;
    srcx = p;
    srcw -= p;
    w += x;
    x = 0;
  }
  if(y < 0)
  {
    p = (-y/h)*srch;
    srcy = p;
    srch -= p;
    h += y;
    y = 0;
  }
  if(x+w > canvas.width)
  {
    p = (canvas.width-x)/w;
    w = canvas.width-x;
    srcw *= p;
  }
  if(y+h > canvas.height)
  {
    p = (canvas.height-y)/h;
    h = canvas.height-y;
    srch *= p;
  }
  ctx.drawImage(image,srcx,srcy,srcw,srch,x,y,w,h);
}
function drawImageCentered(image,x,y,w,h,ctx)
{
  ctx.drawImage(image,x-w/2,y-h/2,w,h);
}
function drawImageWidth(image,x,y,w,ctx)
{
  var h = image.height*w/image.width;
  ctx.drawImage(image,x,y,w,h);
}
function drawImageHeight(image,x,y,h,ctx)
{
  var w = image.width*h/image.height;
  ctx.drawImage(image,x,y,w,h);
}
function drawImageWidthCentered(image,x,y,w,ctx)
{
  var h = image.height*w/image.width;
  ctx.drawImage(image,x-w/2,y-h/2,w,h);
}
function drawImageHeightCentered(image,x,y,h,ctx)
{
  var w = image.width*h/image.height;
  ctx.drawImage(image,x-w/2,y-h/2,w,h);
}
function drawImageBB(image,bb,ctx)
{
  ctx.drawImage(image,bb.x,bb.y,bb.w,bb.h);
}
function drawImageSizeCentered(image,x,y,s,ctx)
{
  var w = image.width*s/image.height;
  var h = s;
  if(w > s)
  {
    h = h*s/w;
    w = s;
  }
  ctx.drawImage(image,x-w/2,y-h/2,w,h);
}
function strokeBB(bb,ctx)
{
  ctx.strokeRect(bb.x,bb.y,bb.w,bb.h);
}
function fillBB(bb,ctx)
{
  ctx.fillRect(bb.x,bb.y,bb.w,bb.h);
}
function fillRBB(bb,r,ctx)
{
  ctx.beginPath();
  ctx.moveTo(bb.x+r,bb.y);
  ctx.lineTo(bb.x+bb.w-r,bb.y);
  ctx.quadraticCurveTo(bb.x+bb.w,bb.y,bb.x+bb.w,bb.y+r);
  ctx.lineTo(bb.x+bb.w,bb.y+bb.h-r);
  ctx.quadraticCurveTo(bb.x+bb.w,bb.y+bb.h,bb.x+bb.w-r,bb.y+bb.h);
  ctx.lineTo(bb.x+r,bb.y+bb.h);
  ctx.quadraticCurveTo(bb.x,bb.y+bb.h,bb.x,bb.y+bb.h-r);
  ctx.lineTo(bb.x,bb.y+r);
  ctx.quadraticCurveTo(bb.x,bb.y,bb.x+r,bb.y);
  ctx.closePath();
  ctx.fill();
}
function strokeRBB(bb,r,ctx)
{
  ctx.beginPath();
  ctx.moveTo(bb.x+r,bb.y);
  ctx.lineTo(bb.x+bb.w-r,bb.y);
  ctx.quadraticCurveTo(bb.x+bb.w,bb.y,bb.x+bb.w,bb.y+r);
  ctx.lineTo(bb.x+bb.w,bb.y+bb.h-r);
  ctx.quadraticCurveTo(bb.x+bb.w,bb.y+bb.h,bb.x+bb.w-r,bb.y+bb.h);
  ctx.lineTo(bb.x+r,bb.y+bb.h);
  ctx.quadraticCurveTo(bb.x,bb.y+bb.h,bb.x,bb.y+bb.h-r);
  ctx.lineTo(bb.x,bb.y+r);
  ctx.quadraticCurveTo(bb.x,bb.y,bb.x+r,bb.y);
  ctx.closePath();
  ctx.stroke();
}
function fillRect(x,y,w,h,ctx)
{
  ctx.fillRect(x,y,w,h);
}
function strokeRect(x,y,w,h,ctx)
{
  ctx.strokeRect(x,y,w,h);
}
function fillRectCentered(x,y,w,h,ctx)
{
  ctx.fillRect(x-w/2,y-h/2,w,h);
}
function strokeRectCentered(x,y,w,h,ctx)
{
  ctx.strokeRect(x-w/2,y-h/2,w,h);
}
function fillRRectCentered(x,y,w,h,r,ctx)
{
  fillRRect(x-w/2,y-h/2,w,h,r,ctx);
}
function strokeRRectCentered(x,y,w,h,r,ctx)
{
  strokeRRect(x-w/2,y-h/2,w,h,r,ctx);
}
function fillRRect(x,y,w,h,r,ctx)
{
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
  ctx.fill();
}
function strokeRRect(x,y,w,h,r,ctx)
{
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
  ctx.stroke();
}

var UUIDint = function() //17 digits = 64 bit int; each second guaranteed unique, within a second = 1/99999 chance of collision (aka "not unique")
{
  var d = new Date();
  var id = (""+d.getFullYear()).substring(2); //2
  if(d.getMonth() < 10) id += "0";
  id += d.getMonth(); //4
  if(d.getDay() < 10) id += "0";
  id += d.getDay(); //6
  if(d.getHours() < 10) id += "0";
  id += d.getHours(); //8
  if(d.getMinutes() < 10)  id += "0";
  id += d.getMinutes(); //10
  if(d.getSeconds() < 10)  id += "0";
  id += d.getSeconds(); //12
  for(var i = 0; i < 5; i++)
    id += Math.floor(rand()*10); //17

  return parseInt(id);
}

//straight up stolen from the internet
function setCookie(name, val, days)
{
  var d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = name + "=" + val + "; expires="+ d.toGMTString() + "; path=/";
}

function getCookie(name)
{
  var full_cookie = decodeURIComponent(document.cookie);
  var cookies = full_cookie.split(';');
  var name = name + "="; //to ensure "indexOf" doesn't return true unless full name matches
  for(var i = 0; i < cookies.length; i++)
  {
      var c = cookies[i];
      while(c.charAt(0) == ' ') c = c.substring(1);
      if(c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

var animation = function()
{
  var self = this;

  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;

  self.flip = 0;
  self.src;

  self.animations = [];
  //self.animations[ANIM_NULL] = []; for(var i = 0; i <= 1; i++) self.animations[ANIM_NULL].push(i);
  //self.animations[ANIM_IDLE] = []; for(var i = 2; i <= 3; i++) self.animations[ANIM_IDLE].push(i);

  self.cur_anim = 0;//ANIM_NULL;
  self.cur_anim_i = 0;
  self.anim_queue = [];

  self.frame_delay = 5;
  var frame_delay_i = 0;

  self.enqueueAnim = function(anim)
  {
    self.anim_queue.push(anim);
  }

  self.injectAnim = function(anim)
  {
    self.cur_anim = anim;
    self.cur_anim_i = 0;
    frame_delay_i = 0;
  }

  self.swapAnim = function(anim)
  {
    self.cur_anim = anim;
    self.cur_anim_i = 0;
    frame_delay_i = 0;
    self.anim_queue = [];
  }

  self.transition = function()
  {
    if(self.anim_queue.length)
    {
      self.cur_anim = self.anim_queue[0];
      self.anim_queue.splice(0,1);
      self.cur_anim_i = 0;
    }
    else
    {
      switch(self.cur_anim)
      {
      /*
        case ANIM_IDLE:
          self.cur_anim_i = 0;
        break;
      */
        default:
          self.cur_anim = 0; //ANIM_NULL;
          self.cur_anim_i = 0;
        break;
      }
    }
  }

  self.tick = function()
  {
    frame_delay_i = (frame_delay_i + 1)%self.frame_delay;
    if(frame_delay_i != 0) return;

    self.cur_anim_i++;
    if(self.cur_anim_i >= self.animations[self.cur_anim].length)
      self.transition();
  }

  self.draw = function(ctx)
  {
    ctx.save();
    ctx.translate(self.x+self.w/2,self.y+self.h/2);
    if(self.flip) ctx.scale(-1,1);
    ctx.drawImage(self.src[self.animations[self.cur_anim][self.cur_anim_i]],-self.w/2,-self.h/2,self.w,self.h);
    ctx.restore();
  }
}

var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function dateToString(d)
{
  var year = d.getFullYear();
  var month = months[d.getMonth()];
  var date = d.getDate();
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

  return time;
}

//all data pts evenly spaced
var constant_graph = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
  self.wx = 0;
  self.wy = 0;
  self.ww = 0;
  self.wh = 0;

  self.data = [];
  for(var i = 0; i < 1000; i++)
    self.data[i] = sin(i/10);
  self.min_xv = 0; //corresponds to data[0]
  self.max_xv = 1; //corresponds to data[data.length-1]
  self.disp_min_xv = self.min_xv;
  self.disp_max_xv = self.max_xv;
  self.disp_min_yv = -1;
  self.disp_max_yv =  1;

  self.cache;
  self.dirty = true;

  self.genCache = function()
  {
    self.cache = GenIcon(self.w,self.h);
  }

  self.draw = function(ctx)
  {
    if(self.dirty)
    {
      self.cache.context.clearRect(0,0,self.w,self.h);
      //v = value
      //p = pixel
      //t = normalized range from min-max
      //l = lerp to next val
      //i = index
      var xv = 0; //not actually used!
      var yv;
      var xp;
      var yp;
      var xl;
      var xi;

      var min_xt = mapVal(self.min_xv,self.max_xv,0,1,self.disp_min_xv);
      var max_xt = mapVal(self.min_xv,self.max_xv,0,1,self.disp_max_xv);

      xl = min_xt*self.data.length;
      xi = floor(xl);
      xl -= xi;

      self.cache.context.strokeStyle = "#000000";
      self.cache.context.beginPath();
      yv = lerp(self.data[xi],self.data[xi+1],xl);
      yp = mapVal(self.disp_min_yv, self.disp_max_yv, self.h, 0, yv);
      self.cache.context.moveTo(0,yp);
      for(var j = 1; j < self.w; j++)
      {
        xl = mapVal(0,self.w,min_xt,max_xt,j)*self.data.length;
        xi = floor(xl);
        xl -= xi;

        yv = lerp(self.data[xi],self.data[xi+1],xl);
        xp = j;
        yp = mapVal(self.disp_min_yv, self.disp_max_yv, self.h, 0, yv);
        self.cache.context.lineTo(xp,yp);
      }
      self.cache.context.stroke();

      self.dirty = false
    }

    ctx.drawImage(self.cache,self.x,self.y,self.w,self.h);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(self.x,self.y,self.w,self.h);
  }
}

//data pts arbitrarily spaced
var variable_graph = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
  self.wx = 0;
  self.wy = 0;
  self.ww = 0;
  self.wh = 0;

  self.yv = [];
  self.xv = [];
  self.priority = [];
  /*
  //test data
  var n = 10;
  for(var i = 0; i < n; i++)
  {
    self.xv.push(i);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  for(var i = 0; i < n*10; i++)
  {
    self.xv.push(self.xv[self.xv.length-1]+0.1);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  for(var i = 0; i < n; i++)
  {
    self.xv.push(self.xv[self.xv.length-1]+1);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  //end test data
  self.disp_min_xv = self.xv[0];
  self.disp_max_xv = self.xv[self.xv.length-1];
  */
  self.known_min_yv = 0;
  self.known_max_yv = 0;
  self.disp_min_xv = 0;
  self.disp_max_xv = 1;
  self.disp_min_yv = 0;
  self.disp_max_yv = 1;

  self.clampDispX = function()
  {
    self.dirty = true;
    if(self.xv.length == 0)
    {
      self.disp_min_xv = -1;
      self.disp_max_xv = 1;
      return;
    }
    self.disp_min_xv = self.xv[0];
    if(self.xv.length-1 < 0)
    {
      self.disp_max_xv = self.disp_min_xv;
      return;
    }
    self.disp_max_xv = self.xv[self.xv.length-1];

    if(self.disp_min_yv == self.disp_max_yv)
    {
      self.disp_min_yv -= 1;
      self.disp_max_yv += 1;
    }
  }

  self.findRangeY = function()
  {
    if(self.yv.length == 0)
    {
      self.known_min_yv = 0;
      self.known_max_yv = 0;
      return;
    }
    self.known_min_yv = self.yv[0];
    self.known_max_yv = self.yv[0];
    for(var i = 1; i < self.yv.length; i++)
    {
      if(self.yv[i] < self.known_min_yv) self.known_min_yv = self.yv[i];
      if(self.yv[i] > self.known_max_yv) self.known_max_yv = self.yv[i];
    }
  }

  self.clampDispY = function()
  {
    self.dirty = true;
    if(self.known_min_yv == self.known_max_yv)
    {
      self.disp_min_yv = self.known_min_yv-1;
      self.disp_max_yv = self.known_max_yv+1;
    }
    else
    {
      self.disp_min_yv = self.known_min_yv;
      self.disp_max_yv = self.known_max_yv;
    }
  }

  self.clampDisp = function()
  {
    self.clampDispX();
    self.clampDispY();
  }

  self.cache;
  self.dirty = true;

  self.genCache = function()
  {
    self.cache = GenIcon(self.w,self.h);
  }

  self.verifyOrder = function()
  {
    for(var i = 0; i < self.xv.length-1; i++)
      if(self.xv[i] > self.xv[i+1]) return false;
    return true;
  }

  self.insertDataNext = function(x,y,i,p)
  {
    self.dirty = true;

    if(!self.yv.length || y < self.known_min_yv) self.known_min_yv = y;
    if(!self.yv.length || y > self.known_max_yv) self.known_max_yv = y;

    i = self.nextibeforex(x,i)+1;
    if(self.xv[i] == x)
    {
      if(p <= self.priority[i])
      {
        self.yv[i] = y;
        self.priority[i] = p;
      }
    }
    else
    {
      if(i == 0 || p <= self.priority[i-1] || p <= self.priority[i])
      {
        self.xv.splice(i,0,x);
        self.yv.splice(i,0,y);
        self.priority.splice(i,0,p);
      }
    }
    return i;
  }

  self.insertDataFind = function(x,y,min,max,p)
  {
    var i = self.findibeforex(x,min,max);
    return self.insertDataNext(x,y,i,p);
  }

  self.insertDataBlockNext = function(x,y,i,p)
  {
    self.dirty = true;

    //verify order
    var ordered = true;
    for(var j = 1; j < x.length; j++)
    {
      if(x[j] < x[j-1]) ordered = false;
    }
    if(!ordered)
    {
      var newx = [];
      var newy = [];
      while(x.length) //holy inefficient...
      {
        var minj = 0;
        for(var j = 1; j < x.length; j++)
        {
          if(x[minj] > x[j])
            minj = j;
        }
        newx.push(x[minj]);
        newy.push(y[minj]);
        x.splice(minj,1);
        y.splice(minj,1);
      }
      x = newx;
      y = newy;
    }

    if(x.length)
    {
      if(!self.yv.length) self.known_min_yv = y[0];
      if(!self.yv.length) self.known_max_yv = y[0];
    }
    for(var j = 0; j < x.length; j++)
    {
      if(y[j] < self.known_min_yv) self.known_min_yv = y[j];
      if(y[j] > self.known_max_yv) self.known_max_yv = y[j];

      i = self.nextibeforex(x[j],i)+1;

      if(self.xv[i] == x[j])
      {
        if(p <= self.priority[i])
          self.yv[i] = y[j];
      }
      else
      {
        if(i == 0 || p <= self.priority[i-1] || p <= self.priority[i])
        {
          self.xv.splice(i,0,x[j]);
          self.yv.splice(i,0,y[j]);
          self.priority.splice(i,0,p);
        }
      }
    }

    return i;
  }

  self.insertDataBlockFind = function(x,y,min,max,p)
  {
    var i = self.findibeforex(x,min,max);
    return self.insertDataBlockNext(x,y,i,p);
  }

  self.findqueryxt = function(xt,min,max)
  {
    var x = mapVal(0,1,self.disp_min_xv,self.disp_max_xv,xt);
    return self.findqueryx(x,min,max);
  }

  self.nextqueryxt = function(xt,i)
  {
    var x = mapVal(0,1,self.disp_min_xv,self.disp_max_xv,xt);
    return self.nextqueryx(x,i);
  }

  self.findqueryx = function(x,min,max)
  {
    var xi = self.findibeforex(x,min,max);
    if(xi == -1) return self.yv[0];
    if(xi == self.xv.length-1) return self.yv[xi];
    var xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,x)
    return lerp(self.yv[xi],self.yv[xi+1],xl);
  }

  self.nextqueryx = function(x,i)
  {
    var xi = self.nextibeforex(x,i);
    if(xi == -1) return self.yv[0];
    if(xi == self.xv.length-1) return self.yv[xi];
    var xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,x)
    return lerp(self.yv[xi],self.yv[xi+1],xl);
  }

  self.findibeforex = function(x,min,max)
  {
    if(!min) min = -1;
    if(!max) max = self.xv.length;
    var i = min;
    while(min < max-1)
    {
      i = min+ceil((max-min)/2);
           if(x > self.xv[i]) min = i;
      else if(x < self.xv[i]) max = i;
      else //found precisely
      {
        while(i > 0)
        {
          if(self.xv[i] < x) return i;
          i--;
        }
        return 0;
      }
    }
    return min;
  }

  self.nextibeforex = function(x,i)
  {
    for(; i < self.xv.length; i++)
      if(x <= self.xv[i]) return i-1;
    return self.xv.length-1;
  }

  self.draw = function(ctx)
  {
    if(true)//self.dirty)
    {
      self.cache.context.clearRect(0,0,self.w,self.h);
      //v = value
      //p = pixel
      //t = normalized range from min to max
      //l = lerp to next val
      //i = index
      var xv = 0; //not actually used!
      var yv;
      var xp;
      var yp;
      var xl;
      var xi;

      self.cache.context.strokeStyle = self.color;
      self.cache.context.beginPath();
      xi = self.nextibeforex(self.disp_min_xv,0);
      xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,self.disp_min_xv)
      yv = lerp(self.yv[xi],self.yv[xi+1],xl);
      yp = mapVal(self.disp_min_yv, self.disp_max_yv, self.h, 0, yv);
      self.cache.context.moveTo(0,yp);
      for(var j = 1; j < self.w; j++)
      {
        xv = mapVal(0,self.w,self.disp_min_xv,self.disp_max_xv,j);
        xi = self.nextibeforex(xv,xi);
        xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,xv)
        yv = lerp(self.yv[xi],self.yv[xi+1],xl);
        xp = j;
        yp = mapVal(self.disp_min_yv, self.disp_max_yv, self.h, 0, yv);
        self.cache.context.lineTo(xp,yp);
      }
      self.cache.context.stroke();

      self.dirty = false
    }

    ctx.drawImage(self.cache,self.x,self.y,self.w,self.h);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(self.x,self.y,self.w,self.h);
  }
}

//data pts arbitrarily spaced
var running_deriv_variable_graph = function()
{
  var self = this;
  self.x = 0;
  self.y = 0;
  self.w = 0;
  self.h = 0;
  self.wx = 0;
  self.wy = 0;
  self.ww = 0;
  self.wh = 0;

  self.yt = []; //total
  self.yd = []; //deriv
  self.yv = [];
  self.xv = [];
  self.priority = [];
  /*
  //test data
  var n = 10;
  for(var i = 0; i < n; i++)
  {
    self.xv.push(i);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  for(var i = 0; i < n*10; i++)
  {
    self.xv.push(self.xv[self.xv.length-1]+0.1);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  for(var i = 0; i < n; i++)
  {
    self.xv.push(self.xv[self.xv.length-1]+1);
    self.yv.push(sin(self.xv[self.xv.length-1]));
  }
  //end test data
  self.disp_min_xv = self.xv[0];
  self.disp_max_xv = self.xv[self.xv.length-1];
  */
  self.known_min_yv = 0;
  self.known_max_yv = 0;
  self.disp_min_xv = 0;
  self.disp_max_xv = 1;
  self.disp_min_yv = 0;
  self.disp_max_yv = 1;

  self.clampDispX = function()
  {
    self.dirty = true;
    if(self.xv.length == 0)
    {
      self.disp_min_xv = -1;
      self.disp_max_xv = 1;
      return;
    }
    self.disp_min_xv = self.xv[0];
    if(self.xv.length-1 < 0)
    {
      self.disp_max_xv = self.disp_min_xv;
      return;
    }
    self.disp_max_xv = self.xv[self.xv.length-1];

    if(self.disp_min_yv == self.disp_max_yv)
    {
      self.disp_min_yv -= 1;
      self.disp_max_yv += 1;
    }
  }

  self.findRangeY = function()
  {
    if(self.yv.length == 0)
    {
      self.known_min_yv = 0;
      self.known_max_yv = 0;
      return;
    }
    self.known_min_yv = self.yd[0];
    self.known_max_yv = self.yd[0];
    for(var i = 1; i < self.yv.length; i++)
    {
      if(self.yd[i] < self.known_min_yv) self.known_min_yv = self.yd[i];
      if(self.yd[i] > self.known_max_yv) self.known_max_yv = self.yd[i];
    }
  }

  self.clampDispY = function()
  {
    self.dirty = true;
    if(self.known_min_yv == self.known_max_yv)
    {
      self.disp_min_yv = self.known_min_yv-1;
      self.disp_max_yv = self.known_max_yv+1;
    }
    else
    {
      self.disp_min_yv = self.known_min_yv;
      self.disp_max_yv = self.known_max_yv;
    }
  }

  self.clampDisp = function()
  {
    self.clampDispX();
    self.clampDispY();
  }

  self.cache;
  self.dirty = true;

  self.genCache = function()
  {
    self.cache = GenIcon(self.w,self.h);
  }

  self.verifyOrder = function()
  {
    for(var i = 0; i < self.xv.length-1; i++)
      if(self.xv[i] > self.xv[i+1]) return false;
    return true;
  }

  self.insertDataNext = function(x,y,i,p)
  {
    self.dirty = true;

    if(!self.yv.length) self.known_min_yv = 0;
    if(!self.yv.length) self.known_max_yv = 0;

    i = self.nextibeforex(x,i)+1;
    if(self.xv[i] == x)
    {
      if(p <= self.priority[i])
      {
        self.yv[i] = y;
        if(i == 0)
        {
          self.yt[i] = self.yv[i];
          if(i < self.yt.length-1)
            self.yd[i] = (((self.yt[i+1]-self.yt[i])/(self.xv[i+1]-self.xv[i])));
          else
            self.yd[i] = 0;
        }
        else
        {
          self.yt[i] = self.yt[i-1] + self.yv[i];
          if(i < self.yt.length-1)
            self.yd[i] = (((self.yt[i]-self.yt[i-1])/(self.xv[i]-self.xv[i-1])) + ((self.yt[i+1]-self.yt[i])/(self.xv[i+1]-self.xv[i]))) / 2;
          else
            self.yd[i] = (((self.yt[i]-self.yt[i-1])/(self.xv[i]-self.xv[i-1])));
        }
        for(var j = i+1; j < self.yt.length; j++)
        {
          self.yt[j] = self.yt[j-1]+self.yv[j];
          if(j < self.yt.length-1)
            self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])) + ((self.yt[j+1]-self.yt[j])/(self.xv[j+1]-self.xv[j]))) / 2;
          else
            self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])));
        }
        self.priority[i] = p;
      }
    }
    else
    {
      if(i == 0 || p <= self.priority[i-1] || p <= self.priority[i])
      {
        self.xv.splice(i,0,x);
        self.yv.splice(i,0,y);
        self.yt.splice(i,0,0);
        for(var j = i; j < self.yt.length; j++)
        {
          self.yt[j] = self.yt[j-1]+self.yv[j];
          if(i < self.yt.length-1)
            self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])) + ((self.yt[j+1]-self.yt[j])/(self.xv[j+1]-self.xv[j]))) / 2;
          else
            self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])));
        }
        self.priority.splice(i,0,p);
      }
    }
    if(self.yd[i] < self.known_min_yv) self.known_min_yv = self.yd[i];
    if(self.yd[i] > self.known_max_yv) self.known_max_yv = self.yd[i];
    return i;
  }

  self.insertDataFind = function(x,y,min,max,p)
  {
    var i = self.findibeforex(x,min,max);
    return self.insertDataNext(x,y,i,p);
  }

  self.insertDataBlockNext = function(x,y,i,p)
  {
    self.dirty = true;
    var initial_i = i;
    if(x.length)
    {
      if(!self.yv.length) self.known_min_yv = 0;
      if(!self.yv.length) self.known_max_yv = 0;
    }
    for(var j = 0; j < x.length; j++)
    {
      i = self.nextibeforex(x[j],i)+1;

      if(self.xv[i] == x[j])
      {
        if(p <= self.priority[i])
          self.yv[i] = y[j];
      }
      else
      {
        if(i == 0 || p <= self.priority[i-1] || p <= self.priority[i])
        {
          self.xv.splice(i,0,x[j]);
          self.yv.splice(i,0,y[j]);
          self.yt.splice(i,0,0);
          self.priority.splice(i,0,p);
        }
      }
    }
    if(initial_i == 0)
    {
      self.yt[initial_i] = self.yv[initial_i];
      if(initial_i < self.yt.length-1)
        self.yd[initial_i] = (((self.yt[initial_i+1]-self.yt[initial_i])/(self.xv[initial_i+1]-self.xv[initial_i])));
      else
        self.yd[initial_i] = 0;
      if(self.yd[initial_i] < self.known_min_yv) self.known_min_yv = self.yd[initial_i];
      if(self.yd[initial_i] > self.known_max_yv) self.known_max_yv = self.yd[initial_i];
    }
    else
    {
      self.yt[initial_i] = self.yt[initial_i-1] + self.yv[initial_i];
      if(initial_i < self.yt.length-1)
        self.yd[initial_i] = (((self.yt[initial_i]-self.yt[initial_i-1])/(self.xv[initial_i]-self.xv[initial_i-1])) + ((self.yt[initial_i+1]-self.yt[initial_i])/(self.xv[initial_i+1]-self.xv[initial_i]))) / 2;
      else
        self.yd[initial_i] = (((self.yt[initial_i]-self.yt[initial_i-1])/(self.xv[initial_i]-self.xv[initial_i-1])));
      if(self.yd[initial_i] < self.known_min_yv) self.known_min_yv = self.yd[initial_i];
      if(self.yd[initial_i] > self.known_max_yv) self.known_max_yv = self.yd[initial_i];
    }
    for(var j = initial_i+1; j < self.yt.length; j++)
    {
      self.yt[j] = self.yt[j-1]+self.yv[j];
      if(j < self.yt.length-1)
        self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])) + ((self.yt[j+1]-self.yt[j])/(self.xv[j+1]-self.xv[j]))) / 2;
      else
        self.yd[j] = (((self.yt[j]-self.yt[j-1])/(self.xv[j]-self.xv[j-1])));
      if(self.yd[j] < self.known_min_yv) self.known_min_yv = self.yd[j];
      if(self.yd[j] > self.known_max_yv) self.known_max_yv = self.yd[j];
    }

    return i;
  }

  self.insertDataBlockFind = function(x,y,min,max,p)
  {
    var i = self.findibeforex(x,min,max);
    return self.insertDataBlockNext(x,y,i,p);
  }

  self.findqueryxt = function(xt,min,max)
  {
    var x = mapVal(0,1,self.disp_min_xv,self.disp_max_xv,xt);
    return self.findqueryx(x,min,max);
  }

  self.nextqueryxt = function(xt,i)
  {
    var x = mapVal(0,1,self.disp_min_xv,self.disp_max_xv,xt);
    return self.nextqueryx(x,i);
  }

  self.findqueryx = function(x,min,max)
  {
    var xi = self.findibeforex(x,min,max);
    if(xi == -1) return self.yv[0];
    if(xi == self.xv.length-1) return self.yv[xi];
    var xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,x)
    return lerp(self.yv[xi],self.yv[xi+1],xl);
  }

  self.nextqueryx = function(x,i)
  {
    var xi = self.nextibeforex(x,i);
    if(xi == -1) return self.yv[0];
    if(xi == self.xv.length-1) return self.yv[xi];
    var xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,x)
    return lerp(self.yv[xi],self.yv[xi+1],xl);
  }

  self.findibeforex = function(x,min,max)
  {
    if(!min) min = -1;
    if(!max) max = self.xv.length;
    var i = min;
    while(min < max-1)
    {
      i = min+ceil((max-min)/2);
           if(x > self.xv[i]) min = i;
      else if(x < self.xv[i]) max = i;
      else //found precisely
      {
        while(i > 0)
        {
          if(self.xv[i] < x) return i;
          i--;
        }
        return 0;
      }
    }
    return min;
  }

  self.nextibeforex = function(x,i)
  {
    for(; i < self.xv.length; i++)
      if(x <= self.xv[i]) return i-1;
    return self.xv.length-1;
  }

  self.draw = function(ctx)
  {
    if(true)//self.dirty)
    {
      self.cache.context.clearRect(0,0,self.w,self.h);
      //v = value
      //p = pixel
      //t = normalized range from min to max
      //l = lerp to next val
      //i = index
      var xv = 0; //not actually used!
      var yv;
      var xp;
      var yp;
      var xl;
      var xi;

      self.cache.context.strokeStyle = self.color;
      self.cache.context.beginPath();
      xi = self.nextibeforex(self.disp_min_xv,0);
      xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,self.disp_min_xv)
      yv = lerp(self.yd[xi],self.yd[xi+1],xl);
      var disp_extreme_yv = abs(self.disp_min_yv) < abs(self.disp_max_yv) ? abs(self.disp_max_yv) : abs(self.disp_min_yv);
      yp = mapVal(-disp_extreme_yv, disp_extreme_yv, self.h, 0, yv);
      self.cache.context.moveTo(0,yp);
      for(var j = 1; j < self.w; j++)
      {
        xv = mapVal(0,self.w,self.disp_min_xv,self.disp_max_xv,j);
        xi = self.nextibeforex(xv,xi);
        xl = mapVal(self.xv[xi],self.xv[xi+1],0,1,xv)
        yv = lerp(self.yd[xi],self.yd[xi+1],xl);
        xp = j;
        yp = mapVal(-disp_extreme_yv, disp_extreme_yv, self.h, 0, yv);
        self.cache.context.lineTo(xp,yp);
      }
      self.cache.context.stroke();

      self.dirty = false
    }

    ctx.drawImage(self.cache,self.x,self.y,self.w,self.h);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(self.x,self.y,self.w,self.h);
  }
}

function fullscreen()
{
  var el = document.body;
  var requestMethod = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if(requestMethod) requestMethod.call(el);
}

function unfullscreen()
{
  var el = document;
  var exitMethod = el.exitFullscreen || el.webkitExitFullscreen || el.mozCancelFullScreen || el.msExitFullscreen;
  if(exitMethod) exitMethod.call(el);
}

