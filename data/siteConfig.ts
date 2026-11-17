/**
 * Global Site Configuration & Direct Contact Channels
 * When the client provides their specific WhatsApp number,
 * update `whatsappNumber` below (e.g., '15551234567') or set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.
 */

export const siteConfig = {
  agencyName: 'MainahtunesTeam',
  tagline: 'Music · Branding · Digital Solutions',
  email: 'contact.mainahtunesteam@gmail.com',
  // WhatsApp Contact Number (Client will supply their number; accepts international format)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  get whatsappUrl() {
    const defaultMsg = encodeURIComponent('Hello MainahtunesTeam, I am interested in your creative and digital services.');
    if (this.whatsappNumber) {
      const cleanNum = this.whatsappNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNum}?text=${defaultMsg}`;
    }
    return `https://wa.me/?text=${defaultMsg}`;
  },
};
