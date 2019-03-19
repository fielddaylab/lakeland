var PLATFORM_PC = 0;
var PLATFORM_MOBILE = 1;
var BROWSER_OTHER = 0;
var BROWSER_FIREFOX = 1;
var DEVICE_IOS = 0;
var DEVICE_ANDROID = 1;
var DEVICE_WEB = 2;

var platform = PLATFORM_PC;
var browser = BROWSER_OTHER;
var device = DEVICE_WEB;

if(navigator.userAgent.match(/Firefox/i))
  browser = BROWSER_FIREFOX;

if(navigator.userAgent.match(/Android/i))
{
  platform = PLATFORM_MOBILE;
  device = DEVICE_ANDROID;
}
else if(
   navigator.userAgent.match(/iPhone/i) ||
   navigator.userAgent.match(/iPad/i) ||
   navigator.userAgent.match(/iPod/i)
  )
{
  platform = PLATFORM_MOBILE;
  device = DEVICE_IOS;
}

