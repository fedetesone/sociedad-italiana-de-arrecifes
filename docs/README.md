# Guía para administrar la web

**Sociedad Italiana de Socorros Mutuos “Voz de Caprera” — Arrecifes**

Esta guía es para las personas que mantienen la información del sitio. No hace falta saber programación ni instalar programas: alcanza con un navegador, conexión a internet y un usuario autorizado.

Está pensada para el uso cotidiano, una vez creadas las cuentas y configurados el dominio, Sanity y la publicación de la web. No es una constancia de que esas configuraciones ya estén terminadas. La persona responsable debe completar los accesos de abajo y comprobar una publicación antes de entregar el administrador.

## 1. Guardá estos accesos

| Acceso                                     | Dirección o dato                                             |
| ------------------------------------------ | ------------------------------------------------------------ |
| Sitio público: lo que ven los visitantes   | **Completar con el dominio definitivo**                      |
| Administrador de contenidos: Sanity Studio | **Completar con el enlace real del Studio**                  |
| Persona responsable de accesos y soporte   | **Completar nombre y forma de contacto**                     |
| Correo que recibe las consultas            | soc.italiana.arrecifes@gmail.com                             |
| Gestión de usuarios de Sanity              | https://www.sanity.io/manage                                 |
| Alojamiento: Cloudflare                    | https://dash.cloudflare.com/                                 |
| Código del sitio: GitHub                   | https://github.com/fedetesone/sociedad-italiana-de-arrecifes |
| Empresa donde se renueva el dominio        | **Completar proveedor y fecha de renovación**                |

Guardá el sitio público y el administrador en los favoritos del navegador. Son dos páginas distintas. El enlace del Studio suele terminar en `.sanity.studio`, aunque puede tener otra dirección.

**No escribas contraseñas, códigos de recuperación ni claves privadas en esta guía: el repositorio es público.** Cada persona debe ingresar con su propio usuario. Tener una cuenta de Google no alcanza: también tiene que estar invitada al proyecto de Sanity.

## 2. ¿Para qué sirve cada cuenta?

| Herramienta              | Para qué se usa                                                    | Quién necesita entrar  |
| ------------------------ | ------------------------------------------------------------------ | ---------------------- |
| Sanity Studio            | Escribir y publicar eventos, fotos y datos institucionales         | Quien carga contenido  |
| Sanity Manage            | Invitar personas y administrar permisos                            | Responsable de cuentas |
| Correo de la institución | Leer y responder solicitudes de socios, cursos, salones y contacto | Administración         |
| Cloudflare               | Mantener el sitio publicado y revisar problemas de actualización   | Responsable técnico    |
| GitHub                   | Guardar y modificar el código y el diseño                          | Responsable técnico    |
| Proveedor del dominio    | Renovar la dirección de internet                                   | Responsable de cuentas |

Para cargar un evento normalmente solo necesitás **Sanity Studio**. No necesitás abrir Cloudflare ni GitHub.

## 3. Qué podés cambiar desde Sanity

Al entrar al administrador vas a encontrar dos secciones: **La institución** y **Eventos**.

| Contenido                                                                         | Dónde se modifica |
| --------------------------------------------------------------------------------- | ----------------- |
| Eventos nuevos y anteriores, fechas, afiches, descripciones y enlaces de entradas | Eventos           |
| Presentación, historia y propósito de la Sociedad                                 | La institución    |
| Foto de portada y fotografía institucional                                        | La institución    |
| Tarjetas de Cultura y comunidad del inicio                                        | La institución    |
| Dirección, teléfono, horarios, correo visible y redes sociales                    | La institución    |

**Todavía requieren ayuda técnica:** textos y aranceles de la Escuela de italiano, información de los salones, bonificaciones, panteones, ciudadanía, deudas, comisión directiva, menú, logo, diseño y campos de los formularios. La página Actualidad muestra la agenda, pero no tiene un editor separado de noticias. No hay gestión de pagos ni padrón de socios en este administrador.

El nombre editable se usa en partes del sitio, como el pie de página; la marca del encabezado y algunos títulos están definidos en el diseño. Para cambiar el nombre en todo el sitio, pedí ayuda técnica.

## 4. Entrar al administrador

1. Abrí el enlace de **Sanity Studio** guardado en la sección 1.
2. Iniciá sesión con el mismo método y correo con el que aceptaste la invitación. Si fue con Google, elegí esa cuenta.
3. Verificá que el administrador muestre la Sociedad Italiana y las secciones **La institución** y **Eventos**.
4. Elegí la sección que querés editar.

Si aparece “sin acceso” o no encontrás el proyecto, pedile a la persona responsable que revise la invitación. No crees otro proyecto para resolverlo.

## 5. Publicar un evento, paso a paso

1. Entrá a **Eventos**.
2. Elegí el botón para crear un documento, generalmente identificado con un **+** o “Crear”.
3. Completá los campos de esta tabla.
4. Revisá el contenido y corregí los errores que marque el administrador.
5. Presioná **Publicar**. Si la interfaz aparece en inglés, el botón puede decir **Publish**.
6. Esperá la actualización de la web y comprobá el evento en el sitio público, desde la agenda.

| Campo                            | Qué escribir                                                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Título                           | Un nombre claro, por ejemplo “Encuentro de conversación en italiano”. Máximo 120 caracteres.                                             |
| Dirección de la página           | Usá la opción para generar a partir del título. Quedará algo como `encuentro-de-conversacion-en-italiano`. No es la dirección del salón. |
| Fecha y hora de inicio           | El día y horario reales. Revisá que el selector corresponda a la hora argentina, UTC−3. La web siempre muestra hora de Argentina.        |
| Fecha y hora de finalización     | Opcional. Si la conocés, completala; no puede ser anterior al inicio.                                                                    |
| Lugar y dirección                | Por ejemplo, “Sala Regina — España 694, Arrecifes”, si ese es el lugar confirmado.                                                       |
| Resumen                          | Una invitación breve de hasta 240 caracteres, para la tarjeta del evento.                                                                |
| Tipo de encuentro                | Opcional: charla, música, gastronomía, encuentro cultural, etc.                                                                          |
| Afiche o imagen destacada        | Subí el afiche o una foto. Si agregás una imagen, completá su descripción.                                                               |
| Descripción completa             | Explicá de qué se trata, a quién está dirigido, condiciones, costo si corresponde y cómo participar.                                     |
| Enlace de inscripción o entradas | Opcional. Pegá la dirección completa, comenzando con `https://`. Si no existe, dejalo vacío.                                             |

**Ejemplo de descripción para adaptar:**

> Nos encontramos para compartir una actividad de la comunidad. La propuesta está dirigida a [público]. Tendrá lugar el [fecha], a las [hora], en [espacio]. La participación es [gratuita / con costo de…]. Para reservar tu lugar, [instrucciones confirmadas].

Reemplazá todos los textos entre corchetes. No publiques este ejemplo como si fuera una actividad real.

### Antes de publicar, revisá

- Que título, fecha, hora, lugar y costo coincidan con el afiche.
- Que la información importante también esté escrita en la descripción, no solamente dentro de la imagen.
- Que los enlaces abran la página correcta.
- Que el resumen se entienda sin leer el resto.
- Que la imagen y el texto estén autorizados para su publicación.

## 6. Guardar no es lo mismo que publicar

Sanity guarda automáticamente los cambios como **borrador** mientras trabajás y tenés conexión. Antes de cerrar, esperá a que deje de indicar que está guardando.

Un borrador no aparece en la web. Si editás un evento ya publicado, los visitantes seguirán viendo la versión anterior hasta que vuelvas a presionar **Publicar** y se actualice el sitio.

Después de publicar, Cloudflare prepara una nueva versión de la web. Esto puede tardar unos minutos: recargá la página pública para comprobarlo. Este proceso necesita que esté configurada la conexión automática entre Sanity y Cloudflare. Si esa conexión falta o falla, publicar en Sanity por sí solo no actualiza la web; avisá a soporte.

No hay una vista previa de borradores en el sitio público. Revisá el texto en el administrador antes de publicarlo y después comprobá el resultado en la web.

## 7. Corregir, reprogramar o retirar un evento

### Corregir datos

Abrí **Eventos**, elegí el evento, modificá los campos necesarios y volvé a publicar. Después revisá el sitio público.

Evitá cambiar la **Dirección de la página** una vez que compartiste el enlace: el enlace anterior puede dejar de funcionar. Podés corregir el título sin cambiar esa dirección.

### Reprogramar o cancelar

Para reprogramar, cambiá inicio, finalización, texto y afiche para que todo coincida. Publicá nuevamente.

Si se cancela una actividad que ya difundiste, suele ser mejor mantener la página y aclarar **“Cancelado”** en el título, resumen y descripción. Además, cambiá el campo **Estado** a **Cancelado** y publicá: el evento dejará de aparecer en la agenda, pero conservará su página con un aviso y sin enlace de entradas. Si no ves el campo, pedí al responsable técnico que publique la nueva versión del administrador. Así quienes abran el enlace podrán enterarse.

### Quitar de la web

En las acciones del documento, buscá **Despublicar** o **Unpublish**. Esto retira el evento publicado y conserva un borrador. La retirada se verá cuando se actualice la web.

**Eliminar** borra el documento; no es necesario para quitarlo del sitio. Si tenés dudas, consultá antes de eliminar. La sección La institución no permite eliminarse ni despublicarse desde este administrador.

### Eventos anteriores

No hace falta borrarlos. La web separa los próximos de los anteriores según la fecha, cuando se actualiza. Si cargaste una finalización, el evento permanece entre los próximos mientras está en curso. Si no, pasa a anteriores después de su hora de inicio, en la siguiente actualización.

El responsable técnico debe mantener activa la actualización diaria. Por eso el cambio de sección puede no coincidir exactamente con la hora en que termina la actividad.

## 8. Actualizar la información institucional

1. Abrí **La institución**.
2. Cambiá solo los campos que necesitás actualizar.
3. Completá los campos obligatorios si es la primera carga.
4. Presioná **Publicar** y comprobá las páginas correspondientes.

| Campo                      | Dónde aparece o para qué sirve                                          |
| -------------------------- | ----------------------------------------------------------------------- |
| Presentación institucional | Introducción del inicio y de Quiénes somos; máximo 400 caracteres       |
| Nuestra historia           | Reseña en Quiénes somos; usá fechas y datos confirmados                 |
| Nuestro propósito          | Misión institucional en Quiénes somos                                   |
| Foto de portada            | Imagen principal del inicio                                             |
| Fotografía institucional   | Imagen de Quiénes somos                                                 |
| Cultura y comunidad        | Tarjetas del inicio; entre 1 y 6 si se carga la lista                   |
| Dirección y teléfono       | Contacto y pie de página                                                |
| Horarios de atención       | Contacto                                                                |
| Correo electrónico         | Dirección visible de contacto                                           |
| Instagram y Facebook       | Enlaces de Contacto; pegá la URL completa, no solo el nombre de usuario |

Datos de referencia confirmados:

- **Dirección:** España 694, Arrecifes, Buenos Aires.
- **Teléfono:** 2478 610004.
- **Correo:** soc.italiana.arrecifes@gmail.com.

El correo visible aparece en el pie, en Contacto y junto a cada formulario como alternativa para escribir directamente. **Cambiarlo en Sanity no cambia el destinatario de los formularios.** Para que las solicitudes lleguen a otra casilla, tiene que intervenir la persona responsable del sitio.

Contacto también muestra los datos del **Consulado General de Italia en Rosario**, cuya circunscripción incluye Arrecifes. Esa sección requiere ayuda técnica para actualizarse; no se modifica con los datos de la Sociedad en Sanity. Verificá teléfonos, horarios y autoridades en las [fuentes oficiales documentadas](servicios-fuentes.md#consulado-general-de-italia-en-rosario). El formulario de la web sigue dirigido a la Sociedad.

Las secciones de **INAES** y **Municipalidad de Arrecifes** también se actualizan con ayuda técnica. Sus datos y enlaces deben revisarse en los [sitios oficiales de referencia](servicios-fuentes.md#inaes-y-municipalidad-de-arrecifes); no se editan desde Sanity.

Algunos campos tienen información de respaldo. Vaciar un campo no siempre lo elimina de la web; por ejemplo, si borrás la historia, vuelve a mostrarse la reseña incluida en el sitio. Consultá si necesitás retirar por completo una sección.

La reseña de respaldo incluye una síntesis de la publicación del 120.º aniversario aportada por la institución. Antes de ampliar o corregir fechas, consultá las [fuentes históricas y las fotografías del archivo](historia-fuentes.md). Los servicios mencionados en ese material histórico no acreditan prestaciones vigentes.

## 9. Subir fotos y afiches

1. Abrí el campo de imagen correspondiente.
2. Elegí la opción para subir una imagen desde tu dispositivo, o seleccioná una ya cargada.
3. Completá **Descripción de la imagen**. Por ejemplo: “Participantes del taller de italiano reunidos en la Sala Regina”.
4. Publicá el documento y revisá cómo se ve en computadora y en celular.

Usá imágenes nítidas. Una captura de WhatsApp suele verse peor que el archivo original. Para la portada conviene una foto horizontal; los afiches pueden ser verticales. El sitio puede recortar las imágenes para adaptarlas a cada pantalla: comprobá que se vea lo importante.

No cargues documentos de identidad, información bancaria, padrones ni material privado en Sanity. Está configurado para contenido público: tampoco uses los borradores como archivo de documentación confidencial.

## 10. Leer y responder formularios

Las solicitudes **no se consultan en Sanity**. Se reciben en la casilla configurada por la institución, normalmente **soc.italiana.arrecifes@gmail.com**. Contacto usa Resend cuando está activado; las solicitudes de socios, escuela y salones continúan usando FormSubmit. Si el envío de Contacto todavía no está habilitado, la página lo informa y ofrece escribir por correo directamente.

1. Abrí la casilla de correo.
2. Buscá asuntos que comiencen con **[Voz de Caprera]**. En Contacto, el asunto incluye lo que escribió la persona en el campo Asunto. En los trámites de FormSubmit incluye el tipo de solicitud y el nombre.
3. Leé los datos y usá **Responder**: está preparado para responder al correo que indicó la persona.
4. Revisá que el destinatario sea correcto antes de enviar la respuesta.
5. Respondé según el trámite y los procedimientos de la institución.

La solicitud de alta de socios también pide **Domicilio, Localidad y Código postal** como campos obligatorios. Estos datos se incluyen en el correo recibido.

Enviar el formulario no da de alta o baja automáticamente a un socio, no confirma una inscripción ni reserva un salón. Es una solicitud que debe revisar la administración.

Solo para los formularios que usan FormSubmit: si llega un correo pidiendo **activar el formulario**, es una configuración del servicio, no una solicitud de un visitante. La activación debe coordinarse con el responsable del sitio y comprobarse con una consulta de prueba desde el dominio público. Revisá también Spam si no llega un mensaje esperado.

## 11. Dar acceso a otra persona

Esta tarea corresponde a quien administra las cuentas. La persona que solo carga contenido puede saltear esta sección.

1. Entrá a **Sanity Manage** con una cuenta administradora.
2. Seleccioná el proyecto de la Sociedad Italiana.
3. Buscá la sección de miembros o usuarios e invitá el correo de la persona.
4. Elegí un permiso disponible que permita editar y publicar contenido. Los nombres de los roles, cupos y costos dependen del plan; revisalos antes de confirmar. No hace falta dar administración completa para cargar eventos.
5. Pedile que acepte la invitación y enviále el enlace real del **Studio**, junto con esta guía.
6. Comprobá que puede entrar, crear un borrador y publicar cuando corresponda.

No compartas la contraseña de una cuenta para dar acceso. Si alguien deja de colaborar, revisá y retirale los permisos que ya no necesite. Conservá un responsable identificado para recuperar accesos y renovar el dominio.

## 12. Si algo no funciona

| Problema                                        | Qué hacer                                                                                                                                                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No puedo entrar                                 | Revisá el correo con el que iniciaste sesión y si aceptaste la invitación. Pedí revisión de permisos.                                                                                                                                   |
| No puedo publicar                               | Revisá los campos marcados con errores. Si no aparece el botón o está bloqueado por permisos, consultá al administrador.                                                                                                                |
| Publiqué pero no veo el cambio                  | Esperá unos minutos, recargá y verificá que estés en el dominio público correcto. Si persiste, avisá a soporte para revisar la actualización en Cloudflare.                                                                             |
| La hora aparece corrida                         | Revisá la zona horaria del selector y corregí el inicio y la finalización. La web muestra hora argentina.                                                                                                                               |
| Un enlace de evento dejó de abrir               | Revisá si se cambió la Dirección de la página o se despublicó. Pedí ayuda para recuperar el enlace compartido.                                                                                                                          |
| No llegan las consultas                         | Revisá Spam y la casilla destinataria. Para Contacto, pedí revisar Resend; para los demás formularios, la activación de FormSubmit. Pedí una prueba de entrega; el mensaje de confirmación de la web no garantiza que Gmail lo recibió. |
| El evento sigue en Próximos después de terminar | Pedí revisar la actualización diaria del sitio. No hace falta borrarlo.                                                                                                                                                                 |
| Edité algo por error                            | Si ya estaba publicado, corregilo y publicá otra vez. Si necesitás recuperar una versión, pedí ayuda; no borres el documento.                                                                                                           |
| Quiero editar escuela, salones o comisión       | Solicitá el cambio al responsable técnico; esas páginas todavía no se editan desde Sanity.                                                                                                                                              |

Cuando pidas ayuda, indicá qué página o evento estabas editando, qué intentaste hacer, a qué hora y qué mensaje apareció. Podés adjuntar una captura sin contraseñas ni datos privados.

## 13. Entrega y mantenimiento de las cuentas

La persona responsable debe comprobar estos puntos antes de entregar el sitio para uso cotidiano:

- Completar los enlaces reales y el contacto de soporte al comienzo de esta guía.
- Confirmar que el Studio y la web usan el mismo proyecto y contenido de Sanity.
- Comprobar que publicar, corregir y despublicar un evento actualiza la web automáticamente.
- Mantener activa la actualización diaria de la agenda.
- Verificar la llegada y respuesta de una consulta desde el sitio público.
- Registrar quién controla el dominio, su fecha de renovación y los medios de recuperación de las cuentas, en un lugar privado.
- Entregar a cada colaborador su acceso individual y comprobar los permisos.

Las instrucciones de instalación y configuración están en el [README técnico](../README.md). No hacen falta para cargar contenido todos los días.

## Referencias para el responsable

- [Uso de borradores y publicación en Sanity](https://www.sanity.io/docs/user-guides/content-operations-cheatsheet).
- [Studio e invitación de colaboradores](https://www.sanity.io/docs/deploying-studio-and-inviting-editors).
- [Roles y permisos de Sanity](https://www.sanity.io/docs/content-lake/roles-concepts).
- [Conexión automática con Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/).

Los nombres de algunos botones pueden variar según el idioma, el plan y las actualizaciones del servicio.
