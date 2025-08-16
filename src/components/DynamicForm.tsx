import { DateTimePicker } from "@/components/DateTimePicker";
import { RadioOptions } from "@/components/RadioOptions";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { Path, useForm } from "react-hook-form";
import { z } from "zod";
import { CustomSelect } from "./CustomSelect";

type FieldType = "customSelect" | "searchableSelect" | "radio" | "datetime";

interface Option {
  label: string;
  value: string;
}

interface FieldConfig<TSchema extends z.ZodType<any, any>> {
  name: Path<z.infer<TSchema>>;
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: Option[];
  description?: string;
  width?: string;
}

interface DynamicFormProps<TSchema extends z.ZodType<any, any>> {
  styles?: string;
  schema: z.ZodType<any, any>;
  fields: FieldConfig<TSchema>[];
  onSubmit: (values: any) => void;
  children?: ReactNode;
  submitText: string;
}

export function DynamicForm<TSchema extends z.ZodType<any, any>>({
  styles,
  schema,
  fields,
  onSubmit,
  children,
  submitText,
}: DynamicFormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={styles ?? "space-y-8 px-10 py-10"}
      >
        {fields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field }): JSX.Element => {
              switch (fieldConfig.type) {
                case "customSelect":
                  return (
                    <CustomSelect
                      field={field}
                      label={fieldConfig.label}
                      placeholder={fieldConfig.placeholder || ""}
                      options={fieldConfig.options || []}
                      width={fieldConfig.width}
                    />
                  );
                case "searchableSelect":
                  return (
                    <SearchableSelect
                      field={field}
                      label={fieldConfig.label}
                      placeholder={fieldConfig.placeholder || ""}
                      options={fieldConfig.options || []}
                      width={fieldConfig.width}
                    />
                  );
                case "radio":
                  return (
                    <RadioOptions
                      field={field}
                      label={fieldConfig.label}
                      description={fieldConfig.description}
                      options={fieldConfig.options || []}
                    />
                  );

                case "datetime":
                  return (
                    <DateTimePicker field={field} label={fieldConfig.label} />
                  );
                default:
                  return <></>;
              }
            }}
          />
        ))}
        <Button type="submit">{submitText}</Button>
        {children}
      </form>
    </Form>
  );
}
