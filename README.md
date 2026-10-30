# Sociedad Italiana de S.M. "Voz de Caprera"

Sitio institucional en español argentino de la Sociedad Italiana de Socorros Mutuos "Voz de Caprera", Arrecifes. Astro + TypeScript, Tailwind CSS 4, Sanity Studio y alojamiento estático en Cloudflare Pages. Monorepo npm: `web/` contiene el sitio público y `studio/` el administrador independiente.

## Requisitos y desarrollo

Node.js 24 LTS y npm. Las versiones exactas resueltas se conservan en `package-lock.json`.

```sh
npm ci
npm run dev            # http://localhost:4321
npm run check
npm test
npm run build          # web/dist
npm run dev:studio     # http://localhost:3333 (requiere configurar Sanity)
```

El sitio funciona sin Sanity con textos institucionales de base y una agenda vacía. No se publican eventos de ejemplo ni datos de contacto inventados. La fotografía de Italia es ilustrativa; reemplazarla con imágenes propias desde el Studio. La reseña histórica incorpora datos contrastados y enlaces a fuentes públicas; el detalle de la investigación está en [docs/historia-fuentes.md](docs/historia-fuentes.md). La institución puede ampliarla desde Sanity.

## Configurar Sanity (plan gratuito)

1. Creá un proyecto en <https://www.sanity.io/manage>, elegí el plan gratuito y creá el dataset **público** `production`. No cargues información personal o interna: el dataset público es legible por cualquiera.
2. Copiá las plantillas locales:

   ```sh
   cp web/.env.example web/.env
   cp studio/.env.example studio/.env
   ```

3. En `web/.env`, completá `PUBLIC_SANITY_PROJECT_ID` y `PUBLIC_SANITY_DATASET`. En `studio/.env`, completá `SANITY_STUDIO_PROJECT_ID` y `SANITY_STUDIO_DATASET` con los mismos valores. Los IDs de proyecto no son secretos; no hace falta un token de lectura para un dataset público.
4. Ejecutá `npm run dev:studio` e iniciá sesión con Sanity. En la configuración del proyecto, agregá `http://localhost:3333` a CORS con credenciales si es necesario.
5. En **La institución**, completá presentación, historia, propósito, actividades, fotos, dirección, contacto y redes. Publicá el documento. Es un singleton con ID `siteSettings`.
6. En **Eventos**, creá un evento, generá su dirección, completá fecha y hora, lugar, resumen y descripción. Agregá afiche y enlace de inscripción si corresponde. Confirmá la zona horaria del selector y publicá.
7. Volvé a compilar la web. Las consultas leen únicamente documentos publicados y no usan caché CDN. Un error de Sanity hace fallar el build para evitar desplegar contenido vacío por accidente.

### Publicar el Studio

```sh
cd studio
npx sanity login
npm run deploy
```

Elegí un nombre disponible para obtener `https://<nombre>.sanity.studio`. El alojamiento y la autenticación son los de Sanity; no hay autenticación propia. Agregá esa URL a los orígenes CORS permitidos del proyecto con credenciales y administrá los permisos de edición desde Sanity Manage. La disponibilidad de miembros y cuotas depende del plan gratuito vigente.

## Publicar en Cloudflare Pages

La web es **100 % estática**, sin adaptador SSR, Workers, base de datos ni funciones de pago.

1. Iniciá sesión en Cloudflare y abrí **Workers & Pages → Create application → Pages → Import an existing Git repository**.
2. Seleccioná `fedetesone/sociedad-italiana-de-arrecifes` y la rama `main`.
3. Configurá:

   | Opción                     | Valor                                         |
   | -------------------------- | --------------------------------------------- |
   | Directorio raíz            | raíz del repositorio (vacío)                  |
   | Comando de compilación     | `npm run build`                               |
   | Directorio de salida       | `web/dist`                                    |
   | `NODE_VERSION`             | `24`                                          |
   | `PUBLIC_SITE_URL`          | URL HTTPS final del sitio, sin barra al final |
   | `PUBLIC_SANITY_PROJECT_ID` | ID real de Sanity                             |
   | `PUBLIC_SANITY_DATASET`    | `production`                                  |

4. Desplegá. Cada push a `main` genera una nueva versión. Si agregás un dominio propio, actualizá `PUBLIC_SITE_URL` y recompilá para corregir enlaces canónicos, sitemap y metadatos sociales.

La URL `sociedad-italiana-de-arrecifes.pages.dev` es un valor por defecto, **no una afirmación de que ya existe un despliegue**. Configurá la URL real asignada por Cloudflare. El despliegue requiere acceso a la cuenta de Cloudflare.

### Actualizaciones de contenido y fechas

Un sitio estático necesita reconstruirse cuando cambia el contenido. En Cloudflare Pages, creá un **Deploy Hook** para `main`. Su URL es un secreto: nunca la guardes en código ni en variables públicas.

- En Sanity Manage → API → Webhooks, agregá el hook con método `POST`, dataset `production`, eventos create/update/delete y filtro `(_type == "event" || _type == "siteSettings") && !(_id in path("drafts.**"))`. Esto incluye publicaciones, ediciones, eliminaciones y retiros de publicación.
- En GitHub → Settings → Secrets and variables → Actions, guardá la misma URL como `CLOUDFLARE_DEPLOY_HOOK`. El workflow `rebuild.yml` solicita un build diario a las 00:15 de Argentina para mover eventos pasados. Puede ejecutarse manualmente. Sin el secreto, informa la configuración pendiente y no hace solicitudes.
- La agenda se clasifica en el momento del build. La finalización, cuando existe, mantiene el evento en próximos mientras está en curso. Sin finalización, pasa a anteriores después del inicio. Entre builds puede haber hasta un día de demora; las tareas programadas de GitHub pueden retrasarse y deshabilitarse en repositorios públicos inactivos. Se puede ejecutar el workflow o redesplegar manualmente.
- Los borradores nunca se muestran. No se implementó vista previa editorial de borradores.

## Contenido y accesibilidad

- Menú: Socios (trámites y beneficios), Escuela de italiano, Alquiler de salones, Quiénes somos (historia, actualidad y comisión directiva) y Contacto. La agenda sigue disponible desde inicio, Actualidad y el pie de página.
- Las fechas se muestran en `America/Argentina/Buenos_Aires`, independientemente de la zona del servidor.
- Navegación móvil con estado expandido y cierre con Escape; enlace para saltar al contenido, foco visible y HTML semántico.
- El texto enriquecido se renderiza escapado, con lista permitida de protocolos para enlaces. Las imágenes tienen texto alternativo editable.
- Formularios enviados mediante FormSubmit por AJAX, con honeypot y confirmación dentro del sitio. Requieren activar el destinatario antes de recibir correos (ver abajo).
- Fuentes locales (DM Sans y Newsreader); ninguna petición a Google Fonts. Imagen de portada almacenada localmente.
- Metadata Open Graph, Twitter, URL canónica, sitemap, robots y cabeceras estáticas de seguridad.

## Verificaciones

```sh
npm run check
npm test
npm run build
SANITY_STUDIO_PROJECT_ID=ci123456 npm run build:studio
```

El último comando verifica la compilación del Studio con un ID ficticio válido; no verifica un proyecto ni autenticación reales. Para uso real se necesita el ID propio. CI ejecuta estos controles en cada push/PR. Las pruebas cubren orden cronológico, eventos en curso, límite horario, cambio de fecha UTC/Argentina y enlaces inseguros.

## Publicar el repositorio manualmente

Si se trabaja en una copia nueva que todavía no tiene Git ni remoto:

```sh
git init -b main
git add .
git commit -m "feat: build Sociedad Italiana website and Sanity Studio"
gh auth login
gh repo create sociedad-italiana-de-arrecifes --public --source=. --remote=origin --push
```

Nunca subas `.env`, tokens ni URLs privadas de hooks. Los ejemplos `.env.example` no contienen secretos.

## Referencias y recursos

- [Astro: estilos y Tailwind](https://docs.astro.build/en/guides/styling/)
- [Cloudflare Pages: Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Sanity: instalación](https://www.sanity.io/docs/studio/installation)
- [Sanity: despliegue del Studio](https://www.sanity.io/docs/studio/deployment)
- Foto ilustrativa de Cinque Terre: [Unsplash](https://unsplash.com/photos/pEFIxD6atFQ), [archivo utilizado](https://images.unsplash.com/photo-1516483638261-f4dbaf036963), bajo [licencia Unsplash](https://unsplash.com/license). No representa la sede de Arrecifes.
- Fuentes distribuidas mediante Fontsource bajo sus licencias SIL OFL incluidas en los paquetes.

### Validación de la implementación inicial

Verificada con Node 24: chequeo de Astro y TypeScript sin errores, cuatro pruebas unitarias aprobadas y builds del sitio y Studio correctos. Se probó además un evento temporal (sin publicarlo ni conservarlo) para verificar generación de su detalle, enlaces, fecha argentina y escape de HTML. La portada estática obtuvo 100 en accesibilidad, buenas prácticas y SEO en Lighthouse móvil local; estos resultados no sustituyen una revisión del contenido real ni una medición del despliegue final. `npm audit` no reportó vulnerabilidades al entregar.

Los overrides de npm actualizan tres dependencias indirectas del CLI de Sanity (`js-yaml`, `smol-toml` y `undici`) dentro de sus versiones mayores para aplicar correcciones de seguridad. Revisalos al actualizar Sanity. `npm run format` aplica el formato de código, incluidos los archivos Astro.

## Formularios de solicitudes y contacto

Todos se envían por POST a **FormSubmit.co**, con destinatario fijo `soc.italiana.arrecifes@gmail.com`, sin servidor ni credenciales en el sitio. El asunto identifica el trámite y el nombre de quien consulta; `_replyto` permite responder a su email. Se conserva la plantilla `table` del proveedor. El correo de activación es propio de FormSubmit y no usa esta plantilla ni este asunto; no es una consulta recibida. No se suben documentos ni se almacenan solicitudes en Sanity. El destinatario se define en `web/src/lib/navigation.ts`; cambiar el email editorial en Sanity no cambia el receptor de los formularios.

### Activación pendiente antes de habilitar el sitio al público

1. Publicá el sitio en su dominio definitivo y configurá `PUBLIC_SITE_URL`.
2. Enviá una solicitud identificada como prueba desde Contacto usando un correo propio.
3. Abrí `soc.italiana.arrecifes@gmail.com`, revisá también Spam y confirmá el mensaje de activación enviado por FormSubmit. Si el proveedor pide confirmar otros formularios/orígenes, repetí la activación correspondiente.
4. Probá alta, baja, ingreso a la escuela y contacto. Verificá destinatario, asunto, datos y respuesta al remitente. Comprobá también alquileres y las consultas de socios.
5. Confirmá la llegada real de cada correo. **El envío a la casilla no fue probado ni activado durante el desarrollo**; se verificaron el destino POST, campos y validaciones sin enviar mensajes reales.

Con JavaScript, el envío usa el endpoint AJAX de FormSubmit: la confirmación y los errores aparecen en el formulario, sin redirección. El botón se deshabilita durante el envío; ante errores se conservan los campos y se ofrece contacto directo. La aceptación del proveedor no prueba recepción en Gmail. Una respuesta que indique activación pendiente se muestra como tal. Se conserva el honeypot; el flujo AJAX no presenta el CAPTCHA alojado del envío HTML, por lo que se debe revisar el spam antes de abrir el sitio al público.

Sin JavaScript se mantiene el POST HTML y el retorno a `/gracias/` según `PUBLIC_SITE_URL`; ese flujo puede mostrar páginas de FormSubmit. No envíes datos reales desde previews hasta verificar el destino. Se valida el formato del email y los campos obligatorios; el mensaje no tiene mínimo ni máximo de caracteres.

### Remitente y diseño de correo propios

FormSubmit no documenta una opción para configurar el encabezado `From` ni una plantilla HTML completamente propia. El remitente continúa siendo el proveedor. Para personalización completa, la alternativa recomendada es una función de Cloudflare + Resend: dominio remitente verificado, API key como secreto del servidor, destinatario fijo y `Reply-To` del visitante. Requiere configurar el dominio y el servicio; no está implementada ni habilitada. La web pública puede seguir siendo estática. Esa función deberá validar datos y protección antispam del lado servidor. Guía: https://resend.com/docs/send-with-cloudflare-workers

Documentación: [configuración](https://formsubmit.co/documentation), [activación y ayuda](https://formsubmit.co/help). Información pública sobre el tratamiento de datos: `/privacidad/`.

## Contenidos pendientes

Profesor confirmado por la institución: **Matias Costantini Reschia**. Oferta confirmada: **niveles 1, 2, 3 y 4, más Conversación**. La página de escuela es estática por ahora; no se asignaron equivalencias CEFR no confirmadas. Faltan aranceles, horarios, condiciones y porcentaje de bonificación, nómina y mandato de comisión directiva, y características de los salones. Dirección y teléfono confirmados por la institución: **España 694, Arrecifes, Buenos Aires** y **2478 610004**. Se muestran en Contacto y en el footer, y pueden actualizarse desde Sanity.

Fuentes y límites de los textos de referencia de salones: [docs/servicios-fuentes.md](docs/servicios-fuentes.md).
