"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import Track from "@/interfaces/Track";
import { DataTable } from "./DataTable/data-table";
import { columns } from "./DataTable/columns";
import TrackLoading from "./TrackLoading";
import { TrackListContext } from "@/state/globalState";

interface Props {
  accessToken: string | undefined;
}

const TrackList = (props: Props) => {
  //const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(TrackListContext);

  const loadTracks = async () => {
    let data: Track[] = [];
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      const [fetchedTracks, _] = await fetchTracks(props, offset);
      data = [...data, ...fetchedTracks];
      offset += 50;
      if (fetchedTracks.length < 50) {
        hasMore = false;
      }
    }

    return data;
  };

  useEffect(() => {
    setLoading(false);
    const loadPage = async () => {
      setLoading(true);
      const data = await loadTracks();
      const userID = await getUserID(props.accessToken);

      dispatch({ type: "SET_USER_ID", payload: userID });
      dispatch({ type: "SET_ACCESS_TOKEN", payload: props.accessToken });
      dispatch({ type: "SET_TRACKS", payload: data });
      setLoading(false);
    };
    loadPage();
  }, []);

  return (
    <section className="flex flex-col flex-1 overflow-auto p-4">
      <h1 className="text-2xl font-bold mb-4 ml-8">Your Saved Tracks</h1>
      <div>
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col items-center w-1/2">
              <TrackLoading />
              <h1 className="text-l justify-center font-bold m-4  p-4">
                {`Loading your tracks from Spotify`}
              </h1>
            </div>
          </div>
        )}
        {!loading && <DataTable columns={columns} data={state.tracks} />}
      </div>
    </section>
  );
};

async function fetchTracks(
  props?: Props,
  offset?: number
): Promise<[Track[], Track[]]> {
  try {
    const response = await fetch("/api/getTracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: props!.accessToken,
        offset: offset,
      }),
    });

    // Check if the fetch request was successful
    if (!response.ok) {
      // If the response status code is an error (4xx, 5xx), throw to catch block
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    // If response is okay, parse it
    const newTracks: Track[] = await response.json();

    const tracksWithFeatures = await fetchAudioFeatures(
      newTracks,
      props!.accessToken
    );

    return [tracksWithFeatures, newTracks];
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching tracks:", error);
    return [[], []];
  }
}

async function fetchAudioFeatures(
  Tracks: Track[],
  accessToken: string | undefined
): Promise<Track[]> {
  const trackIds = Tracks.map((item) => item.spotifyId);
  try {
    const response = await fetch("/api/getAudioFeatures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: accessToken,
        trackIds: trackIds,
      }),
    });

    // Check if the fetch request was successful
    if (!response.ok) {
      // If the response status code is an error (4xx, 5xx), throw to catch block
      const errorData = await response.json();
      throw new Error(`Error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    // If response is okay, parse it
    const audioFeatures = await response.json();

    const tracksWithAudioFeatures: Track[] = [];

    audioFeatures.forEach((audioFeature: any) => {
      const track = Tracks.find((track) => track.spotifyId === audioFeature.id);

      if (track) {
        track.audioFeatures = {
          key: audioFeature.key,
          bpm: audioFeature.bpm,
        };
        //const trackWithAudioFeatures = {name: track.name, artists: track.artists, duration: track.duration, spotifyId: track.spotifyId, audioFeatures: track.audioFeatures}
        tracksWithAudioFeatures.push(track);
      }
    });

    return tracksWithAudioFeatures;
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching audio features:", error);

    // further handle the error here, such as displaying a message to the user
    // e.g., setError('Failed to fetch audio features');

    // Ensure nothing is returned in case of error
    return [];
  }
}

async function getUserID(accessToken: string | undefined) {
  const response = await fetch("/api/getUserId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken,
    }),
  });
  const data = await response.json();
  return data;
}

export default TrackList;
