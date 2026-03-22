// script.js — Keryo AI v4.0 — Light theme, ChatGPT layout, 3D logo, bug fixes
'use strict';
document.addEventListener('DOMContentLoaded', function () {

/* ════════════════════════════════════════════════
   MODE DEFINITIONS
════════════════════════════════════════════════ */
var MODES = {
    general: {
        label:'General', color:'#5F43E9',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
        subtitle:'Your all-purpose AI — ask anything, get answers instantly.',
        placeholder:'Ask Keryo anything…',
        prompts:['What are 5 interesting facts about space?','Generate a futuristic neon cityscape','Write a poem about the monsoon','Explain quantum entanglement simply'],
        tools:[
            {label:'Web Search', prompt:'Search the web for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'},
            {label:'Generate Image', prompt:'Generate an image of ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'},
            {label:'Summarize', prompt:'Summarize this: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>'},
            {label:'Translate', prompt:'Translate to Hindi: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>'},
        ],
        sysAddition:'You are a general-purpose AI assistant. Be helpful, concise, and friendly.',
    },
    student: {
        label:'Student', color:'#22c55e',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>',
        subtitle:'Study smarter — Notes, MCQs, Revision, and Exam prep.',
        placeholder:'Ask about any topic, chapter, or subject…',
        prompts:['Explain photosynthesis for Class 10','Quiz me on the French Revolution (5 MCQs)','Make revision notes on Trigonometry','Explain Newton\'s 3rd Law with an example'],
        tools:[
            {label:'Make MCQs', prompt:'Create 5 MCQ questions on: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'},
            {label:'Explain Topic', prompt:'Explain this topic clearly: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>'},
            {label:'Make Notes', prompt:'Make revision notes on: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'},
            {label:'Revision Plan', prompt:'Make a 7-day revision plan for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'},
            {label:'Formula List', prompt:'List all important formulas for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>'},
            {label:'Practice Q', prompt:'Give me 5 practice questions on: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>'},
        ],
        sysAddition:'You are a student tutor AI. Explain concepts clearly with examples, adapt to school-level understanding. Create MCQs when asked. Keep answers educational and exam-focused.',
    },
    developer: {
        label:'Dev', color:'#60a5fa',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
        subtitle:'Code, debug, and build — your intelligent development companion.',
        placeholder:'Ask about code, errors, APIs, or architecture…',
        prompts:['Fix this JS error: TypeError: Cannot read property','Write a Python Flask REST API with CRUD','Explain async/await vs Promises','How to structure a React project for scale?'],
        tools:[
            {label:'Debug Code', prompt:'Debug this code:\n\n',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6l4-4 4 4"/><path d="M12 2v10.3"/><path d="M4.9 10a8 8 0 1014.2 0"/></svg>'},
            {label:'Optimize', prompt:'Optimize this code:\n\n',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},
            {label:'Explain Code', prompt:'Explain what this code does:\n\n',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'},
            {label:'Build Feature', prompt:'Write code to implement: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'},
            {label:'API Help', prompt:'Show me how to call this API: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>'},
        ],
        sysAddition:'You are a senior software developer AI. Provide clean, well-commented code. Explain what the code does. Suggest best practices, identify bugs, and help with architecture decisions.',
    },
    creator: {
        label:'Creator', color:'#f472b6',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
        subtitle:'Content, scripts, captions — fuel your creative workflow.',
        placeholder:'Describe what content you need…',
        prompts:['Write a YouTube script on AI trends (5 mins)','Generate 10 Instagram captions for a food post','Write a brand bio for a fitness influencer','Create 15 trending hashtags for a tech post'],
        tools:[
            {label:'Reel Script', prompt:'Write a 30-second reel script about: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'},
            {label:'Caption Ideas', prompt:'Write 5 engaging captions for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'},
            {label:'Hashtags', prompt:'Generate 20 relevant hashtags for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>'},
            {label:'Content Plan', prompt:'Make a 7-day content calendar for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'},
            {label:'Brand Bio', prompt:'Write a brand bio for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'},
        ],
        sysAddition:'You are a creative content strategist AI. Help with scripts, captions, hashtags, brand voice, and content strategy. Make content engaging, trendy, and platform-optimized.',
    },
    writer: {
        label:'Writer', color:'#fb923c',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
        subtitle:'Essays, blogs, stories — elevate every word you write.',
        placeholder:'Tell me what you want to write…',
        prompts:['Write a 500-word blog post on mindfulness','Give me 5 creative story starters','Edit this paragraph for clarity','Write a cover letter for a software job'],
        tools:[
            {label:'Blog Post', prompt:'Write a blog post about: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'},
            {label:'Short Story', prompt:'Write a short story about: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>'},
            {label:'Email Draft', prompt:'Write a professional email for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'},
            {label:'Edit & Polish', prompt:'Edit and improve this text:\n\n',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>'},
            {label:'Essay Outline', prompt:'Create an essay outline for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'},
        ],
        sysAddition:'You are a professional writing AI. Help with essays, blogs, stories, emails, and editing. Focus on clarity, flow, tone, and style.',
    },
    research: {
        label:'Research', color:'#a78bfa',
        iconSvg:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        subtitle:'Deep dives, citations, analysis — research at another level.',
        placeholder:'Enter your research topic or question…',
        prompts:['Analyze the impact of AI on employment','Compare theories of consciousness','Summarize advances in quantum computing','What does research say about intermittent fasting?'],
        tools:[
            {label:'Web Search', prompt:'Research current info on: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>'},
            {label:'Compare', prompt:'Compare and contrast: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'},
            {label:'Pros & Cons', prompt:'List pros and cons of: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>'},
            {label:'Timeline', prompt:'Create a timeline of events for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},
            {label:'SWOT Analysis', prompt:'Do a SWOT analysis for: ',iconSvg:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'},
        ],
        sysAddition:'You are a research AI. Provide detailed, accurate, well-structured answers. Present multiple perspectives and distinguish facts from opinions.',
    },
};

/* ════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════ */
var chats = [], currentChatId = null, isGenerating = false;
var attachedFiles = [], currentUser = null, userPlan = 'free';
var sbClient = null, userScrolled = false, streamEl = null, streamText = '';
var isSpeaking = false, recognizer = null, isListening = false;
var currentMode = 'general', guestMsgCount = 0, GUEST_MSG_LIMIT = 15;
var bannerShownFor = {}, searchQuery = '';
var settings = loadSettings(), weakTopics = loadWeakTopics();
var customPrompts = loadCustomPrompts(), promptLibActiveCat = 'All';
var sidebarCollapsed = false;

var KERYO_MODEL_NAMES = {
    'mistralai/mistral-7b-instruct:free':      'Keryo Spark',
    'meta-llama/llama-3.2-3b-instruct:free':   'Keryo Llama',
    'qwen/qwen-2-7b-instruct:free':            'Keryo Qwen',
    'google/gemma-2-9b-it:free':               'Keryo Gemma',
    'microsoft/phi-3-mini-128k-instruct:free': 'Keryo Phi',
    'deepseek/deepseek-r1-distill-qwen-14b:free': 'Keryo DeepSeek',
    'openai/gpt-4o-mini':                      'Keryo Mini',
    'openai/gpt-4o':                           'Keryo Ultra',
    'google/gemini-flash-1.5':                 'Keryo Flash',
    'anthropic/claude-3.5-sonnet':             'Keryo 3.5 Smartest',
};
function modelLabel(m) { return KERYO_MODEL_NAMES[m] || m.split('/').pop(); }
window.updateModelBadge = function(model) {
    var b = el('model-badge'); if (b) b.textContent = modelLabel(model);
    var l = el('active-model-label'); if (l) l.textContent = modelLabel(model);
};

/* ════════════════════════════════════════════════
   DOM HELPERS
════════════════════════════════════════════════ */
function el(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var messagesEl = el('messages'), msgCont = el('messages-container');
var welcomeEl = el('welcome-screen'), chatListEl = el('chat-list');
var userInput = el('user-input'), sendBtn = el('send-btn'), stopBtn = el('stop-btn');
var charCountEl = el('char-count'), fileInputEl = el('file-input');
var fileStripEl = el('file-preview-strip'), toastEl = el('toast');
var scrollBottomBtn = el('scroll-bottom-btn');

/* ════════════════════════════════════════════════
   SETTINGS
════════════════════════════════════════════════ */
function loadSettings() {
    try {
        var s = JSON.parse(localStorage.getItem('keryo_settings') || '{}');
        return {
            model:       s.model       || 'mistralai/mistral-7b-instruct:free',
            theme:       s.theme       || 'light',
            lang:        s.lang        || 'en',
            defaultMode: s.defaultMode || 'general',
            memory:      s.memory      !== false,
            memoryText:  s.memoryText  || '',
            temperature: typeof s.temperature === 'number' ? s.temperature : 0.7,
            fontSize:    s.fontSize    || 'normal',
            soundNotify: s.soundNotify !== false,
            showFollowUp:s.showFollowUp !== false,
            showReadTime:s.showReadTime !== false,
        };
    } catch(_) { return {model:'mistralai/mistral-7b-instruct:free',theme:'light',lang:'en',defaultMode:'general',memory:true,memoryText:'',temperature:0.7,fontSize:'normal',soundNotify:true,showFollowUp:true,showReadTime:true}; }
}
function saveSettings() { try { localStorage.setItem('keryo_settings', JSON.stringify(settings)); } catch(_) {} }
function loadWeakTopics() { try { return JSON.parse(localStorage.getItem('keryo_topics')||'[]'); } catch(_) { return []; } }
function saveWeakTopics() { try { localStorage.setItem('keryo_topics', JSON.stringify(weakTopics)); } catch(_) {} }
function loadCustomPrompts() { try { return JSON.parse(localStorage.getItem('keryo_custom_prompts')||'[]'); } catch(_) { return []; } }
function saveCustomPrompts() { try { localStorage.setItem('keryo_custom_prompts', JSON.stringify(customPrompts)); } catch(_) {} }
function loadGuestCount() { guestMsgCount = parseInt(localStorage.getItem('keryo_guest_count')||'0',10); }
function saveGuestCount() { try { localStorage.setItem('keryo_guest_count', String(guestMsgCount)); } catch(_) {} }

function applySettings() {
    if (window.CONFIG) CONFIG.MODEL = settings.model;
    var mb = el('model-badge'); if (mb) mb.textContent = modelLabel(settings.model);
    var lbl = el('active-model-label'); if (lbl) lbl.textContent = modelLabel(settings.model);
    var ms = el('model-select'); if (ms) ms.value = settings.model;
    applyTheme(settings.theme);
    var ls = el('lang-select'); if (ls) ls.value = settings.lang;
    var ts = el('temp-slider'); if (ts) { ts.value = Math.round(settings.temperature*100); el('temp-label').textContent = settings.temperature.toFixed(1); }
    document.querySelectorAll('.font-size-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.size === settings.fontSize); });
    applyFontSize(settings.fontSize);
    document.querySelectorAll('.theme-option-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.theme === settings.theme); });
    var mi = el('memory-input'); if (mi) mi.value = settings.memoryText || '';
    wireToggle('sound-toggle', settings.soundNotify);
    wireToggle('followup-toggle', settings.showFollowUp);
    wireToggle('readtime-toggle', settings.showReadTime);
}
function wireToggle(id, val) { var b=el(id); if(b){b.setAttribute('aria-pressed',String(val));b.classList.toggle('on',val);} }
function applyFontSize(sz) { var m={small:'13px',normal:'15px',large:'17px'}; document.documentElement.style.setProperty('--msg-font-size',m[sz]||'15px'); }
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    settings.theme = theme;
    var li = el('theme-icon-light'), di = el('theme-icon-dark');
    if (li) li.style.display = (theme==='light') ? 'block' : 'none';
    if (di) di.style.display = (theme==='dark')  ? 'block' : 'none';
    var hlLink = el('hljs-theme');
    if (hlLink) hlLink.href = theme==='light'
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
}

el('theme-btn').addEventListener('click', function() {
    var next = settings.theme === 'light' ? 'dark' : 'light';
    applyTheme(next); saveSettings();
    document.querySelectorAll('.theme-option-btn').forEach(function(b){b.classList.toggle('active',b.dataset.theme===next);});
    toast(next.charAt(0).toUpperCase()+next.slice(1)+' mode');
});

/* ════════════════════════════════════════════════
   LANDING CANVAS ANIMATION
════════════════════════════════════════════════ */
(function() {
    var canvas = el('landing-canvas'); if (!canvas) return;
    var ctx = canvas.getContext('2d'), W, H, pts = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function mkPt() { return {x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+0.4,a:Math.random(),da:(Math.random()-0.5)*0.005,sp:Math.random()*0.25+0.05,hue:Math.random()*60+220}; }
    resize(); for(var i=0;i<120;i++) pts.push(mkPt());
    window.addEventListener('resize', resize);
    function draw() {
        ctx.clearRect(0,0,W,H);
        pts.forEach(function(p) {
            p.a+=p.da; if(p.a<0)p.da=Math.abs(p.da); if(p.a>1)p.da=-Math.abs(p.da);
            p.y-=p.sp; if(p.y<-2){p.y=H+2;p.x=Math.random()*W;}
            ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle='hsla('+p.hue+',80%,70%,'+(p.a*0.5)+')'; ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════ */
var toastTimer;
function toast(msg, type, dur) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = 'toast show' + (type ? ' toast-' + type : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { toastEl.className = 'toast'; }, dur || 2200);
}

/* ════════════════════════════════════════════════
   SOUND
════════════════════════════════════════════════ */
function playDoneSound() {
    if (!settings.soundNotify) return;
    try {
        var ac = new (window.AudioContext||window.webkitAudioContext)();
        var o = ac.createOscillator(), g = ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.setValueAtTime(880, ac.currentTime);
        o.frequency.exponentialRampToValueAtTime(1100, ac.currentTime+0.08);
        g.gain.setValueAtTime(0.12, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+0.3);
        o.start(); o.stop(ac.currentTime+0.3);
    } catch(_) {}
}

/* ════════════════════════════════════════════════
   SUPABASE
════════════════════════════════════════════════ */
function tryInitSupabase() {
    try { if(window.supabase&&window.CONFIG&&CONFIG.SUPABASE_URL) sbClient=window.supabase.createClient(CONFIG.SUPABASE_URL,CONFIG.SUPABASE_KEY); } catch(_) {}
}
tryInitSupabase(); setTimeout(tryInitSupabase, 800);

/* ════════════════════════════════════════════════
   PERSISTENCE
════════════════════════════════════════════════ */
function lsLoad() { try { return JSON.parse(localStorage.getItem('keryo_chats')||'[]'); } catch(_) { return []; } }
function lsSave() { try { localStorage.setItem('keryo_chats', JSON.stringify(chats)); } catch(_) {} }
function genId() { return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }

async function loadAllChats() {
    if (sbClient && currentUser) {
        try {
            var res = await sbClient.from('chats').select('id,title,created_at').eq('user_id',currentUser.sub).order('created_at',{ascending:false}).limit(80);
            if (!res.error && res.data) { chats=res.data.map(function(c){return{id:c.id,title:c.title,messages:null};}); renderChatList(); return; }
        } catch(_) {}
    }
    chats = lsLoad(); renderChatList();
}
async function loadMessages(chatId) {
    var chat = chats.find(function(c){return c.id===chatId;}); if(!chat) return [];
    if (chat.messages) return chat.messages;
    if (sbClient && currentUser) {
        try {
            var res = await sbClient.from('messages').select('role,content,msg_type,timestamp').eq('chat_id',chatId).order('timestamp',{ascending:true});
            if (!res.error && res.data) { chat.messages=res.data; return chat.messages; }
        } catch(_) {}
    }
    chat.messages = chat.messages||[]; return chat.messages;
}
async function persistNewChat(chat) {
    if (sbClient && currentUser) { try { await sbClient.from('chats').insert({id:chat.id,user_id:currentUser.sub,title:chat.title}); } catch(_) {} }
    lsSave();
}
async function persistMessage(chatId, msg) {
    var chat = chats.find(function(c){return c.id===chatId;}); if(!chat) return;
    if (!chat.messages) chat.messages = [];
    chat.messages.push(msg);
    if (sbClient && currentUser) { try { await sbClient.from('messages').insert({chat_id:chatId,role:msg.role,content:msg.content,msg_type:msg.type||'text',timestamp:msg.ts}); } catch(_) {} }
    lsSave();
}
async function persistTitle(chatId, title) {
    if (sbClient && currentUser) { try { await sbClient.from('chats').update({title:title}).eq('id',chatId); } catch(_) {} }
    lsSave();
}
async function persistDeleteChat(chatId) {
    if (sbClient && currentUser) { try { await sbClient.from('messages').delete().eq('chat_id',chatId); await sbClient.from('chats').delete().eq('id',chatId); } catch(_) {} }
    chats = chats.filter(function(c){return c.id!==chatId;}); lsSave();
}

/* ════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════ */
var KERYO_SEEN_KEY = 'keryo_seen_v4';
function showLandingPage() {
    el('landing-page').style.display = 'flex';
    el('app').style.display = 'none';
}
function hideLandingPage() {
    var lp = el('landing-page');
    lp.classList.add('landing-exit');
    localStorage.setItem(KERYO_SEEN_KEY, '1');
    setTimeout(function() {
        lp.style.display = 'none';
        lp.classList.remove('landing-exit');
        el('app').style.display = 'flex';
    }, 380);
}

el('landing-google-btn').addEventListener('click', function() { hideLandingPage(); triggerGoogleSignIn(); });
el('landing-guest-btn').addEventListener('click', function() { hideLandingPage(); enterAsGuest(); });

function enterAsGuest() {
    currentUser = null;
    loadGuestCount();
    renderAccessState();
    applyMode(settings.defaultMode);
    loadAllChats().then(function() {
        if (chats.length > 0) selectChat(chats[0].id); else showWelcome();
    });
}

/* ════════════════════════════════════════════════
   ACCESS STATE  (logged in vs guest)
════════════════════════════════════════════════ */
function renderAccessState() {
    var profileCard = el('profile-card'), guestCard = el('guest-sidebar-card');
    var navSignin = el('nav-signin-btn');
    if (currentUser) {
        if (profileCard)  profileCard.style.display  = 'block';
        if (guestCard)    guestCard.style.display    = 'none';
        if (navSignin)    navSignin.style.display    = 'none';
        updateProfileCard();
    } else {
        if (profileCard)  profileCard.style.display  = 'none';
        if (guestCard)    guestCard.style.display    = 'block';
        if (navSignin)    navSignin.style.display    = 'flex';
    }
    updateGuestBar();
}

function updateProfileCard() {
    if (!currentUser) return;
    var picEl = el('profile-pic'), nameEl = el('profile-name'), planEl = el('profile-plan-badge');
    var pmN = el('pm-name'), pmE = el('pm-email'), pmAv = el('pm-avatar-img');
    var spnEl = el('settings-plan-name');
    if (picEl)  { picEl.src = currentUser.picture||''; picEl.onerror=function(){this.style.display='none';}; }
    if (nameEl) nameEl.textContent = currentUser.name||'User';
    if (planEl) planEl.textContent = userPlan.charAt(0).toUpperCase()+userPlan.slice(1);
    if (pmN)  pmN.textContent  = currentUser.name||'User';
    if (pmE)  pmE.textContent  = currentUser.email||'';
    if (pmAv) { if(currentUser.picture) pmAv.innerHTML='<img src="'+currentUser.picture+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt=""/>'; }
    if (spnEl) spnEl.textContent = userPlan.charAt(0).toUpperCase()+userPlan.slice(1)+' Plan';
}

function updateGuestBar() {
    if (currentUser) return;
    var left = Math.max(0, GUEST_MSG_LIMIT - guestMsgCount);
    if (left <= 5 && left > 0) {
        showGuestBanner(left + ' messages left', 'Sign in for unlimited access');
    }
}

/* ════════════════════════════════════════════════
   GOOGLE SIGN-IN
════════════════════════════════════════════════ */
function triggerGoogleSignIn() {
    if (typeof google === 'undefined' || !google.accounts) {
        toast('Google Sign-in loading… try again','',2000); return;
    }
    google.accounts.id.prompt(function(n) {
        if (n.isNotDisplayed() || n.isSkippedMoment()) {
            var bd = document.createElement('div');
            bd.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--surface);border-radius:16px;padding:24px;box-shadow:var(--shadow-lg);border:1px solid var(--border)';
            bd.innerHTML = '<div style="font-size:15px;font-weight:600;margin-bottom:14px;font-family:var(--font-display)">Sign in to Keryo AI</div>';
            document.body.appendChild(bd);
            google.accounts.id.renderButton(bd, {theme:'outline',size:'large',text:'sign_in_with',width:260});
        }
    });
}

window.handleGoogleCredential = function(resp) {
    if (!resp || !resp.credential) { toast('Sign-in failed','error'); return; }
    try {
        var parts = resp.credential.split('.');
        var payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/,'/')));
        currentUser = payload;
        hideLandingPage();
        renderAccessState();
        applyMode(settings.defaultMode);
        loadAllChats().then(function() {
            if (chats.length>0) selectChat(chats[0].id); else showWelcome();
        });
        toast('Welcome, ' + (payload.name||'User') + '!', 'success');
    } catch(e) { toast('Sign-in error: '+e.message,'error'); }
};

function initGoogleSignIn() {
    if (typeof google==='undefined'||!google.accounts) { setTimeout(initGoogleSignIn,500); return; }
    try { google.accounts.id.initialize({client_id:CONFIG.GOOGLE_CLIENT_ID,callback:window.handleGoogleCredential,auto_select:false,cancel_on_tap_outside:true}); } catch(_) {}
}
initGoogleSignIn();

/* Nav / sidebar sign-in buttons */
el('nav-signin-btn').addEventListener('click', triggerGoogleSignIn);
el('gsc-signin-btn').addEventListener('click', triggerGoogleSignIn);

/* ════════════════════════════════════════════════
   SIDEBAR COLLAPSE
════════════════════════════════════════════════ */
function setSidebar(collapsed) {
    sidebarCollapsed = collapsed;
    var sb = el('sidebar'), openBtn = el('sidebar-open-btn'), navLogo = el('nav-logo');
    if (collapsed) {
        sb.classList.add('collapsed');
        if (openBtn) openBtn.style.display = 'flex';
        if (navLogo) navLogo.style.display = 'flex';
    } else {
        sb.classList.remove('collapsed');
        if (openBtn) openBtn.style.display = 'none';
        if (navLogo) navLogo.style.display = 'none';
    }
}
el('sidebar-collapse-btn').addEventListener('click', function() { setSidebar(true); });
el('sidebar-open-btn').addEventListener('click', function() { setSidebar(false); });

/* ════════════════════════════════════════════════
   PROFILE MENU
════════════════════════════════════════════════ */
var trigger = el('profile-card-trigger');
if (trigger) {
    trigger.addEventListener('click', function(e) {
        var menu = el('profile-menu'), chevron = el('profile-chevron');
        var open = menu.style.display === 'block';
        menu.style.display = open ? 'none' : 'block';
        if (chevron) chevron.classList.toggle('open', !open);
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#profile-card')) {
            var menu = el('profile-menu'); if (menu) menu.style.display = 'none';
            var ch = el('profile-chevron'); if (ch) ch.classList.remove('open');
        }
    });
}
var pmSettings = el('pm-settings-btn');
if (pmSettings) pmSettings.addEventListener('click', function() {
    el('profile-menu').style.display='none'; applySettings(); el('settings-modal').style.display='flex';
});
var pmUpgrade = el('pm-upgrade-btn');
if (pmUpgrade) pmUpgrade.addEventListener('click', function() {
    el('profile-menu').style.display='none'; el('upgrade-modal').style.display='flex';
});
var pmLogout = el('pm-logout-btn');
if (pmLogout) pmLogout.addEventListener('click', function() {
    currentUser=null; el('profile-menu').style.display='none';
    chats=[]; currentChatId=null; lsSave(); renderChatList(); showWelcome();
    renderAccessState(); toast('Signed out');
    setTimeout(showLandingPage, 600);
});

/* ════════════════════════════════════════════════
   MODE DROPDOWN
════════════════════════════════════════════════ */
var modeToggle = el('mode-toggle-btn'), modeMenu = el('mode-dropdown-menu');
if (modeToggle) {
    modeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var open = modeMenu.classList.toggle('open');
        modeToggle.classList.toggle('open', open);
        modeToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#mode-dropdown')) {
            modeMenu.classList.remove('open');
            modeToggle.classList.remove('open');
            modeToggle.setAttribute('aria-expanded','false');
        }
    });
}
document.querySelectorAll('.mode-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
        applyMode(btn.dataset.mode);
        saveSettings();
        modeMenu.classList.remove('open');
        modeToggle.classList.remove('open');
        toast(MODES[btn.dataset.mode].label + ' mode');
    });
});

/* ════════════════════════════════════════════════
   APPLY MODE
════════════════════════════════════════════════ */
function applyMode(mode) {
    if (!MODES[mode]) mode = 'general';
    currentMode = mode; settings.defaultMode = mode;
    var modeData = MODES[mode];
    // Update mode toggle button
    var toggleIcon = el('mode-toggle-icon'), toggleLabel = el('mode-toggle-label');
    if (toggleIcon) toggleIcon.innerHTML = modeData.iconSvg;
    if (toggleLabel) toggleLabel.textContent = modeData.label;
    // Mark active option
    document.querySelectorAll('.mode-option').forEach(function(b) { b.classList.toggle('active', b.dataset.mode===mode); });
    // Update input placeholder
    if (userInput) userInput.placeholder = modeData.placeholder;
    // Render mode tools strip
    renderModeTools(modeData);
    // Render welcome prompts
    renderExamplePrompts(modeData);
    // Update welcome text
    var wt = el('welcome-title'), ws = el('welcome-subtitle');
    if (ws) ws.textContent = modeData.subtitle;
}

function renderModeTools(modeData) {
    var strip = el('mode-tools-strip'); if (!strip) return;
    strip.innerHTML = '';
    modeData.tools.forEach(function(tool) {
        var btn = document.createElement('button'); btn.className = 'mode-tool-btn';
        btn.innerHTML = tool.iconSvg + '<span>' + tool.label + '</span>';
        btn.addEventListener('click', function() {
            userInput.value = tool.prompt;
            userInput.dispatchEvent(new Event('input'));
            userInput.focus();
        });
        strip.appendChild(btn);
    });
}

function renderExamplePrompts(modeData) {
    var container = el('example-prompts'); if (!container) return;
    container.innerHTML = '';
    modeData.prompts.forEach(function(p) {
        var card = document.createElement('div'); card.className = 'example-chip';
        card.textContent = p;
        card.addEventListener('click', function() { userInput.value = p; updateSendBtn(); userInput.focus(); });
        container.appendChild(card);
    });
}

/* ════════════════════════════════════════════════
   GUEST BANNER
════════════════════════════════════════════════ */
function showGuestBanner(title, sub) {
    if (currentUser) return;
    var key = (title||'').slice(0,30); if (bannerShownFor[key]) return; bannerShownFor[key] = true;
    var banner = el('guest-banner'), gt = el('guest-banner-text');
    if (!banner) return;
    if (gt) gt.textContent = (title||'Sign in to unlock all features') + (sub ? ' — ' + sub : '');
    banner.style.display = 'flex';
}
el('guest-banner-signin').addEventListener('click', function() { el('guest-banner').style.display='none'; triggerGoogleSignIn(); });
el('guest-banner-close').addEventListener('click', function() { el('guest-banner').style.display='none'; });

/* ════════════════════════════════════════════════
   CHAT MANAGEMENT
════════════════════════════════════════════════ */
async function createNewChat() {
    var chat = {id:genId(),title:'New Chat',messages:[]};
    chats.unshift(chat);
    if (currentUser) await persistNewChat(chat); else lsSave();
    renderChatList(); selectChat(chat.id); return chat.id;
}

async function selectChat(id) {
    currentChatId = id;
    var chat = chats.find(function(c){return c.id===id;}); if(!chat) return;
    welcomeEl.style.display = 'none'; messagesEl.innerHTML = ''; userScrolled = false;
    renderChatList();
    var msgs = await loadMessages(id);
    for (var i=0;i<msgs.length;i++) appendMessage(msgs[i].role,msgs[i].content,msgs[i].ts||msgs[i].timestamp,false,msgs[i].type||msgs[i].msg_type);
    scrollBottom(true);
    if (window.innerWidth<=768) setSidebar(true);
}

function showWelcome() {
    messagesEl.innerHTML = ''; welcomeEl.style.display = 'flex'; currentChatId = null;
    applyMode(currentMode);
}

function renderChatList(query) {
    query = query!==undefined ? query : searchQuery;
    chatListEl.innerHTML = '';
    var filtered = query ? chats.filter(function(c){return c.title.toLowerCase().includes(query.toLowerCase());}) : chats;
    var sLabel = document.querySelector('.chat-section-label');
    if (sLabel) sLabel.textContent = query ? 'Search results' : 'Recent';
    if (!filtered.length) {
        chatListEl.innerHTML='<div style="padding:12px 10px;font-size:12px;color:var(--text3);text-align:center">'+(query?'No matching chats':'No chats yet')+'</div>'; return;
    }
    filtered.forEach(function(chat) {
        var div = document.createElement('div'); div.className = 'chat-item'+(chat.id===currentChatId?' active':'');
        div.innerHTML = '<div class="chat-item-title" title="'+esc(chat.title)+'">'+esc(chat.title)+'</div>'
            +'<button class="chat-item-del" data-id="'+chat.id+'" title="Delete"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg></button>';
        div.addEventListener('click', function(e) { if(!e.target.closest('.chat-item-del')) selectChat(chat.id); });
        chatListEl.appendChild(div);
    });
}

chatListEl.addEventListener('click', function(e) {
    var db = e.target.closest('.chat-item-del');
    if (db) {
        if (!confirm('Delete this chat?')) return;
        persistDeleteChat(db.dataset.id); renderChatList();
        if (currentChatId===db.dataset.id) showWelcome();
    }
});

el('chat-search').addEventListener('input', function() { searchQuery = this.value.trim(); renderChatList(searchQuery); });
el('new-chat-btn').addEventListener('click', createNewChat);

/* ════════════════════════════════════════════════
   MARKDOWN UTILS
════════════════════════════════════════════════ */
window.markdownToHtml = function(text) {
    if (!text) return '';
    var t = text;
    // Code blocks
    t = t.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
        var encCode = encodeURIComponent(code.trim());
        return '<div class="code-block"><div class="code-block-header"><span>'+(lang||'code')+'</span><button class="copy-code-btn" data-code="'+encCode+'">Copy</button></div><pre><code class="language-'+(lang||'text')+'">'+esc(code.trim())+'</code></pre></div>';
    });
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Headers
    t = t.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    t = t.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    t = t.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // Bold/italic
    t = t.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Lists
    t = t.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    t = t.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    t = t.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // Blockquote
    t = t.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    // HR
    t = t.replace(/^---+$/gm, '<hr>');
    // Links
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Newlines to paragraphs (only for non-block elements)
    t = t.replace(/\n\n/g, '<br><br>');
    t = t.replace(/\n/g, '<br>');
    return t;
};

window.estimateReadingTime = function(text) {
    var wpm = 200, words = (text||'').split(/\s+/).length;
    var mins = Math.ceil(words/wpm);
    return mins < 2 ? '~1 min read' : '~'+mins+' min read';
};

window.generateChatTitle = function(text) {
    if (!text) return 'New Chat';
    var t = text.trim().replace(/\n/g,' ').slice(0,55);
    return t.length < text.trim().length ? t+'…' : t;
};

/* ════════════════════════════════════════════════
   MESSAGE RENDERING
════════════════════════════════════════════════ */
var AI_AVATAR_HTML = '<svg width="16" height="16" viewBox="0 0 40 40" fill="none"><polygon style="fill:rgba(95,67,233,0.15);stroke:#5F43E9;stroke-width:1.5" points="20,2 36,11 36,29 20,38 4,29 4,11"/><rect style="fill:#5F43E9" x="12" y="10" width="4" height="20" rx="1.5"/><polygon style="fill:#5F43E9;opacity:0.85" points="16,20 26,10 30,10 20,20"/><polygon style="fill:#5F43E9;opacity:0.85" points="16,20 26,30 30,30 20,20"/><circle style="fill:#00C9FF" cx="20" cy="20" r="2"/></svg>';

function fmtTime(ts) { return new Date(ts||Date.now()).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }

function highlightCode(div) {
    if (typeof hljs==='undefined') { setTimeout(function(){highlightCode(div);},500); return; }
    div.querySelectorAll('pre code:not([data-highlighted])').forEach(function(b) { hljs.highlightElement(b); b.dataset.highlighted='1'; });
}

function appendMessage(role, content, ts, scroll, type) {
    ts = ts||Date.now(); type = type||'text';
    var div = document.createElement('div'); div.className='message '+role; div.dataset.ts=ts;
    var avatarHtml = role==='user'
        ? '<div class="msg-avatar user-av">'+(currentUser&&currentUser.name?currentUser.name[0].toUpperCase():'U')+'</div>'
        : '<div class="msg-avatar ai-av">'+AI_AVATAR_HTML+'</div>';
    var bubbleContent;
    if (type==='image') bubbleContent = buildImageCard(content);
    else if (role==='user') bubbleContent = '<div class="msg-content">'+esc(content).replace(/\n/g,'<br>')+'</div>';
    else bubbleContent = '<div class="msg-content">'+window.markdownToHtml(content)+'</div>';
    var rt = (role!=='user'&&type!=='image'&&settings.showReadTime&&content.length>200)
        ? '<span class="msg-read-time">' + window.estimateReadingTime(content) + '</span>' : '';
    div.innerHTML = avatarHtml + '<div class="msg-body"><div class="msg-bubble">'+bubbleContent+'</div>'
        + (role!=='user' ? '<div class="msg-actions">'
            + '<button class="msg-action-btn msg-copy-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>'
            + '<button class="msg-action-btn msg-tts-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg></button>'
            + '<button class="msg-action-btn msg-regen-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Retry</button>'
            + '</div>' : '')
        + '<div class="msg-meta"><span class="msg-time">'+fmtTime(ts)+'</span>'+rt+'</div></div>';
    // Wire copy
    var copyBtn = div.querySelector('.msg-copy-btn');
    if (copyBtn) { var captured = content; copyBtn.addEventListener('click', function() { navigator.clipboard.writeText(captured).then(function(){toast('Copied!','success');}); }); }
    var ttsBtn = div.querySelector('.msg-tts-btn');
    if (ttsBtn) { var cap2 = content; ttsBtn.addEventListener('click', function() { speakText(cap2, ttsBtn); }); }
    var regenBtn = div.querySelector('.msg-regen-btn');
    if (regenBtn) regenBtn.addEventListener('click', regenerateLastResponse);
    wireCodeCopy(div); wireImageViewer(div, content, type);
    messagesEl.appendChild(div);
    if (type!=='image') highlightCode(div);
    if (scroll!==false) scrollBottom();
    return div;
}

function wireCodeCopy(div) {
    div.querySelectorAll('.copy-code-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            try { var code = decodeURIComponent(btn.dataset.code||''); navigator.clipboard.writeText(code).then(function(){btn.textContent='Copied ✓';setTimeout(function(){btn.textContent='Copy';},1800);}); } catch(_) {}
        });
    });
}

function wireImageViewer(div, content, type) {
    if (type!=='image') return;
    var img = div.querySelector('.gen-img'); if (!img) return;
    img.addEventListener('click', function() { el('img-viewer-src').src=content; el('img-viewer-modal').style.display='flex'; });
}

function buildImageCard(url) {
    return '<div class="img-card"><img class="gen-img msg-image" src="'+url+'" alt="Generated by Keryo AI" loading="lazy"><div style="margin-top:8px;display:flex;gap:6px"><button class="msg-action-btn" onclick="var a=document.createElement(\'a\');a.href=\''+url+'\';a.download=\'keryo-'+Date.now()+'.png\';a.click()">Download</button></div></div>';
}

/* ════════════════════════════════════════════════
   TTS
════════════════════════════════════════════════ */
function speakText(text, btn) {
    if (!window.speechSynthesis) { toast('TTS not supported','error'); return; }
    if (isSpeaking) { window.speechSynthesis.cancel(); isSpeaking=false; return; }
    var plain = text.replace(/```[\s\S]*?```/g,'').replace(/[*_~`#\[\]]/g,'').trim();
    var utt = new SpeechSynthesisUtterance(plain);
    utt.lang = (settings.lang==='hi'||settings.lang==='hinglish')?'hi-IN':'en-US';
    utt.onstart = function(){isSpeaking=true;};
    utt.onend = utt.onerror = function(){isSpeaking=false;};
    window.speechSynthesis.speak(utt);
}
el('tts-btn').addEventListener('click', function() {
    var msgs = messagesEl.querySelectorAll('.message.ai');
    if (!msgs.length) { toast('No response to read','error'); return; }
    var textEl = msgs[msgs.length-1].querySelector('.msg-content');
    if (textEl) speakText(textEl.innerText||textEl.textContent, el('tts-btn'));
});

/* ════════════════════════════════════════════════
   TYPING / STREAMING
════════════════════════════════════════════════ */
function showTyping(isImg) {
    removeTyping();
    var wrap = document.createElement('div'); wrap.id='typing-ind'; wrap.className='message ai';
    wrap.innerHTML = '<div class="msg-avatar ai-av">'+AI_AVATAR_HTML+'</div>'
        +'<div class="msg-body"><div class="typing-bubble">'
        +(isImg?'<span style="margin-right:6px">Generating image</span>':'')
        +'<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>'
        +'</div></div>';
    messagesEl.appendChild(wrap); scrollBottom();
}
function removeTyping() { var t=el('typing-ind'); if(t&&t.parentNode) t.parentNode.removeChild(t); }

function createStreamEl() {
    var div = document.createElement('div'); div.className='message ai streaming';
    div.innerHTML = '<div class="msg-avatar ai-av">'+AI_AVATAR_HTML+'</div>'
        +'<div class="msg-body"><div class="msg-bubble"><div class="msg-content stream-content streaming-cursor"></div></div></div>';
    messagesEl.appendChild(div); streamEl=div; streamText=''; scrollBottom();
}
function updateStream(chunk) {
    streamText += chunk;
    var sc = streamEl ? streamEl.querySelector('.stream-content') : null;
    if (sc) sc.textContent = streamText;
    if (!userScrolled) scrollBottom();
}
function finalizeStream(ts) {
    if (!streamEl) return streamText;
    streamEl.classList.remove('streaming');
    var sc = streamEl.querySelector('.stream-content');
    if (sc) { sc.innerHTML = window.markdownToHtml(streamText); sc.classList.remove('stream-content','streaming-cursor'); }
    highlightCode(streamEl);
    var bodyEl = streamEl.querySelector('.msg-body');
    var captured = streamText;
    var rt = settings.showReadTime&&streamText.length>200 ? '<span class="msg-read-time">'+window.estimateReadingTime(streamText)+'</span>' : '';
    var actionsDiv = document.createElement('div'); actionsDiv.className='msg-actions';
    actionsDiv.innerHTML = '<button class="msg-action-btn msg-copy-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</button>'
        +'<button class="msg-action-btn msg-tts-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg></button>'
        +'<button class="msg-action-btn msg-regen-btn"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Retry</button>';
    actionsDiv.querySelector('.msg-copy-btn').addEventListener('click', function(){navigator.clipboard.writeText(captured).then(function(){toast('Copied!','success');});});
    var ttsB = actionsDiv.querySelector('.msg-tts-btn');
    if (ttsB) ttsB.addEventListener('click', function(){speakText(captured,ttsB);});
    var regenB = actionsDiv.querySelector('.msg-regen-btn');
    if (regenB) regenB.addEventListener('click', regenerateLastResponse);
    bodyEl.appendChild(actionsDiv);
    var meta = document.createElement('div'); meta.className='msg-meta';
    meta.innerHTML = '<span class="msg-time">'+fmtTime(ts)+'</span>'+rt;
    bodyEl.appendChild(meta);
    wireCodeCopy(streamEl);
    if (settings.showFollowUp) addFollowUpChips(streamEl, captured);
    var result = streamText; streamEl=null; streamText=''; scrollBottom(); return result;
}

function addFollowUpChips(msgDiv, text) {
    var body = msgDiv.querySelector('.msg-body'); if(!body) return;
    var lower = text.toLowerCase();
    var chips;
    if (/code|function|class|script/.test(lower)) chips=['Explain this code','Add error handling','Write tests for this'];
    else if (/formula|equation|math/.test(lower)) chips=['Show step by step','Give another example'];
    else if (/history|century|war/.test(lower))  chips=['What happened next?','Key people involved?'];
    else chips=['Tell me more','Give an example','Simplify this'];
    var wrap = document.createElement('div'); wrap.className='follow-up-chips';
    chips.forEach(function(chip) {
        var btn = document.createElement('button'); btn.className='follow-chip'; btn.textContent=chip;
        btn.addEventListener('click', function(){ userInput.value=chip; userInput.dispatchEvent(new Event('input')); userInput.focus(); wrap.remove(); });
        wrap.appendChild(btn);
    });
    body.appendChild(wrap);
}

/* ════════════════════════════════════════════════
   SCROLL
════════════════════════════════════════════════ */
function scrollBottom(force) { if(force||!userScrolled) msgCont.scrollTop=msgCont.scrollHeight; }
msgCont.addEventListener('scroll', function() {
    var fb = msgCont.scrollHeight-msgCont.scrollTop-msgCont.clientHeight;
    userScrolled = fb>120;
    if (scrollBottomBtn) scrollBottomBtn.style.display = fb>200 ? 'flex' : 'none';
});
if (scrollBottomBtn) scrollBottomBtn.addEventListener('click', function(){scrollBottom(true);userScrolled=false;});

/* ════════════════════════════════════════════════
   FILE HANDLING
════════════════════════════════════════════════ */
function handleFiles(files) {
    Array.from(files).forEach(function(file) {
        if (attachedFiles.length>=5) { toast('Max 5 files','error'); return; }
        var obj = {name:file.name,type:file.type,dataUrl:null,text:null};
        attachedFiles.push(obj);
        var idx = attachedFiles.length-1;
        if (file.type.startsWith('image/')) {
            var fr = new FileReader(); fr.onload=function(e){obj.dataUrl=e.target.result;renderFileChip(idx,obj,true);updateSendBtn();}; fr.readAsDataURL(file);
        } else {
            var fr2 = new FileReader(); fr2.onload=function(e){obj.text=e.target.result;renderFileChip(idx,obj,false);updateSendBtn();}; fr2.readAsText(file);
        }
    });
}
function renderFileChip(idx, obj, isImg) {
    var chip = document.createElement('div'); chip.className='file-preview-item'; chip.dataset.idx=idx;
    chip.innerHTML = (isImg&&obj.dataUrl?'<img src="'+obj.dataUrl+'" style="width:20px;height:20px;object-fit:cover;border-radius:3px">':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>')
        +'<span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(obj.name)+'</span>'
        +'<button class="file-preview-del">&times;</button>';
    chip.querySelector('.file-preview-del').addEventListener('click', function(){
        attachedFiles.splice(idx,1); fileStripEl.removeChild(chip);
        if(!fileStripEl.children.length) fileStripEl.style.display='none'; updateSendBtn();
    });
    fileStripEl.appendChild(chip); fileStripEl.style.display='flex';
}

/* ════════════════════════════════════════════════
   SEND BUTTON STATE
════════════════════════════════════════════════ */
function updateSendBtn() {
    var len = userInput.value.length;
    charCountEl.textContent = len>999?(len/1000).toFixed(1)+'k / 16k':len+' / 16k';
    charCountEl.style.color = len>12000?'#f87171':len>8000?'#fbbf24':'';
    sendBtn.disabled = (!len&&!attachedFiles.length)||len>16000||isGenerating;
}

/* ════════════════════════════════════════════════
   BUILD API MESSAGES
════════════════════════════════════════════════ */
function buildMessages(chatMessages, userText) {
    var sys = buildSystemPrompt();
    var history = (chatMessages||[]).slice(-20).map(function(m){ return {role:m.role,content:(m.type==='image'||m.msg_type==='image')?'[Image generated]':m.content}; });
    var hasImgs = attachedFiles.some(function(f){return f.type.startsWith('image/')&&f.dataUrl;});
    var hasFiles = attachedFiles.some(function(f){return f.text;});
    var userContent;
    if (hasImgs) {
        var txt = userText;
        if (hasFiles) txt = attachedFiles.filter(function(f){return f.text;}).map(function(f){return '--- '+f.name+' ---\n'+f.text;}).join('\n\n')+'\n\n---\n'+userText;
        var parts = [{type:'text',text:txt}];
        attachedFiles.forEach(function(f){if(f.dataUrl&&f.type.startsWith('image/'))parts.push({type:'image_url',image_url:{url:f.dataUrl}});});
        userContent = parts;
    } else if (hasFiles) {
        userContent = attachedFiles.filter(function(f){return f.text;}).map(function(f){return '--- File: '+f.name+' ---\n'+f.text;}).join('\n\n')+'\n\n---\nUser: '+userText;
    } else {
        userContent = userText;
    }
    return [{role:'system',content:sys}].concat(history).concat([{role:'user',content:userContent}]);
}

function buildSystemPrompt() {
    var langMap = {en:'English',hinglish:'Hinglish (natural Hindi-English mix, like Indians speak)',hi:'Hindi',es:'Spanish',fr:'French',de:'German',zh:'Chinese',ja:'Japanese',ar:'Arabic',ko:'Korean'};
    var lang = langMap[settings.lang]||'English';
    var modeData = MODES[currentMode]||MODES.general;
    var base = 'You are Keryo AI — a helpful, intelligent assistant.\nAlways respond in: '+lang+'\n'+modeData.sysAddition;
    if (settings.memory&&settings.memoryText) base += '\n\nUser memory/context:\n'+settings.memoryText;
    return base;
}

/* ════════════════════════════════════════════════
   SEND MESSAGE
════════════════════════════════════════════════ */
async function sendMessage() {
    if (isGenerating) return;
    var text = userInput.value.trim();
    if (!text && !attachedFiles.length) return;

    // Guest limit
    if (!currentUser) {
        if (guestMsgCount >= GUEST_MSG_LIMIT) {
            showGuestBanner('Guest limit reached', 'Sign in for unlimited messages'); return;
        }
        guestMsgCount++; saveGuestCount(); updateGuestBar();
        if (guestMsgCount===5) showGuestBanner('Sign in to save your chats');
        if (guestMsgCount===10) showGuestBanner('Almost at the limit!','Sign in for unlimited access');
    }

    if (!currentChatId) await createNewChat();
    var chat = chats.find(function(c){return c.id===currentChatId;}); if(!chat) return;

    isGenerating=true; userScrolled=false; updateSendBtn();
    var sentFiles = attachedFiles.slice();
    var ts = Date.now();
    var userMsg = {role:'user',content:text||'(attached files)',ts:ts,type:'text'};
    await persistMessage(currentChatId, userMsg);
    appendMessage('user',userMsg.content,ts,true);

    userInput.value=''; userInput.style.height='auto';
    attachedFiles=[]; fileStripEl.innerHTML=''; fileStripEl.style.display='none';
    sendBtn.style.display='none'; stopBtn.style.display='flex'; updateSendBtn();

    if (chat.messages&&chat.messages.length<=1&&text) {
        chat.title = window.generateChatTitle(text);
        persistTitle(currentChatId,chat.title); renderChatList();
    }

    var isImg = typeof window.isImageRequest === 'function' && window.isImageRequest(text);

    if (isImg) {
        if (!currentUser) {
            var gImgs = parseInt(localStorage.getItem('keryo_guest_imgs')||'0',10);
            if (gImgs>=3) { showGuestBanner('Image limit reached','Sign in for more images'); finish(); return; }
            localStorage.setItem('keryo_guest_imgs', gImgs+1);
        }
        var imgPrompt = text.replace(/^(create|generate|make|draw|design|render|paint|imagine|visualize|show\s+me|give\s+me)\s+(a\s+|an\s+)?/i,'').trim()||text;
        showTyping(true);
        window.generateImage(imgPrompt,
            async function(url) {
                removeTyping(); var ats=Date.now();
                await persistMessage(currentChatId,{role:'assistant',content:url,ts:ats,type:'image'});
                appendMessage('assistant',url,ats,true,'image'); playDoneSound(); finish();
            },
            function(err) { removeTyping(); appendErrorMessage('Image failed: '+err); finish(); }
        );
    } else {
        attachedFiles = sentFiles;
        var apiMsgs = buildMessages((chat.messages||[]).slice(0,-1), text);
        attachedFiles = [];
        var accumulated='', firstChunk=true;
        showTyping(false);

        window.generateResponse(apiMsgs,
            function(chunk) { accumulated+=chunk; if(firstChunk){removeTyping();createStreamEl();firstChunk=false;} updateStream(chunk); },
            function(err) {
                removeTyping();
                if (streamEl) { streamEl.parentNode.removeChild(streamEl); streamEl=null; }
                if (err==='__ALL_FAILED__') {
                    appendErrorMessage('All models failed. Please check your connection and try again.');
                } else {
                    appendErrorMessage(err);
                }
                finish();
            },
            async function(aborted) {
                var ats=Date.now();
                if (accumulated) {
                    finalizeStream(ats);
                    await persistMessage(currentChatId,{role:'assistant',content:accumulated+(aborted?'\n\n*(stopped)*':''),ts:ats,type:'text'});
                    if(!aborted) playDoneSound();
                } else removeTyping();
                finish();
            }
        );
    }
}

function appendErrorMessage(msg) {
    var div = document.createElement('div'); div.className='message ai';
    div.innerHTML = '<div class="msg-avatar ai-av">'+AI_AVATAR_HTML+'</div>'
        +'<div class="msg-body"><div class="msg-bubble"><div class="msg-error-wrap">'
        +'<span class="msg-error-text">⚠️ '+esc(msg)+'</span>'
        +'<button class="retry-btn" id="retry-send-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Try Again</button>'
        +'</div></div></div>';
    var rb = div.querySelector('#retry-send-btn');
    if (rb) rb.addEventListener('click', function() {
        div.parentNode.removeChild(div);
        // Re-send last user message
        var msgs = messagesEl.querySelectorAll('.message.user');
        if (msgs.length) {
            var lastTxt = msgs[msgs.length-1].querySelector('.msg-content');
            if (lastTxt) { userInput.value = lastTxt.innerText||lastTxt.textContent; updateSendBtn(); sendMessage(); }
        }
    });
    messagesEl.appendChild(div); scrollBottom();
}

function finish() {
    isGenerating=false;
    sendBtn.style.display='flex'; stopBtn.style.display='none';
    updateSendBtn(); userInput.focus();
}

/* ════════════════════════════════════════════════
   REGENERATE
════════════════════════════════════════════════ */
async function regenerateLastResponse() {
    if (isGenerating||!currentChatId) return;
    var chat = chats.find(function(c){return c.id===currentChatId;}); if(!chat||!chat.messages||chat.messages.length<2) return;
    var lastAi=null;
    for(var i=chat.messages.length-1;i>=0;i--){if(chat.messages[i].role==='assistant'){lastAi=i;break;}}
    if(lastAi===null) return;
    chat.messages.splice(lastAi,1);
    var ais = messagesEl.querySelectorAll('.message.ai'); if(ais.length) messagesEl.removeChild(ais[ais.length-1]);
    var lastUser='';
    for(var j=chat.messages.length-1;j>=0;j--){if(chat.messages[j].role==='user'){lastUser=chat.messages[j].content;break;}}
    isGenerating=true; updateSendBtn();
    sendBtn.style.display='none'; stopBtn.style.display='flex'; showTyping(false);
    var apiMsgs=buildMessages(chat.messages.slice(0,-1),lastUser);
    var accumulated='',firstChunk=true;
    window.generateResponse(apiMsgs,
        function(chunk){accumulated+=chunk;if(firstChunk){removeTyping();createStreamEl();firstChunk=false;}updateStream(chunk);},
        function(err){removeTyping();appendErrorMessage(err);finish();},
        async function(aborted){var ats=Date.now();if(accumulated){finalizeStream(ats);await persistMessage(currentChatId,{role:'assistant',content:accumulated+(aborted?'\n\n*(stopped)*':''),ts:ats,type:'text'});}else removeTyping();finish();}
    );
}

/* ════════════════════════════════════════════════
   VOICE INPUT
════════════════════════════════════════════════ */
var micBtn = el('mic-btn');
function initVoice() {
    var SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if (!SR) { micBtn.style.opacity='0.4'; micBtn.title='Voice not supported'; return; }
    recognizer=new SR(); recognizer.continuous=false; recognizer.interimResults=true;
    recognizer.lang=(settings.lang==='hi'||settings.lang==='hinglish')?'hi-IN':'en-US';
    recognizer.onstart=function(){isListening=true;micBtn.classList.add('recording');toast('Listening…','',60000);};
    recognizer.onend=function(){isListening=false;micBtn.classList.remove('recording');toastEl.className='toast';};
    recognizer.onresult=function(e){var t=Array.from(e.results).map(function(r){return r[0].transcript;}).join('');userInput.value=t;userInput.style.height='auto';userInput.style.height=Math.min(userInput.scrollHeight,200)+'px';updateSendBtn();};
    recognizer.onerror=function(e){isListening=false;micBtn.classList.remove('recording');toastEl.className='toast';if(e.error==='not-allowed')toast('Mic permission denied','error');};
}
initVoice();
micBtn.addEventListener('click', function(){
    if(!recognizer){toast('Voice not supported','error');return;}
    if(isListening) recognizer.stop(); else try{recognizer.start();}catch(e){toast('Voice error: '+e.message,'error');}
});

/* ════════════════════════════════════════════════
   INPUT EVENTS
════════════════════════════════════════════════ */
userInput.addEventListener('input', function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,200)+'px';updateSendBtn();});
userInput.addEventListener('keydown', function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!sendBtn.disabled)sendMessage();}});
sendBtn.addEventListener('click', function(){if(!sendBtn.disabled)sendMessage();});
stopBtn.addEventListener('click', function(){window.stopGeneration&&window.stopGeneration();toast('Stopped');});
el('attach-btn').addEventListener('click', function(e){e.preventDefault();fileInputEl.click();});
fileInputEl.addEventListener('change', function(){if(this.files&&this.files.length){handleFiles(this.files);this.value='';}});
el('input-card').addEventListener('dragover', function(e){e.preventDefault();this.style.borderColor='var(--accent)';});
el('input-card').addEventListener('dragleave', function(){this.style.borderColor='';});
el('input-card').addEventListener('drop', function(e){e.preventDefault();this.style.borderColor='';if(e.dataTransfer.files.length)handleFiles(e.dataTransfer.files);});
userInput.addEventListener('paste', function(e){var f=e.clipboardData&&e.clipboardData.files;if(f&&f.length){e.preventDefault();handleFiles(f);}});

/* Mobile sidebar */
el('menu-btn').addEventListener('click', function(){
    var sb=el('sidebar');
    sb.classList.toggle('mobile-open');
});

/* ════════════════════════════════════════════════
   SETTINGS PANEL
════════════════════════════════════════════════ */
el('settings-close').addEventListener('click', function(){el('settings-modal').style.display='none';});
el('settings-modal').addEventListener('click', function(e){if(e.target===this)this.style.display='none';});
el('model-select').addEventListener('change', function(){
    settings.model=this.value; if(window.CONFIG)CONFIG.MODEL=settings.model;
    var mb=el('model-badge');if(mb)mb.textContent=modelLabel(settings.model);
    var lbl=el('active-model-label');if(lbl)lbl.textContent=modelLabel(settings.model);
    saveSettings(); toast('Model: '+modelLabel(settings.model),'success');
});
el('lang-select').addEventListener('change', function(){settings.lang=this.value;saveSettings();toast('Language updated');if(recognizer)recognizer.lang=(settings.lang==='hi'||settings.lang==='hinglish')?'hi-IN':'en-US';});
document.querySelectorAll('.theme-option-btn').forEach(function(b){b.addEventListener('click',function(){applyTheme(b.dataset.theme);saveSettings();document.querySelectorAll('.theme-option-btn').forEach(function(x){x.classList.toggle('active',x.dataset.theme===b.dataset.theme);});});});
document.querySelectorAll('.font-size-btn').forEach(function(b){b.addEventListener('click',function(){settings.fontSize=b.dataset.size;applyFontSize(b.dataset.size);document.querySelectorAll('.font-size-btn').forEach(function(x){x.classList.toggle('active',x.dataset.size===b.dataset.size);});saveSettings();toast('Font: '+b.dataset.size);});});
var tempSlider=el('temp-slider');if(tempSlider)tempSlider.addEventListener('input',function(){settings.temperature=parseInt(this.value)/100;el('temp-label').textContent=settings.temperature.toFixed(1);saveSettings();});
el('sound-toggle').addEventListener('click',function(){settings.soundNotify=!settings.soundNotify;wireToggle('sound-toggle',settings.soundNotify);saveSettings();toast(settings.soundNotify?'Sound on':'Sound off');});
el('followup-toggle').addEventListener('click',function(){settings.showFollowUp=!settings.showFollowUp;wireToggle('followup-toggle',settings.showFollowUp);saveSettings();});
el('readtime-toggle').addEventListener('click',function(){settings.showReadTime=!settings.showReadTime;wireToggle('readtime-toggle',settings.showReadTime);saveSettings();});
el('export-txt-btn').addEventListener('click',function(){exportChat('txt');});
el('export-pdf-btn').addEventListener('click',function(){exportChat('html');});
el('export-json-btn').addEventListener('click',function(){exportChat('json');});
el('clear-all-chats-btn').addEventListener('click',function(){if(!confirm('Delete ALL chats?'))return;chats=[];currentChatId=null;lsSave();renderChatList();showWelcome();toast('All chats cleared');});

/* ════════════════════════════════════════════════
   MEMORY (in settings modal)
════════════════════════════════════════════════ */
el('memory-save-btn').addEventListener('click', function(){
    settings.memoryText=el('memory-input').value.trim(); settings.memory=!!settings.memoryText;
    saveSettings(); toast('Memory saved','success');
});
el('memory-clear-btn').addEventListener('click', function(){settings.memoryText='';el('memory-input').value='';saveSettings();toast('Memory cleared');});

/* ════════════════════════════════════════════════
   SAVED TOPICS
════════════════════════════════════════════════ */
el('weak-topics-close').addEventListener('click',function(){el('weak-topics-modal').style.display='none';});
el('weak-topics-modal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
el('weak-topic-add-btn').addEventListener('click',function(){
    var inp=el('weak-topic-input'),topic=inp.value.trim();
    if(!topic){toast('Enter a topic name','error');return;}
    weakTopics.push({topic:topic,subject:el('weak-topic-subject').value,added:Date.now()});
    saveWeakTopics();inp.value='';renderTopicsList();toast('Topic saved: '+topic);
});
el('weak-topic-input').addEventListener('keydown',function(e){if(e.key==='Enter')el('weak-topic-add-btn').click();});
function renderTopicsList(){
    var list=el('weak-topics-list');list.innerHTML='';
    if(!weakTopics.length){list.innerHTML='<div style="text-align:center;padding:20px;font-size:13px;color:var(--text3)">No saved topics yet.</div>';return;}
    weakTopics.forEach(function(item,idx){
        var chip=document.createElement('div');chip.className='topic-item';
        chip.innerHTML='<span style="font-size:11px;color:var(--text3);min-width:60px">'+esc(item.subject)+'</span><span style="flex:1;font-size:13px">'+esc(item.topic)+'</span>'
            +'<button class="setting-action-btn" style="padding:3px 8px;font-size:11px" data-idx="'+idx+'">Practice</button>'
            +'<button class="topic-del" data-idx="'+idx+'">✕</button>';
        chip.querySelector('[data-idx="'+idx+'"].setting-action-btn').addEventListener('click',function(){
            el('weak-topics-modal').style.display='none';
            userInput.value='Quiz me on '+item.topic+' ('+item.subject+') with 5 MCQs';
            applyMode('student');saveSettings();updateSendBtn();userInput.focus();toast('Quiz set: '+item.topic);
        });
        chip.querySelector('.topic-del[data-idx="'+idx+'"]').addEventListener('click',function(){weakTopics.splice(idx,1);saveWeakTopics();renderTopicsList();toast('Removed');});
        list.appendChild(chip);
    });
}

/* ════════════════════════════════════════════════
   PROMPT LIBRARY
════════════════════════════════════════════════ */
var BUILTIN_PROMPTS = [
    {name:'Explain Like I\'m 5',cat:'General',text:'Explain [topic] like I\'m 5 years old, with a simple analogy.'},
    {name:'Socratic Tutor',cat:'Student',text:'Help me understand [topic] through questions, don\'t just give answers.'},
    {name:'MCQ Generator',cat:'Student',text:'Create 10 MCQ questions on [topic] with options and answers marked (★).'},
    {name:'Revision Notes',cat:'Student',text:'Make concise revision notes on [chapter/topic] with key points and formulas.'},
    {name:'Code Reviewer',cat:'Developer',text:'Review this code for bugs, security issues, and best practices:\n\n[paste code]'},
    {name:'Debug Helper',cat:'Developer',text:'I\'m getting this error: [error]. My code:\n\n[code]\n\nHelp me fix it.'},
    {name:'Reel Script',cat:'Creator',text:'Write a 30-second Instagram Reel script about [topic]. Hook first, then value, then CTA.'},
    {name:'Caption Pack',cat:'Creator',text:'Write 5 engaging Instagram captions for [topic/product].'},
    {name:'Blog Post',cat:'Writer',text:'Write a 600-word blog post on [topic] with a compelling intro, 3 main points, and conclusion.'},
    {name:'Email Draft',cat:'Writer',text:'Write a professional email for [purpose]. Recipient: [who]. Key points: [points].'},
    {name:'Research Summary',cat:'Research',text:'Provide a comprehensive summary of [topic] with key findings and multiple perspectives.'},
    {name:'SWOT Analysis',cat:'Research',text:'Do a SWOT analysis for [subject] in a clear, detailed table format.'},
    {name:'Hinglish Explain',cat:'General',text:'[Topic] ko Hinglish mein simple language mein explain karo, examples ke saath.'},
];

el('prompt-lib-close').addEventListener('click',function(){el('prompt-lib-modal').style.display='none';});
el('prompt-lib-modal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
el('custom-prompt-save').addEventListener('click',function(){
    var name=el('custom-prompt-name').value.trim(),cat=el('custom-prompt-cat').value.trim()||'Custom',text=el('custom-prompt-text').value.trim();
    if(!name||!text){toast('Enter name and prompt text','error');return;}
    customPrompts.push({name:name,cat:cat,text:text,custom:true});saveCustomPrompts();
    el('custom-prompt-name').value='';el('custom-prompt-cat').value='';el('custom-prompt-text').value='';
    renderPromptLibrary();toast('Prompt saved!','success');
});
el('prompt-lib-search').addEventListener('input',function(){promptLibActiveCat='All';renderPromptLibrary(this.value.trim().toLowerCase());});
function renderPromptLibrary(filterQ) {
    var all=BUILTIN_PROMPTS.concat(customPrompts);
    var q=filterQ!==undefined?filterQ:el('prompt-lib-search').value.trim().toLowerCase();
    var filtered=q?all.filter(function(p){return p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)||p.text.toLowerCase().includes(q);})
        :(promptLibActiveCat==='All'?all:all.filter(function(p){return p.cat===promptLibActiveCat;}));
    var cats=['All'].concat(Array.from(new Set(all.map(function(p){return p.cat;}))));
    var catWrap=el('prompt-lib-cats');catWrap.innerHTML='';
    cats.forEach(function(c){
        var b=document.createElement('button');b.className='prompt-cat-btn'+(promptLibActiveCat===c?' active':'');b.textContent=c;
        b.addEventListener('click',function(){promptLibActiveCat=c;el('prompt-lib-search').value='';renderPromptLibrary('');});
        catWrap.appendChild(b);
    });
    var grid=el('prompt-lib-grid');grid.innerHTML='';
    if(!filtered.length){grid.innerHTML='<div style="padding:16px;color:var(--text3);font-size:13px">No prompts found.</div>';return;}
    filtered.forEach(function(p){
        var card=document.createElement('div');card.className='prompt-card';
        card.innerHTML='<div class="prompt-card-name">'+esc(p.name)+(p.custom?'<span style="margin-left:5px;font-size:10px;background:var(--accent-soft);color:var(--accent);padding:1px 5px;border-radius:4px">custom</span>':'')+'</div>'
            +'<div class="prompt-card-text">'+esc(p.text.slice(0,80))+'…</div>'
            +'<div style="display:flex;gap:6px;margin-top:8px"><button class="setting-action-btn primary" style="font-size:11px;padding:3px 8px">Use</button>'+(p.custom?'<button class="setting-action-btn" style="font-size:11px;padding:3px 8px">Delete</button>':'')+'</div>';
        card.querySelectorAll('.setting-action-btn')[0].addEventListener('click',function(){
            userInput.value=p.text;userInput.dispatchEvent(new Event('input'));userInput.focus();
            el('prompt-lib-modal').style.display='none';toast('Prompt loaded','success');
        });
        var del=card.querySelectorAll('.setting-action-btn')[1];
        if(del&&p.custom)del.addEventListener('click',function(){customPrompts=customPrompts.filter(function(x){return x!==p;});saveCustomPrompts();renderPromptLibrary();toast('Deleted');});
        grid.appendChild(card);
    });
}

/* ════════════════════════════════════════════════
   UPGRADE MODAL
════════════════════════════════════════════════ */
el('upgrade-modal-close').addEventListener('click',function(){el('upgrade-modal').style.display='none';});
el('upgrade-modal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
el('plan-pro-btn').addEventListener('click',function(){toast('Redirecting to payment…','',3000);});
var planPrem=el('plan-premium-btn');if(planPrem)planPrem.addEventListener('click',function(){toast('Redirecting to payment…','',3000);});
var settingsUpgBtn=el('settings-upgrade-btn');if(settingsUpgBtn)settingsUpgBtn.addEventListener('click',function(){el('upgrade-modal').style.display='flex';el('settings-modal').style.display='none';});

/* ════════════════════════════════════════════════
   IMAGE VIEWER
════════════════════════════════════════════════ */
el('img-viewer-close').addEventListener('click',function(){el('img-viewer-modal').style.display='none';});
el('img-viewer-modal').addEventListener('click',function(e){if(e.target===this)this.style.display='none';});
el('img-viewer-dl-png').addEventListener('click',function(){var a=document.createElement('a');a.href=el('img-viewer-src').src;a.download='keryo-'+Date.now()+'.png';a.click();});
el('img-viewer-dl-jpg').addEventListener('click',function(){
    var c=document.createElement('canvas'),img=new Image();
    img.onload=function(){c.width=img.width;c.height=img.height;var ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0);var a=document.createElement('a');a.href=c.toDataURL('image/jpeg',0.92);a.download='keryo-'+Date.now()+'.jpg';a.click();};
    img.src=el('img-viewer-src').src;
});

/* ════════════════════════════════════════════════
   EXPORT
════════════════════════════════════════════════ */
function exportChat(format) {
    if(!currentChatId){toast('No chat selected','error');return;}
    var chat=chats.find(function(c){return c.id===currentChatId;});
    if(!chat||!chat.messages||!chat.messages.length){toast('Chat is empty','error');return;}
    var title=chat.title||'Keryo AI Chat';
    if(format==='txt'){
        var lines=['Keryo AI — '+title,'='.repeat(50),''];
        chat.messages.forEach(function(m){var role=m.role==='user'?'You':'Keryo AI';lines.push('['+role+'] '+new Date(m.ts||0).toLocaleString());lines.push(m.type==='image'?'[Image]':m.content);lines.push('');});
        dlBlob(lines.join('\n'),title+'.txt','text/plain');
    } else if(format==='json'){
        dlBlob(JSON.stringify({title:title,exported:new Date().toISOString(),messages:chat.messages},null,2),title+'.json','application/json');
    } else {
        var rows=chat.messages.map(function(m){var r=m.role==='user'?'You':'Keryo AI',t=new Date(m.ts||0).toLocaleString(),c=m.type==='image'?'<em>[Image]</em>':esc(m.content).replace(/\n/g,'<br>');return '<div class="r '+m.role+'"><div class="meta">'+r+' · '+t+'</div><div class="bbl">'+c+'</div></div>';}).join('');
        dlBlob('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+esc(title)+'</title><style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:0 20px}h1{font-size:22px;margin-bottom:24px}.bbl{padding:12px 16px;border-radius:12px;margin:6px 0;white-space:pre-wrap;line-height:1.6}.r.user .bbl{background:#5F43E9;color:white;margin-left:60px}.r.assistant .bbl{background:#f4f4f5;border:1px solid #e5e5e6;margin-right:60px}.meta{font-size:11px;color:#999;margin-bottom:3px}</style></head><body><h1>'+esc(title)+'</h1>'+rows+'</body></html>',title+'.html','text/html');
        toast('HTML exported — open and print → Save as PDF','',3000);
    }
}
function dlBlob(content,name,mime){var b=new Blob([content],{type:mime}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);}

/* ════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
════════════════════════════════════════════════ */
document.addEventListener('keydown', function(e) {
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();createNewChat();}
    if((e.ctrlKey||e.metaKey)&&e.key==='/'){e.preventDefault();userInput.focus();}
    if((e.ctrlKey||e.metaKey)&&e.key===','){e.preventDefault();applySettings();el('settings-modal').style.display='flex';}
    if(e.key==='Escape'){
        document.querySelectorAll('.modal-backdrop').forEach(function(m){m.style.display='none';});
        var pm=el('profile-menu');if(pm)pm.style.display='none';
        var mm=el('mode-dropdown-menu');if(mm)mm.classList.remove('open');
        var mt=el('mode-toggle-btn');if(mt){mt.classList.remove('open');mt.setAttribute('aria-expanded','false');}
        el('sidebar').classList.remove('mobile-open');
    }
});

/* ════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════ */
async function init() {
    applySettings();
    updateSendBtn();
    var seen = localStorage.getItem(KERYO_SEEN_KEY);
    if (seen) {
        // Returning user — skip landing page
        el('landing-page').style.display = 'none';
        el('app').style.display = 'flex';
        enterAsGuest();
    } else {
        showLandingPage();
    }
}

init();

}); // end DOMContentLoaded
