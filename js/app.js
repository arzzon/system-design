(function () {
  'use strict';

  /* ========== GLOBALS ========== */
  const SD = (window.SD = window.SD || {});
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];

  const app = $('#app');
  const overlay = $('#tooltip-overlay');
  const ttTitle = $('#tooltip-title');
  const ttBody = $('#tooltip-body');
  const ttClose = $('#tooltip-close');
  const themeBtn = $('#theme-toggle');
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  const backTop = $('#back-to-top');

  let route = 'home';
  let detail = null;

  /* ========== VISITED TRACKING ========== */
  function getVisited() {
    try { return JSON.parse(localStorage.getItem('sd-visited-concepts') || '[]'); } catch(e) { return []; }
  }
  function markVisited(id) {
    var visited = getVisited();
    if (visited.indexOf(id) === -1) { visited.push(id); localStorage.setItem('sd-visited-concepts', JSON.stringify(visited)); }
  }
  function isVisited(id) { return getVisited().indexOf(id) !== -1; }

  /* ========== THEME ========== */
  function initTheme() {
    const saved = localStorage.getItem('sd-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sd-theme', next);
  }

  /* ========== TOOLTIPS ========== */
  function showTooltip(term) {
    const d = (SD.tooltipData || {})[term];
    if (!d) return;
    ttTitle.textContent = d.title || term;
    let html = '<p>' + d.definition + '</p>';
    if (d.related && d.related.length) {
      html += '<div class="tooltip-related"><strong>Related Concepts:</strong> ' + d.related.join(', ') + '</div>';
    }
    ttBody.innerHTML = html;
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function hideTooltip() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* ========== KEYWORD PROCESSING ========== */
  function kw(html) {
    if (!html) return '';
    return html.replace(/\{\{(.+?)\}\}/g, function (_, term) {
      var key = term.trim();
      if (SD.tooltipData && SD.tooltipData[key]) {
        return '<span class="keyword" data-term="' + key.replace(/"/g, '&quot;') + '">' + key + '</span>';
      }
      return key;
    });
  }

  /* ========== ROUTING ========== */
  function go(r, d) {
    route = r;
    detail = d || null;
    render();
    window.scrollTo({ top: 0 });
    // update nav
    $$('.nav-link').forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-route') === r);
    });
    // close mobile menu
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }

  function render() {
    switch (route) {
      case 'home': renderLanding(); break;
      case 'concepts': detail ? renderConceptDetail(detail) : renderConceptsList(); break;
      case 'progressive': detail !== null ? renderProgressiveStage(detail) : renderProgressiveOverview(); break;
      case 'problems': detail ? renderProblemDetail(detail) : renderProblemsList(); break;
      default: renderLanding();
    }
    bindLinks();
    bindKeywords();
  }

  function bindLinks() {
    $$('[data-route]').forEach(function (el) {
      el.onclick = function (e) {
        e.preventDefault();
        go(el.getAttribute('data-route'), el.getAttribute('data-detail') || null);
      };
    });
  }

  function bindKeywords() {
    $$('.keyword[data-term]').forEach(function (el) {
      el.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        showTooltip(el.getAttribute('data-term'));
      };
    });
  }

  /* ========== RENDER: LANDING ========== */
  function renderLanding() {
    app.innerHTML =
      '<section class="hero">' +
      '<div class="container">' +
      '<div class="hero-badge">🎯 Senior & Staff-Level Interview Prep</div>' +
      '<h1 class="hero-title">Master <span class="gradient-text">System Design</span></h1>' +
      '<p class="hero-subtitle">Three proven learning paths to ace your system design interviews. From foundational concepts to real-world architecture — build the expertise top tech companies demand.</p>' +
      '<div class="path-cards">' +

      '<div class="path-card animate-in" data-route="concepts">' +
      '<div class="path-card-icon">📚</div>' +
      '<h2>Core Concepts</h2>' +
      '<p>Master fundamental building blocks — load balancers, caching, databases, sharding, and more. Each concept explained with diagrams, trade-offs, and real-world context.</p>' +
      '<span class="path-card-cta">Start Learning →</span>' +
      '</div>' +

      '<div class="path-card featured animate-in" data-route="progressive">' +
      '<div class="path-card-badge">Recommended</div>' +
      '<div class="path-card-icon">🏗️</div>' +
      '<h2>Learn by Building</h2>' +
      '<p>Build a food delivery platform from scratch. Start with a simple server, encounter real problems at scale, and layer system design concepts one at a time.</p>' +
      '<span class="path-card-cta">Start Building →</span>' +
      '</div>' +

      '<div class="path-card animate-in" data-route="problems">' +
      '<div class="path-card-icon">💡</div>' +
      '<h2>Interview Problems</h2>' +
      '<p>Practice with real interview questions — URL shorteners, chat systems, news feeds, and more. Each solved step-by-step, exactly as you\'d present in an interview.</p>' +
      '<span class="path-card-cta">Start Solving →</span>' +
      '</div>' +

      '</div>' +
      '</div>' +
      '</section>';
  }

  /* ========== RENDER: CONCEPTS LIST ========== */
  function renderConceptsList() {
    var concepts = SD.concepts || [];
    var cards = concepts.map(function (c) {
      var visitedCls = isVisited(c.id) ? ' visited' : '';
      return '<div class="concept-card animate-in' + visitedCls + '" data-route="concepts" data-detail="' + c.id + '">' +
        '<div class="concept-card-icon">' + c.icon + '</div>' +
        '<h3>' + c.title + '</h3>' +
        '<p>' + c.tagline + '</p>' +
        (isVisited(c.id) ? '<span class="visited-badge">✓ Read</span>' : '') +
        '<span class="card-link">Learn more →</span>' +
        '</div>';
    }).join('');

    app.innerHTML =
      '<section class="page-header">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <span>Core Concepts</span></nav>' +
      '<h1>📚 Core System Design Concepts</h1>' +
      '<p class="page-subtitle">Master the fundamental building blocks. Click any concept to dive deep with diagrams, trade-offs, and real-world examples.</p>' +
      '</div>' +
      '</section>' +
      '<section class="container">' +
      '<div class="card-grid">' + cards + '</div>' +
      '</section>';
  }

  /* ========== RENDER: CONCEPT DETAIL ========== */
  function renderConceptDetail(id) {
    var concepts = SD.concepts || [];
    var idx = concepts.findIndex(function (x) { return x.id === id; });
    var c = concepts[idx];
    if (!c) { go('concepts'); return; }

    // Mark as visited
    markVisited(c.id);

    var sections = '';

    sections += sec('📖 What is it?', '<div class="section-content">' + kw(c.description) + '</div>');
    sections += sec('🎯 Why is it Needed?', pointList(c.whyNeeded));
    sections += sec('✅ Problems It Solves', pointList(c.problemsSolved));
    sections += sec('🔍 How It Works', '<div class="section-content">' + kw(c.howItWorks) + '</div>' +
      (c.diagram ? '<div class="diagram-container">' + kw(c.diagram) + '</div>' : ''));
    sections += sec('⚠️ Limitations & Trade-offs', pointList(c.limitations, 'warning'));
    sections += sec('🌍 Real-World Examples', pointList(c.realWorldExamples, 'examples'));

    // Build prev/next navigation
    var nav = '<div class="detail-nav" style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">';
    if (idx > 0) {
      nav += '<a href="#" class="btn btn-secondary" data-route="concepts" data-detail="' + concepts[idx - 1].id + '">← ' + concepts[idx - 1].title + '</a>';
    }
    nav += '<a href="#" class="btn btn-secondary" data-route="concepts">↑ All Concepts</a>';
    if (idx < concepts.length - 1) {
      nav += '<a href="#" class="btn btn-primary" data-route="concepts" data-detail="' + concepts[idx + 1].id + '">Next: ' + concepts[idx + 1].title + ' →</a>';
    }
    nav += '</div>';

    app.innerHTML =
      '<section class="page-header compact">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <a href="#" data-route="concepts">Concepts</a> <span class="sep">/</span> <span>' + c.title + '</span></nav>' +
      '</div>' +
      '</section>' +
      '<article class="detail-page container">' +
      '<div class="detail-header">' +
      '<span class="detail-icon">' + c.icon + '</span>' +
      '<h1>' + c.title + '</h1>' +
      '<p class="detail-tagline">' + c.tagline + '</p>' +
      '</div>' +
      '<div class="detail-body">' + sections + '</div>' +
      nav +
      '</article>';
  }

  /* ========== RENDER: PROGRESSIVE OVERVIEW ========== */
  function renderProgressiveOverview() {
    var prog = SD.progressive || {};
    var stages = prog.stages || [];

    var timeline = stages.map(function (s, i) {
      var tags = (s.conceptsIntroduced || []).map(function (t) {
        return '<span class="concept-tag">' + t + '</span>';
      }).join('');
      return '<div class="timeline-item" data-route="progressive" data-detail="' + i + '">' +
        '<div class="timeline-dot">' + (i + 1) + '</div>' +
        '<div class="timeline-card">' +
        '<h3>' + s.title + '</h3>' +
        '<p>' + s.subtitle + '</p>' +
        '<div class="timeline-concepts">' + tags + '</div>' +
        '</div>' +
        '</div>';
    }).join('');

    app.innerHTML =
      '<section class="page-header">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <span>Learn by Building</span></nav>' +
      '<h1>🏗️ Learn by Building: ' + (prog.appName || 'QuickBite') + '</h1>' +
      '<p class="page-subtitle">' + (prog.appDescription || '') + '</p>' +
      '</div>' +
      '</section>' +
      '<section class="container">' +
      '<div class="progressive-intro">' +
      '<h2>🍔 The Journey of ' + (prog.appName || 'QuickBite') + '</h2>' +
      '<p>Follow the evolution of a food delivery platform from a single-server MVP to a globally distributed system. Each stage introduces real problems and the system design concepts that solve them.</p>' +
      '</div>' +
      '<div class="timeline">' + timeline + '</div>' +
      '</section>';
  }

  /* ========== RENDER: PROGRESSIVE STAGE ========== */
  function renderProgressiveStage(idx) {
    var prog = SD.progressive || {};
    var stages = prog.stages || [];
    idx = parseInt(idx, 10);
    var s = stages[idx];
    if (!s) { go('progressive'); return; }

    var nav = '<div class="detail-nav" style="display:flex;gap:12px;flex-wrap:wrap;">';
    if (idx > 0) nav += '<a href="#" class="btn btn-secondary" data-route="progressive" data-detail="' + (idx - 1) + '">← Previous Stage</a>';
    nav += '<a href="#" class="btn btn-secondary" data-route="progressive">↑ All Stages</a>';
    if (idx < stages.length - 1) nav += '<a href="#" class="btn btn-primary" data-route="progressive" data-detail="' + (idx + 1) + '">Next Stage →</a>';
    nav += '</div>';

    app.innerHTML =
      '<section class="page-header compact">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <a href="#" data-route="progressive">Learn by Building</a> <span class="sep">/</span> <span>Stage ' + (idx + 1) + '</span></nav>' +
      '</div>' +
      '</section>' +
      '<article class="detail-page container">' +
      '<div class="stage-badge">Stage ' + (idx + 1) + ' of ' + stages.length + '</div>' +
      '<div class="detail-header">' +
      '<h1>' + s.title + '</h1>' +
      '<p class="detail-tagline">' + s.subtitle + '</p>' +
      '</div>' +
      '<div class="detail-body">' + kw(s.content) + '</div>' +
      nav +
      '</article>';
  }

  /* ========== RENDER: PROBLEMS LIST ========== */
  function renderProblemsList() {
    var problems = SD.problems || [];
    var cards = problems.map(function (p) {
      var conceptTags = (p.conceptsCovered || []).map(function (t) {
        return '<span class="concept-tag">' + t + '</span>';
      }).join('');
      return '<div class="problem-card animate-in" data-route="problems" data-detail="' + p.id + '">' +
        '<div class="problem-card-top">' +
        '<span class="problem-card-icon">' + p.icon + '</span>' +
        '<span class="difficulty-badge ' + p.difficulty.toLowerCase() + '">' + p.difficulty + '</span>' +
        '</div>' +
        '<h3>' + p.title + '</h3>' +
        '<p>' + p.description + '</p>' +
        (conceptTags ? '<div class="timeline-concepts" style="margin-bottom:12px;">' + conceptTags + '</div>' : '') +
        '<div class="problem-meta">' +
        '<span>⏱️ ' + p.timeEstimate + '</span>' +
        '<span>📊 ' + (p.companies || '') + '</span>' +
        '</div>' +
        '</div>';
    }).join('');

    app.innerHTML =
      '<section class="page-header">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <span>Interview Problems</span></nav>' +
      '<h1>💡 System Design Interview Problems</h1>' +
      '<p class="page-subtitle">Practice real interview questions solved step-by-step. Each includes clarifying questions, estimations, architecture diagrams, and interviewer tips.</p>' +
      '</div>' +
      '</section>' +
      '<section class="container">' +
      '<div class="card-grid">' + cards + '</div>' +
      '</section>';
  }

  /* ========== RENDER: PROBLEM DETAIL ========== */
  function renderProblemDetail(id) {
    var p = (SD.problems || []).find(function (x) { return x.id === id; });
    if (!p) { go('problems'); return; }

    app.innerHTML =
      '<section class="page-header compact">' +
      '<div class="container">' +
      '<nav class="breadcrumb"><a href="#" data-route="home">Home</a> <span class="sep">/</span> <a href="#" data-route="problems">Interview Problems</a> <span class="sep">/</span> <span>' + p.title + '</span></nav>' +
      '</div>' +
      '</section>' +
      '<article class="detail-page container">' +
      '<div class="detail-header">' +
      '<span class="detail-icon">' + p.icon + '</span>' +
      '<h1>' + p.title + '</h1>' +
      '<div style="display:flex;gap:12px;align-items:center;margin-top:8px;">' +
      '<span class="difficulty-badge ' + p.difficulty.toLowerCase() + '">' + p.difficulty + '</span>' +
      '<span style="font-size:14px;color:var(--text-muted)">⏱️ ' + p.timeEstimate + '</span>' +
      '</div>' +
      '</div>' +
      '<div class="detail-body">' + kw(p.content) + '</div>' +
      '<div class="detail-nav"><a href="#" class="btn btn-secondary" data-route="problems">← Back to Problems</a></div>' +
      '</article>';
  }

  /* ========== HELPERS ========== */
  function sec(title, body) {
    return '<div class="detail-section"><h2>' + title + '</h2>' + body + '</div>';
  }

  function pointList(items, cls) {
    if (!items || !items.length) return '<p style="color:var(--text-muted)">—</p>';
    return '<ul class="point-list ' + (cls || '') + '">' +
      items.map(function (item) { return '<li>' + kw(item) + '</li>'; }).join('') +
      '</ul>';
  }

  /* ========== EVENTS ========== */
  themeBtn.addEventListener('click', toggleTheme);
  ttClose.addEventListener('click', hideTooltip);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) hideTooltip(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTooltip(); });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  window.addEventListener('scroll', function () {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========== INIT ========== */
  initTheme();
  go('home');
})();
