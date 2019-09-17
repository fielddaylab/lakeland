var g;
var urlp = jsonFromURL();
var game_width  = 1024;
var game_height = 660;
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

function size_containers(w,h)
{
  var stage_container_container = document.getElementById("BrainPOPsnapArea");
  stage_container_container.style.width = w;
  stage_container_container.style.height = h;
  var stage_container = document.getElementById("stage_container");
  stage_container.style.width = w;
  stage_container.style.height = h;
}
function resize()
{
  game_width = window.innerWidth;
  game_height = window.innerHeight;

  if(g) g.request_resize({width:game_width,height:game_height});
  size_containers(game_width,game_height);
}
function begin()
{
  resize();
  g = new Game({width:game_width,height:game_height,container:"stage_container"});
  g.begin();
}
window.addEventListener("click",window.focus,false);
window.addEventListener("load",begin,{capture:true,once:true,passive:true});
window.addEventListener("resize",resize,{capture:true,once:false,passive:true});

