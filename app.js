// 1. SPACE BACKGROUND (Canvas API)

(function initSpaceBg() {
  var canvas = document.getElementById('space-bg');
  var ctx    = canvas.getContext('2d');
  var angle  = 0, stars = [], nebulae = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (var i = 0; i < 500; i++) {
      stars.push({
        x: Math.random() * canvas.width  - canvas.width  / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        r: Math.random() * 2 + 0.3,
        opacity: Math.random() * 0.8 + 0.3,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    nebulae = [];
    var colors = [
      'rgba(255,60,0,','rgba(180,30,0,','rgba(100,15,50,',
      'rgba(30,15,80,', 'rgba(255,120,30,','rgba(200,50,10,'
    ];
    for (var j = 0; j < 9; j++) {
      nebulae.push({
        x: (Math.random()-.5)*canvas.width*1.4, y: (Math.random()-.5)*canvas.height*1.4,
        rx: 180+Math.random()*280, ry: 120+Math.random()*220,
        color: colors[j%colors.length], opacity: .10+Math.random()*.14,
        rot: Math.random()*Math.PI
      });
    }
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var cx = canvas.width/2, cy = canvas.height/2;
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle);
    nebulae.forEach(function(n) {
      ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(n.rot);
      var g = ctx.createRadialGradient(0,0,0,0,0,n.rx);
      g.addColorStop(0,n.color+n.opacity+')'); g.addColorStop(1,n.color+'0)');
      ctx.scale(1,n.ry/n.rx); ctx.beginPath(); ctx.arc(0,0,n.rx,0,Math.PI*2);
      ctx.fillStyle = g; ctx.fill(); ctx.restore();
    });
    var t = Date.now()*.001;
    stars.forEach(function(s) {
      var f = s.opacity*(0.75+0.25*Math.sin(t*1.3+s.twinkle));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(240,225,210,'+f+')'; ctx.fill();
    });
    ctx.restore();
    angle += 0.00012;
    requestAnimationFrame(draw);
  }

  resize(); initStars(); draw();
  window.addEventListener('resize', function(){ resize(); initStars(); });
})();

// 2. SCROLL REVEAL (IntersectionObserver)

(function initScrollReveal() {
  var targets = document.querySelectorAll(
    '.hero-tag,.hero h1,.hero-sub,.hero-cta,.hero-img,.hero-stats,' +
    '.section-label,.section-title,.section-desc,.section-img,' +
    '.info-card,.tech-card,.obj-item,.pub-card,' +
    '.ben-item,.num-card,.ods-badge,.app-pill,.app-pills,' +
    '.impacto-texto,.impacto-numeros,.slideshow-wrapper,.quiz-box,.form-wrapper'
  );
  targets.forEach(function(el,i){
    el.classList.add('reveal');
    el.style.transitionDelay = (i%6)*60+'ms';
  });
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
  targets.forEach(function(el){ obs.observe(el); });
})();

//  3. THEME SWITCHER — 3 temas + localStorage

(function initThemeSwitcher() {
  var temas = {
    fire:   { '--fire':'#ff4500','--fire-dim':'rgba(255,69,0,.15)', '--bg':'#0d0d10','--surface':'#13131a','--border':'rgba(255,69,0,.3)',   '--text':'#f0ece4','--muted':'#7a8694' },
    ocean:  { '--fire':'#00aaff','--fire-dim':'rgba(0,170,255,.15)','--bg':'#020d1a','--surface':'#061525','--border':'rgba(0,170,255,.3)',   '--text':'#d8eeff','--muted':'#5a8094' },
    forest: { '--fire':'#40c060','--fire-dim':'rgba(64,192,96,.15)','--bg':'#030a04','--surface':'#081408','--border':'rgba(64,192,96,.3)',   '--text':'#d8f0da','--muted':'#5a8060' }
  };

  var saved = localStorage.getItem('fw-theme') || 'fire';
  applyTheme(saved); markBtn(saved);

  document.querySelectorAll('.theme-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var t = btn.getAttribute('data-theme');
      applyTheme(t); markBtn(t);
      localStorage.setItem('fw-theme', t);
    });
  });

  function applyTheme(name){
    var v = temas[name]; if(!v) return;
    Object.keys(v).forEach(function(k){ document.documentElement.style.setProperty(k,v[k]); });
  }
  function markBtn(name){
    document.querySelectorAll('.theme-btn').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-theme')===name);
    });
  }
})();

// 4. SLIDESHOW — autoplay + dots + swipe

(function initSlideshow() {
  var slides  = document.querySelectorAll('.slide');
  var dots    = document.querySelectorAll('.dot');
  var prevBtn = document.getElementById('slidePrev');
  var nextBtn = document.getElementById('slideNext');
  var cur = 0, timer = null;

  function goTo(i) {
    slides[cur].classList.remove('active'); dots[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');    dots[cur].classList.add('active');
  }
  function startAuto() { timer = setInterval(function(){ goTo(cur+1); }, 5000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  prevBtn.addEventListener('click', function(){ goTo(cur-1); resetAuto(); });
  nextBtn.addEventListener('click', function(){ goTo(cur+1); resetAuto(); });
  dots.forEach(function(d,i){ d.addEventListener('click', function(){ goTo(i); resetAuto(); }); });

  var tx = 0;
  var el = document.querySelector('.slideshow');
  el.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, {passive:true});
  el.addEventListener('touchend',   function(e){
    var d = tx - e.changedTouches[0].clientX;
    if(Math.abs(d) > 50){ d > 0 ? goTo(cur+1) : goTo(cur-1); resetAuto(); }
  }, {passive:true});

  startAuto();
})();

//  5. QUIZ — 10 perguntas dinâmicas

(function initQuiz() {
  var perguntas = [
    { q:'Qual satélite da NASA detecta focos de calor no Brasil em tempo real?',
      opts:['Hubble','MODIS / VIIRS (FIRMS)','James Webb','Landsat 9'], correta:1,
      exp:'O NASA FIRMS usa MODIS e VIIRS para detectar focos com atualização a cada órbita.' },
    { q:'Quantos focos de calor o Brasil registrou em 2023, segundo o INPE?',
      opts:['50 mil','100 mil','220 mil','500 mil'], correta:2,
      exp:'O INPE registrou mais de 220 mil focos de calor no Brasil em 2023.' },
    { q:'Qual bioma brasileiro teve mais focos de calor em 2023?',
      opts:['Cerrado','Pantanal','Amazônia','Mata Atlântica'], correta:2,
      exp:'A Amazônia concentrou ~95 mil focos em 2023, 43% do total nacional.' },
    { q:'O sensor DHT22 do FireWatch mede quais variáveis?',
      opts:['Fumaça e CO₂','Temperatura e umidade','Pressão e vento','Luminosidade'], correta:1,
      exp:'O DHT22 mede temperatura e umidade relativa do ar.' },
    { q:'Qual ODS está diretamente relacionado à ação climática?',
      opts:['ODS 4','ODS 8','ODS 13','ODS 17'], correta:2,
      exp:'ODS 13 — Ação Climática — visa medidas urgentes contra a mudança do clima.' },
    { q:'Qual o tempo médio de resposta a incêndio sem monitoramento satelital?',
      opts:['1 hora','6 horas','24 horas','72 horas'], correta:3,
      exp:'Sem detecção automática o fogo pode crescer até 72 horas sem resposta.' },
    { q:'Que % das queimadas no Brasil têm origem humana, segundo o INPE?',
      opts:['20%','50%','90%','100%'], correta:2,
      exp:'~90% das queimadas têm origem humana e poderiam ser evitadas.' },
    { q:'O que é o pipeline de alertas do FireWatch?',
      opts:['Cano de combate','Satélite → IoT → Python → notificação','App para bombeiros','Irrigação automática'], correta:1,
      exp:'O pipeline integra dados orbitais, sensores IoT, análise Python e notificações.' },
    { q:'Qual linguagem é usada para análise preditiva de propagação do fogo?',
      opts:['Java','C++','Python','Ruby'], correta:2,
      exp:'Python modela a propagação do fogo com base em vento, umidade e topografia.' },
    { q:'Qual é o banco de dados de queimadas do INPE?',
      opts:['PRODES','FIRMS Brasil','BDQueimadas','SipamSAR'], correta:2,
      exp:'BDQueimadas é a referência nacional do INPE para histórico de focos por bioma e estado.' }
  ];

  var st = { idx:0, pts:0, resps:[], done:false };
  var sBtnStart   = document.getElementById('startQuiz');
  var sBtnNext    = document.getElementById('quizNextBtn');
  var sBtnRestart = document.getElementById('restartQuiz');
  var scStart  = document.getElementById('quizStart');
  var scQ      = document.getElementById('quizQuestion');
  var scResult = document.getElementById('quizResult');

  sBtnStart.addEventListener('click',   iniciar);
  sBtnNext.addEventListener('click',    proxima);
  sBtnRestart.addEventListener('click', iniciar);

  function iniciar() {
    st.idx=0; st.pts=0; st.resps=[]; st.done=false;
    scStart.style.display='none'; scResult.style.display='none'; scQ.style.display='block';
    render();
  }

  function render() {
    var p = perguntas[st.idx]; st.done = false;
    document.getElementById('quizProgressFill').style.width = (st.idx/perguntas.length*100)+'%';
    document.getElementById('quizCounter').textContent = (st.idx+1)+' / '+perguntas.length;
    document.getElementById('quizQuestionText').textContent = p.q;
    var ops = document.getElementById('quizOptions'); ops.innerHTML='';
    p.opts.forEach(function(o,i){
      var b = document.createElement('button'); b.className='quiz-opt-btn'; b.textContent=o;
      b.addEventListener('click', function(){ responder(i,b); });
      ops.appendChild(b);
    });
    sBtnNext.style.display='none';
  }

  function responder(idx, btn) {
    if(st.done) return; st.done=true;
    var p = perguntas[st.idx], ok = idx===p.correta;
    if(ok) st.pts++;
    st.resps.push({ pergunta:p.q, escolhida:p.opts[idx], correta:p.opts[p.correta], acertou:ok, exp:p.exp });
    document.querySelectorAll('.quiz-opt-btn').forEach(function(b,i){
      b.disabled=true;
      if(i===p.correta) b.classList.add('correta');
      else if(i===idx && !ok) b.classList.add('errada');
    });
    sBtnNext.textContent = st.idx < perguntas.length-1 ? 'Próxima →' : 'Ver Resultado';
    sBtnNext.style.display='inline-block';
  }

  function proxima() {
    st.idx++;
    if(st.idx < perguntas.length) { render(); } else { resultado(); }
  }

  function resultado() {
    scQ.style.display='none'; scResult.style.display='block';
    var s=st.pts, t=perguntas.length;
    document.getElementById('quizScore').textContent = s+' / '+t;
    var icon,title,msg;
    if(s===10)    { icon='🏆'; title='Perfeito!';          msg='Você acertou tudo! Especialista em queimadas e tecnologia ambiental.'; }
    else if(s>=7) { icon='🌟'; title='Muito bem!';         msg='Excelente! Você conhece bem o tema.'; }
    else if(s>=5) { icon='👍'; title='Bom resultado!';     msg='Boa base! Continue aprendendo sobre monitoramento de queimadas.'; }
    else          { icon='📚'; title='Continue estudando!'; msg='Explore mais sobre queimadas, biomas e o FireWatch!'; }
    document.getElementById('quizResultIcon').textContent  = icon;
    document.getElementById('quizResultTitle').textContent = title;
    document.getElementById('quizResultMsg').textContent   = msg;
    var rev = document.getElementById('quizReview'); rev.innerHTML='<h4>Revisão:</h4>';
    st.resps.forEach(function(r,i){
      var el = document.createElement('div');
      el.className = 'review-item '+(r.acertou?'acertou':'errou');
      el.innerHTML =
        '<div class="review-num">'+(r.acertou?'✅':'❌')+' '+(i+1)+'</div>'+
        '<div class="review-body">'+
          '<p class="review-q">'+r.pergunta+'</p>'+
          (!r.acertou?'<p class="review-wrong">Sua: '+r.escolhida+'</p>':'')+
          '<p class="review-right">Certa: '+r.correta+'</p>'+
          '<p class="review-exp">'+r.exp+'</p>'+
        '</div>';
      rev.appendChild(el);
    });
  }
})();