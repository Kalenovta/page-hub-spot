import { useState } from "react";
import { Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import EditPanel from "@/components/EditPanel";
import PasswordGate from "@/components/PasswordGate";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const [editing, setEditing] = useState(false);
  const [showPasswordGate, setShowPasswordGate] = useState(false);
  const { profile, updateProfile, addLink, updateLink, removeLink, reorderLinks } = useProfile();

  const handleEditClick = () => {
    setShowPasswordGate(true);
  };

  const handleAuthenticated = () => {
    setShowPasswordGate(false);
    setEditing(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-16 pb-20 px-4">
      <motion.div
        className="fixed top-4 right-4 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={handleEditClick}
          className="border-border hover:border-primary/40 rounded-full w-10 h-10"
        >
          <Settings className="w-4 h-4 text-foreground" />
        </Button>
      </motion.div>

      <div className="w-full max-w-md">
        <ProfileHeader name={profile.name} bio={profile.bio} avatar={profile.avatar} />
        <div className="space-y-3">
          {profile.links.map((link, i) => (
            <LinkCard key={link.id} link={link} index={i} />
          ))}
        </div>
        <motion.p
          className="text-center text-muted-foreground/40 text-xs mt-12 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          /{profile.slug}
        </motion.p>
      </div>

      <AnimatePresence>
        {showPasswordGate && (
          <PasswordGate
            onAuthenticated={handleAuthenticated}
            onClose={() => setShowPasswordGate(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editing && (
          <EditPanel
            profile={profile}
            onUpdateProfile={updateProfile}
            onAddLink={addLink}
            onUpdateLink={updateLink}
            onRemoveLink={removeLink}
            onReorderLinks={reorderLinks}
            onClose={() => setEditing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
