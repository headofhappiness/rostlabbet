/* Röstlabbet – cookieruta + annonsspårning, gemensam för alla sidor.
   Inget laddas förrän besökaren klickat "Godkänn". Valet sparas i webbläsaren (rl-consent).
   Sidor med <body data-track="lead"> (tacksidan) räknas som en anmälan. */
(function(){
  var META_PIXEL_ID='2188685271873764';
  var GOOGLE_ID='G-DS92VHTKY4';
  var KEY='rl-consent';

  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  var isLead=document.body&&document.body.getAttribute('data-track')==='lead';

  function loadMeta(){
    if(window.fbq||!META_PIXEL_ID)return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init',META_PIXEL_ID);fbq('track','PageView');
    if(isLead)fbq('track','Lead');
  }
  function loadGoogle(){
    if(window.gtag||!GOOGLE_ID)return;
    var s=document.createElement('script');s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+GOOGLE_ID;
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config',GOOGLE_ID);
    if(isLead)gtag('event','generate_lead');
  }
  function loadAll(){loadMeta();loadGoogle()}

  // Cookierutan byggs här, så den ser likadan ut på alla sidor
  var css='.consent{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:60;max-width:560px;margin-inline:auto;background:var(--ink,#1A1A1B);color:var(--cream,#FDF0D5);border-radius:16px;padding:18px 20px;box-shadow:0 16px 40px rgba(0,0,0,.35);font-size:.95rem}'
    +'.consent[hidden]{display:none}'
    +'.consent p{margin:0 0 12px;line-height:1.5}'
    +'.consent a{color:var(--cream,#FDF0D5)}'
    +'.consent .row2{display:flex;flex-wrap:wrap;gap:10px}'
    +'.consent button{font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;border-radius:999px;padding:11px 18px 9px;cursor:pointer;border:2px solid var(--cream,#FDF0D5);background:transparent;color:var(--cream,#FDF0D5)}'
    +'.consent button.yes{background:var(--lab,#00A6E6);border-color:var(--lab,#00A6E6);color:var(--ink,#1A1A1B)}'
    +'.linkbtn{background:none;border:0;padding:0;font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;opacity:.75}'
    +'.linkbtn:hover{opacity:1}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var box=document.createElement('div');
  box.className='consent';box.id='consent';box.setAttribute('role','dialog');box.setAttribute('aria-label','Cookies');box.hidden=true;
  box.innerHTML='<p>Vi vill använda cookies för att mäta hur våra annonser fungerar (Meta och Google). Inget laddas förrän du säger ja. <a href="cookiepolicy.html">Läs mer</a></p>'
    +'<div class="row2"><button type="button" class="yes" id="consent-yes">Godkänn</button><button type="button" id="consent-no">Nej tack</button></div>';
  document.body.appendChild(box);

  // Länk "Cookieinställningar" i sidfoten, så man kan ändra sig
  var open=document.getElementById('consent-open');
  if(!open){
    var nav=document.querySelector('footer nav');
    if(nav){open=document.createElement('button');open.type='button';open.className='linkbtn';open.id='consent-open';open.textContent='Cookieinställningar';nav.appendChild(open)}
  }

  var c=get();
  if(c==='yes')loadAll();else if(c!=='no')box.hidden=false;
  document.getElementById('consent-yes').addEventListener('click',function(){set('yes');box.hidden=true;loadAll()});
  document.getElementById('consent-no').addEventListener('click',function(){set('no');box.hidden=true});
  if(open)open.addEventListener('click',function(){box.hidden=false});

  // Klick på en köpknapp = påbörjat köp (värde från data-value)
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href*="/buy/plan/"]');
    if(!a)return;
    var val=+(a.getAttribute('data-value')||349);
    if(window.fbq)fbq('track','InitiateCheckout',{value:val,currency:'SEK'});
    if(window.gtag)gtag('event','begin_checkout',{value:val,currency:'SEK'});
  });
})();
