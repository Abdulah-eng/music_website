'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Play,
  Pause,
  Volume2,
  ExternalLink,
  Laptop,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import type { Service } from '@/data/services';

interface Props {
  service: Service;
}

export default function ServiceSampleShowcase({ service }: Props) {
  // Audio A/B state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAfter, setIsAfter] = useState(true);

  return (
    <section className="section service-sample-section" id="samples">
      <div className="section-heading">
        <div>
          <div className="eyebrow">PORTFOLIO PROOF &amp; DEMONSTRATION</div>
          <h2>
            What we deliver for <em>{service.name}</em>
          </h2>
        </div>
        <p>
          We do not just list capabilities. Explore authentic examples, workflows, or clearly labeled agency demonstrations representing our execution standard.
        </p>
      </div>

      <div className="sample-container">
        {/* =========================================================================
            1. AUDIO SAMPLES (Mixing, Mastering, Vocal Tuning, Audio Restoration)
           ========================================================================= */}
        {service.sampleType === 'audio' && (
          <div className="sample-card audio-sample-card">
            <div className="sample-card-header">
              <span className="sample-badge">
                <Sparkles size={12} /> VERIFIED AUDIO SAMPLE · {isAfter ? 'FINAL RELEASE MASTER' : 'RAW UNPROCESSED MIX'}
              </span>
              <div className="audio-ab-toggle">
                <button
                  type="button"
                  className={!isAfter ? 'ab-btn active' : 'ab-btn'}
                  onClick={() => setIsAfter(false)}
                >
                  Before (Raw)
                </button>
                <button
                  type="button"
                  className={isAfter ? 'ab-btn active' : 'ab-btn'}
                  onClick={() => setIsAfter(true)}
                >
                  After (Mainah Sound)
                </button>
              </div>
            </div>

            <div className="sample-card-body audio-body">
              <div className="audio-meta">
                <h3>{service.sampleTitle}</h3>
                <p>{service.sampleDesc}</p>
                <div className="audio-specs">
                  <span><b>FORMAT:</b> 24-bit / 48kHz WAV</span>
                  <span><b>LUFS:</b> {isAfter ? '-9.2 LUFS (Commercial)' : '-16.8 LUFS (Unmastered)'}</span>
                  <span><b>PROCESSING:</b> Analogue Outboard + Precision EQ</span>
                </div>
              </div>

              {/* Player UI */}
              <div className="custom-player-bar">
                <button
                  type="button"
                  className="player-play-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio sample'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '3px' }} />}
                </button>
                <div className="player-waveform">
                  {Array.from({ length: 48 }, (_, i) => {
                    const heightPercent = isAfter
                      ? 20 + ((i * 7) % 80)
                      : 10 + ((i * 3) % 40);
                    return (
                      <span
                        key={i}
                        className={isPlaying ? 'bar active' : 'bar'}
                        style={{ height: `${heightPercent}%`, animationDelay: `${(i % 10) * 0.08}s` }}
                      />
                    );
                  })}
                </div>
                <div className="player-time">
                  <span>{isPlaying ? '01:42' : '00:00'}</span> / <span>03:26</span>
                </div>
              </div>

              <div className="audio-note-box">
                <small>ENGINEER NOTES</small>
                <p>
                  {isAfter
                    ? 'Tight low-end harmonic saturation applied. Vocal pocketed into stereo field with 3D space, de-essed, and peak-limited with 0.1dB true peak ceiling.'
                    : 'Unprocessed stems before spectral cleaning and stereo enhancement. Dynamics are uneven and lack presence.'}
                </p>
              </div>
            </div>

            <div className="sample-card-footer">
              <Link href="/visuals#mastering" className="button button-outline">
                Listen to All 6 Original Studio Audio Samples <span>↗</span>
              </Link>
              <Link
                href={`/contact?service=${encodeURIComponent(service.name)}`}
                className="button button-orange"
              >
                Request Similar Audio Work <span>↗</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. VIDEO SAMPLES (AI Video, Cinematic Video, Lyric Video, Animation)
           ========================================================================= */}
        {service.sampleType === 'video' && (
          <div className="sample-card video-sample-card">
            <div className="sample-card-header">
              <span className="sample-badge">
                <Sparkles size={12} /> ORIGINAL VIDEO PRODUCTION WORK
              </span>
              <span className="format-tag">4K UHD · 24FPS CINEMATIC</span>
            </div>

            <div className="video-sample-frame">
              <div className="video-preview-overlay">
                <div className="video-badge-pill">MAINAHTUNESTEAM VISUAL LAB</div>
                <h3>{service.sampleTitle}</h3>
                <p>{service.sampleDesc}</p>
                <Link href="/visuals#ai-music-video" className="button button-orange">
                  <Play size={16} style={{ marginRight: '8px' }} /> Watch Playable Video in Review My Works
                </Link>
              </div>
            </div>

            <div className="sample-card-footer">
              <Link href="/visuals#ai-music-video" className="button button-outline">
                Explore Full Video Catalog in Review My Works <span>↗</span>
              </Link>
              <Link
                href={`/contact?service=${encodeURIComponent(service.name)}`}
                className="button button-orange"
              >
                Request Similar Video Project <span>↗</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. ARTWORK SAMPLES (Album Artwork, Posters, Flyers)
           ========================================================================= */}
        {service.sampleType === 'artwork' && (
          <div className="sample-card artwork-sample-card">
            <div className="sample-card-header">
              <span className="sample-badge">
                <Sparkles size={12} /> APPROVED ORIGINAL COVER ARTWORK
              </span>
              <span className="format-tag">3000 x 3000 PX · 300 DPI</span>
            </div>

            <div className="sample-card-body artwork-body">
              <div className="artwork-preview-side">
                <div className="artwork-frame">
                  <div className="artwork-placeholder-art">
                    <span className="art-title">{service.sampleTitle}</span>
                    <span className="art-sub">MAINAHTUNESTEAM RELEASE SERIES</span>
                  </div>
                </div>
              </div>

              <div className="artwork-info-side">
                <span className="eyebrow">FEATURED VISUAL CASE STUDY</span>
                <h3>{service.sampleTitle}</h3>
                <p className="lead-desc">{service.sampleDesc}</p>

                <div className="artwork-specs-list">
                  <div>
                    <small>RESOLUTION</small>
                    <span>3000 × 3000 px (DSPs) &amp; 12&quot; Vinyl Print</span>
                  </div>
                  <div>
                    <small>COLOR PROFILE</small>
                    <span>sRGB (Digital) &amp; CMYK / FOGRA39 (Print)</span>
                  </div>
                  <div>
                    <small>DELIVERABLES</small>
                    <span>Front Cover, Tracklist Back, Social Stories</span>
                  </div>
                </div>

                <div className="artwork-actions">
                  <Link href="/visuals#cover-artwork" className="button button-outline">
                    Browse All 19 Original Cover Designs <span>↗</span>
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}`}
                    className="button button-orange"
                  >
                    Request Similar Artwork <span>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            4. WEBSITE DEVELOPMENT SAMPLES (Artist Sites, E-commerce, Portals)
           ========================================================================= */}
        {service.sampleType === 'website' && (
          <div className="sample-card web-sample-card">
            <div className="sample-card-header">
              <span className="sample-badge">
                <Laptop size={14} /> LIVE DEMONSTRATION PROJECT · MAINAHTUNESTEAM DIGITAL LAB
              </span>
              <div className="device-pills">
                <span className="pill active"><Laptop size={12} /> Desktop</span>
                <span className="pill"><Smartphone size={12} /> Mobile</span>
              </div>
            </div>

            {/* Simulated Desktop Browser Frame */}
            <div className="browser-mockup">
              <div className="browser-topbar">
                <div className="browser-dots">
                  <i /><i /><i />
                </div>
                <div className="browser-url">
                  https://demo.mainahtunesteam.com/{service.slug}
                </div>
                <div className="browser-actions">
                  <ExternalLink size={14} />
                </div>
              </div>

              <div className="browser-viewport">
                <div className="mockup-hero">
                  <div className="mockup-tag">OFFICIAL AGENCY DEMO</div>
                  <h2>{service.sampleTitle}</h2>
                  <p>{service.sampleDesc}</p>
                  <div className="mockup-features-grid">
                    <div className="feat-chip"><CheckCircle2 size={13} /> Continuous Audio Streamer</div>
                    <div className="feat-chip"><CheckCircle2 size={13} /> Merch Store &amp; Stripe Cart</div>
                    <div className="feat-chip"><CheckCircle2 size={13} /> Tour Dates (Bandsintown)</div>
                    <div className="feat-chip"><CheckCircle2 size={13} /> 99/100 Core Web Vitals</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="web-specs-bar">
              <div>
                <small>TECH STACK</small>
                <strong>Next.js 14 · React · TypeScript · CSS Grid</strong>
              </div>
              <div>
                <small>PERFORMANCE</small>
                <strong>0.4s First Contentful Paint · 100% Mobile Responsive</strong>
              </div>
              <div>
                <small>INTEGRATIONS</small>
                <strong>Spotify Web API · Stripe Checkout · Mailchimp</strong>
              </div>
            </div>

            <div className="sample-card-footer">
              <Link href="/services" className="button button-outline">
                View All 11 Digital &amp; Web Services <span>↗</span>
              </Link>
              <Link
                href={`/contact?service=${encodeURIComponent(service.name)}`}
                className="button button-orange"
              >
                Request Similar Website <span>↗</span>
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. CASE STUDY SAMPLES (Promotion, Distribution, Knowledge Panel, Audits)
           ========================================================================= */}
        {(service.sampleType === 'case-study' || service.sampleType === 'branding') && (
          <div className="sample-card case-study-card">
            <div className="sample-card-header">
              <span className="sample-badge">
                <TrendingUp size={14} /> VERIFIED STRATEGY &amp; CAMPAIGN BLUEPRINT
              </span>
              <span className="format-tag">CONFIDENTIAL CLIENT SPECIFICATION</span>
            </div>

            <div className="sample-card-body case-body">
              <div className="case-overview-header">
                <h3>{service.sampleTitle}</h3>
                <p>{service.sampleDesc}</p>
              </div>

              <div className="case-metrics-grid">
                <div className="metric-box">
                  <span className="metric-num">100%</span>
                  <span className="metric-label">Organic Verification</span>
                  <small>Zero artificial bots or fake play farms</small>
                </div>
                <div className="metric-box">
                  <span className="metric-num">150+</span>
                  <span className="metric-label">Global DSP Footprint</span>
                  <small>DSPs, radio networks, and tastemakers</small>
                </div>
                <div className="metric-box">
                  <span className="metric-num">3–5x</span>
                  <span className="metric-label">Average Listener Retention</span>
                  <small>Driven by high-intent audience targeting</small>
                </div>
              </div>

              <div className="case-workflow-box">
                <h4>CAMPAIGN DELIVERABLE ARCHITECTURE</h4>
                <div className="workflow-steps">
                  <div>
                    <b>PHASE 01</b>
                    <span>Asset &amp; Metadata Audit</span>
                  </div>
                  <ArrowRight size={16} className="wf-arrow" />
                  <div>
                    <b>PHASE 02</b>
                    <span>Curator &amp; Channel Outreach</span>
                  </div>
                  <ArrowRight size={16} className="wf-arrow" />
                  <div>
                    <b>PHASE 03</b>
                    <span>Algorithmic Optimization</span>
                  </div>
                  <ArrowRight size={16} className="wf-arrow" />
                  <div>
                    <b>PHASE 04</b>
                    <span>Post-Campaign Reporting</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sample-card-footer">
              <Link href="/artist-growth" className="button button-outline">
                View 7-Stage Career Development Blueprint <span>↗</span>
              </Link>
              <Link
                href={`/contact?service=${encodeURIComponent(service.name)}`}
                className="button button-orange"
              >
                Request Similar Campaign <span>↗</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
