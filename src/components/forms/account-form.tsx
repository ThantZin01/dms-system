"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

type BaseFormData = z.infer<typeof accountSchema>;
type FormData = Omit<BaseFormData, "password"> & { password?: string };

export function AccountForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(initialData ? accountSchema.extend({ password: z.string().optional() }) : accountSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "STUDENT",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Use authClient to sign up a new user, wait we don't want to log the admin out!
      // Better Auth signup automatically signs the user in.
      // To create a user WITHOUT signing them in, we can either use an admin-only API route
      // or we can call a custom server action. Let's try to use the fetch API to /api/auth/sign-up/email 
      // wait, the standard signup endpoint might auto-login. Let's see if Better Auth supports an admin API or just a custom server action.
      // For now we will use a custom server action! Wait, Better Auth manages passwords via plugins, it's safer to use a custom server action to insert directly or just use fetch.
      // Let's use a server action `createAccount` since we are already authenticated.
      if (initialData) {
        const { editAccountAction } = await import("@/actions/accounts");
        const res = await editAccountAction(initialData.id, data);
        if (res.error) throw new Error(res.error);
        toast.success("Account updated successfully!");
      } else {
        const { createAccountAction } = await import("@/actions/accounts");
        const res = await createAccountAction(data);
        if (res.error) throw new Error(res.error);
        toast.success("Account created successfully!");
      }
      
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || (initialData ? "Failed to update account" : "Failed to create account"));
    }
  };

  const pwd = watch("password") || "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} placeholder="Jane Doe" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="jane@dorm.com" />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password {initialData && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            {...register("password")} 
            placeholder={initialData ? "Leave blank to keep current" : "••••••••"} 
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="mt-3 space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password requirements:</p>
          <ul className="space-y-1 text-xs">
            <li className="flex items-center gap-2">
              {pwd.length >= 8 ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-gray-400" />}
              <span className={pwd.length >= 8 ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>At least 8 characters</span>
            </li>
            <li className="flex items-center gap-2">
              {/[A-Z]/.test(pwd) ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-gray-400" />}
              <span className={/[A-Z]/.test(pwd) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One uppercase letter</span>
            </li>
            <li className="flex items-center gap-2">
              {/[a-z]/.test(pwd) ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-gray-400" />}
              <span className={/[a-z]/.test(pwd) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One lowercase letter</span>
            </li>
            <li className="flex items-center gap-2">
              {/[0-9]/.test(pwd) ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-gray-400" />}
              <span className={/[0-9]/.test(pwd) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One number</span>
            </li>
            <li className="flex items-center gap-2">
              {/[^A-Za-z0-9]/.test(pwd) ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-gray-400" />}
              <span className={/[^A-Za-z0-9]/.test(pwd) ? "text-gray-900 dark:text-gray-100" : "text-gray-500"}>One special character</span>
            </li>
          </ul>
        </div>
        {errors.password && !pwd && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select id="role" {...register("role")} defaultValue={initialData?.role || "STUDENT"}>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Account" : "Create Account")}
        </Button>
      </div>
    </form>
  );
}
