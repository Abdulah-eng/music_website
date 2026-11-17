'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  Sparkles,
  Play,
  Volume2,
  Laptop,
  TrendingUp,
  Palette,
  Film,
  ArrowUpRight,
} from 'lucide-react';
import {
  artworkCatalog,
  videoCatalog,
  audioCatalog,
  webProjectsCatalog,
  promotionCaseStudies,
} from '@/data/portfolio';
import ArtworkLightboxModal from '@/components/ArtworkLightboxModal';
import AudioPlayerCatalog from '@/components/AudioPlayerCatalog';
import WebDevShowcase from '@/components/WebDevShowcase';
import PromotionCaseStudyCard from '@/components/PromotionCaseStudyCard';

export default function ReviewMyWorksPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ARTWORK' | 'AUDIO' | 'VIDEO' | 'WEBSITES' | 'CAMPAIGNS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter artworks by search
  const filteredArtworks = useMemo(() => {
    if (!searchQuery.trim()) return artworkCatalog;
    const q = searchQuery.toLowerCase();
    return artworkCatalog.filter(
      (a) => a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q) || a.style.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter audio by search
  const filteredAudio = useMemo(() => {
    if (!searchQuery.trim()) return audioCatalog;
    const q = searchQuery.toLowerCase();
    return audioCatalog.filter(
      (a) => a.title.toLowerCase().includes(q) || (a.artist && a.artist.toLowerCase().includes(q)) || a.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter web by search
  const filteredWeb = useMemo(() => {
    if (!searchQuery.trim()) return webProjectsCatalog;
    const q = searchQuery.toLowerCase();
    return webProjectsCatalog.filter(
      (w) => w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q) || w.clientType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter campaigns by search
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return promotionCaseStudies;
    const q = searchQuery.toLowerCase();
    return promotionCaseStudies.filter(
      (c) => c.title.toLowerCase().includes(q) || c.artistName.toLowerCase().includes(q) || c.genre.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <main className="review-page">
      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="page-hero review-hero">
        <div className="eyebrow">THE MAINAHTUNESTEAM CREATIVE PORTFOLIO</div>
        <h1>
          Hear the sound.<br />
          <em>See the vision. Verify results.</em>
        </h1>
        <p>
          A comprehensive showcase of authentic client work, master audio recordings, original AI music videos,
          responsive web platforms, and data-backed music promotion campaigns.
        </p>

        <div className="review-stats">
          <span><b>19</b> COVER ARTWORKS</span>
          <span><b>06</b> AUDIO SAMPLES</span>
          <span><b>02</b> AI MUSIC VIDEOS</span>
          <span><b>08</b> WEB PLATFORMS</span>
          <span><b>04</b> CAMPAIGN CASE STUDIES</span>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE SEARCH & CATEGORY FILTER BAR
         ========================================================================= */}
      <section className="section portfolio-controls-section">
        <div className="portfolio-filter-bar">
          <div className="search-bar-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist, project title, genre, or keyword..."
              className="services-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className="portfolio-tab-pills">
            <button
              type="button"
              className={activeTab === 'ALL' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('ALL')}
            >
              All Works (39)
            </button>
            <button
              type="button"
              className={activeTab === 'ARTWORK' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('ARTWORK')}
            >
              <Palette size={13} /> Cover Artwork (19)
            </button>
            <button
              type="button"
              className={activeTab === 'AUDIO' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('AUDIO')}
            >
              <Volume2 size={13} /> Audio Mastering &amp; Mixing (6)
            </button>
            <button
              type="button"
              className={activeTab === 'VIDEO' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('VIDEO')}
            >
              <Film size={13} /> AI Music Videos (2)
            </button>
            <button
              type="button"
              className={activeTab === 'WEBSITES' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('WEBSITES')}
            >
              <Laptop size={13} /> Web Development (8)
            </button>
            <button
              type="button"
              className={activeTab === 'CAMPAIGNS' ? 'cat-pill active' : 'cat-pill'}
              onClick={() => setActiveTab('CAMPAIGNS')}
            >
              <TrendingUp size={13} /> Promotion Case Studies (4)
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: ALBUM & SINGLE COVER ARTWORK (19 PRESERVED ARTWORKS)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'ARTWORK') && (
        <section className="section artwork-section" id="cover-artwork">
          <div className="section-heading">
            <div>
              <div className="eyebrow">VISUAL IDENTITY &amp; ART DIRECTION</div>
              <h2>
                Album &amp; Single <em>Cover Artwork</em>
              </h2>
              <p>
                A curated gallery of 19 original cover designs spanning R&amp;B, Blues, Hip-Hop, Indie Romance, and 3D Character Art. Click any artwork to preview in full resolution.
              </p>
            </div>
            <span className="audio-count">{filteredArtworks.length} ARTWORKS</span>
          </div>

          <ArtworkLightboxModal artworks={filteredArtworks} />
        </section>
      )}

      {/* =========================================================================
          SECTION 2: AUDIO SAMPLES (3 MASTERING, 3 MIXING WITH A/B COMPARE)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'AUDIO') && (
        <section className="section audio-section" id="mastering">
          <div className="section-heading">
            <div>
              <div className="eyebrow">AUDIO ENGINEERING &amp; POST-PRODUCTION</div>
              <h2>
                Music Mixing &amp; <em>Track Mastering</em>
              </h2>
              <p>
                Experience our 6 preserved studio audio samples. Use the interactive A/B comparison toggle to hear the difference between raw mixdowns and release-ready masters.
              </p>
            </div>
            <span className="audio-count">{filteredAudio.length} AUDIO TRACKS</span>
          </div>

          <AudioPlayerCatalog tracks={filteredAudio} />
        </section>
      )}

      {/* =========================================================================
          SECTION 3: AI MUSIC VIDEOS (2 PRESERVED SAMPLES)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'VIDEO') && (
        <section className="section ai-video-section" id="ai-music-video">
          <div className="section-heading">
            <div>
              <div className="eyebrow">MOTION &amp; GENERATIVE CINEMATOGRAPHY</div>
              <h2>
                AI-Assisted <em>Music Videos</em>
              </h2>
              <p>
                Watch the two original AI music video samples in their uncompressed, original form. Directed with surreal character design, rhythmic pacing, and cinematic color grades.
              </p>
            </div>
            <span className="audio-count">{videoCatalog.length} VIDEO SAMPLES</span>
          </div>

          <div className="video-catalog-grid">
            {videoCatalog.map((video) => (
              <article className="ai-video-card" key={video.id}>
                <div className="ai-video-frame">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    aria-label={video.title}
                  >
                    <source src={video.videoSrc} type="video/mp4" />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
                <div className="ai-video-meta">
                  <div>
                    <span className="eyebrow">{video.type.toUpperCase()}</span>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                  <div className="video-card-actions">
                    <Link
                      href={`/services/${video.relatedServiceSlug}`}
                      className="text-link"
                    >
                      Explore Service Details ↗
                    </Link>
                    <Link
                      href={`/contact?service=AI-Assisted%20Music%20Video%20Production&project=${encodeURIComponent(
                        video.title
                      )}`}
                      className="button button-orange"
                    >
                      Request Similar Video ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: WEBSITE DEVELOPMENT PORTFOLIO (8 PROJECTS)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'WEBSITES') && (
        <section className="section web-portfolio-section" id="websites">
          <div className="section-heading">
            <div>
              <div className="eyebrow">DIGITAL &amp; WEB ENGINEERING</div>
              <h2>
                Website Development <em>Portfolio</em>
              </h2>
              <p>
                Explore 8 custom web projects engineered for artists, labels, and creative brands. Switch between desktop and mobile previews, explore features, and inspect tech stacks.
              </p>
            </div>
            <span className="audio-count">{filteredWeb.length} WEB PROJECTS</span>
          </div>

          <WebDevShowcase projects={filteredWeb} />
        </section>
      )}

      {/* =========================================================================
          SECTION 5: MUSIC PROMOTION CASE STUDIES (4 VERIFIED CAMPAIGNS)
         ========================================================================= */}
      {(activeTab === 'ALL' || activeTab === 'CAMPAIGNS') && (
        <section className="section promo-case-section" id="case-studies">
          <div className="section-heading">
            <div>
              <div className="eyebrow">AUDIENCE GROWTH &amp; CAMPAIGN BLUEPRINTS</div>
              <h2>
                Music Promotion <em>Case Studies</em>
              </h2>
              <p>
                Verified campaign breakdowns detailing objectives, platform channels, strategy timelines, and organic streaming outcomes. Zero bot farms or fabricated numbers.
              </p>
            </div>
            <span className="audio-count">{filteredCampaigns.length} CAMPAIGN STUDIES</span>
          </div>

          <PromotionCaseStudyCard caseStudies={filteredCampaigns} />
        </section>
      )}

      {/* =========================================================================
          BOTTOM CTA
         ========================================================================= */}
      <section className="review-cta">
        <div className="eyebrow">READY TO MAKE YOUR NEXT MOVE?</div>
        <h2>
          Let’s make your next release <em>impossible to ignore.</em>
        </h2>
        <p>
          Whether you need single cover artwork, world-class mastering, a viral video, or a custom artist web platform,
          we provide custom quotations tailored to your exact creative vision.
        </p>
        <Link className="button button-orange" href="/contact">
          Start Your Project Enquiry ↗
        </Link>
      </section>
    </main>
  );
}
