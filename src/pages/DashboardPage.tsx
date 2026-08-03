import { useState } from "react";
import { Link } from "react-router-dom";
import { Reorder } from "framer-motion";
import {
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  GripVertical,
  Globe, Github, Twitter, Linkedin, Link as LinkIcon, Youtube, Instagram, Mail,
  Settings, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfileHeader from "@/components/ProfileHeader";
import LinkCard from "@/components/LinkCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFancyToast } from "@/components/ui/fancy-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

const ICONS = ["Globe", "Github", "Twitter", "Linkedin", "Link", "Youtube", "Instagram", "Mail"];
const ICON_MAP: Record<string, React.ElementType> = {
  Globe, Github, Twitter, Linkedin, Link: LinkIcon, Youtube, Instagram, Mail
};

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const { profile, updateProfile, addLink, updateLink, removeLink } = useUserProfile();
  const { showToast } = useFancyToast();

  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  if (!currentUser) return null;

  const pageUrl = `${window.location.origin}/${profile.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addSocialLink = () => {
    const newSocial = {
      id: Date.now().toString(),
      url: "https://",
      icon: "Instagram",
      enabled: true,
    };
    updateProfile({ socialLinks: [...(profile.socialLinks || []), newSocial] });
    showToast({
      type: "success",
      title: "Social icon ditambahkan!",
      description: "Social icon baru berhasil ditambahkan ke profil kamu.",
    });
  };

  const updateSocialLink = (id: string, updates: any) => {
    updateProfile({
      socialLinks: (profile.socialLinks || []).map(l => l.id === id ? { ...l, ...updates } : l)
    });
  };

  const removeSocialLink = (id: string) => {
    updateProfile({
      socialLinks: (profile.socialLinks || []).filter(l => l.id !== id)
    });
  };

  return (
    <SidebarProvider>
      <AdminSidebar onEditClick={() => {}} pageUrl={pageUrl} />
      
      <SidebarInset className="min-h-screen bg-[#F3F3F1] flex flex-col pb-16 lg:pb-0">
        {/* Top bar for mobile */}
        <div className={`lg:hidden p-4 border-b border-border bg-white items-center justify-center ${mobileTab === 'preview' ? 'hidden' : 'flex'}`}>
          <span className="text-base font-bold font-display text-foreground">PageHub</span>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] items-start">
          
          {/* LEFT COLUMN: Editor Panel */}
          <div className={`p-4 sm:p-8 max-w-3xl mx-auto w-full ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-foreground">Profile</h2>
              <p className="text-muted-foreground text-sm">Update your public profile details.</p>
            </div>

            {/* Profile Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-8 space-y-4">
              <Input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Your name"
                className="bg-muted border-border"
              />
              <Input
                value={profile.bio}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder="Short bio"
                className="bg-muted border-border"
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
                          updateProfile({ avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="bg-muted border-border cursor-pointer text-xs h-9 flex-1"
                  />
                  {profile.avatar && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => updateProfile({ avatar: "" })} 
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
                    onChange={(e) => updateProfile({ slug: e.target.value.replace(/[^a-zA-Z0-9-_]/g, "") })}
                    placeholder="yourname"
                    className="bg-muted border-border"
                  />
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="mb-8">
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Appearance</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Background</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md p-1">
                    <Input
                      type="color"
                      value={profile.theme?.backgroundColor || "#0a0a0a"}
                      onChange={(e) => updateProfile({ theme: { ...profile.theme, backgroundColor: e.target.value } })}
                      className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-muted-foreground uppercase font-mono hidden sm:inline">{profile.theme?.backgroundColor || "#0a0a0a"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Button</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md p-1">
                    <Input
                      type="color"
                      value={profile.theme?.buttonColor || "#ffffff"}
                      onChange={(e) => updateProfile({ theme: { ...profile.theme, buttonColor: e.target.value } })}
                      className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-muted-foreground uppercase font-mono hidden sm:inline">{profile.theme?.buttonColor || "#ffffff"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Link Text</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md p-1">
                    <Input
                      type="color"
                      value={profile.theme?.buttonTextColor || "#000000"}
                      onChange={(e) => updateProfile({ theme: { ...profile.theme, buttonTextColor: e.target.value } })}
                      className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-muted-foreground uppercase font-mono hidden sm:inline">{profile.theme?.buttonTextColor || "#000000"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Username</label>
                  <div className="flex items-center gap-2 bg-muted border border-border rounded-md p-1">
                    <Input
                      type="color"
                      value={profile.theme?.usernameColor || "#ffffff"}
                      onChange={(e) => updateProfile({ theme: { ...profile.theme, usernameColor: e.target.value } })}
                      className="w-8 h-8 p-0 border-0 rounded overflow-hidden cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-muted-foreground uppercase font-mono hidden sm:inline">{profile.theme?.usernameColor || "#ffffff"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-foreground">Social Icons</h2>
                <Button variant="secondary" size="sm" onClick={addSocialLink} className="gap-1 rounded-full px-4 font-semibold">
                  <Plus className="w-4 h-4" /> Add Social Icon
                </Button>
              </div>
              <Reorder.Group axis="y" values={profile.socialLinks || []} onReorder={(newLinks) => updateProfile({ socialLinks: newLinks })} className="space-y-3">
                {(profile.socialLinks || []).map((link) => (
                  <Reorder.Item key={link.id} value={link} className="bg-white rounded-2xl p-4 shadow-sm border border-border relative">
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <Select value={link.icon} onValueChange={(val) => updateSocialLink(link.id, { icon: val })}>
                        <SelectTrigger className="w-32 bg-muted border-border text-sm">
                          <SelectValue placeholder="Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICONS.map((icon) => (
                            <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="bg-muted border-border text-sm flex-1"
                      />
                      <Switch
                        checked={link.enabled}
                        onCheckedChange={(checked) => updateSocialLink(link.id, { enabled: checked })}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeSocialLink(link.id)} className="text-destructive hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            {/* Main Links Section */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-foreground">Links</h2>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1 rounded-full px-4 font-semibold"
                  onClick={() => {
                    addLink();
                    showToast({
                      type: "success",
                      title: "Link berhasil ditambahkan!",
                      description: "Link baru sudah muncul di halaman profil kamu.",
                    });
                  }}
                >
                  <Plus className="w-4 h-4" /> Add Link
                </Button>
              </div>

              <Reorder.Group axis="y" values={profile.links} onReorder={(newLinks) => updateProfile({ links: newLinks })} className="space-y-3">
                {profile.links.map((link) => (
                  <Reorder.Item
                    key={link.id}
                    value={link}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-border relative"
                  >
                    <div className="flex items-center gap-2">
                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value })}
                        placeholder="Title"
                        className="bg-muted border-border text-sm flex-1"
                        style={{ fontWeight: 600 }}
                      />
                      <Switch
                        checked={link.enabled}
                        onCheckedChange={(checked) => updateLink(link.id, { enabled: checked })}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)} className="text-destructive hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="pl-7 mt-3">
                      <Input
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="bg-muted border-border text-sm mb-3"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={link.icon} onValueChange={(val) => updateLink(link.id, { icon: val })}>
                          <SelectTrigger className="bg-muted border-border text-sm h-10">
                            <SelectValue placeholder="Icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {ICONS.map((icon) => (
                              <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={link.animation || "none"} onValueChange={(val: any) => updateLink(link.id, { animation: val })}>
                          <SelectTrigger className="bg-muted border-border text-sm h-10">
                            <SelectValue placeholder="Animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="wobble">Wobble</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="blink">Blink</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className={`flex-col items-center justify-center border-l border-border bg-white sticky top-0 h-screen ${mobileTab === 'edit' ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Top right URL copy bar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-border">
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">pagehub.com/{profile.slug}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-full"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {/* Phone Mockup */}
            <div className="w-full lg:w-[300px] h-full lg:h-[640px] lg:rounded-[2.5rem] lg:border-[8px] lg:border-black overflow-hidden lg:shadow-2xl relative flex flex-col transition-colors duration-300 lg:mt-12"
              style={{ backgroundColor: profile.theme?.backgroundColor || "hsl(var(--background))" }}
            >
              {/* Notch / Dynamic Island simulation */}
              <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-20"></div>

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-20 lg:pb-10 pt-8 lg:pt-0">
                <div className="px-4 lg:pt-14 pb-8 flex flex-col items-center min-h-full">
                  <ProfileHeader name={profile.name} bio={profile.bio} avatar={profile.avatar} usernameColor={profile.theme?.usernameColor} />
                  
                  {/* Preview Social Icons */}
                  {profile.socialLinks && profile.socialLinks.filter(l => l.enabled).length > 0 && (
                    <div className="flex items-center justify-center flex-wrap gap-4 mt-4 mb-6">
                      {profile.socialLinks.filter(l => l.enabled).map(link => {
                        const IconComp = ICON_MAP[link.icon] || ExternalLink;
                        return (
                          <a key={link.id} href={link.url} target="_blank" rel="noreferrer" 
                            className="text-foreground hover:opacity-70 transition-opacity"
                            style={{ color: profile.theme?.buttonTextColor || "inherit" }}
                          >
                            <IconComp className="w-6 h-6" />
                          </a>
                        )
                      })}
                    </div>
                  )}

                  {/* Preview Links */}
                  <div className="w-full space-y-3 mt-4">
                    {profile.links.filter((l) => l.enabled).length === 0 ? (
                      <p className="text-center text-muted-foreground/60 text-sm py-6">
                        No links yet.
                      </p>
                    ) : (
                      profile.links
                        .filter((l) => l.enabled)
                        .map((link, i) => (
                          <LinkCard key={link.id} link={link} index={i} theme={profile.theme} />
                        ))
                    )}
                  </div>
                  
                  <p className="text-center text-muted-foreground/40 text-xs mt-10">
                    PageHub
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex items-center justify-around p-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <Button 
            variant="ghost" 
            onClick={() => setMobileTab("edit")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${mobileTab === 'edit' ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] font-medium">Edit</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => setMobileTab("preview")}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${mobileTab === 'preview' ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ExternalLink className="w-5 h-5" />
            <span className="text-[10px] font-medium">View</span>
          </Button>

          <Button 
            variant="ghost" 
            onClick={logout}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Logout</span>
          </Button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardPage;
