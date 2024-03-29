import React, {
  ReactElement,
  createContext,
  useContext,
  useReducer,
} from "react";
import Track from "@/interfaces/Track";
import { TrackRow } from "@/components/CreatePlaylistModalTable/columns";

type trackListState = {
  tracks: Track[];
  selectedTracks: TrackRow[];
  accessToken: string | undefined;
  userID: string;
};

type Action =
  | { type: "SET_TRACKS"; payload: Track[] }
  | { type: "SET_SELECTED_TRACKS"; payload: TrackRow[] }
  | { type: "SET_ACCESS_TOKEN"; payload: string | undefined }
  | { type: "SET_USER_ID"; payload: string };

function trackListReducer(state: trackListState, action: Action) {
  switch (action.type) {
    case "SET_TRACKS":
      return { ...state, tracks: action.payload };
    case "SET_SELECTED_TRACKS":
      return { ...state, selectedTracks: action.payload };
    case "SET_ACCESS_TOKEN":
      return { ...state, accessToken: action.payload };
    case "SET_USER_ID":
      return { ...state, userID: action.payload };
    default:
      return state;
  }
}

const initialState: trackListState = {
  tracks: [],
  selectedTracks: [],
  accessToken: "",
  userID: "",
};

export const TrackListContext = createContext<{
  state: trackListState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const TrackListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(trackListReducer, initialState);
  return (
    <TrackListContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackListContext.Provider>
  );
};
