"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Camera, User, Edit2, X, Image as ImageIcon, Video, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { useRef, useEffect } from "react";
import { updateProfile, updatePassword } from "@/actions/settings";

export function ProfileForm({ initialData }: { initialData: { name: string, email: string, image?: string | null } }) {
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
    if (isEditing) {
      setShowMenu(!showMenu);
    }
  };

  const startCamera = async () => {
    setShowMenu(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      toast.error("Failed to access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
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
          throw new Error("Both current and new passwords are required to change password.");
        }
        const pwRes = await updatePassword({ currentPassword, newPassword });
        if (pwRes.error) throw new Error(pwRes.error);
        setCurrentPassword("");
        setNewPassword("");
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center pb-4">
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Name</label>
            <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{name || "-"}</p>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Email</label>
            <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">{email || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Password</label>
            <p className="text-gray-900 dark:text-gray-100 font-medium text-lg tracking-[0.2em]">••••••••</p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-gray-100 dark:bg-gray-800 px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center pb-4">
        <div 
          className="relative group cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400 dark:text-gray-500" />
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={24} className="text-white" />
          </div>

          {showMenu && (
            <div className="absolute top-full mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-in slide-in-from-top-2">
              <button
                type="button"
                onClick={startCamera}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Video size={16} /> Take a selfie
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ImageIcon size={16} /> Pick from album
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
      </div>
      
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Take a Selfie</h3>
              <button type="button" onClick={stopCamera} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="p-6 flex justify-center">
              <button
                type="button"
                onClick={capturePhoto}
                className="h-16 w-16 rounded-full border-4 border-indigo-500 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all hover:scale-105"
              >
                <div className="h-12 w-12 rounded-full bg-indigo-500 shadow-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-base shadow-inner backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
            placeholder="Your name" 
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-base shadow-inner backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
            placeholder="Your email" 
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-bold mb-4">Change Password <span className="text-sm font-normal text-gray-500">(Optional)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 pr-12 text-base shadow-inner backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
                placeholder="Leave blank to keep current" 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 pr-12 text-base shadow-inner backdrop-blur-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
                placeholder="Leave blank to keep current" 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="mt-3 space-y-2 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password requirements:</p>
              <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    {newPassword.length >= 8 ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                    <span className={newPassword.length >= 8 ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[A-Z]/.test(newPassword) ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                    <span className={/[A-Z]/.test(newPassword) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[a-z]/.test(newPassword) ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                    <span className={/[a-z]/.test(newPassword) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[0-9]/.test(newPassword) ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                    <span className={/[0-9]/.test(newPassword) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[^A-Za-z0-9]/.test(newPassword) ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                    <span className={/[^A-Za-z0-9]/.test(newPassword) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One special character</span>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button 
          type="button" 
          onClick={() => {
            setIsEditing(false);
            setCurrentPassword("");
            setNewPassword("");
          }}
          className="rounded-xl bg-gray-100 dark:bg-gray-800 px-6 py-2 font-bold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-500 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-indigo-600 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
