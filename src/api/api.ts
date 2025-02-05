import axios, { AxiosResponse } from "axios";
import { DaySum, InputData, InputFiltered, LoadRecord } from "../types/types";

export const fetchLatest = async (): Promise<LoadRecord[]> => {
  const response: AxiosResponse<LoadRecord[]> = await axios.get<LoadRecord[]>(
    `${import.meta.env.VITE_API_URL}/api/cellulose/latest`
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
    `${import.meta.env.VITE_API_URL}/api/cellulose/day`
  );

  return response.data ?? null;
};

export const fetchFiltered = async (
  inputData: InputFiltered | undefined
): Promise<LoadRecord[]> => {
  const response: AxiosResponse<LoadRecord[]> = await axios.post<LoadRecord[]>(
    // `https://almox-manager-backend-development.up.railway.app/api/cellulose/filtered`,
    `${import.meta.env.VITE_API_URL}/api/cellulose/filtered`,
    inputData
  );

  const returnData = response.data.map((record) => ({
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  }));

  return returnData ?? null;
};

export const createNewRecord = async (
  inputData: InputData
): Promise<InputData> => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/cellulose`,
    inputData
  );

  return response.data;
};

export const DeleteRecord = async (inputData: { id: string }) => {
  const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/api/cellulose`,
    inputData
  );

  return response.data;
};
