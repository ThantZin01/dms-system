"use client";

import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface ResponsiveDataViewProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  renderMobileCard: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  emptyState: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Dual-architecture Data View:
 * - Desktop (md+): Crisp high-density executive table with aligned headers & hover rhythm
 * - Mobile (<md): Native touch-optimized stacked card list (zero horizontal table scroll)
 */
export function ResponsiveDataView<T extends { id: string }>({
  data,
  columns,
  renderMobileCard,
  onRowClick,
  emptyState,
  footer,
}: ResponsiveDataViewProps<T>) {
  if (!data || data.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <>
      {/* DESKTOP EXECUTIVE TABLE */}
      <div className="hidden md:block surface-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--muted-foreground)] whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors duration-100",
                    onRowClick &&
                      "hover:bg-[#F1F5FA] dark:hover:bg-white/[0.03] cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3.5 align-middle",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.className
                      )}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footer && (
          <div className="border-t border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3">
            {footer}
          </div>
        )}
      </div>

      {/* MOBILE NATIVE CARD LIST */}
      <div className="md:hidden space-y-2.5">
        {data.map((item) => (
          <div key={item.id}>{renderMobileCard(item)}</div>
        ))}
        {footer && (
          <div className="surface-card rounded-xl px-4 py-3 text-xs">{footer}</div>
        )}
      </div>
    </>
  );
}
