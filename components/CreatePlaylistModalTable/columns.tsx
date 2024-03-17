import { ColumnDef, Row } from "@tanstack/react-table";
import Track from "@/interfaces/Track";

export interface TrackRow {
  name: Track["name"];
  artists: Track["artists"];
  spotifyId: Track["spotifyId"];
}

export const columns: ColumnDef<TrackRow>[] = [
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
];
