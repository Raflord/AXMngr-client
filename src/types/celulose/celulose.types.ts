import { z } from "zod";

const load = z.object({
  id: z.string(),
  material: z.string(),
  average_weight: z.number(),
  unit: z.string(),
  created_at: z.string(),
  timezone: z.string(),
  operator: z.string(),
  shift: z.string(),
});

const loadSummary = z.object({
  material: z.string(),
  total_weight: z.number(),
});

const inputData = z.object({
  id: z.string().optional(),
  material: z.string(),
  average_weight: z.number(),
  created_at: z.string(),
  timezone: z.string(),
  operator: z.string(),
  shift: z.string(),
});

const loadFiltered = z.object({
  material: z.string().nullable(),
  first_date: z.string().nullable(),
  seccond_date: z.string().nullable(),
});

export type Load = z.infer<typeof load>;
export type LoadSummary = z.infer<typeof loadSummary>;
export type InputData = z.infer<typeof inputData>;
export type LoadFiltered = z.infer<typeof loadFiltered>;
