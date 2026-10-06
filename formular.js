/* Röstlabbet – formulär (Web3Forms), gemensam för alla sidor.
   Klistra in Monicas access key från Web3Forms nedan. Tom = knapparna öppnar ett mejl som förut.
   Samma nyckel används för båda formulären; mejlets ämnesrad visar vilket det gäller.
   - Workshopanmälan: länkar med data-ws="Workshopens namn · datum · plats"
   - Kontakt: länkar med data-kontakt (värdet förväljer ämnet, t.ex. data-kontakt="1:1-coachning") */
(function(){
  var ACCESS_KEY='';      // t.ex. 1a2b3c4d-1234-5678-9abc-def012345678
  var ENDPOINT='https://api.web3forms.com/submit';
  var WORKSHOP_FORM=ACCESS_KEY?ENDPOINT:'',KONTAKT_FORM=ACCESS_KEY?ENDPOINT:'';
  var MAIL='monica@rostlabbet.se';
  var AMNEN=['1:1-coachning','Workshop för kör eller grupp','Medlemskapet','Sjung Smart','Annat'];
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
    +'.signup .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // Bygg en dialog. kind = 'ws' eller 'kontakt'
  function build(kind){
    var d=document.createElement('dialog');d.className='signup';d.setAttribute('aria-labelledby','f-'+kind+'-t');
    var fields=kind==='ws'
      ?'<div class="row"><div><label for="f-ws-tel">Telefon</label><input id="f-ws-tel" name="telefon" type="tel" autocomplete="tel"></div>'
        +'<div><label for="f-ws-antal">Antal</label><input id="f-ws-antal" name="antal" type="number" min="1" max="20" value="1" inputmode="numeric"></div></div>'
        +'<label for="f-ws-msg">Något Monica bör veta? (frivilligt)</label><textarea id="f-ws-msg" name="meddelande" rows="3"></textarea>'
      :'<label for="f-kontakt-tel">Telefon (frivilligt)</label><input id="f-kontakt-tel" name="telefon" type="tel" autocomplete="tel">'
        +'<label for="f-kontakt-amne">Vad gäller det?</label><select id="f-kontakt-amne" name="amne">'+AMNEN.map(function(a){return '<option>'+esc(a)+'</option>'}).join('')+'</select>'
        +'<label for="f-kontakt-msg">Meddelande</label><textarea id="f-kontakt-msg" name="meddelande" rows="5" required></textarea>';
    d.innerHTML='<button type="button" class="x" aria-label="Stäng">×</button>'
      +'<div class="in" data-step="form"><h3 id="f-'+kind+'-t">'+(kind==='ws'?'Anmälan':'Kontakta Monica')+'</h3>'
      +'<p class="lead" data-text></p>'
      +'<form novalidate>'
      +(kind==='ws'?'<input type="hidden" name="workshop">':'')
      +'<input type="hidden" name="access_key" value="'+esc(ACCESS_KEY)+'">'
      +'<input type="hidden" name="subject"><input type="hidden" name="from_name" value="Röstlabbet hemsida">'
      +'<input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">'
      +'<label for="f-'+kind+'-name">Namn</label><input id="f-'+kind+'-name" name="namn" autocomplete="name" required>'
      +'<label for="f-'+kind+'-email">E-post</label><input id="f-'+kind+'-email" name="email" type="email" autocomplete="email" required>'
      +fields
      +'<button class="btn" type="submit">'+(kind==='ws'?'Skicka anmälan':'Skicka')+' <span class="arrow" aria-hidden="true">→</span></button>'
      +'<p class="err" role="alert" hidden></p>'
      +'<p class="small">Dina uppgifter går bara till Monica. <a href="integritetspolicy.html">Integritetspolicy</a></p>'
      +'</form></div>'
      +'<div class="in" data-step="ok" hidden><h3>'+(kind==='ws'?'Tack, du är anmäld!':'Tack för ditt meddelande!')+'</h3>'
      +'<p class="lead" data-text></p>'
      +'<p>'+(kind==='ws'?'Monica har fått din anmälan och hör av sig om något behövs. Betalning sker enligt informationen vid workshopen.':'Monica svarar så snart hon kan, oftast inom ett par dagar.')+'</p>'
      +'<button class="btn" type="button" data-close>Stäng</button></div>';
    document.body.appendChild(d);
    var form=d.querySelector('form'),err=d.querySelector('.err'),send=form.querySelector('button[type=submit]');
    function close(){d.close()}
    d.querySelector('.x').addEventListener('click',close);
    d.querySelector('[data-close]').addEventListener('click',close);
    d.addEventListener('click',function(e){if(e.target===d)close()});
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

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-ws],a[data-kontakt]');
    if(!a||!/^mailto:/i.test(a.getAttribute('href')||''))return;
    if(a.hasAttribute('data-ws')&&WORKSHOP_FORM){e.preventDefault();open('ws',a.getAttribute('data-ws'))}
    else if(a.hasAttribute('data-kontakt')&&KONTAKT_FORM){e.preventDefault();open('kontakt',a.getAttribute('data-kontakt'))}
  });
})();
