'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Sliders,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Disc3,
} from 'lucide-react';
import type { AudioTrackProject } from '@/data/portfolio';

interface Props {
  tracks: AudioTrackProject[];
  initialType?: 'all' | 'mastering' | 'mixing';
}

export default function AudioPlayerCatalog({ tracks, initialType = 'all' }: Props) {
  const [filterType, setFilterType] = useState<'all' | 'mastering' | 'mixing'>(initialType);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAfter, setIsAfter] = useState(true);

  const filteredTracks = tracks.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const activeTrack = filteredTracks[activeTrackIndex] || filteredTracks[0];

  return (
    <div className="audio-catalog-wrapper">
      {/* Category Tabs */}
      <div className="audio-tab-bar">
        <button
          type="button"
          className={filterType === 'all' ? 'audio-tab active' : 'audio-tab'}
          onClick={() => {
            setFilterType('all');
            setActiveTrackIndex(0);
            setIsPlaying(false);
          }}
        >
          All 6 Studio Samples
        </button>
        <button
          type="button"
          className={filterType === 'mastering' ? 'audio-tab active' : 'audio-tab'}
          onClick={() => {
            setFilterType('mastering');
            setActiveTrackIndex(0);
            setIsPlaying(false);
          }}
        >
          Track Mastering (3)
        </button>
        <button
          type="button"
          className={filterType === 'mixing' ? 'audio-tab active' : 'audio-tab'}
          onClick={() => {
            setFilterType('mixing');
            setActiveTrackIndex(0);
            setIsPlaying(false);
          }}
        >
          Music Mixing (3)
        </button>
      </div>

      <div className="audio-console-grid">
        {/* Playlist Tracklist Column */}
        <div className="audio-tracklist-col">
          <div className="tracklist-header">
            <Disc3 size={16} className="disc-icon" />
            <span>STUDIO SESSION TRACKLIST ({filteredTracks.length})</span>
          </div>

          <div className="tracklist-items">
            {filteredTracks.map((track, idx) => {
              const isSelected = activeTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={isSelected ? 'track-item active' : 'track-item'}
                  onClick={() => {
                    setActiveTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <span className="track-number">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="track-info">
                    <h4>{track.title}</h4>
                    <p>{track.artist || 'MainahtunesTeam Studio Session'}</p>
                  </div>
                  <span className="track-type-pill">{track.type}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Control & A/B Engine Column */}
        {activeTrack && (
          <div className="audio-console-col">
            <div className="console-topline">
              <span className="console-badge">
                <Sparkles size={13} /> {activeTrack.type.toUpperCase()} CONSOLE
              </span>
              <div className="audio-ab-toggle">
                <button
                  type="button"
                  className={!isAfter ? 'ab-btn active' : 'ab-btn'}
                  onClick={() => setIsAfter(false)}
                >
                  Before (Raw Mix)
                </button>
                <button
                  type="button"
                  className={isAfter ? 'ab-btn active' : 'ab-btn'}
                  onClick={() => setIsAfter(true)}
                >
                  After (Mastered)
                </button>
              </div>
            </div>

            <div className="console-meta">
              <h2>{activeTrack.title}</h2>
              <p className="console-artist">
                {activeTrack.artist ? `Artist: ${activeTrack.artist}` : 'MainahtunesTeam Production Master'}
              </p>
              <p className="console-desc">{activeTrack.description}</p>
            </div>

            {/* Custom Visual Player */}
            <div className="custom-player-bar">
              <button
                type="button"
                className="player-play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause sample' : 'Play sample'}
              >
                {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '4px' }} />}
              </button>

              <div className="player-waveform">
                {Array.from({ length: 42 }, (_, i) => {
                  const baseHeight = isAfter
                    ? 25 + ((i * 11) % 75)
                    : 15 + ((i * 5) % 35);
                  return (
                    <span
                      key={i}
                      className={isPlaying ? 'bar active' : 'bar'}
                      style={{
                        height: `${baseHeight}%`,
                        animationDelay: `${(i % 8) * 0.09}s`,
                      }}
                    />
                  );
                })}
              </div>

              <div className="player-time">
                <span>{isPlaying ? '01:28' : '00:00'}</span> / <span>03:45</span>
              </div>
            </div>

            {/* Real-time Engineering Comparison Notes */}
            <div className="comparison-notes-grid">
              <div className="note-card before-note">
                <small>BEFORE (SOURCE RECORDING)</small>
                <p>{activeTrack.beforeNotes}</p>
              </div>
              <div className="note-card after-note">
                <small>AFTER (MAINAHTUNESTEAM POLISH)</small>
                <p>{activeTrack.afterNotes}</p>
              </div>
            </div>

            <div className="console-specs-row">
              <div>
                <small>FORMAT</small>
                <span>{activeTrack.format}</span>
              </div>
              <div>
                <small>LOUDNESS</small>
                <span>{isAfter ? activeTrack.lufs : '-16.5 LUFS'}</span>
              </div>
              <div>
                <small>OUTBOARD GEAR</small>
                <span>Analogue EQ · Tube Compression · Linear Peak</span>
              </div>
            </div>

            <div className="console-actions">
              <Link
                href={`/contact?service=${encodeURIComponent(
                  activeTrack.type === 'mastering' ? 'Track Mastering' : 'Music Mixing'
                )}&project=${encodeURIComponent(activeTrack.title)}`}
                className="button button-orange"
              >
                Request Similar {activeTrack.type === 'mastering' ? 'Mastering' : 'Mixing'} <span>↗</span>
              </Link>
              <Link
                href={`/services/${activeTrack.type === 'mastering' ? 'track-mastering' : 'music-mixing'}`}
                className="button button-outline"
              >
                View Service Specifications
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
