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
import { useRouter } from "@/i18n/routing";
import { addMonths, format } from "date-fns";

type FormData = z.infer<typeof dormitoryFeeSchema>;

interface FeeFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
  initialData?: any;
}

export function FeeForm({ onSuccess, people, initialData }: FeeFormProps) {
  const router = useRouter();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const threeMonthsStr = format(addMonths(new Date(), 3), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(dormitoryFeeSchema),
    defaultValues: initialData
      ? {
          personId: initialData.personId,
          amount: initialData.amount,
          paymentDate: new Date(initialData.paymentDate).toISOString().split("T")[0],
          periodStart: new Date(initialData.periodStart).toISOString().split("T")[0],
          periodEnd: new Date(initialData.periodEnd).toISOString().split("T")[0],
        }
      : {
          paymentDate: todayStr,
          periodStart: todayStr,
          periodEnd: threeMonthsStr,
        },
  });

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("periodStart", val, { shouldValidate: true });
    if (!initialData && val) {
      const startDate = new Date(val);
      if (!isNaN(startDate.getTime())) {
        setValue("periodEnd", format(addMonths(startDate, 3), "yyyy-MM-dd"), {
          shouldValidate: true,
        });
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };

      const res = initialData
        ? await updateFee(initialData.id, formattedData)
        : await createFee(formattedData);

      if (res.error) throw new Error(res.error);

      toast.success(
        initialData ? "Fee payment updated" : "Fee payment recorded successfully"
      );
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save fee record");
    }
  };

  const periodStartField = register("periodStart");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="personId">Resident</Label>
        <Select id="personId" {...register("personId")}>
          <option value="">Select a resident</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </Select>
        {errors.personId && (
          <p className="text-xs text-rose-600 mt-1">{errors.personId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label htmlFor="amount">Amount (Ks)</Label>
          <Input
            id="amount"
            type="number"
            step="1"
            {...register("amount", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="150000"
          />
          {errors.amount && (
            <p className="text-xs text-rose-600 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="paymentDate">Payment Date</Label>
          <Input id="paymentDate" type="date" {...register("paymentDate")} />
          {errors.paymentDate && (
            <p className="text-xs text-rose-600 mt-1">{errors.paymentDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[var(--border)]">
        <div>
          <Label htmlFor="periodStart">Coverage Start</Label>
          <Input
            id="periodStart"
            type="date"
            {...periodStartField}
            onChange={(e) => {
              periodStartField.onChange(e);
              handleStartChange(e);
            }}
          />
          {errors.periodStart && (
            <p className="text-xs text-rose-600 mt-1">{errors.periodStart.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="periodEnd">Coverage End (+3 mos)</Label>
          <Input id="periodEnd" type="date" {...register("periodEnd")} />
          {errors.periodEnd && (
            <p className="text-xs text-rose-600 mt-1">{errors.periodEnd.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-[var(--border)]">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Record Payment"}
        </Button>
      </div>
    </form>
  );
}
