import { z } from "zod";

// Response schemas for count endpoints
export const CountResponseSchema = z.object({
  count: z.number().int().nonnegative(),
});

// Type exports
export type CountResponse = z.infer<typeof CountResponseSchema>;