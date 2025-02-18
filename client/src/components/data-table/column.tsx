import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./checkbox.tsx";

export const columns: ColumnDef<any>[] = [
  {
    id: "number",
    header: "No.",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
        className="h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
        className="h-4 w-4"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "boxCount",
    header: "박스 수",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("boxCount")}</div>
    ),
  },
  {
    accessorKey: "shippingMethod",
    header: "배송방식",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("shippingMethod")}</div>
    ),
  },
  {
    accessorKey: "productName",
    header: "상품명",
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("productName")}</div>
    ),
  },
];
