import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { teamMembers, upcomingRoles } from '@/data/team';
import { siteConfig } from '@/data/siteConfig';
import { ShieldCheck, CheckCircle2, Sparkles, Mail, ArrowRight, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team & Leadership | MainahtunesTeam',
  description:
    'Meet the leadership, creative direction, video production, and client success professionals driving MainahtunesTeam agency operations.',
};

export default function TeamPage() {
  return (
    <main>
      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="page-hero team-hero">
        <div className="eyebrow">THE PEOPLE BEHIND THE VISION</div>
        <h1>
          Meet <em>Our Team.</em>
        </h1>
        <p>
          MainahtunesTeam combines seasoned creative direction, international music production, cinematic video direction,
          client operations, and financial management to deliver dependable, high-impact creative solutions.
        </p>
      </section>

      {/* =========================================================================
          EXECUTIVE LEADERSHIP SPOTLIGHT
         ========================================================================= */}
      <section className="section team-catalog-section" aria-label="Team members">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EXECUTIVE LEADERSHIP &amp; STEWARDSHIP</div>
            <h2>Creative Direction, Production &amp; Operations</h2>
          </div>
          <p>
            Meet the leaders guiding creative direction, cinematic video production, client success, and financial stewardship across every release.
          </p>
        </div>

        <div className="team-detailed-grid">
          {teamMembers.map((member) => (
            <article className="team-detailed-card" key={member.id}>
              <div className="team-photo-column">
                <div className="team-photo-frame">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    width={800}
                    height={1000}
                    priority
                    unoptimized
                  />
                  <div className="photo-tag-overlay">
                    <span>{member.department.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="team-info-column">
                <span className="team-role-pill">{member.role}</span>
                <h2>{member.name}</h2>
                <p className="team-bio-lead">{member.bio}</p>

                <div className="team-credentials-box">
                  <small>CORE RESPONSIBILITIES &amp; EXPERTISE</small>
                  <div className="credentials-grid">
                    {member.credentials.map((cred) => (
                      <div key={cred} className="cred-item">
                        <CheckCircle2 size={15} />
                        <span>{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="team-contact-action" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/contact?service=General%20Enquiry&project=${encodeURIComponent(
                      `Attention: ${member.name} (${member.role})`
                    )}`}
                    className="button button-orange"
                  >
                    Enquire with {member.name.split(' ')[0]} <span>↗</span>
                  </Link>
                  <a
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-outline"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={14} color="#25D366" /> Chat on WhatsApp ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CREATIVE ROSTER & NETWORK
         ========================================================================= */}
      <section className="section upcoming-roles-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CREATIVE NETWORK &amp; DEPARTMENTS</div>
            <h2>Specialized Studio Departments</h2>
          </div>
          <p>
            Our international network of specialist audio engineers, 3D animators, and software architects collaborate seamlessly on client projects.
          </p>
        </div>

        <div className="departments-grid">
          {upcomingRoles.map((dept) => (
            <article className="department-card" key={dept.role}>
              <span className="dept-tag">{dept.department.toUpperCase()}</span>
              <h3>{dept.role}</h3>
              <p>{dept.description}</p>
              <div className="dept-status">
                <span className="pulse-dot" /> Active Specialist Roster
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA BAND
         ========================================================================= */}
      <section className="cta-band">
        <div>
          <div className="eyebrow">WORK WITH OUR AGENCY</div>
          <h2>Ready to collaborate with our team?</h2>
          <p>
            Tell us about your upcoming musical project, branding needs, or web platform.
            We will review your requirements and coordinate the right creative specialists.
          </p>
        </div>
        <Link className="button button-orange" href="/contact">
          Start Your Project ↗
        </Link>
      </section>
    </main>
  );
}
