'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ExternalLink, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ArtworkProject } from '@/data/portfolio';

interface Props {
  artworks: ArtworkProject[];
}

export default function ArtworkLightboxModal({ artworks }: Props) {
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkProject | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedArtwork(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedArtwork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtwork]);

  return (
    <>
      <div className="artwork-grid">
        {artworks.map((item, index) => (
          <article
            className="artwork-card"
            key={item.id}
            onClick={() => setSelectedArtwork(item)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${item.title} artwork preview`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedArtwork(item);
              }
            }}
          >
            <div className="artwork-image-container">
              <div className="artwork-image-fallback">
                <span className="art-thumb-title">{item.title}</span>
                <span className="art-thumb-artist">{item.artist}</span>
                <span className="art-thumb-tag">{item.style}</span>
              </div>
              <span className="artwork-view-tag">
                Preview Full Resolution ↗
              </span>
            </div>

            <div className="artwork-caption">
              <span className="eyebrow">
                {String(index + 1).padStart(2, '0')} / {item.style}
              </span>
              <h3>{item.title}</h3>
              <p>{item.artist}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Full-Screen Lightbox Modal */}
      {selectedArtwork && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedArtwork(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="lightbox-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedArtwork(null)}
              aria-label="Close artwork preview"
            >
              <X size={24} />
            </button>

            <div className="lightbox-grid">
              <div className="lightbox-art-display">
                <div className="lightbox-canvas-art">
                  <div className="canvas-gradient-overlay" />
                  <div className="canvas-content">
                    <span className="canvas-label">ORIGINAL APPROVED ARTWORK</span>
                    <h2>{selectedArtwork.title}</h2>
                    <p>{selectedArtwork.artist}</p>
                    <span className="canvas-specs">3000 × 3000 PX · 300 DPI · RGB MASTER</span>
                  </div>
                </div>
              </div>

              <div className="lightbox-details-panel">
                <div className="lightbox-details-header">
                  <span className="sample-badge">
                    <Sparkles size={13} /> {selectedArtwork.style}
                  </span>
                  <h2>{selectedArtwork.title}</h2>
                  <p className="artist-byline">Artist: <strong>{selectedArtwork.artist}</strong></p>
                </div>

                <div className="concept-box">
                  <small>CREATIVE CONCEPT &amp; ART DIRECTION</small>
                  <p>{selectedArtwork.concept}</p>
                </div>

                <div className="lightbox-specs-section">
                  <small>DELIVERABLES PROVIDED</small>
                  <ul>
                    {selectedArtwork.deliverables.map((d) => (
                      <li key={d}>
                        <CheckCircle2 size={14} /> <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lightbox-actions-bar">
                  <Link
                    href={`/contact?service=Album%20%26%20Single%20Cover%20Artwork&project=${encodeURIComponent(
                      selectedArtwork.title
                    )}`}
                    className="button button-orange lightbox-cta"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    Request Similar Cover Artwork <span>↗</span>
                  </Link>
                  <Link
                    href="/services/album-single-cover-artwork"
                    className="button button-outline"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    Explore Artwork Service Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
