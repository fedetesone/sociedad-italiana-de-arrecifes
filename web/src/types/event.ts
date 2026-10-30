export interface Event {
  _id: string;
  title: string;
  slug: string;
  startsAt: string;
  endsAt?: string;
  venue: string;
  summary: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  body?: import("@portabletext/types").PortableTextBlock[];
  ticketUrl?: string;
  status?: "scheduled" | "cancelled";
}
