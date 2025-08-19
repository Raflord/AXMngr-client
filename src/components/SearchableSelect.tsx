import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDialogPortal } from "@/hooks/useDialogContainer";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  field: ControllerRenderProps;
  label: string;
  placeholder: string;
  options: Option[];
  width?: string;
}

export function SearchableSelect({
  field,
  label,
  placeholder,
  options,
  width = "w-[300px]",
}: SearchableSelectProps) {
  // Fix for popover inside dialog box
  const { triggerRef, container } = useDialogPortal<HTMLButtonElement>();

  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              width,
              "justify-between",
              !field.value && "text-muted-foreground"
            )}
            ref={triggerRef}
          >
            {field.value
              ? options.find((opt) => opt.value === field.value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(width, "p-0")} container={container}>
          <Command>
            <CommandInput placeholder={`Procurar ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    value={opt.label}
                    key={opt.value}
                    onSelect={() => {
                      field.onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        opt.value === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
