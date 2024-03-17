import { TrackAudioFeatures } from "./TrackAudioFeatures";

export default interface Track {
  name: string;
  artists: string[];
  duration: number;
  spotifyId: string;
  audioFeatures: TrackAudioFeatures | null;
}
