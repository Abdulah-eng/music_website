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
    role: 'Lead Visual & Video Director',
    department: 'Visual Production & 3D Animation',
    description: 'Directing cinematic music videos, AI motion synthesis, and album art concepts.',
  },
  {
    role: 'Principal Digital Architect',
    department: 'Web Engineering & Digital Solutions',
    description: 'Architecting high-performance Next.js artist portals, e-commerce, and API systems.',
  },
];
