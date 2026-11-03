import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { esESLocale } from "@sanity/locale-es-es";
import { schemaTypes } from "./schemaTypes";
// One fixed document each: no create, duplicate, delete or unpublish.
const singletons = ["siteSettings", "school"];
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId)
  throw new Error(
    "Configurá SANITY_STUDIO_PROJECT_ID en studio/.env antes de iniciar el Studio.",
  );
export default defineConfig({
  name: "sociedad-italiana",
  title: 'Sociedad Italiana de S.M. "Voz de Caprera"',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    esESLocale(),
    structureTool({
      title: "Contenido",
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("La institución")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.listItem()
              .title("Escuela de italiano")
              .child(S.document().schemaType("school").documentId("school")),
            S.documentTypeListItem("event").title("Eventos"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => !singletons.includes(option.templateId)),
    actions: (actions, context) =>
      singletons.includes(context.schemaType)
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action || "",
              ),
          )
        : actions,
  },
});
