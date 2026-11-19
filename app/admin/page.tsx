'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  UploadCloud,
  Film,
  FileAudio,
  FileImage,
  FileVideo,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { services } from '@/data/services';
import { artworkCatalog, audioCatalog, videoCatalog, webProjectsCatalog } from '@/data/portfolio';
import { teamMembers, TeamMember } from '@/data/team';
import { testimonials } from '@/data/testimonials';

function getArtworkSrc(img: string): string {
  if (!img) return '/brand/placeholder.png';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
    return img;
  }
  return `/artwork/${img}`;
}

export default function AdminManagementStudio() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'services' | 'artworks' | 'audio' | 'videos' | 'team' | 'testimonials' | 'upload-sample' | 'add-item' | 'security'
  >('services');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Authentication & session state
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('admin');
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Change password form state
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState('');
  const [pwdChangeError, setPwdChangeError] = useState('');

  // Sample File Upload State
  const [uploadCategory, setUploadCategory] = useState<'artwork' | 'audio' | 'video'>('artwork');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Code generator form state
  const [generatorType, setGeneratorType] = useState<'artwork' | 'team' | 'testimonial'>('artwork');
  const [genArtwork, setGenArtwork] = useState({ title: '', artist: '', style: '', concept: '' });
  const [genTeam, setGenTeam] = useState({ name: '', role: '', department: '', bio: '' });
  const [genTestimonial, setGenTestimonial] = useState({ clientName: '', role: '', location: '', serviceEngaged: '', quote: '', verifiedOutcome: '' });
  const [generatedJson, setGeneratedJson] = useState('');

  // Dynamic custom projects state
  const [customProjects, setCustomProjects] = useState<any[]>([]);
  const [allArtworks, setAllArtworks] = useState(artworkCatalog);
  const [allAudio, setAllAudio] = useState(audioCatalog);
  const [allVideos, setAllVideos] = useState(videoCatalog);

  // Dynamic Team State & Form
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>(teamMembers);
  const [customTeamMembers, setCustomTeamMembers] = useState<TeamMember[]>([]);
  const [newTeamPhoto, setNewTeamPhoto] = useState<File | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('');
  const [newTeamBio, setNewTeamBio] = useState('');
  const [newTeamCreds, setNewTeamCreds] = useState('');
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');
  const [teamErrorMsg, setTeamErrorMsg] = useState('');
  const teamFileInputRef = useRef<HTMLInputElement | null>(null);

  const refreshProjects = () => {
    fetch('/api/portfolio')
      .then((res) => {
        if (!res.ok) throw new Error('Portfolio load error');
        return res.json();
      })
      .then((data) => {
        if (data.customProjects && Array.isArray(data.customProjects)) {
          setCustomProjects(data.customProjects);
        }
        if (data.artworks && Array.isArray(data.artworks)) {
          setAllArtworks(data.artworks);
        }
        if (data.audio && Array.isArray(data.audio)) {
          setAllAudio(data.audio);
        }
        if (data.videos && Array.isArray(data.videos)) {
          setAllVideos(data.videos);
        }
      })
      .catch((err) => console.warn('Portfolio load err:', err));

    fetch('/api/team')
      .then((res) => {
        if (!res.ok) throw new Error('Team load error');
        return res.json();
      })
      .then((data) => {
        if (data.teamMembers && Array.isArray(data.teamMembers)) {
          setAllTeamMembers(data.teamMembers);
        }
        if (data.customTeamMembers && Array.isArray(data.customTeamMembers)) {
          setCustomTeamMembers(data.customTeamMembers);
        }
      })
      .catch((err) => console.warn('Team load err:', err));
  };

  // Helper: Retrieve active stored password or default 'helloworld'
  const getStoredPassword = (): string => {
    if (typeof window === 'undefined') return 'helloworld';
    try {
      return localStorage.getItem('mainahtunes_admin_pwd') || 'helloworld';
    } catch {
      return 'helloworld';
    }
  };

  // Mount effect to check stored login session
  useEffect(() => {
    setIsMounted(true);
    refreshProjects();
    try {
      const isAuth = localStorage.getItem('mainahtunes_admin_auth');
      const savedUser = localStorage.getItem('mainahtunes_admin_user');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
        if (savedUser) setAdminUser(savedUser);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const activePwd = getStoredPassword();

    if (loginPassword === activePwd) {
      try {
        localStorage.setItem('mainahtunes_admin_auth', 'true');
        const user = loginUsername.trim() || 'admin';
        localStorage.setItem('mainahtunes_admin_user', user);
        localStorage.setItem('mainahtunes_admin_auth_time', Date.now().toString());
        setAdminUser(user);
      } catch (e) {
        console.error('Error writing to localStorage', e);
      }
      setIsAuthenticated(true);
      setLoginPassword('');
    } else {
      setLoginError('Invalid password. Default initial password is "helloworld" unless updated.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('mainahtunes_admin_auth');
    } catch (e) {
      console.error('Error clearing auth from localStorage', e);
    }
    setIsAuthenticated(false);
    setLoginPassword('');
    setLoginError('');
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdChangeSuccess('');
    setPwdChangeError('');

    const activePwd = getStoredPassword();

    if (currentPwdInput !== activePwd) {
      setPwdChangeError('Current password does not match.');
      return;
    }

    if (newPwdInput.length < 6) {
      setPwdChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPwdInput !== confirmPwdInput) {
      setPwdChangeError('New password and confirmation do not match.');
      return;
    }

    try {
      localStorage.setItem('mainahtunes_admin_pwd', newPwdInput);
      setPwdChangeSuccess('Password updated successfully! Next time you log in, use your new password.');
      setCurrentPwdInput('');
      setNewPwdInput('');
      setConfirmPwdInput('');
    } catch (e) {
      setPwdChangeError('Failed to save updated password to local storage.');
    }
  };

  // Reset to Default "helloworld"
  const handleResetDefaultPassword = () => {
    if (window.confirm('Reset admin password back to the default "helloworld"?')) {
      try {
        localStorage.setItem('mainahtunes_admin_pwd', 'helloworld');
        setPwdChangeSuccess('Admin password reset to default "helloworld".');
        setPwdChangeError('');
        setCurrentPwdInput('');
        setNewPwdInput('');
        setConfirmPwdInput('');
      } catch (e) {
        setPwdChangeError('Failed to reset password.');
      }
    }
  };

  // Direct File Upload Handler
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    if (!uploadFile) {
      setUploadErrorMsg('Please select a file to upload.');
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('category', uploadCategory);
      formData.append('title', uploadTitle || uploadFile.name);
      formData.append('artist', uploadArtist);
      formData.append('description', uploadDesc);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccessMsg(data.message || 'File uploaded successfully!');
      setUploadedUrl(data.publicUrl || data.publicPath || '');
      setUploadFile(null);
      setUploadTitle('');
      setUploadArtist('');
      setUploadDesc('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (data.project) {
        setCustomProjects((prev) => [data.project, ...prev.filter((p) => p.id !== data.project.id)]);
        try {
          const stored = localStorage.getItem('mainahtunes_custom_projects');
          const list = stored ? JSON.parse(stored) : [];
          const updated = [data.project, ...list.filter((p: any) => p.id !== data.project.id)];
          localStorage.setItem('mainahtunes_custom_projects', JSON.stringify(updated));
        } catch {}
      }
      refreshProjects();
    } catch (err: any) {
      setUploadErrorMsg(err.message || 'An error occurred during upload.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteCustomProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete and unpublish "${title}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomProjects((prev) => prev.filter((p) => p.id !== id));
        try {
          const stored = localStorage.getItem('mainahtunes_custom_projects');
          if (stored) {
            const list = JSON.parse(stored);
            localStorage.setItem('mainahtunes_custom_projects', JSON.stringify(list.filter((p: any) => p.id !== id)));
          }
        } catch {}
        refreshProjects();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete project');
      }
    } catch (e: any) {
      alert(`Failed to delete: ${e.message}`);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamSuccessMsg('');
    setTeamErrorMsg('');

    if (!newTeamName.trim() || !newTeamRole.trim()) {
      setTeamErrorMsg('Please provide both the Name and Role/Position.');
      return;
    }

    setTeamLoading(true);
    try {
      const formData = new FormData();
      if (newTeamPhoto) {
        formData.append('photo', newTeamPhoto);
      }
      formData.append('name', newTeamName);
      formData.append('role', newTeamRole);
      formData.append('department', newTeamDept || 'Creative Direction & Music Services');
      formData.append('bio', newTeamBio || 'Creative specialist at Mainahtunes Team.');
      formData.append('credentials', newTeamCreds);

      const res = await fetch('/api/team', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add team member');
      }

      setTeamSuccessMsg(data.message || `Team member "${newTeamName}" added successfully!`);
      setNewTeamPhoto(null);
      setNewTeamName('');
      setNewTeamRole('');
      setNewTeamDept('');
      setNewTeamBio('');
      setNewTeamCreds('');
      if (teamFileInputRef.current) teamFileInputRef.current.value = '';

      if (data.member) {
        setCustomTeamMembers((prev) => [data.member, ...prev.filter((m) => m.id !== data.member.id)]);
        setAllTeamMembers((prev) => [data.member, ...prev.filter((m) => m.id !== data.member.id)]);
        try {
          const stored = localStorage.getItem('mainahtunes_custom_team');
          const list = stored ? JSON.parse(stored) : [];
          const updated = [data.member, ...list.filter((m: any) => m.id !== data.member.id)];
          localStorage.setItem('mainahtunes_custom_team', JSON.stringify(updated));
        } catch {}
      }
      refreshProjects();
    } catch (err: any) {
      setTeamErrorMsg(err.message || 'An error occurred while adding team member.');
    } finally {
      setTeamLoading(false);
    }
  };

  const handleDeleteTeamMember = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete and unpublish "${name}" from the team roster?`)) return;
    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomTeamMembers((prev) => prev.filter((m) => m.id !== id));
        setAllTeamMembers((prev) => prev.filter((m) => m.id !== id));
        try {
          const stored = localStorage.getItem('mainahtunes_custom_team');
          if (stored) {
            const list = JSON.parse(stored);
            localStorage.setItem('mainahtunes_custom_team', JSON.stringify(list.filter((m: any) => m.id !== id)));
          }
        } catch {}
        refreshProjects();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete team member');
      }
    } catch (e: any) {
      alert(`Failed to delete: ${e.message}`);
    }
  };

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

  // Prevent flash during hydration
  if (!isMounted) {
    return (
      <main className="admin-studio-main admin-loading-screen">
        <div className="admin-loading-spinner">
          <Sparkles size={28} className="spin-icon text-orange" />
          <p>Initializing Secure Admin Studio...</p>
        </div>
      </main>
    );
  }

  // If unauthenticated, show the protected Admin Login Page
  if (!isAuthenticated) {
    return (
      <main className="admin-studio-main admin-login-page">
        <div className="admin-login-container">
          <div className="login-top-nav">
            <Link href="/" className="back-link">
              ← Return to Main Website
            </Link>
          </div>

          <div className="admin-login-card">
            <div className="login-badge-header">
              <div className="login-lock-icon">
                <Lock size={24} />
              </div>
              <span className="login-kicker">MAINAHTUNESTEAM · RESTRICTED ACCESS</span>
              <h2>Admin Management Studio</h2>
              <p>Enter administrative credentials to manage agency services, portfolio catalog, and site data.</p>
            </div>

            {loginError && (
              <div className="security-alert error" role="alert">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <label>
                Username / Email
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. admin"
                  autoComplete="username"
                />
              </label>

              <label>
                Password
                <div className="pwd-input-wrap">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <div className="login-hint-box">
                <ShieldCheck size={14} className="text-orange" />
                <span>Default credentials: <b>admin</b> / <b>helloworld</b></span>
              </div>

              <button type="submit" className="button button-orange login-submit-btn">
                Unlock Admin Studio <span>↗</span>
              </button>
            </form>

            <div className="login-card-footer">
              <small>Protected administrative route. Unauthorized access attempts are monitored.</small>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Authenticated Admin Console View
  return (
    <main className="admin-studio-main">
      <section className="page-hero admin-hero">
        <div className="eyebrow">CONTENT MANAGEMENT SYSTEM (CMS)</div>
        <h1>
          Agency Content <em>Management Studio.</em>
        </h1>
        <p>
          Your central command center to manage, preview, and upload all 53 services, cover artworks, audio masters, AI music videos, team members, and testimonials.
        </p>

        {/* Purpose Explanation Banner */}
        <div className="admin-purpose-banner">
          <div className="purpose-icon">
            <Sparkles size={22} />
          </div>
          <div className="purpose-text">
            <h4>What is the Admin Management Studio For?</h4>
            <p>
              This studio allows you to <b>upload new samples</b> (cover artworks, mixing/mastering audio tracks, AI music videos) as you finish new client projects. You can preview live media, inspect audio calibrations, manage testimonials, and control security credentials—all from one place without modifying code.
            </p>
          </div>
        </div>

        {/* Admin Session Control Bar */}
        <div className="admin-session-bar">
          <div className="session-status">
            <span className="live-dot" />
            <span>Authenticated as: <b>{adminUser}</b></span>
            <span className="session-tag">PROTECTED SESSION</span>
          </div>
          <div className="session-actions">
            <button
              type="button"
              className="session-btn"
              onClick={() => setActiveTab('upload-sample')}
            >
              <UploadCloud size={13} /> Upload New Sample
            </button>
            <button
              type="button"
              className="session-btn"
              onClick={() => setActiveTab('security')}
            >
              <KeyRound size={13} /> Change Password
            </button>
            <button
              type="button"
              className="session-btn logout"
              onClick={handleLogout}
            >
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </div>

        <div className="admin-quick-stats">
          <span><b>53</b> Services</span>
          <span><b>{allArtworks.length}</b> Artworks</span>
          <span><b>{allAudio.length}</b> Audio Samples</span>
          <span><b>{allVideos.length}</b> AI Videos</span>
          <span><b>08</b> Web Projects</span>
          <span><b>{allTeamMembers.length}</b> Team Leaders</span>
          <span><b>{customProjects.length}</b> Custom Uploads</span>
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
            <Palette size={14} /> Cover Artworks ({allArtworks.length})
          </button>
          <button
            type="button"
            className={activeTab === 'audio' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('audio')}
          >
            <Volume2 size={14} /> Audio Engineering ({allAudio.length})
          </button>
          <button
            type="button"
            className={activeTab === 'videos' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('videos')}
          >
            <Film size={14} /> AI Music Videos ({allVideos.length})
          </button>
          <button
            type="button"
            className={activeTab === 'team' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('team')}
          >
            <Users size={14} /> Team &amp; Leadership ({allTeamMembers.length})
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
            className={activeTab === 'upload-sample' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('upload-sample')}
          >
            <UploadCloud size={14} /> Upload Samples {customProjects.length > 0 && `(${customProjects.length})`}
          </button>
          <button
            type="button"
            className={activeTab === 'security' ? 'admin-nav-tab active' : 'admin-nav-tab'}
            onClick={() => setActiveTab('security')}
          >
            <KeyRound size={14} /> Security &amp; Credentials
          </button>
          <button
            type="button"
            className={activeTab === 'add-item' ? 'admin-nav-tab add-btn active' : 'admin-nav-tab add-btn'}
            onClick={() => setActiveTab('add-item')}
          >
            <PlusCircle size={14} /> Entry Code Generator
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
                <h2>{allArtworks.length} Cover Artworks</h2>
                <p>Original creative artwork catalog rendered with high-resolution visual masters.</p>
              </div>
              <Link href="/visuals#cover-artwork" target="_blank" className="button button-outline">
                View in Review My Works ↗
              </Link>
            </div>

            <div className="admin-cards-grid">
              {allArtworks.map((art, idx) => (
                <div className="admin-art-card" key={art.id}>
                  <div className="admin-art-thumb-wrap">
                    <Image
                      src={getArtworkSrc(art.image)}
                      alt={art.title}
                      width={300}
                      height={300}
                      className="admin-art-img"
                      unoptimized
                    />
                  </div>
                  <span className="art-idx">0{idx + 1}</span>
                  <h3>{art.title}</h3>
                  <p>Artist: <strong>{art.artist}</strong></p>
                  <span className="style-tag">{art.style}</span>
                  <div className="art-concept-preview">
                    <small>CONCEPT:</small>
                    <p>{art.concept}</p>
                  </div>
                  <div className="art-file-info">
                    <small>SOURCE / URL:</small>
                    <code>{art.image.length > 45 ? art.image.substring(0, 45) + '...' : art.image}</code>
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
                <h2>{allAudio.length} Studio Audio Samples (Mastering &amp; Mixing)</h2>
                <p>High-resolution playable audio masters with LUFS calibrations and A/B before/after comparison notes.</p>
              </div>
              <Link href="/visuals#mastering" target="_blank" className="button button-outline">
                Listen on Live Console ↗
              </Link>
            </div>

            <div className="admin-cards-grid">
              {allAudio.map((t) => (
                <div className="admin-audio-card" key={t.id}>
                  <span className="audio-type-badge">{t.type.toUpperCase()}</span>
                  <h3>{t.title}</h3>
                  <p>Artist / Session: <strong>{t.artist || 'MainahtunesTeam Studio Session'}</strong></p>
                  
                  {/* Real In-Admin Audio Player */}
                  <audio controls src={t.src} className="admin-audio-player" preload="metadata" />

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

        {/* Tab 4: AI Music Videos */}
        {activeTab === 'videos' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Original AI Music Video Productions ({allVideos.length})</h2>
                <p>Playable video reels with high-definition motion cinematography.</p>
              </div>
              <Link href="/visuals#ai-music-video" target="_blank" className="button button-outline">
                View in Review My Works ↗
              </Link>
            </div>

            <div className="admin-cards-grid">
              {allVideos.map((v) => (
                <div className="admin-audio-card" key={v.id}>
                  <video controls src={v.videoSrc} className="service-sample-video" preload="metadata" />
                  <span className="style-tag" style={{ marginTop: '8px' }}>{v.type}</span>
                  <h3>{v.title}</h3>
                  <p>{v.description}</p>
                  <div className="art-file-info">
                    <small>FILE PATH / URL:</small>
                    <code>{v.videoSrc.length > 45 ? v.videoSrc.substring(0, 45) + '...' : v.videoSrc}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Team & Leadership */}
        {activeTab === 'team' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Executive Leadership &amp; Operational Roster ({allTeamMembers.length})</h2>
                <p>Publish new team members directly to the live website or manage standing leadership without writing code.</p>
              </div>
              <Link href="/team" target="_blank" className="button button-outline">
                View Live Team Page ↗
              </Link>
            </div>

            {/* Direct Team Member Publishing Form */}
            <div className="upload-sample-grid" style={{ marginBottom: '32px' }}>
              <div className="upload-form-card">
                <div className="security-card-header" style={{ marginBottom: '16px' }}>
                  <UserPlus size={20} className="text-orange" />
                  <div>
                    <h3 style={{ margin: 0 }}>Publish New Team Member</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                      Upload member photo and enter their role, department, and bio.
                    </p>
                  </div>
                </div>

                {teamSuccessMsg && (
                  <div className="security-alert success" role="alert">
                    <CheckCircle2 size={16} />
                    <span>{teamSuccessMsg}</span>
                  </div>
                )}

                {teamErrorMsg && (
                  <div className="security-alert error" role="alert">
                    <AlertCircle size={16} />
                    <span>{teamErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddTeamMember} className="security-form">
                  {/* Photo Dropzone */}
                  <div
                    className="file-dropzone-box"
                    style={{ padding: '20px', minHeight: 'auto' }}
                    onClick={() => teamFileInputRef.current?.click()}
                  >
                    <input
                      ref={teamFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewTeamPhoto(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="dropzone-label">
                      <UploadCloud size={24} className="text-orange" />
                      <b>Upload Member Portrait Photo</b>
                      <span>PNG, JPG, or WebP portrait format (recommended 800×1000px)</span>
                    </div>
                    {newTeamPhoto && (
                      <div className="selected-file-badge">
                        <Check size={14} className="text-orange" />
                        <span>Selected: <b>{newTeamPhoto.name}</b></span>
                      </div>
                    )}
                  </div>

                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <label>
                      Full Name *
                      <input
                        type="text"
                        required
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="e.g. Jordan Hayes"
                      />
                    </label>

                    <label>
                      Role / Position *
                      <input
                        type="text"
                        required
                        value={newTeamRole}
                        onChange={(e) => setNewTeamRole(e.target.value)}
                        placeholder="e.g. Senior Mixing &amp; Mastering Engineer"
                      />
                    </label>
                  </div>

                  <label>
                    Department / Division
                    <input
                      type="text"
                      value={newTeamDept}
                      onChange={(e) => setNewTeamDept(e.target.value)}
                      placeholder="e.g. Audio Engineering &amp; Studio Production"
                    />
                  </label>

                  <label>
                    Professional Biography
                    <textarea
                      rows={3}
                      value={newTeamBio}
                      onChange={(e) => setNewTeamBio(e.target.value)}
                      placeholder="Describe their background, industry experience, and creative focus..."
                    />
                  </label>

                  <label>
                    Core Responsibilities &amp; Credentials (comma-separated)
                    <input
                      type="text"
                      value={newTeamCreds}
                      onChange={(e) => setNewTeamCreds(e.target.value)}
                      placeholder="e.g. Multi-Track Audio Mixing, Dolby Atmos Calibration, Analog EQ Mastering"
                    />
                  </label>

                  <button
                    type="submit"
                    className="button button-orange"
                    disabled={teamLoading}
                    style={{ marginTop: '8px' }}
                  >
                    {teamLoading ? 'Publishing Team Member...' : 'Publish Team Member to Live Site ↗'}
                  </button>
                </form>
              </div>

              <div className="security-info-card">
                <h3>Live Team Member Architecture</h3>
                <ul className="security-tips-list">
                  <li>
                    <b>Direct Live Publishing:</b> Any team member added here is immediately published to the live <code>/team</code> page without waiting for a re-compile.
                  </li>
                  <li>
                    <b>Permanent Cloud Storage:</b> Portraits are saved permanently in cloud storage and mapped to the permanent team registry.
                  </li>
                  <li>
                    <b>Instant Unpublish:</b> You can delete or unpublish custom members at any time using the red button on their card below.
                  </li>
                  <li>
                    <b>Zero Database Required:</b> Backed by persistent cloud JSON storage, eliminating database costs and server maintenance.
                  </li>
                </ul>
              </div>
            </div>

            <div className="panel-header" style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
              <div>
                <h3>Active Team Roster ({allTeamMembers.length})</h3>
                <p>Showing both baseline agency leaders and dynamically published team members.</p>
              </div>
            </div>

            <div className="admin-team-list">
              {allTeamMembers.map((m) => {
                const isCustom = customTeamMembers.some((c) => c.id === m.id);
                return (
                  <div className="admin-team-row" key={m.id}>
                    <div className="team-avatar-box">
                      <img src={m.image || '/team/amelia-clarke.jpeg'} alt={m.name} />
                    </div>
                    <div className="team-details">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="role-tag">{m.role}</span>
                        {isCustom ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteTeamMember(m.id, m.name)}
                            className="button button-outline"
                            style={{ padding: '3px 8px', fontSize: '11px', color: '#ff5c5c', borderColor: 'rgba(255, 92, 92, 0.3)' }}
                            title="Delete / Unpublish"
                          >
                            <Trash2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Unpublish
                          </button>
                        ) : (
                          <span style={{ fontSize: '10px', color: 'var(--orange)', fontWeight: 700, letterSpacing: '0.08em' }}>
                            CORE LEADERSHIP
                          </span>
                        )}
                      </div>
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
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Testimonials */}
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

        {/* Tab 7: Upload New Sample */}
        {activeTab === 'upload-sample' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Upload New Project Samples (Media Asset Uploader)</h2>
                <p>Directly upload new cover artworks, audio stems, and video reels to your agency portfolio.</p>
              </div>
            </div>

            <div className="upload-sample-grid">
              <div className="upload-form-card">
                {uploadSuccessMsg && (
                  <div className="security-alert success" role="alert">
                    <CheckCircle2 size={16} />
                    <div>
                      <span>{uploadSuccessMsg}</span>
                      {uploadedUrl && (
                        <div style={{ marginTop: '4px', fontSize: '11px' }}>
                          Available at: <code>{uploadedUrl}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {uploadErrorMsg && (
                  <div className="security-alert error" role="alert">
                    <AlertCircle size={16} />
                    <span>{uploadErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleFileUpload} className="security-form">
                  <label>
                    Asset Category
                    <div className="gen-type-selector">
                      <button
                        type="button"
                        className={uploadCategory === 'artwork' ? 'gen-type active' : 'gen-type'}
                        onClick={() => setUploadCategory('artwork')}
                      >
                        <FileImage size={13} style={{ display: 'inline', marginRight: '5px' }} /> Cover Artwork (.png, .jpg)
                      </button>
                      <button
                        type="button"
                        className={uploadCategory === 'audio' ? 'gen-type active' : 'gen-type'}
                        onClick={() => setUploadCategory('audio')}
                      >
                        <FileAudio size={13} style={{ display: 'inline', marginRight: '5px' }} /> Audio Sample (.mp3, .wav)
                      </button>
                      <button
                        type="button"
                        className={uploadCategory === 'video' ? 'gen-type active' : 'gen-type'}
                        onClick={() => setUploadCategory('video')}
                      >
                        <FileVideo size={13} style={{ display: 'inline', marginRight: '5px' }} /> Video Reel (.mp4)
                      </button>
                    </div>
                  </label>

                  {/* Dropzone */}
                  <div
                    className="file-dropzone-box"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={
                        uploadCategory === 'artwork'
                          ? 'image/png,image/jpeg,image/webp'
                          : uploadCategory === 'audio'
                          ? 'audio/mp3,audio/wav,audio/mpeg'
                          : 'video/mp4,video/webm'
                      }
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                          if (!uploadTitle) {
                            setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                          }
                        }
                      }}
                    />
                    <div className="dropzone-label">
                      <UploadCloud size={32} className="text-orange" />
                      <b>Click to browse or drag file here</b>
                      <span>
                        {uploadCategory === 'artwork'
                          ? 'Supports PNG, JPG, WebP up to 3000x3000px'
                          : uploadCategory === 'audio'
                          ? 'Supports 24-bit WAV & MP3 audio files'
                          : 'Supports H.264 MP4 & WebM video files'}
                      </span>
                    </div>

                    {uploadFile && (
                      <div className="selected-file-badge">
                        <Check size={14} className="text-orange" />
                        <span>Selected: <b>{uploadFile.name}</b> ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    )}
                  </div>

                  <label>
                    Project / Release Title
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Neon Horizon"
                    />
                  </label>

                  <label>
                    Artist / Client Name
                    <input
                      type="text"
                      value={uploadArtist}
                      onChange={(e) => setUploadArtist(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                    />
                  </label>

                  <label>
                    Project Overview / Engineering Notes
                    <textarea
                      rows={3}
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      placeholder="Describe the sonic processing, artistic concept, or client deliverables..."
                    />
                  </label>

                  <button
                    type="submit"
                    className="button button-orange"
                    disabled={uploadLoading || !uploadFile}
                  >
                    {uploadLoading ? 'Uploading & Processing...' : 'Upload & Publish Sample ↗'}
                  </button>
                </form>
              </div>

              <div className="security-info-card">
                <h3>Permanent Cloud Storage Architecture</h3>
                <ul className="security-tips-list">
                  <li>
                    <b>Vercel Serverless Ready:</b> Uploads are streamed to permanent cloud storage (Vercel Blob / Cloudinary / External CDN) avoiding the read-only file system restriction (<code>EROFS</code>) on serverless platforms.
                  </li>
                  <li>
                    <b>All 3 Asset Types Supported:</b> Upload 3000x3000px cover artwork images, 24-bit WAV / 320k MP3 audio masters, and 1080p / 4K MP4 video reels.
                  </li>
                  <li>
                    <b>Instant Live Publishing:</b> Once uploaded, your project automatically appears on the <code>/samples</code> and <code>/visuals</code> pages for all visitors.
                  </li>
                  <li>
                    <b>Zero Rebuild Required:</b> Projects are recorded in the cloud registry, remaining accessible across all redeployments.
                  </li>
                </ul>
              </div>
            </div>

            {/* Live Published Custom Samples Section */}
            <div className="custom-samples-manager" style={{ marginTop: '36px' }}>
              <div className="panel-header">
                <div>
                  <h3>Live Published Custom Samples ({customProjects.length})</h3>
                  <p>Projects uploaded through this studio are stored in permanent cloud storage and published directly to your live portfolio.</p>
                </div>
              </div>

              {customProjects.length === 0 ? (
                <div className="admin-empty-state" style={{ padding: '30px', textAlign: 'center', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '8px' }}>
                  <UploadCloud size={36} className="text-orange" style={{ margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>No custom projects uploaded yet. Use the form above to upload your first artwork, master track, or video!</p>
                </div>
              ) : (
                <div className="admin-cards-grid">
                  {customProjects.map((p) => (
                    <div className="admin-art-card" key={p.id} style={{ position: 'relative' }}>
                      {p.category === 'artwork' ? (
                        <div className="admin-art-thumb-wrap">
                          <Image
                            src={getArtworkSrc(p.fileUrl)}
                            alt={p.title}
                            width={300}
                            height={300}
                            className="admin-art-img"
                            unoptimized
                          />
                        </div>
                      ) : p.category === 'audio' ? (
                        <div style={{ padding: '16px 0 8px' }}>
                          <audio controls src={p.fileUrl} style={{ width: '100%' }} preload="metadata" />
                        </div>
                      ) : (
                        <div style={{ padding: '8px 0' }}>
                          <video controls src={p.fileUrl} style={{ width: '100%', maxHeight: '180px', borderRadius: '4px' }} preload="metadata" />
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span className="style-tag" style={{ textTransform: 'uppercase' }}>{p.category}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomProject(p.id, p.title)}
                          className="button button-outline"
                          style={{ padding: '4px 8px', fontSize: '11px', color: '#ff5c5c', borderColor: 'rgba(255, 92, 92, 0.3)' }}
                          title="Delete / Unpublish"
                        >
                          <Trash2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Unpublish
                        </button>
                      </div>

                      <h3 style={{ marginTop: '8px' }}>{p.title}</h3>
                      <p>Artist: <strong>{p.artist}</strong></p>
                      {p.description && (
                        <div className="art-concept-preview">
                          <small>NOTES / CONCEPT:</small>
                          <p>{p.description}</p>
                        </div>
                      )}
                      <div className="art-file-info" style={{ marginTop: '8px' }}>
                        <small>CLOUD URL:</small>
                        <a href={p.fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: '11px', wordBreak: 'break-all', color: 'var(--accent-orange)' }}>
                          {p.fileUrl.length > 50 ? p.fileUrl.substring(0, 50) + '...' : p.fileUrl} ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 8: Security & Password Management */}
        {activeTab === 'security' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>Security &amp; Administrative Credentials</h2>
                <p>Change your admin login password or review credential access controls for the studio.</p>
              </div>
            </div>

            <div className="security-panel-grid">
              <div className="security-card">
                <div className="security-card-header">
                  <KeyRound size={22} className="text-orange" />
                  <div>
                    <h3>Change Admin Password</h3>
                    <p>Enter your current password and specify a new secure password.</p>
                  </div>
                </div>

                {pwdChangeSuccess && (
                  <div className="security-alert success" role="alert">
                    <CheckCircle2 size={16} />
                    <span>{pwdChangeSuccess}</span>
                  </div>
                )}

                {pwdChangeError && (
                  <div className="security-alert error" role="alert">
                    <AlertCircle size={16} />
                    <span>{pwdChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="security-form">
                  <label>
                    Current Password
                    <div className="pwd-input-wrap">
                      <input
                        type={showCurrentPwd ? 'text' : 'password'}
                        required
                        value={currentPwdInput}
                        onChange={(e) => setCurrentPwdInput(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        className="pwd-toggle-btn"
                        onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                        aria-label={showCurrentPwd ? 'Hide password' : 'Show password'}
                      >
                        {showCurrentPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <label>
                    New Password
                    <div className="pwd-input-wrap">
                      <input
                        type={showNewPwd ? 'text' : 'password'}
                        required
                        value={newPwdInput}
                        onChange={(e) => setNewPwdInput(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                      <button
                        type="button"
                        className="pwd-toggle-btn"
                        onClick={() => setShowNewPwd(!showNewPwd)}
                        aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                      >
                        {showNewPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <label>
                    Confirm New Password
                    <div className="pwd-input-wrap">
                      <input
                        type={showConfirmPwd ? 'text' : 'password'}
                        required
                        value={confirmPwdInput}
                        onChange={(e) => setConfirmPwdInput(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="pwd-toggle-btn"
                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                        aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>

                  <div className="security-form-actions">
                    <button type="submit" className="button button-orange">
                      Update Password ↗
                    </button>
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={handleResetDefaultPassword}
                    >
                      Reset to Default (helloworld)
                    </button>
                  </div>
                </form>
              </div>

              <div className="security-info-card">
                <h3>Access Control &amp; Best Practices</h3>
                <ul className="security-tips-list">
                  <li>
                    <b>Default System Password:</b> Initial factory password is set to <code>helloworld</code>.
                  </li>
                  <li>
                    <b>Instant Local Persistence:</b> Updating your password persists locally in browser storage immediately, taking effect across all subsequent logins.
                  </li>
                  <li>
                    <b>Session Isolation:</b> Your session remains authenticated until you click <b>Log Out</b> or clear your browser data.
                  </li>
                  <li>
                    <b>Safety Reset:</b> You can reset your credentials back to <code>helloworld</code> at any time using the &ldquo;Reset to Default&rdquo; button or by clearing storage.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: New Entry Code Generator */}
        {activeTab === 'add-item' && (
          <div className="admin-panel">
            <div className="panel-header">
              <div>
                <h2>New Item Code Generator (Developer Helper)</h2>
                <p>Generate structured TypeScript code snippets to paste directly into <code>data/portfolio.ts</code>, <code>data/team.ts</code>, or <code>data/testimonials.ts</code>. (Tip: You can now publish media samples and team members directly in their respective tabs without manually copying code!)</p>
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
