"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { garbageRecordSchema } from "@/lib/validations";
import { createGarbageRecord, updateGarbageRecord } from "@/actions/garbage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof garbageRecordSchema>;

interface GarbageFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
  upNextId?: string;
  initialData?: any;
}

export function GarbageForm({ onSuccess, people, upNextId, initialData }: GarbageFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(garbageRecordSchema),
    defaultValues: initialData ? {
      personId: initialData.personId,
      dateThrown: new Date(initialData.dateThrown).toISOString().split("T")[0],
      notes: initialData.notes || "",
    } : {
      personId: upNextId || "",
      dateThrown: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = initialData 
        ? await updateGarbageRecord(initialData.id, data)
        : await createGarbageRecord(data);

      if (res.error) throw new Error(res.error);
      
      toast.success(initialData ? "Garbage record updated successfully!" : "Garbage record logged successfully!");
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save garbage record");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="personId">Person</Label>
        <Select id="personId" {...register("personId")}>
          <option value="">Select a person</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </Select>
        {errors.personId && <p className="text-sm text-red-500">{errors.personId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateThrown">Date Thrown</Label>
        <Input id="dateThrown" type="date" {...register("dateThrown")} />
        {errors.dateThrown && <p className="text-sm text-red-500">{errors.dateThrown.message}</p>}
      </div>



      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input id="notes" {...register("notes")} placeholder="Missed last week..." />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Log Record"}
        </Button>
      </div>
    </form>
  );
}
