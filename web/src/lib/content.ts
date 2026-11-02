import { fetchSanityContent } from "./sanity/data";
import type { Settings } from "../types/content";
import { isValidEvent } from "./events/utils";
import type { Event } from "../types/event";
import { contactEmail } from "./navigation";
const defaults: Settings = {
  email: contactEmail,
  address: "España 694, Arrecifes, Buenos Aires",
  phone: "2478 610004",
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
let content: Promise<{ settings: Settings; events: Event[] }> | undefined;
export function getContent() {
  return (content ??= load());
}
async function load() {
  const data = await fetchSanityContent();
  if (!data) return { settings: defaults, events: [] };
  const defined = Object.fromEntries(
    Object.entries(data.settings || {}).filter(
      ([, v]) => v !== null && v !== undefined,
    ),
  );
  return {
    settings: { ...defaults, ...defined } as Settings,
    events: data.events.filter(isValidEvent),
  };
}
