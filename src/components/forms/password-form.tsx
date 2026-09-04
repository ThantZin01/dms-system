"use client";

import { useState } from "react";
import { updatePassword } from "@/actions/settings";
import { toast } from "react-hot-toast";
import { Edit2 } from "lucide-react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updatePassword({ currentPassword, newPassword });
      if (res.error) throw new Error(res.error);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1 text-sm">Password</label>
            <p className="text-gray-900 dark:text-gray-100 font-medium text-lg tracking-[0.2em] mt-2">••••••••</p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button 
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-gray-100 dark:bg-gray-800 px-5 py-2 font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Edit2 size={16} /> Change Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
        <input 
          type="password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-base shadow-inner backdrop-blur-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
          placeholder="••••••••" 
        />
      </div>
      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
        <input 
          type="password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-base shadow-inner backdrop-blur-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-white/10 dark:bg-black/20 dark:text-white transition-all" 
          placeholder="••••••••" 
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
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
          className="rounded-xl bg-rose-500 px-6 py-2 font-bold text-white shadow-lg transition-all hover:bg-rose-600 disabled:opacity-50"
        >
          {isSubmitting ? "Changing..." : "Save Password"}
        </button>
      </div>
    </form>
  );
}
