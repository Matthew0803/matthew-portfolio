import { useEffect, useState } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export default function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    let iteration = 0;
    const targetLength = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= targetLength) {
        clearInterval(interval);
        setIsComplete(true);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {isComplete ? text : displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

