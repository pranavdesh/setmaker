"use client";
import * as React from "react";
import {
  ColumnDef,
  Column,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
  Table as TanstackTable,
} from "@tanstack/react-table";

import { TrackRow } from "./columns";
import { SelectedDataTablePagination } from "./pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | [];
}

export function CreatePlaylistModalTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    //onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    //onColumnVisibilityChange: setColumnVisibility,
    //onRowSelectionChange: setRowSelection,
    // state: {
    //   //   sorting,
    //   //   columnVisibility,
    //   //   columnFilters,
    //   //   rowSelection,
    // },
  });

  return (
    <div className="flex flex-col">
      <div className="flex m-6">
        <SelectedDataTablePagination table={table} />
      </div>
      <div className="rounded-md border ml-8 overflow-y-auto max-h-[calc(100vh-400px)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
