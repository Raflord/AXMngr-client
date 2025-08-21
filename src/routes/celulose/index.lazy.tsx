import { Confirm } from "@/components/ConfirmDialog";
import { DynamicForm } from "@/components/DynamicForm";
import { EditDialog } from "@/components/EditDialog";
import { Navbar } from "@/components/Navbar";
import { SimpleTable } from "@/components/SimpleTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { RefreshCw, SquarePen, Trash2 } from "lucide-react";
import { z } from "zod";
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
import { Load } from "../../types/celulose/celulose.types";
import {
  generateDateTimeString,
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
  { label: "Fibra Longa Klabin", value: "fibra longa klabin" },
  { label: "Fibra Curta Klabin", value: "fibra curta klabin" },
  { label: "Fibra Longa UPM PULP", value: "fibra longa upm pulp" },
  { label: "Fibra Longa Mercer", value: "fibra longa mercer" },
  { label: "Fibra Longa Rottneros", value: "fibra longa rottneros" },
];

const createFormSchema = z.object({
  operator: z.string({ message: "Selecione um operador" }),
  shift: z.string({ message: "Selecione um turno" }),
  celuloseType: z.string({ message: "Selecione um tipo de celulose" }),
});

const updateFormSchema = z.object({
  operator: z.string({ message: "Selecione um operador" }),
  shift: z.string({ message: "Selecione um turno" }),
  celuloseType: z.string({ message: "Selecione um tipo de celulose" }),
  createdAt: z.string({ message: "Selecione a data e hora" }),
});

type CreateFormFields = z.infer<typeof createFormSchema>;
type UpdateFormFields = z.infer<typeof updateFormSchema>;

function Celulose() {
  // query utils
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

  const handleCreate = (data: CreateFormFields) => {
    const dateTimeString = generateDateTimeString();

    const inputData = {
      material: data.celuloseType,
      averageWeight: 3000,
      unit: "KG",
      createdAt: dateTimeString,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      operator: data.operator,
      shift: data.shift,
    };

    mutateCreateLoad(inputData);
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
      <main className="text mx-auto flex min-h-screen max-w-7xl flex-col px-2">
        <Navbar />
        <DynamicForm
          styles="space-y-8 my-6"
          schema={createFormSchema}
          submitText="Registrar"
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
          ]}
          onSubmit={async (formValues: CreateFormFields) => {
            const ok = await Confirm({
              title: "Confirmar registro",
              description: "Tem certeza que deseja adicionar um novo registro?",
              confirmText: "Sim, registrar",
              cancelText: "Cancelar",
              buttonVariant: "default",
            });

            if (ok) {
              handleCreate(formValues);
            }
          }}
        />
        {isErrorGetLatest ? (
          <span className="text-destructive">
            Erro os buscar as informações de consumo.
            <br /> Erro: {errorGetLatest.message}
          </span>
        ) : (
          <div>
            <div className="mb-2 text-left">
              <p>
                Total do dia
                <span className="font-bold">
                  {" "}
                  ({new Date().toLocaleDateString()}):
                </span>
              </p>
              <div className="flex justify-between">
                <div>
                  {getSummaryData?.map((loads) => {
                    return (
                      <span key={loads.material} className="block capitalize">
                        {loads.material}:{" "}
                        <span className="font-bold">
                          {loads.totalWeight?.toLocaleString()} KG
                        </span>
                      </span>
                    );
                  })}
                </div>
                <Button
                  className="rounded-full hover:cursor-pointer"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: [GET_LATEST_KEY],
                    });
                    queryClient.invalidateQueries({
                      queryKey: [GET_SUMMARY_KEY],
                    });
                  }}
                >
                  <RefreshCw />
                </Button>
              </div>
            </div>
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
              values={getLatestData}
            />
          </div>
        )}
      </main>
    </>
  );
}

export const Route = createLazyFileRoute("/celulose/")({
  component: Celulose,
});
