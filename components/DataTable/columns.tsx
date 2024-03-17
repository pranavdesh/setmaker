"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";

import Track from "@/interfaces/Track";

export const columns: ColumnDef<Track>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Title",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "artists",
    header: "Artists",
    cell: ({ row }) => row.original.artists.join(","),
  },
  {
    accessorKey: "duration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Duration</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">{row.original.duration}</div>
    ),
  },
  {
    accessorKey: "bpm",
    accessorFn: (row) => row.audioFeatures?.bpm,
    filterFn: (row, columnId, filterValue) =>
      bpmFilterFn(row, columnId, filterValue) ?? false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>BPM</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.audioFeatures?.bpm}
      </div>
    ),
  },
  {
    accessorKey: "key",
    accessorFn: (row) => row.audioFeatures?.key,
    filterFn: (row, columnId, filterValue) =>
      keyFilterFn(row, columnId, filterValue) ?? false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div>Key</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.original.audioFeatures?.key}
      </div>
    ), //optional, for formatting and styling only
  },
];

function bpmFilterFn(
  row: Row<Track>,
  columnId: string,
  filterValue: { min?: number; max?: number }
): boolean | null {
  const rowValue = row.original.audioFeatures?.bpm ?? 0;

  if (!filterValue || rowValue === undefined) {
    return true; // Do not filter out the row if there's no filter or BPM value is undefined.
  }

  // Check against the min and max values of the filter.
  // If a min value is set, check if the rowValue is >= min.
  // If a max value is set, check if the rowValue is <= max.
  const meetsMinCondition =
    filterValue.min !== undefined ? rowValue >= filterValue.min : true;
  const meetsMaxCondition =
    filterValue.max !== undefined ? rowValue <= filterValue.max : true;

  // Only return true if both conditions are met.
  return meetsMinCondition && meetsMaxCondition;
}

// function bpmFilterFn(
//   row: Row<Track>,
//   columnId: string,
//   filterValue: number
// ): boolean | null {
//   // Accessing the row's BPM value. Ensure you handle cases where audioFeatures or bpm might be undefined.
//   const rowValue = row.original.audioFeatures?.bpm;

//   // If there's no filter set, or the BPM value is not defined, do not filter out the row.
//   if (!filterValue || rowValue === undefined) {
//     return true;
//   }

//   // Return true if the row's BPM is less than or equal to the filterValue; otherwise, false.
//   return (rowValue ?? 0) <= filterValue;
// }

const keyFilterFn = (
  row: Row<Track>,
  columnId: string,
  filterValue: string
) => {
  // Accessing the row's Key value. Ensure you handle cases where audioFeatures or key might be undefined.
  const rowValue = row.original.audioFeatures?.key;

  // If there's no filter set, or the Key value is not defined, do not filter out the row.
  if (!filterValue || rowValue === undefined) {
    return true;
  }

  // Return true if the row's Key exactly matches the filterValue; otherwise, false.
  return String(rowValue) === String(filterValue);
};
