// config.js — Keryo AI Configuration
const CONFIG = {
    OPENROUTER_KEY: "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",
    MODEL: "mistralai/mistral-7b-instruct:free",
    FALLBACK_MODELS: [
        "meta-llama/llama-3.2-3b-instruct:free",
        "qwen/qwen-2-7b-instruct:free",
        "google/gemma-2-9b-it:free",
        "microsoft/phi-3-mini-128k-instruct:free",
        "deepseek/deepseek-r1-distill-qwen-14b:free"
    ],
    VISION_MODEL: "openai/gpt-4o-mini",
    IMAGE_MODEL: "flux",
    IMAGE_FALLBACK_MODELS: ["turbo", "flux-realism", "flux-anime"],
    APIFY_KEY: "apify_api_ksAs6JnfHMn8xdeG1wAXohgbbg1yHS3shcyh",
    SUPABASE_URL: "https://ckoxrkntcwdoccfebpip.supabase.co",
    SUPABASE_KEY: "sb_publishable_ZCuvBW-KXU1Y6R5F4Wo04g_nLZ6Suc1",
    GOOGLE_CLIENT_ID: "959624059530-alpatckhcp9ad62mtgvb1j7g99qn10v2.apps.googleusercontent.com",
    DEFAULT_THEME: "light",
    ENABLE_TTS: true,
    ENABLE_SOUND_NOTIFY: true,
    ENABLE_FOLLOW_UP_CHIPS: true,
    ENABLE_READING_TIME: true,
};
