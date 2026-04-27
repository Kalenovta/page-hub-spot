import { motion } from "framer-motion";
import { ExternalLink, Globe, Github, Twitter, Linkedin, Link, Youtube, Instagram, Mail } from "lucide-react";
import type { LinkItem, ProfileTheme } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Globe, Github, Twitter, Linkedin, Link, Youtube, Instagram, Mail,
};

interface LinkCardProps {
  link: LinkItem;
  index: number;
  theme?: ProfileTheme;
}

const LinkCard = ({ link, index, theme }: LinkCardProps) => {
  const Icon = iconMap[link.icon || "Link"] || Link;

  if (!link.enabled) return null;

  const buttonStyle = {
    backgroundColor: theme?.buttonColor || undefined,
    color: theme?.buttonTextColor || undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-item flex items-center justify-between group"
        style={buttonStyle}
        whileTap={{ scale: 0.98 }}
        animate={
          link.animation === "wobble" ? { rotate: [0, -2, 2, -2, 2, 0] } :
          link.animation === "bounce" ? { y: [0, -6, 0] } :
          link.animation === "blink" ? { opacity: [1, 0.5, 1] } :
          {}
        }
        transition={
          link.animation && link.animation !== "none"
            ? {
                repeat: Infinity,
                duration: link.animation === "bounce" ? 1.5 : 2,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 opacity-80" />
          <span className="font-display font-medium" style={{ color: theme?.buttonTextColor || "inherit" }}>
            {link.title}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.a>
    </motion.div>
  );
};

export default LinkCard;
