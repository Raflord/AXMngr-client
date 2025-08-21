import { Confirm } from "@/components/ConfirmDialog";
import { DynamicForm } from "@/components/DynamicForm";
import { EditDialog } from "@/components/EditDialog";
import { Navbar } from "@/components/Navbar";
import { SimpleTable } from "@/components/SimpleTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Download, LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { z } from "zod";
import {
  useDeleteLoad,
  useGetFiltered,
  useUpdateLoad,
} from "../../features/celulose/api/celulose.hooks";
import { GET_FILTERED_KEY } from "../../features/celulose/api/celulose.keys";
import { Load, LoadFiltered } from "../../types/celulose/celulose.types";
import {
  ISODateToLocal,
  ISOTimeToLocal,
} from "../../utils/date-string-manipulator";

const OPERATORS = [
  { label: "Aldo Vitorino da Silva", value: "aldo vitorino da silva" },
  {
    label: "Carlos Eduardo Aparecido Stetiski Dutra",
    value: "carlos eduardo aparecido stetiski dutra",
  },
  { label: "Felipe Rodrigues", value: "felipe rodrigues" },
  { label: "Luciano Hattanda Sugiyama", value: "luciano hattanda sugiyama" },
  { label: "Saimon de Matos Leandro", value: "saimon de matos leandro" },
];

const SHIFTS = [
  { label: "Turno A", value: "a" },
  { label: "Turno B", value: "b" },
  { label: "Turno C", value: "c" },
  { label: "Turno D", value: "d" },
  { label: "Turno E", value: "e" },
];

const CELULOSE_TYPE = [
  { label: "Todos", value: "all" },
  { label: "Fibra Longa Klabin", value: "fibra longa klabin" },
  { label: "Fibra Curta Klabin", value: "fibra curta klabin" },
  { label: "Fibra Longa UPM PULP", value: "fibra longa upm pulp" },
  { label: "Fibra Longa Mercer", value: "fibra longa mercer" },
  { label: "Fibra Longa Rottneros", value: "fibra longa rottneros" },
];

const searchFormSchema = z.object({
  celuloseType: z.string().optional(),
  firstDate: z.string().optional(),
  seccondDate: z.string().optional(),
});

const updateFormSchema = z.object({
  operator: z.string({ message: "Selecione um operador" }),
  shift: z.string({ message: "Selecione um turno" }),
  celuloseType: z.string({ message: "Selecione um tipo de celulose" }),
  createdAt: z.string({ message: "Selecione a data e hora" }),
});

type SearchFormFields = z.infer<typeof searchFormSchema>;
type UpdateFormFields = z.infer<typeof updateFormSchema>;

function Relatorio() {
  // query utils
  const [queryData, setQueryData] = useState<LoadFiltered>();

  const { mutate: mutateDeleteLoad } = useDeleteLoad([GET_FILTERED_KEY]);

  const { mutate: mutateUpdateLoad } = useUpdateLoad([GET_FILTERED_KEY]);

  const {
    data: getFilteredData,
    isFetching: isFetchingFiltered,
    isError: isErrorFiltered,
    error: errorFiltered,
  } = useGetFiltered(queryData);

  const handleSearch = (data: SearchFormFields) => {
    const inputData: LoadFiltered = {
      material: "",
      firstDate: null,
      seccondDate: null,
    };
    if (data.celuloseType) inputData.material = data.celuloseType;
    if (data.firstDate) inputData.firstDate = data.firstDate;
    if (data.seccondDate) inputData.seccondDate = data.seccondDate;
    if (data.celuloseType === "all") {
      inputData.material = "";
    }

    setQueryData(inputData);
  };

  const handleUpdate = (id: string, data: UpdateFormFields) => {
    const inputData = {
      id: id,
      material: data.celuloseType,
      averageWeight: 3000,
      unit: "KG",
      createdAt: data.createdAt,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      operator: data.operator,
      shift: data.shift,
    };

    mutateUpdateLoad(inputData);
  };

  return (
    <>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Navbar />
        <DynamicForm
          styles="space-y-8 my-6"
          schema={searchFormSchema}
          submitText="Buscar"
          fields={[
            {
              name: "celuloseType",
              label: "Material",
              placeholder: "Todos",
              type: "customSelect",
              description: "Selecionar tipo de celulose",
              options: CELULOSE_TYPE,
            },
            {
              name: "firstDate",
              label: "Data inicial",
              type: "date",
            },
            {
              name: "seccondDate",
              label: "Data final",
              type: "date",
            },
          ]}
          onSubmit={async (formValues: SearchFormFields) => {
            handleSearch(formValues);
          }}
        />
        {isFetchingFiltered ? (
          <div className="flex space-x-2">
            <LoaderCircle className="animate-spin" />
            <span className="animate-caret-blink">Buscando...</span>
          </div>
        ) : isErrorFiltered ? (
          <>{errorFiltered.message}</>
        ) : (
          <></>
        )}
        {getFilteredData && (
          <Button
            onClick={async () => {
              const ok = await Confirm({
                title: "Download",
                description: "Tem certeza que deseja baixar o arquivo em .xlsx",
                confirmText: "Baixar",
                cancelText: "Cancelar",
                buttonVariant: "default",
              });

              if (!ok) return;

              if (!getFilteredData) return;
              const formatedData = getFilteredData.map((row) => {
                return {
                  material: row.material?.toUpperCase(),
                  pesoMedio: row.averageWeight,
                  unidadeMedida: row.unit,
                  data: ISODateToLocal(row.createdAt),
                  hora: ISOTimeToLocal(row.createdAt),
                  operador: row.operator.toUpperCase(),
                  turno: row.shift.toUpperCase(),
                };
              });

              const worksheet = utils.json_to_sheet(formatedData);
              const workbook = utils.book_new();
              utils.book_append_sheet(workbook, worksheet);
              writeFile(workbook, "export.xlsx", { compression: true });
            }}
            className="max-y-fit max-w-fit rounded-full"
          >
            <Download />
          </Button>
        )}
        <div>
          {getFilteredData && (
            <SimpleTable<Load>
              headers={[
                "Material",
                "Peso Médio",
                "Data",
                "Hora",
                "Operador",
                "Turno",
                "Editar",
                "Remover",
              ]}
              renderRow={(loads) => (
                <TableRow key={loads.id} className="capitalize">
                  <TableCell>{loads.material}</TableCell>
                  <TableCell>
                    {loads.averageWeight} {loads.unit}
                  </TableCell>
                  <TableCell>{ISODateToLocal(loads.createdAt)}</TableCell>
                  <TableCell>{ISOTimeToLocal(loads.createdAt)}</TableCell>
                  <TableCell>{loads.operator}</TableCell>
                  <TableCell>{loads.shift}</TableCell>
                  <TableCell>
                    <EditDialog
                      title="Alteração de registro"
                      description="Preencha as informações a serem alteradas"
                      triggerButton={
                        <SquarePen className="hover:cursor-pointer" />
                      }
                    >
                      <DynamicForm
                        styles="space-y-8"
                        schema={updateFormSchema}
                        submitText="Alterar"
                        fields={[
                          {
                            name: "operator",
                            label: "Operador",
                            placeholder: "Selecionar operador",
                            type: "customSelect",
                            options: OPERATORS,
                            width: "w-[400px]",
                          },
                          {
                            name: "shift",
                            label: "Turno",
                            placeholder: "Selecionar turno",
                            type: "customSelect",
                            options: SHIFTS,
                            width: "w-[200px]",
                          },
                          {
                            name: "celuloseType",
                            label: "Celulose",
                            description: "Selecionar tipo de celulose",
                            type: "radio",
                            options: CELULOSE_TYPE,
                          },
                          {
                            name: "createdAt",
                            label: "Data e Hora",
                            type: "datetime",
                          },
                        ]}
                        onSubmit={async (formValues: UpdateFormFields) => {
                          const ok = await Confirm({
                            title: "Confirmar alteração",
                            description:
                              "Você está prestes a alterar este registro. Após a alteração, não será possível desfazer.",
                            confirmText: "Alterar",
                            cancelText: "Cancelar",
                            buttonVariant: "default",
                          });

                          if (ok) {
                            handleUpdate(loads.id, formValues);
                          }
                        }}
                      />
                    </EditDialog>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={async () => {
                        const ok = await Confirm({
                          title: "Confirmar exclusão",
                          description:
                            "Tem certeza de que deseja remover este registro? Essa ação não poderá ser desfeita e apagará permanentemente as informações do sistema.",
                          confirmText: "Sim, remover",
                          cancelText: "Cancelar",
                          buttonVariant: "destructive",
                        });

                        if (ok) {
                          mutateDeleteLoad({ id: loads.id });
                        }
                      }}
                      className="hover:cursor-pointer"
                    >
                      <Trash2 className="text-destructive" />
                    </button>
                  </TableCell>
                </TableRow>
              )}
              values={getFilteredData}
            />
          )}
        </div>
      </main>
    </>
  );
}

export const Route = createLazyFileRoute("/celulose/relatorio")({
  component: Relatorio,
});
