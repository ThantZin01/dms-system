"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function ExpensesChart({ data }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 absolute inset-0">
        No expense data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
          width={80}
          tickFormatter={(value) => `${value} Ks`}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }} 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
