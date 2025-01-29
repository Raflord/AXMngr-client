import { z } from "zod";

const loadRecord = z.object({
  id: z.string(),
  material: z.string(),
  average_weight: z.number(),
  unit: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  operator: z.string(),
  shift: z.string(),
});

const daySum = z.object({
  material: z.string(),
  total_weight: z.number(),
});

const inputData = z.object({
  material: z.string().optional(),
  average_weight: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  operator: z.string().optional(),
  shift: z.string().optional(),
});

export type LoadRecord = z.infer<typeof loadRecord>;
export type DaySum = z.infer<typeof daySum>;
export type InputData = z.infer<typeof inputData>;
