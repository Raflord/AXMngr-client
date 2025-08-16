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
        '[role="dialog"], [role="alertdialog"]'
      ) ?? null;
    setContainer(el);
  }, []);

  return { triggerRef, container };
}
