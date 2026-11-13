/* KΛZΛYSKY — Meta Pixel with cookie consent.
   The pixel loads ONLY after the visitor presses "Accept".
   Clicks on streaming links are sent as events:
   - every platform: custom event "StreamClick" {platform}
   - Spotify: standard event "Lead" (use this as the conversion in Meta ads)
   Pages can set <body data-fb-content="Release name"> to also send "ViewContent". */
(function(){
'use strict';
var PIXEL_ID = '3477754715693970';
var KEY = 'kz_consent';

function getC(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
function setC(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

var loaded = false;
function load(){
  if(loaded) return; loaded = true;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
  var c = document.body && document.body.getAttribute('data-fb-content');
  if(c) window.fbq('track', 'ViewContent', {content_name: c});
}

function platformOf(href){
  if(/open\.spotify\.com|spotify\.link/.test(href)) return 'Spotify';
  if(/music\.apple\.com/.test(href)) return 'Apple Music';
  if(/youtube\.com|youtu\.be/.test(href)) return 'YouTube';
  if(/soundcloud\.com/.test(href)) return 'SoundCloud';
  if(/beatport\.com/.test(href)) return 'Beatport';
  return null;
}
document.addEventListener('click', function(e){
  if(!window.fbq || !loaded) return;
  var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if(!a) return;
  var p = platformOf(a.href);
  if(!p) return;
  window.fbq('trackCustom', 'StreamClick', {platform: p});
  if(p === 'Spotify') window.fbq('track', 'Lead', {content_name: 'Spotify'});
}, true);

var box = null;
function banner(){
  if(box) { box.hidden = false; return; }
  box = document.createElement('div');
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Cookies');
  box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99;max-width:560px;margin:0 auto;'+
    'background:#121110;border:1px solid #262320;color:#ede6da;padding:16px 18px;font:400 13px/1.5 Poppins,system-ui,sans-serif;'+
    'box-shadow:0 10px 40px rgba(0,0,0,.6);display:flex;flex-wrap:wrap;gap:12px;align-items:center';
  box.innerHTML = '<p style="margin:0;flex:1 1 260px">We use the Meta Pixel to measure our ads (for example, clicks to Spotify). '+
    'Is that OK? <a href="/privacy/" style="color:#ffb224">Privacy</a></p>'+
    '<div style="display:flex;gap:8px">'+
    '<button type="button" data-c="no" style="cursor:pointer;background:transparent;color:#ede6da;border:1px solid rgba(237,230,218,.4);padding:10px 14px;font:600 11px/1 Poppins,sans-serif;letter-spacing:.14em;text-transform:uppercase">No thanks</button>'+
    '<button type="button" data-c="yes" style="cursor:pointer;background:#ffb224;color:#0a0a0a;border:0;padding:10px 16px;font:600 11px/1 Poppins,sans-serif;letter-spacing:.14em;text-transform:uppercase">Accept</button>'+
    '</div>';
  box.addEventListener('click', function(e){
    var v = e.target && e.target.getAttribute && e.target.getAttribute('data-c');
    if(!v) return;
    setC(v); box.hidden = true;
    if(v === 'yes') load();
  });
  document.body.appendChild(box);
}

/* "Cookie settings" link on the privacy page calls this */
window.kzCookies = function(){ banner(); };

var c = getC();
if(c === 'yes') load();
else if(c !== 'no') banner();
})();
