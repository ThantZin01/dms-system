"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema } from "@/lib/validations";
import { createPerson, updatePerson } from "@/actions/people";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "@/i18n/routing";

type FormData = z.input<typeof personSchema>;

export function PersonForm({
  onSuccess,
  initialData,
  users,
}: {
  onSuccess?: () => void;
  initialData?: any;
  users?: any[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData
      ? {
          fullName: initialData.fullName,
          roomNumber: initialData.roomNumber || "",
          contactNumber: initialData.contactNumber || "",
          emergencyPhone: initialData.emergencyPhone || "",
          userId: initialData.userId || "",
          isActive: initialData.isActive,
        }
      : {
          isActive: true,
          userId: "",
        },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = initialData
        ? await updatePerson(initialData.id, data)
        : await createPerson(data);

      if (res.error) throw new Error(res.error);

      toast.success(
        initialData ? "Resident updated successfully" : "Resident added successfully"
      );
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save resident");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register("fullName")} placeholder="e.g. Aung Kyaw" />
          {errors.fullName && (
            <p className="text-xs text-rose-600 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input id="roomNumber" {...register("roomNumber")} placeholder="e.g. A-101" />
          {errors.roomNumber && (
            <p className="text-xs text-rose-600 mt-1">{errors.roomNumber.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input id="contactNumber" {...register("contactNumber")} placeholder="09xxxxxxxxx" />
          {errors.contactNumber && (
            <p className="text-xs text-rose-600 mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="emergencyPhone">Emergency Phone</Label>
          <Input
            id="emergencyPhone"
            {...register("emergencyPhone")}
            placeholder="09xxxxxxxxx (optional)"
          />
          {errors.emergencyPhone && (
            <p className="text-xs text-rose-600 mt-1">{errors.emergencyPhone.message}</p>
          )}
        </div>
      </div>

      <label
        htmlFor="isActive"
        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2.5 cursor-pointer"
      >
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Active Resident</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Include in duty rotations and expense splits
          </p>
        </div>
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="h-4 w-4 rounded accent-[#002B5B] dark:accent-[#2D7DD2] cursor-pointer"
        />
      </label>

      {users && (
        <div className="pt-2 border-t border-[var(--border)]">
          <Label htmlFor="userId">Linked User Account</Label>
          <Select id="userId" {...register("userId")}>
            <option value="">None (No login account)</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name ? `${user.name} (${user.email})` : user.email}
              </option>
            ))}
          </Select>
          <p className="text-[11px] text-[var(--muted-foreground)] mt-1.5">
            Linked users receive automated garbage turn alerts and notifications.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-3 border-t border-[var(--border)]">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Resident"}
        </Button>
      </div>
    </form>
  );
}
