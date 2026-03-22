// ai.js — Keryo AI Engine v3.0
// Fixed: model fallback, 401 detection, graceful error states
'use strict';

let _abortCtrl = null;

/* ── Per-model safe output token limits ──────────────────────────────── */
const KERYO_OUTPUT_TOKENS = {
    'mistralai/mistral-7b-instruct:free':           1024,
    'meta-llama/llama-3.2-3b-instruct:free':        1024,
    'qwen/qwen-2-7b-instruct:free':                 1024,
    'google/gemma-2-9b-it:free':                    1024,
    'microsoft/phi-3-mini-128k-instruct:free':      1024,
    'deepseek/deepseek-r1-distill-qwen-14b:free':   2048,
    'meta-llama/llama-3.1-70b-instruct':            2048,
    'openai/gpt-4o-mini':                           2048,
    'openai/gpt-4o':                                4096,
    'anthropic/claude-3.5-haiku':                   2048,
    'anthropic/claude-3.5-sonnet':                  4096,
    'google/gemini-flash-1.5':                      2048,
    'google/gemini-pro-1.5':                        4096,
};

function getMaxOutputTokens(model) {
    return KERYO_OUTPUT_TOKENS[model] || 1024;
}

/* ── Image request detector ──────────────────────────────────────────── */
function isImageRequest(text) {
    if (!text) return false;
    return /\b(generate|create|make|draw|design|render|paint|produce|imagine|visualize)\b.{0,30}\b(image|photo|picture|illustration|artwork|painting|drawing|portrait|landscape|wallpaper|logo|icon|poster|banner)\b/i.test(text)
        || /^(draw|paint|sketch|render|imagine|visualize)\s+/i.test(text.trim())
        || /\b(show\s+me|give\s+me)\s+a[n]?\s+(image|picture|photo|illustration)\b/i.test(text);
}

/* ── Single-model request helper ─────────────────────────────────────── */
async function _tryModel(model, messages, maxTokens, signal) {
    const key = (typeof CONFIG !== 'undefined') && CONFIG.OPENROUTER_KEY;
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: signal,
        headers: {
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href,
            'X-Title': 'Keryo AI'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            stream: true,
            temperature: 0.7,
            max_tokens: maxTokens
        })
    });
    return resp;
}

/* ── Streaming text response — model fallback chain ──────────────────── */
async function generateResponse(messages, onChunk, onError, onComplete, _retryState) {
    const key = (typeof CONFIG !== 'undefined') && CONFIG.OPENROUTER_KEY;
    if (!key || key.length < 20) { onError('API key missing — check config.js'); return; }

    if (!_retryState) _abortCtrl = new AbortController();

    const primaryModel = (typeof CONFIG !== 'undefined' && CONFIG.MODEL) || 'mistralai/mistral-7b-instruct:free';
    const fallbacks = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.FALLBACK_MODELS))
        ? CONFIG.FALLBACK_MODELS : [];
    const modelQueue = _retryState ? _retryState.modelQueue : [primaryModel, ...fallbacks];
    const modelIdx   = _retryState ? _retryState.modelIdx   : 0;

    if (modelIdx >= modelQueue.length) {
        onError('__ALL_FAILED__');
        return;
    }

    const model     = modelQueue[modelIdx];
    const maxTokens = _retryState && _retryState.reducedTokens
        ? _retryState.reducedTokens
        : getMaxOutputTokens(model);

    if (typeof window.updateModelBadge === 'function') window.updateModelBadge(model);

    try {
        const resp = await _tryModel(model, messages, maxTokens, _abortCtrl.signal);

        if (!resp.ok) {
            let errMsg = 'HTTP ' + resp.status;
            try {
                const errBody = await resp.text();
                const parsed = JSON.parse(errBody);
                errMsg = parsed.error?.message || errMsg;
            } catch (_) {}

            // 401 = bad API key — no point trying fallbacks
            if (resp.status === 401) {
                onError('Invalid API key. Please update config.js with a valid OpenRouter key.');
                return;
            }

            const isNoEndpoint = errMsg.toLowerCase().includes('no endpoints')
                || errMsg.toLowerCase().includes('unavailable')
                || errMsg.toLowerCase().includes('not found')
                || resp.status === 503 || resp.status === 404;
            const isTokenError  = resp.status === 402 || errMsg.toLowerCase().includes('afford') || errMsg.toLowerCase().includes('credits');
            const isRateLimit   = resp.status === 429;

            if (isNoEndpoint || isRateLimit) {
                console.warn('[Keryo] Model', model, 'failed (', errMsg, ') → trying fallback');
                await generateResponse(messages, onChunk, onError, onComplete, { modelQueue, modelIdx: modelIdx + 1 });
                return;
            }
            if (isTokenError && !_retryState?.reducedTokens) {
                const reduced = Math.max(256, Math.floor(maxTokens / 2));
                console.warn('[Keryo] Token limit reduced to', reduced);
                await generateResponse(messages, onChunk, onError, onComplete, { modelQueue, modelIdx, reducedTokens: reduced });
                return;
            }
            // Any other error — try next model
            console.warn('[Keryo] Model', model, 'error:', errMsg, '— trying fallback');
            await generateResponse(messages, onChunk, onError, onComplete, { modelQueue, modelIdx: modelIdx + 1 });
            return;
        }

        const reader  = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        let gotContent = false;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() || '';
            for (const line of lines) {
                const t = line.trim();
                if (!t.startsWith('data: ')) continue;
                const data = t.slice(6).trim();
                if (data === '[DONE]') { onComplete && onComplete(false); return; }
                try {
                    const delta = JSON.parse(data).choices?.[0]?.delta?.content;
                    if (delta) { onChunk(delta); gotContent = true; }
                } catch (_) {}
            }
        }
        if (!gotContent) {
            // Empty response — try next model
            console.warn('[Keryo] Model', model, 'returned empty response — trying fallback');
            await generateResponse(messages, onChunk, onError, onComplete, { modelQueue, modelIdx: modelIdx + 1 });
            return;
        }
        onComplete && onComplete(false);

    } catch (err) {
        if (err.name === 'AbortError') {
            onComplete && onComplete(true);
        } else {
            if (modelIdx + 1 < modelQueue.length) {
                console.warn('[Keryo] Network error on', model, '— trying fallback');
                await generateResponse(messages, onChunk, onError, onComplete, { modelQueue, modelIdx: modelIdx + 1 });
            } else {
                onError('__ALL_FAILED__');
            }
        }
    }
}

/* ── Stop active generation ──────────────────────────────────────────── */
function stopGeneration() {
    if (_abortCtrl) _abortCtrl.abort();
}

/* ── Web search via Apify ────────────────────────────────────────────── */
async function webSearch(query, onSuccess, onError) {
    const key = (typeof CONFIG !== 'undefined') && CONFIG.APIFY_KEY;
    if (!key) { onError('Search API key missing'); return; }
    if (!query || !query.trim()) { onSuccess(''); return; }
    try {
        const resp = await fetch(
            'https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=' + key + '&timeout=28',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ queries: query.trim(), maxPagesPerQuery: 1, resultsPerPage: 6, mobileResults: false, includeUnfilteredResults: false, saveHtml: false, saveHtmlToKeyValueStore: false })
            }
        );
        if (!resp.ok) { let e=''; try{e=await resp.text();}catch(_){} onError('Search API error '+resp.status+(e?': '+e.slice(0,160):'')); return; }
        const data = await resp.json();
        let organicResults = [];
        if (Array.isArray(data)) data.forEach(function(item) { if (item.organicResults && Array.isArray(item.organicResults)) organicResults = organicResults.concat(item.organicResults); });
        if (!organicResults.length) { onSuccess(''); return; }
        let context = '### Live Search Results for: "' + query + '"\n\n';
        organicResults.slice(0, 5).forEach(function(r, i) {
            context += (i+1) + '. **' + (r.title||'Untitled') + '**\n';
            if (r.url) context += '   Source: ' + r.url + '\n';
            if (r.description) context += '   ' + r.description.trim() + '\n';
            context += '\n';
        });
        onSuccess(context);
    } catch (err) { onError(err.message || 'Search request failed'); }
}

/* ── Image generation — Pollinations.ai with model fallback ──────────── */
async function generateImage(prompt, onSuccess, onError) {
    const modelList = (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.IMAGE_FALLBACK_MODELS))
        ? [CONFIG.IMAGE_MODEL || 'flux', ...CONFIG.IMAGE_FALLBACK_MODELS]
        : ['flux', 'turbo', 'flux-realism'];

    const enhanced = prompt.trim() + ', high quality, detailed, artistic, cinematic lighting';
    const encoded  = encodeURIComponent(enhanced);
    const seed     = Math.floor(Math.random() * 999999);

    for (let mi = 0; mi < modelList.length; mi++) {
        const model = modelList[mi];
        const url   = `https://image.pollinations.ai/prompt/${encoded}?model=${model}&width=1024&height=768&seed=${seed}&nologo=true&enhance=true`;
        try {
            const ok = await new Promise(function(resolve) {
                const img = new Image();
                img.onload  = function() { resolve(true); };
                img.onerror = function() { resolve(false); };
                img.src = url;
                setTimeout(function() { resolve(false); }, 25000);
            });
            if (ok) { onSuccess(url); return; }
        } catch (_) {}
    }
    onError('Image generation failed after trying all models. Please try again.');
}
