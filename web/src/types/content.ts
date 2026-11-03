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
