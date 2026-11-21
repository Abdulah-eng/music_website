'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Sparkles, ArrowUpRight } from 'lucide-react';
import type { TeamMember } from '@/data/team';

interface Props {
  initialMembers?: TeamMember[];
}

export default function HomeTeamPreview({ initialMembers = [] }: Props) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  useEffect(() => {
    // 1. Immediately sync with localStorage for manually added team members
    let localMembers: TeamMember[] = [];
    try {
      const stored = localStorage.getItem('mainahtunes_custom_team');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localMembers = parsed;
          setMembers(parsed);
        }
      }
    } catch {}

    // 2. Fetch live team from API
    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch team');
        return res.json();
      })
      .then((data) => {
        const serverList: TeamMember[] =
          data && data.teamMembers && Array.isArray(data.teamMembers) && data.teamMembers.length > 0
            ? data.teamMembers
            : [];

        setMembers(() => {
          const map = new Map<string, TeamMember>();
          localMembers.forEach((m) => map.set(m.id, m));
          serverList.forEach((m) => {
            if (!map.has(m.id)) map.set(m.id, m);
          });
          return Array.from(map.values());
        });
      })
      .catch((err) => console.warn('Home team preview err:', err));
  }, []);

  if (members.length === 0) {
    return null;
  }

  // Identify Founder to position at the top
  const founder =
    members.find(
      (m) =>
        m.role.toLowerCase().includes('founder') ||
        m.name.toLowerCase().includes('amelia')
    ) || members[0];

  const followers = founder ? members.filter((m) => m.id !== founder.id) : [];

  return (
    <section className="section team-preview-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">THE PEOPLE BEHIND THE VISION</div>
          <h2>
            Meet our <em>leadership &amp; team.</em>
          </h2>
        </div>
        <p>
          Dedicated to the creative direction, cinematic video production, and operational excellence of your releases.
        </p>
      </div>

      <div className="team-preview-container">
        {/* =========================================================================
            1. FOUNDER ON TOP
           ========================================================================= */}
        {founder && (
          <article className="team-preview-founder-card">
            <div className="team-preview-photo">
              <Image
                src={founder.image || '/team/amelia-clarke.jpeg'}
                alt={`${founder.name}, ${founder.role}`}
                width={700}
                height={880}
                unoptimized
              />
              <div className="team-preview-founder-overlay">
                <Sparkles size={13} />
                <span>FOUNDER &amp; CREATIVE VISION</span>
              </div>
            </div>
            <div className="team-preview-info">
              <div className="founder-tag-row">
                <span className="team-preview-role-highlight">
                  <Star size={11} /> {founder.role.toUpperCase()}
                </span>
                <span className="team-preview-dept">{founder.department}</span>
              </div>
              <h3>{founder.name}</h3>
              <p>{founder.bio}</p>
              <div className="team-preview-footer">
                <Link href="/team" className="button button-orange button-sm">
                  View Full Profile &amp; Credentials <span>↗</span>
                </Link>
                <Link href="/contact" className="text-link">
                  Consult with {founder.name.split(' ')[0]} ↗
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* =========================================================================
            2. OTHER TEAM MEMBERS FOLLOWING BENEATH
           ========================================================================= */}
        {followers.length > 0 && (
          <div className="team-preview-followers-row">
            <div className="team-preview-followers-subhead">
              <span className="eyebrow">OPERATIONS &amp; PRODUCTION TEAM</span>
            </div>
            <div className="team-preview-followers-grid">
              {followers.map((member) => (
                <article className="team-preview-follower-card" key={member.id}>
                  <div className="follower-mini-photo">
                    <Image
                      src={member.image || '/team/oliver-bennett.jpeg'}
                      alt={`${member.name}, ${member.role}`}
                      width={320}
                      height={380}
                      unoptimized
                    />
                  </div>
                  <div className="follower-mini-info">
                    <span className="team-preview-role">{member.role.toUpperCase()}</span>
                    <h4>{member.name}</h4>
                    <p className="follower-dept-label">{member.department}</p>
                    <p className="follower-bio-snippet">{member.bio}</p>
                    <Link href="/team" className="text-link">
                      View full credentials ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
