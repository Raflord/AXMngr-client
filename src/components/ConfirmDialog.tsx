import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// module-level variables to store resolve + options
let resolveFn: ((ok: boolean) => void) | null = null;
let confirmOptions: {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  buttonVariant: "default" | "destructive";
} = {
  title: "",
  confirmText: "Confirmar",
  cancelText: "Cancelar",
  buttonVariant: "default",
};

// public API
export function Confirm(options: {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  buttonVariant: "default" | "destructive";
}): Promise<boolean> {
  confirmOptions = { ...options };
  return new Promise((resolve) => {
    resolveFn = resolve;
    setOpen(true); // open the dialog
  });
}

// internal state in module
let _setOpen: ((open: boolean) => void) | null = null;
function setOpen(value: boolean) {
  if (_setOpen) _setOpen(value);
}

// confirm dialog component
export function ConfirmDialog() {
  const [open, setLocalOpen] = useState(false);
  _setOpen = setLocalOpen;

  const close = (ok: boolean) => {
    setLocalOpen(false);
    if (resolveFn) {
      resolveFn(ok);
      resolveFn = null;
    }
  };

  if (!open) return null;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmOptions.title}</AlertDialogTitle>
          {confirmOptions.description && (
            <AlertDialogDescription>
              {confirmOptions.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={() => close(false)}>
            {confirmOptions.cancelText}
          </Button>

          <Button
            type="button"
            variant={confirmOptions.buttonVariant}
            onClick={() => close(true)}
          >
            {confirmOptions.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
