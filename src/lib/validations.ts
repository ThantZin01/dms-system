import { z } from "zod";

export const personSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  contactNumber: z.string().optional(),
  emergencyPhone: z.string().optional(),
  roomNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  userId: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

export const garbageRecordSchema = z.object({
  personId: z.string().min(1, "Person is required"),
  dateThrown: z.string().or(z.date()),
  isTurn: z.boolean().optional(),
  notes: z.string().optional(),
});

export const dormitoryFeeSchema = z.object({
  personId: z.string().min(1, "Person is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentDate: z.string().or(z.date()),
  periodStart: z.string().or(z.date()),
  periodEnd: z.string().or(z.date()),
});

export const expenseSchema = z.object({
  type: z.string().min(1, "Type is required"),
  amount: z.number().positive("Amount must be positive"),
  expenseDate: z.string().or(z.date()),
  description: z.string().optional(),
  sharedByIds: z.array(z.string()).min(1, "At least one person must be selected"),
});

export const accountSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  role: z.enum(['ADMIN', 'STUDENT']),
});

export const waterBottleSchema = z.object({
  label: z.string().min(1, "Label is required"),
  status: z.enum(["FULL", "EMPTY"]),
});

export const waterPurchaseSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1"),
  totalCost: z.number().positive("Cost must be positive"),
  purchaseDate: z.string().or(z.date()),
  sharedByIds: z.array(z.string()).min(1, "At least one person must be selected"),
});
