"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waterPurchaseSchema } from "@/lib/validations";
import { logWaterPurchase } from "@/actions/water";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

type FormData = z.input<typeof waterPurchaseSchema>;

interface WaterPurchaseFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
}

export function WaterPurchaseForm({ onSuccess, people }: WaterPurchaseFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(waterPurchaseSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split("T")[0],
      sharedByIds: people.map(p => p.id),
      quantity: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        quantity: Number(data.quantity),
        totalCost: Number(data.totalCost)
      };

      const res = await logWaterPurchase(formattedData);

      if (res.error) throw new Error(res.error);
      
      toast.success("Water purchase logged successfully!");
      reset();
      router.refresh();
      router.push('/water');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save purchase");
    }
  };

  const amountValue = watch("totalCost") || 0;
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (Bottles)</Label>
          <Input id="quantity" type="number" step="1" {...register("quantity", { valueAsNumber: true })} placeholder="1" />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalCost">Total Cost (Ks)</Label>
          <Input id="totalCost" type="number" step="0.01" {...register("totalCost", { valueAsNumber: true })} placeholder="2000" />
          {errors.totalCost && <p className="text-sm text-red-500">{errors.totalCost.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseDate">Purchase Date</Label>
        <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
        {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label>Shared By</Label>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-1 rounded-full border border-sky-100 dark:border-sky-500/20">
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
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
              Select All ({sharedByIdsValue.length}/{people.length})
            </label>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border border-white/20 bg-white/30 dark:bg-black/20 rounded-xl shadow-inner backdrop-blur-sm">
          {people.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-sm font-medium text-rose-500">
              No active people found!
            </div>
          ) : (
            people.map(person => (
              <label key={person.id} className="flex items-center gap-2 text-sm font-medium cursor-pointer p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                <input 
                  type="checkbox" 
                  value={person.id}
                  {...register("sharedByIds")}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                {person.fullName}
              </label>
            ))
          )}
        </div>
        {errors.sharedByIds && <p className="text-sm text-red-500">{errors.sharedByIds.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/water')} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Log Purchase"}
        </Button>
      </div>
    </form>
  );
}
