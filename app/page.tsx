import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignInButton from "@/components/SignInButton";

export default async function Page() {
  const session = await getServerSession(options);

  if (session) {
    redirect("/tracks");
  }

  return (
    // future: add code for landing page copy here
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
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
