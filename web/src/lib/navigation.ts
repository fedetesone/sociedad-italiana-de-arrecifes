export const navigation = [
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
  {
    label: "Alquiler de salones",
    href: "/salones/",
    children: [
      ["/salones/#regina", "Sala Regina"],
      ["/salones/#ravenna", "Sala Ravenna"],
      ["/salones/#patio", "Patio de eventos"],
    ],
  },
  {
    label: "Quiénes somos",
    href: "/nosotros/",
    children: [
      ["/nosotros/", "Historia"],
      ["/nosotros/actualidad/", "Actualidad"],
      ["/nosotros/comision-directiva/", "Comisión directiva"],
    ],
  },
  { label: "Contacto", href: "/contacto/" },
];
export const contactEmail = "soc.italiana.arrecifes@gmail.com";
