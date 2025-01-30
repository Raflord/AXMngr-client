import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { utils, writeFile } from "xlsx";
import { z } from "zod";
import { fetchFiltered } from "../api/api";
import Header from "../components/header";
import { InputFiltered } from "../types/types";

const CELLULOSE_TYPE = [
  "",
  "Fibra Longa Klabin",
  "Fibra Curta Klabin",
  "Fibra Longa UPM PULP",
  "Fibra Longa Mercer",
  "Fibra Longa Rottneros",
] as const;

const formSchema = z.object({
  celluloseType: z.enum(CELLULOSE_TYPE),
  firstDate: z.date().optional(),
  seccondDate: z.date().optional(),
});

type FormFields = z.infer<typeof formSchema>;

function Report() {
  // query utils
  const [queryData, setqueryData] = useState<InputFiltered>();

  const {
    data: getFilteredData,
    isFetching: isFetchingFiltered,
    isError: isErrorFiltered,
    error: errorFiltered,
  } = useQuery({
    queryKey: ["getFiltered", queryData],
    queryFn: async () => {
      return await fetchFiltered(queryData);
    },
    enabled: !!queryData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  // form utils
  const { register, handleSubmit } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const d: InputFiltered = {
      material: "",
      first_date: null,
      seccond_date: null,
    };
    if (data.celluloseType) d.material = data.celluloseType;
    if (data.firstDate) d.first_date = new Date(data.firstDate);
    if (data.seccondDate) d.seccond_date = new Date(data.seccondDate);

    setqueryData(d);
  };

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Header />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <fieldset className="flex flex-col">
              <label htmlFor="celluloseType" className="mb-2 text-lg">
                Selecione o tipo de celulose
              </label>
              <select
                {...register("celluloseType")}
                id="celluloseType"
                className="mb-4 w-full max-w-fit rounded-lg border border-gray-500 bg-gray-200 p-2 focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Todos</option>
                <option value="Fibra Longa Klabin">Fibra Longa Klabin</option>
                <option value="Fibra Curta Klabin">Fibra Curta Klabin</option>
                <option value="Fibra Longa UPM PULP">
                  Fibra Longa UPM PULP
                </option>
                <option value="Fibra Longa Mercer">Fibra Longa Mercer</option>
                <option value="Fibra Longa Rottneros">
                  Fibra Longa Rottneros
                </option>
              </select>
            </fieldset>
            <fieldset>
              <div className="flex max-w-fit flex-col gap-x-8 sm:flex-row sm:items-end">
                <div>
                  <label htmlFor="firstDate" className="block text-lg">
                    Data inicial
                  </label>
                  <input
                    {...register("firstDate")}
                    id="firstDate"
                    type="datetime-local"
                    className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
                <div className="mt-2 font-bold">Até</div>
                <div>
                  <label htmlFor="seccondDate" className="block text-lg">
                    Data final
                  </label>
                  <input
                    {...register("seccondDate")}
                    id="seccondDate"
                    type="datetime-local"
                    className="block w-full rounded-lg border border-gray-500 bg-gray-200 px-4 py-2 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          {isFetchingFiltered ? (
            <button
              disabled
              type="button"
              className="mb-8 mt-4 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="me-3 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
              Buscando...
            </button>
          ) : isErrorFiltered ? (
            <button className="mb-2 mt-4 max-w-80 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-yellow-300">
              {errorFiltered.message}
            </button>
          ) : (
            <button
              type="submit"
              className="mb-8 mt-4 max-w-28 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Buscar
            </button>
          )}
        </form>
        <button
          onClick={() => {
            if (!getFilteredData) return;
            const formatedData = getFilteredData.map((row) => {
              return {
                material: row.material?.toUpperCase(),
                peso_medio: row.average_weight,
                unidade_medida: row.unit,
                data: row.createdAt?.toLocaleDateString(),
                hora: row.createdAt?.toLocaleTimeString(),
                operador: row.operator.toUpperCase(),
                turno: row.shift.toUpperCase(),
              };
            });

            const worksheet = utils.json_to_sheet(formatedData);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet);
            writeFile(workbook, "export.xlsx", { compression: true });
          }}
          type="button"
          className="me-2 inline-flex max-w-fit items-center rounded-full bg-green-700 p-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <svg
            className="h-5 w-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"
            />
          </svg>
          <span className="sr-only">Icon description</span>
        </button>
        <table className="my-6 block overflow-x-auto md:table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Peso Medio</th>
              <th>UM</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Operador</th>
              <th>Turno</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredData?.map((record) => {
              return (
                <tr className="capitalize even:bg-[#e5e7eb]" key={record.id}>
                  <td>{record.material}</td>
                  <td>{record.average_weight}</td>
                  <td>{record.unit}</td>
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
      </main>
    </>
  );
}

export const Route = createLazyFileRoute("/report")({
  component: Report,
});
