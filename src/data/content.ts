/**
 * Single source of truth for portfolio content.
 * Every fact below comes from the supplied resume (Sandhiya_C_Resume_git.pdf),
 * including the link URLs embedded in it. Nothing here is invented.
 */

export const CONTACT = {
  name: 'Sandhiya C',
  email: 'csandhiya2020@gmail.com',
  linkedin: 'https://linkedin.com/in/sandhiya-c',
  github: 'https://github.com/Sandhiyac2005hjj',
  location: 'Chennai, Tamil Nadu, India',
} as const;

export const SUMMARY =
  '2026 Information Technology graduate with a strong foundation in Java, Data Structures and Algorithms, Object-Oriented Programming and DBMS. Builds backend applications and RESTful APIs with Spring Boot, Hibernate/JPA, Spring Security and PostgreSQL, and integrates machine learning and RAG-based AI into full-stack applications.';

export const INTERESTS = 'Scalable backend systems and intelligent software solutions.';

export const COMPETENCIES = [
  'Analytical Thinking',
  'Communication',
  'Team Collaboration',
  'Adaptability',
  'Quick Learning',
];

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export const SKILL_GROUPS = [
  { name: 'Languages', items: ['Java', 'Python', 'SQL'] },
  {
    name: 'CS Fundamentals',
    items: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Problem-Solving'],
  },
  {
    name: 'Backend',
    items: ['Spring Boot', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'RESTful APIs'],
  },
  { name: 'Web', items: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'TypeScript'] },
  {
    name: 'AI / ML',
    items: ['Machine Learning', 'Deep Learning', 'Retrieval-Augmented Generation (RAG)'],
  },
  { name: 'Tools', items: ['Git', 'GitHub', 'Maven', 'Docker', 'IntelliJ IDEA', 'VS Code'] },
];

export const EDUCATION = [
  {
    when: '2026',
    title: 'B.Tech, Information Technology',
    where: 'Rajalakshmi Engineering College, Chennai',
    score: 'CGPA 8.49 / 10',
  },
  {
    when: '2022',
    title: 'HSC',
    where: 'Sacred Heart Matriculation Higher Secondary School, Chennai',
    score: '93.33%',
  },
  {
    when: '2020',
    title: 'SSLC',
    where: 'Sacred Heart Matriculation Higher Secondary School, Chennai',
    score: '91.00%',
  },
];

export const CERTIFICATIONS = [
  { title: 'Java Foundations', by: 'Oracle Academy', when: 'Aug 2025' },
  { title: 'AI & Machine Learning Training Certificate', by: 'Spiro Prime Tech Services', when: '2025' },
  { title: 'Career Essentials in Generative AI', by: 'Microsoft & LinkedIn Learning', when: 'Jul 2024' },
  { title: 'HTML5, CSS3 & JavaScript', by: 'Infosys Springboard', when: 'Aug 2024' },
  { title: 'Database Programming with SQL', by: 'Oracle Academy', when: 'May 2024' },
];

export const LEADERSHIP = {
  role: 'Public Relations Officer',
  org: 'Leo Club, Rajalakshmi Engineering College',
  when: '2024–2025',
  text: 'Coordinated medical camps serving 100+ patients and organized donation drives for an orphanage.',
};

export const LANGUAGES = ['English', 'Tamil', 'German', 'Telugu'];

export const PROJECTS = {
  illusion: {
    title: 'Project ILLUSION',
    subtitle: 'AI-Powered Proctoring & Automated Assessment System',
    when: 'Jan – Mar 2026',
    repo: 'https://github.com/Sandhiyac2005hjj/AI-Powered-Proctoring-Automated-Assessment-System',
    demo: 'https://drive.google.com/file/d/1D4Lo1sJ4bOtnCgWaknMgGc4gaEU_4_t3/view?usp=sharing',
    stack: [
      'Java 17', 'Spring Boot 3', 'Spring Security', 'JWT', 'Hibernate/JPA', 'React 18', 'Python 3.10',
      'Flask', 'RAG', 'Google Gemini API', 'PostgreSQL', 'REST APIs', 'Tailwind CSS', 'Docker',
    ],
  },
  smartprint: {
    title: 'SmartPrint AI',
    subtitle: 'AI-Powered Job Card Management System',
    when: 'May – Jul 2026',
    repo: 'https://github.com/Sandhiyac2005hjj/SmartPrint-AI',
    stack: [
      'Java 21', 'Spring Boot 3', 'Hibernate/JPA', 'Python', 'Flask', 'Scikit-learn',
      'Gradient Boosting', 'React', 'PostgreSQL', 'SQL', 'REST APIs',
    ],
  },
  cardiologist: {
    title: 'AI Cardiologist',
    subtitle: 'Post-COVID Cardiovascular Risk Prediction & Diagnosis System',
    when: 'Sep – Dec 2025',
    repo: 'https://github.com/Sandhiyac2005hjj/post-covid-cardiovascular-risk-ai',
    stack: [
      'Python', 'Django', 'Scikit-learn', 'XGBoost', 'Decision Tree', 'Extra Trees', 'CNN',
      'Modified LeNet', 'Pandas', 'NumPy', 'SQLite', 'HTML', 'CSS', 'Bootstrap',
    ],
  },
} as const;
