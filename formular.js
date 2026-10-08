/* Röstlabbet – formulär (Web3Forms), gemensam för alla sidor.
   ACCESS_KEY är Monicas nyckel från Web3Forms. Tom = knapparna öppnar ett mejl som förut.
   Samma nyckel används för båda formulären; mejlets ämnesrad visar vilket det gäller.

   Formulären ligger direkt på sidan:
   - <div data-anmalan>reservtext</div>   anmälan. Valen hämtas från knapparna med data-ws på sidan.
   - <div data-kontaktform="ämne">reservtext</div>   kontakt, med förvalt ämne.
   Knappar med data-ws / data-kontakt skrollar ner till formuläret och fyller i rätt val.
   Finns inget formulär på sidan öppnas det som en ruta i stället. */
(function(){
  var ACCESS_KEY='cb26195b-d78c-4958-8c57-f7efba1051f3';
  var ENDPOINT='https://api.web3forms.com/submit';
  var MAIL='monica@rostlabbet.se';
  var AMNEN=['1:1-coachning','Träningspass eller workshop','Workshop för kör eller grupp','Medlemskapet','Sjung Smart','Annat'];
  if(!ACCESS_KEY)return;

  var css='.signup{color:var(--ink,#1A1A1B)}'
    +'dialog.signup{border:0;border-radius:20px;padding:0;width:min(520px,calc(100vw - 32px));max-height:calc(100dvh - 32px);background:var(--cream,#FDF0D5);box-shadow:0 24px 60px rgba(0,0,0,.4)}'
    +'dialog.signup::backdrop{background:rgba(26,26,27,.6)}'
    +'div.signup{background:#fffaf0;border:1px solid rgba(26,26,27,.14);border-radius:18px;max-width:640px}'
    +'.signup .in{padding:clamp(22px,4vw,34px)}'
    +'.signup .x{position:absolute;top:10px;right:12px;background:none;border:0;font-size:1.8rem;line-height:1;cursor:pointer;color:var(--ink,#1A1A1B);padding:6px 10px}'
    +'.signup h3{color:var(--vocal,#7A0000);font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:1.15rem;margin:0 0 4px;padding-right:30px}'
    +'.signup .lead{color:var(--ink-soft,#444);margin:0 0 6px}'
    +'.signup label{display:block;font-family:var(--f-label,sans-serif);font-weight:700;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;margin:14px 0 6px}'
    +'.signup input,.signup textarea,.signup select{width:100%;font:inherit;font-size:1rem;padding:12px 14px;border:1.5px solid rgba(26,26,27,.18);border-radius:10px;background:#fff;color:var(--ink,#1A1A1B)}'
    +'.signup input:focus,.signup textarea:focus,.signup select:focus{outline:3px solid var(--lab,#00A6E6);outline-offset:1px}'
    +'.signup .row{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:12px}'
    +'.signup .row>div{min-width:0}'
    +'.signup .btn{margin-top:22px;width:100%;border:0;cursor:pointer}'
    +'.signup .btn[disabled]{opacity:.6;cursor:wait}'
    +'.signup .small{font-size:.85rem;color:var(--ink-soft,#444);margin-top:12px}'
    +'.signup .err{color:var(--signal,#C8102E);margin-top:12px;font-weight:600}'
    +'.signup .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}'
    +'.signup.flash{animation:rlflash 1.2s ease-out}'
    +'@keyframes rlflash{0%{box-shadow:0 0 0 0 rgba(0,166,230,.6)}100%{box-shadow:0 0 0 18px rgba(0,166,230,0)}}'
    +'@media (prefers-reduced-motion:reduce){.signup.flash{animation:none}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function each(sel,fn){Array.prototype.forEach.call(document.querySelectorAll(sel),fn)}
  function wsOptions(){var seen={},out=[];each('a[data-ws]',function(a){var v=a.getAttribute('data-ws');if(v&&!seen[v]){seen[v]=1;out.push(v)}});return out}

  // Bygg ett formulär. kind = 'ws' (anmälan) eller 'kontakt'. Med host läggs det på sidan, annars som ruta.
  function build(kind,host){
    var P=kind+(host?'-in':'');
    var d=document.createElement(host?'div':'dialog');d.className='signup';d.setAttribute('aria-labelledby','f-'+P+'-t');
    var top=kind==='ws'
      ?(host?'<label for="f-'+P+'-ws">Vilket pass?</label><select id="f-'+P+'-ws" name="workshop" required></select>':'<input type="hidden" name="workshop">')
      :'';
    var fields=kind==='ws'
      ?'<div class="row"><div><label for="f-'+P+'-tel">Telefon</label><input id="f-'+P+'-tel" name="telefon" type="tel" autocomplete="tel"></div>'
        +'<div><label for="f-'+P+'-antal">Antal</label><input id="f-'+P+'-antal" name="antal" type="number" min="1" max="20" value="1" inputmode="numeric"></div></div>'
        +'<label for="f-'+P+'-msg">Något Monica bör veta? (frivilligt)</label><textarea id="f-'+P+'-msg" name="meddelande" rows="3"></textarea>'
      :'<label for="f-'+P+'-tel">Telefon (frivilligt)</label><input id="f-'+P+'-tel" name="telefon" type="tel" autocomplete="tel">'
        +'<label for="f-'+P+'-amne">Vad gäller det?</label><select id="f-'+P+'-amne" name="amne">'+AMNEN.map(function(a){return '<option>'+esc(a)+'</option>'}).join('')+'</select>'
        +'<label for="f-'+P+'-msg">Meddelande</label><textarea id="f-'+P+'-msg" name="meddelande" rows="5" required></textarea>';
    d.innerHTML=(host?'':'<button type="button" class="x" aria-label="Stäng">×</button>')
      +'<div class="in" data-step="form"><h3 id="f-'+P+'-t">'+(kind==='ws'?'Anmälan':'Kontakta Monica')+'</h3>'
      +(kind==='ws'&&!host?'<p class="lead" data-pass></p>':'')
      +'<form novalidate>'
      +'<input type="hidden" name="access_key" value="'+esc(ACCESS_KEY)+'">'
      +'<input type="hidden" name="subject"><input type="hidden" name="from_name" value="Röstlabbet hemsida">'
      +'<input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">'
      +top
      +'<label for="f-'+P+'-name">Namn</label><input id="f-'+P+'-name" name="namn" autocomplete="name" required>'
      +'<label for="f-'+P+'-email">E-post</label><input id="f-'+P+'-email" name="email" type="email" autocomplete="email" required>'
      +fields
      +'<button class="btn" type="submit">'+(kind==='ws'?'Skicka anmälan':'Skicka')+' <span class="arrow" aria-hidden="true">→</span></button>'
      +'<p class="err" role="alert" hidden></p>'
      +'<p class="small">Dina uppgifter går bara till Monica. <a href="integritetspolicy.html">Integritetspolicy</a></p>'
      +'</form></div>'
      +'<div class="in" data-step="ok" hidden><h3>'+(kind==='ws'?'Tack, du är anmäld!':'Tack för ditt meddelande!')+'</h3>'
      +'<p class="lead" data-text></p>'
      +'<p>'+(kind==='ws'?'Monica har fått din anmälan och hör av sig om något behövs. Betalning sker enligt informationen vid passet.':'Monica svarar så snart hon kan, oftast inom ett par dagar.')+'</p>'
      +'<button class="btn" type="button" data-close>'+(host?(kind==='ws'?'Anmäl någon mer':'Skicka ett meddelande till'):'Stäng')+'</button></div>';
    if(host){host.innerHTML='';host.appendChild(d)}else document.body.appendChild(d);

    var form=d.querySelector('form'),err=d.querySelector('.err'),send=form.querySelector('button[type=submit]');
    function back(){d.querySelector('[data-step=form]').hidden=false;d.querySelector('[data-step=ok]').hidden=true;err.hidden=true}
    d.querySelector('[data-close]').addEventListener('click',function(){if(host){back();form.namn.focus()}else d.close()});
    if(!host){d.querySelector('.x').addEventListener('click',function(){d.close()});d.addEventListener('click',function(e){if(e.target===d)d.close()})}

    form.addEventListener('submit',function(e){
      e.preventDefault();err.hidden=true;
      if(!form.checkValidity()){
        var bad=form.querySelector(':invalid');
        err.textContent=bad&&bad.type==='email'?'Kolla e-postadressen.':(bad&&bad.name==='workshop'?'Välj vilket pass du vill anmäla dig till.':'Fyll i namn, e-post'+(kind==='kontakt'?' och meddelande.':'.'));
        err.hidden=false;if(bad)bad.focus();return;
      }
      var label=kind==='ws'?form.workshop.value:form.amne.value;
      form.subject.value=kind==='ws'?'Anmälan: '+label:'Kontakt via hemsidan: '+label;
      send.disabled=true;
      fetch(ENDPOINT,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success===false)throw 0})})
        .then(function(){
          form.reset();
          if(kind==='ws')form.workshop.value=label;else form.amne.value=label;
          d.querySelector('[data-text]').textContent=kind==='ws'?label:'';
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
    d._form=form;d._back=back;
    return d;
  }

  // Fyll passlistan i anmälningsformuläret med passen som syns på sidan
  function fillWs(d){
    var sel=d._form.workshop;if(sel.tagName!=='SELECT')return 1;
    var cur=sel.value,opts=wsOptions();
    sel.innerHTML=(opts.length>1?'<option value="">Välj pass</option>':'')+opts.map(function(o){return '<option>'+esc(o)+'</option>'}).join('');
    if(cur&&opts.indexOf(cur)>=0)sel.value=cur;
    return opts.length;
  }

  var inline={ws:null,kontakt:null};
  var wsHost=document.querySelector('[data-anmalan]');
  if(wsHost){
    inline.ws=build('ws',wsHost);
    var refresh=function(){wsHost.hidden=!fillWs(inline.ws)};
    refresh();
    var list=document.getElementById('wlist');
    if(list&&window.MutationObserver)new MutationObserver(refresh).observe(list,{childList:true,subtree:true});
  }
  var kHost=document.querySelector('[data-kontaktform]');
  if(kHost){
    inline.kontakt=build('kontakt',kHost);
    var v=kHost.getAttribute('data-kontaktform');
    if(v&&AMNEN.indexOf(v)>=0)inline.kontakt._form.amne.value=v;
  }

  function goTo(d,setValue){
    d._back();setValue(d._form);
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    d.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
    d.classList.remove('flash');void d.offsetWidth;d.classList.add('flash');
    setTimeout(function(){try{d._form.namn.focus({preventScroll:true})}catch(e){d._form.namn.focus()}},reduce?0:450);
  }
  var dialogs={};
  function popup(kind,setValue){
    var d=dialogs[kind]||(dialogs[kind]=build(kind));
    if(kind==='ws')fillWs(d);
    d._back();setValue(d._form);
    d.showModal();setTimeout(function(){d._form.namn.focus()},50);
  }

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-ws],a[data-kontakt]');
    if(!a||!/^mailto:/i.test(a.getAttribute('href')||''))return;
    if(a.hasAttribute('data-ws')){
      var ws=a.getAttribute('data-ws'),setW=function(f){f.workshop.value=ws;var p=f.parentNode.querySelector('[data-pass]');if(p)p.textContent=ws};
      if(inline.ws){e.preventDefault();fillWs(inline.ws);goTo(inline.ws,setW)}
      else if(window.HTMLDialogElement){e.preventDefault();popup('ws',setW)}
    }else{
      var t=a.getAttribute('data-kontakt'),setK=function(f){if(t&&AMNEN.indexOf(t)>=0)f.amne.value=t};
      if(inline.kontakt){e.preventDefault();goTo(inline.kontakt,setK)}
      else if(window.HTMLDialogElement){e.preventDefault();popup('kontakt',setK)}
    }
  });
})();
