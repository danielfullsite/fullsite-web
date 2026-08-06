# Deploy Notes — fullsite.mx

## Hosting
- Producción: Cloudflare Pages, proyecto `fullsite-landing` (dominio `fullsite.mx`).
- Deploy: `wrangler pages deploy <dir> --project-name fullsite-landing` (rama `main` = producción; cualquier otra `--branch` = preview con `X-Robots-Tag: noindex` automático).

## Redirect www → apex (PENDIENTE — no configurado, no depende de `_redirects`)
El archivo `_redirects` de Pages **no** debe usarse para redirects entre hosts. Configurar con **Cloudflare Bulk Redirects** (nivel cuenta, gratis):

1. Cloudflare Dashboard → cuenta → **Bulk Redirects** → *Create Bulk Redirect List*.
   - Nombre: `www-to-apex-fullsite`
   - Source URL: `www.fullsite.mx`  (con "Include subdomains" apagado y "Subpath matching" **encendido**)
   - Target URL: `https://fullsite.mx`
   - Status: `301` — activar **Preserve path suffix** y **Preserve query string**.
2. *Create Bulk Redirect Rule* que use esa lista y **Deploy**.
3. Prerrequisito DNS (hacer junto con el paso anterior, requiere autorización):
   - Registro `www` en la zona `fullsite.mx` apuntando a un destino proxied (p. ej. `CNAME www → fullsite.mx`, nube naranja activada). Sin registro proxied, el redirect no se ejecuta.
4. Verificar: `https://www.fullsite.mx/precios.html` → `301` → `https://fullsite.mx/precios.html`.

**No tocar DNS sin autorización de Daniel.**

## Pendientes post-merge
- Probar Lighthouse en producción (no asumir el score del preview: el SEO del preview marca 69 por el noindex intencional).
- `precios.html`, `integraciones.html` y `en/index.html` están `noindex` temporal hasta tener precio canónico / integraciones certificadas / versión EN alineada.
