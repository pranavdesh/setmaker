import React, { use } from "react";
import { useState, useEffect } from "react";
import CreatePlaylistForm from "./CreatePlaylistForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CreatePlaylistModalTable } from "./CreatePlaylistModalTable/data-table";
import { columns } from "./CreatePlaylistModalTable/columns";
import { TrackRow } from "./CreatePlaylistModalTable/columns";
import { create } from "lodash";
import { TrackListContext } from "@/state/globalState";

interface CreatePlaylistProps {
  selectionState: boolean;
  resetSelections: () => void;
  createPlaylist: (
    name: string,
    description: string,
    visibility: boolean,
    userID: string,
    tracks: TrackRow[],
    accessToken: string | undefined
  ) => void;
}

const CreatePlaylist = (props: CreatePlaylistProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    console.log("handleOpen called");
  };

  const context = React.useContext(TrackListContext);
  const { state, dispatch } = context;

  if (!context) {
    throw new Error(
      "DataTable must be used within a TrackListProvider component"
    );
  }

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger onClick={handleOpen} asChild>
          <Button
            disabled={!props.selectionState}
            size="sm"
            className="bg-green-500"
          >
            Create a set
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          {showCreateForm ? (
            <CreatePlaylistForm
              onClose={() => {
                setShowCreateForm(false);
                props.resetSelections();
              }}
              toggleParentDialogClose={() => {
                setOpen(false);
              }}
              createPlaylist={props.createPlaylist}
              tracks={state.selectedTracks}
            />
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Create a Set</AlertDialogTitle>
                <AlertDialogDescription>
                  Creates a new playlist in Spotify with the selected tracks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <CreatePlaylistModalTable
                columns={columns}
                data={state.selectedTracks}
              />
              <AlertDialogFooter>
                <Button
                  className="bg-green-500 text-white"
                  onClick={() => {
                    setShowCreateForm(true);
                  }}
                >
                  Create
                </Button>
                <AlertDialogCancel className="bg-black text-white">
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreatePlaylist;
