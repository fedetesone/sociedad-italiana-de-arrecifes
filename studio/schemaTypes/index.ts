import { defineType, defineField, defineArrayMember } from "sanity";
const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Descripción de la imagen",
        description:
          "Describí lo que muestra la foto para quienes usan lectores de pantalla.",
        type: "string",
        validation: (r) => r.required(),
      }),
    ],
  });
const richText = defineType({
  name: "richText",
  title: "Texto",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Título", value: "h2" },
        { title: "Subtítulo", value: "h3" },
        { title: "Cita", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Cursiva", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Enlace",
            fields: [
              {
                name: "href",
                title: "Dirección web",
                type: "url",
                validation: (r) =>
                  r.required().uri({ scheme: ["https", "http"] }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
const event = defineType({
  name: "event",
  title: "Evento",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      initialValue: "scheduled",
      options: {
        list: [
          { title: "Programado", value: "scheduled" },
          { title: "Cancelado", value: "cancelled" },
        ],
      },
      description:
        "Los cancelados conservan su página, pero no aparecen en la agenda ni permiten acceder al enlace de entradas.",
    }),
    defineField({
      name: "slug",
      title: "Dirección de la página",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) =>
        r
          .required()
          .custom((value) =>
            !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
              ? true
              : "Usá letras minúsculas, números y guiones.",
          ),
    }),
    defineField({
      name: "startsAt",
      title: "Fecha y hora de inicio",
      description:
        "Verificá la zona horaria del selector. La web muestra siempre la hora de Argentina.",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Fecha y hora de finalización",
      type: "datetime",
      validation: (r) =>
        r.custom((value, context) =>
          !value ||
          !context.document?.startsAt ||
          Date.parse(value) >= Date.parse(context.document.startsAt as string)
            ? true
            : "La finalización debe ser posterior al inicio.",
        ),
    }),
    defineField({
      name: "venue",
      title: "Lugar y dirección",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Resumen",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: "category",
      title: "Tipo de encuentro",
      type: "string",
    }),
    imageField("image", "Afiche o imagen destacada"),
    defineField({
      name: "body",
      title: "Descripción completa",
      type: "richText",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ticketUrl",
      title: "Enlace de inscripción o entradas",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https", "http"] }),
    }),
  ],
  orderings: [
    {
      title: "Fecha más reciente",
      name: "dateDesc",
      by: [{ field: "startsAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", startsAt: "startsAt", media: "image" },
    prepare: ({ title, startsAt, media }) => ({
      title,
      media,
      subtitle: startsAt
        ? new Intl.DateTimeFormat("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date(startsAt))
        : "Sin fecha",
    }),
  },
});
const siteSettings = defineType({
  name: "siteSettings",
  title: "La institución",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre de la institución",
      type: "string",
      initialValue: 'Sociedad Italiana de S.M. "Voz de Caprera"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Presentación institucional",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(400),
    }),
    imageField("heroImage", "Foto de portada"),
    imageField("aboutImage", "Fotografía institucional"),
    defineField({
      name: "history",
      title: "Nuestra historia",
      description:
        "Incluí datos históricos y fechas verificados por la institución.",
      type: "richText",
    }),
    defineField({
      name: "mission",
      title: "Nuestro propósito",
      type: "text",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "activities",
      title: "Cultura y comunidad",
      type: "array",
      validation: (r) => r.min(1).max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "activity",
          title: "Actividad",
          fields: [
            defineField({
              name: "title",
              title: "Título",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "description",
              title: "Descripción",
              type: "text",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "address", title: "Dirección", type: "string" }),
    defineField({
      name: "hours",
      title: "Horarios de atención",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Correo electrónico",
      type: "string",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      validation: (r) =>
        r
          .regex(/^\+?[\d\s()-]{6,30}$/)
          .error("Usá solo números, espacios, guiones o paréntesis."),
    }),
    defineField({
      name: "instagram",
      title: "Instagram (URL completa)",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "facebook",
      title: "Facebook (URL completa)",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
  ],
});
const school = defineType({
  name: "school",
  title: "Escuela de italiano",
  type: "document",
  description: "Los campos vacíos usan el texto que hoy muestra la web.",
  fields: [
    defineField({
      name: "intro",
      title: "Presentación",
      description: "Separá los párrafos con una línea en blanco.",
      type: "text",
      rows: 6,
    }),
    defineField({ name: "teacher", title: "Profesor/a", type: "string" }),
    defineField({
      name: "fees",
      title: "Aranceles",
      description: "Costo, matrícula y formas de pago vigentes.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "schedule",
      title: "Días y horarios",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "levelsTitle",
      title: "Título de la sección de niveles",
      description: "Si cambiás la cantidad de niveles, revisá este título.",
      type: "string",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "levelsIntro",
      title: "Presentación de los niveles",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "levels",
      title: "Niveles",
      description:
        'También son las opciones de "Nivel de interés" en el formulario de ingreso.',
      type: "array",
      validation: (r) => r.max(12),
      of: [
        defineArrayMember({
          type: "object",
          name: "level",
          title: "Nivel",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "description",
              title: "Descripción breve",
              type: "string",
              validation: (r) => r.max(200),
            }),
          ],
          preview: { select: { title: "name", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "note",
      title: "Aclaración final",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { prepare: () => ({ title: "Escuela de italiano" }) },
});
const board = defineType({
  name: "board",
  title: "Comisión directiva",
  type: "document",
  description: "Cargá solo nombres y cargos confirmados por la institución.",
  fields: [
    defineField({
      name: "groups",
      title: "Órganos",
      description:
        "Por ejemplo: Comisión Directiva y Junta Fiscalizadora. Cada uno se muestra como una tabla, en este orden.",
      type: "array",
      validation: (r) => r.max(6),
      of: [
        defineArrayMember({
          type: "object",
          name: "group",
          title: "Órgano",
          fields: [
            defineField({
              name: "title",
              title: "Nombre del órgano",
              type: "string",
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: "members",
              title: "Integrantes",
              description:
                "Arrastrá para ordenar; la tabla respeta este orden.",
              type: "array",
              validation: (r) => r.max(40),
              of: [
                defineArrayMember({
                  type: "object",
                  name: "member",
                  title: "Integrante",
                  fields: [
                    defineField({
                      name: "role",
                      title: "Cargo",
                      type: "string",
                      validation: (r) => r.required().max(80),
                    }),
                    defineField({
                      name: "name",
                      title: "Apellido y nombres",
                      description:
                        "Como figura en la nómina, por ejemplo: LABRIOLA, Elio Remo.",
                      type: "string",
                      validation: (r) => r.required().max(100),
                    }),
                    defineField({
                      name: "until",
                      title: "Mandato hasta (año)",
                      type: "number",
                      validation: (r) => r.integer().min(2000).max(2100),
                    }),
                  ],
                  preview: {
                    select: { title: "name", role: "role", until: "until" },
                    prepare: ({ title, role, until }) => ({
                      title,
                      subtitle: until ? `${role} · hasta ${until}` : role,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", members: "members" },
            prepare: ({ title, members }) => ({
              title,
              subtitle: `${members?.length ?? 0} integrantes`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "note",
      title: "Aclaración",
      description: "Texto opcional debajo de las tablas.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: { prepare: () => ({ title: "Comisión directiva" }) },
});
const venues = defineType({
  name: "venues",
  title: "Alquiler de salones",
  type: "document",
  description:
    "Si no hay espacios cargados, la web muestra los textos actuales.",
  fields: [
    defineField({
      name: "rooms",
      title: "Espacios",
      description:
        "Cada espacio tiene su recuadro en la página, su enlace en el menú y su opción en el formulario de consulta. Arrastrá para ordenar.",
      type: "array",
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "room",
          title: "Espacio",
          fields: [
            defineField({
              name: "name",
              title: "Nombre",
              description: "Por ejemplo: Sala Regina.",
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "tag",
              title: "Etiqueta",
              description:
                "Frase corta sobre el nombre, por ejemplo: Cultura y encuentros.",
              type: "string",
              validation: (r) => r.max(60),
            }),
            defineField({
              name: "description",
              title: "Descripción",
              type: "text",
              rows: 3,
              validation: (r) => r.max(600),
            }),
            defineField({
              name: "capacity",
              title: "Capacidad",
              description: "Por ejemplo: hasta 120 personas.",
              type: "string",
              validation: (r) => r.max(80),
            }),
            defineField({
              name: "features",
              title: "Equipamiento y servicios",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "rates",
              title: "Tarifas",
              description: "Solo valores confirmados por la institución.",
              type: "text",
              rows: 2,
            }),
            imageField("image", "Foto del espacio"),
          ],
          preview: {
            select: { title: "name", subtitle: "tag", media: "image" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Alquiler de salones" }) },
});
export const schemaTypes = [
  richText,
  event,
  siteSettings,
  school,
  board,
  venues,
];
