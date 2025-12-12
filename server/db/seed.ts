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

  // Seed Projects (exported from local DB)
  await db.insert(projects).values([
    {
      title: "Beethovan",
      description: "Morse Code Robot",
      longDescription: "This is a mechatronics project I finished with my classmate. We take sound input (Morse code), translate it to English, then write them on a whiteboard.",
      technologies: JSON.stringify(["C++", "C"]),
      imageUrl: "/uploads/project-images/1765153067114-368517897.jpg",
      videoUrl: "/uploads/project-videos/1765068426713-96437197.mp4",
      demoUrl: "https://drive.google.com/file/d/13TSwJmsvngol-YPntWJlhI01dSqStF3B/view?usp=sharing",
      githubUrl: "https://github.com/Matthew0803/Beethoven",
      featured: false,
      displayOrder: 1,
      startDate: "2024-09",
      endDate: "2024-12",
      keyFeatures: JSON.stringify([
        "Capture audio signal and converted highs/lows into timed dot/dash events. Save dot/dash sequences to text files and parse them into readable letters",
        "XY gantry and Z-actuator combining with wheel/axis encoders and rack and pinion to move precise distances",
        "Touch sensor to detect pen contact and synchronize drawing strokes"
      ]),
      learnings: JSON.stringify([
        "Used signal thresholding and timing analysis to convert noisy input into symbol sequences and readable text on a constrained device",
        "Used encoder feedback to achieve more precise, repeatable positioning while detecting and correcting motion errors.",
        "Convert abstract shapes into repeatable motor control routines using encoder-based motion primitives.",
        "Considered mechanical factors such as backlash, friction, and misalignment on system accuracy"
      ]),
      showGithub: true,
      showDemo: true,
      developing: false,
    },
    {
      title: "F.L.A.S.H",
      description: "Study bot @ MakeUoft 2025",
      longDescription: null,
      technologies: JSON.stringify(["Python", "C++", "Arduino", "SolidWorks", "Raspberry Pi"]),
      imageUrl: "/uploads/project-images/1765155076901-108056811.png",
      videoUrl: null,
      demoUrl: null,
      githubUrl: "https://github.com/Matthew0803/FLASH",
      featured: false,
      displayOrder: 2,
      startDate: "2024-02",
      endDate: "2024-02",
      keyFeatures: JSON.stringify([]),
      learnings: JSON.stringify([]),
      showGithub: true,
      showDemo: true,
      developing: false,
    },
  ]);

  // Seed Experience (exported from local DB)
  await db.insert(experience).values([
    {
      company: "WATO",
      position: "Autonomy Software Developer",
      location: "Waterloo, ON",
      description: "Working on the Autonomy Software team for the self-driving car",
      logoUrl: "/uploads/experience-logos/1764736683015-598113689.svg",
      responsibilities: JSON.stringify([
        "Lacking pedestrian regulatory element",
        "Map is not in the right format to be loaded and used for navigation"
      ]),
      achievements: JSON.stringify([
        "First, define enum for the different pedestrian reg elements state. Then, implement pedestrian visualization. Last, refactor pedestrian regulatory element in HD map router node",
        "Developed a Python script that reformats selected map and loads it automatically. Wrapped with Docker for CI/CD"
      ]),
      technologies: JSON.stringify(["ROS", "C++", "Docker", "Bash", "Python"]),
      startDate: "2025-05",
      endDate: null,
      current: true,
      showOnDice: true,
    },
    {
      company: "AfterQuery",
      position: "Software Engineer",
      location: "Remote",
      description: "Creating datasets for terminal-based AI agent training",
      logoUrl: "/uploads/experience-logos/1764888559731-210155465.svg",
      responsibilities: JSON.stringify([
        "Task solutions were leaked and agent could inspect and copy them directly, causing overfitting",
        "Mixed responsibilities (Dockerfile vs run script) caused violations and brittle environments"
      ]),
      achievements: JSON.stringify([
        "Tests were mounted at runtime by the harness and sample data was only kept in image instead of reference output",
        "Stopped downloading test deps (pytest, etc.) in Dockerfile and wheels during image build. Instead, installed test deps in testing shell script at runtime"
      ]),
      technologies: JSON.stringify(["Bash", "Docker"]),
      startDate: "2025-10",
      endDate: null,
      current: true,
      showOnDice: true,
    },
    {
      company: "UW Baja SAE",
      position: "Electrical Engineer",
      location: "Waterloo, ON",
      description: "Build off-road car for competitions",
      logoUrl: "/uploads/experience-logos/1764906354738-406058572.svg",
      responsibilities: JSON.stringify([
        "Lost competition due to lack of torque for uphill"
      ]),
      achievements: JSON.stringify([
        "Developed a tachometer with ESP32 and Hall sensor. Did testing to find the optimal RPM"
      ]),
      technologies: JSON.stringify(["C++"]),
      startDate: "2024-09",
      endDate: "2025-04",
      current: false,
      showOnDice: true,
    },
    {
      company: "MobileSurety",
      position: "Mechatronics Engineer",
      location: "Remote",
      description: "Device for smoother maintenance/inspection process for large facilities",
      logoUrl: "/uploads/experience-logos/1764902561603-7677017.svg",
      responsibilities: JSON.stringify([
        "Displays were hardcoded in bitmap, causing poor user feedback during operations and no animations or status indicators",
        "Plain-text MQTT over insecure WiFi, which susceptible to man-in-the-middle attacks, message tampering and credential theft",
        "Hardcoded wifi credentials, which require reflashing firmware for each deployment location, are impossible to update remotely, and cannot deploy devices on other networks"
      ]),
      achievements: JSON.stringify([
        "LVGL framework with distinct screens C file that has dynamic text updates, loading animations during WiFi/MQTT connection, and clear error states (connection failed screens)",
        "AWS IoT Core with mutual TLS authentication, which has end-to-end encryption and certificate-based device identity that can prevent replay attacks",
        "Dynamic WiFi credential management that supports multiple WiFi networks, over-the-air credential updates, and field deployment without programming"
      ]),
      technologies: JSON.stringify(["MQTT", "C", "C++", "Python", "AWS"]),
      startDate: "2025-07",
      endDate: null,
      current: true,
      showOnDice: true,
    },
    {
      company: "FoloBotics",
      position: "Machine Learning Engineer",
      location: "Oakville, ON",
      description: "Developed software of a social robot prototype that has TTS, object and gesture detection",
      logoUrl: "/uploads/experience-logos/1764974403435-334355086.svg",
      responsibilities: JSON.stringify([
        "TTS Model blocks the entire program until audio finishes playing. While audio plays, camera feed can't capture new frames and user can't interact. Multiple audio files could even try to play simultaneously.",
        "Constant model inference causes GPU memory pressure and overheating, also causes redundant output and resource waste. Besides, New audio starts before previous audio finishes.",
        "Local Llama-3.2-1B needs ~8GB GPU memory and takes 30-60 seconds to load LLM at startup. Also, local inference slower on consumer GPUs"
      ]),
      achievements: JSON.stringify([
        "Audio worker thread processes queue asynchronously, allowing camera feed to continue and the audio to plays sequentially without overlaps",
        "Used frame throttling ensures processing happens only when ready. Developed multi-condition gate to passes a snapshot of the frame to the thread. This ensures thread processes the exact frame it was triggered on, avoid live buffer gets overwritten and cause race conditions",
        "Offloads LLM to cloud, reducing local VRAM to ~2GB (just VLM+ TTS)"
      ]),
      technologies: JSON.stringify(["Python", "PyTorch", "GCP"]),
      startDate: "2025-01",
      endDate: "2025-04",
      current: false,
      showOnDice: true,
    },
  ]);

  // Seed Skills
  await db.insert(skills).values([
    { name: "React", category: "Frontend", proficiency: 5, icon: "react", displayOrder: 1 },
    { name: "TypeScript", category: "Frontend", proficiency: 5, icon: "typescript", displayOrder: 2 },
    { name: "Next.js", category: "Frontend", proficiency: 4, icon: "nextjs", displayOrder: 3 },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 5, icon: "tailwind", displayOrder: 4 },
    { name: "Vue.js", category: "Frontend", proficiency: 4, icon: "vue", displayOrder: 5 },
    { name: "Node.js", category: "Backend", proficiency: 5, icon: "nodejs", displayOrder: 6 },
    { name: "Express", category: "Backend", proficiency: 5, icon: "express", displayOrder: 7 },
    { name: "Python", category: "Backend", proficiency: 4, icon: "python", displayOrder: 8 },
    { name: "REST APIs", category: "Backend", proficiency: 5, icon: "api", displayOrder: 9 },
    { name: "PostgreSQL", category: "Database", proficiency: 4, icon: "postgresql", displayOrder: 10 },
    { name: "MongoDB", category: "Database", proficiency: 4, icon: "mongodb", displayOrder: 11 },
    { name: "SQLite", category: "Database", proficiency: 4, icon: "sqlite", displayOrder: 12 },
    { name: "Drizzle ORM", category: "Database", proficiency: 4, icon: "database", displayOrder: 13 },
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
