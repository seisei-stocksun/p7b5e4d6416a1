
(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress=$('.progress'), header=$('header'), heroImg=$('.hero-visual img, .page-image img');
  let last=0;
  function onScroll(){
    const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
    if(progress) progress.style.width=(max?y/max*100:0)+'%';
    if(header){header.classList.toggle('is-hidden',y>last&&y>180);last=Math.max(y,0)}
    if(heroImg&&!reduced) heroImg.style.transform=`scale(1.05) translateY(${Math.min(y*.045,48)}px)`;
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
  }),{threshold:.13});
  $$('.reveal').forEach(el=>io.observe(el));

  $$('.hero-visual,.page-image,.domains').forEach(el=>el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    el.style.setProperty('--mx',(e.clientX-r.left)+'px');
    el.style.setProperty('--my',(e.clientY-r.top)+'px');
  }));

  const cursor=$('.cursor');
  if(cursor&&matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.style.opacity=1});
    $$('a,button,.domain-item,.scope-card').forEach(el=>{
      el.addEventListener('pointerenter',()=>cursor.classList.add('is-link'));
      el.addEventListener('pointerleave',()=>cursor.classList.remove('is-link'));
    });
  }

  $$('.acc-button').forEach(btn=>btn.addEventListener('click',()=>{
    const item=btn.closest('.acc-item'), panel=$('.acc-panel',item), open=item.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    panel.style.maxHeight=open?panel.scrollHeight+'px':'0px';
  }));

  $$('.to-top').forEach(btn=>btn.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'})));

  const counter=$('[data-count]');
  if(counter&&!reduced){
    const target=Number(counter.dataset.count), start=1900;
    const cio=new IntersectionObserver(([e])=>{
      if(!e.isIntersecting)return;
      cio.disconnect(); const t0=performance.now(), duration=1200;
      const tick=t=>{const p=Math.min((t-t0)/duration,1),q=1-Math.pow(1-p,4);counter.textContent=Math.round(start+(target-start)*q);if(p<1)requestAnimationFrame(tick)};
      requestAnimationFrame(tick);
    });cio.observe(counter);
  }
})();
