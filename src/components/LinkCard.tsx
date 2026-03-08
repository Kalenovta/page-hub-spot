import { motion } from "framer-motion";
import { ExternalLink, Globe, Github, Twitter, Linkedin, Link, Youtube, Instagram, Mail } from "lucide-react";
import type { LinkItem } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Globe, Github, Twitter, Linkedin, Link, Youtube, Instagram, Mail,
};

interface LinkCardProps {
  link: LinkItem;
  index: number;
}

const LinkCard = ({ link, index }: LinkCardProps) => {
  const Icon = iconMap[link.icon || "Link"] || Link;

  if (!link.enabled) return null;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-item flex items-center justify-between group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-display font-medium text-foreground">{link.title}</span>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
};

export default LinkCard;
