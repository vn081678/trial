import * as k from './iso-kit.mjs';
import {
  P,
  DIAL,
  TIP_R,
  CARRIAGE_TOP,
  FIRST_BLOCK_X,
  BLOCK_STEP,
  BLOCK_W,
  BLOCK_COUNT,
  blockHeightForPct,
  stopForWeekIndex,
  buildCarriage,
  needlePathForTurn,
  renderAnatomyInstrumentSvg
} from './rig-figure.mjs';

const state = {
  aws: null,
  career: null,
  selectedWeekIdx: 5, // Week 6 (index 5) is current active week
  weekFilter: 'all',
  weekSearch: '',
  sessionSearch: '',
  editorFile: 'aws'
};

// Isometric Rig Physics State
const rig = {
  mounted: false,
  x: stopForWeekIndex(5),
  targetX: stopForWeekIndex(5),
  tip: { at: CARRIAGE_TOP + blockHeightForPct(20), rate: 0 },
  frame: 0,
  last: 0,
  touring: false,
  idleTimer: 0,
  still: window.matchMedia('(prefers-reduced-motion: reduce)')
};

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getWeekProgressArray() {
  if (!state.aws?.roadmap?.length) {
    return [100, 100, 85, 100, 95, 20, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0];
  }
  return Array.from({ length: BLOCK_COUNT }, (_, i) => {
    const r = state.aws.roadmap.find(item => item.week === i + 1);
    return r ? r.progress : 0;
  });
}

function heightUnderCarriageX(cx, progresses) {
  let top = CARRIAGE_TOP;
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const from = cx + FIRST_BLOCK_X + i * BLOCK_STEP;
    const to = from + BLOCK_W;
    if (to > DIAL[0] - TIP_R && from < DIAL[0] + TIP_R) {
      top = Math.max(top, CARRIAGE_TOP + blockHeightForPct(progresses[i] ?? 0));
    }
  }
  return top;
}

function nearestWeekIndexForCarriageX(cx) {
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const d = Math.abs(stopForWeekIndex(i) - cx);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function updateRigInspectorUI(weekIdx) {
  if (!state.aws) return;
  const w = state.aws.weeks[weekIdx] || state.aws.weeks[0];
  const r = state.aws.roadmap[weekIdx] || { week: weekIdx + 1, topic: w?.title || '', progress: 0, status: '' };
  if (!w) return;

  document.getElementById('inspected-week-heading').textContent = `Week ${w.week} — ${w.title}`;
  document.getElementById('inspected-week-bar').style.width = `${r.progress}%`;
  document.getElementById('inspected-week-status').textContent = `${r.progress}% COVERAGE · ${r.status || 'Not started'}`;
  document.getElementById('inspected-learning-goal').textContent = w.learningGoal || '—';
  document.getElementById('inspected-practice-goal').textContent = w.practiceGoal || '—';

  document.querySelectorAll('.rig-week-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === weekIdx);
  });
  document.querySelectorAll('.roadmap-row').forEach(row => {
    row.classList.toggle('selected-row', parseInt(row.dataset.selectWeek, 10) === weekIdx + 1);
  });
}

function drawRigFrame() {
  const stage = document.getElementById('rig-stage');
  if (!stage) return;
  const svg = stage.querySelector('svg');
  if (!svg) return;

  const carriageEl = svg.querySelector('[data-part="carriage"]');
  const plungerEl = svg.querySelector('[data-part="plunger"]');
  const needleEl = svg.querySelector('[data-part="needle"]');
  const readoutEl = document.getElementById('rig-readout');

  carriageEl.setAttribute('transform', k.translateAlong(P, [rig.x, 0, 0]));
  plungerEl.setAttribute('transform', k.translateAlong(P, [0, 0, rig.tip.at]));

  const minH = blockHeightForPct(0);
  const maxH = blockHeightForPct(100);
  const measuredPct = Math.max(0, Math.min(100, ((rig.tip.at - CARRIAGE_TOP - minH) / (maxH - minH)) * 100));
  needleEl.setAttribute('d', needlePathForTurn(measuredPct / 100));

  const idx = nearestWeekIndexForCarriageX(rig.x);
  const topic = state.aws?.roadmap?.[idx]?.topic || `Week ${idx + 1}`;
  const label = `W${String(idx + 1).padStart(2, '0')} · ${topic.toUpperCase()} · ${measuredPct.toFixed(1)}%`;
  if (readoutEl && readoutEl.textContent !== label) {
    readoutEl.textContent = label;
  }
  stage.setAttribute('aria-valuenow', String(idx + 1));
  stage.setAttribute('aria-valuetext', label);
}

function tickRig(now) {
  const dt = rig.last ? Math.min((now - rig.last) / 1000, 1 / 30) : 1 / 60;
  rig.last = now;
  const calm = rig.still.matches;

  rig.x = calm ? rig.targetX : rig.x + (rig.targetX - rig.x) * (1 - Math.exp(-dt / 0.22));
  if (Math.abs(rig.targetX - rig.x) < 0.01) rig.x = rig.targetX;

  const progresses = getWeekProgressArray();
  const want = heightUnderCarriageX(rig.x, progresses);
  const stiff = 420;
  const drag = calm ? 2 * Math.sqrt(stiff) : 28;
  for (let i = 0; i < 4; i++) {
    rig.tip.rate += (((want - rig.tip.at) * stiff - rig.tip.rate * drag) * dt) / 4;
    rig.tip.at += (rig.tip.rate * dt) / 4;
  }
  if (Math.abs(want - rig.tip.at) < 0.005 && Math.abs(rig.tip.rate) < 0.005) {
    rig.tip.at = want;
    rig.tip.rate = 0;
  }

  drawRigFrame();

  const settled = rig.x === rig.targetX && rig.tip.rate === 0 && rig.tip.at === want;
  rig.frame = !settled ? requestAnimationFrame(tickRig) : 0;
}

function kickRig() {
  if (!rig.frame) {
    rig.last = 0;
    rig.frame = requestAnimationFrame(tickRig);
  }
}

export function selectWeekOnRig(weekIdx) {
  const clamped = Math.max(0, Math.min(BLOCK_COUNT - 1, weekIdx));
  state.selectedWeekIdx = clamped;
  rig.targetX = stopForWeekIndex(clamped);
  updateRigInspectorUI(clamped);
  kickRig();
}

function mountOrUpdateRig() {
  const stage = document.getElementById('rig-stage');
  if (!stage) return;
  const progresses = getWeekProgressArray();

  if (!rig.mounted) {
    stage.innerHTML = renderAnatomyInstrumentSvg(progresses, state.selectedWeekIdx);
    rig.mounted = true;

    // Pointer hover across the SVG stage steers the carriage across W1..W16
    stage.addEventListener('pointermove', event => {
      if (event.buttons === 0 && event.pointerType === 'touch') return;
      const svg = stage.querySelector('svg');
      const box = svg.getBoundingClientRect();
      const share = Math.max(0, Math.min(1, ((event.clientX - box.left) / box.width - 0.18) / 0.64));
      const idx = Math.round(share * (BLOCK_COUNT - 1));
      if (idx !== state.selectedWeekIdx) {
        selectWeekOnRig(idx);
      }
    });

    stage.addEventListener('keydown', event => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = state.selectedWeekIdx + 1;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = state.selectedWeekIdx - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = BLOCK_COUNT - 1;
      if (next !== null) {
        event.preventDefault();
        selectWeekOnRig(next);
      }
    });
  } else {
    // Rebuild carriage gauge blocks with updated heights
    const carriageEl = stage.querySelector('[data-part="carriage"]');
    if (carriageEl) {
      carriageEl.innerHTML = buildCarriage(progresses);
    }
    kickRig();
  }

  // Render 16-week selector buttons below stage
  const stripEl = document.getElementById('rig-week-strip');
  if (stripEl) {
    stripEl.innerHTML = progresses
      .map(
        (pct, idx) => `
      <button class="rig-week-btn ${idx === state.selectedWeekIdx ? 'active' : ''} ${pct > 0 ? 'has-prog' : ''}" data-rig-week="${idx}" title="Week ${idx + 1}: ${pct}%">
        <span>W${String(idx + 1).padStart(2, '0')}</span>
        <span class="wk-dot"></span>
      </button>
    `
      )
      .join('');
  }

  updateRigInspectorUI(state.selectedWeekIdx);
  drawRigFrame();
}

async function fetchData() {
  const res = await fetch('/api/data');
  const data = await res.json();
  state.aws = data.aws;
  state.career = data.career;
  renderAll();
}

async function toggleCheckbox(lineNumber, checked) {
  try {
    const res = await fetch('/api/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineNumber, checked })
    });
    const data = await res.json();
    if (data.ok) {
      state.aws = data.aws;
      renderAll();
      showToast(`SYNCED LINE #${lineNumber} -> AWS-study-checklist.md`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateWeekProgress(week, progress) {
  try {
    const res = await fetch('/api/update-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week, progress })
    });
    const data = await res.json();
    if (data.ok) {
      state.aws = data.aws;
      selectWeekOnRig(week - 1);
      renderAll();
      showToast(`UPDATED WEEK ${week} (${progress}%) -> AWS-study-checklist.md`);
    }
  } catch (err) {
    console.error(err);
  }
}

function createChecklistHtml(items) {
  if (!items || !items.length) return '<p class="muted">No items</p>';
  return items
    .map(
      item => `
    <label class="check-item ${item.checked ? 'checked' : ''}">
      <input type="checkbox" data-line="${item.lineNumber}" ${item.checked ? 'checked' : ''} />
      <span class="check-text">${escapeHtml(item.text)}</span>
      <span class="line-badge">L${item.lineNumber}</span>
    </label>
  `
    )
    .join('');
}

function renderOverview() {
  const { aws, career } = state;
  if (!aws || !career) return;

  document.getElementById('header-name').textContent = career.name || 'VO QUANG TRUNG';
  document.getElementById('banner-plan').textContent = aws.metadata.plan || '16 flexible weeks';
  document.getElementById('current-position-text').textContent =
    aws.metadata.currentPosition || aws.metadata.latestNextStep;
  document.getElementById('next-session-text').textContent =
    aws.metadata.nextSession || aws.metadata.latestNextStep;

  const pct = aws.metadata.overallProgress || 0;
  document.getElementById('overall-progress-val').textContent = `${pct}%`;
  document.getElementById('overall-pct-corner').textContent = `OVERALL: ${pct}%`;

  const completedWeeks = aws.roadmap.filter(r => r.progress === 100).length;
  const activeWeeks = aws.roadmap.filter(r => r.progress > 0 && r.progress < 100);
  document.getElementById('kpi-weeks').textContent = `${completedWeeks} / ${aws.roadmap.length}`;
  document.getElementById('kpi-weeks-sub').textContent =
    activeWeeks.length > 0
      ? `Active: ${activeWeeks.map(w => `W${w.week} (${w.progress}%)`).join(', ')}`
      : 'All active weeks up to date';

  const allChecks = [
    ...aws.generalChecklists.progressAlreadyMade,
    ...aws.generalChecklists.readinessChecklist,
    ...aws.generalChecklists.processReview,
    ...aws.weeks.flatMap(w => w.checkboxes)
  ];
  const doneChecks = allChecks.filter(c => c.checked).length;
  document.getElementById('kpi-tasks').textContent = `${doneChecks} / ${allChecks.length}`;
  document.getElementById('kpi-sessions').textContent = `${aws.sessions.length}`;
  document.getElementById('session-count-badge').textContent = `${aws.sessions.length}`;

  // Mount or update the Anatomy Isometric Gauge Rig
  mountOrUpdateRig();

  // Career Journey Progression
  const journeySteps = [
    {
      period: 'STN 01 // 2016 – 2018',
      role: 'Software Engineer (ADAS QA)',
      company: 'Robert Bosch Engineering',
      tags: ['Radar ACC', 'Unit & Integration', 'ClearQuest', '25% Faster Turnaround'],
      active: false
    },
    {
      period: 'STN 02 // 2018 – 2022',
      role: 'Senior Test Engineer (IoT)',
      company: 'Bridgetek Viet Nam',
      tags: ['End-to-End IoT', 'Robot Framework', 'Python (85% Cov)', 'Embedded Stress'],
      active: false
    },
    {
      period: 'STN 03 // 2022 – PRESENT',
      role: 'Quality Engineer (SaaS & Cloud)',
      company: 'Message Media',
      tags: ['Playwright', 'Cypress', 'GitLab CI (-30% breaks)', 'Salesforce & D365'],
      active: false
    },
    {
      period: `STN 04 // TARGET (${pct}% DONE)`,
      role: 'AWS Certified Developer (DVA-C02)',
      company: 'Cloud-Native Engineering Track',
      tags: ['IAM & S3', 'Lambda & SDKs', 'API Gateway', 'DynamoDB & GSI/LSI', 'SAM & CI/CD'],
      active: true
    }
  ];

  document.getElementById('career-journey-steps').innerHTML = journeySteps
    .map(
      step => `
    <div class="journey-node ${step.active ? 'active-goal' : ''}">
      <div class="journey-period">${escapeHtml(step.period)}</div>
      <div class="journey-role">${escapeHtml(step.role)}</div>
      <div class="journey-company">${escapeHtml(step.company)}</div>
      <div class="journey-tags">
        ${step.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
    </div>
  `
    )
    .join('');

  // Overview Roadmap Mini List
  document.getElementById('overview-roadmap-list').innerHTML = aws.roadmap
    .map(item => {
      const badgeClass = item.progress === 100 ? 'pct-100' : item.progress > 0 ? 'pct-active' : 'pct-0';
      const isSel = item.week === state.selectedWeekIdx + 1;
      return `
      <div class="roadmap-row ${isSel ? 'selected-row' : ''}" data-select-week="${item.week}">
        <div class="roadmap-row-top">
          <span class="roadmap-week-title">W${String(item.week).padStart(2, '0')} — ${escapeHtml(item.topic)}</span>
          <span class="roadmap-pct ${badgeClass}">${item.progress}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${item.progress === 100 ? 'done' : ''}" style="width: ${item.progress}%"></div>
        </div>
        <div class="roadmap-status-note">${escapeHtml(item.status)}</div>
      </div>
    `;
    })
    .join('');

  document.getElementById('progress-already-made-list').innerHTML = createChecklistHtml(
    aws.generalChecklists.progressAlreadyMade
  );

  document.getElementById('weekly-rhythm-grid').innerHTML = aws.weeklyRhythm
    .map(
      r => `
    <div class="rhythm-item">
      <div class="rhythm-day">
        <span>${escapeHtml(r.day)}</span>
        <span class="rhythm-time">${escapeHtml(r.time)}</span>
      </div>
      <div class="rhythm-purpose">${escapeHtml(r.purpose)}</div>
    </div>
  `
    )
    .join('');
}

function renderRoadmapTab() {
  const { aws, weekFilter, weekSearch } = state;
  if (!aws) return;

  const q = weekSearch.toLowerCase().trim();
  const filteredWeeks = aws.weeks.filter(w => {
    if (weekFilter === 'completed' && w.progress !== 100) return false;
    if (weekFilter === 'in-progress' && (w.progress === 0 || w.progress === 100)) return false;
    if (weekFilter === 'not-started' && w.progress !== 0) return false;
    if (q) {
      const hay = `${w.title} ${w.learningGoal} ${w.practiceGoal} ${w.status} ${w.checkboxes.map(c => c.text).join(' ')}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });

  document.getElementById('weeks-container').innerHTML = filteredWeeks
    .map(w => {
      const lessonChecks = w.checkboxes.filter(c => !c.isDailyRhythm);
      const dailyChecks = w.checkboxes.filter(c => c.isDailyRhythm);
      const badgeClass = w.progress === 100 ? 'pct-100' : w.progress > 0 ? 'pct-active' : 'pct-0';

      return `
      <div class="week-card ${w.progress > 0 && w.progress < 100 ? 'week-active' : ''}" id="week-card-${w.week}">
        <div class="week-card-header">
          <div>
            <span class="week-num-badge">MODULE // WEEK ${String(w.week).padStart(2, '0')}</span>
            <h3>${escapeHtml(w.title)}</h3>
            <p class="muted">${escapeHtml(w.status)}</p>
          </div>
          <span class="roadmap-pct ${badgeClass}">${w.progress}%</span>
        </div>

        <div class="week-progress-control">
          <span>COVERAGE:</span>
          <input type="range" min="0" max="100" step="5" value="${w.progress}" data-week-slider="${w.week}" />
          <strong>${w.progress}%</strong>
        </div>

        <div class="week-goals">
          <div><strong>Learning Goal:</strong> ${escapeHtml(w.learningGoal)}</div>
          <div><strong>Practice Goal:</strong> ${escapeHtml(w.practiceGoal)}</div>
        </div>

        <div>
          <h4 class="sub-heading">Checkpoints (${lessonChecks.filter(c => c.checked).length}/${lessonChecks.length})</h4>
          <div class="checklist-group">
            ${createChecklistHtml(lessonChecks)}
          </div>
        </div>

        ${
          dailyChecks.length
            ? `
          <details class="daily-details">
            <summary>Daily Schedule Checkboxes (${dailyChecks.filter(c => c.checked).length}/${dailyChecks.length})</summary>
            <div class="checklist-group mt-16">
              ${createChecklistHtml(dailyChecks)}
            </div>
          </details>
        `
            : ''
        }

        ${
          w.understand.length || w.needsReview.length
            ? `
          <div class="week-notes-grid">
            <div class="note-box">
              <h5>What I Understand</h5>
              <ul>
                ${
                  w.understand.length
                    ? w.understand.map(u => `<li>${escapeHtml(u)}</li>`).join('')
                    : '<li class="muted">Not recorded yet</li>'
                }
              </ul>
            </div>
            <div class="note-box">
              <h5>What Needs Review</h5>
              <ul>
                ${
                  w.needsReview.length
                    ? w.needsReview.map(r => `<li>${escapeHtml(r)}</li>`).join('')
                    : '<li class="muted">None flagged</li>'
                }
              </ul>
            </div>
          </div>
        `
            : ''
        }

        ${
          w.nextStep
            ? `<div class="next-session-box"><span class="mono-label">NEXT STEP</span><div>${escapeHtml(w.nextStep)}</div></div>`
            : ''
        }
      </div>
    `;
    })
    .join('');

  document.getElementById('readiness-checklist-list').innerHTML = createChecklistHtml(
    aws.generalChecklists.readinessChecklist
  );
  document.getElementById('reusable-summary-list').innerHTML = createChecklistHtml(
    aws.generalChecklists.reusableSummary
  );
  document.getElementById('process-review-list').innerHTML = createChecklistHtml(
    aws.generalChecklists.processReview
  );
}

function renderSessionsTab() {
  const { aws, sessionSearch } = state;
  if (!aws) return;

  const q = sessionSearch.toLowerCase().trim();
  const rows = [...aws.sessions].reverse().filter(s => {
    if (!q) return true;
    return `${s.session} ${s.topic} ${s.learned} ${s.revisit} ${s.nextAction}`
      .toLowerCase()
      .includes(q);
  });

  document.getElementById('session-table-body').innerHTML = rows
    .map(
      s => `
    <tr>
      <td><strong>${escapeHtml(s.session)}</strong></td>
      <td><span class="tag">${escapeHtml(s.topic)}</span></td>
      <td>${escapeHtml(s.learned)}</td>
      <td class="muted">${escapeHtml(s.revisit)}</td>
      <td>${escapeHtml(s.nextAction)}</td>
    </tr>
  `
    )
    .join('');
}

function renderProfileTab() {
  const { career, aws } = state;
  if (!career) return;

  document.getElementById('cv-name').textContent = career.name;
  document.getElementById('cv-summary').textContent = career.summary;

  const contactsHtml = Object.entries(career.contact)
    .map(([kName, v]) => {
      const cleanVal = v.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      return `<div class="contact-item"><strong>${escapeHtml(kName.toUpperCase())}:</strong> ${cleanVal}</div>`;
    })
    .join('');
  document.getElementById('cv-contacts').innerHTML = contactsHtml;

  const certsHtml = [
    `<div class="contact-item" style="box-shadow: 0 0 0 1px var(--anatomy-lit)">
      <strong style="color: var(--anatomy-strong)">[ACTIVE TRACK — ${aws ? aws.metadata.overallProgress : 32}%]</strong><br/>
      AWS Certified Developer – Associate (DVA-C02)
    </div>`,
    ...career.certifications.map(
      c => `<div class="contact-item">${escapeHtml(c.replace(/\*\*/g, '').replace(/`/g, ''))}</div>`
    )
  ].join('');
  document.getElementById('cv-certs').innerHTML = certsHtml;

  document.getElementById('cv-education').innerHTML = `
    <div class="contact-item">
      <strong>${escapeHtml(career.education.school)}</strong>
      ${career.education.details.map(d => `<div class="muted">${escapeHtml(d.replace(/\*\*/g, ''))}</div>`).join('')}
    </div>
  `;

  const completedAwsTopics = aws
    ? aws.roadmap.filter(r => r.progress > 0).map(r => `${r.topic} (${r.progress}%)`)
    : [];

  const allSkillGroups = [
    ...career.skills,
    {
      category: 'AWS Cloud & Serverless (DVA-C02 Active Track)',
      items: completedAwsTopics.length
        ? completedAwsTopics
        : ['AWS IAM & S3', 'AWS Lambda & SDK', 'API Gateway', 'Amazon DynamoDB (GSI/LSI)']
    }
  ];

  document.getElementById('cv-skills').innerHTML = allSkillGroups
    .map(
      g => `
    <div class="skill-group-card">
      <div class="skill-group-title">${escapeHtml(g.category)}</div>
      <div class="journey-tags">
        ${g.items.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
  `
    )
    .join('');

  document.getElementById('cv-experience').innerHTML = career.experiences
    .map(
      exp => `
    <div class="exp-card">
      <div class="exp-header">
        <div>
          <div class="exp-company">${escapeHtml(exp.company)}</div>
          <div class="exp-role">${escapeHtml(exp.role)}</div>
        </div>
        <div class="exp-period">${escapeHtml(exp.period)}</div>
      </div>
      <ul class="exp-list">
        ${exp.achievements.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');
}

function renderEditorTab() {
  const { aws, career, editorFile } = state;
  if (!aws || !career) return;
  const textarea = document.getElementById('markdown-editor-textarea');
  if (document.activeElement !== textarea) {
    textarea.value = editorFile === 'career' ? career.raw : aws.raw;
  }
}

function renderAll() {
  renderOverview();
  renderRoadmapTab();
  renderSessionsTab();
  renderProfileTab();
  renderEditorTab();
}

// Event Delegation
document.addEventListener('click', e => {
  // Tab switching
  const tabBtn = e.target.closest('.nav-tab');
  if (tabBtn) {
    const tabId = tabBtn.dataset.tab;
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.toggle('active', b === tabBtn));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));
    return;
  }

  // Week stop button on the Isometric Rig
  const rigBtn = e.target.closest('[data-rig-week]');
  if (rigBtn) {
    const idx = parseInt(rigBtn.dataset.rigWeek, 10);
    selectWeekOnRig(idx);
    return;
  }

  // Select week from overview roadmap list -> positions Isometric Rig + scrolls if double clicked
  const selectRow = e.target.closest('[data-select-week]');
  if (selectRow) {
    const weekNum = parseInt(selectRow.dataset.selectWeek, 10);
    selectWeekOnRig(weekNum - 1);
    document.getElementById('rig-plate')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // Jump to inspected week's detailed checklist
  if (e.target.closest('#jump-to-inspected-week-btn')) {
    const weekNum = state.selectedWeekIdx + 1;
    document.querySelector('[data-tab="roadmap"]').click();
    setTimeout(() => {
      const card = document.getElementById(`week-card-${weekNum}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
    return;
  }

  // Theme toggle (Dark / Light Paper)
  if (e.target.closest('#theme-toggle-btn')) {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = nextTheme;
    return;
  }

  // Week filter pills
  const filterBtn = e.target.closest('.filter-btn');
  if (filterBtn) {
    state.weekFilter = filterBtn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === filterBtn));
    renderRoadmapTab();
  }
});

// Checkbox & Range Slider Listeners
document.addEventListener('change', e => {
  if (e.target.matches('input[type="checkbox"][data-line]')) {
    const lineNumber = parseInt(e.target.dataset.line, 10);
    const checked = e.target.checked;
    toggleCheckbox(lineNumber, checked);
  } else if (e.target.matches('input[type="range"][data-week-slider]')) {
    const week = parseInt(e.target.dataset.weekSlider, 10);
    const progress = parseInt(e.target.value, 10);
    updateWeekProgress(week, progress);
  }
});

// Search inputs
document.getElementById('week-search-input').addEventListener('input', e => {
  state.weekSearch = e.target.value;
  renderRoadmapTab();
});

document.getElementById('session-search-input').addEventListener('input', e => {
  state.sessionSearch = e.target.value;
  renderSessionsTab();
});

// Add Session Form
document.getElementById('open-add-session-btn').addEventListener('click', () => {
  const form = document.getElementById('add-session-form');
  form.classList.toggle('hidden');
  const nextNum = (state.aws?.sessions?.length || 47) + 1;
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('sess-id').value = `${nextNum} - ${today}`;
});

document.getElementById('cancel-add-session-btn').addEventListener('click', () => {
  document.getElementById('add-session-form').classList.add('hidden');
});

document.getElementById('add-session-form').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    session: document.getElementById('sess-id').value,
    topic: document.getElementById('sess-topic').value,
    learned: document.getElementById('sess-learned').value,
    revisit: document.getElementById('sess-revisit').value,
    nextAction: document.getElementById('sess-next').value
  };
  const res = await fetch('/api/add-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.ok) {
    state.aws = data.aws;
    document.getElementById('add-session-form').reset();
    document.getElementById('add-session-form').classList.add('hidden');
    renderAll();
    showToast('LOGGED NEW SESSION -> AWS-study-checklist.md');
  }
});

// Editor file selector & save
document.getElementById('editor-file-select').addEventListener('change', e => {
  state.editorFile = e.target.value;
  const textarea = document.getElementById('markdown-editor-textarea');
  textarea.value = state.editorFile === 'career' ? state.career.raw : state.aws.raw;
});

document.getElementById('save-markdown-btn').addEventListener('click', async () => {
  const content = document.getElementById('markdown-editor-textarea').value;
  const res = await fetch('/api/save-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: state.editorFile, content })
  });
  const data = await res.json();
  if (data.ok) {
    state.aws = data.aws;
    state.career = data.career;
    renderAll();
    showToast(`SAVED ${state.editorFile === 'career' ? 'VoQuangTrung_QA.md' : 'AWS-study-checklist.md'}`);
  }
});

// 45-Minute Study Timer (5m recall + 15m explain + 15m apply + 10m summary)
let timerSeconds = 45 * 60;
let timerInterval = null;

function getStudyPhase(remainingSec) {
  const elapsedMin = (45 * 60 - remainingSec) / 60;
  if (elapsedMin < 5) return 'PHASE 1/4 // RECALL (5M)';
  if (elapsedMin < 20) return 'PHASE 2/4 // EXPLAIN (15M)';
  if (elapsedMin < 35) return 'PHASE 3/4 // APPLY (15M)';
  return 'PHASE 4/4 // SUMMARY (10M)';
}

function updateTimerUI() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
  document.getElementById('timer-phase').textContent = timerInterval
    ? getStudyPhase(timerSeconds)
    : '45M STUDY RHYTHM';
}

document.getElementById('timer-start-btn').addEventListener('click', e => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    e.target.textContent = 'RESUME';
  } else {
    e.target.textContent = 'PAUSE';
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        e.target.textContent = 'START';
        showToast('45-MINUTE SESSION COMPLETE // REST');
      }
    }, 1000);
    updateTimerUI();
  }
});

document.getElementById('timer-reset-btn').addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerSeconds = 45 * 60;
  document.getElementById('timer-start-btn').textContent = 'START';
  updateTimerUI();
});

fetchData();
