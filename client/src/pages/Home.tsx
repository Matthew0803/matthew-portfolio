import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import Dice3D, { FaceIndex } from "@/components/Dice3D";
import { motion, AnimatePresence } from "framer-motion";
import LogoImage from "@/components/LogoImage";
import SocialBar from "@/components/SocialBar";
import ScrambleText from "@/components/ScrambleText";
import FloatingElements from "@/components/FloatingElements";
import { useExperience, useExperienceImages } from "@/hooks/usePortfolio";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: experiences, isLoading: expLoading } = useExperience();
  const [selectedFace, setSelectedFace] = useState<FaceIndex | null>(null);
  // Increment each time a face is clicked so the Experience section remounts even for the same face
  const [selectionId, setSelectionId] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const expSectionRef = useRef<HTMLDivElement | null>(null);

  const diceExperiences = useMemo(
    () => (Array.isArray(experiences) ? experiences : []).filter((e) => e.showOnDice && e.logoUrl).slice(0, 6),
    [experiences]
  );

  const selectedExpId = selectedFace ? (diceExperiences[selectedFace - 1]?.id ?? 0) : 0;
  const { data: expImages } = useExperienceImages(selectedExpId);


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
                      Passionate mechatronics engineering student with a focus on artificial intelligence.
                      I enjoy building innovative solutions that combine hardware and software to solve real-world problems.
                      Roll the dice to explore my professional experience!
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
                    setIsDetailsOpen(false);
                    setLightboxIndex(null);
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
                          <p className="text-muted-foreground text-sm">{exp.description}</p>

                          {expImages && expImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {expImages.map((item, idx) => (
                                <div
                                  key={item.id}
                                  className="group relative aspect-video overflow-hidden rounded-lg bg-muted"
                                >
                                  {item.type === "video" ? (
                                    <video
                                      src={item.imageUrl}
                                      controls
                                      playsInline
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full cursor-pointer" onClick={() => setLightboxIndex(idx)}>
                                      <img
                                        src={item.imageUrl}
                                        alt={item.caption ?? `Image ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      />
                                      {item.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                          {item.caption}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          <div>
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
                              onClick={() => setIsDetailsOpen((v) => !v)}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDetailsOpen ? "rotate-180" : ""}`} />
                              Technical Details
                            </button>
                            {isDetailsOpen && (
                              <div className="mt-2 pl-5 space-y-3">
                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Problem</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                      {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                                        <li key={idx}>{resp}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {exp.achievements && exp.achievements.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Solution</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                      {exp.achievements.slice(0, 3).map((ach, idx) => (
                                        <li key={idx}>{ach}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

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

      {lightboxIndex !== null && expImages && expImages[lightboxIndex] && expImages[lightboxIndex].type === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="max-w-5xl w-full max-h-[90vh] bg-background rounded-lg overflow-hidden border border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expImages[lightboxIndex].imageUrl}
              alt={expImages[lightboxIndex].caption ?? `Image ${lightboxIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {expImages[lightboxIndex].caption}
                {expImages.length > 1 && ` — ${lightboxIndex + 1} / ${expImages.length}`}
              </p>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setLightboxIndex(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <SocialBar />
    </div>
  );
}

