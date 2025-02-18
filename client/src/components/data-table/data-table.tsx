import { useState, useRef } from "react";
import { columns } from "./column";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  Row,
  Table,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from "@tanstack/react-virtual";

interface Product {
  id: string;
  name: string;
  email: string;
}

interface TableBodyProps {
  table: Table<Product>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

const TableBody = ({ table, tableContainerRef }: TableBodyProps) => {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 35,
    getScrollElement: () => tableContainerRef.current,
    measureElement: (element) => element?.getBoundingClientRect().height,
    overscan: 5,
  });

  return (
    <tbody
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<Product>;
        return (
          <TableRow
            key={row.id}
            row={row}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
          />
        );
      })}
    </tbody>
  );
};

interface TableRowProps {
  row: Row<Product>;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
}

const TableRow = ({ row, virtualRow, rowVirtualizer }: TableRowProps) => {
  return (
    <tr
      data-index={virtualRow.index}
      ref={(node) => rowVirtualizer.measureElement(node)}
      style={{
        display: "flex",
        position: "absolute",
        transform: `translateY(${virtualRow.start}px)`,
        width: "100%",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
            display: "flex",
            width: cell.column.getSize(),
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

export const DataTable = ({ data }: { data: Product[] }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "boxCount", desc: false },
    { id: "shippingMethod", desc: false },
    { id: "productTemperature", desc: false },
    { id: "configurationCount", desc: false },
  ]);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable<Product>({
    data,
    columns: columns as ColumnDef<Product>[],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="p-4">
      <div
        ref={tableContainerRef}
        style={{
          height: "800px",
          overflow: "auto",
          position: "relative",
        }}
      >
        <table style={{ display: "grid" }}>
          <thead
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: "flex", width: "100%" }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      display: "flex",
                      width: header.getSize(),
                    }}
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
          <TableBody table={table} tableContainerRef={tableContainerRef} />
        </table>
      </div>
      <div className="mt-4">
        선택된 항목: {Object.keys(rowSelection).length}
      </div>
    </div>
  );
};
