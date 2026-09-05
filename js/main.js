// Neurobloom site — small enhancements only (no framework)
document.addEventListener("DOMContentLoaded", function () {
  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================================
  // Social content slider (homepage-style, like MagOnYou)
  // ============================================================
  var SERIES = [
    {
      id: "ebook",
      title: "ADHD 家長實用指南",
      en: "ADHD Parent Guide — understand · observe · support",
      slides: 9
    },
    {
      id: "girls-intro",
      title: "ADHD in Girls — 唔係得「坐唔定」先係 ADHD",
      en: "Not just \"can't sit still\" — girls with ADHD",
      slides: 6
    },
    {
      id: "girls-masking",
      title: "佢「好乖」？可能係用盡全力 — Masking",
      en: "\"So well-behaved\"? She might be masking",
      slides: 6
    },
    {
      id: "girls-overload",
      title: "佢唔係懶，係個腦超載緊 — 家長實戰 5 步",
      en: "Not lazy — her brain is overloaded. 5 practical steps",
      slides: 6
    }
  ];

  var SINGLES = [
    { id: "post-spiky", cap: "Spiky Profile — 每個孩子都有獨特嘅能力曲線", en: "Spiky profiles: every mind has its own shape" },
    { id: "post-ntnd", cap: "NT vs ND — 神經典型 vs 神經多樣性", en: "Neurotypical vs neurodivergent — what's the difference" },
    { id: "post-signs", cap: "ND 早期跡象 — 早啲識別，早啲支援", en: "Early signs of neurodivergence" },
    { id: "post-strengths", cap: "睇吓佢哋閃亮嘅地方 ✨", en: "Focus on what they shine at" }
  ];

  var base = "assets/content/";
  var chipsEl = document.getElementById("seriesChips");
  var stageEl = document.getElementById("socialStage");
  var imgEl = document.getElementById("socialImg");
  var titleEl = document.getElementById("socialTitle");
  var titleEnEl = document.getElementById("socialTitleEn");
  var dotsEl = document.getElementById("socialDots");
  var prevBtn = document.getElementById("socialPrev");
  var nextBtn = document.getElementById("socialNext");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  var cur = 0;      // current series index
  var idx = 0;      // current slide index
  var touchX = null;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function renderChips() {
    SERIES.forEach(function (s, i) {
      var b = document.createElement("button");
      b.className = "social-chip" + (i === cur ? " active" : "");
      b.textContent = s.title;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === cur ? "true" : "false");
      b.addEventListener("click", function () {
        cur = i; idx = 0;
        renderChips(); renderSlide();
      });
      chipsEl.appendChild(b);
    });
  }

  function renderDots() {
    dotsEl.innerHTML = "";
    var s = SERIES[cur];
    for (var i = 0; i < s.slides; i++) {
      var d = document.createElement("button");
      d.className = "social-dot" + (i === idx ? " active" : "");
      d.setAttribute("aria-label", "第 " + (i + 1) + " 張");
      (function (n) {
        d.addEventListener("click", function () { idx = n; renderSlide(); });
      })(i);
      dotsEl.appendChild(d);
    }
  }

  function renderSlide() {
    var s = SERIES[cur];
    imgEl.src = base + s.id + "/slide" + pad(idx + 1) + ".webp";
    imgEl.alt = s.title + " — 第 " + (idx + 1) + "/" + s.slides + " 張";
    titleEl.textContent = s.title;
    titleEnEl.textContent = s.en;
    renderDots();
  }

  function go(delta) {
    var s = SERIES[cur];
    idx = (idx + delta + s.slides) % s.slides;
    renderSlide();
  }

  if (chipsEl && imgEl) {
    renderChips();
    renderSlide();

    prevBtn.addEventListener("click", function () { go(-1); });
    nextBtn.addEventListener("click", function () { go(1); });

    // keyboard (left/right)
    stageEl.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
    });

    // touch swipe
    stageEl.addEventListener("touchstart", function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touchX = null;
    }, { passive: true });

    // click slide -> lightbox
    var frame = stageEl.querySelector(".social-frame");
    frame.addEventListener("click", function () {
      openLightbox(imgEl.src);
    });

    // lightweight autoplay while visible (pause on hover/focus)
    var timer = null;
    function start() { stop(); timer = setInterval(function () { go(1); }, 4000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    stageEl.addEventListener("mouseenter", stop);
    stageEl.addEventListener("mouseleave", start);
    stageEl.addEventListener("focusin", stop);
    stageEl.addEventListener("focusout", start);
    start();
  }

  // ---------- singles grid ----------
  var singlesEl = document.getElementById("singlesGrid");
  if (singlesEl) {
    SINGLES.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "single-card";
      var im = document.createElement("img");
      im.src = base + "singles/" + p.id + ".webp";
      im.alt = p.cap;
      im.loading = "lazy";
      var cap = document.createElement("div");
      cap.className = "single-cap";
      cap.innerHTML = p.cap + '<br><small style="font-weight:400;color:#636E72">' + p.en + "</small>";
      card.appendChild(im);
      card.appendChild(cap);
      card.addEventListener("click", function () { openLightbox(im.src); });
      singlesEl.appendChild(card);
    });
  }

  // ---------- lightbox ----------
  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  if (lightbox) {
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // Gentle reveal on scroll for cards
  var cards = document.querySelectorAll(".about-card, .topic-card, .resource-card, .single-card");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach(function (c) {
      c.style.opacity = "0";
      c.style.transform = "translateY(18px)";
      c.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      io.observe(c);
    });
  }
});
