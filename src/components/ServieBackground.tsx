import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const ServieBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="home-background">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(234, 56, 76, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)
          `,
          backgroundSize: "400% 400%",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["100% 100%", "0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(circle at 60% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 30% 80%, rgba(234, 56, 76, 0.3) 0%, transparent 40%)
          `,
          backgroundSize: "300% 300%",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
};