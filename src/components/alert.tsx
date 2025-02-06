import * as Dialog from "@radix-ui/react-dialog";

const Alert = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className="bg-emerald-700">button</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.DialogOverlay className="fixed inset-0 bg-black/20" />
        <Dialog.Content className="fixed text-white left-1/2 top-1/2 focus:outline-hidden rounded-md bg-zinc-800 p-6 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="font-bold">Novo Registro</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja adicionar um novo registro?
          </Dialog.Description>
          <div>
            <Dialog.Close onClick={(e) => e.preventDefault()}>
              <button>Sim, tenho certeza</button>
            </Dialog.Close>
            <Dialog.Close onClick={(e) => e.preventDefault()}>
              <button>Nao, cancelar</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Alert;
