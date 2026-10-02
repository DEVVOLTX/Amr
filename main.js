/* ════════════════════════════════════════════
   LOADER
════════════════════════════════════════════ */
(function(){
  const bar=document.getElementById('loaderBar');
  const pct=document.getElementById('loaderPct');
  const status=document.getElementById('loaderStatus');
  const loader=document.getElementById('loader');
  const steps=['Initializing...','Loading assets...','Preparing 3D...','Almost ready...','Done!'];
  let p=0,si=0;
  const iv=setInterval(()=>{
    p+=Math.random()*12+2;
    if(p>=100){p=100;clearInterval(iv);}
    bar.style.width=p+'%';
    pct.textContent=Math.floor(p)+'%';
    const si2=Math.min(Math.floor(p/25),steps.length-1);
    if(si2!==si){si=si2;status.textContent=steps[si];}
    if(p>=100){
      status.textContent='Done!';
      setTimeout(()=>{
        // GSAP fade out loader
        if(window.gsap){
          gsap.to(loader,{opacity:0,duration:.8,ease:'power2.inOut',onComplete:()=>{loader.remove();initGSAP();}});
        } else {
          loader.style.opacity='0';loader.style.transition='opacity .8s';
          setTimeout(()=>{loader.remove();initGSAP();},800);
        }
      },400);
    }
  },70);
})();

/* ════════════════════════════════════════════
   LENIS SMOOTH SCROLL
════════════════════════════════════════════ */
let lenis;
window.addEventListener('load',()=>{
  if(window.Lenis){
    lenis=new Lenis({duration:1.2,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smooth:true});
    function raf(time){lenis.raf(time);requestAnimationFrame(raf);}
    requestAnimationFrame(raf);
    // Connect GSAP ScrollTrigger with Lenis
    if(window.gsap&&window.ScrollTrigger){
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(time=>lenis.raf(time*1000));
    }
  }
});

/* ════════════════════════════════════════════
   GSAP ANIMATIONS
════════════════════════════════════════════ */
function initGSAP(){
  if(!window.gsap)return;
  gsap.registerPlugin(ScrollTrigger,TextPlugin);

  // Hero animations timeline
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.to('.hero-tag',{opacity:1,y:0,duration:.8,delay:.2})
    .from('.hero-name .w',{y:100,opacity:0,duration:.9},'-=.4')
    .from('.hero-name .g',{y:100,opacity:0,duration:.9},'-=.7')
    .to('.hero-role',{opacity:1,duration:.6},'-=.4')
    .to('.hero-desc',{opacity:1,y:0,duration:.7},'-=.3')
    .to('.hero-btns',{opacity:1,y:0,duration:.6},'-=.4')
    .to('.hero-stats',{opacity:1,y:0,duration:.6},'-=.3')
    .to('.avatar-wrap',{opacity:1,scale:1,duration:.8,ease:'back.out(1.4)'},'-=.8');

  // Scroll-triggered animations
  gsap.utils.toArray('.project-item').forEach((el,i)=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'},
      opacity:0,y:50,duration:.7,delay:i*.1,ease:'power2.out'
    });
  });

  gsap.utils.toArray('.skill-card').forEach((el,i)=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'},
      opacity:0,y:30,scale:.95,duration:.5,delay:i*.07,ease:'back.out(1.5)'
    });
  });

  gsap.utils.toArray('.cert-card').forEach((el,i)=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'},
      opacity:0,x:i%2===0?-40:40,duration:.6,delay:i*.1,ease:'power2.out'
    });
  });

  gsap.utils.toArray('.stat-card').forEach((el,i)=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'},
      opacity:0,y:30,duration:.5,delay:i*.1,ease:'power2.out'
    });
  });

  gsap.utils.toArray('.logo-card,.car-card').forEach((el,i)=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'},
      opacity:0,scale:.9,duration:.5,delay:i*.08,ease:'back.out(1.3)'
    });
  });

  gsap.utils.toArray('.sec-label').forEach(el=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 90%'},
      opacity:0,x:-30,duration:.6,ease:'power2.out'
    });
  });

  gsap.utils.toArray('.edu-card').forEach(el=>{
    gsap.from(el,{
      scrollTrigger:{trigger:el,start:'top 88%'},
      opacity:0,x:-30,duration:.6,ease:'power2.out'
    });
  });
}

/* ════════════════════════════════════════════
   CUSTOM CURSOR + TRAILS
════════════════════════════════════════════ */
(function(){
  const ring=document.getElementById('cur-ring');
  const dot=document.getElementById('cur-dot');
  const glow=document.getElementById('mouse-glow');
  let mx=0,my=0,rx=0,ry=0;
  const trails=[];
  const TRAIL_COUNT=8;
  const colors=['rgba(0,212,232,','rgba(0,185,205,','rgba(0,155,175,','rgba(0,125,145,','rgba(11,100,115,','rgba(11,89,101,','rgba(8,70,80,','rgba(6,56,64,'];

  // Create trail dots
  for(let i=0;i<TRAIL_COUNT;i++){
    const t=document.createElement('div');
    t.className='cur-trail';
    t.style.cssText=`width:${8-i}px;height:${8-i}px;background:${colors[i]}${0.6-i*0.07})`;
    document.body.appendChild(t);
    trails.push({el:t,x:0,y:0});
  }

  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    glow.style.left=mx+'px'; glow.style.top=my+'px';
  });

  (function anim(){
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';

    // Trail positions with lag
    trails[0].x+=(mx-trails[0].x)*.35;
    trails[0].y+=(my-trails[0].y)*.35;
    for(let i=1;i<TRAIL_COUNT;i++){
      trails[i].x+=(trails[i-1].x-trails[i].x)*.35;
      trails[i].y+=(trails[i-1].y-trails[i].y)*.35;
      trails[i].el.style.left=trails[i].x+'px';
      trails[i].el.style.top=trails[i].y+'px';
    }
    trails[0].el.style.left=trails[0].x+'px';
    trails[0].el.style.top=trails[0].y+'px';
    requestAnimationFrame(anim);
  })();
})();

/* ════════════════════════════════════════════
   PARTICLES BACKGROUND
════════════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('bg-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,particles=[],mouse={x:-999,y:-999};

  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  resize(); window.addEventListener('resize',resize);
  document.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

  for(let i=0;i<100;i++){
    particles.push({
      x:Math.random()*1920,y:Math.random()*1080,
      z:Math.random()*800+100,
      vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,vz:(Math.random()-.5)*.8,
      size:Math.random()*1.8+.3,
      color:Math.random()>.5?[185,220,229]:[0,212,232],
    });
  }

  function project(x,y,z){
    const fov=500,scale=fov/(fov+z);
    return{x:x*scale+(W/2)*(1-scale),y:y*scale+(H/2)*(1-scale),scale};
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach((p,i)=>{
      p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      if(p.z<0)p.z=800;if(p.z>1000)p.z=0;
      const pr=project(p.x,p.y,p.z);
      const al=(.85-p.z/1100)*pr.scale;
      if(al<=0)return;
      ctx.beginPath();
      ctx.arc(pr.x,pr.y,p.size*pr.scale,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.color.join(',')},${al})`;
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const p2=particles[j];
        const pr2=project(p2.x,p2.y,p2.z);
        const d=Math.hypot(pr.x-pr2.x,pr.y-pr2.y);
        if(d<100){
          ctx.beginPath();ctx.moveTo(pr.x,pr.y);ctx.lineTo(pr2.x,pr2.y);
          ctx.strokeStyle=`rgba(11,140,155,${(1-d/100)*al*.3})`;
          ctx.lineWidth=.4;ctx.stroke();
        }
      }
      const md=Math.hypot(pr.x-mouse.x,pr.y-mouse.y);
      if(md<180){const f=(180-md)/180*.6;p.vx+=(pr.x-mouse.x)/md*f*.025;p.vy+=(pr.y-mouse.y)/md*f*.025;}
      const sp=Math.hypot(p.vx,p.vy);
      if(sp>.7){p.vx=p.vx/sp*.7;p.vy=p.vy/sp*.7;}
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════
   SCROLL PROGRESS
════════════════════════════════════════════ */
(function(){
  const bar=document.getElementById('scroll-progress');
  window.addEventListener('scroll',()=>{
    const pct=scrollY/(document.body.scrollHeight-innerHeight)*100;
    bar.style.width=pct+'%';
  });
})();

/* ════════════════════════════════════════════
   ACTIVE NAV SCROLL SPY
════════════════════════════════════════════ */
(function(){
  const links=document.querySelectorAll('.nav-link');
  const sections=document.querySelectorAll('section[id]');
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        const active=document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if(active)active.classList.add('active');
      }
    });
  },{threshold:.4});
  sections.forEach(s=>obs.observe(s));
})();

/* ════════════════════════════════════════════
   TYPING EFFECT
════════════════════════════════════════════ */
(function(){
  const roles=['Full-Stack Developer','Game Developer','Cybersecurity Enthusiast','Graphic Designer'];
  let ri=0,ci=0,del=false;
  const el=document.getElementById('typed');
  if(!el)return;
  function type(){
    const w=roles[ri];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){setTimeout(()=>del=true,2000);setTimeout(type,120);return;}}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;ri=(ri+1)%roles.length;}}
    setTimeout(type,del?50:120);
  }
  type();
})();

/* ════════════════════════════════════════════
   PROJECT TOGGLE
════════════════════════════════════════════ */
document.addEventListener('click',e=>{
  const h=e.target.closest('.project-header');
  if(!h)return;
  const body=h.nextElementSibling;
  const isOpen=body.classList.toggle('open');
  h.setAttribute('aria-expanded',isOpen);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'){
    const h=e.target.closest('.project-header');
    if(h)h.click();
  }
});

/* ════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════ */
(function(){
  const lb=document.getElementById('lightbox');
  const img=document.getElementById('lightbox-img');
  const counter=document.getElementById('lb-counter');
  let current=0,group=[];

  function open(src,alt,g,idx){
    group=g;
    current=idx;

    // Reset first to ensure UI updates on mobile
    img.style.opacity='0';

    img.src=src;
    img.alt=alt||'';
    counter.textContent=`${idx+1} / ${g.length}`;

    lb.classList.add('open');
    document.body.style.overflow='hidden';

    // Fade in once image loads (prevents 'broken' state on slow networks)
    img.onload=()=>{ img.style.opacity='1'; };
    img.onerror=()=>{ img.style.opacity='1'; img.alt='Image failed to load'; };

    // Focus close button for accessibility
    const closeBtn=document.querySelector('.lb-close');
    closeBtn?.focus?.();
  }

  function close(){
    lb.classList.remove('open');
    document.body.style.overflow='';
  }

  function navigate(dir){
    current=(current+dir+group.length)%group.length;
    const el=group[current];
    img.style.opacity='0';
    setTimeout(()=>{
      img.src=el.dataset.lb;
      img.alt=el.querySelector('img')?.alt||'';
      counter.textContent=`${current+1} / ${group.length}`;
      img.style.opacity='1';
    },150);
  }

  img.style.transition='opacity .15s';

  document.addEventListener('click',e=>{
    const card=e.target.closest('[data-lb]');
    if(!card) return;

    const groupName=card.dataset.lbGroup;
    const allInGroup=[...document.querySelectorAll(`[data-lb-group="${groupName}"]`)];
    const idx=allInGroup.indexOf(card);

    // Safety: if something went wrong, don't open a broken state
    if(idx < 0 || !allInGroup.length) return;

    const innerImg=card.querySelector('img');
    open(card.dataset.lb, innerImg?.alt, allInGroup, idx);
  });

  const closeBtn=document.querySelector('.lb-close');
  const prevBtn=document.querySelector('.lb-prev');
  const nextBtn=document.querySelector('.lb-next');

  closeBtn?.addEventListener('click',close);
  prevBtn?.addEventListener('click',()=>navigate(-1));
  nextBtn?.addEventListener('click',()=>navigate(1));

  lb.addEventListener('click',e=>{if(e.target===lb)close();});

  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')navigate(-1);
    if(e.key==='ArrowRight')navigate(1);
  });
})();

/* ════════════════════════════════════════════
   COMMAND PALETTE
════════════════════════════════════════════ */
(function(){
  const overlay=document.getElementById('cmd-overlay');
  const input=document.getElementById('cmd-input');
  const results=document.getElementById('cmd-results');

  const commands=[
    {icon:'🏠',label:'Go to Home',shortcut:'',action:()=>{lenis?lenis.scrollTo('#hero'):scrollTo(0,0);}},
    {icon:'👤',label:'About Me',shortcut:'',action:()=>{lenis?lenis.scrollTo(document.getElementById('about')):document.getElementById('about').scrollIntoView();}},
    {icon:'💼',label:'Projects',shortcut:'',action:()=>{document.getElementById('projects').scrollIntoView({behavior:'smooth'});}},
    {icon:'🛡️',label:'Skills',shortcut:'',action:()=>{document.getElementById('skills').scrollIntoView({behavior:'smooth'});}},
    {icon:'🏆',label:'Certificates',shortcut:'',action:()=>{document.getElementById('certificates').scrollIntoView({behavior:'smooth'});}},
    {icon:'🎨',label:'Logo Projects',shortcut:'',action:()=>{document.getElementById('logo-projects').scrollIntoView({behavior:'smooth'});}},
    {icon:'🎨',label:'Graphic Portfolio',shortcut:'',action:()=>{window.location.href='https://devvoltx.github.io/Graphic-Protofolio-By-Amr/';}},
    {icon:'🚗',label:'Car Projects',shortcut:'',action:()=>{document.getElementById('car-projects').scrollIntoView({behavior:'smooth'});}},
    {icon:'📬',label:'Contact',shortcut:'',action:()=>{document.getElementById('contact').scrollIntoView({behavior:'smooth'});}},
    {icon:'📄',label:'Download CV',shortcut:'',action:()=>{const a=document.createElement('a');a.href='amr_essam_cv.pdf';a.download='';a.click();}},
    {icon:'📋',label:'Copy Email',shortcut:'',action:()=>{navigator.clipboard.writeText('amrt6509@gmail.com');showToast('Email copied!','success');}},
    {icon:'🌙',label:'Toggle Dark/Light',shortcut:'',action:()=>{document.getElementById('theme-toggle').click();}},
    {icon:'⤢',label:'Share Portfolio',shortcut:'',action:()=>{document.getElementById('share-btn').click();}},
    {icon:'💬',label:'GitHub',shortcut:'',action:()=>{window.open('https://github.com/DEVVOLTX','_blank');}},
  ];

  let selected=0;

  function open(){
    overlay.classList.add('open');
    input.value='';
    render(commands);
    setTimeout(()=>input.focus(),100);
    document.body.style.overflow='hidden';
  }

  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow='';
  }

  function render(cmds){
    selected=0;
    results.innerHTML='';
    if(!cmds.length){results.innerHTML='<div style="padding:1rem;text-align:center;color:var(--fg-dim);font-family:var(--mono);font-size:.75rem;">No results</div>';return;}
    const div=document.createElement('div');
    div.innerHTML='<div class="cmd-group-label">COMMANDS</div>';
    results.appendChild(div);
    cmds.forEach((c,i)=>{
      const item=document.createElement('div');
      item.className='cmd-item'+(i===0?' selected':'');
      item.setAttribute('role','option');
      item.setAttribute('aria-selected',i===0);
      item.innerHTML=`<span class="cmd-item-icon" aria-hidden="true">${c.icon}</span><span class="cmd-item-label">${c.label}</span>`;
      item.addEventListener('click',()=>{c.action();close();});
      results.appendChild(item);
    });
  }

  input.addEventListener('input',()=>{
    const q=input.value.toLowerCase();
    render(q?commands.filter(c=>c.label.toLowerCase().includes(q)):commands);
  });

  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();overlay.classList.contains('open')?close():open();}
    if(!overlay.classList.contains('open'))return;
    const items=results.querySelectorAll('.cmd-item');
    if(e.key==='Escape')close();
    if(e.key==='ArrowDown'){e.preventDefault();items[selected]?.classList.remove('selected');selected=(selected+1)%items.length;items[selected]?.classList.add('selected');items[selected]?.scrollIntoView({block:'nearest'});}
    if(e.key==='ArrowUp'){e.preventDefault();items[selected]?.classList.remove('selected');selected=(selected-1+items.length)%items.length;items[selected]?.classList.add('selected');items[selected]?.scrollIntoView({block:'nearest'});}
    if(e.key==='Enter'){const filtered=commands.filter(c=>c.label.toLowerCase().includes(input.value.toLowerCase()));if(filtered[selected]){filtered[selected].action();close();}}
  });

  document.getElementById('cmd-trigger').addEventListener('click',open);
  overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
})();

/* ════════════════════════════════════════════
   DARK / LIGHT THEME
════════════════════════════════════════════ */
(function(){
  const btn=document.getElementById('theme-toggle');
  const html=document.documentElement;
  const saved=localStorage.getItem('theme')||'dark';
  html.dataset.theme=saved;
  btn.textContent=saved==='dark'?'🌙':'☀️';

  btn.addEventListener('click',()=>{
    const isDark=html.dataset.theme==='dark';
    html.dataset.theme=isDark?'light':'dark';
    btn.textContent=isDark?'☀️':'🌙';
    localStorage.setItem('theme',html.dataset.theme);
  });
})();

/* ════════════════════════════════════════════
   MAGNETIC BUTTONS
════════════════════════════════════════════ */
(function(){
  document.querySelectorAll('.magnetic-wrap').forEach(wrap=>{
    const btn=wrap.querySelector('a,button');
    wrap.addEventListener('mousemove',e=>{
      const r=wrap.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.3;
      const y=(e.clientY-r.top-r.height/2)*.3;
      btn.style.transform=`translate(${x}px,${y}px)`;
    });
    wrap.addEventListener('mouseleave',()=>{
      btn.style.transform='translate(0,0)';
      btn.style.transition='transform .4s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(()=>btn.style.transition='',400);
    });
  });
})();

/* ════════════════════════════════════════════
   RIPPLE EFFECT
════════════════════════════════════════════ */
document.addEventListener('click',e=>{
  const btn=e.target.closest('.btn-primary,.btn-secondary,.btn-outline');
  if(!btn)return;
  const r=btn.getBoundingClientRect();
  const ripple=document.createElement('span');
  ripple.className='ripple-effect';
  const size=Math.max(r.width,r.height)*2;
  ripple.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
  btn.style.position='relative';btn.style.overflow='hidden';
  btn.appendChild(ripple);
  setTimeout(()=>ripple.remove(),600);
});

/* ════════════════════════════════════════════
   3D TILT ON CARDS
════════════════════════════════════════════ */
(function(){
  document.querySelectorAll('.skill-card,.cert-card,.stat-card,.edu-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(500px) rotateX(${-y*12}deg) rotateY(${x*12}deg) translateZ(8px)`;
    });
    c.addEventListener('mouseleave',()=>{c.style.transform='';});
  });
})();

/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target;
      const target=+el.dataset.count;
      let cur=0;const step=target/50;
      const iv=setInterval(()=>{
        cur+=step;
        if(cur>=target){cur=target;clearInterval(iv);}
        el.textContent=Math.floor(cur)+(el.closest('.stat')?'':'+');
      },30);
      obs.unobserve(el);
    });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
})();

/* ════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════ */
(function(){
  const btn=document.getElementById('btt');
  btn.addEventListener('click',()=>lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>btn.classList.toggle('show',scrollY>500));
})();

/* ════════════════════════════════════════════
   COPY EMAIL
════════════════════════════════════════════ */
document.getElementById('copy-email-btn').addEventListener('click',()=>{
  navigator.clipboard.writeText('amrt6509@gmail.com').then(()=>{
    showToast('✓ Email copied to clipboard!','success');
    const btn=document.getElementById('copy-email-btn');
    btn.textContent='Copied!';
    setTimeout(()=>btn.textContent='Copy',2000);
  });
});

/* ════════════════════════════════════════════
   SHARE PORTFOLIO
════════════════════════════════════════════ */
document.getElementById('share-btn').addEventListener('click',()=>{
  if(navigator.share){
    navigator.share({title:'Amr Essam — Portfolio',text:'Check out my portfolio!',url:'https://devvoltx.github.io/Amr/'});
  } else {
    navigator.clipboard.writeText('https://devvoltx.github.io/Amr/').then(()=>showToast('✓ Portfolio URL copied!','success'));
  }
});

/* ════════════════════════════════════════════
   TOAST NOTIFICATIONS
════════════════════════════════════════════ */
function showToast(msg,type=''){
  const toast=document.getElementById('toast');
  toast.textContent=msg;
  toast.className='show'+(type?' '+type:'');
  clearTimeout(toast._t);
  toast._t=setTimeout(()=>toast.className='',3000);
}

/* ════════════════════════════════════════════
   KEYBOARD NAVIGATION
════════════════════════════════════════════ */
document.addEventListener('keydown',e=>{
  if(e.key==='Tab')document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown',()=>document.body.classList.remove('keyboard-nav'));
