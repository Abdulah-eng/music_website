export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  credentials: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'amelia-clarke',
    name: 'Amelia Clarke',
    role: 'Founder, Mainahtunes Team',
    department: 'Creative Direction and Music Services',
    image: '/team/amelia-clarke.jpeg',
    bio: 'As the founder of Mainahtunes Team, Amelia Clarke directs the core creative philosophy, multi-disciplinary production standards, and international artist partnerships for the agency. She leads high-level creative direction across music engineering, visual storytelling, and digital identity to ensure independent artists and labels build a commanding, world-class presence.',
    credentials: [
      'Agency Founder & Executive Creative Direction',
      'Comprehensive Music Production & Rollout Vision',
      'Artist Brand Identity & Sonic Cohesion',
      'International Label & Studio Partnerships',
    ],
  },
  {
    id: 'oliver-bennett',
    name: 'Oliver Bennett',
    role: 'Video Production Director',
    department: 'Video Production',
    image: '/team/oliver-bennett.jpeg',
    bio: "Oliver Bennett leads video production at Mainahtunes Team. He oversees the planning, creative direction, and production of music videos and visual content. He works to bring artists' ideas to life through engaging visuals, professional editing, and high-quality storytelling.",
    credentials: [
      'Music Video Creative Direction & Scripting',
      'Cinematography & Narrative 4K Video Editing',
      'AI Motion Synthesis & Dynamic Visualizers',
      'Cinematic Color Grading & Final Delivery',
    ],
  },
  {
    id: 'sophie-mitchell',
    name: 'Sophie Mitchell',
    role: 'Client Success and Operations Manager',
    department: 'Client Relations and Operations',
    image: '/team/sophie-mitchell.jpeg',
    bio: 'Sophie Mitchell manages client communication and daily client support at Mainahtunes Team. She listens to clients, understands their creative vision, responds to enquiries, and helps resolve concerns throughout each project. She also coordinates messages between clients and the team, follows up on project progress, and ensures clients receive clear updates and a smooth experience from start to finish.',
    credentials: [
      'Client Experience & Strategic Communication',
      'Project Coordination & Delivery Tracking',
      'Creative Vision Onboarding & Feedback Rounds',
      'Cross-Departmental Timeline Management',
    ],
  },
  {
    id: 'afolabi-ayodeji',
    name: 'Afolabi Ayodeji',
    role: 'Financial Manager',
    department: 'Executive Leadership & Financial Stewardship',
    image: '/team/afolabi-ayodeji.png',
    bio: "Responsible for MainahtunesTeam's comprehensive financial management, project budget allocation, operational oversight, and financial coordination. Afolabi ensures transparent, sustainable business operations that enable creative teams to deliver world-class music, visual, and digital solutions to artists and labels globally.",
    credentials: [
      'Financial Management & Operations Oversight',
      'Client Quotation & Budget Stewardship',
      'Sustainable Creative Agency Scaling',
      'Royalty & Contract Reconciliation',
    ],
  },
];

export const upcomingRoles = [
  {
    role: 'Head of Audio Engineering',
    department: 'Music Production & Mastering',
    description: 'Guiding multi-track mixing, Dolby Atmos workflows, and spectral audio restoration.',
  },
  {
    role: 'Lead 3D & VFX Animator',
    department: 'Visual Production & CGI',
    description: 'Directing cinematic visualizers, 3D character CGI, and album art concepts.',
  },
  {
    role: 'Principal Digital Architect',
    department: 'Web Engineering & Digital Solutions',
    description: 'Architecting high-performance Next.js artist portals, e-commerce, and API systems.',
  },
];
