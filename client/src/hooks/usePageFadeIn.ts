import { useState, useEffect } from "react";

export function usePageFadeIn() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);
  return isVisible
    ? "opacity-100 translate-y-0 transition-all duration-700"
    : "opacity-0 translate-y-4 transition-all duration-700";
}
