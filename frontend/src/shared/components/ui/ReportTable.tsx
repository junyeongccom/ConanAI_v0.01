import {
    Table,
    TableBody,
    TableCell,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/shared/components/ui/table";
  
  interface ReportTableProps {
    title: string;
    headers: string[];
    rows: (string | number | null)[][];
  }
  
  export function ReportTable({ title, headers, rows }: ReportTableProps) {
    // 헤더가 비어있으면 렌더링하지 않음 (행이 비어있는 것은 허용)
    if (!headers || headers.length === 0) {
      return null;
    }

    return (
      <div className="my-6 not-prose">
        {title && <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h4>}
        <Table className="border rounded-lg">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="border-r font-bold text-gray-700 dark:text-gray-300">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows && rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} className="border-r text-gray-800 dark:text-gray-200">
                            {cell}
                        </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={headers.length} className="text-center text-gray-500 py-8">
                        표시할 데이터가 없습니다.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  } 