import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { createNewRecord, fetchDay, fetchLatest } from "../api/api";
import Header from "../components/header";
import { InputData } from "../types/types";

const CELLULOSE_TYPE = [
  "Fibra Longa Klabin",
  "Fibra Curta Klabin",
  "Fibra Longa UPM PULP",
  "Fibra Longa Mercer",
  "Fibra Longa Rottneros",
] as const;
const OPERATORS = ["Rafael Wrobel", "Wagner Lima"] as const;
const SHIFTS = ["A", "B", "C", "D", "E", "ADM"] as const;

const formSchema = z.object({
  operator: z.enum(OPERATORS),
  shift: z.enum(SHIFTS),
  celluloseType: z.enum(CELLULOSE_TYPE),
});

type FormFields = z.infer<typeof formSchema>;

function Cellulose() {
  // query ytils
  const queryClient = useQueryClient();
  const {
    data: getLatestData,
    isError: isErrorGetLatest,
    error: errorGetLatest,
  } = useQuery({
    queryKey: ["getLatest"],
    queryFn: async () => {
      return await fetchLatest();
    },
  });

  const { data: getDayData } = useQuery({
    queryKey: ["getDay"],
    queryFn: async () => {
      return await fetchDay();
    },
  });

  const { mutate: createRecord } = useMutation({
    mutationKey: ["createRecord"],
    mutationFn: async (inputData: InputData) => {
      return await createNewRecord(inputData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["getLatest"] });
      void queryClient.invalidateQueries({ queryKey: ["getDay"] });
    },
    onError: (error) => {
      alert(
        `Erro ao registrar carga! Por favor tente novamente.\nErro: ${error.message}`
      );
    },
  });

  // form utils
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!confirm("Tem certeza que deseja adicionar um novo registro?")) {
      return;
    }

    const inputData = {
      material: data.celluloseType.toLowerCase(),
      average_weight: 3000,
      unit: "KG",
      operator: data.operator.toLowerCase(),
      shift: data.shift,
    };

    createRecord(inputData);
  };

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Header />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <fieldset className="mb-4 flex flex-col">
              <label htmlFor="operator" className="mb-2 text-xl font-medium">
                Selecione o operador
              </label>
              <select
                {...register("operator", {
                  required: "Informe o operador antes de registrar carga",
                })}
                id="operator"
                className="w-full max-w-fit rounded-lg border border-gray-500 bg-gray-200 p-2 focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Operador</option>
                {OPERATORS.map((data) => {
                  return (
                    <option key={data} value={data}>
                      {data}
                    </option>
                  );
                })}
              </select>
              {errors.operator && (
                <span className="font-bold text-red-500">
                  {errors.operator.message}
                </span>
              )}
            </fieldset>
            <fieldset className="flex flex-col">
              <label htmlFor="shift" className="mb-2 text-xl font-medium">
                Selecione o turno
              </label>
              <select
                {...register("shift", {
                  required: "Informe o turno antes de registrar a carga",
                })}
                id="shift"
                className="w-full max-w-fit rounded-lg border border-gray-500 bg-gray-200 p-2 focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Turno</option>
                {SHIFTS.map((data) => {
                  return (
                    <option key={data} value={data}>
                      Turno {data}
                    </option>
                  );
                })}
              </select>
              {errors.shift && (
                <span className="font-bold text-red-500">
                  {errors.shift.message}
                </span>
              )}
            </fieldset>
          </div>
          <fieldset className="mt-4 rounded border border-gray-500 px-6 py-4">
            <legend className="text-xl">Selecione o tipo de celulose</legend>
            <div className="grid grid-cols-3 justify-between gap-2">
              {CELLULOSE_TYPE.map((data) => {
                return (
                  <div key={data} className="flex items-center gap-1">
                    <input
                      {...register("celluloseType", {
                        required:
                          "informe o tipo de celulose antes de registrar a carga",
                      })}
                      type="radio"
                      name="celluloseType"
                      id={data}
                      value={data}
                    />
                    <label htmlFor={data}>{data}</label>
                  </div>
                );
              })}
            </div>
          </fieldset>
          {errors.celluloseType && (
            <span className="block font-bold text-red-500">
              {errors.celluloseType.message}
            </span>
          )}
          <button
            type="submit"
            className="mb-6 me-2 mt-4 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Registrar carga
          </button>
        </form>
        {isErrorGetLatest ? (
          <span className="text-red-500">
            Erro os buscar as informações de consumo.
            <br /> Erro: {errorGetLatest.message}
          </span>
        ) : (
          <table className="my-6 block overflow-x-auto md:table">
            <caption className="mb-2 text-left">
              <p>
                Total do dia
                <span className="font-bold">
                  {" "}
                  ({new Date().toLocaleDateString()}):
                </span>
              </p>
              <div className="flex justify-between">
                <div>
                  {getDayData?.map((record) => {
                    return (
                      <span key={record.material} className="block capitalize">
                        {record.material}:{" "}
                        <span className="font-bold">
                          {record.total_weight?.toLocaleString()} KG
                        </span>
                      </span>
                    );
                  })}
                </div>
                <button
                  className="p-1 bg-black max-w-fit max-h-fit rounded-full"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["getLatest"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["getDay"],
                    });
                  }}
                >
                  <svg
                    className="text-white w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                    />
                  </svg>
                </button>
              </div>
            </caption>
            <thead>
              <tr>
                <th>Material</th>
                <th>Peso Medio</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Operador</th>
                <th>Turno</th>
              </tr>
            </thead>
            <tbody>
              {getLatestData?.map((record) => {
                return (
                  <tr className="capitalize even:bg-[#e5e7eb]" key={record.id}>
                    <td>{record.material}</td>
                    <td>
                      {record.average_weight} {record.unit}
                    </td>
                    <td>{record.createdAt?.toLocaleDateString("pt-BR")}</td>
                    <td>
                      {record.createdAt?.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{record.operator}</td>
                    <td>{record.shift}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}

export const Route = createLazyFileRoute("/cellulose")({
  component: Cellulose,
});
