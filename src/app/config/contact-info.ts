/**
 * Single source of truth for all contact details.
 * Update values here; every UI consumer reads from this file.
 * The formEndpoint is a Formspree public form ID — no secret key.
 */
export const CONTACT_INFO = {
  emails: {
    general: 'gm@oil-epc.com',
    business: 'bdm@oil-epc.com',
  },
  phones: {
    primary: '+966560967865',
    secondary: '+966532023587',
  },
  /** WhatsApp number — confirm which number before final build */
  whatsapp: '+966560967865',
  location: {
    en: 'Kingdom of Saudi Arabia',
    ar: 'المملكة العربية السعودية',
  },
  /**
   * Formspree endpoint URL.
   * Set via environment variable FORM_ENDPOINT at build time,
   * or replace this string with the real Formspree form URL.
   * Example: 'https://formspree.io/f/xyzabcde'
   * Never commit a private key here.
   */
  formEndpoint: 'https://formspree.io/f/xpwrgjzb',
} as const;

export type ContactInfo = typeof CONTACT_INFO;
