# Guest Star Sing Requests

Proyecto independiente para `sing.gstarxp.com`.

- Frontend estático apto para GitHub Pages.
- Google Sheets como vista del host.
- Apps Script recibe solicitudes y consulta YouTube Data API v3.
- Sin Worker, D1 ni backend de Cloudflare.

## Activación

1. Crea un Google Sheet vacío y abre **Extensiones → Apps Script**.
2. Copia `Code.gs` y activa la vista de manifiesto para reemplazar `appsscript.json`.
3. Habilita el servicio avanzado **YouTube Data API v3**.
4. Ejecuta `setupProject` una vez; crea las pestañas y todas las prioridades.
5. Ejecuta `testSearch` una vez y autoriza el acceso.
6. Despliega como aplicación web: ejecutar como propietario; acceso para cualquiera.
7. Copia la URL que termina en `/exec` dentro de `config.js`.
8. Publica la rama principal con GitHub Pages y usa `sing.gstarxp.com` como dominio personalizado.

El registro DNS recomendado es `CNAME sing → garykeyz.github.io` con proxy desactivado (DNS only).
