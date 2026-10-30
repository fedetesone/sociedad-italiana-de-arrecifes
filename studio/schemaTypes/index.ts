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
  preview: { select: { title: "title", subtitle: "startsAt", media: "image" } },
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
      validation: (r) => r.regex(/^\+?[\d\s()-]{6,30}$/, { name: "teléfono" }),
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
export const schemaTypes = [richText, event, siteSettings];
