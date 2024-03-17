"use client";
import * as React from "react";
import { useState } from "react";
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "./pagination";
import CreatePlaylist from "../CreatePlaylist";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TrackRow } from "../CreatePlaylistModalTable/columns";
import Track from "@/interfaces/Track";

import { TrackListContext } from "@/state/globalState";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  //state management for table operations
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [rowSelectionState, setRowSelectionState] =
    React.useState<boolean>(false);

  const resetSelections = () => {
    table.resetRowSelection();
  };

  const [minBpm, setMinBpm] = useState<number | undefined>();
  const [maxBpm, setMaxBpm] = useState<number | undefined>();

  const context = React.useContext(TrackListContext);
  const { state, dispatch } = context;

  if (!context) {
    throw new Error(
      "DataTable must be used within a TrackListProvider component"
    );
  }

  //table data model and state management operators
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
  });

  React.useEffect(() => {
    Object.keys(rowSelection).length > 0
      ? setRowSelectionState(true)
      : setRowSelectionState(false);
    const latestSelectedTracks: TrackRow[] = [];

    table.getSelectedRowModel().rows.map((row) => {
      const track = {
        name: (row.original as Track).name,
        artists: (row.original as Track).artists,
        spotifyId: (row.original as Track).spotifyId,
      };
      latestSelectedTracks.push(track);
    });

    const filterValue = { min: minBpm, max: maxBpm };
    console.log("state", state);

    if (table && table.getColumn("bpm")) {
      table.getColumn("bpm")!.setFilterValue(filterValue);
    }

    dispatch({ type: "SET_SELECTED_TRACKS", payload: latestSelectedTracks });
  }, [rowSelection, minBpm, maxBpm]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 ml-8 py-4">
          <div className="text-bold text-green-500 pr-8">
            <h1>Filters</h1>
          </div>
          <div className="">
            <Input
              placeholder="Track name"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
          <div className="">
            <Input
              placeholder="Min BPM"
              value={(minBpm as number) ?? ""}
              onChange={(event) => {
                // const value = event.target.value;
                // console.log(value);
                // // Convert the input value to an integer. If the input is empty, reset the filter (undefined).
                // const filterValue = value ? parseInt(value, 10) : undefined;

                // // Update the filter value for the BPM column in the table.
                // table.getColumn("bpm")?.setFilterValue(filterValue);

                const value = event.target.value;
                setMinBpm(value ? parseInt(value, 10) : undefined);
              }}
              className="max-w-sm"
            />
          </div>
          <div className="">
            <Input
              placeholder="Max BPM"
              value={(maxBpm as number) ?? ""}
              onChange={(event) => {
                // const value = event.target.value;
                // console.log(value);
                // // Convert the input value to an integer. If the input is empty, reset the filter (undefined).
                // const filterValue = value ? parseInt(value, 10) : undefined;

                // // Update the filter value for the BPM column in the table.
                // table.getColumn("bpm")?.setFilterValue(filterValue);
                const value = event.target.value;
                setMaxBpm(value ? parseInt(value, 10) : undefined);
              }}
              className="max-w-sm"
            />
          </div>
          <div className="">
            <Input
              placeholder="Key"
              value={(table.getColumn("key")?.getFilterValue() as string) ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                //console.log(value);
                table.getColumn("key")?.setFilterValue(value);
              }}
              className="max-w-sm"
            />
          </div>
        </div>
        <div className="flex items-center ml-8">
          <CreatePlaylist
            selectionState={rowSelectionState}
            resetSelections={resetSelections}
            createPlaylist={createPlaylist}
          />
        </div>
      </div>
      <div className="flex ml-8">
        <DataTablePagination table={table} />
      </div>
      <div className="rounded-md border ml-8">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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

async function createPlaylist(
  name: string,
  description: string,
  visibility: boolean,
  userID: string,
  tracks: TrackRow[],
  accessToken: string
) {
  try {
    const response = await fetch(
      "/api/createPlaylist", // Route to create a playlist
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          tracks: tracks,
          accessToken: accessToken,
          name: name,
          description: description,
          visibility: true,
        }),
      }
    );

    if (!response.ok) {
      // If the response status code is an error (4xx, 5xx), throw to catch block
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const { playlistID, uri } = await response.json();

    return { playlistID: playlistID, uri: uri };
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
  console.log(
    "Creating playlist",
    name,
    description,
    visibility,
    userID,
    tracks
  );
}
