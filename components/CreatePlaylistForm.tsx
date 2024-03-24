import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TrackRow } from "./CreatePlaylistModalTable/columns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrackListContext } from "@/state/globalState";

interface CreatePlaylistFormProps {
  onClose: () => void;
  toggleParentDialogClose: () => void;
  createPlaylist: (
    name: string,
    description: string,
    visibility: boolean,
    userID: string,
    tracks: TrackRow[],
    accessToken: string | undefined
  ) => void;
  tracks: TrackRow[] | undefined;
}

const formSchema = z.object({
  setlistName: z.string().min(1, { message: "Set name can't be empty" }),
  setListDescription: z
    .string()
    .min(1, { message: "Set description can't be empty" }),
});

const CreatePlaylistForm: React.FC<CreatePlaylistFormProps> = ({
  onClose,
  toggleParentDialogClose,
  tracks,
  createPlaylist,
}) => {
  const [setlistName, setsetlistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [id, setid] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   setlistName: "Smooth jazz house mix",
    //   setListDescription: "Cocktail hour vibes",
    // },
  });

  const context = React.useContext(TrackListContext);
  const { state, dispatch } = context;

  if (!context) {
    throw new Error(
      "DataTable must be used within a TrackListProvider component"
    );
  }

  async function submitForm(data: z.infer<typeof formSchema>) {
    const userId = state.userID;
    const accessToken = state.accessToken;
    const tracks = state.selectedTracks;
    setLoading(true);
    //await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call delay
    const playlistCreationStatus = await createPlaylist(
      data.setlistName,
      data.setListDescription,
      true,
      userId,
      tracks,
      accessToken
    );
    setLoading(false);
    setSuccess(true);
  }

  const handleSuccessClose = () => {
    onClose();
    toggleParentDialogClose();
  };

  if (success) {
    return (
      <div>
        <p>Set created successfully!</p>
        <Button onClick={handleSuccessClose}>OK</Button>
      </div>
    );
  }

  return (
    <div className="pt-2 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
          <FormField
            control={form.control}
            name="setlistName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Smooth jazz house mix"
                    {...field}
                    className="placeholder-gray-400 placeholder:italic"
                  />
                </FormControl>
                <FormDescription>What is your set called?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="setListDescription"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Cocktail hour vibes"
                    {...field}
                    className="placeholder-gray-400 placeholder:italic"
                  />
                </FormControl>
                <FormDescription>What is the vibe of your set?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default CreatePlaylistForm;
