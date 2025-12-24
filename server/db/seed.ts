import { db } from "./index";
import { projects, experience, skills, education, certifications, gallery, projectImages } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  db.delete(projectImages).run();
  db.delete(gallery).run();
  db.delete(projects).run();
  db.delete(experience).run();
  db.delete(skills).run();
  db.delete(education).run();
  db.delete(certifications).run();

  // Seed Projects (exported from local DB)
  const projectRows = [
    {
      id: 13,
      title: "Beethovan",
      description: "Morse Code Robot",
      longDescription: "This is a mechatronics project I finished with my classmate. We take sound input (Morse code), translate it to English, then write them on a whiteboard.",
      technologies: JSON.stringify(["C++","C"]),
      imageUrl: "/uploads/project-images/1765153067114-368517897.jpg",
      videoUrl: "/uploads/project-videos/1765068426713-96437197.mp4",
      demoUrl: "https://drive.google.com/file/d/13TSwJmsvngol-YPntWJlhI01dSqStF3B/view?usp=sharing",
      githubUrl: "https://github.com/Matthew0803/Beethoven",
      featured: false,
      displayOrder: 1,
      startDate: "2024-09",
      endDate: "2024-12",
      keyFeatures: JSON.stringify(["Capture audio signal and converted highs/lows into timed dot/dash events. Save dot/dash sequences to text files and parse them into readable letters","XY gantry and Z-actuator combining with wheel/axis encoders and rack and pinion to move precise distances","Touch sensor to detect pen contact and synchronize drawing strokes"]),
      learnings: JSON.stringify(["Used signal thresholding and timing analysis to convert noisy input into symbol sequences and readable text on a constrained device","Used encoder feedback to achieve more precise, repeatable positioning while detecting and correcting motion errors.","Convert abstract shapes into repeatable motor control routines using encoder-based motion primitives.","Considered mechanical factors such as backlash, friction, and misalignment on system accuracy"]),
      showGithub: true,
      showDemo: true,
      developing: false,
    },
    {
      id: 14,
      title: "F.L.A.S.H",
      description: "Study bot @ MakeUoft 2025",
      longDescription: "F.L.A.S.H (Flashcards Learning and Study Helper) is a hardware‑software study assistant that automates flashcard practice. A camera‑equipped conveyor feeds physical cards past a vision pipeline that reads the content, then a backend generates quiz questions and tracks performance. The system bridges robotics and AI so that studying feels like interacting with a smart tutor instead of flipping cards by hand.",
      technologies: JSON.stringify(["Python","C++","Arduino","SolidWorks","Raspberry Pi"]),
      imageUrl: "/uploads/project-images/1765757105782-190801429.png",
      videoUrl: "/uploads/project-videos/1765757298578-721035535.mov",
      demoUrl: "https://drive.google.com/file/d/1ytwhpWBw563Yvoe6-oyoEMUwTlpBug-H/view?usp=sharing",
      githubUrl: "https://github.com/Matthew0803/FLASH",
      featured: false,
      displayOrder: 2,
      startDate: "2024-02",
      endDate: "2024-02",
      keyFeatures: JSON.stringify(["Raspberry Pi acts as the central controller, hosting the main application, managing the flashcard data, and communicating with attached Arduino boards over serial or GPIO.","Different Arduino modules are used for input and feedback (e.g., joystick for selecting answers, touch sensor to start the timer, LED to indicate time remaining).","Users can step through questions, reveal answers, and mark correctness using the hardware controls, making study sessions phoneless, more tactile and engaging than a standard web app.","Raspberry Pi stores results and usage stats, so users can track performance over time."]),
      learnings: JSON.stringify(["The Raspberry Pi stores results and usage stats, so users can track performance over time, even though the interaction happens through Arduino‑based hardware modules.","Gained experience wiring and programming Arduino boards with multiple modules (joytick, LED, displays, sensors), and handling input/output in real time.","Implemented communication between the Raspberry Pi and Arduino (e.g., over serial), designing simple protocols for sending questions, answers, and status updates.","Practiced debugging hardware issues like wiring mistakes, power problems, and timing bugs, as well as software issues across two different microcontroller environments.","Improved at planning a system where logic is split between the Raspberry Pi (high‑level logic, storage) and Arduino (low‑level hardware control), and making them work together smoothly."]),
      showGithub: true,
      showDemo: true,
      developing: false,
    }
  ] as const;

  for (const row of projectRows) {
    db.insert(projects).values(row).run();
  }

  // Seed Project Images
  const projectImageRows = [
    {
      id: 2,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067108-759082380.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 3,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067110-691711020.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 4,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067114-368517897.jpg",
      isThumbnail: true,
      displayOrder: 0,
    },
    {
      id: 5,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067116-680180461.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 6,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067148-725929533.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 7,
      projectId: 7,
      imageUrl: "/uploads/project-images/1765153067173-177376894.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 8,
      projectId: 8,
      imageUrl: "/uploads/project-images/1765154826607-369464134.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 9,
      projectId: 8,
      imageUrl: "/uploads/project-images/1765154826894-20023401.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 11,
      projectId: 8,
      imageUrl: "/uploads/project-images/1765154848434-526634115.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 12,
      projectId: 8,
      imageUrl: "/uploads/project-images/1765155076901-108056811.png",
      isThumbnail: true,
      displayOrder: 0,
    },
    {
      id: 14,
      projectId: 13,
      imageUrl: "/uploads/project-images/1765756828919-498343732.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 15,
      projectId: 13,
      imageUrl: "/uploads/project-images/1765756828923-813659551.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 16,
      projectId: 13,
      imageUrl: "/uploads/project-images/1765756828928-786408591.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 17,
      projectId: 13,
      imageUrl: "/uploads/project-images/1765756828993-72909122.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 18,
      projectId: 13,
      imageUrl: "/uploads/project-images/1765756829082-352689565.png",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 19,
      projectId: 14,
      imageUrl: "/uploads/project-images/1765757085202-412028328.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 20,
      projectId: 14,
      imageUrl: "/uploads/project-images/1765757085214-658568932.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 21,
      projectId: 14,
      imageUrl: "/uploads/project-images/1765757085442-992108611.jpg",
      isThumbnail: false,
      displayOrder: 0,
    },
    {
      id: 22,
      projectId: 14,
      imageUrl: "/uploads/project-images/1765757105782-190801429.png",
      isThumbnail: true,
      displayOrder: 0,
    }
  ] as const;

  for (const row of projectImageRows) {
    db.insert(projectImages).values(row).run();
  }

  // Seed Experience (exported from local DB)
  const experienceRows = [
    {
      id: 26,
      company: "Studica",
      position: "Software Engineer",
      location: "Mississauga",
      description: "Build educational web app for robotics ",
      logoUrl: "/uploads/experience-logos/1763609968432-810591528.svg",
      responsibilities: JSON.stringify(["SLAM is broken and the map is not generated","Map is messy due to odometry slip and encoder deviation","Map is tiled relative to the robot's orientation"]),
      achievements: JSON.stringify(["The lidar didn't work. Fused and transformed depth camera, front and rear lidar. Published to custom topic to avoid topic confliction","Created IMU transform node and fused odom and IMU Then applied EKF to the fused node to trust IMU more, reducing effects of slipping","Created custom YAML file and specified lidar's params (e.g. TF orientation, POV angle, min & max range)."]),
      technologies: JSON.stringify(["React.js","TypeScript","ROS","Python","C++","Bash"]),
      startDate: "2025-09",
      endDate: "2025-12",
      current: true,
      showOnDice: true,
      diceOrder: 1,
    },
    {
      id: 27,
      company: "WATonomous",
      position: "Software Engineer",
      location: "Waterloo, ON",
      description: "Modifying an EV to a Self-driving Car, Eve",
      logoUrl: "/uploads/experience-logos/1764736683015-598113689.svg",
      responsibilities: JSON.stringify(["Lacking pedestrian regulatory element","Map is not in the right format to be loaded and used for navigation"]),
      achievements: JSON.stringify(["First, define enum for the different pedestrian reg elements state. Then, implement pedestrian visualization. Last, refactor pedestrian regulatory element in HD map router node","Developed a Python script that reformats selected map and loads it automatically. Wrapped with Docker for CI/CD"]),
      technologies: JSON.stringify(["ROS","C++","Docker","Bash","Python"]),
      startDate: "2025-05",
      endDate: null,
      current: true,
      showOnDice: true,
      diceOrder: 2,
    },
    {
      id: 28,
      company: "AfterQuery",
      position: "Software Engineer",
      location: "Remote",
      description: "Creating datasets for terminal-based AI agent training",
      logoUrl: "/uploads/experience-logos/1764888559731-210155465.svg",
      responsibilities: JSON.stringify(["Task solutions were leaked and agent could inspect and copy them directly, causing overfitting","Mixed responsibilities (Dockerfile vs run script) caused violations and brittle environments"]),
      achievements: JSON.stringify(["Tests were mounted at runtime by the harness and sample data was only kept in image instead of reference output","Stopped downloading test deps (pytest, etc.) in Dockerfile and wheels during image build. Instead, installed test deps in testing shell script at runtime"]),
      technologies: JSON.stringify(["Bash","Docker"]),
      startDate: "2025-10",
      endDate: null,
      current: true,
      showOnDice: true,
      diceOrder: 3,
    },
    {
      id: 29,
      company: "UW Baja SAE",
      position: "Electrical Engineer ",
      location: "Waterloo, ON",
      description: "Build off-road car for competitions",
      logoUrl: "/uploads/experience-logos/1764906354738-406058572.svg",
      responsibilities: JSON.stringify(["Lost competition due to lack of torque for uphill"]),
      achievements: JSON.stringify(["Developed a tachometer with ESP32 and Hall sensor. Did testing to find the optimal RPM"]),
      technologies: JSON.stringify(["C++"]),
      startDate: "2024-09",
      endDate: "2025-04",
      current: false,
      showOnDice: true,
      diceOrder: 4,
    },
    {
      id: 30,
      company: "MobileSurety",
      position: "Mechatronics Engineer",
      location: "Remote",
      description: "Device for smoother maintenance/inspection process for large facilities",
      logoUrl: "/uploads/experience-logos/1764902561603-7677017.svg",
      responsibilities: JSON.stringify(["Displays were hardcoded in bitmap, causing poor user feedback during operations and no animations or status indicators","Plain-text MQTT over insecure WiFi, which susceptible to man-in-the-middle attacks, message tampering and credential theft","Hardcoded wifi credentials, which require reflashing firmware for each deployment location, are impossible to update remotely, and cannot deploy devices on other networks"]),
      achievements: JSON.stringify(["LVGL framework with  distinct screens C file that has dynamic text updates, loading animations during WiFi/MQTT connection, and clear error states (connection failed screens)","AWS IoT Core with mutual TLS authentication, which has end-to-end encryption and certificate-based device identity that can prevent replay attacks","Dynamic WiFi credential management that supports multiple WiFi networks, over-the-air credential updates, and field deployment without programming"]),
      technologies: JSON.stringify(["MQTT","C","C++","Python","AWS"]),
      startDate: "2025-07",
      endDate: null,
      current: true,
      showOnDice: true,
      diceOrder: 5,
    },
    {
      id: 31,
      company: "FoloBotics",
      position: "Machine Learning Engineer",
      location: "Oakville, ON",
      description: "Developed software of a social robot prototype that has TTS, object and gesture detection",
      logoUrl: "/uploads/experience-logos/1764974403435-334355086.svg",
      responsibilities: JSON.stringify(["TTS Model blocks the entire program until audio finishes playing. While audio plays, camera feed can't capture new frames and user can't interact. Multiple audio files could even try to play simultaneously.","Constant model inference causes GPU memory pressure and overheating, also causes redundant output and resource waste. Besides, New audio starts before previous audio finishes.","Local Llama-3.2-1B needs ~8GB GPU memory and takes 30-60 seconds to load LLM at startup. Also, local inference slower on consumer GPUs"]),
      achievements: JSON.stringify(["Audio worker thread processes queue asynchronously, allowing camera feed to continue and the audio to plays sequentially without overlaps","Used frame throttling ensures processing happens only when ready. Developed multi-condition gate to passes a snapshot of the frame to the thread. This ensures thread processes the exact frame it was triggered on, avoid live buffer gets overwritten and cause race conditions","Offloads LLM to cloud, reducing local VRAM to ~2GB (just VLM+ TTS)"]),
      technologies: JSON.stringify(["Python","PyTorch","GCP"]),
      startDate: "2025-01",
      endDate: "2025-04",
      current: false,
      showOnDice: true,
      diceOrder: 6,
    }
  ] as const;

  for (const row of experienceRows) {
    db.insert(experience).values(row).run();
  }

  // Seed Skills
  const skillRows = [
    {
      id: 52,
      name: "React",
      category: "Frontend",
      proficiency: 5,
      icon: "react",
      displayOrder: 1,
    },
    {
      id: 53,
      name: "TypeScript",
      category: "Frontend",
      proficiency: 5,
      icon: "typescript",
      displayOrder: 2,
    },
    {
      id: 54,
      name: "Next.js",
      category: "Frontend",
      proficiency: 4,
      icon: "nextjs",
      displayOrder: 3,
    },
    {
      id: 55,
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: 5,
      icon: "tailwind",
      displayOrder: 4,
    },
    {
      id: 56,
      name: "Vue.js",
      category: "Frontend",
      proficiency: 4,
      icon: "vue",
      displayOrder: 5,
    },
    {
      id: 57,
      name: "Node.js",
      category: "Backend",
      proficiency: 5,
      icon: "nodejs",
      displayOrder: 6,
    },
    {
      id: 58,
      name: "Express",
      category: "Backend",
      proficiency: 5,
      icon: "express",
      displayOrder: 7,
    },
    {
      id: 59,
      name: "Python",
      category: "Backend",
      proficiency: 4,
      icon: "python",
      displayOrder: 8,
    },
    {
      id: 60,
      name: "REST APIs",
      category: "Backend",
      proficiency: 5,
      icon: "api",
      displayOrder: 9,
    },
    {
      id: 61,
      name: "PostgreSQL",
      category: "Database",
      proficiency: 4,
      icon: "postgresql",
      displayOrder: 10,
    },
    {
      id: 62,
      name: "MongoDB",
      category: "Database",
      proficiency: 4,
      icon: "mongodb",
      displayOrder: 11,
    },
    {
      id: 63,
      name: "SQLite",
      category: "Database",
      proficiency: 4,
      icon: "sqlite",
      displayOrder: 12,
    },
    {
      id: 64,
      name: "Drizzle ORM",
      category: "Database",
      proficiency: 4,
      icon: "database",
      displayOrder: 13,
    },
    {
      id: 65,
      name: "Git",
      category: "Tools",
      proficiency: 5,
      icon: "git",
      displayOrder: 14,
    },
    {
      id: 66,
      name: "Docker",
      category: "Tools",
      proficiency: 4,
      icon: "docker",
      displayOrder: 15,
    },
    {
      id: 67,
      name: "AWS",
      category: "Tools",
      proficiency: 3,
      icon: "aws",
      displayOrder: 16,
    },
    {
      id: 68,
      name: "CI/CD",
      category: "Tools",
      proficiency: 4,
      icon: "cicd",
      displayOrder: 17,
    }
  ] as const;

  for (const row of skillRows) {
    db.insert(skills).values(row).run();
  }

  // Seed Education
  const educationRows = [
    {
      id: 4,
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
    }
  ] as const;

  for (const row of educationRows) {
    db.insert(education).values(row).run();
  }

  // Seed Certifications
  const certificationRows = [
    {
      id: 7,
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      issueDate: "2023-03",
      expiryDate: null,
      credentialId: "AWS-12345",
      credentialUrl: "https://aws.amazon.com/verification",
      description: "Validates expertise in developing and maintaining applications on AWS",
      displayOrder: 1,
    },
    {
      id: 8,
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      issueDate: "2022-08",
      expiryDate: null,
      credentialId: "PSM-67890",
      credentialUrl: "https://scrum.org/verification",
      description: "Demonstrates understanding of Scrum framework and agile principles",
      displayOrder: 2,
    }
  ] as const;

  for (const row of certificationRows) {
    db.insert(certifications).values(row).run();
  }

  // Seed Gallery
  const galleryRows = [
    {
      id: 16,
      imageUrl: "/uploads/gallery-images/1765934317251-794140298.png",
      description: "",
      displayOrder: 3,
      tag: "CAD",
    },
    {
      id: 17,
      imageUrl: "/uploads/gallery-images/1765934373560-391565437.png",
      description: "",
      displayOrder: 4,
      tag: "CAD",
    },
    {
      id: 18,
      imageUrl: "/uploads/gallery-images/1765934610958-499312021.jpg",
      description: "",
      displayOrder: 5,
      tag: "CAD",
    },
    {
      id: 19,
      imageUrl: "/uploads/gallery-images/1766526904111-207007899.png",
      description: "",
      displayOrder: 6,
      tag: "CAD",
    },
    {
      id: 20,
      imageUrl: "/uploads/gallery-images/1766526921588-654978875.png",
      description: "",
      displayOrder: 7,
      tag: "CAD",
    },
    {
      id: 21,
      imageUrl: "/uploads/gallery-images/1766526921589-941803978.png",
      description: "",
      displayOrder: 8,
      tag: "CAD",
    },
    {
      id: 22,
      imageUrl: "/uploads/gallery-images/1766526921602-391635203.png",
      description: "",
      displayOrder: 9,
      tag: "CAD",
    },
    {
      id: 23,
      imageUrl: "/uploads/gallery-images/1766526921614-56911660.png",
      description: "",
      displayOrder: 10,
      tag: "CAD",
    },
    {
      id: 24,
      imageUrl: "/uploads/gallery-images/1766526921621-212209983.png",
      description: "",
      displayOrder: 11,
      tag: "CAD",
    },
    {
      id: 25,
      imageUrl: "/uploads/gallery-images/1766526921632-95239893.png",
      description: "",
      displayOrder: 12,
      tag: "CAD",
    },
    {
      id: 26,
      imageUrl: "/uploads/gallery-images/1766526921636-930425853.png",
      description: "",
      displayOrder: 13,
      tag: "CAD",
    },
    {
      id: 27,
      imageUrl: "/uploads/gallery-images/1766526921639-28990739.png",
      description: "",
      displayOrder: 14,
      tag: "CAD",
    },
    {
      id: 28,
      imageUrl: "/uploads/gallery-images/1766526921646-66762086.png",
      description: "",
      displayOrder: 15,
      tag: "CAD",
    },
    {
      id: 29,
      imageUrl: "/uploads/gallery-images/1766526921650-515856692.png",
      description: "",
      displayOrder: 16,
      tag: "CAD",
    },
    {
      id: 30,
      imageUrl: "/uploads/gallery-images/1766526921651-931556521.png",
      description: "",
      displayOrder: 17,
      tag: "CAD",
    },
    {
      id: 31,
      imageUrl: "/uploads/gallery-images/1766526921662-924057904.png",
      description: "",
      displayOrder: 18,
      tag: "CAD",
    },
    {
      id: 32,
      imageUrl: "/uploads/gallery-images/1766527468910-322389402.png",
      description: "",
      displayOrder: 19,
      tag: "Circuit",
    },
    {
      id: 33,
      imageUrl: "/uploads/gallery-images/1766527468911-539339447.png",
      description: "",
      displayOrder: 20,
      tag: "Circuit",
    },
    {
      id: 34,
      imageUrl: "/uploads/gallery-images/1766527468949-399982422.png",
      description: "",
      displayOrder: 21,
      tag: "Circuit",
    },
    {
      id: 35,
      imageUrl: "/uploads/gallery-images/1766527468967-981922518.png",
      description: "",
      displayOrder: 22,
      tag: "Circuit",
    },
    {
      id: 36,
      imageUrl: "/uploads/gallery-images/1766527468971-414774175.png",
      description: "",
      displayOrder: 23,
      tag: "Circuit",
    },
    {
      id: 37,
      imageUrl: "/uploads/gallery-images/1766527468975-851529870.png",
      description: "",
      displayOrder: 24,
      tag: "Circuit",
    },
    {
      id: 38,
      imageUrl: "/uploads/gallery-images/1766527468998-779942567.png",
      description: "",
      displayOrder: 25,
      tag: "Circuit",
    },
    {
      id: 39,
      imageUrl: "/uploads/gallery-images/1766527469006-17892254.png",
      description: "",
      displayOrder: 26,
      tag: "Circuit",
    }
  ] as const;

  for (const row of galleryRows) {
    db.insert(gallery).values(row).run();
  }

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
