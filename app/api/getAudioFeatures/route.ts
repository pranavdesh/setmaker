import { NextResponse } from "next/server";

const delay = (seconds: number) =>
  new Promise((res) => setTimeout(res, seconds * 1000));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accessToken, trackIds } = body;

    const trackIdString = trackIds.join(",");

    let spotifyRes = await fetch(
      `https://api.spotify.com/v1/audio-features?ids=${trackIdString}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If the Spotify API returned a 429 (too many requests)
    if (spotifyRes.status === 429) {
      console.log(spotifyRes.headers.get("Retry-After"));
      const retryAfter = spotifyRes.headers.get("Retry-After"); // in seconds
      console.log("Rate limited at /getAudioFeatures", retryAfter);
      if (retryAfter) {
        // Pause execution for the duration specified by the Retry-After header
        console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
        await delay(parseInt(retryAfter));

        // Retry the request
        spotifyRes = await fetch(
          `https://api.spotify.com/v1/audio-features?ids=${trackIdString}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    }

    // Check again if Spotify API returned an error status code after retry
    if (!spotifyRes.ok) {
      const error = await spotifyRes.json();
      console.log("API error after retry", error);
      return new NextResponse(JSON.stringify(error), {
        status: spotifyRes.status,
      });
    }

    const tracksWithAllAudioFeatures = await spotifyRes.json();
    const tracksWithAudioFeatures =
      tracksWithAllAudioFeatures.audio_features.map((item: any) => ({
        key: item.key,
        bpm: Math.floor(item.tempo),
        id: item.id,
      }));
    // const audioFeatures: Track["audioFeatures"] = {
    //   key: allAudioFeatures.key,
    //   bpm: Math.floor(allAudioFeatures.tempo),
    // };

    return NextResponse.json(tracksWithAudioFeatures);
  } catch (error) {
    console.error("Unexpected error in POST:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}
