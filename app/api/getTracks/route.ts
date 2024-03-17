import { NextRequest, NextResponse } from "next/server";
import Track from "@/interfaces/Track";

const delay = (seconds: number) =>
  new Promise((res) => setTimeout(res, seconds * 1000));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken } = body;
    const { offset } = body;

    // Fetch user's tracks from Spotify
    let spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (spotifyRes.status === 429) {
      const retryAfter = spotifyRes.headers.get("Retry-After"); // in seconds
      console.log("Rate limited at /getTracks", retryAfter);
      if (retryAfter) {
        // Pause execution for the duration specified by the Retry-After header
        console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
        await delay(parseInt(retryAfter));

        // Retry the request
        spotifyRes = await fetch(
          `https://api.spotify.com/v1/me/tracks?offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    }

    // Check if the Spotify API returned an error status code
    if (!spotifyRes.ok) {
      const error = await spotifyRes.json();
      return new NextResponse(JSON.stringify(error), {
        status: spotifyRes.status,
      });
    }

    // If the response is OK, proceed to parse it
    const tracks = await spotifyRes.json();
    const extractedTracks: Track[] = extractTrackInfo(tracks);
    return NextResponse.json(extractedTracks);
  } catch (error) {
    // Log unexpected errors for debugging
    console.error("Unexpected error in POST:", error);

    // Return a generic error message with a 500 status code
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}

function extractTrackInfo(tracks: any) {
  const items = tracks?.items || [];
  const extractedTracks = items.map((item: any) => {
    const { id, name, artists, duration_ms, images } = item.track;
    const artistNames = artists.map((artist: any) => artist.name);

    const durationInSeconds = Math.floor(duration_ms / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;

    return {
      spotifyId: id,
      name: name,
      artists: artistNames,
      duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      images: images,
      audioFeatures: {},
    };
  });
  return extractedTracks;
}
