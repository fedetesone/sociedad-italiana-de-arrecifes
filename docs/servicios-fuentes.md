# Referencias para servicios y menú

Consultadas el 30 de octubre de 2026. Los datos proporcionados por la institución tienen prioridad.

- Sala **Regina**, con una sola n: [actividad musical registrada en la prensa local](https://minutoarrecifes.com.ar/2016/05/eden-presenta-en-arrecifes-musica-con-energia-su-ciclo-de-clinicas-musicales-y-conciertos/). Confirma un uso cultural pasado, no capacidad o equipamiento actual.
- Sala **Ravenna**: [boletín municipal, página 19](https://sibom.slyt.gba.gob.ar/bulletins/4651.pdf#page=19). Corrobora el nombre y la pertenencia a la institución. No proporciona condiciones de alquiler actuales.
- **Patio**: [convocatoria institucional publicada en 2021](https://diarioimagen.com.ar/asamblea-general-ordinaria-s-i-s-m-voz-de-caprera-2/). Confirma el espacio descubierto. No acredita habilitación, capacidad o servicios actuales.
- **Escuela Ital**: [recopilación de publicaciones](https://www.schoolandcollegelistings.com/AR/Arrecifes/128793957282410/Ital). Solo se utilizó contexto general de enseñanza de lengua y cultura; profesor y oferta de cuatro niveles más Conversación fueron informados directamente por el usuario. No se publicaron aranceles ni equivalencias de niveles.
- **Ciudadanía**: se enlaza al [Consulado General de Italia en Rosario](https://consrosario.esteri.it/es/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/cittadinanza_n/), cuya circunscripción incluye Arrecifes. Enlace corregido el 2/11/2026; no se reproducen requisitos legales cambiantes ni se prometen servicios consulares de la Sociedad.
- **Dirección y teléfono**: confirmados directamente por la institución el 30/10/2026: España 694, Arrecifes, Buenos Aires; 2478 610004.

Las descripciones de salones son textos iniciales basados en usos históricos. Se requieren datos de la institución para completar tarifas, capacidad, accesibilidad, mobiliario, instalaciones y condiciones de uso. Las bonificaciones y deudas se presentan como consultas, sin inventar porcentajes o planes.

## Consulado General de Italia en Rosario

Fuentes oficiales consultadas el 2 de noviembre de 2026 para la sección informativa de `/contacto/`:

- [Circunscripción consular](https://consrosario.esteri.it/es/chi-siamo/la-rete-consolare/): incluye expresamente al partido de Arrecifes. Se informa la competencia territorial, sin presentar a la Sociedad como una oficina consular.
- [Contacto](https://consrosario.esteri.it/es/chi-siamo/contatti/): Montevideo 2182, Rosario, Santa Fe; teléfonos +54 341 440-7020 / 7021 / 7022; segreteria.rosario@esteri.it; atención de lunes a viernes de 8:30 a 11:30. La referencia a la esquina de Bv. Oroño fue aportada por el usuario.
- [Emergencias](https://consrosario.esteri.it/es/chi-siamo/numeri-di-emergenza/): 0341 156184022 desde Argentina y +54 9 341 6184022 desde el exterior. Se conserva el uso exclusivo para casos graves, no para consultas de trámites. El enlace `tel:` usa el formato internacional; no combina +54 con el prefijo local 15.
- [RosIta](https://consrosario.esteri.it/es/news/dal_consolato/2022/06/rosita-nuovo-assistente-virtuale-2/): WhatsApp +54 9 341 2587798, servicio automático gratuito disponible las 24 horas, con información sobre ciudadanía, pasaportes y registro civil, entre otros temas.
- [Cónsul General](https://consrosario.esteri.it/es/chi-siamo/il-console-generale/): Filippo Romano, en funciones desde el 27 de julio de 2026.

Los datos se mantienen en `web/src/components/contact/ConsulateInfo.astro`; revisar estas fuentes antes de actualizarlos. Son contactos del Consulado, independientes del correo y el formulario de la Sociedad.

## INAES y Municipalidad de Arrecifes

Fuentes oficiales consultadas el 2 de noviembre de 2026 para las secciones de `web/src/components/contact/PublicInstitutions.astro`:

- [INAES](https://www.argentina.gob.ar/capital-humano/inaes): sedes de Av. Belgrano 1656 y 172, teléfono 4124-9300, atención al público de 10:00 a 16:00 y mesa de entradas de 10:00 a 15:00. No se agregan días de atención que no figuran en esa página.
- [Correos del INAES](https://www.argentina.gob.ar/capital-humano/inaes/mails-de-contacto-del-inaes): consultasweb@inaes.gob.ar para consultas generales. También se enlazan la [guía de trámites](https://www.argentina.gob.ar/inaes/tramites) y el [formulario oficial](https://www.argentina.gob.ar/inaes/contacto-inaes).
- [Aviso histórico del INAES](https://www.argentina.gob.ar/noticias/horarios-de-atencion), de enero de 2019: confirma el código telefónico 011. Sus horarios históricos de mesa de entradas no se utilizan; se toman los publicados en la portada actual. La [referencia institucional de sedes en CABA](https://www.argentina.gob.ar/noticias/la-actualizacion-se-efectuara-traves-del-sistema-de-tramites-distancia) identifica la ubicación de Av. Belgrano.
- [Municipalidad de Arrecifes](https://arrecifes.gob.ar/): dirección Ricardo Gutiérrez 730, Arrecifes, Buenos Aires, publicada en el pie de página. El enlace «Centro de Atención al Vecino» dirige a WhatsApp con el número +54 9 2478 404096; se conserva ese destino con `wa.me`. La navegación ofrece accesos a Rentas, licencias de conducir y turnos del hospital. No se publican teléfono fijo, correo ni horarios municipales sin confirmación en las fuentes consultadas.

Estas secciones ofrecen contactos externos; no modifican el destinatario ni el funcionamiento del formulario de la Sociedad.
