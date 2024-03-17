"use client";
import React, { useEffect, useState } from "react";
import TrackList from "@/components/TrackList";
import TopNav from "@/components/TopNav";
import { TrackListProvider } from "@/state/globalState";

interface Props {
  accessToken: string;
}

const HomePage = ({ accessToken }: Props) => {
  return (
    <div>
      <TopNav />
      <div className="flex flex-col font-mono text-sm lg:flex">
        <TrackListProvider>
          <TrackList accessToken={accessToken} />
        </TrackListProvider>
      </div>
    </div>
  );
};

export default HomePage;
