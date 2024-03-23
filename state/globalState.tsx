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

// const initialState: trackListState = {
//   tracks: [],
//   accessToken: "",
//   userID: "",
// };

// const trackListReducer = (state: trackListState, action: Action) => {
//   switch (action.type) {
//     case "SET_TRACKS":
//       return { ...state, tracks: action.payload };
//     case "SET_ACCESS_TOKEN":
//       return { ...state, accessToken: action.payload };
//     case "SET_USER_ID":
//       return { ...state, userID: action.payload };
//     default:
//       return state;
//   }
// };

// export const useTrackListContext = (initialState: trackListState) => {
//   const [state, dispatch] = useReducer(trackListReducer, initialState);

//   const setTracks = (tracks: Track[]) => {
//     dispatch({ type: "SET_TRACKS", payload: tracks });
//   };

//   const setAccessToken = (accessToken: string) => {
//     dispatch({ type: "SET_ACCESS_TOKEN", payload: accessToken });
//   };

//   const setUserID = (userID: string) => {
//     dispatch({ type: "SET_USER_ID", payload: userID });
//   };
//   return { state, setTracks, setAccessToken, setUserID };
// };

// export type UseTrackListContextType = ReturnType<typeof useTrackListContext>;

// const initContextState: UseTrackListContextType = {
//   state: initialState,
//   setTracks: () => {},
//   setAccessToken: () => {},
//   setUserID: () => {},
// };

// export const TrackListContext = createContext<
//   UseTrackListContextType | undefined
// >(initContextState);

// type childrenType = {
//   children?: ReactElement | undefined;
// };

// export const TrackListProvider = ({
//   children,
//   ...initialState
// }: childrenType & trackListState): ReactElement => {
//   const contextValue = useTrackListContext(initialState);
//   return (
//     <TrackListContext.Provider value={contextValue}>
//       {children}
//     </TrackListContext.Provider>
//   );
// };
