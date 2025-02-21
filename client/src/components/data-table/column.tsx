import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./checkbox.tsx";

type Product = {
  id: string;
  boxCount: number;
  shippingMethod: string;
  productTemperature: string;
  configurationCount: number;
  productCode: string;
  productName: string;
};

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "productTemperature",
    header: "상품온도",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("productTemperature")}</div>
    ),
    filterFn: (row, id, filterValue) => {
      // filterValue가 없으면 모든 행 표시
      if (!filterValue) {
        return true;
      }

      const rowValue = String(row.getValue(id));
      console.log("rowValue", rowValue);

      return rowValue.toLowerCase() === String(filterValue).toLowerCase();
    },
  },
  {
    accessorKey: "configurationCount",
    header: "구성 수",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("configurationCount")}</div>
    ),
  },
  {
    accessorKey: "productCode",
    header: "상품코드",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("productCode")}</div>
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
