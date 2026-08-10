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

- Este Worker ya viene revocado/desactivado hasta que le asignes el secreto
  `DISCORD_WEBHOOK_URL` — sin él, cualquier request devuelve error 500 al
  intentar hacer fetch a `undefined`.
- El webhook de Discord original que estaba hardcodeado en `script.js` está
  comprometido (quedó en el historial de git público) y debe regenerarse en
  Discord antes de usarlo aquí.
- Para reforzar contra spam, activa una regla de Rate Limiting en el
  dashboard de Cloudflare apuntando a esta ruta (Security → WAF → Rate
  limiting rules).
