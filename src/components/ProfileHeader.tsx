import { motion } from "framer-motion";
import defaultAvatar from "@/assets/default-avatar.png";

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatar: string;
}

const ProfileHeader = ({ name, bio, avatar }: ProfileHeaderProps) => {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
        <img
          src={avatar || defaultAvatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold glow-text">{name}</h1>
        <p className="text-muted-foreground text-sm mt-1">{bio}</p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
