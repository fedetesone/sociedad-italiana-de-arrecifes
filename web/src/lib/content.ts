import { createClient } from "@sanity/client";
import type { Event } from "./events";
export interface Settings {
  name: string;
  intro: string;
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
  instagram?: string;
  facebook?: string;
  heroImage?: string;
  heroAlt?: string;
  aboutImage?: string;
  aboutAlt?: string;
  history?: import("@portabletext/types").PortableTextBlock[];
  mission: string;
  activities: { title: string; description: string }[];
}
const defaults: Settings = {
  email: "soc.italiana.arrecifes@gmail.com",
  name: 'Sociedad Italiana de S.M. "Voz de Caprera"',
  intro:
    "Desde 1881, un lugar para encontrarnos, compartir nuestras raíces y seguir construyendo comunidad en Arrecifes.",
  mission:
    "Acercar la cultura italiana a nuestra comunidad, cuidar la memoria compartida y abrir espacios de encuentro entre generaciones.",
  activities: [
    {
      title: "Cultura que nos une",
      description:
        "El idioma, el arte y las tradiciones italianas como un puente entre generaciones.",
    },
    {
      title: "Sabores para compartir",
      description:
        "Recetas, recuerdos y sobremesas. La cocina como parte de nuestra identidad.",
    },
    {
      title: "Una comunidad abierta",
      description:
        "Un espacio para acercarse, aportar ideas y compartir el valor de estar juntos.",
    },
  ],
};
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const client = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET || "production",
      apiVersion: "2026-10-01",
      useCdn: false,
      perspective: "published",
    })
  : null;
let content: Promise<{ settings: Settings; events: Event[] }> | undefined;
export function getContent() {
  return (content ??= load());
}
async function load() {
  if (!client) return { settings: defaults, events: [] };
  // Fail the build on API errors: never silently replace published content with an empty site.
  const data = await client.fetch<{
    settings: Partial<Settings> | null;
    events: Event[];
  }>(
    `{"settings":*[_type=="siteSettings" && _id=="siteSettings"][0]{...,"heroImage":heroImage.asset->url,"heroAlt":heroImage.alt,"aboutImage":aboutImage.asset->url,"aboutAlt":aboutImage.alt},"events":*[_type=="event" && defined(slug.current)]{...,"slug":slug.current,"image":image.asset->url,"imageAlt":image.alt}}`,
  );
  const defined = Object.fromEntries(
    Object.entries(data.settings || {}).filter(
      ([, v]) => v !== null && v !== undefined,
    ),
  );
  return {
    settings: { ...defaults, ...defined } as Settings,
    events: data.events,
  };
}
