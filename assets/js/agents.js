// ── AGENT STACK PAGE ──

const agents = [
  {
    id: 1, name: 'Lead alert', group: 'rt', live: true, isnew: false,
    trigger: 'Form submitted on appteck.ai',
    desc: 'AI scores lead 1–10, saves to CRM, sends instant alert',
    output: 'Telegram instant alert',
    flow: ['Website form', 'Webhook → server', 'Save to SQLite CRM', 'OpenClaw AI', 'Score + analysis', 'Telegram alert'],
    detail: 'Every contact form submission is scored by Claude AI and saved to the lead CRM database. You get name, email, business, score out of 10, pain point, recommended tier, and a suggested follow-up opener — within seconds. Lead status is tracked as "new" until actioned.'
  },
  {
    id: 2, name: 'Booking alert', group: 'rt', live: true, isnew: false,
    trigger: 'Discovery call booked on Cal.com',
    desc: 'Instant alert with client details and pre-call prep brief',
    output: 'Telegram instant alert',
    flow: ['Cal.com booking', 'Webhook → server', 'Save to bookings DB', 'OpenClaw AI', 'Pre-call brief', 'Telegram alert'],
    detail: 'When a prospect books a discovery call, you immediately get their details, scheduled time, Google Meet link, and a prep brief with suggested talking points tailored to their business. Booking is saved to the database.'
  },
  {
    id: 3, name: 'Website chat bot', group: 'rt', live: true, isnew: true,
    trigger: 'Visitor sends message on appteck.ai',
    desc: 'AI assistant trained on AppTeck.ai — answers, qualifies, books calls',
    output: 'Instant AI reply on website',
    flow: ['Visitor types message', 'POST to leads.appteck.ai/chat', 'Python server (API key secure)', 'Anthropic Haiku API', 'Response to browser'],
    detail: 'A fully trained Claude Haiku AI assistant embedded on the website. Knows all service tiers, pricing, compliance rules, and processes. Built-in security prevents jailbreaking or leaking sensitive info. The Anthropic API key is secured server-side — never exposed in the browser. Maintains conversation memory across the chat session.'
  },
  {
    id: 4, name: 'Site monitor', group: 'cr', live: true, isnew: false,
    trigger: 'Every 30 minutes',
    desc: 'HTTP check on appteck.ai — alerts instantly if down',
    output: 'Telegram if down',
    flow: ['Cron every 30min', 'Fetch appteck.ai', 'Check HTTP 200', 'If down → alert', 'Telegram alert'],
    detail: 'Every 30 minutes OpenClaw fetches appteck.ai and checks the HTTP response code. If the site goes down for any reason you get an immediate Telegram alert with the status and response time.'
  },
  {
    id: 5, name: 'Email reader', group: 'cr', live: true, isnew: false,
    trigger: 'Every 15 minutes',
    desc: 'Reads inbox, categorises emails, drafts replies',
    output: 'Telegram digest',
    flow: ['Cron every 15min', 'Gmail API read', 'AI categorise', 'Draft replies', 'Telegram digest'],
    detail: 'Reads your sales@appteck.ai inbox every 15 minutes via Gmail API. AI categorises each email (lead, booking, billing, spam), drafts reply suggestions, and sends a clean digest to Telegram.'
  },
  {
    id: 6, name: 'Follow-up chaser', group: 'cr', live: true, isnew: true,
    trigger: 'Twice daily — 9am and 3pm AEST',
    desc: 'Queries CRM for overdue leads, drafts emails, auto-sends on APPROVE',
    output: 'Telegram → reply APPROVE to send',
    flow: ['Cron 9am + 3pm', 'Query SQLite CRM', 'Find leads > 24h', 'Draft email → save DB', 'Telegram: APPROVE <id>', 'Gmail API auto-sends'],
    detail: 'Queries the lead CRM database twice daily. Any lead with status "new" older than 24 hours gets a professionally drafted follow-up email sent to your Telegram for review. Reply "APPROVE <id>" in Telegram and the email is sent automatically via Gmail API. Lead is marked as contacted in the CRM.'
  },
  {
    id: 7, name: 'Daily summary', group: 'cr', live: true, isnew: false,
    trigger: 'Every morning 8am AEST',
    desc: 'Full pipeline report with real CRM data',
    output: 'Telegram morning brief',
    flow: ['Cron 8am AEST', 'Fetch /pipeline API', 'Real CRM data', 'OpenClaw AI', 'Telegram report'],
    detail: 'Every morning at 8am you get a full business briefing with live data from the lead CRM: pipeline stats (new/contacted/closed), leads needing follow-up today, bookings scheduled, monthly target progress, and a motivational line.'
  },
  {
    id: 8, name: 'Calendar manager', group: 'cr', live: true, isnew: false,
    trigger: 'Every morning 8am AEST',
    desc: "Fetches today's Google Calendar events with prep notes",
    output: 'Telegram morning brief',
    flow: ['Cron 8am AEST', 'Google Calendar API', 'Parse events', 'AI prep notes', 'Telegram brief'],
    detail: "Fetches your Google Calendar events for the day via API. For each meeting you get the attendee details, time, Google Meet link, and 2–3 AI-generated prep points for the call."
  },
  {
    id: 9, name: 'Booking manager', group: 'cr', live: true, isnew: false,
    trigger: 'Hourly',
    desc: 'Monitors Cal.com email confirmations, creates prep briefs',
    output: 'Telegram prep brief',
    flow: ['Cron hourly', 'Gmail API scan', 'Find booking emails', 'AI prep brief', 'Telegram brief'],
    detail: 'Scans your inbox hourly for Cal.com booking confirmation emails. For each new booking it builds a pre-call research brief: who the client is, what to prepare, which tier fits, and suggested questions.'
  },
  {
    id: 10, name: 'Follow-up reminder', group: 'cr', live: true, isnew: false,
    trigger: 'Daily',
    desc: 'Daily nudge with real overdue lead data from CRM',
    output: 'Telegram reminder',
    flow: ['Daily cron', 'Fetch /pipeline API', 'Find overdue leads', 'Telegram nudge'],
    detail: 'A daily Telegram reminder that fetches real data from the lead pipeline API. Shows which specific leads are overdue, how long since they enquired, and prompts you to action them.'
  },
  {
    id: 11, name: 'Ads + SEO agent', group: 'cr', live: false, isnew: false,
    trigger: 'Weekly — Monday 8am',
    desc: 'Meta Ads + Google Ads + Search Console weekly report',
    output: 'Telegram weekly report',
    flow: ['Cron weekly', 'Meta Ads API', 'Google Ads API', 'Search Console', 'AI analysis', 'Telegram report'],
    detail: 'Coming soon. Will pull weekly performance data from Meta Ads, Google Ads, and Google Search Console. AI analyses spend vs results, highlights top performers, flags underperforming campaigns, and recommends budget adjustments.'
  }
];

function createAgentCard(a) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `agent-card${a.live ? '' : ' soon'}`;
  btn.dataset.agentId = a.id;

  const top = document.createElement('div');
  top.className = 'agent-card-top';
  const status = document.createElement('span');
  status.className = `agent-status ${a.live ? 'live' : 'soon'}`;
  const name = document.createElement('span');
  name.className = 'agent-name';
  name.textContent = a.name;
  top.append(status, name);
  if (a.isnew) {
    const badge = document.createElement('span');
    badge.className = 'agent-badge new';
    badge.textContent = 'new';
    top.appendChild(badge);
  }

  const trigger = document.createElement('div');
  trigger.className = 'agent-trigger';
  trigger.textContent = a.trigger;

  const desc = document.createElement('div');
  desc.className = 'agent-desc';
  desc.textContent = a.desc;

  const output = document.createElement('div');
  output.className = 'agent-output';
  output.textContent = a.output;

  btn.append(top, trigger, desc, output);
  btn.addEventListener('click', () => showAgentDetail(a.id));
  return btn;
}

function renderAgents() {
  const rt = document.getElementById('rt-grid');
  const cr = document.getElementById('cr-grid');
  agents.filter(a => a.group === 'rt').forEach(a => rt.appendChild(createAgentCard(a)));
  agents.filter(a => a.group === 'cr').forEach(a => cr.appendChild(createAgentCard(a)));
}

function showAgentDetail(id) {
  const a = agents.find(x => x.id === id);
  if (!a) return;
  const panel = document.getElementById('agentDetail');

  panel.innerHTML = '';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'agent-close';
  close.setAttribute('aria-label', 'Close details');
  close.textContent = '✕';
  close.addEventListener('click', () => { panel.style.display = 'none'; });

  const title = document.createElement('div');
  title.className = 'agent-detail-name';
  title.append(document.createTextNode(a.name + ' '));
  const statusBadge = document.createElement('span');
  statusBadge.className = `agent-badge ${a.live ? 'live-text' : 'soon-text'}`;
  statusBadge.textContent = a.live ? 'live' : 'coming soon';
  title.appendChild(statusBadge);
  if (a.isnew) {
    const newBadge = document.createElement('span');
    newBadge.className = 'agent-badge new';
    newBadge.textContent = 'new today';
    title.appendChild(newBadge);
  }

  const body = document.createElement('div');
  body.className = 'agent-detail-body';
  body.textContent = a.detail;

  const flow = document.createElement('div');
  flow.className = 'agent-flow';
  a.flow.forEach((s, i) => {
    const step = document.createElement('span');
    step.className = 'agent-flow-step';
    step.textContent = s;
    flow.appendChild(step);
    if (i < a.flow.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'agent-flow-arrow';
      arrow.textContent = '›';
      flow.appendChild(arrow);
    }
  });

  panel.append(close, title, body, flow);
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('DOMContentLoaded', renderAgents);
