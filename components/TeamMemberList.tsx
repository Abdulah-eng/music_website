'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Sparkles, Star, ArrowUpRight } from 'lucide-react';
import type { TeamMember } from '@/data/team';
import { siteConfig } from '@/data/siteConfig';

interface Props {
  initialMembers: TeamMember[];
}

export default function TeamMemberList({ initialMembers }: Props) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  useEffect(() => {
    // 1. Immediately read localStorage to show any client-side added members
    let localMembers: TeamMember[] = [];
    try {
      const local = localStorage.getItem('mainahtunes_custom_team');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localMembers = parsed;
          setMembers((prev) => {
            const map = new Map<string, TeamMember>();
            localMembers.forEach((m) => map.set(m.id, m));
            prev.forEach((m) => {
              if (!map.has(m.id)) map.set(m.id, m);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch {}

    // 2. Fetch live team roster from API (merges baseline with cloud-stored members)
    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch team members');
        return res.json();
      })
      .then((data) => {
        const serverList: TeamMember[] =
          data && data.teamMembers && Array.isArray(data.teamMembers) && data.teamMembers.length > 0
            ? data.teamMembers
            : initialMembers;

        setMembers(() => {
          const map = new Map<string, TeamMember>();
          localMembers.forEach((m) => map.set(m.id, m));
          serverList.forEach((m) => {
            if (!map.has(m.id)) map.set(m.id, m);
          });
          return Array.from(map.values());
        });
      })
      .catch((err) => {
        console.warn('Using baseline team roster:', err);
      });
  }, [initialMembers]);

  if (members.length === 0) {
    return (
      <div
        className="team-empty-state"
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          border: '1px dashed var(--line)',
          borderRadius: '12px',
          background: 'var(--card-bg)',
          margin: '0 auto',
          maxWidth: '800px',
        }}
      >
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
          Our leadership and creative team profiles are currently being updated.
        </p>
        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/contact" className="button button-orange">
            Start a Project Enquiry ↗
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
    );
  }

  // Identify the Founder to position prominently at the top
  const founder =
    members.find(
      (m) =>
        m.role.toLowerCase().includes('founder') ||
        m.name.toLowerCase().includes('amelia')
    ) || members[0];

  // The rest of the team members follow beneath
  const followers = founder ? members.filter((m) => m.id !== founder.id) : [];

  return (
    <div className="team-hierarchy-wrapper">
      {/* =========================================================================
          1. FOUNDER PROMINENT SPOTLIGHT (ALWAYS ON TOP)
         ========================================================================= */}
      {founder && (
        <section className="founder-spotlight-section" aria-label="Agency Founder">
          <div className="founder-spotlight-card">
            <div className="founder-photo-column">
              <div className="founder-photo-frame">
                <Image
                  src={founder.image || '/team/amelia-clarke.jpeg'}
                  alt={`${founder.name}, ${founder.role}`}
                  width={900}
                  height={1100}
                  priority
                  unoptimized
                />
                <div className="founder-photo-overlay">
                  <div className="founder-crown-badge">
                    <Sparkles size={12} />
                    <span>FOUNDER &amp; EXECUTIVE DIRECTION</span>
                  </div>
                  <span className="founder-dept-tag">{founder.department.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="founder-info-column">
              <div className="founder-header-line">
                <span className="founder-lead-pill">
                  <Star size={12} className="founder-star-icon" />
                  FOUNDER &middot; EXECUTIVE LEADERSHIP
                </span>
                <span className="founder-role-sub">{founder.role}</span>
              </div>

              <h2 className="founder-name">{founder.name}</h2>
              <div className="founder-dept-sub">{founder.department}</div>

              <p className="founder-bio">{founder.bio}</p>

              {founder.credentials && founder.credentials.length > 0 && (
                <div className="founder-credentials-box">
                  <small>EXECUTIVE RESPONSIBILITIES &amp; STRATEGY</small>
                  <div className="founder-credentials-grid">
                    {founder.credentials.map((cred) => (
                      <div key={cred} className="founder-cred-item">
                        <CheckCircle2 size={15} />
                        <span>{cred}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="founder-contact-actions">
                <Link
                  href={`/contact?service=General%20Enquiry&project=${encodeURIComponent(
                    `Attention: ${founder.name} (${founder.role})`
                  )}`}
                  className="button button-orange"
                >
                  Consult with {founder.name.split(' ')[0]} <span>↗</span>
                </Link>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <MessageCircle size={15} color="#25D366" /> Chat on WhatsApp <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          2. OTHER TEAM MEMBERS (FOLLOWING BENEATH IN AN ORGANIZED GRID)
         ========================================================================= */}
      {followers.length > 0 && (
        <section className="team-followers-section" aria-label="Executive & Production Team">
          <div className="team-followers-header">
            <div>
              <div className="eyebrow">EXECUTIVE &amp; PRODUCTION TEAM</div>
              <h3>Production, Operations &amp; Client Success</h3>
            </div>
            <p>
              Collaborating seamlessly with the founder to lead cinematic video direction, audio engineering,
              and end-to-end client communications.
            </p>
          </div>

          <div className="team-followers-grid">
            {followers.map((member) => (
              <article className="team-follower-card" key={member.id}>
                <div className="team-follower-photo-wrapper">
                  <div className="team-follower-photo">
                    <Image
                      src={member.image || '/team/oliver-bennett.jpeg'}
                      alt={`${member.name}, ${member.role}`}
                      width={700}
                      height={850}
                      unoptimized
                    />
                    <div className="team-follower-dept-tag">
                      <span>{member.department.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="team-follower-content">
                  <span className="team-follower-role">{member.role.toUpperCase()}</span>
                  <h4 className="team-follower-name">{member.name}</h4>
                  <p className="team-follower-bio">{member.bio}</p>

                  {member.credentials && member.credentials.length > 0 && (
                    <div className="team-follower-credentials">
                      <small>KEY CAPABILITIES</small>
                      <div className="team-follower-cred-list">
                        {member.credentials.map((cred) => (
                          <div key={cred} className="team-follower-cred-item">
                            <CheckCircle2 size={13} />
                            <span>{cred}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="team-follower-actions">
                    <Link
                      href={`/contact?service=General%20Enquiry&project=${encodeURIComponent(
                        `Attention: ${member.name} (${member.role})`
                      )}`}
                      className="button button-orange button-sm"
                    >
                      Enquire with {member.name.split(' ')[0]} <span>↗</span>
                    </Link>
                    <a
                      href={siteConfig.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-outline button-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageCircle size={13} color="#25D366" /> WhatsApp <span>↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
