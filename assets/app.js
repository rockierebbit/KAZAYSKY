/* KΛZΛYSKY — site script.
   ============================================================
   EDIT HERE — everything you will ever need to change is in CONFIG.
   ============================================================ */
var CONFIG = {
  // MailerLite: account id + one form id per entry point.
  // Right now all three use the existing "Strona EN" form.
  // When you create separate forms in MailerLite (Forms → Embedded → copy the id
  // from the form's URL), paste each id here.
  mailerlite: {
    account: '1212532',
    forms: {
      newsletter: '200069415304169321',
      hugel:      '200069415304169321',
      rise:       '200069415304169321'
    }
  },
  // Solar Flare release moment (Warsaw time). Before it: countdown. After it: streaming buttons.
  release: '2026-10-30T00:00:00+01:00',
  // Paste the links once they are live. Empty = button hidden.
  links: {
    spotify:    '',
    apple:      '',
    beatport:   '',
    youtube:    '',   // official video URL, e.g. https://www.youtube.com/watch?v=...
    soundcloud: 'https://soundcloud.com/kazaysky/solarflare',
    // ---- auto-updating embeds: set once, never touch the site again ----
    freePlaylist:      'https://soundcloud.com/kazaysky/sets/kazaysky-free-download',   // ← paste the SoundCloud "Free Downloads" playlist URL
    soundcloudProfile: 'https://soundcloud.com/kazaysky',
    spotifyArtist:     ''                                   // ← paste https://open.spotify.com/artist/... after release
  }
};

(function(){
'use strict';
var $ = function(s,c){return (c||document).querySelector(s)};
var $$ = function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav */
var nav = $('.nav');
if(nav){
  var onScroll = function(){ nav.classList.toggle('solid', scrollY > 40) };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  var b = $('.burger');
  if(b) b.addEventListener('click', function(){ var o = nav.classList.toggle('open'); b.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('.nav ul a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); document.body.style.overflow=''; if(b) b.setAttribute('aria-expanded', false); }); });
}

/* hero film: tall on phones, wide on desktop */
var hv = $('#hero-video');
if(hv){
  var tall = matchMedia('(max-aspect-ratio: 1/1)').matches;
  hv.poster = tall ? hv.dataset.posterTall : hv.dataset.posterWide;
  if(!RM){
    hv.src = tall ? hv.dataset.tall : hv.dataset.wide;
    hv.muted = true; var p = hv.play(); if(p && p.catch) p.catch(function(){});
  }
}

/* release block */
var T = Date.parse(CONFIG.release);
var rel = $('#release-state');
function pad(n){ return String(n).padStart(2,'0') }
function renderRelease(){
  if(!rel) return;
  var d = T - Date.now();
  var status = $('#release-status');
  if(d > 0){
    status.textContent = 'Out 30.10.2026';
    $('#cd').hidden = false; $('#platforms').hidden = true;
    $('#cd-d').textContent = pad(Math.floor(d/864e5));
    $('#cd-h').textContent = pad(Math.floor(d/36e5)%24);
    $('#cd-m').textContent = pad(Math.floor(d/6e4)%60);
    setTimeout(renderRelease, 30000);
  } else {
    status.textContent = 'Out now';
    $('#cd').hidden = true; $('#platforms').hidden = false;
  }
}
var plat = $('#platforms');
if(plat){
  var names = {spotify:'Spotify', apple:'Apple Music', beatport:'Beatport', soundcloud:'SoundCloud', youtube:'Official video'};
  Object.keys(names).forEach(function(k){
    var url = CONFIG.links[k]; if(!url) return;
    var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = names[k]; plat.appendChild(a);
  });
}
renderRelease();

/* reels: sound toggle, pause off-screen */
$$('video[data-reel]').forEach(function(v){
  var btn = $('[data-sound-for="'+v.id+'"]');
  v.muted = true;
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ es.forEach(function(e){
      if(e.isIntersecting && !RM){ var q = v.play(); if(q && q.catch) q.catch(function(){}); }
      else { v.pause(); }
    }); }, {threshold:.35}).observe(v);
  }
  if(btn) btn.addEventListener('click', function(){
    v.muted = !v.muted; btn.setAttribute('aria-pressed', !v.muted);
    btn.textContent = v.muted ? 'Sound on' : 'Sound off';
    if(!v.muted){ v.currentTime = v.currentTime; var q = v.play(); if(q && q.catch) q.catch(function(){}); }
  });
});

/* reveal on scroll */
if('IntersectionObserver' in window && !RM){
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12});
  $$('.rv').forEach(function(el){ io.observe(el) });
} else { $$('.rv').forEach(function(el){ el.classList.add('in') }); }

/* gallery lightbox */
var lb = $('.lightbox');
if(lb){
  var lbImg = $('img', lb);
  $$('.gallery button').forEach(function(b){ b.addEventListener('click', function(){ lbImg.src = b.dataset.full; lbImg.alt = $('img',b).alt; lb.classList.add('on'); }); });
  lb.addEventListener('click', function(e){ if(e.target !== lbImg) lb.classList.remove('on'); });
  addEventListener('keydown', function(e){ if(e.key === 'Escape') lb.classList.remove('on'); });
}

/* signup forms → MailerLite. data-form="newsletter|hugel|rise", optional data-next="/free/rise/download/" */
$$('form[data-form]').forEach(function(f){
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var msg = $('.msg', f), email = $('input[type=email]', f), ok = $('input[name=consent]', f);
    msg.classList.remove('err');
    if(!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){ msg.textContent = 'Enter a valid email.'; msg.classList.add('err'); email.focus(); return; }
    if(ok && !ok.checked){ msg.textContent = 'Tick the box to join the list.'; msg.classList.add('err'); return; }
    var id = CONFIG.mailerlite.forms[f.dataset.form] || CONFIG.mailerlite.forms.newsletter;
    var url = 'https://assets.mailerlite.com/jsonp/' + CONFIG.mailerlite.account + '/forms/' + id + '/subscribe';
    var body = new FormData(); body.append('fields[email]', email.value); body.append('ml-submit', '1'); body.append('anticsrf', 'true');
    var btn = $('button', f); btn.disabled = true; msg.textContent = 'One moment…';
    var done = function(){
      try{ localStorage.setItem('kz_joined', '1') }catch(_){}
      if(f.dataset.next){ location.href = f.dataset.next; return; }
      msg.textContent = 'You are in. Check your inbox and confirm.'; btn.disabled = false; email.value = '';
    };
    fetch(url, {method:'POST', body:body, mode:'no-cors'}).then(done, done);
  });
});

/* auto-updating embeds */
$$('iframe[data-sc]').forEach(function(f){
  var u = CONFIG.links[f.dataset.sc]; if(!u) return;
  f.style.height = (f.dataset.height || 166) + 'px';
  f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(u) + '&color=%23ffb224&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false';
});
$$('[data-href]').forEach(function(a){ var u = CONFIG.links[a.dataset.href]; if(u) a.href = u; });
$$('iframe[data-sp]').forEach(function(f){
  var u = CONFIG.links[f.dataset.sp]; var m = u && u.match(/artist\/([A-Za-z0-9]+)/); if(!m) return;
  f.src = 'https://open.spotify.com/embed/artist/' + m[1] + '?utm_source=generator&theme=0';
  var box = document.getElementById('spotify-artist'); if(box) box.hidden = false;
});

/* year */
$$('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear() });
})();
