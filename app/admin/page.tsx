'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Palette,
  Volume2,
  Users,
  MessageSquare,
  PlusCircle,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import { services } from '@/data/services';
import { artworkCatalog, audioCatalog, webProjectsCatalog } from '@/data/portfolio';
import { teamMembers } from '@/data/team';
import { testimonials } from '@/data/testimonials';

export default function AdminManagementStudio() {
  const [activeTab, setActiveTab] = useState<'services' | 'artworks' | 'audio' | 'team' | 'testimonials' | 'add-item'>('services');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New item generator form state
  const [generatorType, setGeneratorType] = useState<'artwork' | 'team' | 'testimonial'>('artwork');
  const [genArtwork, setGenArtwork] = useState({
    title: '',
    artist: '',
    style: '',
    concept: '',
  });
  const [genTeam, setGenTeam] = useState({
    name: '',
    role: '',
    department: '',
    bio: '',
  });
  const [genTestimonial, setGenTestimonial] = useState({
    clientName: '',
    role: '',
    location: '',
    serviceEngaged: '',
    quote: '',
    verifiedOutcome: '',
  });

  const [generatedJson, setGeneratedJson] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (generatorType === 'artwork') {
      const code = `  {
    id: 'art-${Date.now().toString(36)}',
    title: '${genArtwork.title || 'Untitled Artwork'}',
    artist: '${genArtwork.artist || 'Artist Name'}',
    style: '${genArtwork.style || 'Genre / Style'}',
    image: '${genArtwork.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'artwork'}.png',
    concept: '${genArtwork.concept || 'Creative visual concept description.'}',
    deliverables: ['3000x3000px Digital Master', 'Vinyl Sleeve Template', 'Spotify Canvas Assets'],
  },`;
      setGeneratedJson(code);
    } else if (generatorType === 'team') {
      const code = `  {
    id: '${genTeam.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'team-member'}',
    name: '${genTeam.name || 'Full Name'}',
    role: '${genTeam.role || 'Position / Role'}',
    department: '${genTeam.department || 'Department'}',
    image: '/team/${genTeam.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'photo'}.png',
    bio: "${genTeam.bio || 'Professional biography.'}",
    credentials: [
      'Specialized Area 1',
      'Specialized Area 2',
      'Client Milestone Delivery',
    ],
  },`;
      setGeneratedJson(code);
    } else {
      const code = `  {
    id: 't-${Date.now().toString(36)}',
    clientName: '${genTestimonial.clientName || 'Client Name'}',
    role: '${genTestimonial.role || 'Role'}',
    location: '${genTestimonial.location || 'City, Country'}',
    serviceEngaged: '${genTestimonial.serviceEngaged || 'Service Name'}',
    quote: "${genTestimonial.quote || 'Client review quote.'}",
    verifiedOutcome: '${genTestimonial.verifiedOutcome || 'Verified project outcome'}',
  },`;
      setGeneratedJson(code);
    }
  };

  return (
    <main className="admin-studio-main">
      <section className="page-hero admin-hero">
        <div className="eyebrow">CONTENT MANAGEMENT SYSTEM (CMS)</div>
        <h1>
          Agency Content <em>Management Studio.</em>
        </h1>
        <p>
          Manage, preview, and update all 53 services, portfolio artworks, audio samples, team members, and testimonials without writing code.
        </p>

        <div className="admin-quick-stats">
          <span><b>53</b> Services</span>
          <span><b>19</b> Artworks</span>
          <span><b>06</b> Audio Samples</span>
          <span><b>08</b> Web Projects</span>
          <span><b>04</b> Testimonials</span>
          <span><b>01</b> Executive Team Lead</span>
        </div>
      </section>

      <section className="section admin-console-section">
        <div className="admin-nav-bar">
          <button
            type="button"
            className={activeTab === 'services' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('services')}
          >
            <Layers size={14} /> Services Directory ({services.length})
          </button>
          <button
            type="button"
            className={activeTab === 'artworks' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('artworks')}
          >
            <Palette size={14} /> Cover Artworks ({artworkCatalog.length})
          </button>
          <button
            type="button"
            className={activeTab === 'audio' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('audio')}
          >
            <Volume2 size={14} /> Audio Engineering ({audioCatalog.length})
          </button>
          <button
            type="button"
            className={activeTab === 'team' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('team')}
          >
            <Users size={14} /> Team &amp; Leadership ({teamMembers.length})
          </button>
          <button
            type="button"
            className={activeTab === 'testimonials' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('testimonials')}
          >
            <MessageSquare size={14} /> Testimonials ({testimonials.length})
          </button>
          <button
            type="button"
            className={activeTab === 'add-item' ? 'admin-nav-tab add-btn active' : 'admin-nav-tab add-btn'}
            onClick={() => setActiveTab('add-item')}
          >
            <PlusCircle size={14} /> Add New Entry Generator
          </button>
        </div>

        {/* Tab 1: Services Directory */}
        {activeTab === 'services' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Services Directory ({services.length} Live Services)</h2>
                <p>All services are mapped to dedicated static pages with benefits, deliverables, and sample showcases.</p>
              </div>
              <Link href="/services" target="_blank" className="button button-outline">
                View Live Directory <ExternalLink size={13} style={{ marginLeft: '6px' }} />
              </Link>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Service Name</th>
                    <th>Discipline</th>
                    <th>Sample Type</th>
                    <th>URL Route</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, idx) => (
                    <tr key={s.slug}>
                      <td><strong>{String(idx + 1).padStart(2, '0')}</strong></td>
                      <td><b>{s.name}</b></td>
                      <td><span className="table-badge">Discipline {s.categoryNumber}</span></td>
                      <td><span className="sample-type-pill">{s.sampleType}</span></td>
                      <td><code>/services/{s.slug}</code></td>
                      <td>
                        <Link href={`/services/${s.slug}`} target="_blank" className="table-action-link">
                          View Page ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Cover Artworks */}
        {activeTab === 'artworks' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>19 Preserved Cover Artworks</h2>
                <p>Original creative artwork catalog. Managed in <code>data/portfolio.ts</code>.</p>
              </div>
              <Link href="/visuals#cover-artwork" target="_blank" className="button button-outline">
                View in Review My Works ↗
              </Link>
            </div>

            <div className="admin-cards-grid">
              {artworkCatalog.map((art, idx) => (
                <div className="admin-art-card" key={art.id}>
                  <span className="art-idx">0{idx + 1}</span>
                  <h3>{art.title}</h3>
                  <p>Artist: <strong>{art.artist}</strong></p>
                  <span className="style-tag">{art.style}</span>
                  <div className="art-concept-preview">
                    <small>CONCEPT:</small>
                    <p>{art.concept}</p>
                  </div>
                  <div className="art-file-info">
                    <small>FILE PATH:</small>
                    <code>/public/artwork/{art.image}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audio Engineering */}
        {activeTab === 'audio' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>6 Studio Audio Samples (Mastering &amp; Mixing)</h2>
                <p>High-resolution audio tracks with A/B before/after comparison notes.</p>
              </div>
              <Link href="/visuals#mastering" target="_blank" className="button button-outline">
                Listen on Live Console ↗
              </Link>
            </div>

            <div className="admin-cards-grid">
              {audioCatalog.map((t) => (
                <div className="admin-audio-card" key={t.id}>
                  <span className="audio-type-badge">{t.type.toUpperCase()}</span>
                  <h3>{t.title}</h3>
                  <p>Artist / Session: <strong>{t.artist || 'MainahtunesTeam Studio Session'}</strong></p>
                  <div className="audio-lufs-badge">
                    <span>Loudness: <b>{t.lufs}</b></span>
                    <span>Format: <b>{t.format}</b></span>
                  </div>
                  <div className="audio-notes-compare">
                    <div className="mini-note">
                      <small>RAW MIX:</small>
                      <p>{t.beforeNotes}</p>
                    </div>
                    <div className="mini-note orange">
                      <small>MASTERED:</small>
                      <p>{t.afterNotes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Team & Leadership */}
        {activeTab === 'team' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Executive Leadership &amp; Operational Roster</h2>
                <p>Managed in <code>data/team.ts</code>. Includes Afolabi Ayodeji (Financial Manager).</p>
              </div>
              <Link href="/team" target="_blank" className="button button-outline">
                View Live Team Page ↗
              </Link>
            </div>

            <div className="admin-team-list">
              {teamMembers.map((m) => (
                <div className="admin-team-row" key={m.id}>
                  <div className="team-avatar-box">
                    <img src={m.image} alt={m.name} />
                  </div>
                  <div className="team-details">
                    <span className="role-tag">{m.role}</span>
                    <h3>{m.name}</h3>
                    <p className="team-dept">{m.department}</p>
                    <p className="team-bio-text">{m.bio}</p>
                    <div className="team-creds">
                      {m.credentials.map((c) => (
                        <span key={c}><CheckCircle2 size={13} /> {c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Verified Client Testimonials &amp; Outcomes</h2>
                <p>Authentic feedback from recording artists, producers, and label founders.</p>
              </div>
              <Link href="/#testimonials" target="_blank" className="button button-outline">
                View on Homepage ↗
              </Link>
            </div>

            <div className="admin-testimonials-grid">
              {testimonials.map((t) => (
                <div className="admin-test-card" key={t.id}>
                  <span className="client-service">{t.serviceEngaged}</span>
                  <h3>{t.clientName}</h3>
                  <p className="client-loc">{t.role} · {t.location}</p>
                  <p className="client-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="client-res">
                    <small>VERIFIED OUTCOME:</small>
                    <strong>{t.verifiedOutcome}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: New Entry Generator */}
        {activeTab === 'add-item' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>New Item Code Generator</h2>
                <p>Quickly format new artwork, team members, or testimonials without worrying about syntax.</p>
              </div>
            </div>

            <div className="generator-grid">
              <form className="generator-form" onSubmit={handleGenerateCode}>
                <div className="gen-type-selector">
                  <button
                    type="button"
                    className={generatorType === 'artwork' ? 'gen-type active' : 'gen-type'}
                    onClick={() => setGeneratorType('artwork')}
                  >
                    New Cover Artwork
                  </button>
                  <button
                    type="button"
                    className={generatorType === 'team' ? 'gen-type active' : 'gen-type'}
                    onClick={() => setGeneratorType('team')}
                  >
                    New Team Member
                  </button>
                  <button
                    type="button"
                    className={generatorType === 'testimonial' ? 'gen-type active' : 'gen-type'}
                    onClick={() => setGeneratorType('testimonial')}
                  >
                    New Client Testimonial
                  </button>
                </div>

                {generatorType === 'artwork' && (
                  <div className="gen-inputs">
                    <label>
                      Artwork Title
                      <input
                        required
                        value={genArtwork.title}
                        onChange={(e) => setGenArtwork({ ...genArtwork, title: e.target.value })}
                        placeholder="e.g. Neon Horizon"
                      />
                    </label>
                    <label>
                      Artist Name
                      <input
                        required
                        value={genArtwork.artist}
                        onChange={(e) => setGenArtwork({ ...genArtwork, artist: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                      />
                    </label>
                    <label>
                      Design Style / Genre
                      <input
                        required
                        value={genArtwork.style}
                        onChange={(e) => setGenArtwork({ ...genArtwork, style: e.target.value })}
                        placeholder="e.g. Synthwave / 3D Retro"
                      />
                    </label>
                    <label>
                      Creative Concept
                      <textarea
                        rows={3}
                        required
                        value={genArtwork.concept}
                        onChange={(e) => setGenArtwork({ ...genArtwork, concept: e.target.value })}
                        placeholder="Describe the mood, lighting, color palette, and visual direction..."
                      />
                    </label>
                  </div>
                )}

                {generatorType === 'team' && (
                  <div className="gen-inputs">
                    <label>
                      Full Name
                      <input
                        required
                        value={genTeam.name}
                        onChange={(e) => setGenTeam({ ...genTeam, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                      />
                    </label>
                    <label>
                      Role / Position
                      <input
                        required
                        value={genTeam.role}
                        onChange={(e) => setGenTeam({ ...genTeam, role: e.target.value })}
                        placeholder="e.g. Lead Mixing Engineer"
                      />
                    </label>
                    <label>
                      Department
                      <input
                        required
                        value={genTeam.department}
                        onChange={(e) => setGenTeam({ ...genTeam, department: e.target.value })}
                        placeholder="e.g. Audio Engineering &amp; Acoustics"
                      />
                    </label>
                    <label>
                      Biography
                      <textarea
                        rows={4}
                        required
                        value={genTeam.bio}
                        onChange={(e) => setGenTeam({ ...genTeam, bio: e.target.value })}
                        placeholder="Explain career background, specialized gear, and client support focus..."
                      />
                    </label>
                  </div>
                )}

                {generatorType === 'testimonial' && (
                  <div className="gen-inputs">
                    <label>
                      Client / Artist Name
                      <input
                        required
                        value={genTestimonial.clientName}
                        onChange={(e) => setGenTestimonial({ ...genTestimonial, clientName: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                      />
                    </label>
                    <label>
                      Role &amp; Location
                      <input
                        required
                        value={genTestimonial.role}
                        onChange={(e) => setGenTestimonial({ ...genTestimonial, role: e.target.value })}
                        placeholder="e.g. Recording Artist · Chicago, USA"
                      />
                    </label>
                    <label>
                      Service Engaged
                      <input
                        required
                        value={genTestimonial.serviceEngaged}
                        onChange={(e) => setGenTestimonial({ ...genTestimonial, serviceEngaged: e.target.value })}
                        placeholder="e.g. Track Mastering &amp; Spotify Promotion"
                      />
                    </label>
                    <label>
                      Quote
                      <textarea
                        rows={3}
                        required
                        value={genTestimonial.quote}
                        onChange={(e) => setGenTestimonial({ ...genTestimonial, quote: e.target.value })}
                        placeholder="Client review text..."
                      />
                    </label>
                    <label>
                      Verified Outcome
                      <input
                        required
                        value={genTestimonial.verifiedOutcome}
                        onChange={(e) => setGenTestimonial({ ...genTestimonial, verifiedOutcome: e.target.value })}
                        placeholder="e.g. 50K+ first week streams on Spotify"
                      />
                    </label>
                  </div>
                )}

                <button type="submit" className="button button-orange">
                  Generate Structured Code ↗
                </button>
              </form>

              {/* Output Box */}
              <div className="generator-output">
                <div className="output-topbar">
                  <div className="output-label">
                    <FileCode2 size={15} />
                    <span>Formatted Snippet for {generatorType === 'artwork' ? 'data/portfolio.ts' : generatorType === 'team' ? 'data/team.ts' : 'data/testimonials.ts'}</span>
                  </div>
                  {generatedJson && (
                    <button
                      type="button"
                      className="copy-code-btn"
                      onClick={() => copyToClipboard(generatedJson, 'gen-code')}
                    >
                      {copiedId === 'gen-code' ? (
                        <>
                          <Check size={13} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copy Code
                        </>
                      )}
                    </button>
                  )}
                </div>

                <pre className="code-pre">
                  {generatedJson || '// Fill out the form on the left and click "Generate Structured Code"\n// The snippet ready to paste into your data file will appear here.'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
