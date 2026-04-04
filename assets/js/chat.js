// ── AI CHAT WIDGET ──
// Posts to https://leads.appteck.ai/chat — system prompt is handled server-side.

const CHAT_API_URL = 'https://leads.appteck.ai/chat';
const MAX_HISTORY = 20;

let chatOpen = false;
let chatStarted = false;
const chatHistory = [];

function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open', chatOpen);
  document.getElementById('chatToggle').innerHTML = chatOpen
    ? '✕'
    : '💬 <span class="notif"></span>';
  if (chatOpen && !chatStarted) {
    chatStarted = true;
    setTimeout(() => addMsg('bot', "👋 Hi! I'm the AppTeck.ai assistant. I can answer questions about our services, pricing, and how we work. What would you like to know?"), 400);
  }
}

function addMsg(type, text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const t = document.createElement('div');
  t.className = 'typing';
  t.id = 'typing';
  t.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(t);
  msgs.scrollTop = msgs.scrollHeight;
  return t;
}

async function getAIResponse(userMsg) {
  chatHistory.push({ role: 'user', content: userMsg });
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const reply = data.reply || data.content?.[0]?.text || '';
  chatHistory.push({ role: 'assistant', content: reply });
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
  }
  return reply;
}

async function handleUserMessage(text) {
  document.getElementById('quickReplies').style.display = 'none';
  const t = showTyping();
  try {
    const reply = await getAIResponse(text);
    t.remove();
    addMsg('bot', reply);
  } catch (err) {
    t.remove();
    addMsg('bot', "I'm having trouble connecting. Please email sales@appteck.ai or book at cal.com/appteck");
  }
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMsg('user', text);
  input.value = '';
  await handleUserMessage(text);
}

async function sendQuick(text) {
  addMsg('user', text);
  await handleUserMessage(text);
}

// Wire up event listeners
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('chatToggle')?.addEventListener('click', toggleChat);
  document.getElementById('chatSend')?.addEventListener('click', sendChat);
  document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChat();
  });
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => sendQuick(btn.dataset.quick));
  });
});
