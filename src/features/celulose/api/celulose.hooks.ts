import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  InputData,
  LoadFiltered,
} from "../../../types/celulose/celulose.types";
import {
  GET_FILTERED_KEY,
  GET_LATEST_KEY,
  GET_SUMMARY_KEY,
  MUTATE_CREATE_KEY,
  MUTATE_DELETE_KEY,
  MUTATE_UPDATE_KEY,
} from "./celulose.keys";
import {
  createLoad,
  deleteLoad,
  fetchFiltered,
  fetchLatest,
  fetchSummary,
  updateLoad,
} from "./celulose.requests";

export function useGetLatest() {
  return useQuery({
    queryKey: [GET_LATEST_KEY],
    queryFn: async () => {
      return await fetchLatest();
    },
  });
}

export function useGetSummary() {
  return useQuery({
    queryKey: [GET_SUMMARY_KEY],
    queryFn: async () => {
      return await fetchSummary();
    },
  });
}

export function useGetFiltered(queryData: LoadFiltered | undefined) {
  return useQuery({
    queryKey: [GET_FILTERED_KEY, queryData],
    queryFn: async () => {
      return await fetchFiltered(queryData);
    },
    enabled: !!queryData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}

export function useCreateLoad(invalidateKey: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATE_CREATE_KEY],
    mutationFn: async (inputData: InputData) => {
      return await createLoad(inputData);
    },
    onSuccess: () => {
      invalidateKey.map((key) => {
        void queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      alert(
        `Erro ao registrar carga! Por favor tente novamente.\nErro: ${error.message}`
      );
    },
  });
}

export function useUpdateLoad(invalidateKey: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATE_UPDATE_KEY],
    mutationFn: async (inputData: InputData) => {
      return await updateLoad(inputData);
    },
    onSuccess: () => {
      invalidateKey.map((key) => {
        void queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      alert(
        `Erro ao editar carga! Por favor tente novamente.\nErro: ${error.message}`
      );
    },
  });
}

export function useDeleteLoad(invalidateKey: string[]) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATE_DELETE_KEY],
    mutationFn: async (inputData: { id: string }) => {
      return await deleteLoad(inputData);
    },
    onSuccess: () => {
      invalidateKey.map((key) => {
        void queryClient.invalidateQueries({ queryKey: [key] });
      });
    },
    onError: (error) => {
      alert(
        `Erro ao remover carga! Por favor tente novamente.\nErro: ${error.message}`
      );
    },
  });
}
