import { useEffect, useMemo, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import Dice3D, { FaceIndex } from "@/components/Dice3D";
import { motion, AnimatePresence } from "framer-motion";
import LogoImage from "@/components/LogoImage";
import SocialBar from "@/components/SocialBar";
import ScrambleText from "@/components/ScrambleText";
import FloatingElements from "@/components/FloatingElements";
import { useExperience } from "@/hooks/usePortfolio";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: experiences, isLoading: expLoading } = useExperience();
  const [selectedFace, setSelectedFace] = useState<FaceIndex | null>(null);
  // Increment each time a face is clicked so the Experience section remounts even for the same face
  const [selectionId, setSelectionId] = useState(0);
  const expSectionRef = useRef<HTMLDivElement | null>(null);

  const diceExperiences = useMemo(
    () => (Array.isArray(experiences) ? experiences : []).filter((e) => e.showOnDice && e.logoUrl).slice(0, 6),
    [experiences]
  );

  const faces = useMemo(
    () =>
      Object.fromEntries(
        diceExperiences.map((exp, idx) => [
          (idx + 1) as FaceIndex,
          <LogoImage src={exp.logoUrl!} alt={exp.company} />,
        ])
      ) as Partial<Record<FaceIndex, React.ReactNode>>,
    [diceExperiences]
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Scroll to bottom on each face selection
  useEffect(() => {
    if (selectionId === 0) return;
    const t = window.setTimeout(() => {
      const doc = document.documentElement;
      const body = document.body;
      const max = Math.max(doc.scrollHeight, body.scrollHeight);
      window.scrollTo({ top: max, behavior: "smooth" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [selectionId]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingElements />
      <Navigation />
      
      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-24">
        <div className="container">
          {/* Hero Grid: Left text, Right 3D dice */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              {/* Name with Scramble Effect */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-2 whitespace-nowrap">
                  <span className="align-baseline">Hello! I'm </span>
                  <ScrambleText
                    text="Matthew"
                    className="inline-block"
                  />
                </h1>
            <div className="flex items-center gap-3 mt-4">
              <p className="text-xl text-muted-foreground">
                Mechatronics Engineering + Artificial Intelligence
              </p>
            </div>
            <p className="text-lg text-muted-foreground mt-2">
              University of Waterloo
            </p>
              </div>

              {/* Bio Section - Placeholder */}
              <div className={`max-w-2xl mt-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p className="italic text-base md:text-lg">
                      Passionate mechatronics engineering student with a focus on artificial intelligence and robotics. 
                      I enjoy building innovative solutions that combine hardware and software to solve real-world problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: 3D Dice + Experience reveal */}
            <div className={`w-full flex flex-col items-start overflow-visible mt-12 lg:mt-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="max-w-full" style={{ marginLeft: "5cm", marginTop: "0cm" }}>
                <Dice3D
                  size={320}
                  faces={faces as Record<FaceIndex, React.ReactNode>}
                  faceScale={1.0}
                  onFaceChange={(face) => {
                    setSelectedFace(face);
                    setSelectionId((n) => n + 1);
                  }}
                />
              </div>

              {/* Selected experience details will render in the section below */}
            </div>
          </div>

          {/* Experience Section (hidden until a face is selected) with fade-in and scroll */}
          <AnimatePresence>
            {selectedFace && (() => {
              const exp = diceExperiences[selectedFace - 1];
              
              if (!exp) return null;
              
              return (
                <motion.div
                  ref={expSectionRef}
                  key={`exp-${selectedFace}-${selectionId}`}
                  className="mt-16"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <h2 className="text-3xl font-bold mb-8">Experience</h2>
                  {expLoading ? (
                    <p className="text-muted-foreground">Loading experience...</p>
                  ) : (
                    <div className="space-y-6">
                      <div key={exp.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="text-xl font-semibold">{exp.position}</h3>
                            <p className="text-primary text-sm mt-0.5">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                            {exp.location && (
                              <div>{exp.location}</div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Work Summary</p>
                            <p className="text-muted-foreground">{exp.description}</p>
                          </div>
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Problem</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Solution</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {exp.achievements.slice(0, 3).map((ach, idx) => (
                                  <li key={idx}>{ach}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech) => (
                                <span key={tech} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </main>

      <SocialBar />
    </div>
  );
}

