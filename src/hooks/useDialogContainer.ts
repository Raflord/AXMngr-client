// import { useEffect, useState } from "react";
//
// // Returns the closest Radix DialogContent element (if inside a dialog), so popovers/portals can render inside it instead of document.body.
//
// export function useDialogContainer() {
//   const [container, setContainer] = useState<HTMLElement | null>(null);
//
//   useEffect(() => {
//     // Check for the dialog content in the DOM
//     const dialogContent = document.querySelector(
//       "[data-radix-dialog-content]",
//     ) as HTMLElement | null;
//
//     setContainer(dialogContent || null);
//   }, []);
//
//   return container ?? undefined;
// }

import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref for a trigger element and the closest dialog container.
 * Useful for popovers inside dialogs so the portal mounts correctly.
 */
export function useDialogPortal<T extends HTMLElement>() {
  const triggerRef = useRef<T | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el =
      triggerRef.current?.closest<HTMLElement>(
        '[role="dialog"], [role="alertdialog"]',
      ) ?? null;
    setContainer(el);
  }, []);

  return { triggerRef, container };
}
