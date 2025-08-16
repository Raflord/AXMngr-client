import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Option {
  label: string;
  value: string;
}

interface RadioOptionsProps {
  field: any;
  label: string;
  description?: string;
  options: Option[];
}

export function RadioOptions({
  field,
  label,
  description,
  options,
}: RadioOptionsProps) {
  return (
    <FormItem className="space-y-3">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          defaultValue={""}
          onValueChange={field.onChange}
          value={field.value ?? ""}
          className="flex flex-col space-y-1"
        >
          {options.map((opt) => (
            <FormItem
              className="flex items-center space-x-3 space-y-0"
              key={opt.value}
            >
              <FormControl>
                <RadioGroupItem value={opt.value} />
              </FormControl>
              <FormLabel className="font-normal">{opt.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
