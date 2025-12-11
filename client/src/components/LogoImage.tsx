import React from "react";

type LogoImageProps = {
  src: string;
  alt?: string;
  /** Optional tint/filter. e.g. "brightness(0) invert(1)" for white logos on dark bg */
  filter?: string;
};

/**
 * Wraps any image (PNG/JPG/WEBP/SVG) in a consistent container for the dice faces.
 * Normalizes sizing and scaling regardless of source resolution.
 * Applies black & white filter for consistent appearance.
 */
export default function LogoImage({ src, alt = "Company logo", filter }: LogoImageProps) {
  // Normalize all logos to black & white with high contrast
  const defaultFilter = "grayscale(100%) contrast(150%) brightness(1.1)";
  
  return (
    <div className="w-full h-full flex items-center justify-center p-0">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain select-none"
        style={{
          filter: filter || defaultFilter,
        }}
        draggable={false}
      />
    </div>
  );
}
