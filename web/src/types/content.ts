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

export interface School {
  intro: string;
  teacher: string;
  fees: string;
  schedule: string;
  levelsTitle: string;
  levelsIntro: string;
  levels: { name: string; description?: string }[];
  note: string;
}

export interface Board {
  groups: {
    title: string;
    members: { role: string; name: string; until?: number }[];
  }[];
  note?: string;
}

export interface Room {
  name: string;
  tag?: string;
  description?: string;
  capacity?: string;
  features?: string;
  rates?: string;
  image?: string;
  imageAlt?: string;
  source?: { href: string; label: string };
}
