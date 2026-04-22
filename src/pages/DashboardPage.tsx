import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LogOut,
  ExternalLink,
  Sparkles,
  Settings,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import EditPanel from "@/components/EditPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { profile, updateProfile, addLink, updateLink, removeLink, reorderLinks } =
    useUserProfile();

  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const pageUrl = `${window.location.origin}/${profile.slug}`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-base font-bold font-display text-foreground">PageHub</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy link</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 text-xs h-8"
            >
              <Link to={`/${profile.slug}`} target="_blank">
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </Link>
            </Button>

            <Button
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => setEditing(true)}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit page</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Info banner */}
        <motion.div
          className="mb-8 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <p className="text-xs text-muted-foreground">Your public page URL</p>
            <a
              href={pageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary flex items-center gap-1 hover:underline"
            >
              {pageUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1 self-start sm:self-center">
            {currentUser.email}
          </span>
        </motion.div>

        {/* Profile preview */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex flex-col items-center">
            <ProfileHeader name={profile.name} bio={profile.bio} avatar={profile.avatar} />
            <div className="w-full max-w-md space-y-3">
              {profile.links.filter((l) => l.enabled).length === 0 ? (
                <p className="text-center text-muted-foreground/60 text-sm py-6">
                  No links yet — click <strong>Edit page</strong> to add some.
                </p>
              ) : (
                profile.links
                  .filter((l) => l.enabled)
                  .map((link, i) => (
                    <LinkCard key={link.id} link={link} index={i} />
                  ))
              )}
            </div>
          </div>

          {/* Quick-edit fab */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setEditing(true)}
              className="gap-2 px-6"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              Edit page
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Slide-in edit panel */}
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

export default DashboardPage;
