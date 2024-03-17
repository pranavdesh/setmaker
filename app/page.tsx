import Image from "next/image";
import {
  UserButton,
  auth,
  currentUser,
  clerkClient,
  SignInButton,
} from "@clerk/nextjs";
import TrackList from "@/components/TrackList";
import TopNav from "@/components/TopNav";

import HomePage from "@/components/HomePage";

export default async function Home() {
  const { userId } = auth();
  if (userId) {
    const OauthAccessToken = await clerkClient.users.getUserOauthAccessToken(
      userId!,
      "oauth_spotify"
    );

    return (
      <main className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <HomePage accessToken={OauthAccessToken[0].token} />
      </main>
    );
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col z-10 max-w-5xl w-full justify-between font-mono text-sm lg:flex">
          <h1 className="py-4 text-lg">Set Maker</h1>
          <div className="pb-4">
            <p className="italic underline ">Curate the perfect DJ set</p>
            <ul className="p-4 list-disc ">
              <li>Connect your Spotify account</li>
              <li>Sort songs by BPM, key, and more</li>
              <li>Export your set as a playlist back to Spotify</li>
            </ul>
          </div>
          <div>
            <SignInButton mode="modal">
              <button className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
                Sign in with Spotify
              </button>
            </SignInButton>
          </div>
        </div>
      </main>
    );
  }
}
