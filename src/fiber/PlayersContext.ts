import { createContext } from "react";
const PlayerContext = createContext<RTCDataChannel | null>(null);
export default PlayerContext;