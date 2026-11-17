'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, ArrowUpRight, Clock, ShieldCheck, Send, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

const serviceOptions = [
  'General Enquiry & Custom Quote',
  // A. Music Distribution & Promotion
  'Music Distribution',
  'Music Promotion',
  'Playlist Pitching',
  'Radio Submission',
  'Sync Licensing',
  'Spotify Promotion',
  'YouTube Music Promotion',
  'TikTok Music Promotion',
  'SoundCloud Music Promotion',
  'Music Release Strategy & Campaign Planning',
  // B. Music Production & Audio Engineering
  'Music Mixing',
  'Track Mastering',
  'Vocal Editing & Tuning',
  'Audio Restoration & Enhancement',
  'Podcast Audio Editing',
  // C. Music Videos & Visual Production
  'AI-Assisted Music Video Production',
  'Cinematic Music Video Production',
  'Lyric Video Production',
  '2D Animation',
  '3D Animation',
  'Music Visualizers',
  'Promotional Video Editing',
  'Documentary Video Production',
  'Advertising Video Production',
  // D. Artist Branding & Graphic Design
  'Album & Single Cover Artwork',
  'Artist Branding',
  'Logo Design & Visual Identity',
  'Social Media Branding',
  'Artist Merchandise Design',
  'Promotional Posters & Flyers',
  'YouTube Channel Branding',
  'Electronic Press Kit (EPK) Design',
  'Music Release Promotional Graphics',
  // E. Artist Development & Digital Presence
  'Artist Digital Footprint Development',
  'Google Knowledge Panel Development Support',
  'Artist Biography Writing',
  'Artist Profile Optimization',
  'Digital Presence Audits',
  'Artist Marketing Strategy',
  'Music Copyright Support',
  'YouTube Monetization Support',
  'Online Reputation & Brand Consistency',
  // F. Website Development & Digital Technology
  'Website Development',
  'Artist Website Development',
  'Record Label Website Development',
  'Music Portfolio Website Development',
  'E-commerce Website Development',
  'Business Website Development',
  'Landing Page Development',
  'UI/UX Design',
  'API & Third-Party Integrations',
  'Website Maintenance & Optimization',
  'Web Application Development',
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || searchParams.get('project') || '';

  const [formData, setFormData] = useState({
    name: '',
    artistOrBusiness: '',
    email: '',
    country: '',
    service: '',
    budget: '',
    deadline: '',
    referenceLinks: '',
    message: '',
    _hp: '', // spam honeypot
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [refId, setRefId] = useState('');

  useEffect(() => {
    if (initialService) {
      const found = serviceOptions.find(
        (s) => s.toLowerCase() === initialService.toLowerCase()
      );
      setFormData((prev) => ({
        ...prev,
        service: found || initialService,
      }));
    }
  }, [initialService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setRefId(result.referenceId || `MT-${Date.now().toString(36).toUpperCase()}`);
      } else {
        setStatus('error');
        setErrorMessage(
          result.error ||
            'Something went wrong. Please check your information or email us directly.'
        );
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(
        'Unable to reach server. Please email us directly at contact.mainahtunesteam@gmail.com'
      );
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-success-card">
        <div className="success-icon-wrap">
          <CheckCircle2 size={48} className="success-icon" />
        </div>
        <h2>Project Enquiry Received!</h2>
        <p className="success-lead">
          Thank you for reaching out, <strong>{formData.name}</strong>. Your project details have been transmitted directly to our creative and management team.
        </p>
        <div className="success-details-box">
          <div>
            <span className="label">Reference ID</span>
            <strong>{refId}</strong>
          </div>
          <div>
            <span className="label">Selected Service</span>
            <strong>{formData.service || 'General Discussion'}</strong>
          </div>
          <div>
            <span className="label">Target Response</span>
            <span>Within 24–48 hours</span>
          </div>
        </div>
        <p className="success-sub">
          A confirmation has been logged. We will review your project scope and contact you at{' '}
          <code>{formData.email}</code> with tailored insights and next steps.
        </p>
        <div className="actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                artistOrBusiness: '',
                email: '',
                country: '',
                service: '',
                budget: '',
                deadline: '',
                referenceLinks: '',
                message: '',
                _hp: '',
              });
            }}
          >
            Submit Another Project
          </button>
          <Link href="/services" className="button button-orange">
            Explore All 53 Services <span>↗</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <small>PROJECT ENQUIRY &amp; CUSTOM QUOTATION</small>
        <h2>Let’s talk about your next move.</h2>
        <p className="form-lead-note">
          Every artist and project has unique goals. We provide bespoke quotations tailored to your exact scope, creative direction, and timeline.
        </p>
      </div>

      {status === 'error' && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden honeypot field for spam bots */}
      <input
        type="text"
        name="_hp"
        value={formData._hp}
        onChange={handleChange}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="form-grid">
        <label>
          Your Name <span className="req">*</span>
          <input
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Morgan"
          />
        </label>

        <label>
          Artist, Stage, or Business Name
          <input
            name="artistOrBusiness"
            value={formData.artistOrBusiness}
            onChange={handleChange}
            placeholder="e.g. Vellum Noir / Nova Sound Records"
          />
        </label>

        <label>
          Email Address <span className="req">*</span>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
          />
        </label>

        <label>
          Country / Region
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. United Kingdom, USA, Nigeria, France"
          />
        </label>

        <label>
          Required Service <span className="req">*</span>
          <select
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
          >
            <option value="" disabled>Select a service</option>
            {serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Estimated Budget Range <small>(For internal quote scoping only)</small>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value="">Select an approximate range</option>
            <option value="Under $500">Under $500</option>
            <option value="$500 – $1,000">$500 – $1,000</option>
            <option value="$1,000 – $2,500">$1,000 – $2,500</option>
            <option value="$2,500 – $5,000">$2,500 – $5,000</option>
            <option value="$5,000+">$5,000+</option>
            <option value="Flexible / To be discussed">Flexible / To be discussed</option>
          </select>
        </label>

        <label>
          Preferred Deadline / Launch Date
          <select
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          >
            <option value="">Select turnaround preference</option>
            <option value="Urgent (Within 7 days)">Urgent (Within 7 days)</option>
            <option value="Standard (1–2 weeks)">Standard (1–2 weeks)</option>
            <option value="Comfortable (3–4 weeks)">Comfortable (3–4 weeks)</option>
            <option value="Long-term planning (1–2+ months)">Long-term planning (1–2+ months)</option>
            <option value="Flexible">Flexible</option>
          </select>
        </label>

        <label>
          Reference Files or Links <small>(SoundCloud, Drive, Dropbox, YouTube)</small>
          <input
            name="referenceLinks"
            value={formData.referenceLinks}
            onChange={handleChange}
            placeholder="https://drive.google.com/... or https://soundcloud.com/..."
          />
        </label>
      </div>

      <label className="form-full">
        Tell Us About Your Project &amp; Creative Objectives <span className="req">*</span>
        <textarea
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          placeholder="Please describe your track, current sound, visual direction, target audience, release goals, or specific deliverables you require..."
        />
      </label>

      <div className="form-footer-bar">
        <button
          className="button button-orange"
          type="submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? (
            'Sending Project Enquiry...'
          ) : (
            <>
              Submit Project Enquiry <Send size={15} style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
        <div className="form-guarantee">
          <ShieldCheck size={16} />
          <span>No spam. Custom quotations are strictly confidential. Delivered directly to our management team.</span>
        </div>
      </div>
    </form>
  );
}

export default function Contact() {
  return (
    <main>
      <section className="page-hero contact-hero">
        <div className="eyebrow">START A CONVERSATION</div>
        <h1>
          Tell us what you’re <em>working towards.</em>
        </h1>
        <p>
          Whether you are an independent recording artist, producer, label executive, or creative brand,
          we provide custom solutions tailored to your sound, visual identity, and growth roadmap.
        </p>
        <div className="contact-hero-perks">
          <span>
            <Clock size={14} /> 24–48 hour turnaround on quotations
          </span>
          <span>
            <ShieldCheck size={14} /> Confidential &amp; rights-safe project discussions
          </span>
          <span>
            <Mail size={14} /> Direct access to senior creative leads
          </span>
        </div>
      </section>

      <section className="section contact-wrap">
        <div className="official-contact">
          <div>
            <div className="eyebrow">DIRECT INBOX &amp; INSTANT CHAT</div>
            <h2>Official Agency Communication</h2>
            <p>
              For urgent bookings, consultations, collaborations, or quick questions, reach out via WhatsApp or email directly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={`mailto:${siteConfig.email}`}
              className="direct-mail-btn"
            >
              {siteConfig.email} <ArrowUpRight size={18} />
            </a>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="direct-whatsapp-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: '#25D366',
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={18} /> Chat on WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="contact-loading-card">
              <div className="loading-spinner" />
              <p>Loading project enquiry form...</p>
            </div>
          }
        >
          <ContactFormInner />
        </Suspense>
      </section>
    </main>
  );
}
