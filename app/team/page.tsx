import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { teamMembers, upcomingRoles } from '@/data/team';
import { ShieldCheck, CheckCircle2, Sparkles, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Team & Leadership | MainahtunesTeam',
  description:
    'Meet the leadership, financial stewardship, and creative professionals driving MainahtunesTeam agency operations.',
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
          MainahtunesTeam combines seasoned financial management, audio engineering, visual art direction,
          and digital technology to deliver dependable, high-impact creative services.
        </p>
      </section>

      {/* =========================================================================
          EXECUTIVE LEADERSHIP SPOTLIGHT
         ========================================================================= */}
      <section className="section team-catalog-section" aria-label="Team members">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EXECUTIVE LEADERSHIP &amp; STEWARDSHIP</div>
            <h2>Operational &amp; Financial Management</h2>
          </div>
          <p>
            Committed to the financial planning, budget oversight, and transparent stewardship that empower our creative teams.
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

                <div className="team-contact-action">
                  <Link
                    href={`/contact?service=General%20Enquiry&project=${encodeURIComponent(
                      `Attention: ${member.name}`
                    )}`}
                    className="button button-orange"
                  >
                    Contact Management Desk <span>↗</span>
                  </Link>
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
