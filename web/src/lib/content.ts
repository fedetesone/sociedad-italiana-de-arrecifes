import { fetchSanityContent } from "./sanity/data";
import type { Board, Room, School, Settings } from "../types/content";
import { isValidEvent } from "./events/utils";
import type { Event } from "../types/event";
import { contactEmail } from "./navigation";
const defaults: Settings = {
  email: contactEmail,
  address: "España 694, Arrecifes, Buenos Aires",
  phone: "+54 2478 610004",
  facebook: "https://www.facebook.com/profile.php?id=100069104318651",
  instagram: "https://www.instagram.com/soc.italiana.arrecifes/",
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
const schoolDefaults: School = {
  intro:
    "La Escuela de Italiano de Arrecifes, Ital, funciona en la Sociedad. Sus publicaciones describen cursos de lengua y cultura italianas y propuestas de perfeccionamiento para quienes quieren seguir aprendiendo.\n\nEl recorrido combina herramientas para comunicarse con el descubrimiento del arte, la geografía y las tradiciones de Italia.",
  teacher: "Matias Costantini Reschia.",
  fees: "Consultá el costo vigente, matrícula y formas de pago.",
  schedule: "A confirmar según el grupo y los cupos disponibles.",
  levelsTitle: "Cinco etapas para seguir aprendiendo",
  levelsIntro:
    "La escuela ofrece cuatro niveles de italiano y una propuesta de Conversación para el tramo más avanzado. Consultá con el profesor cuál corresponde a tu recorrido.",
  levels: [
    { name: "Nivel 1", description: "El inicio del recorrido." },
    { name: "Nivel 2", description: "Continuidad del aprendizaje." },
    { name: "Nivel 3", description: "Una nueva etapa para profundizar." },
    { name: "Nivel 4", description: "El cuarto nivel del recorrido." },
    { name: "Conversación", description: "La propuesta más avanzada." },
  ],
  note: "Los contenidos, horarios y criterios de ingreso se informan al consultar. La solicitud no reserva una vacante.",
};
// Initial texts based on documented historical uses (docs/servicios-fuentes.md).
const roomDefaults: Room[] = [
  {
    name: "Sala Regina",
    tag: "Cultura y encuentros",
    description:
      "Una sala vinculada a la vida cultural de Arrecifes. Hay registros de conciertos y actividades musicales realizadas en este espacio de la Sociedad.",
  },
  {
    name: "Sala Ravenna",
    tag: "Reuniones y vida institucional",
    description:
      "Un espacio de la Sociedad que ha sido sede de encuentros institucionales. Su nombre también figura en la documentación municipal sobre el mantenimiento del edificio.",
  },
  {
    name: "Patio de eventos",
    tag: "Encuentros al aire libre",
    description:
      "El patio descubierto forma parte de los espacios de encuentro de la institución. Las convocatorias de la Sociedad documentan su uso para reuniones de asociados.",
  },
];
/** Anchor for a room, shared by the rooms page and the menu: "Sala Regina" → "sala-regina". */
export const roomId = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
let content:
  | Promise<{
      settings: Settings;
      school: School;
      board: Board;
      rooms: Room[];
      events: Event[];
    }>
  | undefined;
export function getContent() {
  return (content ??= load());
}
// Published values win; empty fields and lists keep the fallback text.
const filled = (document: object | null) =>
  Object.fromEntries(
    Object.entries(document || {}).filter(
      ([, v]) =>
        v !== null && v !== undefined && !(Array.isArray(v) && !v.length),
    ),
  );
async function load() {
  const data = await fetchSanityContent();
  // No board defaults: authorities are only published from confirmed data.
  const board: Board = { groups: [] };
  if (!data)
    return {
      settings: defaults,
      school: schoolDefaults,
      board,
      rooms: roomDefaults,
      events: [],
    };
  return {
    settings: { ...defaults, ...filled(data.settings) } as Settings,
    school: { ...schoolDefaults, ...filled(data.school) } as School,
    board: { ...board, ...filled(data.board) } as Board,
    rooms: data.venues?.rooms?.length ? data.venues.rooms : roomDefaults,
    events: data.events.filter(isValidEvent),
  };
}
