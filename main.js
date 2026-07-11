// ── LOADER ──
(function(){
  const bar = document.getElementById('loaderBar');
  const pct = document.getElementById('loaderPct');
  const loader = document.getElementById('loader');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(iv); }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    if (p === 100) setTimeout(() => { loader.classList.add('hide'); setTimeout(()=>loader.remove(),700); }, 300);
  }, 80);
})();

// ── CUSTOM CURSOR ──
(function(){
  const outer = document.getElementById('cursor-outer');
  const inner = document.getElementById('cursor-inner');
  let mx=0,my=0,ox=0,oy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; inner.style.left=mx+'px'; inner.style.top=my+'px'; });
  function animOuter(){ ox+=(mx-ox)*0.12; oy+=(my-oy)*0.12; outer.style.left=ox+'px'; outer.style.top=oy+'px'; requestAnimationFrame(animOuter); }
  animOuter();
})();

// ── STARFIELD ──
(function(){
  const c=document.getElementById('stars'), ctx=c.getContext('2d');
  let stars=[];
  function resize(){ c.width=innerWidth; c.height=innerHeight; }
  function init(){ stars=[]; for(let i=0;i<180;i++) stars.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.2+0.2,a:Math.random(),s:Math.random()*0.003+0.001}); }
  function draw(){ ctx.clearRect(0,0,c.width,c.height); stars.forEach(s=>{ s.a+=s.s; const al=(Math.sin(s.a)+1)/2*0.7+0.1; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(200,200,255,${al})`; ctx.fill(); }); requestAnimationFrame(draw); }
  resize(); init(); draw();
  addEventListener('resize',()=>{resize();init();});
})();

// ── PROJECT TOGGLE ──
function toggleProject(el){ el.nextElementSibling.classList.toggle('open'); }

// ── TYPING EFFECT ──
(function(){
  const roles=['Full-Stack Developer','Game Developer','Cybersecurity Enthusiast'];
  let ri=0,ci=0,del=false;
  const el=document.getElementById('typed');
  function type(){
    const w=roles[ri];
    if(!del){ el.textContent=w.slice(0,++ci); if(ci===w.length){setTimeout(()=>del=true,1800);setTimeout(type,120);return;} }
    else { el.textContent=w.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
    setTimeout(type,del?60:120);
  }
  type();
})();

// ── BACK TO TOP ──
(function(){
  const btn=document.getElementById('btt');
  addEventListener('scroll',()=>{ btn.classList.toggle('show',scrollY>400); });
})();
// ── 3D TILT EFFECT ──
(function () {
  const tiltEls = document.querySelectorAll(
    '.skill-card, .cert-card, .logo-card, .car-card, .edu-card'
  );

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

// ── SCROLL REVEAL ──
(function () {
  const els = document.querySelectorAll(
    '.project-item, .skill-card, .cert-card, .logo-card, .car-card, .edu-card, .sec-label'
  );

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();

// ── PARALLAX STARS ON MOUSEMOVE ──
(function () {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  let tx = 0, ty = 0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth - 0.5) * 20;
    ty = (e.clientY / window.innerHeight - 0.5) * 20;
    canvas.style.transform = `translate(${tx}px, ${ty}px) scale(1.03)`;
  });
})();
