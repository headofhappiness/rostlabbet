/* Röstlabbet – formulär för nya 1:1-elever (Web3Forms).
   Öppnas från länkar/knappar med data-nyelev. Svaren mejlas till Monica, så att hon kan prata
   med eleven innan första lektionen i studion. Använder samma utseende som formular.js (.signup). */
(function(){
  var ACCESS_KEY='cb26195b-d78c-4958-8c57-f7efba1051f3';
  var ENDPOINT='https://api.web3forms.com/submit';
  var MAIL='monica@rostlabbet.se';
  if(!window.HTMLDialogElement)return;

  function opts(list){return list.map(function(o){return '<option>'+o+'</option>'}).join('')}
  var d=null;
  function build(){
    d=document.createElement('dialog');d.className='signup';d.setAttribute('aria-labelledby','ne-t');
    d.innerHTML='<button type="button" class="x" aria-label="Stäng">×</button>'
      +'<div class="in" data-step="form"><h3 id="ne-t">Ny elev hos Monica</h3>'
      +'<p class="lead">Berätta lite om dig, så hör Monica av sig för ett kort samtal innan första lektionen.</p>'
      +'<form novalidate>'
      +'<input type="hidden" name="access_key" value="'+ACCESS_KEY+'">'
      +'<input type="hidden" name="subject"><input type="hidden" name="from_name" value="Röstlabbet hemsida">'
      +'<input class="hp" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">'
      +'<label for="ne-name">Namn</label><input id="ne-name" name="namn" autocomplete="name" required>'
      +'<label for="ne-email">E-post</label><input id="ne-email" name="email" type="email" autocomplete="email" required>'
      +'<label for="ne-tel">Telefon</label><input id="ne-tel" name="telefon" type="tel" autocomplete="tel" required>'
      +'<label for="ne-plats">Var vill du ses?</label><select id="ne-plats" name="plats">'+opts(['I studion i Mellbystrand','Online via Zoom','Vet inte än'])+'</select>'
      +'<label for="ne-erf">Har du sjungit eller tagit lektioner tidigare?</label><select id="ne-erf" name="erfarenhet">'+opts(['Nej, det här är första gången','Lite grann','Ja, en del','Ja, mycket'])+'</select>'
      +'<label for="ne-mal">Vad vill du jobba med?</label><textarea id="ne-mal" name="vill_jobba_med" rows="4" required placeholder="Till exempel mer kraft i rösten, en låt du övar på eller inför ett framträdande"></textarea>'
      +'<label for="ne-kalla">Hur hittade du Röstlabbet?</label><select id="ne-kalla" name="hittade_via">'+opts(['Instagram','Google','Tips från någon','Annat'])+'</select>'
      +'<button class="btn" type="submit">Skicka <span class="arrow" aria-hidden="true">→</span></button>'
      +'<p class="err" role="alert" hidden></p>'
      +'<p class="small">Dina uppgifter går bara till Monica. <a href="integritetspolicy.html">Integritetspolicy</a></p>'
      +'</form></div>'
      +'<div class="in" data-step="ok" hidden><h3>Tack!</h3>'
      +'<p>Monica hör av sig inom ett par dagar för ett kort samtal. Sedan bokar ni din första tid.</p>'
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
        err.textContent=bad&&bad.type==='email'?'Kolla e-postadressen.':'Fyll i namn, e-post, telefon och vad du vill jobba med.';
        err.hidden=false;if(bad)bad.focus();return;
      }
      form.subject.value='Ny elev: '+form.namn.value;
      send.disabled=true;
      fetch(ENDPOINT,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success===false)throw 0})})
        .then(function(){
          form.reset();
          d.querySelector('[data-step=form]').hidden=true;d.querySelector('[data-step=ok]').hidden=false;
          d.querySelector('[data-close]').focus();
          if(window.fbq)fbq('track','Lead',{content_name:'Ny elev 1:1'});
          if(window.gtag)gtag('event','generate_lead',{form:'nyelev'});
        })
        .catch(function(){
          err.innerHTML='Det gick inte att skicka just nu. Mejla gärna Monica direkt: <a href="mailto:'+MAIL+'">'+MAIL+'</a>';
          err.hidden=false;
        })
        .then(function(){send.disabled=false});
    });
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-nyelev]');
    if(!a)return;
    e.preventDefault();
    if(!d)build();
    d.querySelector('[data-step=form]').hidden=false;d.querySelector('[data-step=ok]').hidden=true;
    d.showModal();setTimeout(function(){d.querySelector('#ne-name').focus()},50);
  });
})();
