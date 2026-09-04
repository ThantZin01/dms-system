"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema } from "@/lib/validations";
import { createPerson, updatePerson } from "@/actions/people";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.input<typeof personSchema>;

export function PersonForm({ onSuccess, initialData, users }: { onSuccess?: () => void, initialData?: any, users?: any[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData ? {
      fullName: initialData.fullName,
      roomNumber: initialData.roomNumber || "",
      contactNumber: initialData.contactNumber || "",
      emergencyPhone: initialData.emergencyPhone || "",
      userId: initialData.userId || "",
      isActive: initialData.isActive,
    } : {
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
      
      toast.success(initialData ? "Person updated successfully!" : "Person added successfully!");
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save person");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...register("fullName")} placeholder="John Doe" />
        {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomNumber">Room Number</Label>
        <Input id="roomNumber" {...register("roomNumber")} placeholder="A101" />
        {errors.roomNumber && <p className="text-sm text-red-500">{errors.roomNumber.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input id="contactNumber" {...register("contactNumber")} placeholder="09xxxxxxxxx" />
        {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="emergencyPhone">Emergency Phone</Label>
        <Input id="emergencyPhone" {...register("emergencyPhone")} placeholder="09xxxxxxxxx" />
        {errors.emergencyPhone && <p className="text-sm text-red-500">{errors.emergencyPhone.message}</p>}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="isActive"
          {...register("isActive")}
          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
        <Label htmlFor="isActive">Active Member</Label>
      </div>

      {users && (
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Label htmlFor="userId" className="text-gray-700 dark:text-gray-300">Linked User Account</Label>
          <select
            id="userId"
            {...register("userId")}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">-- None (No Account) --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name ? `${user.name} (${user.email})` : user.email}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Linking a user account allows them to receive notifications for garbage duty and fees.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Add Person"}
        </Button>
      </div>
    </form>
  );
}
