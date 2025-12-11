import { db } from "./index";
import { projects, experience, skills, education, certifications } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(projects);
  await db.delete(experience);
  await db.delete(skills);
  await db.delete(education);
  await db.delete(certifications);

  // Seed Projects
  await db.insert(projects).values([
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website built with React and TypeScript",
      longDescription: "Full-stack portfolio application featuring a custom CMS, SQLite database, and RESTful API. Showcases projects, experience, and skills with a beautiful UI built using React, Tailwind CSS, and Framer Motion.",
      technologies: JSON.stringify(["React", "TypeScript", "Tailwind CSS", "SQLite", "Drizzle ORM", "Express"]),
      imageUrl: "/projects/portfolio.png",
      videoUrl: "/projects/portfolio.mp4",
      githubUrl: "https://github.com/yourusername/portfolio",
      demoUrl: "https://yourportfolio.com",
      featured: true,
      displayOrder: 1,
      startDate: "2024-01",
      endDate: "2024-03",
    },
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      longDescription: "Comprehensive e-commerce platform with user authentication, product management, shopping cart, and Stripe payment integration. Features include real-time inventory tracking, order management, and admin dashboard.",
      technologies: JSON.stringify(["Next.js", "PostgreSQL", "Prisma", "Stripe", "Redux", "Tailwind CSS"]),
      imageUrl: "/projects/ecommerce.png",
      videoUrl: "/projects/ecommerce.mp4",
      githubUrl: "https://github.com/yourusername/ecommerce",
      featured: true,
      displayOrder: 2,
      startDate: "2023-09",
      endDate: "2023-12",
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool with real-time updates",
      longDescription: "Real-time collaborative task management application with drag-and-drop functionality, team collaboration features, and WebSocket integration for live updates.",
      technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Socket.io", "Material-UI"]),
      imageUrl: "/projects/taskmanager.png",
      videoUrl: "/projects/taskmanager.mp4",
      githubUrl: "https://github.com/yourusername/taskmanager",
      demoUrl: "https://taskmanager-demo.com",
      featured: false,
      displayOrder: 3,
      startDate: "2023-06",
      endDate: "2023-08",
    },
  ]);

  // Seed Experience - Matches dice logos in companyLogos.ts
  await db.insert(experience).values([
    {
      company: "FoloBotics",
      position: "Machine Learning Engineer",
      location: "Oakville, ON",
      description: "Developed software of a social robot prototype that has TTS, object and gesture detection",
      logoUrl: "/uploads/experience-logos/1763609968432-810591528.svg",
      responsibilities: JSON.stringify([
        "TTS Model blocks the entire program until audio finishes playing. While audio plays, camera feed can't capture new frames and user can't interact. Multiple audio files could even try to play simultaneously.",
        "Constant model inference causes GPU memory pressure and overheating, also causes redundant output and resource waste. Besides, New audio starts before previous audio finishes.",
        "Local Llama-3.2-1B needs ~8GB GPU memory and takes 30-60 seconds to load LLM at startup. Also, local inference slower on consumer GPUs",
      ]),
      achievements: JSON.stringify([
        "Audio worker thread processes queue asynchronously, allowing camera feed to continue and the audio to plays sequentially without overlaps",
        "Used frame throttling ensures processing happens only when ready. Developed multi-condition gate to passes a snapshot of the frame to the thread. This ensures thread processes the exact frame it was triggered on, avoid live buffer gets overwritten and cause race conditions",
        "Offloads LLM to cloud, reducing local VRAM to ~2GB (just VLM+ TTS)",
      ]),
      technologies: JSON.stringify(["Python", "PyTorch", "GCP"]),
      startDate: "2025-01",
      endDate: "2025-04",
      current: false,
      showOnDice: true,
    },
    {
      company: "WATO",
      position: "[Position Title]",
      location: "[Location]",
      description: "[Brief description of role and responsibilities]",
      logoUrl: "/uploads/experience-logos/1764736683015-598113689.svg",
      responsibilities: JSON.stringify([
        "[Responsibility 1]",
        "[Responsibility 2]",
        "[Responsibility 3]",
      ]),
      achievements: JSON.stringify([
        "[Achievement 1]",
        "[Achievement 2]",
        "[Achievement 3]",
      ]),
      technologies: JSON.stringify(["[Tech 1]", "[Tech 2]", "[Tech 3]"]),
      startDate: "2022-06",
      endDate: "2022-12",
      current: false,
      showOnDice: true,
    },
    {
      company: "Needlist",
      position: "[Position Title]",
      location: "[Location]",
      description: "[Brief description of role and responsibilities]",
      logoUrl: "/uploads/experience-logos/1764888559731-210155465.svg",
      responsibilities: JSON.stringify([
        "[Responsibility 1]",
        "[Responsibility 2]",
        "[Responsibility 3]",
      ]),
      achievements: JSON.stringify([
        "[Achievement 1]",
        "[Achievement 2]",
        "[Achievement 3]",
      ]),
      technologies: JSON.stringify(["[Tech 1]", "[Tech 2]", "[Tech 3]"]),
      startDate: "2022-01",
      endDate: "2022-05",
      current: false,
      showOnDice: true,
    },
    {
      company: "Baja",
      position: "[Position Title]",
      location: "[Location]",
      description: "[Brief description of role and responsibilities]",
      logoUrl: "/uploads/experience-logos/1764888579971-287010897.svg",
      responsibilities: JSON.stringify([
        "[Responsibility 1]",
        "[Responsibility 2]",
        "[Responsibility 3]",
      ]),
      achievements: JSON.stringify([
        "[Achievement 1]",
        "[Achievement 2]",
        "[Achievement 3]",
      ]),
      technologies: JSON.stringify(["[Tech 1]", "[Tech 2]", "[Tech 3]"]),
      startDate: "2021-06",
      endDate: "2021-12",
      current: false,
      showOnDice: true,
    },
    {
      company: "AfterQuery",
      position: "[Position Title]",
      location: "[Location]",
      description: "[Brief description of role and responsibilities]",
      logoUrl: "/uploads/experience-logos/1764902561603-7677017.svg",
      responsibilities: JSON.stringify([
        "[Responsibility 1]",
        "[Responsibility 2]",
        "[Responsibility 3]",
      ]),
      achievements: JSON.stringify([
        "[Achievement 1]",
        "[Achievement 2]",
        "[Achievement 3]",
      ]),
      technologies: JSON.stringify(["[Tech 1]", "[Tech 2]", "[Tech 3]"]),
      startDate: "2021-01",
      endDate: "2021-05",
      current: false,
      showOnDice: true,
    },
    {
      company: "Studica",
      position: "[Position Title]",
      location: "[Location]",
      description: "[Brief description of role and responsibilities]",
      logoUrl: "/uploads/experience-logos/1764906354738-406058572.svg",
      responsibilities: JSON.stringify([
        "[Responsibility 1]",
        "[Responsibility 2]",
        "[Responsibility 3]",
      ]),
      achievements: JSON.stringify([
        "[Achievement 1]",
        "[Achievement 2]",
        "[Achievement 3]",
      ]),
      technologies: JSON.stringify(["[Tech 1]", "[Tech 2]", "[Tech 3]"]),
      startDate: "2020-06",
      endDate: "2020-12",
      current: false,
      showOnDice: true,
    },
  ]);

  // Seed Skills
  await db.insert(skills).values([
    // Frontend
    { name: "React", category: "Frontend", proficiency: 5, icon: "react", displayOrder: 1 },
    { name: "TypeScript", category: "Frontend", proficiency: 5, icon: "typescript", displayOrder: 2 },
    { name: "Next.js", category: "Frontend", proficiency: 4, icon: "nextjs", displayOrder: 3 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 5, icon: "tailwind", displayOrder: 4 },
    { name: "Vue.js", category: "Frontend", proficiency: 4, icon: "vue", displayOrder: 5 },
    
    // Backend
    { name: "Node.js", category: "Backend", proficiency: 5, icon: "nodejs", displayOrder: 6 },
    { name: "Express", category: "Backend", proficiency: 5, icon: "express", displayOrder: 7 },
    { name: "Python", category: "Backend", proficiency: 4, icon: "python", displayOrder: 8 },
    { name: "REST APIs", category: "Backend", proficiency: 5, icon: "api", displayOrder: 9 },
    
    // Database
    { name: "PostgreSQL", category: "Database", proficiency: 4, icon: "postgresql", displayOrder: 10 },
    { name: "MongoDB", category: "Database", proficiency: 4, icon: "mongodb", displayOrder: 11 },
    { name: "SQLite", category: "Database", proficiency: 4, icon: "sqlite", displayOrder: 12 },
    { name: "Drizzle ORM", category: "Database", proficiency: 4, icon: "database", displayOrder: 13 },
    
    // Tools & DevOps
    { name: "Git", category: "Tools", proficiency: 5, icon: "git", displayOrder: 14 },
    { name: "Docker", category: "Tools", proficiency: 4, icon: "docker", displayOrder: 15 },
    { name: "AWS", category: "Tools", proficiency: 3, icon: "aws", displayOrder: 16 },
    { name: "CI/CD", category: "Tools", proficiency: 4, icon: "cicd", displayOrder: 17 },
  ]);

  // Seed Education
  await db.insert(education).values([
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Boston, MA",
      description: "Focused on software engineering, algorithms, and web development. Graduated with honors.",
      gpa: "3.8",
      startDate: "2015-09",
      endDate: "2019-05",
      current: false,
      displayOrder: 1,
    },
  ]);

  // Seed Certifications
  await db.insert(certifications).values([
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-03",
      credentialId: "AWS-12345",
      credentialUrl: "https://aws.amazon.com/verification",
      description: "Validates expertise in developing and maintaining applications on AWS",
      displayOrder: 1,
    },
    {
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      issueDate: "2022-08",
      credentialId: "PSM-67890",
      credentialUrl: "https://scrum.org/verification",
      description: "Demonstrates understanding of Scrum framework and agile principles",
      displayOrder: 2,
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
