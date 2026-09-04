"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/lib/validations";
import { createExpense, updateExpense } from "@/actions/expenses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

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
    defaultValues: initialData ? {
      type: initialData.type,
      amount: initialData.amount,
      expenseDate: new Date(initialData.expenseDate).toISOString().split("T")[0],
      description: initialData.description || "",
      sharedByIds: initialData.sharedBy?.map((p: any) => p.id) || [],
    } : {
      expenseDate: new Date().toISOString().split("T")[0],
      sharedByIds: people.map(p => p.id),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        amount: Number(data.amount)
      };

      const res = initialData 
        ? await updateExpense(initialData.id, formattedData)
        : await createExpense(formattedData);

      if (res.error) throw new Error(res.error);
      
      toast.success(initialData ? "Expense updated successfully!" : "Expense logged successfully!");
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save expense");
    }
  };

  const amountValue = watch("amount") || 0;
  const sharedByIdsValue = watch("sharedByIds") || [];
  const splitAmount = sharedByIdsValue.length > 0 ? (amountValue / sharedByIdsValue.length) : 0;
  
  const isAllSelected = people.length > 0 && sharedByIdsValue.length === people.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setValue("sharedByIds", people.map(p => p.id), { shouldValidate: true, shouldDirty: true });
    } else {
      setValue("sharedByIds", [], { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="type">Expense Type</Label>
        <Input id="type" list="expenseTypes" {...register("type")} placeholder="e.g. Internet Bill, Water Bottle" />
        <datalist id="expenseTypes">
          <option value="Water Bottle" />
          <option value="Electric Bill" />
          <option value="Garbage Collection" />
          <option value="Utilities" />
        </datalist>
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (Ks)</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount", { setValueAs: (v) => v === "" ? undefined : Number(v) })} placeholder="5000" />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expenseDate">Date</Label>
        <Input id="expenseDate" type="date" {...register("expenseDate")} />
        {errors.expenseDate && <p className="text-sm text-red-500">{errors.expenseDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" {...register("description")} placeholder="Notes..." />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label>Shared By</Label>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
            Split Amount: {splitAmount > 0 ? splitAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 0} Ks / person
          </span>
        </div>
        
        {people.length > 0 && (
          <div className="flex items-center pb-2">
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-gray-700 dark:text-gray-300">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              Select All ({sharedByIdsValue.length}/{people.length})
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border border-white/20 bg-white/30 dark:bg-black/20 rounded-xl shadow-inner backdrop-blur-sm">
          {people.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-sm font-medium text-rose-500">
              No active people found! Please add people to the dormitory first.
            </div>
          ) : (
            people.map(person => (
              <label key={person.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                <input 
                  type="checkbox" 
                  value={person.id}
                  {...register("sharedByIds")}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                {person.fullName}
              </label>
            ))
          )}
        </div>
        {errors.sharedByIds && <p className="text-sm text-red-500">{errors.sharedByIds.message}</p>}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Log Expense"}
        </Button>
      </div>
    </form>
  );
}
