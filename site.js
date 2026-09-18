
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

  // 見出しの各行（<br>区切り）が幅に収まらない場合、収まるまで文字サイズを縮める
  const fitHeads=()=>$$('.hero-title,.jp-heading,.page-title,.address h2').forEach(el=>{
    el.style.fontSize='';
    const cs=getComputedStyle(el), avail=el.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    const src=el.cloneNode(true); $$('small',src).forEach(s=>s.remove());
    const segs=el.classList.contains('hero-title')?$$('.line',el).map(l=>l.innerHTML):src.innerHTML.split(/<br\s*\/?>/i);
    let max=0;
    segs.forEach(seg=>{
      const sp=document.createElement('span');
      sp.innerHTML=seg; sp.style.cssText='position:absolute;visibility:hidden;white-space:nowrap';
      el.appendChild(sp); max=Math.max(max,sp.getBoundingClientRect().width); sp.remove();
    });
    if(avail>0&&max>avail) el.style.fontSize=(parseFloat(cs.fontSize)*avail/max*.97)+'px';
  });
  fitHeads();
  if(document.fonts) document.fonts.ready.then(fitHeads);
  let fitTimer; addEventListener('resize',()=>{clearTimeout(fitTimer);fitTimer=setTimeout(fitHeads,120)});

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
