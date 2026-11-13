// This file handles behavior. Edit your personal information in content.js.
// Page structure lives in index.html; visual styles live in styles.css.
const portfolio = window.portfolio;
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

function arrowIcon() {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
}

// GitHub mark from Bootstrap Icons. License: assets/bootstrap-icons-LICENSE.txt.
function githubIcon() {
  return '<svg class="github-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>';
}

// Shared rendering helpers: treat editable content as text, not HTML.
function escapeHtml(value) {
  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(value).replace(/[&<>"']/g, (character) => entities[character]);
}

function renderTags(tags) {
  return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
}

function renderProjectStatus(project) {
  if (!project.status) return '';
  const inProgress = /^in progress$/i.test(project.status);
  return `<span class="project-status${inProgress ? ' status-in-progress' : ''}"${inProgress ? ' data-status="in-progress"' : ''}>${escapeHtml(project.status)}</span>`;
}

function getSafeUrl(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function renderExternalLink(value, label) {
  const url = getSafeUrl(value);
  if (!url) return '';

  return /* HTML */ `
    <a
      class="primary-link"
      href="${escapeHtml(url)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${escapeHtml(label)} ↗
    </a>
  `;
}

// 01. Work experience — each role expands to its own projects.
function renderWorkProject(project) {
  return /* HTML */ `
    <article>
      <h4>${escapeHtml(project.title)}</h4>
      <p>${escapeHtml(project.text)}</p>
      <div class="tags">${renderTags(project.tags)}</div>
    </article>
  `;
}

function renderExperience(job) {
  return /* HTML */ `
    <details class="experience glass-surface">
      <summary>
        <span class="experience-light" aria-hidden="true"></span>
        <div class="experience-main">
          <h3 class="experience-title">
            ${job.logo ? `<img class="company-logo" src="${escapeHtml(job.logo)}" alt="" width="32" height="32" loading="lazy" decoding="async">` : ''}
            <span>${escapeHtml(job.company)}</span>
          </h3>
          <span>${escapeHtml(job.role)}<i>·</i>${escapeHtml(job.category)}</span>
          ${job.highlight ? `<p class="experience-highlight">${escapeHtml(job.highlight)}</p>` : ''}
        </div>
        <span class="experience-date">${escapeHtml(job.dates)}</span>
        <span class="expand-icon" aria-hidden="true">+</span>
      </summary>
      <div class="experience-body">
        <p>${escapeHtml(job.description)}</p>
        <div class="job-projects">${job.projects.map(renderWorkProject).join('')}</div>
      </div>
    </details>
  `;
}

// The hero features a real build rather than repeating the skills inventory.
function renderFeaturedProject() {
  const project = portfolio.projects.find(
    (item) => item.id === portfolio.featuredProject,
  );
  const host = select('#hero-feature');
  if (!project) {
    host.hidden = true;
    return;
  }
  host.innerHTML = /* HTML */ `
    <div class="feature-heading">
      <h2>${escapeHtml(project.title)}</h2>
      ${renderProjectStatus(project)}
    </div>
    <div class="feature-art art-${escapeHtml(project.art)}" aria-hidden="true">
      ${window.projectPreviews.render(project)}
    </div>
    <div class="feature-bottom">
      <p>${escapeHtml(project.description)}</p>
      <button
        class="project-open"
        data-project="${escapeHtml(project.id)}"
        aria-haspopup="dialog"
        aria-label="Explore ${escapeHtml(project.title)}"
      >
        Explore the build ${arrowIcon()}
      </button>
      ${project.art === 'market' ? '<button class="replay-control" data-replay-toggle aria-pressed="false">Pause replay</button>' : ''}
    </div>
  `;
  window.projectPreviews.refresh();
}

// 02. Personal projects — categories are derived from content.js.
let selectedFilter = 'All';

function renderProjectCard(project) {
  return /* HTML */ `
    <article
      class="project-card glass-surface"
      aria-labelledby="project-title-${escapeHtml(project.id)}"
    >
      <div class="project-art art-${escapeHtml(project.art)}" aria-hidden="true">
        ${window.projectPreviews.render(project)}
        <span class="project-art-label"
          >${escapeHtml(project.label || 'BUILT PROJECT')}</span
        >
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span>${escapeHtml(project.category)}</span>
          ${renderProjectStatus(project)}
        </div>
        <h3 id="project-title-${escapeHtml(project.id)}">${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="tags">${renderTags(project.tags)}</div>
        <div class="project-actions">
          <button
            class="project-open"
            data-project="${escapeHtml(project.id)}"
            aria-label="View ${escapeHtml(project.title)} project details"
            aria-haspopup="dialog"
          >
            View project ${arrowIcon()}
          </button>
          ${project.art === 'market' ? '<button class="replay-control" data-replay-toggle aria-pressed="false">Pause replay</button>' : ''}
          ${['runes', 'whiteboard'].includes(project.art) ? `<button class="scene-control" data-scene-toggle="${escapeHtml(project.art)}" aria-label="Pause ${escapeHtml(project.title)} animation" aria-pressed="false">Pause animation</button>` : ''}
          ${getSafeUrl(project.github) ? `<a class="project-repository" href="${escapeHtml(getSafeUrl(project.github))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(project.title)} on GitHub" title="GitHub">${githubIcon()}</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

function renderProjects(animateChange = false) {
  const visibleProjects = portfolio.projects.filter(
    (project) => selectedFilter === 'All' || project.category === selectedFilter,
  );

  select('#project-grid').innerHTML = visibleProjects.map(renderProjectCard).join('');
  select('#project-count').textContent = `${visibleProjects.length} projects shown`;
  window.projectPreviews.refresh();
  if (animateChange && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    selectAll('#project-grid > .project-card').forEach((card, index) => {
      card.animate(
        [
          { opacity: 0.45, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 240,
          delay: Math.min(index * 30, 90),
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'backwards',
        },
      );
    });
  }
}

function setupProjectFilters() {
  const categories = [
    'All',
    ...new Set(portfolio.projects.map((project) => project.category)),
  ];

  select('#project-filters').innerHTML = categories
    .map(
      (category, index) => /* HTML */ `
        <button data-filter="${escapeHtml(category)}" aria-pressed="${index === 0}">
          ${escapeHtml(category)}
          ${index === 0 ? `<span>${String(portfolio.projects.length).padStart(2, '0')}</span>` : ''}
        </button>
      `,
    )
    .join('');

  select('#project-filters').addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;

    selectedFilter = button.dataset.filter;
    selectAll('[data-filter]').forEach((filter) => {
      filter.setAttribute('aria-pressed', filter === button);
    });
    renderProjects(true);
  });
}

// Shared detail dialog — native <dialog> handles Escape and focus containment.
const detailDialog = select('#detail-dialog');
let dialogTrigger;

function openDialog(eyebrow, content, trigger) {
  dialogTrigger = trigger;
  select('#dialog-eyebrow').textContent = eyebrow;
  select('#dialog-content').innerHTML = content;
  detailDialog.setAttribute('aria-labelledby', 'dialog-title');
  detailDialog.showModal();
  document.body.classList.add('modal-open');
  window.projectPreviews.sync();
}

function setupDialog() {
  select('.close-button').addEventListener('click', () => detailDialog.close());

  detailDialog.addEventListener('click', (event) => {
    if (event.target !== detailDialog) return;

    // Close only when the click is outside the panel, not on empty panel space.
    const bounds = detailDialog.getBoundingClientRect();
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (clickedOutside) detailDialog.close();
  });

  detailDialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    window.projectPreviews.sync();
    dialogTrigger?.focus();
  });
}

function setupProjectDetails() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-project]');
    if (!button) return;

    const project = portfolio.projects.find((item) => item.id === button.dataset.project);
    if (!project) return;
    const repositoryLink = renderExternalLink(project.github, 'View on GitHub');
    const liveLink = renderExternalLink(project.live, 'Visit website');
    const demoLink = renderExternalLink(project.demo, 'Watch recorded demo');
    const content = /* HTML */ `
      <h2 id="dialog-title">${escapeHtml(project.title)}</h2>
      <div class="tags">${renderTags(project.tags)}</div>
      <p class="dialog-description">${escapeHtml(project.details)}</p>
      ${(project.sections || []).map((section) => `<section class="project-detail-section"><h3>${escapeHtml(section.title)}</h3><p>${escapeHtml(section.text)}</p></section>`).join('')}
      <div class="project-links">
        ${repositoryLink}${liveLink}${demoLink}${(project.resources || []).map((resource) => renderExternalLink(resource.url, resource.label)).join('')}
      </div>
      ${repositoryLink || liveLink || demoLink ? '' : '<div class="widget-note">Project links are coming soon.</div>'}
    `;

    openDialog(
      `${project.category} / ${project.real ? 'BUILT PROJECT' : 'ILLUSTRATIVE CONCEPT'}`,
      content,
      button,
    );
  });
}

// Every résumé skill is visible in a moving lane, generated from content.js.
// The repeated copy is decorative: screen readers encounter each skill once.
function renderSkillShowcase() {
  select('#skill-lanes').innerHTML = portfolio.skillGroups
    .map((group, index) => {
      const chips = group.items
        .map((skill) => `<li class="skill-chip">${escapeHtml(skill)}</li>`)
        .join('');
      return /* HTML */ `
        <div class="skill-lane" style="--lane-duration: ${36 + group.items.length * 2}s">
          <h3 id="skill-lane-${index}">${escapeHtml(group.title)}</h3>
          <div class="skill-window" role="group" aria-labelledby="skill-lane-${index}">
            <div class="skill-track">
              <ul class="skill-batch">
                ${chips}
              </ul>
              <ul class="skill-batch" aria-hidden="true">
                ${chips}
              </ul>
              <ul class="skill-batch" aria-hidden="true">
                ${chips}
              </ul>
            </div>
          </div>
        </div>
      `;
    })
    .join('');

  const pauseButton = select('#skills-pause');
  pauseButton.addEventListener('click', () => {
    const isPaused = pauseButton.getAttribute('aria-pressed') !== 'true';
    pauseButton.setAttribute('aria-pressed', String(isPaused));
    pauseButton.textContent = isPaused ? 'Animate skills' : 'Pause & read skills';
    select('#skills').classList.toggle('is-paused', isPaused);
    document.body.classList.toggle('motion-paused', isPaused);
    window.projectPreviews.sync();
  });
}

// Personal interests use real logos and keep their data in content.js.
function renderFootballHand() {
  const [front, left, right] = portfolio.football.clubs;
  const cards = [
    { club: left, position: 'left' },
    { club: right, position: 'right' },
    { club: front, position: 'front' },
  ];
  return `<span class="football-hand" aria-hidden="true">${cards
    .filter(({ club }) => club)
    .map(
      ({ club, position }) => `
      <span class="football-card football-card--${position}" data-club="${escapeHtml(club.id)}">
        <img src="${escapeHtml(club.logo)}" alt="" width="72" height="85" loading="lazy">
        <span class="football-card-label">${escapeHtml(club.cardLabel)}</span>
      </span>
    `,
    )
    .join('')}</span>`;
}

function renderFootballWidget() {
  return `
    <h2 id="dialog-title">Football</h2>
    <p class="dialog-description">Erin Mills, Real Madrid &amp; Manchester United.</p>
    <ul class="football-clubs">${portfolio.football.clubs
      .map(
        (club) => `
      <li>
        <span class="football-club-mark"><img src="${escapeHtml(club.logo)}" alt="${escapeHtml(club.name)} crest" width="64" height="76"></span>
        <div><h3>${escapeHtml(club.name)}</h3>${renderExternalLink(club.website, 'Official club website')}</div>
      </li>
    `,
      )
      .join('')}</ul>
  `;
}

// Decorative objects rather than scans of the actual award documents.
function renderResearchHand() {
  const { universityAward, capstone } = portfolio.research;
  return `<span class="research-hand" aria-hidden="true">
    <span class="research-plaque">
      <img src="${escapeHtml(universityAward.crest)}" alt="" width="34" height="48" loading="lazy">
      <span class="plaque-inscription">Science Award</span>
      <span class="plaque-year">${escapeHtml(universityAward.year)}</span>
    </span>
    <span class="research-certificate">
      <span class="certificate-ap">AP</span>
      <span class="certificate-title">Capstone<br>Diploma</span>
      <span class="certificate-rule"></span>
      <span class="certificate-topic">${escapeHtml(capstone.paperTopic)}</span>
    </span>
  </span>`;
}

function renderResearchWidget() {
  const { universityAward: award, capstone } = portfolio.research;
  return `<h2 id="dialog-title">Research</h2>
    <div class="research-dialog-art">${renderResearchHand()}</div>
    <p class="research-art-note">Plaque and certificate illustration.</p>
    <section class="research-entry">
      <img class="research-university-logo" src="${escapeHtml(award.logo)}" alt="${escapeHtml(award.institution)}" width="185" height="81">
      <h3>${escapeHtml(award.title)}</h3>
      <p>${escapeHtml(award.group)}<br>${escapeHtml(award.institution)} · ${escapeHtml(award.date)}</p>
      <div class="project-links">${renderExternalLink(award.source, 'View award')}</div>
    </section>
    <section class="research-entry">
      <h3>${escapeHtml(capstone.title)}</h3>
      <p>AP Research paper · ${escapeHtml(capstone.paperTopic)}</p>
      <div class="project-links">${renderExternalLink(capstone.diplomaUrl, 'View diploma')}${renderExternalLink(capstone.paperUrl, 'Read research paper')}</div>
    </section>`;
}

function renderInterests() {
  const awards = portfolio.vex.awards.flatMap((event) =>
    event.award.split('·').map((award) => ({ ...event, award: award.trim() })),
  );
  const items = [
    {
      id: 'research',
      title: 'Research',
      subtitle: 'U of T · AP Capstone',
      art: renderResearchHand(),
    },
    {
      id: 'vex',
      title: '2055A Capybaras',
      subtitle: `VEX Robotics · ${awards.length} awards`,
      art: window.projectPreviews.renderVexScene(awards),
    },
    {
      id: 'zetamac',
      title: 'Zetamac',
      subtitle: `Personal best: ${portfolio.zetamac.highScore}`,
      art: `<span class="zetamac-scene" data-preview-motion data-scene="zetamac" aria-hidden="true"><span class="zetamac-best">${portfolio.zetamac.highScore}</span><span class="math-question">24 × 6</span><span class="math-answer" data-solved="false">= 144</span></span>`,
    },
    {
      id: 'football',
      title: 'Football',
      subtitle: 'Erin Mills · Madrid · United',
      art: renderFootballHand(),
    },
    {
      id: 'royale',
      title: 'Clash Royale',
      subtitle: 'Mega Knight.',
      art: '<span class="royale-scene" data-preview-motion data-scene="royale" aria-hidden="true"><span class="royale-mark"><svg viewBox="0 0 100 100"><path d="M20 32 35 47 50 21 65 47 80 32 73 72H27Z" fill="currentColor"/><path d="M29 79h42" stroke="currentColor" stroke-width="7"/></svg></span><span class="elixir-display"><span class="elixir-value">5</span><span class="elixir-track"><span class="elixir-fill"></span><span class="elixir-segments"></span></span></span></span>',
    },
    {
      id: 'leetcode',
      title: 'LeetCode',
      subtitle: portfolio.leetcode.username,
      art: `<img class="leetcode-mark" src="${escapeHtml(portfolio.leetcode.logo)}" alt="" width="82" height="82" loading="lazy">`,
    },
    /* Mario Kart is parked for now. Uncomment this entry to restore its widget.
    {
      id: 'mariokart',
      title: 'Mario Kart',
      subtitle: 'Wii & 8 Deluxe',
      art: '<span class="kart-scene" data-preview-motion data-scene="kart" aria-hidden="true"><span class="kart-motion"><img src="assets/mario-standard-kart.png" alt="" width="170" height="91" loading="lazy"></span></span>',
    },
    */
    /* Red Bull Racing is parked for now. Uncomment to restore its widget.
    {
      id: 'redbull',
      title: 'Red Bull Racing',
      subtitle: 'Formula 1',
      art: '<span class="f1-scene" data-preview-motion data-scene="f1" aria-hidden="true"><img class="f1-team-mark" src="assets/red-bull-racing.svg" alt="" width="104" height="45" loading="lazy"><span class="f1-road"><span class="f1-car-motion"><img class="f1-car" src="assets/red-bull-car.webp" alt="" width="240" height="53" loading="lazy"></span></span></span>',
    },
    */
  ];
  select('#interest-grid').innerHTML = items
    .map(
      (item) => `
    <button class="interest interest-${item.id} glass-surface" data-interest="${item.id}" aria-haspopup="dialog">
      <span class="interest-art">${item.art}</span>
      <span class="interest-copy"><span class="interest-label">${item.title}</span><small>${item.subtitle}</small></span>
    </button>
  `,
    )
    .join('');
  window.projectPreviews.refresh();
}

function renderRoyaleWidget(player = portfolio.royale, live = false) {
  const hasStats = Number.isFinite(player.trophies);
  const deck = (player.deck || []).slice(0, 8);
  const tag = (player.playerTag || '').replace(/^#/, '');
  const profileLink = tag
    ? renderExternalLink(
        `https://royaleapi.com/player/${encodeURIComponent(tag)}`,
        'Player profile',
      )
    : '';
  return `
    <h2 id="dialog-title">${escapeHtml(player.name || 'Clash Royale')}</h2>
    <div id="royale-live-status" role="status">${live ? 'Updated from Clash Royale' : 'Checking player profile…'}</div>
    ${
      hasStats || tag
        ? `<div class="royale-stats">
      ${hasStats ? `<div><span class="tiny-label">Trophies</span><strong>${escapeHtml(player.trophies)}</strong></div>` : ''}
      ${Number.isFinite(player.bestTrophies) ? `<div><span class="tiny-label">Best trophies</span><strong>${escapeHtml(player.bestTrophies)}</strong></div>` : ''}
      ${tag ? `<div><span class="tiny-label">Player tag</span><strong class="player-tag">#${escapeHtml(tag)}</strong></div>` : ''}
    </div>`
        : ''
    }
    ${
      deck.length
        ? `<h3 class="deck-title">Current deck</h3><div class="deck">${deck
            .map((card) => {
              const name = typeof card === 'string' ? card : card.name;
              const icon = typeof card === 'object' && getSafeUrl(card.icon);
              return `<div class="deck-card">${icon ? `<img src="${escapeHtml(icon)}" alt="" width="80" height="96" loading="lazy">` : ''}<span>${escapeHtml(name)}</span></div>`;
            })
            .join('')}</div>`
        : ''
    }
    <div class="project-links">${profileLink}${renderExternalLink('https://supercell.com/en/games/clashroyale/', 'Clash Royale')}</div>
  `;
}

async function openRoyale(button) {
  openDialog('OFF THE CLOCK / CLASH ROYALE', renderRoyaleWidget(), button);
  try {
    const response = await fetch('/api/clash-royale', {
      signal: AbortSignal.timeout(10000),
    });
    const player = await response.json();
    // Do not replace another widget if the visitor moved on while this loaded.
    if (!detailDialog.open || dialogTrigger !== button) return;
    if (!response.ok || !player.available) throw new Error('Profile unavailable');
    select('#dialog-content').innerHTML = renderRoyaleWidget(player, true);
  } catch {
    if (!detailDialog.open || dialogTrigger !== button) return;
    select('#royale-live-status').textContent = portfolio.royale.playerTag
      ? 'Live stats are unavailable right now. You can still open the player profile.'
      : 'Player profile will appear when the connection is configured.';
  }
}

function renderLeetCodeWidget(stats = portfolio.leetcode.stats, live = false) {
  const account = portfolio.leetcode;
  return `<img class="widget-leetcode-mark" src="${escapeHtml(account.logo)}" alt="" width="72" height="72">
    <h2 id="dialog-title">LeetCode</h2>
    <p class="dialog-description">${escapeHtml(account.username)}</p>
    ${
      stats
        ? `<dl class="leetcode-stats">${[
            ['Solved', stats.total],
            ['Easy', stats.easy],
            ['Medium', stats.medium],
            ['Hard', stats.hard],
            ...(Number.isFinite(stats.ranking) ? [['Global rank', stats.ranking]] : []),
          ]
            .map(
              ([label, value]) =>
                `<div><dt>${label}</dt><dd>${escapeHtml(Number(value).toLocaleString('en-US'))}</dd></div>`,
            )
            .join('')}</dl>`
        : ''
    }
    <p id="leetcode-status" class="profile-status" role="status">${live ? 'Updated from LeetCode.' : stats ? `Snapshot: ${escapeHtml(stats.updatedAt.slice(0, 10))}. Checking for updates…` : 'Checking profile…'}</p>
    <div class="project-links">${renderExternalLink(account.url, 'Profile')}</div>`;
}

async function openLeetCode(button) {
  openDialog('OFF THE CLOCK / LEETCODE', renderLeetCodeWidget(), button);
  try {
    const response = await fetch('/api/leetcode', { signal: AbortSignal.timeout(10000) });
    const stats = await response.json();
    if (!detailDialog.open || dialogTrigger !== button) return;
    if (!response.ok || !stats.available) throw new Error('Profile unavailable');
    select('#dialog-content').innerHTML = renderLeetCodeWidget(stats, true);
  } catch {
    if (!detailDialog.open || dialogTrigger !== button) return;
    select('#leetcode-status').textContent = portfolio.leetcode.stats
      ? `Snapshot: ${portfolio.leetcode.stats.updatedAt}. Live updates are unavailable right now.`
      : 'Stats are unavailable right now. You can still open the profile.';
  }
}

function renderVexWidget() {
  const vex = portfolio.vex;
  return `
    <img class="widget-team-logo" src="assets/capybaras.png" alt="2055A Capybaras logo" width="100" height="100">
    <h2 id="dialog-title">${escapeHtml(vex.team)}</h2>
    <p class="dialog-description">${escapeHtml(vex.description)}</p>
    <div class="project-links">${renderExternalLink(vex.github, '2055A codebase')}${renderExternalLink(vex.programmingSite, 'Programming website')}${renderExternalLink(vex.website, 'Team award history')}</div>
    <section class="project-detail-section"><h3>Selected team awards</h3>
      <p>Team awards from my 2023–2024 seasons, as recorded by Mi3L School.</p>
      <ul class="award-list">${vex.awards.map((item) => `<li><span>${escapeHtml(item.year)}</span><div><strong>${escapeHtml(item.award)}</strong><p>${escapeHtml(item.event)}</p></div></li>`).join('')}</ul>
    </section>
  `;
}

function setupInterests() {
  select('#interest-grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-interest]');
    if (!button) return;
    const interest = button.dataset.interest;
    if (interest === 'royale') {
      openRoyale(button);
      return;
    }
    if (interest === 'vex') {
      openDialog('OFF THE CLOCK / ROBOTICS', renderVexWidget(), button);
      return;
    }
    if (interest === 'zetamac') {
      openDialog(
        'OFF THE CLOCK / MENTAL MATH',
        `
        <h2 id="dialog-title">Zetamac</h2>
        <p class="dialog-description">Fast arithmetic. One more round.</p>
        <div class="zetamac-score"><span>Personal best</span><strong>${portfolio.zetamac.highScore}</strong></div>
        ${renderExternalLink(portfolio.zetamac.url, 'Play Zetamac')}
      `,
        button,
      );
      return;
    }
    if (interest === 'leetcode') {
      openLeetCode(button);
      return;
    }
    if (interest === 'research') {
      openDialog('OFF THE CLOCK / RESEARCH', renderResearchWidget(), button);
      return;
    }
    // Dialogs and artwork for parked interests remain available to restore.
    if (interest === 'mariokart') {
      openDialog(
        'OFF THE CLOCK / RACING',
        `
        <img class="widget-game-art" src="assets/mario-kart-8.png" alt="Mario Kart 8 Deluxe artwork" width="480" height="270">
        <h2 id="dialog-title">Mario Kart</h2>
        <p class="dialog-description">Mario Kart Wii and Mario Kart 8 Deluxe.</p>
        ${renderExternalLink('https://www.nintendo.com/us/store/products/mario-kart-8-deluxe-switch/', 'Mario Kart 8 Deluxe')}
      `,
        button,
      );
      return;
    }
    if (interest === 'redbull') {
      openDialog(
        'OFF THE CLOCK / FORMULA 1',
        `
        <img class="widget-racing-logo" src="assets/red-bull-racing.svg" alt="Oracle Red Bull Racing logo" width="240" height="120">
        <h2 id="dialog-title">Red Bull Racing</h2>
        <p class="dialog-description">The Formula 1 team I follow.</p>
        ${renderExternalLink('https://www.redbullracing.com/int-en', 'Official team website')}
      `,
        button,
      );
      return;
    }
    if (interest === 'football') {
      openDialog('OFF THE CLOCK / FOOTBALL', renderFootballWidget(), button);
    }
  });
}

// Glass light follows the pointer; content never tilts or changes size.
function setupGlassReflections() {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let surface;
  let frame = 0;
  let position;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    surface?.removeAttribute('data-glass-active');
    surface = null;
  };
  const follow = (event) => {
    const next = event.target.closest?.('.glass-surface');
    if (
      !next ||
      !finePointer.matches ||
      reducedMotion.matches ||
      event.pointerType === 'touch'
    ) {
      reset();
      return;
    }
    if (surface !== next) {
      reset();
      surface = next;
    }
    position = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!surface?.isConnected) return reset();
      const bounds = surface.getBoundingClientRect();
      const x = Math.max(0, Math.min(bounds.width, position.x - bounds.left));
      const y = Math.max(0, Math.min(bounds.height, position.y - bounds.top));
      surface.style.setProperty('--glass-x', `${x}px`);
      surface.style.setProperty('--glass-y', `${y}px`);
      surface.style.setProperty('--glass-angle', `${105 + (x / bounds.width) * 45}deg`);
      surface.setAttribute('data-glass-active', 'true');
    });
  };
  // Delegation also covers project cards recreated by category filtering.
  document.addEventListener('pointerover', follow);
  document.addEventListener('pointermove', follow);
  document.addEventListener('pointerout', (event) => {
    if (!surface?.contains(event.relatedTarget)) reset();
  });
  document.addEventListener('pointercancel', reset);
  document.addEventListener('visibilitychange', reset);
  reducedMotion.addEventListener?.('change', reset);
  finePointer.addEventListener?.('change', reset);
}

// Contact channels are direct links, including on small screens.
function getResumePath(version) {
  const path = portfolio.resumes?.[version] || '';
  return /^assets\/[a-z0-9-]+\.pdf$/.test(path) ? path : '';
}

function setupResumeLinks() {
  const versions = [
    { id: 'software', label: 'SWE', description: 'Software engineering' },
    { id: 'quant', label: 'DATQ', description: 'Data & quant' },
  ];
  selectAll('.resume-menu').forEach((menu) => {
    menu.innerHTML = versions
      .filter((version) => getResumePath(version.id))
      .map(
        (version) => `
      <a data-resume="${version.id}" href="${escapeHtml(getResumePath(version.id))}" target="_blank" rel="noopener noreferrer">
        <strong>${version.label}</strong><span>${escapeHtml(version.description)}</span>
        <span class="sr-only">PDF, opens a new tab</span>
      </a>
    `,
      )
      .join('');
  });
  selectAll('[data-resume]').forEach((link) => {
    const path = getResumePath(link.dataset.resume);
    if (path) link.setAttribute('href', path);
    else link.hidden = true;
  });
  const pickers = selectAll('.resume-picker');
  pickers.forEach((picker) => {
    picker.addEventListener('toggle', () => {
      if (picker.open)
        pickers.forEach((other) => {
          if (other !== picker) other.open = false;
        });
    });
  });
  document.addEventListener('click', (event) => {
    pickers.forEach((picker) => {
      if (!picker.contains(event.target) || event.target.closest('[data-resume]'))
        picker.open = false;
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    pickers.forEach((picker) => {
      if (!picker.open) return;
      picker.open = false;
      picker.querySelector('summary').focus();
      event.preventDefault();
    });
  });
}

function renderContactLinks() {
  const contact = portfolio.contact;
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
  const resumes = [
    ['software', 'Software engineering résumé'],
    ['quant', 'Data & quant résumé'],
  ]
    .filter(([version]) => getResumePath(version))
    .map(
      ([version, label]) =>
        `<a href="${escapeHtml(getResumePath(version))}" target="_blank" rel="noopener noreferrer">${label} <span class="file-type">PDF</span></a>`,
    )
    .join('');
  select('#contact-links').innerHTML = `
    ${hasEmail ? `<a class="contact-button" href="mailto:${escapeHtml(contact.email)}">Email me ${arrowIcon()}</a>` : ''}
    <div class="contact-secondary">
      ${renderExternalLink(contact.linkedin, 'LinkedIn')}
      ${renderExternalLink(contact.github, 'GitHub')}
    </div>
    <div class="resume-links" aria-label="Résumé versions">
      ${resumes}
    </div>
  `;
}

// Page initialization: render content first, then attach interactions.
select('#year').textContent = new Date().getFullYear();
select('#experience-list').innerHTML = portfolio.experience
  .map(renderExperience)
  .join('');
renderProjects();
renderFeaturedProject();
setupProjectFilters();
setupDialog();
setupProjectDetails();
renderSkillShowcase();
renderInterests();
setupInterests();
renderContactLinks();
setupResumeLinks();
setupGlassReflections();
