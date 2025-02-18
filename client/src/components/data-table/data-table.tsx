import { useState, useRef } from "react";
import { Checkbox } from "./checkbox";
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

const mergeableColumns = [
  "boxCount",
  "shippingMethod",
  "productTemperature",
  "configurationCount",
];

interface Product {
  id: string;
  name: string;
  email: string;
}

interface TableBodyProps {
  table: Table<Product>;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
}

// 연속된 동일 값을 가진 행들의 그룹을 찾는 함수
const findGroupedRows = (
  currentRow: Row<Product>,
  rows: Row<Product>[],
  currentIndex: number
) => {
  const groupRows = [currentRow];
  let nextIndex = currentIndex + 1;

  while (nextIndex < rows.length) {
    const nextRow = rows[nextIndex];
    let isSameValues = true;

    for (const colId of mergeableColumns) {
      if (currentRow.getValue(colId) !== nextRow.getValue(colId)) {
        isSameValues = false;
        break;
      }
    }

    if (!isSameValues) break;
    groupRows.push(nextRow);
    nextIndex++;
  }

  return groupRows;
};

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
        const previousRow =
          virtualRow.index > 0
            ? (rows[virtualRow.index - 1] as Row<Product>)
            : null;
        const groupedRows = findGroupedRows(row, rows, virtualRow.index);

        return (
          <TableRow
            key={row.id}
            row={row}
            previousRow={previousRow}
            virtualRow={virtualRow}
            rowVirtualizer={rowVirtualizer}
            groupedRows={groupedRows}
            table={table}
          />
        );
      })}
    </tbody>
  );
};

interface TableRowProps {
  row: Row<Product>;
  previousRow: Row<Product> | null;
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  groupedRows: Row<Product>[];
  table: Table<Product>;
}

const TableRow = ({
  row,
  previousRow,
  virtualRow,
  rowVirtualizer,
  groupedRows,
}: TableRowProps) => {
  const shouldHideValue = (cell: any) => {
    if (!previousRow || !mergeableColumns.includes(cell.column.id)) {
      return false;
    }

    for (const colId of mergeableColumns) {
      const prevValue = previousRow.getValue(colId);
      const currentValue = row.getValue(colId);
      if (prevValue !== currentValue) {
        return false;
      }
    }
    return true;
  };

  const isGroupStart =
    !previousRow ||
    mergeableColumns.some(
      (colId) => row.getValue(colId) !== previousRow.getValue(colId)
    );

  const handleGroupSelect = (checked: boolean) => {
    groupedRows.forEach((groupRow) => {
      groupRow.toggleSelected(checked);
    });
  };

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
      className={isGroupStart ? "border-t border-gray-200" : ""}
    >
      {row.getVisibleCells().map((cell) => {
        const isCheckboxCell = cell.column.id === "select";
        const shouldHide = !isCheckboxCell && shouldHideValue(cell);

        return (
          <td
            key={cell.id}
            style={{
              display: "flex",
              width: cell.column.getSize(),
              minHeight: "35px",
              border: "0.2px solid #e0e0e0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isCheckboxCell && isGroupStart ? (
              <Checkbox
                checked={groupedRows.every((r) => r.getIsSelected())}
                onCheckedChange={handleGroupSelect}
                aria-label="그룹 선택"
                className="h-4 w-4"
              />
            ) : isCheckboxCell ? null : shouldHide ? (
              <div className="text-sm opacity-0">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </td>
        );
      })}
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
