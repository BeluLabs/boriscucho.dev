// Cloudflare Worker: proxy del formulario de contacto hacia Discord.
// La URL del webhook vive solo como secreto (env.DISCORD_WEBHOOK_URL),
// nunca en el código del sitio.

const ALLOWED_ORIGINS = ['https://boriscucho.dev', 'https://www.boriscucho.dev'];

function corsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ error: 'Forbidden' }, 403, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, origin);
    }

    const name = String(body.name || '').trim().slice(0, 100);
    const email = String(body.email || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 2000);

    if (!name || !email || !message || !isValidEmail(email)) {
      return jsonResponse({ error: 'Datos inválidos' }, 400, origin);
    }

    const discordPayload = {
      embeds: [
        {
          title: '📬 Nuevo mensaje de contacto',
          color: 3447003,
          fields: [
            { name: '👤 Nombre', value: name, inline: true },
            { name: '📧 Email', value: email, inline: true },
            { name: '💬 Mensaje', value: message, inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'Formulario de contacto - boriscucho.dev' },
        },
      ],
    };

    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      return jsonResponse({ error: 'No se pudo enviar el mensaje' }, 502, origin);
    }

    return jsonResponse({ ok: true }, 200, origin);
  },
};
