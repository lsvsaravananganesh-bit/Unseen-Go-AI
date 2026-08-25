# UnseenGo AI + Ollama setup

The chatbot sends messages to `/api/chat`; the Vercel backend forwards them to an Ollama server.

## Production architecture

```text
GitHub Pages
     ↓
Vercel /api/chat
     ↓
Publicly reachable Ollama server
     ↓
Qwen / Llama / Gemma
```

## 1. Run Ollama on a server

Install Ollama on a machine/server that remains online. Pull the model you want:

```bash
ollama pull qwen2.5:3b
ollama serve
```

For production, put the Ollama service behind HTTPS and authentication. Do not expose an unauthenticated Ollama port to the public internet.

## 2. Configure Vercel

Set these environment variables for the Vercel project:

```text
OLLAMA_URL=https://YOUR-OLLAMA-HOST
OLLAMA_MODEL=qwen2.5:3b
ALLOWED_ORIGINS=https://lsvsaravananganesh-bit.github.io
```

If your Ollama host requires authentication, also set:

```text
OLLAMA_API_KEY=YOUR_SECRET
```

The API key stays server-side and is never placed in frontend JavaScript.

## 3. Connect GitHub Pages to the Vercel API

Because the UnseenGo frontend is hosted on GitHub Pages, the browser must call the full Vercel endpoint instead of `/api/chat` on GitHub Pages.

Before `chatbot.js` loads, add:

```html
<script>
  window.UNSEENGO_CHAT_API = 'https://YOUR-VERCEL-DOMAIN.vercel.app/api/chat';
</script>
<script src="chatbot.js?v=20260825"></script>
```

Replace `YOUR-VERCEL-DOMAIN` with the actual deployed Vercel domain.

## Important

Do **not** use `http://localhost:11434` in the public website. A visitor's browser would try to connect to Ollama on the visitor's own computer.

The Ollama server must be reachable by the Vercel backend. GitHub Pages itself never needs direct access to Ollama.
