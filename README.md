# GoalValue Analytics Live

Web app a file singolo (`index.html`) per value betting calcistico e analisi in-play.

- Dati partite: API v4 di [football-data.org](https://www.football-data.org/) (header `X-Auth-Token`)
- La chiave API si inserisce dall'app e resta solo nel `localStorage` del browser
- CORS: chiamata diretta → corsproxy.io → proxy personalizzato → fallback DEMO
- Calcolatore EV / Kelly frazionario, AI Scout (modello di Poisson), tracker scommesse

Pubblicata con GitHub Pages dal branch `main`.

## Proxy CORS (necessario su GitHub Pages)

football-data.org non accetta chiamate dal browser su domini pubblici. Pubblica `cloudflare-worker.js` come Cloudflare Worker (gratuito), poi nell'app imposta come proxy personalizzato:

```
https://<nome-worker>.<account>.workers.dev/?url={url}
```
