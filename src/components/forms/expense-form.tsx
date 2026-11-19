"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/lib/validations";
import { createExpense, updateExpense } from "@/actions/expenses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "@/i18n/routing";

type FormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
  initialData?: any;
}

export function ExpenseForm({ onSuccess, people, initialData }: ExpenseFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          amount: initialData.amount,
          expenseDate: new Date(initialData.expenseDate).toISOString().split("T")[0],
          description: initialData.description || "",
          sharedByIds: initialData.sharedBy?.map((p: any) => p.id) || [],
        }
      : {
          expenseDate: new Date().toISOString().split("T")[0],
          sharedByIds: people.map((p) => p.id),
        },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount),
      };

      const res = initialData
        ? await updateExpense(initialData.id, formattedData)
        : await createExpense(formattedData);

      if (res.error) throw new Error(res.error);

      toast.success(
        initialData ? "Expense updated successfully" : "Expense logged successfully"
      );
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save expense");
    }
  };

  const amountValue = Number(watch("amount")) || 0;
  const sharedByIdsValue = watch("sharedByIds") || [];
  const splitAmount =
    sharedByIdsValue.length > 0 ? amountValue / sharedByIdsValue.length : 0;
  const isAllSelected =
    people.length > 0 && sharedByIdsValue.length === people.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("sharedByIds", e.target.checked ? people.map((p) => p.id) : [], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <Label htmlFor="type">Category / Expense Type</Label>
          <Input
            id="type"
            list="expenseTypes"
            {...register("type")}
            placeholder="e.g. Electric Bill, Internet, Supplies"
          />
          <datalist id="expenseTypes">
            <option value="Electric Bill" />
            <option value="Internet Bill" />
            <option value="Water Bottle" />
            <option value="Garbage Collection" />
            <option value="Maintenance" />
            <option value="Utilities" />
          </datalist>
          {errors.type && (
            <p className="text-xs text-rose-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Total Amount (Ks)</Label>
          <Input
            id="amount"
            type="number"
            step="1"
            {...register("amount", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="25000"
          />
          {errors.amount && (
            <p className="text-xs text-rose-600 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="expenseDate">Date</Label>
          <Input id="expenseDate" type="date" {...register("expenseDate")} />
          {errors.expenseDate && (
            <p className="text-xs text-rose-600 mt-1">{errors.expenseDate.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            {...register("description")}
            placeholder="Short receipt note..."
          />
        </div>
      </div>

      {/* Shared By Split Selector */}
      <div className="space-y-2.5 pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Label className="mb-0">Shared By</Label>
          <span className="inline-flex items-center rounded-full bg-[#EAF6ED] dark:bg-[#2CA548]/15 border border-[#146B26]/15 px-2.5 py-0.5 text-xs font-bold text-[#146B26] dark:text-[#4ADE80] tabular-nums">
            {splitAmount > 0
              ? `${splitAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} Ks / person`
              : "0 Ks / person"}
          </span>
        </div>

        {people.length > 0 && (
          <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded accent-[#002B5B] dark:accent-[#2D7DD2] cursor-pointer"
            />
            Select All ({sharedByIdsValue.length}/{people.length})
          </label>
        )}

        <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
          {people.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-xs font-medium text-rose-600">
              No active residents found. Add residents first.
            </div>
          ) : (
            people.map((person) => (
              <label
                key={person.id}
                className="flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-lg hover:bg-[var(--surface)] transition-colors truncate"
              >
                <input
                  type="checkbox"
                  value={person.id}
                  {...register("sharedByIds")}
                  className="h-4 w-4 rounded accent-[#002B5B] dark:accent-[#2D7DD2] shrink-0 cursor-pointer"
                />
                <span className="truncate text-[var(--foreground)]">{person.fullName}</span>
              </label>
            ))
          )}
        </div>
        {errors.sharedByIds && (
          <p className="text-xs text-rose-600">{errors.sharedByIds.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-3 border-t border-[var(--border)]">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Log Expense"}
        </Button>
      </div>
    </form>
  );
}
