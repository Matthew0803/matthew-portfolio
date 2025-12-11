import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type FaceIndex = 1 | 2 | 3 | 4 | 5 | 6;

type Dice3DProps = {
  size?: number; // in px
  className?: string;
  // Provide custom content for faces (overrides pips). Highest precedence.
  faces?: Partial<Record<FaceIndex, React.ReactNode>>;
  // Or provide image URLs for faces; used if no React node is provided for that face.
  faceImages?: Partial<Record<FaceIndex, string>>;
  // Scale multiplier for custom face content (0-1). Defaults to 0.85 area box already.
  faceScale?: number;
  // Notify when a specific face is explicitly clicked (fires immediately on click)
  onFaceSelect?: (face: FaceIndex) => void;
  // Notify when a face is rotated into view (fires after snap/animation completes)
  // This fires when: dragging and releasing, clicking dice body, or clicking a face
  onFaceChange?: (face: FaceIndex) => void;
};

export default function Dice3D({ size = 240, className, faces, faceImages, faceScale = 0.9, onFaceSelect: onFaceSelectProp, onFaceChange }: Dice3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rot, setRot] = useState({ x: -20, y: 30, z: 0 });
  const rotRef = useRef<{ x: number; y: number; z: number }>({ x: -20, y: 30, z: 0 });
  const [animMs, setAnimMs] = useState(0);
  const draggingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const downButtonRef = useRef<number | null>(null);
  const animatingRef = useRef(false);
  const cooldownRef = useRef(false);

  const startCooldown = (ms = 3000) => {
    cooldownRef.current = true;
    window.setTimeout(() => {
      cooldownRef.current = false;
    }, ms);
  };

  // Prevent context menu on the component to allow RMB drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onCtx = (e: MouseEvent) => e.preventDefault();
    el.addEventListener("contextmenu", onCtx);
    return () => el.removeEventListener("contextmenu", onCtx);
  }, []);

  // keep ref in sync with state to avoid stale closures in global handlers
  useEffect(() => {
    rotRef.current = rot;
  }, [rot]);

  // Idle spin when not interacting or animating
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();
    const loop = (now: number) => {
      let dt = now - last;
      last = now;
  if (!draggingRef.current && !animatingRef.current && !cooldownRef.current) {
        // Clamp dt to avoid huge jumps when tab was inactive or lag spikes
        dt = Math.min(dt, 32);
        const sp = 0.015; // uniform deg per ms (~54 deg/min)
        const next = {
          x: rotRef.current.x + dt * sp,
          y: rotRef.current.y + dt * sp,
          z: rotRef.current.z + dt * sp,
        };
        rotRef.current = next;
        setRot(next);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Global mouse listeners while dragging
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current || !lastPosRef.current) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      movedRef.current = true;
      // During manual drag, keep transitions snappy for responsiveness
      setAnimMs(0);
      const next = {
        // invert Y so dragging up tilts cube up
        x: rotRef.current.x - dy * 0.4,
        y: rotRef.current.y + dx * 0.4,
        z: rotRef.current.z,
      };
      rotRef.current = next;
      setRot(next);
    };
    const onUp = (e: MouseEvent) => {
      const wasLeft = downButtonRef.current === 0;
      draggingRef.current = false;
      lastPosRef.current = null;
      downButtonRef.current = null;
      // Snap only after left-drag
      if (wasLeft && movedRef.current) {
        movedRef.current = false;
        snapToNearest();
        startCooldown(3000);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const orientations = useMemo(
    () => [
      { face: 1 as const, x: 0, y: 0 },
      { face: 6 as const, x: 0, y: 180 },
      { face: 3 as const, x: 0, y: 90 },
      { face: 4 as const, x: 0, y: -90 },
      { face: 5 as const, x: -90, y: 0 },
      { face: 2 as const, x: 90, y: 0 },
    ],
    []
  );
  const orientationsByFace = useMemo(() => {
    const m: Record<1|2|3|4|5|6, { x: number; y: number }> = {
      1: { x: 0, y: 0 },
      2: { x: 90, y: 0 },
      3: { x: 0, y: 90 },
      4: { x: 0, y: -90 },
      5: { x: -90, y: 0 },
      6: { x: 0, y: 180 },
    };
    return m;
  }, []);

  const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = normAngle(a.x - b.x);
    const dy = normAngle(a.y - b.y);
    return dx * dx + dy * dy;
  };

  const nearestOrientation = (r: { x: number; y: number }) => {
    let best = orientations[0];
    let bestD = Infinity;
    for (const o of orientations) {
      const d = dist2(r, o);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best;
  };

  function normAngle(a: number) {
    // Normalize to [-180,180)
    let x = ((a + 180) % 360 + 360) % 360 - 180;
    return x;
  }

  const animateTo = (target: { x: number; y: number }, ms = 450, notifyChange = false) => {
    setAnimMs(ms);
    animatingRef.current = true;
    // Compute smallest delta from current orientation to the target face
    const curXn = normAngle(rotRef.current.x);
    const curYn = normAngle(rotRef.current.y);
    const curZn = normAngle(rotRef.current.z);
    const dx = normAngle(target.x - curXn);
    const dy = normAngle(target.y - curYn);
    // Align Z so the selected face is perfectly parallel (no tilt)
    const dz = normAngle(0 - curZn);
    const dest = {
      x: rotRef.current.x + dx,
      y: rotRef.current.y + dy,
      z: rotRef.current.z + dz,
    };
    rotRef.current = dest;
    setRot(dest);
    // After animation, drop transition back to immediate updates and notify face change
    window.setTimeout(() => {
      setAnimMs(0);
      animatingRef.current = false;
      if (notifyChange) {
        const snapped = nearestOrientation(rotRef.current);
        onFaceChange?.(snapped.face);
      }
    }, ms + 20);
  };

  const snapToNearest = () => {
    const target = nearestOrientation(rotRef.current);
    animateTo({ x: target.x, y: target.y }, 300, true); // Notify face change after snap
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    downButtonRef.current = e.button;
    if (e.button === 0) {
      // Right button: start drag
      draggingRef.current = true;
      movedRef.current = false;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return; // left click only
    if (cooldownRef.current || draggingRef.current || animatingRef.current) return;
    // Snap to the currently nearest face (no random)
    const target = nearestOrientation(rotRef.current);
    animateTo({ x: target.x, y: target.y }, 400, true); // Notify face change after click
    startCooldown(3000);
  };

  const onFaceSelect = (n: 1|2|3|4|5|6) => {
    const t = orientationsByFace[n];
    animateTo({ x: t.x, y: t.y }, 400, true); // Notify face change after clicking a face
    startCooldown(3000);
    onFaceSelectProp?.(n as FaceIndex);
  };

  const half = size / 2;

  // Dice pip layouts per face (1..6) - fallback visuals
  const pipLayouts = useMemo(() => {
    const p = (x: number, y: number) => ({ x, y });
    const c = 50;
    const s = 20; // near edge
    const l = 25; // between center and edge
    const h = 75;
    return {
      1: [p(c, c)],
      2: [p(s, s), p(h, h)],
      3: [p(s, s), p(c, c), p(h, h)],
      4: [p(s, s), p(s, h), p(h, s), p(h, h)],
      5: [p(s, s), p(s, h), p(c, c), p(h, s), p(h, h)],
      6: [p(s, s), p(s, c), p(s, h), p(h, s), p(h, c), p(h, h)],
    } as Record<1|2|3|4|5|6, { x: number; y: number }[]>;
  }, []);

  const Face: React.FC<{ n: FaceIndex; style: React.CSSProperties; onSelect?: (n: FaceIndex) => void }>
    = ({ n, style, onSelect }) => {
    const hasNode = faces && faces[n] !== undefined;
    const imgSrc = !hasNode && faceImages ? faceImages[n] : undefined;
    return (
      <div
        className="absolute top-0 left-0 w-full h-full bg-card border border-border rounded-xl shadow-sm flex items-center justify-center"
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect && !cooldownRef.current && !draggingRef.current && !animatingRef.current) {
            onSelect(n);
          }
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${Math.floor(faceScale * 100)}%`,
            height: `${Math.floor(faceScale * 100)}%`,
          }}
        >
          {hasNode ? (
            <div className="w-full h-full flex items-center justify-center">
              {faces![n]}
            </div>
          ) : imgSrc ? (
            <img
              src={imgSrc}
              alt={`Face ${n}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />
          ) : (
            // Fallback: render pips if no custom content provided
            <div className="relative w-full h-full">
              {pipLayouts[n].map((pos, i) => (
                <span
                  key={i}
                  className="absolute block rounded-full bg-foreground"
                  style={{
                    width: Math.max(8, size * 0.06),
                    height: Math.max(8, size * 0.06),
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={
        "select-none" + (className ? ` ${className}` : "")
      }
      style={{ perspective: 900 }}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      <motion.div
        className="relative mx-auto"
        style={{ width: size, height: size }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="relative"
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg) rotateZ(${rot.z}deg)`,
            transition: `transform ${animMs}ms ease-out`,
            willChange: "transform",
            cursor: "grab",
          }}
        >
          {/* Faces */}
          <Face n={1} style={{ transform: `translateZ(${half}px)` }} onSelect={onFaceSelect} />
          <Face n={6} style={{ transform: `rotateY(180deg) translateZ(${half}px)` }} onSelect={onFaceSelect} />
          <Face n={3} style={{ transform: `rotateY(90deg) translateZ(${half}px)` }} onSelect={onFaceSelect} />
          <Face n={4} style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }} onSelect={onFaceSelect} />
          <Face n={5} style={{ transform: `rotateX(90deg) translateZ(${half}px)` }} onSelect={onFaceSelect} />
          <Face n={2} style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }} onSelect={onFaceSelect} />
        </div>
      </motion.div>

      {/* Soft shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none mx-auto rounded-full bg-foreground/15 blur-sm"
        style={{
          width: Math.max(40, size * 0.6),
          height: Math.max(8, size * 0.10),
          transformOrigin: "center",
        }}
        animate={{ scale: [1, 0.9, 1], opacity: [0.35, 0.22, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
