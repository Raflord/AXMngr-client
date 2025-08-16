import { AxiosResponse } from "axios";
import { axios } from "../../../api/axios";
import {
  InputData,
  Load,
  LoadFiltered,
  LoadSummary,
} from "../../../types/celulose/celulose.types";

const ENDPOINT = "/celulose";

export const fetchLatest = async (): Promise<Load[]> => {
  const response: AxiosResponse<Load[]> = await axios.get<Load[]>(
    `${ENDPOINT}/latest`
  );

  return response.data ?? null;
};

export const fetchSummary = async (): Promise<LoadSummary[]> => {
  const response: AxiosResponse<LoadSummary[]> = await axios.get<LoadSummary[]>(
    `${ENDPOINT}/day`
  );

  return response.data ?? null;
};

export const fetchFiltered = async (
  inputData: LoadFiltered | undefined
): Promise<Load[]> => {
  const response: AxiosResponse<Load[]> = await axios.post<Load[]>(
    `${ENDPOINT}/filtered`,
    inputData
  );

  return response.data ?? null;
};

export const createLoad = async (inputData: InputData): Promise<InputData> => {
  const response = await axios.post(ENDPOINT, inputData);

  return response.data;
};

export const updateLoad = async (inputData: InputData): Promise<InputData> => {
  const response = await axios.put(`${ENDPOINT}/${inputData.id}`, inputData);

  return response.data;
};

export const deleteLoad = async (inputData: { id: string }) => {
  const response = await axios.delete(`${ENDPOINT}/${inputData.id}`);

  return response.data;
};
