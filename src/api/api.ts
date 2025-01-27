import axios, { AxiosResponse } from "axios";

interface LoadRecord {
  id: string;
  material: string;
  average_weight: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
  operator: string;
  shift: string;
}

export const fetchLatest = async (): Promise<LoadRecord[]> => {
  const response: AxiosResponse<LoadRecord[]> = await axios.get<LoadRecord[]>(
    "http://127.0.0.1:8080/api/cellulose/latest"
  );

  const returnData = response.data.map((record) => ({
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  }));

  return returnData ?? null;
};
