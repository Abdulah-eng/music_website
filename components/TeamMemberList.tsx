'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import type { TeamMember } from '@/data/team';
import { siteConfig } from '@/data/siteConfig';

interface Props {
  initialMembers: TeamMember[];
}

export default function TeamMemberList({ initialMembers }: Props) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  useEffect(() => {
    // 1. Fetch live team roster from API (merges baseline with cloud-stored members)
    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch team members');
        return res.json();
      })
      .then((data) => {
        if (data && data.teamMembers && Array.isArray(data.teamMembers)) {
          setMembers(data.teamMembers);
        }
      })
      .catch((err) => {
        console.warn('Using baseline team roster:', err);
      });

    // 2. Client-side browser sync for instant preview
    try {
      const local = localStorage.getItem('mainahtunes_custom_team');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMembers = parsed.filter((m: any) => !existingIds.has(m.id));
            return [...newMembers, ...prev];
          });
        }
      }
    } catch {}
  }, []);

  return (
    <div className="team-detailed-grid">
      {members.map((member) => (
        <article className="team-detailed-card" key={member.id}>
          <div className="team-photo-column">
            <div className="team-photo-frame">
              <Image
                src={member.image || '/team/amelia-clarke.jpeg'}
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
  );
}
