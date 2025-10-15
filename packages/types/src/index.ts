import { z } from "zod";

/**
 * Job status enum
 */
export const JobStatusSchema = z.enum([
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

/**
 * User schema & type
 */
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date().optional(), // optional updatedAt
});
export type User = z.infer<typeof UserSchema>;

/**
 * Job schema & type
 */
export const JobSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  status: JobStatusSchema,
  payload: z.record(z.string(), z.any()),
  result: z.any().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});
export type Job = z.infer<typeof JobSchema>;

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Utility: wrap result
 */
export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function err<T = unknown>(error: string): ApiResponse<T> {
  return { success: false, error };
}
