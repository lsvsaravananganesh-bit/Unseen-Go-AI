# UnseenGo AI + Ollama setup

The chatbot now sends its messages to `/api/chat`, and the backend forwards them to Ollama.

## 1. Install and run Ollama

Install Ollama on the machine/server that will host the model, then pull a model:

```bash
ollama pull qwen2.5:3b
ollama serve
```

You can change the model with the `OLLAMA_MODEL` environment variable.

## 2. Backend environment variables

For a Vercel deployment, set:

```text
OLLAMA_URL=https://YOUR-OLLAMA-HOST
OLLAMA_MODEL=qwen2.5:3b
```

Do not expose Ollama credentials or private infrastructure details in frontend JavaScript.

## 3. Important GitHub Pages note

The current UnseenGo website is deployed as a static GitHub Pages site. GitHub Pages cannot execute `api/chat.js` or run Ollama. The `api/chat.js` function therefore needs to be deployed to a serverless/backend host such as Vercel, with `OLLAMA_URL` pointing to an Ollama instance that is reachable from that backend.

If the frontend is kept on GitHub Pages, set `window.UNSEENGO_CHAT_API` before `chatbot.js` loads to the full URL of the deployed backend endpoint, for example:

```html
<script>
  window.UNSEENGO_CHAT_API = 'https://YOUR-BACKEND-DOMAIN.vercel.app/api/chat';
</script>
<script src="chatbot.js?v=20260825"></script>
```

Do not use `http://localhost:11434` from the public website. A visitor's browser would try to connect to Ollama on the visitor's own device.
