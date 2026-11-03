export const navigation = [
  {
    label: "Quiénes somos",
    href: "/nosotros/",
    children: [
      ["/nosotros/", "Historia"],
      ["/nosotros/actualidad/", "Actualidad"],
      ["/nosotros/comision-directiva/", "Comisión directiva"],
    ],
  },
  {
    label: "Socios",
    href: "/socios/",
    children: [
      ["/socios/alta/", "Solicitud de alta"],
      ["/socios/baja/", "Solicitud de baja"],
      ["/socios/bonificaciones/", "Bonificación de alquileres"],
      ["/socios/panteones/", "Panteones"],
      ["/socios/ciudadania-italiana/", "Ciudadanía italiana"],
      ["/socios/deudas/", "Regularización de deudas"],
    ],
  },
  { label: "Escuela de italiano", href: "/escuela-de-italiano/" },
  { label: "Eventos", href: "/eventos/" },
  // Children come from the rooms in Sanity (see Layout.astro).
  { label: "Alquiler de salones", href: "/salones/", children: [] },
  { label: "Contacto", href: "/contacto/" },
];
export const contactEmail = "soc.italiana.arrecifes@gmail.com";
