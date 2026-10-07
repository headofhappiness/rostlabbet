/* Röstlabbet – formulär (Web3Forms), gemensam för alla sidor.
   Klistra in Monicas access key från Web3Forms nedan. Tom = knapparna öppnar ett mejl som förut.
   Samma nyckel används för båda formulären; mejlets ämnesrad visar vilket det gäller.
   - Workshopanmälan: länkar med data-ws="Workshopens namn · datum · plats"
   - Kontakt: länkar med data-kontakt (värdet förväljer ämnet, t.ex. data-kontakt="1:1-coachning") */
(function(){
  var ACCESS_KEY='cb26195b-d78c-4958-8c57-f7efba1051f3';      // t.ex. 1a2b3c4d-1234-5678-9abc-def012345678
  var ENDPOINT='https://api.web3forms.com/submit';
  var WORKSHOP_FORM=ACCESS_KEY?ENDPOINT:'',KONTAKT_FORM=ACCESS_KEY?ENDPOINT:'';
  var MAIL='monica@rostlabbet.se';
  var AMNEN=['1:1-coachning','Träningspass eller workshop','Workshop för kör eller grupp','Medlemskapet','Sjung Smart','Annat'];
  if(!WORKSHOP_FORM&&!KONTAKT_FORM)return;
  if(!window.HTMLDialogElement)return; // mycket gamla webbläsare: mejllänken gäller

  var css='dialog.signup{border:0;border-radius:20px;padding:0;width:min(520px,calc(100vw - 32px));max-height:calc(100dvh - 32px);background:var(--cream,#FDF0D5);color:var(--ink,#1A1A1B);box-shadow:0 24px 60px rgba(0,0,0,.4)}'
    +'dialog.signup::backdrop{background:rgba(26,26,27,.6)}'
    +'.signup .in{padding:clamp(22px,4vw,34px)}'
    +'.signup .x{position:absolute;top:10px;right:12px;background:none;border:0;font-size:1.8rem;line-height:1;cursor:pointer;color:var(--ink,#1A1A1B);padding:6px 10px}'
    +'.signup h3{color:var(--vocal,#7A0000);font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:1.15rem;margin:0 0 4px;padding-right:30px}'
    +'.signup .lead{color:var(--ink-soft,#444);margin:0 0 6px}'
    +'.signup label{display:block;font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;margin:14px 0 6px}'
    +'.signup input,.signup textarea,.signup select{width:100%;font:inherit;font-size:1rem;padding:12px 14px;border:1.5px solid rgba(26,26,27,.18);border-radius:10px;background:#fffaf0;color:var(--ink,#1A1A1B)}'
    +'.signup input:focus,.signup textarea:focus,.signup select:focus{outline:3px solid var(--lab,#00A6E6);outline-offset:1px}'
    +'.signup .row{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:12px}'
    +'.signup .row>div{min-width:0}'
    +'.signup .btn{margin-top:22px;width:100%;border:0;cursor:pointer}'
    +'.signup .btn[disabled]{opacity:.6;cursor:wait}'
    +'.signup .small{font-size:.85rem;color:var(--ink-soft,#444);margin-top:12px}'
    +'.signup .err{color:var(--signal,#C8102E);margin-top:12px;font-weight:600}'
    +'div.signup.inline{background:#fffaf0;border:1px solid rgba(26,26,27,.14);border-radius:18px;max-width:640px;color:var(--ink,#1A1A1B)}'
    +'.signup .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // Bygg ett formulär. kind = 'ws' eller 'kontakt'. Med host läggs det direkt på sidan, annars som popup.
  function build(kind,host){
    var P=kind+(host?'-in':'');
    var d=document.createElement(host?'div':'dialog');d.className='signup'+(host?' inline':'');d.setAttribute('aria-labelledby','f-'+P+'-t');
    var fields=kind==='ws'
      ?'<div class="row"><div><label for="f-'+P+'-tel">Telefon</label><input id="f-'+P+'-tel" name="telefon" type="tel" autocomplete="tel"></div>'
        +'<div><label for="f-'+P+'-antal">Antal</label><input id="f-'+P+'-antal" name="antal" type="number" min="1" max="20" value="1" inputmode="numeric"></div></div>'
        +'<label for="f-'+P+'-msg">Något Monica bör veta? (frivilligt)</label><textarea id="f-'+P+'-msg" name="meddelande" rows="3"></textarea>'
      :'<label for="f-'+P+'-tel">Telefon (frivilligt)</label><input id="f-'+P+'-tel" name="telefon" type="tel" autocomplete="tel">'
        +'<label for="f-'+P+'-amne">Vad gäller det?</label><select id="f-'+P+'-amne" name="amne">'+AMNEN.map(function(a){return '<option>'+esc(a)+'</option>'}).join('')+'</select>'
        +'<label for="f-'+P+'-msg">Meddelande</label><textarea id="f-'+P+'-msg" name="meddelande" rows="5" required></textarea>';
    d.innerHTML=(host?'':'<button type="button" class="x" aria-label="Stäng">×</button>')
      +'<div class="in" data-step="form">'+(host?'':'<h3 id="f-'+P+'-t">'+(kind==='ws'?'Anmälan':'Kontakta Monica')+'</h3>')
      +'<p class="lead" data-text></p>'
      +'<form novalidate>'
      +(kind==='ws'?'<input type="hidden" name="workshop">':'')
      +'<input type="hidden" name="access_key" value="'+esc(ACCESS_KEY)+'">'
      +'<input type="hidden" name="subject"><input type="hidden" name="from_name" value="Röstlabbet hemsida">'
      +'<input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">'
      +'<label for="f-'+P+'-name">Namn</label><input id="f-'+P+'-name" name="namn" autocomplete="name" required>'
      +'<label for="f-'+P+'-email">E-post</label><input id="f-'+P+'-email" name="email" type="email" autocomplete="email" required>'
      +fields
      +'<button class="btn" type="submit">'+(kind==='ws'?'Skicka anmälan':'Skicka')+' <span class="arrow" aria-hidden="true">→</span></button>'
      +'<p class="err" role="alert" hidden></p>'
      +'<p class="small">Dina uppgifter går bara till Monica. <a href="integritetspolicy.html">Integritetspolicy</a></p>'
      +'</form></div>'
      +'<div class="in" data-step="ok" hidden><h3>'+(kind==='ws'?'Tack, du är anmäld!':'Tack för ditt meddelande!')+'</h3>'
      +'<p class="lead" data-text></p>'
      +'<p>'+(kind==='ws'?'Monica har fått din anmälan och hör av sig om något behövs. Betalning sker enligt informationen på sidan.':'Monica svarar så snart hon kan, oftast inom ett par dagar.')+'</p>'
      +'<button class="btn" type="button" data-close>'+(host?'Skicka ett meddelande till':'Stäng')+'</button></div>';
    if(host){host.innerHTML='';host.appendChild(d)}else document.body.appendChild(d);
    var form=d.querySelector('form'),err=d.querySelector('.err'),send=form.querySelector('button[type=submit]');
    function close(){
      if(!host){d.close();return}
      d.querySelector('[data-step=form]').hidden=false;d.querySelector('[data-step=ok]').hidden=true;form.namn.focus();
    }
    if(!host){d.querySelector('.x').addEventListener('click',close);d.addEventListener('click',function(e){if(e.target===d)close()})}
    d.querySelector('[data-close]').addEventListener('click',close);
    if(host)Array.prototype.forEach.call(d.querySelectorAll('[data-text]'),function(p){p.hidden=true});
    form.addEventListener('submit',function(e){
      e.preventDefault();err.hidden=true;
      if(!form.checkValidity()){
        var bad=form.querySelector(':invalid');
        err.textContent=bad&&bad.type==='email'?'Kolla e-postadressen.':'Fyll i namn, e-post'+(kind==='kontakt'?' och meddelande.':'.');
        err.hidden=false;if(bad)bad.focus();return;
      }
      if(kind==='kontakt')form.subject.value='Kontakt via hemsidan: '+form.amne.value;
      send.disabled=true;
      var url=kind==='ws'?WORKSHOP_FORM:KONTAKT_FORM,label=d.getAttribute('data-label')||'';
      fetch(url,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success===false)throw 0})})
        .then(function(){
          form.reset();
          d.querySelector('[data-step=form]').hidden=true;d.querySelector('[data-step=ok]').hidden=false;
          d.querySelector('[data-close]').focus();
          if(window.fbq)fbq('track',kind==='ws'?'Lead':'Contact',{content_name:label});
          if(window.gtag)gtag('event',kind==='ws'?'generate_lead':'contact',{form:kind,label:label});
        })
        .catch(function(){
          err.innerHTML='Det gick inte att skicka just nu. Mejla gärna Monica direkt: <a href="mailto:'+MAIL+'">'+MAIL+'</a>';
          err.hidden=false;
        })
        .then(function(){send.disabled=false});
    });
    return d;
  }

  var dialogs={};
  function open(kind,label){
    var d=dialogs[kind]||(dialogs[kind]=build(kind));
    var form=d.querySelector('form');
    d.setAttribute('data-label',label||'');
    d.querySelector('[data-step=form]').hidden=false;d.querySelector('[data-step=ok]').hidden=true;
    d.querySelector('.err').hidden=true;
    Array.prototype.forEach.call(d.querySelectorAll('[data-text]'),function(p){p.textContent=kind==='ws'?label:'';p.hidden=kind!=='ws'});
    if(kind==='ws'){form.workshop.value=label;form.subject.value='Anmälan: '+label}
    else if(label&&AMNEN.indexOf(label)>=0)form.amne.value=label;
    d.showModal();
    setTimeout(function(){form.namn.focus()},50);
  }

  // Kontaktformulär direkt på sidan: <div data-kontaktform="förvalt ämne">reservtext</div>
  if(KONTAKT_FORM)Array.prototype.forEach.call(document.querySelectorAll('[data-kontaktform]'),function(host){
    var f=build('kontakt',host).querySelector('form'),v=host.getAttribute('data-kontaktform');
    if(v&&AMNEN.indexOf(v)>=0)f.amne.value=v;
  });

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-ws],a[data-kontakt]');
    if(!a||!/^mailto:/i.test(a.getAttribute('href')||''))return;
    if(a.hasAttribute('data-ws')&&WORKSHOP_FORM){e.preventDefault();open('ws',a.getAttribute('data-ws'))}
    else if(a.hasAttribute('data-kontakt')&&KONTAKT_FORM){e.preventDefault();open('kontakt',a.getAttribute('data-kontakt'))}
  });
})();
