import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import TopNav from "@/components/TopNav";
import TrackListPage from "@/components/TrackListPage";
import { redirect } from "next/navigation";

const Tracks = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/");
  }

  const OauthAccessToken = session!.accessToken;

  return (
    <div className="bg-gray-100 dark:bg-gray-200">
      <main className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-x-hidden max-w-screen-2xl mx-auto border-x-2 border-gray-200">
        <TopNav />
        <TrackListPage accessToken={OauthAccessToken} />
      </main>
    </div>
  );
};

export default Tracks;
