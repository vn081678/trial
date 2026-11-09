import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const AWS_MD_PATH = path.join(__dirname, 'AWS-study-checklist.md');
const QA_MD_PATH = path.join(__dirname, 'VoQuangTrung_QA.md');
const PUBLIC_DIR = path.join(__dirname, 'public');

function parseAwsChecklist(raw) {
  const lines = raw.split(/\r?\n/);

  // Extract metadata at top
  const metadata = {
    title: 'My AWS Developer Associate study checklist',
    quote: '',
    target: '',
    plan: '',
    currentPosition: '',
    dailyStudyTime: '',
    targetExamMonth: '',
    nextSession: '',
    overallProgress: 0,
    latestNextStep: ''
  };

  for (let i = 0; i < Math.min(lines.length, 60); i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) metadata.title = line.slice(2).trim();
    else if (line.startsWith('> ')) metadata.quote = line.slice(2).trim();
    else if (line.startsWith('**Target:**')) metadata.target = line.replace('**Target:**', '').trim();
    else if (line.startsWith('**Plan:**')) metadata.plan = line.replace('**Plan:**', '').trim();
    else if (line.startsWith('**Current position:**')) metadata.currentPosition = line.replace('**Current position:**', '').trim();
    else if (line.startsWith('**Daily study time:**')) metadata.dailyStudyTime = line.replace('**Daily study time:**', '').trim();
    else if (line.startsWith('**Target exam month:**')) metadata.targetExamMonth = line.replace('**Target exam month:**', '').trim();
    else if (line.startsWith('**Next session:**')) metadata.nextSession = line.replace('**Next session:**', '').trim();
    else if (line.startsWith('**Overall roadmap progress:')) {
      const m = line.match(/(\d+)%/);
      if (m) metadata.overallProgress = parseInt(m[1], 10);
    }
  }

  // Parse Roadmap at a glance table
  const roadmap = [];
  let inRoadmapTable = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## Roadmap at a glance')) {
      inRoadmapTable = true;
      continue;
    }
    if (inRoadmapTable) {
      if (line.startsWith('## ') && !line.startsWith('## Roadmap')) {
        inRoadmapTable = false;
        break;
      }
      if (line.startsWith('|') && !line.includes('---') && !line.includes('Week | Topic')) {
        const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cols.length >= 4) {
          const weekNum = parseInt(cols[0], 10);
          const progMatch = cols[2].match(/(\d+)%/);
          roadmap.push({
            lineNumber: i + 1,
            week: isNaN(weekNum) ? cols[0] : weekNum,
            topic: cols[1],
            progress: progMatch ? parseInt(progMatch[1], 10) : 0,
            status: cols[3]
          });
        }
      }
    }
  }

  // Parse Weekly rhythm table
  const weeklyRhythm = [];
  let inRhythmTable = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## Weekly rhythm')) {
      inRhythmTable = true;
      continue;
    }
    if (inRhythmTable) {
      if (line.startsWith('## ') && !line.startsWith('## Weekly rhythm')) {
        inRhythmTable = false;
        break;
      }
      if (line.startsWith('|') && !line.includes('---') && !line.includes('Day | Time')) {
        const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cols.length >= 3) {
          weeklyRhythm.push({
            day: cols[0],
            time: cols[1],
            purpose: cols[2]
          });
        }
      }
    }
  }

  // Parse all sections & checkboxes
  const weeks = [];
  let currentH2 = '';
  let currentWeek = null;
  let currentSubfield = null;

  const generalChecklists = {
    progressAlreadyMade: [],
    readinessChecklist: [],
    processReview: [],
    reusableSummary: []
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('**Latest next step')) {
      metadata.latestNextStep = line.replace(/^\*\*Latest next step[^*]*\*\*\s*/, '').trim();
    }

    if (line.startsWith('## ')) {
      currentH2 = line.slice(3).trim();
      if (!currentH2.startsWith('Week-by-week checklist')) {
        currentWeek = null;
      }
      continue;
    }

    if (line.startsWith('### Week ')) {
      const m = line.match(/^### Week\s+(\d+)\s*[—–-]\s*(.+)$/);
      const weekNum = m ? parseInt(m[1], 10) : weeks.length + 1;
      const title = m ? m[2].trim() : line.slice(4).trim();
      const roadmapInfo = roadmap.find(r => r.week === weekNum);
      currentWeek = {
        week: weekNum,
        title,
        progress: roadmapInfo ? roadmapInfo.progress : 0,
        status: roadmapInfo ? roadmapInfo.status : '',
        learningGoal: '',
        practiceGoal: '',
        notes: [],
        checkboxes: [],
        understand: [],
        needsReview: [],
        nextStep: '',
        finishedOn: ''
      };
      weeks.push(currentWeek);
      currentSubfield = null;
      continue;
    } else if (line.startsWith('### ')) {
      currentWeek = null;
      currentH2 = line.slice(4).trim();
      continue;
    }

    // Checkbox detection
    const cbMatch = rawLine.match(/^(\s*)-\s+\[([ xX])\]\s+(.+)$/);
    if (cbMatch) {
      const item = {
        lineNumber: i + 1,
        checked: cbMatch[2].toLowerCase() === 'x',
        text: cbMatch[3].trim(),
        isDailyRhythm: /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):/i.test(cbMatch[3].trim())
      };
      if (currentWeek) {
        currentWeek.checkboxes.push(item);
      } else if (currentH2.startsWith('Progress already made')) {
        generalChecklists.progressAlreadyMade.push(item);
      } else if (currentH2.startsWith('Readiness checklist')) {
        generalChecklists.readinessChecklist.push(item);
      } else if (currentH2.startsWith('Process review')) {
        generalChecklists.processReview.push(item);
      } else if (currentH2.startsWith('Reusable end-of-lesson summary')) {
        generalChecklists.reusableSummary.push(item);
      }
      continue;
    }

    if (currentWeek) {
      if (line.startsWith('**Learning goal:**')) {
        currentWeek.learningGoal = line.replace('**Learning goal:**', '').trim();
        currentSubfield = null;
      } else if (line.startsWith('**Practice goal')) {
        currentWeek.practiceGoal = line.replace(/^\*\*Practice goal[^*]*\*\*/, '').trim();
        currentSubfield = null;
      } else if (line.startsWith('**What I understand:**')) {
        currentSubfield = 'understand';
      } else if (line.startsWith('**What needs review:**')) {
        currentSubfield = 'needsReview';
      } else if (line.startsWith('**Next step:**')) {
        currentSubfield = 'nextStep';
      } else if (line.startsWith('**Week finished on:**')) {
        currentWeek.finishedOn = line.replace('**Week finished on:**', '').trim();
        currentSubfield = null;
      } else if (line.startsWith('**Progress') || line.startsWith('**Completion summary') || line.startsWith('**Local exercise:**')) {
        currentWeek.notes.push(line);
        currentSubfield = null;
      } else if (line.length > 0 && !line.startsWith('**Lesson checkpoints:**')) {
        if (currentSubfield === 'understand' && !line.startsWith('_Write')) {
          currentWeek.understand.push(line.replace(/^-\s+/, ''));
        } else if (currentSubfield === 'needsReview' && !line.startsWith('_Write')) {
          currentWeek.needsReview.push(line.replace(/^-\s+/, ''));
        } else if (currentSubfield === 'nextStep' && !line.startsWith('____')) {
          currentWeek.nextStep = (currentWeek.nextStep ? currentWeek.nextStep + ' ' : '') + line;
        }
      }
    }
  }

  // Parse Session log table
  const sessions = [];
  let inSessionLog = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## Session log')) {
      inSessionLog = true;
      continue;
    }
    if (inSessionLog) {
      if ((line.startsWith('## ') || line.startsWith('### ')) && !line.startsWith('## Session log')) {
        inSessionLog = false;
        break;
      }
      if (line.startsWith('|') && !line.includes('---') && !line.includes('Session | Topic')) {
        const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (cols.length >= 5) {
          sessions.push({
            lineNumber: i + 1,
            session: cols[0],
            topic: cols[1],
            learned: cols[2],
            revisit: cols[3],
            nextAction: cols[4]
          });
        }
      }
    }
  }

  return {
    metadata,
    roadmap,
    weeklyRhythm,
    weeks,
    generalChecklists,
    sessions,
    raw
  };
}

function parseCareerProfile(raw) {
  const lines = raw.split(/\r?\n/);
  const profile = {
    name: 'VO QUANG TRUNG',
    contact: {},
    summary: '',
    experiences: [],
    education: { school: '', details: [] },
    certifications: [],
    skills: [],
    raw
  };

  let section = '';
  let currentExp = null;
  let subSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('# ')) {
      profile.name = line.slice(2).trim();
      continue;
    }
    if (line.startsWith('## ')) {
      section = line.slice(3).trim();
      currentExp = null;
      subSection = '';
      continue;
    }

    if (!section) {
      const m = line.match(/^-\s+\*\*(.+?):\*\*\s*(.+)$/);
      if (m) {
        profile.contact[m[1].toLowerCase()] = m[2].trim();
      }
    } else if (section === 'Professional Summary') {
      profile.summary += (profile.summary ? ' ' : '') + line;
    } else if (section === 'Work Experience') {
      if (line.startsWith('### ')) {
        currentExp = {
          company: line.slice(4).trim(),
          role: '',
          period: '',
          achievements: []
        };
        profile.experiences.push(currentExp);
      } else if (currentExp && line.startsWith('*') && line.endsWith('*')) {
        const rolePeriod = line.slice(1, -1).split('|').map(s => s.trim());
        currentExp.role = rolePeriod[0] || '';
        currentExp.period = rolePeriod[1] || '';
      } else if (currentExp && line.startsWith('- ')) {
        currentExp.achievements.push(line.slice(2).trim());
      }
    } else if (section === 'Education & Certifications') {
      if (line.startsWith('### ')) {
        const h3 = line.slice(4).trim();
        if (h3.toLowerCase().includes('certification')) {
          subSection = 'certs';
        } else {
          subSection = 'edu';
          profile.education.school = h3;
        }
      } else if (subSection === 'edu' && line.startsWith('- ')) {
        profile.education.details.push(line.slice(2).trim());
      } else if (subSection === 'certs' && line.startsWith('- ')) {
        profile.certifications.push(line.slice(2).trim());
      }
    } else if (section === 'Technical Skills') {
      const m = line.match(/^-\s+\*\*(.+?):\*\*\s*(.+)$/);
      if (m) {
        profile.skills.push({
          category: m[1].trim(),
          items: m[2].split(',').map(s => s.trim()).filter(Boolean)
        });
      }
    }
  }

  return profile;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/data') {
      const [awsRaw, qaRaw] = await Promise.all([
        fs.readFile(AWS_MD_PATH, 'utf8'),
        fs.readFile(QA_MD_PATH, 'utf8')
      ]);
      return sendJson(res, 200, {
        aws: parseAwsChecklist(awsRaw),
        career: parseCareerProfile(qaRaw)
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/toggle') {
      const { lineNumber, checked } = await readBody(req);
      const awsRaw = await fs.readFile(AWS_MD_PATH, 'utf8');
      const eol = awsRaw.includes('\r\n') ? '\r\n' : '\n';
      const lines = awsRaw.split(/\r?\n/);
      const idx = lineNumber - 1;

      if (idx < 0 || idx >= lines.length) {
        return sendJson(res, 400, { error: 'Invalid line number' });
      }

      const targetLine = lines[idx];
      if (!/^(\s*)-\s+\[([ xX])\]\s+/.test(targetLine)) {
        return sendJson(res, 400, { error: 'Line is not a checkbox item' });
      }

      lines[idx] = targetLine.replace(/^(\s*-\s+\[)[ xX](\]\s+)/, `$1${checked ? 'x' : ' '}$2`);
      const updatedRaw = lines.join(eol);
      await fs.writeFile(AWS_MD_PATH, updatedRaw, 'utf8');

      return sendJson(res, 200, {
        ok: true,
        aws: parseAwsChecklist(updatedRaw)
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/update-week') {
      const { week, progress, status } = await readBody(req);
      const awsRaw = await fs.readFile(AWS_MD_PATH, 'utf8');
      const eol = awsRaw.includes('\r\n') ? '\r\n' : '\n';
      const lines = awsRaw.split(/\r?\n/);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith(`| ${week} |`)) {
          const cols = line.split('|').map(c => c.trim());
          // cols: ['', week, topic, progress, status, '']
          if (cols.length >= 5) {
            const newProg = typeof progress === 'number' ? `${progress}%` : cols[3];
            const newStatus = typeof status === 'string' ? status : cols[4];
            lines[i] = `| ${cols[1]} | ${cols[2]} | ${newProg} | ${newStatus} |`;
            break;
          }
        }
      }

      // Recalculate overall progress from all 16 weeks
      let totalPct = 0;
      let count = 0;
      for (const line of lines) {
        const m = line.trim().match(/^\|\s*(\d+)\s*\|[^|]+\|\s*(\d+)%\s*\|/);
        if (m) {
          totalPct += parseInt(m[2], 10);
          count++;
        }
      }
      if (count > 0) {
        const avg = Math.round(totalPct / count);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('**Overall roadmap progress:')) {
            lines[i] = `**Overall roadmap progress: ${avg}%**`;
            break;
          }
        }
      }

      const updatedRaw = lines.join(eol);
      await fs.writeFile(AWS_MD_PATH, updatedRaw, 'utf8');
      return sendJson(res, 200, { ok: true, aws: parseAwsChecklist(updatedRaw) });
    }

    if (req.method === 'POST' && url.pathname === '/api/update-week-notes') {
      const { week, understand, needsReview, nextStep, finishedOn } = await readBody(req);
      const awsRaw = await fs.readFile(AWS_MD_PATH, 'utf8');
      const eol = awsRaw.includes('\r\n') ? '\r\n' : '\n';
      const lines = awsRaw.split(/\r?\n/);

      // Find the target week section
      let startIdx = -1;
      let endIdx = lines.length;
      for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (new RegExp(`^### Week\\s+${week}\\s*[—–-]`).test(t)) {
          startIdx = i;
          continue;
        }
        if (startIdx !== -1 && (t.startsWith('### Week ') || t.startsWith('## '))) {
          endIdx = i;
          break;
        }
      }

      if (startIdx === -1) {
        return sendJson(res, 404, { error: `Week ${week} not found` });
      }

      // Locate "**What I understand:**" inside [startIdx, endIdx)
      let understandIdx = -1;
      for (let i = startIdx; i < endIdx; i++) {
        if (lines[i].trim().startsWith('**What I understand:**')) {
          understandIdx = i;
          break;
        }
      }

      const formatBullets = text => {
        const items = String(text || '')
          .split(/\r?\n/)
          .map(s => s.replace(/^-\s*/, '').trim())
          .filter(Boolean);
        return items.length ? items.map(s => `- ${s}`) : ['_Write 2–3 short points._'];
      };

      const newNotesBlock = [
        '**What I understand:**  ',
        ...formatBullets(understand),
        '',
        '**What needs review:**  ',
        ...(String(needsReview || '').trim()
          ? formatBullets(needsReview)
          : ['_Write one or two questions; uncertainty is normal._']),
        '',
        '**Next step:**  ',
        String(nextStep || '').trim() || '__________',
        '',
        `**Week finished on:** ${String(finishedOn || '').trim() || '__________'}`
      ];

      if (understandIdx !== -1) {
        lines.splice(understandIdx, endIdx - understandIdx, ...newNotesBlock);
      } else {
        lines.splice(endIdx, 0, '', ...newNotesBlock);
      }

      const updatedRaw = lines.join(eol);
      await fs.writeFile(AWS_MD_PATH, updatedRaw, 'utf8');
      return sendJson(res, 200, { ok: true, aws: parseAwsChecklist(updatedRaw) });
    }

    if (req.method === 'POST' && url.pathname === '/api/add-session') {
      const { session, topic, learned, revisit, nextAction } = await readBody(req);
      const awsRaw = await fs.readFile(AWS_MD_PATH, 'utf8');
      const eol = awsRaw.includes('\r\n') ? '\r\n' : '\n';
      const lines = awsRaw.split(/\r?\n/);

      // Find last session table row before "### Reusable end-of-lesson summary" or "**Latest next step"
      let insertIdx = -1;
      let inSessionLog = false;
      for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (t.startsWith('## Session log')) inSessionLog = true;
        else if (inSessionLog && (t.startsWith('**Latest next step') || t.startsWith('### Reusable'))) {
          insertIdx = i;
          break;
        }
      }

      const clean = s => String(s || '').replace(/\|/g, '/').trim();
      const newRow = `| ${clean(session)} | ${clean(topic)} | ${clean(learned)} | ${clean(revisit)} | ${clean(nextAction)} |`;

      if (insertIdx !== -1) {
        lines.splice(insertIdx, 0, newRow, '');
      } else {
        lines.push(newRow);
      }

      const updatedRaw = lines.join(eol);
      await fs.writeFile(AWS_MD_PATH, updatedRaw, 'utf8');
      return sendJson(res, 200, { ok: true, aws: parseAwsChecklist(updatedRaw) });
    }

    if (req.method === 'POST' && url.pathname === '/api/save-file') {
      const { file, content } = await readBody(req);
      const targetPath = file === 'career' ? QA_MD_PATH : AWS_MD_PATH;
      await fs.writeFile(targetPath, content, 'utf8');

      const [awsRaw, qaRaw] = await Promise.all([
        fs.readFile(AWS_MD_PATH, 'utf8'),
        fs.readFile(QA_MD_PATH, 'utf8')
      ]);
      return sendJson(res, 200, {
        ok: true,
        aws: parseAwsChecklist(awsRaw),
        career: parseCareerProfile(qaRaw)
      });
    }

    // Serve static files from /public
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    const safePath = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
    const fullPath = path.join(PUBLIC_DIR, safePath);

    try {
      const data = await fs.readFile(fullPath);
      const ext = path.extname(fullPath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain; charset=utf-8' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Career & AWS Study Tracker running at http://localhost:${PORT}`);
});

