"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dormitoryFeeSchema } from "@/lib/validations";
import { createFee, updateFee } from "@/actions/fees";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof dormitoryFeeSchema>;

interface FeeFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
  initialData?: any;
}

export function FeeForm({ onSuccess, people, initialData }: FeeFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(dormitoryFeeSchema),
    defaultValues: initialData ? {
      personId: initialData.personId,
      amount: initialData.amount,
      paymentDate: new Date(initialData.paymentDate).toISOString().split("T")[0],
      periodStart: new Date(initialData.periodStart).toISOString().split("T")[0],
      periodEnd: new Date(initialData.periodEnd).toISOString().split("T")[0],
    } : {
      paymentDate: new Date().toISOString().split("T")[0],
      periodStart: new Date().toISOString().split("T")[0],
      periodEnd: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount)
      };

      const res = initialData 
        ? await updateFee(initialData.id, formattedData)
        : await createFee(formattedData);

      if (res.error) throw new Error(res.error);
      
      toast.success(initialData ? "Fee record updated successfully!" : "Fee record logged successfully!");
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save fee record");
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
        <Label htmlFor="amount">Amount (Ks)</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount", { setValueAs: (v) => v === "" ? undefined : Number(v) })} placeholder="150000" />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentDate">Payment Date</Label>
        <Input id="paymentDate" type="date" {...register("paymentDate")} />
        {errors.paymentDate && <p className="text-sm text-red-500">{errors.paymentDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="periodStart">Period Start Date</Label>
        <Input id="periodStart" type="date" {...register("periodStart")} />
        {errors.periodStart && <p className="text-sm text-red-500">{errors.periodStart.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="periodEnd">Period End Date</Label>
        <Input id="periodEnd" type="date" {...register("periodEnd")} />
        {errors.periodEnd && <p className="text-sm text-red-500">{errors.periodEnd.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Log Record"}
        </Button>
      </div>
    </form>
  );
}
