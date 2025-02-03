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
  material: z.string(),
  average_weight: z.number(),
  createdAt: z.date().optional(),
  operator: z.string(),
  shift: z.string(),
});

const inputFiltered = z.object({
  material: z.string().nullable(),
  first_date: z.date().nullable(),
  seccond_date: z.date().nullable(),
});

export type LoadRecord = z.infer<typeof loadRecord>;
export type DaySum = z.infer<typeof daySum>;
export type InputData = z.infer<typeof inputData>;
export type InputFiltered = z.infer<typeof inputFiltered>;
