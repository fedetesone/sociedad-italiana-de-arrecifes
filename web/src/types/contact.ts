export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
export type ContactResponse =
  | { ok: true; status: "accepted" | "simulated"; message: string }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        fields?: Record<string, string[]>;
      };
    };

export interface ContactBindings {
  EMAIL_PROVIDER?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_TO?: string;
  CONTACT_ORIGIN?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_RATE_LIMITER?: {
    limit: (options: { key: string }) => Promise<{ success: boolean }>;
  };
}
