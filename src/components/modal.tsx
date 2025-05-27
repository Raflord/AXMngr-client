import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "@tanstack/react-router";

const Modal = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
};

function ModalContent({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/20" />
      <Dialog.Content className="fixed text-black left-1/2 top-1/2 focus:outline-hidden rounded-md bg-zinc-200 p-6 -translate-x-1/2 -translate-y-1/2">
        <Dialog.Title className="font-bold text-4xl mb-4">{title}</Dialog.Title>
        <>
          {children}

          <Dialog.Close className="me-2 rounded-lg bg-zinc-700 px-5 py-2.5 font-medium text-white hover:bg-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-yellow-300">
            Cancelar
          </Dialog.Close>
        </>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

Modal.Button = Dialog.Trigger;
Modal.Content = ModalContent;

export default Modal;
