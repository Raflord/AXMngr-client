import { z } from "zod";

const load = z.object({
  id: z.string(),
  material: z.string(),
  averageWeight: z.number(),
  unit: z.string(),
  createdAt: z.string(),
  timezone: z.string(),
  operator: z.string(),
  shift: z.string(),
});

const loadSummary = z.object({
  material: z.string(),
  totalWeight: z.number(),
});

const inputData = z.object({
  id: z.string().optional(),
  material: z.string(),
  averageWeight: z.number(),
  createdAt: z.string(),
  timezone: z.string(),
  operator: z.string(),
  shift: z.string(),
});

const loadFiltered = z.object({
  material: z.string().nullable(),
  firstDate: z.string().nullable(),
  secondDate: z.string().nullable(),
});

export type Load = z.infer<typeof load>;
export type LoadSummary = z.infer<typeof loadSummary>;
export type InputData = z.infer<typeof inputData>;
export type LoadFiltered = z.infer<typeof loadFiltered>;
