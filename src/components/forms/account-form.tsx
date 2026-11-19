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
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";

type BaseFormData = z.infer<typeof accountSchema>;
type FormData = Omit<BaseFormData, "password"> & { password?: string };

export function AccountForm({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: any;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      initialData
        ? accountSchema.extend({ password: z.string().optional() })
        : accountSchema
    ) as any,
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "STUDENT",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (initialData) {
        const { editAccountAction } = await import("@/actions/accounts");
        const res = await editAccountAction(initialData.id, data);
        if (res.error) throw new Error(res.error);
        toast.success("Account updated successfully");
      } else {
        const { createAccountAction } = await import("@/actions/accounts");
        const res = await createAccountAction(data);
        if (res.error) throw new Error(res.error);
        toast.success("Account created successfully");
      }

      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.message ||
          (initialData ? "Failed to update account" : "Failed to create account")
      );
    }
  };

  const pwd = watch("password") || "";
  const checks = [
    { label: "8+ characters", ok: pwd.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(pwd) },
    { label: "Lowercase", ok: /[a-z]/.test(pwd) },
    { label: "Number", ok: /[0-9]/.test(pwd) },
    { label: "Special char", ok: /[^A-Za-z0-9]/.test(pwd) },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g. Kyaw Zin" />
        {errors.name && (
          <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="resident@dorm.com"
        />
        {errors.email && (
          <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">
          Password{" "}
          {initialData && (
            <span className="text-xs font-normal text-[var(--muted-foreground)]">
              (leave blank to keep current)
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder={initialData ? "Leave blank to keep current" : "Enter strong password"}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-[var(--foreground)] cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {(pwd.length > 0 || !initialData) && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
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
        {errors.password && !pwd && (
          <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select id="role" {...register("role")}>
          <option value="STUDENT">Resident (Student)</option>
          <option value="ADMIN">Administrator</option>
        </Select>
        {errors.role && (
          <p className="text-xs text-rose-600 mt-1">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-3 border-t border-[var(--border)]">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update Account"
            : "Create Account"}
        </Button>
      </div>
    </form>
  );
}
