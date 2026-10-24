// Proxy CORS personale per GoalValue Analytics Live (Cloudflare Workers, piano gratuito).
// Inoltra solo verso api.football-data.org e passa l'header X-Auth-Token.
// Uso nell'app: Proxy personalizzato = https://<nome>.<account>.workers.dev/?url={url}
const ALLOWED_HOST = 'api.football-data.org';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Auth-Token, Content-Type',
  'Access-Control-Expose-Headers': 'X-Requests-Available-Minute, X-RequestCounter-Reset',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'GET') return new Response('Metodo non consentito', { status: 405, headers: CORS });

    const target = new URL(request.url).searchParams.get('url');
    let url;
    try { url = new URL(target); } catch { return new Response('Parametro url mancante o non valido', { status: 400, headers: CORS }); }
    if (url.protocol !== 'https:' || url.hostname !== ALLOWED_HOST) return new Response('Destinazione non consentita', { status: 403, headers: CORS });

    // La chiave arriva dall'app; in alternativa si può salvare come secret FD_TOKEN nel Worker
    const token = request.headers.get('X-Auth-Token') || env.FD_TOKEN || '';
    const res = await fetch(url.toString(), { headers: { 'X-Auth-Token': token } });

    const headers = new Headers(CORS);
    headers.set('Content-Type', res.headers.get('Content-Type') || 'application/json');
    for (const h of ['X-Requests-Available-Minute', 'X-RequestCounter-Reset']) {
      const v = res.headers.get(h);
      if (v !== null) headers.set(h, v);
    }
    return new Response(res.body, { status: res.status, headers });
  }
};
