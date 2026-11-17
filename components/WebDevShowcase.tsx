'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Laptop,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Layers,
  ArrowRight,
  Code2,
} from 'lucide-react';
import type { WebProject } from '@/data/portfolio';

interface Props {
  projects: WebProject[];
}

export default function WebDevShowcase({ projects }: Props) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <div className="web-portfolio-wrapper">
      {/* Project Selector Navigation */}
      <div className="web-project-pills">
        {projects.map((proj) => (
          <button
            key={proj.id}
            type="button"
            className={selectedProjectId === proj.id ? 'web-pill active' : 'web-pill'}
            onClick={() => setSelectedProjectId(proj.id)}
          >
            <span className="pill-cat">{proj.category}</span>
            <span className="pill-title">{proj.title}</span>
          </button>
        ))}
      </div>

      {activeProject && (
        <div className="web-display-card">
          <div className="web-display-header">
            <div>
              <span className="eyebrow">{activeProject.category.toUpperCase()}</span>
              <h2>{activeProject.title}</h2>
              <p className="client-type-label">Client Type: <strong>{activeProject.clientType}</strong></p>
            </div>

            <div className="device-toggle-bar">
              <button
                type="button"
                className={activeDevice === 'desktop' ? 'dev-btn active' : 'dev-btn'}
                onClick={() => setActiveDevice('desktop')}
                aria-label="Desktop preview"
              >
                <Laptop size={14} /> Desktop
              </button>
              <button
                type="button"
                className={activeDevice === 'mobile' ? 'dev-btn active' : 'dev-btn'}
                onClick={() => setActiveDevice('mobile')}
                aria-label="Mobile preview"
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          {/* Interactive Simulated Device Mockup */}
          <div className="device-frame-container">
            {activeDevice === 'desktop' ? (
              <div className="desktop-browser-frame">
                <div className="browser-topbar">
                  <div className="browser-dots">
                    <i /><i /><i />
                  </div>
                  <div className="browser-url">
                    https://{activeProject.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                  </div>
                  <div className="browser-actions">
                    <ExternalLink size={13} />
                  </div>
                </div>

                <div className="browser-canvas">
                  <div className="canvas-agency-header">
                    <span className="agency-brand-tag">MAINAHTUNESTEAM DIGITAL PRODUCTION</span>
                    <h3>{activeProject.title}</h3>
                    <p>{activeProject.overview}</p>
                    <div className="canvas-tech-row">
                      {activeProject.techStack.map((tech) => (
                        <span key={tech} className="tech-badge">
                          <Code2 size={12} /> {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mobile-phone-frame">
                <div className="phone-notch">
                  <div className="phone-speaker" />
                  <div className="phone-camera" />
                </div>
                <div className="phone-screen">
                  <div className="phone-content">
                    <span className="mobile-tag">MOBILE RESPONSIVE</span>
                    <h4>{activeProject.title}</h4>
                    <p>{activeProject.overview}</p>
                    <div className="mobile-features-compact">
                      {activeProject.features.slice(0, 3).map((f) => (
                        <div key={f} className="mobile-feat-row">
                          <CheckCircle2 size={12} /> <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="phone-home-indicator" />
              </div>
            )}
          </div>

          {/* Features and Details Grid */}
          <div className="web-details-grid">
            <div className="web-features-col">
              <h4>CORE FEATURES &amp; CAPABILITIES</h4>
              <div className="features-checklist">
                {activeProject.features.map((feature) => (
                  <div key={feature} className="feat-item">
                    <CheckCircle2 size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="web-tech-col">
              <h4>TECHNOLOGY &amp; ARCHITECTURE</h4>
              <div className="tech-pills-list">
                {activeProject.techStack.map((tech) => (
                  <span key={tech} className="stack-pill">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="performance-box">
                <small>PERFORMANCE BENCHMARK</small>
                <strong>100/100 Core Web Vitals · Edge Deployed · SSL Encrypted</strong>
              </div>
            </div>
          </div>

          <div className="web-card-footer">
            <Link
              href={`/services/${activeProject.relatedServiceSlug}`}
              className="button button-outline"
            >
              Explore {activeProject.category} Service <span>↗</span>
            </Link>
            <Link
              href={`/contact?service=${encodeURIComponent(
                activeProject.category
              )}&project=${encodeURIComponent(activeProject.title)}`}
              className="button button-orange"
            >
              Request Similar Website <span>↗</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
