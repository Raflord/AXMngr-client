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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDialogPortal } from "@/hooks/useDialogContainer";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import * as React from "react";

interface DateTimePickerProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
  label: string;
}

export function DateTimePicker({ field, label }: DateTimePickerProps) {
  // Fix for popover inside dialog box
  const { triggerRef, container } = useDialogPortal<HTMLButtonElement>();

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    field.value ? new Date(field.value) : undefined
  );
  const [selectedHour, setSelectedHour] = React.useState<string>("");
  const [selectedMinute, setSelectedMinute] = React.useState<string>("");

  // Populate initial hour/minute if value exists
  React.useEffect(() => {
    if (field.value) {
      const date = new Date(field.value);
      setSelectedHour(String(date.getHours()).padStart(2, "0"));
      setSelectedMinute(String(date.getMinutes()).padStart(2, "0"));
    }
  }, [field.value]);

  // Update value when all parts are selected
  React.useEffect(() => {
    if (selectedDate && selectedHour && selectedMinute) {
      const combined = new Date(selectedDate);
      combined.setHours(Number(selectedHour), Number(selectedMinute));
      field.onChange(format(combined, "yyyy-MM-dd' 'HH:mm:ss"));
    }
  }, [selectedDate, selectedHour, selectedMinute, field]);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

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
                format(new Date(field.value), "dd/MM/yyyy HH:mm")
              ) : (
                <>Escolher data & hora</>
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
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground" />
              <Select onValueChange={setSelectedHour} value={selectedHour}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              :
              <Select onValueChange={setSelectedMinute} value={selectedMinute}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
