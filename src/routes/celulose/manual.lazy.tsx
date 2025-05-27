import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Header from "../../components/header";
import Modal from "../../components/modal";
import {
  useCreateLoad,
  useDeleteLoad,
  useGetLatest,
  useGetSummary,
  useUpdateLoad,
} from "../../features/celulose/api/celulose.hooks";
import {
  GET_LATEST_KEY,
  GET_SUMMARY_KEY,
} from "../../features/celulose/api/celulose.keys";
import {
  ISODateToLocal,
  ISOTimeToLocal,
} from "../../utils/dateStringManipulator";

const CELULOSE_TYPE = [
  "Fibra Longa Klabin",
  "Fibra Curta Klabin",
  "Fibra Longa UPM PULP",
  "Fibra Longa Mercer",
  "Fibra Longa Rottneros",
] as const;
const OPERATORS = [
  "Aldo Vitorino da Silva",
  "Carlos Eduardo Aparecido Stetiski Dutra",
  "Felipe Rodrigues",
  "Luciano Hattanda Sugiyama",
  "Saimon de Matos Leandro",
] as const;
const SHIFTS = ["A", "B", "C", "D", "E"] as const;

const formSchema = z.object({
  id: z.string(),
  operator: z.enum(OPERATORS),
  shift: z.enum(SHIFTS),
  creation_date: z.string(),
  creation_time: z.string(),
  celluloseType: z.enum(CELULOSE_TYPE),
});

type FormFields = z.infer<typeof formSchema>;

function Manual() {
  const [open, setOpen] = useState(false);

  // query ytils
  const queryClient = useQueryClient();
  const {
    data: getLatestData,
    isError: isErrorGetLatest,
    error: errorGetLatest,
  } = useGetLatest();
  const { data: getSummaryData } = useGetSummary();
  const { mutate: mutateCreateLoad } = useCreateLoad([
    GET_LATEST_KEY,
    GET_SUMMARY_KEY,
  ]);
  const { mutate: mutateUpdateLoad } = useUpdateLoad([
    GET_LATEST_KEY,
    GET_SUMMARY_KEY,
  ]);
  const { mutate: mutateDeleteLoad } = useDeleteLoad([
    GET_LATEST_KEY,
    GET_SUMMARY_KEY,
  ]);

  // form utils
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (!confirm("Tem certeza que deseja adicionar um novo registro?")) {
      return;
    }

    const dateTimeString = `${data.creation_date} ${data.creation_time}:00`;

    const inputData = {
      material: data.celluloseType.toLowerCase(),
      id: data.id,
      average_weight: 3000,
      unit: "KG",
      created_at: dateTimeString,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      operator: data.operator.toLowerCase(),
      shift: data.shift,
    };

    mutateCreateLoad(inputData);
  };

  const onUpdate: SubmitHandler<FormFields> = (data) => {
    if (!confirm("Tem certeza que deseja editar esse registro?")) {
      return;
    }
    setOpen(false);

    const dateTimeString = `${data.creation_date} ${data.creation_time}:00`;

    const inputData = {
      material: data.celluloseType.toLowerCase(),
      id: data.id,
      average_weight: 3000,
      unit: "KG",
      created_at: dateTimeString,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      operator: data.operator.toLowerCase(),
      shift: data.shift,
    };

    mutateUpdateLoad(inputData);
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
          <fieldset className="mt-2">
            <div className="flex max-w-fit flex-col gap-x-8 sm:flex-row sm:items-end">
              <div>
                <label
                  htmlFor="recordDate"
                  className="mb-2 block text-xl font-medium"
                >
                  Data/Hora da carga
                </label>
                <div className="flex gap-2">
                  <input
                    {...register("creation_date")}
                    id="recordDate"
                    type="date"
                    className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                  <input
                    {...register("creation_time")}
                    id="recordDate"
                    type="time"
                    className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="mt-4 rounded-sm border border-gray-500 px-6 py-4">
            <legend className="text-xl">Selecione o tipo de celulose</legend>
            <div className="grid grid-cols-3 justify-between gap-2">
              {CELULOSE_TYPE.map((data) => {
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
            className="mb-6 me-2 mt-4 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-hidden focus:ring-2 focus:ring-yellow-300"
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
                  {getSummaryData?.map((summary) => {
                    return (
                      <span key={summary.material} className="block capitalize">
                        {summary.material}:{" "}
                        <span className="font-bold">
                          {summary.total_weight?.toLocaleString()} KG
                        </span>
                      </span>
                    );
                  })}
                </div>
                <button
                  className="hover:cursor-pointer p-1 bg-black max-w-fit max-h-fit rounded-full"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [GET_LATEST_KEY],
                    });
                    queryClient.invalidateQueries({
                      queryKey: [GET_SUMMARY_KEY],
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
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getLatestData?.map((loads) => {
                return (
                  <tr className="capitalize even:bg-[#e5e7eb]" key={loads.id}>
                    <td>{loads.material}</td>
                    <td>
                      {loads.average_weight} {loads.unit}
                    </td>
                    <td>{ISODateToLocal(loads.created_at)}</td>
                    <td>{ISOTimeToLocal(loads.created_at)}</td>
                    <td>{loads.operator}</td>
                    <td>{loads.shift}</td>
                    <td>
                      <Modal open={open} onOpenChange={setOpen}>
                        <Modal.Button
                          onClick={() => {
                            setValue("id", loads.id);
                          }}
                        >
                          <svg
                            className="w-6 h-6 text-black hover:cursor-pointer"
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
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                            />
                          </svg>
                        </Modal.Button>

                        <Modal.Content title="Editar Registro">
                          <form onSubmit={handleSubmit(onUpdate)}>
                            <div className="mb-4">
                              <fieldset className="mb-4 flex flex-col">
                                <label
                                  htmlFor="operator"
                                  className="mb-2 text-xl font-medium"
                                >
                                  Selecione o operador
                                </label>
                                <select
                                  {...register("operator", {
                                    required:
                                      "Informe o operador antes de registrar carga",
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
                                <label
                                  htmlFor="shift"
                                  className="mb-2 text-xl font-medium"
                                >
                                  Selecione o turno
                                </label>
                                <select
                                  {...register("shift", {
                                    required:
                                      "Informe o turno antes de registrar a carga",
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
                            <fieldset className="mt-2">
                              <div className="flex max-w-fit flex-col gap-x-8 sm:flex-row sm:items-end">
                                <div>
                                  <label
                                    htmlFor="recordDate"
                                    className="mb-2 block text-xl font-medium"
                                  >
                                    Data/Hora da carga
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      {...register("creation_date")}
                                      id="recordDate"
                                      type="date"
                                      className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                    <input
                                      {...register("creation_time")}
                                      id="recordDate"
                                      type="time"
                                      className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 focus:border-yellow-500 focus:ring-yellow-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                            <fieldset className="mt-4 rounded-sm border border-gray-500 px-6 py-4">
                              <legend className="text-xl">
                                Selecione o tipo de celulose
                              </legend>
                              <div className="grid grid-cols-3 justify-between gap-2">
                                {CELULOSE_TYPE.map((data) => {
                                  return (
                                    <div
                                      key={data}
                                      className="flex items-center gap-1"
                                    >
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
                              className="mb-6 me-2 mt-4 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-hidden focus:ring-2 focus:ring-yellow-300"
                            >
                              Salvar
                            </button>
                          </form>
                        </Modal.Content>
                      </Modal>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          mutateDeleteLoad({ id: loads.id });
                        }}
                        className="hover:cursor-pointer"
                      >
                        <svg
                          className="h-6 w-6 text-red-600"
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
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                          />
                        </svg>
                      </button>
                    </td>
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

export const Route = createLazyFileRoute("/celulose/manual")({
  component: Manual,
});
