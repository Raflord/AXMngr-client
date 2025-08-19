import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SimpleTableProps<T> {
  caption?: string;
  headers: string[];
  values?: T[];
  renderRow: (row: T) => React.ReactNode;
}

export function SimpleTable<T>({
  caption,
  headers,
  values,
  renderRow,
}: SimpleTableProps<T>) {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {headers?.map((h) => (
            <TableHead key={h} className="capitalize">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{values?.map((row) => renderRow(row))}</TableBody>
    </Table>
  );
}
