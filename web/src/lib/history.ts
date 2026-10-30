import type { PortableTextBlock } from "@portabletext/types";

// Reseña documentada. Sanity puede reemplazarla mediante el campo history.
export const institutionalHistory: PortableTextBlock[] = [
  {
    _type: "block",
    _key: "history-0",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "history-0-text",
        text: "Desde 1881, parte de Arrecifes",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-1",
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: "history-1-source",
        href: "https://www.fondazionemutuosoccorso.it/doc/immagini/mostre/foto_garibaldi/Garibaldi.pdf",
      },
    ],
    children: [
      {
        _type: "span",
        _key: "history-1-text",
        text: 'La Sociedad Italiana de Socorros Mutuos "Voz de Caprera" tiene sus orígenes en 1881. La documentación de la Fondazione Mutuo Soccorso la registra con el nombre italiano "Voce di Caprera" y consigna 79 socios en el censo de sociedades italianas en el exterior de 1898. Es un testimonio de nuestras raíces en el asociacionismo italiano de fines del siglo XIX.',
        marks: [],
      },
      {
        _type: "span",
        _key: "history-1-link",
        text: " Consultar el registro histórico (PDF).",
        marks: ["history-1-source"],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-2",
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: "history-2-source",
        href: "https://arrecifes.gob.ar/la-municipalidad-de-arrecifes-saluda-a-la-sociedad-italiana-de-socorros-mutuos-voce-di-caprera/",
      },
    ],
    children: [
      {
        _type: "span",
        _key: "history-2-text",
        text: "En septiembre de 2025, la Municipalidad de Arrecifes reconoció los 144 años de participación de la institución en la comunidad. Una trayectoria que une nuestra identidad italiana con la historia de la ciudad.",
        marks: [],
      },
      {
        _type: "span",
        _key: "history-2-link",
        text: " Ver el reconocimiento municipal.",
        marks: ["history-2-source"],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-3",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "history-3-text",
        text: "La Sala Regina y el cuidado de nuestro patrimonio",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-4",
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: "history-4-source",
        href: "https://sibom.slyt.gba.gob.ar/bulletins/5681.pdf#page=6",
      },
    ],
    children: [
      {
        _type: "span",
        _key: "history-4-text",
        text: "La Sala Regina forma parte del patrimonio de la Sociedad. En abril de 2021, el municipio documentó las refacciones de nuestros inmuebles y la restauración del antiguo cartel de la sala, acompañando esos trabajos con un aporte económico.",
        marks: [],
      },
      {
        _type: "span",
        _key: "history-4-link",
        text: " Consultar el Decreto 179/21 (PDF, página 6).",
        marks: ["history-4-source"],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-5",
    style: "h3",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "history-5-text",
        text: "Un vínculo con Gamalero",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-6",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "history-6-text",
        text: "El 13 de julio de 2018, Arrecifes y Gamalero, una comuna de la región italiana del Piamonte, suscribieron un acuerdo de entendimiento. La Sociedad impulsó una iniciativa para hacer visible esa amistad en nuestra ciudad.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "history-7",
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: "history-7-source",
        href: "https://sibom.slyt.gba.gob.ar/bulletins/5700/contents/1598149",
      },
    ],
    children: [
      {
        _type: "span",
        _key: "history-7-text",
        text: "En 2021, la Ordenanza 3252/21 autorizó el emplazamiento de un cartel que testimonia la cooperación entre ambas comunidades y designó a la Sociedad como responsable de su cuidado y el del lugar. Ese proyecto expresa nuestra vocación de mantener vivos los lazos con Italia.",
        marks: [],
      },
      {
        _type: "span",
        _key: "history-7-link",
        text: " Leer la ordenanza municipal.",
        marks: ["history-7-source"],
      },
    ],
  },
];
