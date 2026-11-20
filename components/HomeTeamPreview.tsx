'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
          Dedicated to the financial stewardship, operational planning, and creative execution of your projects.
        </p>
      </div>

      <div className="team-preview-grid">
        {members.map((member) => (
          <article className="team-preview-card" key={member.id}>
            <div className="team-preview-photo">
              <Image
                src={member.image || '/team/amelia-clarke.jpeg'}
                alt={`${member.name}, ${member.role}`}
                width={600}
                height={750}
                unoptimized
              />
            </div>
            <div className="team-preview-info">
              <span className="team-preview-role">{member.role.toUpperCase()}</span>
              <h3>{member.name}</h3>
              <p>{member.bio}</p>
              <Link href="/team" className="text-link">
                View full team profile &amp; credentials ↗
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
