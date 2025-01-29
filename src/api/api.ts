import axios, { AxiosResponse } from "axios";
import { DaySum, InputData, LoadRecord } from "../types/types";

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

export const fetchDay = async (): Promise<DaySum[]> => {
  const response: AxiosResponse<DaySum[]> = await axios.get<DaySum[]>(
    "http://127.0.0.1:8080/api/cellulose/day"
  );

  return response.data ?? null;
};

export const createNewRecord = async (
  inputData: InputData
): Promise<InputData> => {
  const response = await axios.post(
    "http://127.0.0.1:8080/api/cellulose",
    inputData
  );

  return response.data;
};
