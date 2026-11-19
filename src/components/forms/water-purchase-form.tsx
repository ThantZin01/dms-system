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
import { useRouter } from "@/i18n/routing";

type FormData = z.input<typeof waterPurchaseSchema>;

interface WaterPurchaseFormProps {
  onSuccess?: () => void;
  people: { id: string; fullName: string }[];
  defaultQuantity?: number;
}

export function WaterPurchaseForm({
  onSuccess,
  people,
  defaultQuantity = 1,
}: WaterPurchaseFormProps) {
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
      sharedByIds: people.map((p) => p.id),
      quantity: defaultQuantity,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        quantity: Number(data.quantity),
        totalCost: Number(data.totalCost),
      };

      const res = await logWaterPurchase(formattedData);
      if (res.error) throw new Error(res.error);

      toast.success("Water restock logged & bottles refilled");
      reset();
      router.refresh();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save restock");
    }
  };

  const amountValue = Number(watch("totalCost")) || 0;
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
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <Label htmlFor="quantity">Bottles Refilled</Label>
          <Input
            id="quantity"
            type="number"
            step="1"
            min="1"
            {...register("quantity", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="1"
          />
          {errors.quantity && (
            <p className="text-xs text-rose-600 mt-1">{errors.quantity.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="totalCost">Total Cost (Ks)</Label>
          <Input
            id="totalCost"
            type="number"
            step="1"
            {...register("totalCost", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            placeholder="2000"
          />
          {errors.totalCost && (
            <p className="text-xs text-rose-600 mt-1">{errors.totalCost.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="purchaseDate">Purchase Date</Label>
        <Input id="purchaseDate" type="date" {...register("purchaseDate")} />
        {errors.purchaseDate && (
          <p className="text-xs text-rose-600 mt-1">{errors.purchaseDate.message}</p>
        )}
      </div>

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

        <div className="grid grid-cols-2 gap-1.5 max-h-[150px] overflow-y-auto p-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
          {people.length === 0 ? (
            <div className="col-span-2 py-4 text-center text-xs font-medium text-rose-600">
              No active residents found.
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
          {isSubmitting ? "Saving..." : "Log Restock"}
        </Button>
      </div>
    </form>
  );
}
