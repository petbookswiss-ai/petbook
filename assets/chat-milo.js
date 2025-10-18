
(function(){
  const CGV_DEFAULT={
    prix_non_negociable:"Le prix indiqué sur l’annonce est ferme et non négociable.",
    palier_tarif_annonce:"≥ 100 CHF : frais d’annonce requis. < 100 CHF : publication gratuite.",
    kyc_obligatoire:"Pour vendre : pièce d’identité + téléphone suisse (+41) requis.",
    chats_vaccination:"Chats de gouttière non vaccinés : prix ≤ 10 CHF ou gratuit.",
    contact:"Tu peux écrire à l’équipe : petbookswiss@gmail.com"
  };
  let CGV=CGV_DEFAULT;

  // Try to fetch cgv.json (works on server; file:// may block -> fallback)
  fetch('assets/cgv.json').then(r=>r.json()).then(j=>{ CGV = Object.assign({}, CGV_DEFAULT, j||{}); }).catch(()=>{});

  function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }

  // Floating button (always visible)
  const fab = el(`<button id="milo-fab" aria-label="Parler avec Milo"><span class="dog">🐶</span><span>Parle avec Milo</span></button>`);
  const panel = el(`<section id="milo-panel" role="dialog" aria-label="Assistant Milo">
    <div id="milo-head"><div class="title">🐶 Milo</div><button id="milo-close" class="btn">Fermer</button></div>
    <div id="milo-body" aria-live="polite"></div>
    <div class="milo-suggests" id="milo-suggests" style="padding:0 14px 6px"></div>
    <div id="milo-foot"><input id="milo-input" placeholder="Écris ta question…"><button id="milo-send">Envoyer</button></div>
  </section>`);
  document.addEventListener('DOMContentLoaded', ()=>{
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    const body=panel.querySelector('#milo-body');
    const input=panel.querySelector('#milo-input');
    const send=panel.querySelector('#milo-send');
    const close=panel.querySelector('#milo-close');
    const suggests=panel.querySelector('#milo-suggests');

    function say(text, me=false){
      const msg=document.createElement('div');
      msg.className = 'milo-msg ' + (me?'milo-me':'milo-bot');
      msg.innerHTML = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function greet(){
      say("Salut, je suis <b>Milo</b> 🐾, ton assistant PetBook ! Pose-moi une question (prix, KYC, vaccination…) ou choisis un raccourci.");
      renderSuggests();
    }

    function renderSuggests(){
      suggests.innerHTML='';
      ['Prix négociable ?','Annonce ≥100 CHF ?','KYC vendeur ?','Chat vacciné ?','Contacter l’équipe'].forEach(txt=>{
        const b=document.createElement('button'); b.className='milo-chip'; b.textContent=txt;
        b.onclick=()=>handle(txt);
        suggests.appendChild(b);
      });
    }

    function detectLang(s){
      if(/[a-z]/i.test(s) && /\b(the|price|hello|how|email|id|vaccin|vaccinated|negotiable)\b/i.test(s)) return 'en';
      // default fr
      return 'fr';
    }

    function faqAnswer(q){
      const t=q.toLowerCase();
      if(t.includes('négociable')||t.includes('negociable')||t.includes('price negotiable')) return CGV.prix_non_negociable;
      if(t.includes('100')||t.includes('payant')||t.includes('frais')||t.includes('price')&&t.includes('100')) return CGV.palier_tarif_annonce;
      if(t.includes('kyc')||t.includes('identit')||t.includes('id')||t.includes('controle')||t.includes('identity')) return CGV.kyc_obligatoire;
      if(t.includes('chat')&&(t.includes('vaccin')||t.includes('vaccine')||t.includes('vaccinated'))) return CGV.chats_vaccination;
      if(t.includes('contacter')||t.includes('contact')||t.includes('email')) return CGV.contact;
      return null;
    }

    function toEN(fr){
      // quick bilingual phrasing
      if(fr===CGV.prix_non_negociable) return "The price shown is firm and non‑negotiable.";
      if(fr===CGV.palier_tarif_annonce) return "Listings ≥ 100 CHF: paid. Under 100 CHF: free.";
      if(fr===CGV.kyc_obligatoire) return "To sell: ID verification + Swiss phone (+41) required.";
      if(fr===CGV.chats_vaccination) return "Non‑vaccinated stray cats: price ≤ 10 CHF or free.";
      return "";
    }

    function handle(q){
      say(q, true);
      const lang = detectLang(q);
      const a = faqAnswer(q);
      if(a){
        if(lang==='en'){
          say(a + "<br><small>"+toEN(a)+"</small>");
        }else{
          say(a);
        }
        return;
      }
      // Not found -> propose actions
      const mail = "mailto:petbookswiss@gmail.com?subject="+encodeURIComponent("Question via Milo")+
                   "&body="+encodeURIComponent("Bonjour PetBook,\n\nJe pose une question via Milo : "+q+"\n\nMerci !");
      say("Je réfléchis… 🐶💭 Je n’ai pas la réponse parfaite. <br>➡️ <a href='"+mail+"'>Envoyer un e‑mail à l’équipe</a> ou écris ‘KYC’, ‘100 CHF’, ‘vaccin’, ‘négociable’. ");
    }

    function toggle(){ panel.style.display = panel.style.display==='flex' ? 'none' : 'flex'; if(panel.style.display==='flex' && body.children.length===0) greet(); }

    fab.addEventListener('click', toggle);
    close.addEventListener('click', toggle);
    send.addEventListener('click', ()=>{ const v=input.value.trim(); if(!v) return; input.value=''; handle(v); });
    input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ const v=input.value.trim(); if(!v) return; input.value=''; handle(v);} });
  });
})();
