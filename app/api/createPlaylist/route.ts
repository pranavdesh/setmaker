import { TrackRow } from "@/components/CreatePlaylistModalTable/columns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, visibility, userID, tracks, accessToken } = body;
    const createPlaylistResponse = await fetch(
      "https://api.spotify.com/v1/users/" + userID + "/playlists",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          public: visibility,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      // If the response status code is an error (4xx, 5xx), throw to catch block
      const errorData = await createPlaylistResponse.json();
      throw new Error(
        `Error ${createPlaylistResponse.status}: ${JSON.stringify(errorData)}`
      );
    }

    const { id, uri } = await createPlaylistResponse.json();

    console.log("Playlist created with ID", id, "and URI", uri);

    const trackUriString = tracks
      .map((track: TrackRow) => `spotify:track:${track.spotifyId}`)
      .join(",");

    const trackUriArray = tracks.map(
      (track: TrackRow) => `spotify:track:${track.spotifyId}`
    );

    console.log("Adding tracks to playlist", id, "with URIs", trackUriString);
    const addTracksResponse = await fetch(
      "https://api.spotify.com/v1/playlists/" + id + "/tracks",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackUriArray,
        }),
      }
    );
    if (!addTracksResponse.ok) {
      const errorData = await addTracksResponse.json();
      throw new Error(
        `Error ${addTracksResponse.status}: ${JSON.stringify(errorData)}`
      );
    }
    return new NextResponse(JSON.stringify({ id, uri }));
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
