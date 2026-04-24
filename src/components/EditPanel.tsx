import { X, Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProfileData } from "@/lib/types";

const ICONS = ["Globe", "Github", "Twitter", "Linkedin", "Link", "Youtube", "Instagram", "Mail"];

interface EditPanelProps {
  profile: ProfileData;
  onUpdateProfile: (updates: Partial<ProfileData>) => void;
  onAddLink: () => void;
  onUpdateLink: (id: string, updates: Partial<ProfileData["links"][0]>) => void;
  onRemoveLink: (id: string) => void;
  onReorderLinks: (from: number, to: number) => void;
  onClose: () => void;
}

const EditPanel = ({
  profile, onUpdateProfile, onAddLink, onUpdateLink, onRemoveLink, onReorderLinks, onClose,
}: EditPanelProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md h-full bg-card border-l border-border overflow-y-auto shadow-xl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">Customize</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Profile</h3>
            <Input
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              placeholder="Your name"
              className="bg-secondary border-border"
            />
            <Input
              value={profile.bio}
              onChange={(e) => onUpdateProfile({ bio: e.target.value })}
              placeholder="Short bio"
              className="bg-secondary border-border"
            />
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Avatar</label>
              <div className="flex items-center gap-3">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-border shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <span className="text-muted-foreground text-xs font-medium">Pic</span>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdateProfile({ avatar: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="bg-secondary border-border cursor-pointer text-xs h-9 flex-1"
                />
                {profile.avatar && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onUpdateProfile({ avatar: "" })} 
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Your link slug</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  value={profile.slug}
                  onChange={(e) => onUpdateProfile({ slug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, "") })}
                  placeholder="yourname"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Background</label>
                <div className="flex items-center gap-2 bg-secondary border border-border rounded-md p-1">
                  <Input
                    type="color"
                    value={profile.theme?.backgroundColor || "#0a0a0a"}
                    onChange={(e) => onUpdateProfile({ theme: { ...profile.theme, backgroundColor: e.target.value } })}
                    className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-muted-foreground uppercase font-mono">{profile.theme?.backgroundColor || "#0a0a0a"}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Button Color</label>
                <div className="flex items-center gap-2 bg-secondary border border-border rounded-md p-1">
                  <Input
                    type="color"
                    value={profile.theme?.buttonColor || "#ffffff"}
                    onChange={(e) => onUpdateProfile({ theme: { ...profile.theme, buttonColor: e.target.value } })}
                    className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-muted-foreground uppercase font-mono">{profile.theme?.buttonColor || "#ffffff"}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Text Color</label>
                <div className="flex items-center gap-2 bg-secondary border border-border rounded-md p-1">
                  <Input
                    type="color"
                    value={profile.theme?.buttonTextColor || "#000000"}
                    onChange={(e) => onUpdateProfile({ theme: { ...profile.theme, buttonTextColor: e.target.value } })}
                    className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-muted-foreground uppercase font-mono">{profile.theme?.buttonTextColor || "#000000"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Links</h3>
              <Button variant="ghost" size="sm" onClick={onAddLink} className="text-primary hover:text-primary">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            <AnimatePresence>
              {profile.links.map((link, index) => (
                <motion.div
                  key={link.id}
                  className="glass-card rounded-lg p-3 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <button
                        onClick={() => index > 0 && onReorderLinks(index, index - 1)}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => index < profile.links.length - 1 && onReorderLinks(index, index + 1)}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={index === profile.links.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                    <Input
                      value={link.title}
                      onChange={(e) => onUpdateLink(link.id, { title: e.target.value })}
                      placeholder="Title"
                      className="bg-muted border-border text-sm"
                    />
                    <Switch
                      checked={link.enabled}
                      onCheckedChange={(checked) => onUpdateLink(link.id, { enabled: checked })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => onRemoveLink(link.id)} className="text-destructive hover:text-destructive shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={link.url}
                    onChange={(e) => onUpdateLink(link.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="bg-muted border-border text-sm"
                  />
                  <Select value={link.icon} onValueChange={(val) => onUpdateLink(link.id, { icon: val })}>
                    <SelectTrigger className="bg-muted border-border text-sm">
                      <SelectValue placeholder="Icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditPanel;
