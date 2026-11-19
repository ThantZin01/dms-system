"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Camera,
  User,
  Edit2,
  X,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
} from "lucide-react";
import { updateProfile, updatePassword } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/routing";

export function ProfileForm({
  initialData,
}: {
  initialData: { name: string; email: string; image?: string | null };
}) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [image, setImage] = useState(initialData.image || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleImageClick = () => {
    if (isEditing) setShowMenu((prev) => !prev);
  };

  const startCamera = async () => {
    setShowMenu(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch {
      toast.error("Unable to access camera. Check browser permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setImage(canvas.toDataURL("image/jpeg"));
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateProfile({ name, email, image: image.trim() });
      if (res.error) throw new Error(res.error);

      if (currentPassword || newPassword) {
        if (!currentPassword || !newPassword) {
          throw new Error(
            "Both current and new passwords are required to update your password."
          );
        }
        const pwRes = await updatePassword({ currentPassword, newPassword });
        if (pwRes.error) throw new Error(pwRes.error);
        setCurrentPassword("");
        setNewPassword("");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checks = [
    { label: "8+ chars", ok: newPassword.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(newPassword) },
    { label: "Lowercase", ok: /[a-z]/.test(newPassword) },
    { label: "Number", ok: /[0-9]/.test(newPassword) },
    { label: "Special", ok: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-[#002B5B]/20 bg-[var(--muted)] flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-[var(--foreground)] truncate">
              {name || "Unnamed User"}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">
              {email || "—"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
          <div className="rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Full Name
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)] mt-1">
              {name || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Email Address
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)] mt-1 truncate">
              {email || "—"}
            </p>
          </div>
          <div className="sm:col-span-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Password & Security
              </p>
              <p className="text-sm font-semibold text-[var(--foreground)] tracking-[0.2em] mt-1">
                ••••••••••
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Change
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Editable Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-[#002B5B]/30 bg-[var(--muted)] flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-7 w-7 text-slate-400" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-slate-950/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </div>

          {showMenu && (
            <div className="absolute left-0 top-full mt-2 w-44 surface-elevated rounded-xl py-1.5 z-20">
              <button
                type="button"
                onClick={startCamera}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] cursor-pointer"
              >
                <Video className="h-3.5 w-3.5" />
                Take Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--muted)] cursor-pointer"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Choose Image
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--foreground)]">Profile Photo</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Click avatar to capture or upload (max 2MB)
          </p>
        </div>
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/75 p-4">
          <div className="surface-elevated rounded-2xl overflow-hidden max-w-md w-full">
            <div className="px-4 py-3 flex justify-between items-center border-b border-[var(--border)]">
              <h3 className="font-bold text-sm text-[var(--foreground)]">Capture Photo</h3>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-lg hover:bg-[var(--muted)] cursor-pointer"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <div className="bg-black aspect-video flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-4 flex justify-center">
              <Button type="button" onClick={capturePhoto}>
                <Camera className="h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label htmlFor="profile-name">Full Name</Label>
          <Input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="profile-email">Email Address</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)] space-y-3.5">
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            Change Password{" "}
            <span className="text-xs font-normal text-[var(--muted-foreground)]">
              (optional)
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Keep current"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-[var(--foreground)] cursor-pointer"
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-[var(--foreground)] cursor-pointer"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {newPassword.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {checks.map((c) => (
              <span
                key={c.label}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                  c.ok
                    ? "bg-[#EAF6ED] text-[#146B26] border-[#146B26]/20 dark:bg-[#2CA548]/15 dark:text-[#4ADE80]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)] border-transparent"
                }`}
              >
                {c.ok ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3 opacity-50" />
                )}
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsEditing(false);
            setCurrentPassword("");
            setNewPassword("");
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
