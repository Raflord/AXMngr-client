import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDialogPortal } from "@/hooks/useDialogContainer";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

interface DateTimePickerProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
}

export function DatePicker({ field, label }: DateTimePickerProps) {
  // Fix for popover inside dialog box
  const { triggerRef, container } = useDialogPortal<HTMLButtonElement>();

  // parse with T00:00:00 to prevent timezone shift
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    field.value ? new Date(field.value + "T00:00:00") : undefined
  );

  React.useEffect(() => {
    if (selectedDate) {
      // parse with T00:00:00 to prevent timezone shift
      field.onChange(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, field]);

  return (
    <FormItem className="flex flex-col space-y-2">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!field.value}
              className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
              ref={triggerRef}
            >
              <CalendarIcon className="mr-2" />
              {field.value ? (
                // parse with T00:00:00 to prevent timezone shift
                format(field.value + "T00:00:00", "dd/MM/yyyy")
              ) : (
                <>Escolher data</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto space-y-3 p-4"
            container={container}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
