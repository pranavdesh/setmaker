"use client";
import React, { useEffect, useState } from "react";
import TrackList from "@/components/TrackList";
import { TrackListProvider } from "@/state/globalState";

interface Props {
  accessToken: string | undefined;
}

const TrackListPage = ({ accessToken }: Props) => {
  return (
    <div>
      <div className="flex flex-col font-mono text-sm lg:flex">
        <TrackListProvider>
          <TrackList accessToken={accessToken} />
        </TrackListProvider>
      </div>
    </div>
  );
};

export default TrackListPage;
