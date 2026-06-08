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