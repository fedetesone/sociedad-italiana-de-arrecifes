import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { esESLocale } from "@sanity/locale-es-es";
import { schemaTypes } from "./schemaTypes";
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
            S.documentTypeListItem("event").title("Eventos"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => option.templateId !== "siteSettings"),
    actions: (actions, context) =>
      context.schemaType === "siteSettings"
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action || "",
              ),
          )
        : actions,
  },
});
