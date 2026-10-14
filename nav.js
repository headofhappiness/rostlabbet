/* Röstlabbet – Meny-knapp, gemensam för alla sidor.
   Bygger en utfällbar meny av länkarna i <nav class="main">, så att allt går att nå på mindre skärmar.
   Stor skärm (≥1400px): alla länkar syns i raden och knappen döljs. */
(function(){
  var nav=document.querySelector('header.top nav.main');
  if(!nav)return;
  var header=nav.closest('header');
  var links=[].slice.call(nav.querySelectorAll('a.hide-sm'));
  var login=nav.querySelector('a.nav-login');

  var css='nav.main .nav-toggle{display:none;align-items:center;gap:8px;font:inherit;font-weight:700;letter-spacing:inherit;text-transform:inherit;color:var(--ink,#1A1A1B);background:transparent;border:2px solid var(--ink,#1A1A1B);border-radius:999px;padding:10px 16px 8px;cursor:pointer;white-space:nowrap}'
    +'nav.main .nav-toggle .bars{display:inline-grid;gap:3px}nav.main .nav-toggle .bars i{display:block;width:14px;height:2px;background:currentColor;border-radius:2px}'
    +'nav.main .nav-toggle[aria-expanded="true"]{background:var(--ink,#1A1A1B);color:var(--cream,#FDF0D5)}'
    +'.nav-panel{border-top:1px solid var(--line,rgba(26,26,27,.14));background:var(--cream,#FDF0D5)}'
    +'.nav-panel[hidden]{display:none}'
    +'.nav-panel .wrap{display:grid;gap:2px;padding-block:14px 22px;justify-content:stretch;align-items:stretch}'
    +'.nav-panel a{display:block;padding:12px 4px;text-decoration:none;font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.1em;font-size:.95rem;color:var(--ink,#1A1A1B);border-bottom:1px solid var(--line,rgba(26,26,27,.14))}'
    +'.nav-panel a:last-child{border-bottom:0}'
    +'.nav-panel a[aria-current="page"]{color:var(--signal,#C1121F)}'
    +'.nav-panel a.nav-strong{font-weight:800}'
    +'.nav-panel a.panel-login{display:none}'
    /* 1100–1399: fyra punkter i raden + Meny */
    +'@media (max-width:1399px){nav.main .nav-toggle{display:inline-flex}}'
    /* under 1100: bara Meny, Logga in och Bli medlem */
    +'@media (max-width:1099px){nav.main a.hide-sm{display:none}}'
    /* mobil: Logga in flyttar in i menyn */
    +'@media (max-width:600px){nav.main a.nav-login{display:none}.nav-panel a.panel-login{display:block}nav.main .nav-toggle{padding:9px 12px 7px;font-size:.7rem}}'
    +'@media (min-width:1400px){.nav-panel{display:none!important}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var btn=document.createElement('button');
  btn.type='button';btn.className='nav-toggle';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','nav-panel');
  btn.innerHTML='<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>Meny';
  nav.insertBefore(btn,login||nav.lastElementChild);

  var panel=document.createElement('div');
  panel.className='nav-panel';panel.id='nav-panel';panel.hidden=true;
  var inner=document.createElement('div');inner.className='wrap';
  links.forEach(function(a){
    var c=a.cloneNode(true);c.className=a.classList.contains('nav-strong')?'nav-strong':'';inner.appendChild(c);
  });
  if(login){var l=login.cloneNode(true);l.className='panel-login';inner.appendChild(l)}
  panel.appendChild(inner);header.appendChild(panel);

  function setOpen(open){panel.hidden=!open;btn.setAttribute('aria-expanded',open?'true':'false')}
  btn.addEventListener('click',function(){setOpen(panel.hidden)});
  panel.addEventListener('click',function(e){if(e.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden){setOpen(false);btn.focus()}});
  document.addEventListener('click',function(e){if(!panel.hidden&&!header.contains(e.target))setOpen(false)});
})();
