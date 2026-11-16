# Contact form proxy

Cloudflare Worker que recibe el POST del formulario de contacto y lo reenvía al
webhook de Discord. La URL del webhook se guarda como secreto de Cloudflare,
nunca queda en el código del sitio.

## Despliegue

1. Instala Wrangler (si no lo tienes): `npm install -g wrangler`
2. Inicia sesión: `wrangler login`
3. Desde esta carpeta, sube el secreto con la URL actual del webhook de Discord:
   ```
   wrangler secret put DISCORD_WEBHOOK_URL
   ```
4. Despliega el Worker:
   ```
   wrangler deploy
   ```
5. Wrangler imprime la URL pública, algo como
   `https://boriscucho-contact.<tu-subdominio>.workers.dev`.
   Copia esa URL y pégala como `CONTACT_ENDPOINT` en `../script.js`.

## Notas

- Sin el secreto `DISCORD_WEBHOOK_URL` el Worker responde 500
  ("Servicio no disponible") y lo registra en los logs (`wrangler tail`).
- El formulario incluye un campo honeypot (`website`): si llega con valor,
  el Worker responde 200 pero descarta el mensaje.
- El mensaje se envía en la `description` del embed (límite 4096) porque los
  `fields` de Discord solo aceptan 1024 caracteres.
- El webhook de Discord original que estaba hardcodeado en `script.js` está
  comprometido (quedó en el historial de git público) y debe regenerarse en
  Discord antes de usarlo aquí.
- Para reforzar contra spam, activa una regla de Rate Limiting en el
  dashboard de Cloudflare apuntando a esta ruta (Security → WAF → Rate
  limiting rules).
