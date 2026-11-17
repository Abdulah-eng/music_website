import Link from 'next/link';
import { ArrowUpRight, Mail, Instagram, Youtube, Music2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand">
            MAINAHTUNESTEAM
            <span>MUSIC · BRANDING · DIGITAL SOLUTIONS</span>
          </div>
          <p className="footer-desc">
            An international creative and digital solutions agency dedicated to independent musicians, recording artists, producers, record labels, and visionary creative businesses.
          </p>
          <div className="footer-badge">
            <span className="pulse-dot" /> 53 Connected Services · Global Client Base
          </div>
        </div>

        <div className="footer-links-col">
          <h4>EXPLORE AGENCY</h4>
          <Link href="/services">Complete 53 Services Directory</Link>
          <Link href="/visuals">Review My Works (Portfolio)</Link>
          <Link href="/artist-growth">Artist Growth Roadmap</Link>
          <Link href="/about">About MainahtunesTeam</Link>
          <Link href="/team">Our Team &amp; Leadership</Link>
          <Link href="/contact">Request a Custom Quotation</Link>
        </div>

        <div className="footer-links-col">
          <h4>LEGAL &amp; COMPLIANCE</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <div style={{ marginTop: '20px' }}>
            <h4>COMMUNICATION</h4>
            <a
              href="mailto:contact.mainahtunesteam@gmail.com"
              className="footer-email-link"
            >
              <Mail size={13} style={{ display: 'inline', marginRight: '6px' }} />
              contact.mainahtunesteam@gmail.com
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>CONNECT &amp; SOCIAL</h4>
          <div className="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram <ArrowUpRight size={12} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube <ArrowUpRight size={12} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              TikTok <ArrowUpRight size={12} />
            </a>
            <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
              SoundCloud <ArrowUpRight size={12} />
            </a>
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
              WhatsApp Direct <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MainahtunesTeam. All rights reserved.</span>
        <span>Independent Vision. International Execution.</span>
      </div>
    </footer>
  );
}
