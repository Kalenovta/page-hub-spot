import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
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
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { profile, updateProfile, addLink, updateLink, removeLink, reorderLinks } =
    useUserProfile();

  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentUser) return null;

  const pageUrl = `${window.location.origin}/${profile.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SidebarProvider>
      <AdminSidebar onEditClick={() => setEditing(true)} pageUrl={pageUrl} />
      
      <SidebarInset 
        className="min-h-screen relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: profile.theme?.backgroundColor || "hsl(var(--background))" }}
      >
        {/* Top nav bar */}
        <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-2" />
              <span className="text-base font-bold font-display text-foreground sm:hidden">PageHub</span>
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
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-3xl mx-auto px-4 py-10 w-full">
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
                className="text-sm font-medium text-primary flex items-center gap-1 hover:underline break-all"
              >
                {pageUrl}
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <span className="text-xs text-muted-foreground bg-muted rounded-md px-2 py-1 self-start sm:self-center truncate max-w-[200px]">
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
                      <LinkCard key={link.id} link={link} index={i} theme={profile.theme} />
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
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;
