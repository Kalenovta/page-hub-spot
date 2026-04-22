import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getUserBySlug } from "@/lib/auth";
import { UserAccount } from "@/lib/types";
import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";

const UserProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<UserAccount | null | undefined>(undefined);

  useEffect(() => {
    if (slug) {
      setUser(getUserBySlug(slug));
    }
  }, [slug]);

  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (user === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            <span className="font-mono text-primary">/{slug}</span> doesn't exist yet.
          </p>
          <Link
            to="/"
            className="text-sm text-primary hover:underline inline-block mt-2"
          >
            ← Back to PageHub
          </Link>
        </motion.div>
      </div>
    );
  }

  const profile = user.profile;
  const activeLinks = profile.links.filter((l) => l.enabled);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-16 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <ProfileHeader name={profile.name} bio={profile.bio} avatar={profile.avatar} />

        <div className="space-y-3">
          {activeLinks.map((link, i) => (
            <LinkCard key={link.id} link={link} index={i} />
          ))}
        </div>

        <motion.p
          className="text-center text-muted-foreground/40 text-xs mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Made with{" "}
          <Link to="/" className="hover:text-muted-foreground transition-colors">
            PageHub
          </Link>
        </motion.p>
      </div>
    </div>
  );
};

export default UserProfilePage;
