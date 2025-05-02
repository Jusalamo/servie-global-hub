
import { useEffect, useState } from "react";

interface AnimatedSearchPlaceholderProps {
  placeholders: string[];
  interval?: number;
  className?: string;
}

const AnimatedSearchPlaceholder = ({
  placeholders,
  interval = 3000,
  className = "",
}: AnimatedSearchPlaceholderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 100; // ms per character
    const deletingSpeed = 50; // ms per character
    const placeholder = placeholders[currentIndex];

    if (isTyping) {
      // Typing effect
      if (charIndex < placeholder.length) {
        const timeout = setTimeout(() => {
          setCurrentPlaceholder(placeholder.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
        
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause before deleting
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, interval);
        
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting effect
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setCurrentPlaceholder(placeholder.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
        
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next placeholder
        setIsTyping(true);
        setCurrentIndex((currentIndex + 1) % placeholders.length);
      }
    }
  }, [currentIndex, charIndex, isTyping, interval, placeholders]);

  return <span className={className}>{currentPlaceholder}</span>;
};

export default AnimatedSearchPlaceholder;
