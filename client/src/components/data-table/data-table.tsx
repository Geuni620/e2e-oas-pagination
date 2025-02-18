import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { columns } from "./column";

// 데이터 타입 정의
type OrderData = {
  id: number;
  boxCount: number;
  shippingMethod: string;
  productName: string;
};

// 샘플 데이터 생성
const sampleData: OrderData[] = [
  {
    id: 1,
    boxCount: 3,
    shippingMethod: "택배",
    productName: "프리미엄 커피 원두",
  },
  {
    id: 2,
    boxCount: 1,
    shippingMethod: "퀵배송",
    productName: "유기농 녹차",
  },
  {
    id: 3,
    boxCount: 5,
    shippingMethod: "택배",
    productName: "홍차 세트",
  },
  {
    id: 4,
    boxCount: 2,
    shippingMethod: "방문수령",
    productName: "다과 선물세트",
  },
  {
    id: 5,
    boxCount: 4,
    shippingMethod: "택배",
    productName: "과일 바구니",
  },
];

export const DataTable = () => {
  // 선택된 행들을 관리하기 위한 상태
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    columns,
    data: sampleData,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 border border-gray-200 text-left"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        선택된 항목: {Object.keys(rowSelection).length}
      </div>
    </div>
  );
};
