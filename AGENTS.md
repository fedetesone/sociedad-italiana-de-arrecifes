# Guía para agentes

## Alcance y estilo

- Mejorar el proyecto existente; preservar diseño, rutas, accesibilidad y contenido confirmado. No recrearlo ni agregar infraestructura sin necesidad.
- Todo texto visible debe estar en español argentino. No inventar historia, eventos, precios, autoridades ni datos institucionales. Fuentes en `docs/`.
- Monorepo npm (`web/`, `studio/`), Node 24 LTS. Usar el lockfile y versiones compatibles; consultar documentación oficial antes de cambiar Astro/Cloudflare.

## Arquitectura

- Páginas públicas Astro: `export const prerender = true`, incluso con `output: "server"`. API: `prerender = false`.
- Workers con `@astrojs/cloudflare`, entrypoint oficial y binding de assets; `/api/*` ejecuta el Worker. No volver al deploy de Pages ni introducir un servidor Node separado.
- Componentes presentan; `lib/events` contiene reglas de agenda; `lib/sanity` contiene cliente/consultas; `lib/email` aísla el proveedor; `lib/server` maneja HTTP/configuración. Tipos compartidos en `types/`.
- Mantener sesiones deshabilitadas. No agregar KV, base de datos ni autenticación propia para este alcance.
- Sanity es la fuente de eventos publicados. Fechas con offset explícito, formato `es-AR` y zona `America/Argentina/Buenos_Aires`. Excluir fechas inválidas; cancelados fuera de la agenda, conservando página y aviso sin enlace de entradas.
- Un error del CMS debe fallar el build. Conservar recompilación por webhook y diaria; sin recompilar no cambian agenda ni contenidos.

## Contacto y seguridad

- `/contacto` usa `POST /api/contact` + Zod + Turnstile verificado en servidor + honeypot + binding de rate limit. Los demás trámites aún usan FormSubmit: no migrarlos por accidente.
- Remitente y destinatario salen del servidor; visitante solo aporta Reply-To. Rechazar campos desconocidos, limitar cuerpo/campos, escapar HTML y evitar saltos de línea en encabezados.
- Producción falla cerrada si falta configuración/protección; no aceptar claves Turnstile dummy ni mock. Mock únicamente en `astro dev` sobre loopback y con aviso explícito de **no enviado**.
- No registrar mensajes, IP, tokens ni errores crudos del proveedor en producción. No enviar correos reales durante tests. Aceptación de Resend no equivale a entrega en bandeja.
- `PUBLIC_*` es compilación/contenido público. Secretos runtime mediante `env` de `cloudflare:workers`; localmente `.dev.vars`. Nunca comitear `.env`, `.dev.vars`, claves ni deploy hooks. Los archivos `.example` solo llevan valores públicos/de prueba.

## Verificación y entrega

- Para cambios de código: `npm run check`, `npm test`, `npm run build`, `npm run verify:build`. Si cambia Studio, también `npm run build:studio` con configuración válida.
- Probar estados del formulario en navegador y respuesta runtime de la API si se modifica ese flujo. `npm run dev` usa mock local; `npm run preview` mantiene restricciones de producción.
- `web/dist/client` contiene páginas/assets; `web/dist/server` contiene el Worker. Desplegar con `npm run deploy` después del build, no subir solo archivos estáticos. No confundir push a GitHub con deploy confirmado.
- Tests enfocados en comportamiento y fallos relevantes; no agregar pruebas que solo repitan cambios triviales de presentación o documentación.
- Actualizar `README.md` técnico y `docs/README.md` para editores cuando cambien los flujos. No afirmar que cuentas, secretos, dominio, hooks o entrega real están configurados sin verificarlo.
- Antes de commit/push, revisar diff, cambios ajenos y secretos. Publicar solo dentro de la autorización del usuario.
