import { NextRequest, NextResponse } from "next/server";
const delay = (seconds: number) =>
  new Promise((res) => setTimeout(res, seconds * 1000));

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    let spotifyRes = await fetch(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (spotifyRes.status === 429) {
      const retryAfter = spotifyRes.headers.get("Retry-After"); // in seconds
      console.log("Rate limited at /getUserId", retryAfter);
      if (retryAfter) {
        // Pause execution for the duration specified by the Retry-After header
        console.log(`Rate limited. Retrying after ${retryAfter} seconds`);
        await delay(parseInt(retryAfter));

        // Retry the request
        spotifyRes = await fetch(`https://api.spotify.com/v1/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    }
    if (!spotifyRes.ok) {
      const error = await spotifyRes.json();
      return new NextResponse(JSON.stringify(error), {
        status: spotifyRes.status,
      });
    }

    const { id } = await spotifyRes.json();
    return NextResponse.json(id);
  } catch (error) {
    console.error("Unexpected error in POST:", error);
    return new NextResponse(JSON.stringify(error), {
      status: 500,
    });
  }
}
