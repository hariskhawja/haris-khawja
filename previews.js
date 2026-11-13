// Project displays are separate from page behavior so their markup is easy to edit.
// The order book is an illustrative simulation, never a live exchange feed.
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let observer;
  let resizeObserver;
  let replayPaused = false;
  let interestTimer;
  let lastInterestTick = 0;
  const interestStates = new WeakMap();
  const pausedScenes = new Set();

  // An illustrative dungeon layout, not a captured game session.
  function runeMap() {
    const rows = [
      '#############################',
      '#.......#.........#.........#',
      '#.......+.........+....G....#',
      '#.......#.........#.........#',
      '####+#######.##########+#####',
      '#..........#.#..............#',
      '#..@.......+.+....#.........#',
      '#..........#.#....#.........#',
      '####+#######.#####.##########',
      '#..........#......+.........#',
      '#....s.....+......#.........#',
      '#..........#......#.........#',
      '#############################',
    ];
    return rows
      .flatMap((row) =>
        [...row].map((tile) => {
          const type =
            tile === '#'
              ? 'wall'
              : tile === '+'
                ? 'door'
                : tile === 'G'
                  ? 'gem'
                  : tile === 's'
                    ? 'scroll'
                    : 'floor';
          return `<span class="rune-tile rune-tile--${type}">${tile === '+' ? '+' : tile === 's' ? 's' : tile === '#' || tile === 'G' ? '' : '·'}</span>`;
        }),
      )
      .join('');
  }

  // Cuboids share real CSS 3D coordinates: x/y on the table plane, z upwards.
  function cuboid(name, x, y, z, width, depth, height, tag = 'div') {
    return `<${tag} class="scene-box ${name}" style="--x:${x}px;--y:${y}px;--z:${z}px;--w:${width}px;--d:${depth}px;--h:${height}px">
      <span class="box-top"></span><span class="box-front"></span><span class="box-side"></span>
    </${tag}>`;
  }

  // A standard arm robot illustration, not a replica of the team's competition robot.
  function renderVexRobot() {
    const chassis = [
      ['vex-wheel', 12, 5, 2, 24, 12, 25],
      ['vex-wheel', 78, 5, 2, 24, 12, 25],
      ['vex-wheel', 12, 61, 2, 24, 12, 25],
      ['vex-wheel', 78, 61, 2, 24, 12, 25],
      ['vex-metal', 8, 17, 28, 98, 7, 7],
      ['vex-metal', 8, 59, 28, 98, 7, 7],
      ['vex-metal', 10, 20, 28, 7, 45, 7],
      ['vex-metal', 95, 20, 28, 7, 45, 7],
      ['vex-brain', 45, 31, 35, 28, 20, 12],
      ['vex-metal vex-upright', 28, 23, 35, 9, 8, 50],
      ['vex-metal vex-upright', 28, 53, 35, 9, 8, 50],
      ['vex-metal', 28, 23, 82, 9, 38, 6],
    ];
    const arm = [
      ['vex-arm-metal', 0, 0, 0, 72, 6, 6],
      ['vex-arm-metal', 0, 32, 0, 72, 6, 6],
      ['vex-arm-metal', 66, -3, 0, 7, 44, 6],
      ['vex-fork', 73, 0, 0, 17, 6, 5],
      ['vex-fork', 73, 32, 0, 17, 6, 5],
    ];
    return `<span class="vex-robot-assembly">
        <span class="vex-ground-shadow"></span>
        ${chassis.map((part) => cuboid(...part, 'span')).join('')}
        <span class="vex-team-plate">2055A</span>
        <span class="vex-arm-lift">${arm.map((part) => cuboid(...part, 'span')).join('')}</span>
    </span>`;
  }

  function renderCabinetTrophy(award, index) {
    const cup = /champion/i.test(award.award);
    const parts = [
      ['trophy-pedestal', 0, 0, 0, 12, 10, 3],
      ['trophy-metal', 4.5, 3.5, 3, 3, 3, 8],
      ...(cup
        ? [
            ['trophy-metal', 2, 2, 11, 8, 6, 6],
            ['trophy-metal', 0, 0, 17, 12, 10, 3],
            ['trophy-metal', -2, 3, 13, 2, 4, 7],
            ['trophy-metal', 12, 3, 13, 2, 4, 7],
            ['trophy-metal', -2, 3, 19, 4, 4, 2],
            ['trophy-metal', 10, 3, 19, 4, 4, 2],
          ]
        : [
            ['trophy-metal', 2, 3, 9, 8, 4, 12 + (index % 3)],
            ['trophy-metal', 1, 2, 21 + (index % 3), 10, 6, 2],
          ]),
    ];
    const metal = ['gold', 'silver', 'bronze'][index % 3];
    const x = 28 + (index % 5) * 20;
    const shelfHeight = index < 5 ? 98 : 14;
    return `<span class="cabinet-trophy trophy-${metal}" data-award-index="${index}" style="transform:translate3d(${x}px,31px,${shelfHeight}px)">${parts.map((part) => cuboid(...part, 'span')).join('')}</span>`;
  }

  function renderVexScene(awards) {
    const cabinet = [
      ['vex-cabinet-back', 18, 10, 14, 114, 3, 140],
      ['vex-cabinet-frame', 18, 10, 14, 6, 42, 140],
      ['vex-cabinet-frame', 126, 10, 14, 6, 42, 140],
      ['vex-cabinet-frame', 18, 10, 154, 114, 42, 6],
      ['vex-cabinet-frame', 18, 10, 8, 114, 42, 6],
      ['vex-cabinet-shelf', 24, 13, 94, 102, 38, 4],
      ['vex-cabinet-foot', 22, 36, 0, 8, 12, 8],
      ['vex-cabinet-foot', 120, 36, 0, 8, 12, 8],
    ];
    return `<span class="vex-showcase scene-viewport" data-preview-motion data-scene="vex-robot" data-scene-width="400" data-scene-max-scale="0.6" aria-hidden="true">
      <span class="vex-scene-stage"><span class="vex-showcase-world">
        <span class="vex-room-floor"></span>
        ${cabinet.map((part) => cuboid(...part, 'span')).join('')}
        ${awards.map(renderCabinetTrophy).join('')}
        <span class="vex-cabinet-glass"><img src="assets/capybaras.png" alt="" width="38" height="38" loading="lazy"><span class="vex-cabinet-handle"></span></span>
        ${renderVexRobot()}
      </span></span>
    </span>`;
  }

  function smartboardScene() {
    return `<div class="smartboard-preview scene-viewport" data-preview-motion data-scene="whiteboard">
      <div class="smartboard-stage"><div class="smartboard-world">
        <div class="scene-ground"></div>
        ${cuboid('table-leg', 69, 110, 0, 7, 7, 37)}
        ${cuboid('table-leg', 287, 110, 0, 7, 7, 37)}
        ${cuboid('table-leg', 69, 188, 0, 7, 7, 37)}
        ${cuboid('table-leg', 287, 188, 0, 7, 7, 37)}
        ${cuboid('scene-table', 62, 103, 37, 240, 100, 7)}
        <div class="scene-whiteboard">
          <div class="board-projection"><span class="board-code code-one"></span><span class="board-code code-two"></span><span class="board-code code-three"></span><span class="board-code code-four"></span><span class="board-ink"></span></div>
          <span class="board-tray"></span>
        </div>
        <svg class="scene-cables" viewBox="0 0 240 100"><path class="cable-wire" d="M77 60H103Q110 60 110 53V42Q110 35 117 35H146"/><path class="cable-data" d="M77 60H103Q110 60 110 53V42Q110 35 117 35H146"/></svg>
        ${cuboid('scene-laptop-base', 88, 148, 44, 66, 42, 3)}
        <div class="scene-laptop-screen"><span></span><span></span><span></span><i class="laptop-feedback"></i></div>
        <div class="laptop-keyboard"></div>
        ${cuboid('scene-pi', 208, 139, 44, 34, 26, 3)}
        ${cuboid('pi-chip', 217, 146, 47, 12, 12, 3)}
        <div class="pi-pins"></div><span class="pi-led"></span>
        ${cuboid('scene-projector', 178, 106, 44, 53, 32, 14)}
        <span class="projector-lens"></span>
        <div class="projector-beam"></div>
      </div></div>
      <span class="scene-caption">Illustrated hardware setup</span>
    </div>`;
  }

  function bookRows(side) {
    return Array.from({ length: 5 }, (_, index) => {
      const price = side === 'ask' ? 100.05 - index * 0.01 : 99.99 - index * 0.01;
      const size = 120 + index * 83;
      return `<div class="book-row ${side}" style="--depth:${0.22 + index * 0.14}">
        <span class="book-price">${price.toFixed(2)}</span>
        <span class="book-size">${size}</span>
        <span class="book-total">${120 * (index + 1) + (83 * index * (index + 1)) / 2}</span>
      </div>`;
    }).join('');
  }

  function sitePreview(url, title) {
    return `<div class="site-preview">
      <div class="site-preview-bar"><span>${new URL(url).hostname}</span><span>ACTUAL WEBSITE</span></div>
      <div class="site-preview-viewport">
        <iframe src="${url}" title="${title} homepage preview"
          loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"
          referrerpolicy="no-referrer"></iframe>
      </div>
    </div>`;
  }

  const displays = {
    market: () => `<div class="book-terminal" data-order-book>
      <div class="book-title"><span>QMM / ORDER BOOK</span><span>REPLAY DEMO</span></div>
      <div class="book-columns"><span>Price</span><span>Size</span><span>Total</span></div>
      <div class="book-side">${bookRows('ask')}</div>
      <div class="book-mid"><strong>100.00</strong><span>Spread 0.02</span></div>
      <div class="book-side">${bookRows('bid')}</div>
      <div class="book-caption">Illustrative values · order-by-order replay</div>
    </div>`,
    cooking: () => sitePreview('https://letscook-silk.vercel.app/', 'LetsCook'),
    emotions: () =>
      sitePreview('https://emotion-sense-ai.vercel.app/', 'EmotionSense.AI'),
    runes: () => `<div class="rune-scene" data-preview-motion data-scene="runes">
      <div class="rune-hud"><span>VAULT 01 / 05</span><span>SAGE</span></div>
      <div class="rune-map">${runeMap()}<span class="rune-player">@</span></div>
      <div class="rune-legend"><span><b>@</b> Arcanist</span><span><i></i> Cipher Gem</span><span>Illustrative map</span></div>
    </div>`,
    whiteboard: smartboardScene,
    web: () =>
      `<div class="portfolio-preview"><span>HK</span><strong>Software<br>&amp; systems.</strong><small>haris / personal space</small></div>`,
  };

  function update() {
    document
      .querySelectorAll('[data-order-book][data-visible="true"]')
      .forEach((book) => {
        book.querySelectorAll('.book-side').forEach((side) => {
          const rows = [...side.querySelectorAll('.book-row')];
          const row = rows[Math.floor(Math.random() * rows.length)];
          const size = 30 + Math.floor(Math.random() * 880);
          row.querySelector('.book-size').textContent = size;
          row.style.setProperty(
            '--depth',
            (Math.min(96, 12 + size / 10) / 100).toFixed(2),
          );
          let total = 0;
          rows.forEach((item) => {
            total += Number(item.querySelector('.book-size').textContent);
            item.querySelector('.book-total').textContent = total.toLocaleString('en-US');
          });
        });
      });
  }

  function arithmeticProblem() {
    const a = 2 + Math.floor(Math.random() * 47);
    const b = 2 + Math.floor(Math.random() * 11);
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        return { question: `${a} + ${b}`, answer: a + b };
      case 1:
        return { question: `${a + b} − ${b}`, answer: a };
      case 2:
        return { question: `${a} × ${b}`, answer: a * b };
      default:
        return { question: `${a * b} ÷ ${b}`, answer: a };
    }
  }

  // Decorative replays, not the player's score, trophies, or a live match.
  function updateInterests() {
    const now = performance.now();
    const elapsed = Math.min(200, now - lastInterestTick);
    lastInterestTick = now;
    document
      .querySelectorAll('.interest [data-preview-motion][data-running="true"]')
      .forEach((scene) => {
        let state = interestStates.get(scene);
        if (!state) {
          state = {
            elapsed: 0,
            elixir: 5,
            spendAt: 4500 + Math.random() * 3500,
            phase: 'question',
          };
          interestStates.set(scene, state);
        }
        state.elapsed += elapsed;
        if (scene.dataset.scene === 'royale') {
          // Roughly one unit every 2.8 seconds, then a 2–5 unit card spend.
          state.elixir = Math.min(10, state.elixir + elapsed / 2800);
          const fill = scene.querySelector('.elixir-fill');
          if (state.elapsed >= state.spendAt && state.elixir >= 2) {
            const cost = Math.min(
              Math.floor(state.elixir),
              2 + Math.floor(Math.random() * 4),
            );
            state.elixir -= cost;
            state.elapsed = 0;
            state.spendAt = 4500 + Math.random() * 4000;
            fill.style.transitionDuration = '160ms';
          } else {
            fill.style.transitionDuration = '140ms';
          }
          fill.style.transform = `scaleX(${state.elixir / 10})`;
          scene.querySelector('.elixir-value').textContent = Math.floor(state.elixir);
        }
        if (scene.dataset.scene === 'zetamac') {
          const answer = scene.querySelector('.math-answer');
          if (state.phase === 'question' && state.elapsed >= 600) {
            answer.dataset.solved = 'true';
            state.phase = 'answer';
            state.elapsed = 0;
          } else if (state.phase === 'answer' && state.elapsed >= 420) {
            const problem = arithmeticProblem();
            answer.dataset.solved = 'false';
            scene.querySelector('.math-question').textContent = problem.question;
            answer.textContent = `= ${problem.answer}`;
            state.phase = 'question';
            state.elapsed = 0;
          }
        }
      });
  }

  function sync() {
    clearInterval(timer);
    clearInterval(interestTimer);
    document.body.classList.toggle('page-hidden', Boolean(document.hidden));
    const scenesCanRun =
      !motionPreference.matches &&
      !document.hidden &&
      !document.body.classList.contains('motion-paused') &&
      !document.body.classList.contains('modal-open') &&
      !document.body.classList.contains('intro-active');
    document.querySelectorAll('[data-preview-motion]').forEach((scene) => {
      scene.dataset.running = String(
        scenesCanRun &&
          scene.dataset.visible === 'true' &&
          !pausedScenes.has(scene.dataset.scene),
      );
    });
    if (
      document.querySelector(
        '.interest [data-running="true"][data-scene="royale"], .interest [data-running="true"][data-scene="zetamac"]',
      )
    ) {
      lastInterestTick = performance.now();
      interestTimer = setInterval(updateInterests, 120);
    }
    document.querySelectorAll('[data-scene-toggle]').forEach((button) => {
      const paused = pausedScenes.has(button.dataset.sceneToggle);
      button.disabled = motionPreference.matches;
      button.textContent = motionPreference.matches
        ? 'Static preview'
        : paused
          ? 'Play animation'
          : 'Pause animation';
      button.setAttribute('aria-pressed', String(paused));
      const title =
        button.closest('.project-card')?.querySelector('h3')?.textContent || 'project';
      button.setAttribute(
        'aria-label',
        `${paused ? 'Play' : 'Pause'} ${title} animation`,
      );
    });
    const canRun =
      !replayPaused &&
      !motionPreference.matches &&
      !document.hidden &&
      !document.body.classList.contains('motion-paused') &&
      !document.body.classList.contains('modal-open') &&
      !document.body.classList.contains('intro-active') &&
      document.querySelector('[data-order-book][data-visible="true"]');
    if (canRun) timer = setInterval(update, 220);
    document.querySelectorAll('[data-replay-toggle]').forEach((button) => {
      button.disabled = motionPreference.matches;
      button.textContent = motionPreference.matches
        ? 'Static replay'
        : replayPaused
          ? 'Resume replay'
          : 'Pause replay';
      button.setAttribute('aria-pressed', String(replayPaused));
    });
  }

  function refresh() {
    observer?.disconnect();
    resizeObserver?.disconnect();
    if ('ResizeObserver' in window) {
      resizeObserver = new window.ResizeObserver((entries) =>
        entries.forEach((entry) => {
          const frame = entry.target.querySelector('iframe');
          if (frame) frame.style.transform = `scale(${entry.contentRect.width / 1280})`;
          if (entry.target.classList.contains('scene-viewport')) {
            entry.target.style.setProperty(
              '--scene-scale',
              Math.min(
                Number(entry.target.dataset.sceneMaxScale) || 0.92,
                entry.contentRect.width /
                  (Number(entry.target.dataset.sceneWidth) || 500),
              ),
            );
          }
        }),
      );
      document
        .querySelectorAll('.site-preview-viewport, .scene-viewport')
        .forEach((viewport) => resizeObserver.observe(viewport));
    }
    const books = document.querySelectorAll(
      '[data-order-book], [data-status="in-progress"], [data-preview-motion]',
    );
    books.forEach((book) => {
      book.dataset.visible = 'false';
    });
    if ('IntersectionObserver' in window) {
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.dataset.visible = String(entry.isIntersecting);
          });
          sync();
        },
        { threshold: 0.15 },
      );
      books.forEach((book) => observer.observe(book));
    } else {
      books.forEach((book) => {
        book.dataset.visible = 'true';
      });
    }
    sync();
  }

  document.addEventListener('click', (event) => {
    const sceneButton = event.target.closest('[data-scene-toggle]');
    if (sceneButton) {
      const name = sceneButton.dataset.sceneToggle;
      if (pausedScenes.has(name)) pausedScenes.delete(name);
      else pausedScenes.add(name);
      sync();
      return;
    }
    if (!event.target.closest('[data-replay-toggle]')) return;
    replayPaused = !replayPaused;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  motionPreference.addEventListener?.('change', sync);

  window.projectPreviews = {
    render: (project) => displays[project.art]?.() || '',
    refresh,
    sync,
    renderVexScene,
  };
})();
